import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, statSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { ChatStore, safeChatUrl } from '../src/store.mjs';
import { createRoutes, isTrusted } from '../src/routes.mjs';

const request = (method='POST', body={}, headers={}) => Object.assign(Readable.from([Buffer.from(JSON.stringify(body))]), { method, socket: {remoteAddress:'127.0.0.1'}, headers:{host:'localhost:1234',origin:'http://localhost:1234','content-type':'application/json','x-dsh-chat':'1',...headers} });
function fixture(t, send = async()=>({ messages:[],status:'complete' })) {
  const dir=mkdtempSync(join(tmpdir(),'dsh-chat-test-')); t.after(()=>rmSync(dir,{recursive:true,force:true}));
  const store=new ChatStore(dir); let calls=0;
  const engine={ status:async()=>({opened:false}),open:async()=>{},close:async()=>{},stop:async()=>{}, send:async input=>{calls++;return send(input);} };
  const app=createRoutes({store,engine});
  async function call(path,body={},method='POST',headers={}) {
    const route=app.routes.find(r=>r.path.endsWith('/'+path));
    let status;let value;
    const res={setHeader(){},writeHead(code){status=code},end(text){value=JSON.parse(text)}};
    await route.handler(request(method,body,headers),res);
    return {status,body:value};
  }
  return {store,dir,call,app,engine,calls:()=>calls};
}

test('host and origin guards reject lookalikes, cross-site and state-changing GET',t=>{
  assert.equal(isTrusted(request()),true);
  assert.equal(isTrusted(request('POST',{}, {host:'localhost.attacker.test:1234',origin:'http://localhost.attacker.test:1234'}),true),false);
  assert.equal(isTrusted(request('POST',{}, {origin:'https://attacker.test'}),true),false);
  assert.equal(isTrusted(request('POST',{}, {'x-dsh-chat':undefined}),true),false);
  assert.equal(isTrusted(request('POST',{}, {origin:undefined,'sec-fetch-site':undefined}),true),true);
  assert.equal(isTrusted(request('POST',{}, {origin:'null'}),true),false);
  assert.equal(isTrusted(request('POST',{}, {origin:undefined,'sec-fetch-site':'same-site'}),true),false);
  assert.equal(isTrusted(request('POST',{}, {origin:undefined,'content-type':'text/plain'}),true),false);
  assert.equal(isTrusted(request('GET',{}, {'sec-fetch-site':'cross-site'})),false);
});

test('Chat cannot send until experimental opt-in; never invokes DSH LLM',async t=>{
  const f=fixture(t); const c=f.store.create();
  assert.equal((await f.call('send',{id:c.id,text:'hello'})).status,400);
  assert.equal(f.calls(),0);
  assert.equal((await f.call('enable',{enabled:true})).status,200);
  assert.equal((await f.call('send',{id:c.id,text:'hello'},'GET')).status,405);
  assert.equal(f.calls(),0);
});

test('one manual attempt, concurrency guard, fixed conversation binding, no auto retry',async t=>{
  let resolve; const f=fixture(t,input=>new Promise(r=>{resolve=()=>r({url:'https://chat.deepseek.com/a/chat/s/abc123',turnMessages:[{role:'user',content:input.text},{role:'assistant',content:'ok'}],status:'complete'});}));
  const c=f.store.create(); await f.call('enable',{enabled:true});
  assert.equal((await f.call('send',{id:c.id,text:'one'})).status,202);
  assert.equal((await f.call('send',{id:c.id,text:'two'})).status,400);
  assert.equal((await f.call('new')).status,400);
  await new Promise(r=>setImmediate(r)); assert.equal(f.calls(),1); resolve();
  await new Promise(r=>setImmediate(r));
  assert.equal(f.store.get(c.id).url,'https://chat.deepseek.com/a/chat/s/abc123');
  assert.equal(f.store.get(c.id).messages[1].content,'ok');
});

