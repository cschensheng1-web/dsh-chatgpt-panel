import test from 'node:test';
import assert from 'node:assert/strict';
import { EmbeddedBrowser, hasEmbeddedBrowser } from '../src/embedded-browser.mjs';

class View extends EventTarget {
  constructor(){ super(); this.attributes=new Map();this.loads=[];this.removed=false; }
  setAttribute(name,value){this.attributes.set(name,value);}
  async loadURL(url){this.loads.push(url);}
  remove(){this.removed=true;}
  reload(){this.reloaded=true;}
  canGoBack(){return true;}
  goBack(){this.wentBack=true;}
}
function fixture(acquire){
  const view=new View();const states=[];const releases=[];let popup;let unsubscribed=false;
  const bridge={acquire:acquire??(async()=>({lease:'lease-test',partition:'dsh-sidebar-browser-test'})),release:async id=>{releases.push(id);},onOpenRequested:(id,fn)=>{popup=fn;return()=>{unsubscribed=true;};}};
  const host={appendChild(v){assert.equal(v,view);}};
  const controller=new EmbeddedBrowser({bridge,document:{createElement(tag){assert.equal(tag,'webview');return view;}},onState:s=>states.push(s)});
  return {controller,bridge,host,view,states,releases,popup:url=>popup(url),unsubscribed:()=>unsubscribed};
}

test('embedded carrier uses only an approved isolated lease and loads the official site',async()=>{
  const f=fixture();await f.controller.mount(f.host);
  assert.equal(f.view.attributes.get('partition'),'dsh-sidebar-browser-test');
  assert.equal(f.view.attributes.get('src'),'about:blank#lease-test');
  for(const attr of ['preload','nodeintegration','disablewebsecurity','useragent','webpreferences'])assert.equal(f.view.attributes.has(attr),false);
  f.view.dispatchEvent(new Event('dom-ready'));await Promise.resolve();
  assert.deepEqual(f.view.loads,['https://chat.deepseek.com/']);
  f.view.dispatchEvent(new Event('dom-ready'));assert.equal(f.view.loads.length,1);
  await f.controller.dispose();assert.deepEqual(f.releases,['lease-test']);assert.equal(f.unsubscribed(),true);
});

test('a pending lease is released if the panel is closed before it arrives',async()=>{
  let resolve;const f=fixture(()=>new Promise(r=>{resolve=r;}));
  const mounting=f.controller.mount(f.host);const closing=f.controller.dispose();
  resolve({lease:'late-lease',partition:'dsh-late'});await Promise.all([mounting,closing]);
  assert.deepEqual(f.releases,['late-lease']);assert.equal(f.controller.view,null);
});

test('popup navigation stays embedded and rejects unsafe protocols and credentials',async()=>{
  const f=fixture();await f.controller.mount(f.host);f.view.dispatchEvent(new Event('dom-ready'));await Promise.resolve();
  f.popup('https://example.org/sign-in');f.popup('javascript:alert(1)');f.popup('file:///private/file');f.popup('https://user:pass@example.org');
  assert.deepEqual(f.view.loads,['https://chat.deepseek.com/','https://example.org/sign-in']);await f.controller.dispose();
});

test('load errors remain readable and an unsupported host fails without opening another browser',async()=>{
  const f=fixture();await f.controller.mount(f.host);
  const fail=new Event('did-fail-load');Object.assign(fail,{isMainFrame:true,errorCode:-105,errorDescription:'secret path'});f.view.dispatchEvent(fail);
  assert.match(f.states.at(-1).error,/官网暂时未能加载/);assert.doesNotMatch(f.states.at(-1).error,/secret/);
  assert.equal(hasEmbeddedBrowser({}),false);
  const unsupported=new EmbeddedBrowser({bridge:{},document:{}});await assert.rejects(unsupported.mount({}),/Mac 桌面版/);
  await f.controller.dispose();
});

test('a failed attachment releases the acquired lease',async()=>{
 const f=fixture();await assert.rejects(f.controller.mount({appendChild(){throw Error('attachment failed');}}),/attachment failed/);
 assert.deepEqual(f.releases,['lease-test']);assert.equal(f.controller.view,null);
});

test('reload is only available after guest readiness and invokes the actual guest reload',async()=>{
 const f=fixture();await f.controller.mount(f.host);
 assert.equal(f.controller.reload(),false);assert.equal(f.view.reloaded,undefined);
 f.view.dispatchEvent(new Event('dom-ready'));await Promise.resolve();
 assert.equal(f.controller.reload(),true);assert.equal(f.view.reloaded,true);
 assert.equal(f.states.at(-1).loading,true);
 f.view.dispatchEvent(new Event('did-stop-loading'));assert.equal(f.states.at(-1).loading,false);
 await f.controller.dispose();assert.equal(f.controller.reload(),false);
});