test('uncertain sends stay visible, cannot silently re-send, persist privately',async t=>{
  const f=fixture(t,async()=>{throw Error('验证码；发送未确认')}); const c=f.store.create();
  await f.call('enable',{enabled:true}); await f.call('send',{id:c.id,text:'hello'});
  await new Promise(r=>setImmediate(r));
  assert.equal(f.calls(),1); assert.equal(f.store.get(c.id).status,'error');
  assert.equal((await f.call('send',{id:c.id,text:'retry'})).status,400);
  const loaded=new ChatStore(f.dir); assert.equal(loaded.get(c.id).error,'验证码；发送未确认');
  assert.equal(statSync(loaded.file).mode & 0o777,0o600);
  assert.equal(statSync(f.dir).mode & 0o777,0o700);
});

test('restart marks interrupted stream partial and keeps modes disabled',async t=>{
  const f=fixture(t); const c=f.store.create(); f.store.begin(c.id,'pending');
  assert.equal(new ChatStore(f.dir).get(c.id).status,'partial');
  assert.equal((await f.call('state',{},'GET')).body.enabled,false);
});

test('history selection and delete are local, remote URLs never accepted from requests',async t=>{
  const f=fixture(t); const a=f.store.create(),b=f.store.create();
  await f.call('select',{id:a.id}); assert.equal(f.store.view().activeId,a.id);
  await f.call('delete',{id:a.id}); assert.equal(f.store.view().activeId,b.id);
  assert.equal(f.calls(),0);
  for(const url of ['https://chat.deepseek.com.evil.test/a/chat/s/1','https://chat.deepseek.com/a/chat/s/1?token=secret','http://chat.deepseek.com/a/chat/s/1','https://user:pass@chat.deepseek.com/a/chat/s/1']) assert.throws(()=>safeChatUrl(url));
});


test('viewport snapshots cannot truncate durable history',async t=>{
  const f=fixture(t,async({text})=>({url:'https://chat.deepseek.com/a/chat/s/known',messages:[{role:'assistant',content:'only last visible item'}],turnMessages:[{role:'user',content:text},{role:'assistant',content:'new response'}],status:'complete'}));
  const c=f.store.create();c.url='https://chat.deepseek.com/a/chat/s/known';c.messages=[{role:'user',content:'old question'},{role:'assistant',content:'old answer'}];f.store.save();
  await f.call('enable',{enabled:true});await f.call('send',{id:c.id,text:'new question'});await new Promise(r=>setImmediate(r));
  assert.deepEqual(f.store.get(c.id).messages.map(m=>m.content),['old question','old answer','new question','new response']);
});

test('old browser launch logs are shortened in state without changing user messages', t=>{
  const f=fixture(t);const c=f.store.create();
  const userText='Please explain ProcessSingleton';c.messages=[{role:'user',content:userText}];
  f.store.fail(c.id,'browserType.launchPersistentContext: [pid=123] ProcessSingleton /Users/private/person/browser-profile');
  const view=f.store.view().chats[0];
  assert.match(view.error,/专用 Chrome/);
  assert.doesNotMatch(view.error,/\/Users\/|pid=|ProcessSingleton/);
  assert.equal(view.messages[0].content,userText);
});

test('sync restores the pending turn and preserves prior local history without sending',async t=>{
  const f=fixture(t);const c=f.store.create();c.url='https://chat.deepseek.com/a/chat/s/test';
  c.messages=[{role:'user',content:'old'},{role:'assistant',content:'old answer'},{role:'user',content:'pending'}];c.status='partial';f.store.save();
  let synced=0;f.engine.sync=async input=>{synced++;assert.equal(input.url,c.url);return {url:c.url,status:'complete',turnMessages:[{role:'user',content:input.text},{role:'assistant',content:'existing website reply'}]};};
  assert.equal((await f.call('sync',{id:c.id})).status,400);
  await f.call('enable',{enabled:true});assert.equal((await f.call('sync',{id:c.id,url:'https://attacker.test/'})).status,200);
  assert.equal(synced,1);assert.equal(f.calls(),0);assert.equal(c.status,'complete');
  assert.deepEqual(c.messages.map(m=>m.content),['old','old answer','pending','existing website reply']);
});
