import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { startPreview } from './preview.mjs';
import { mkdirSync } from 'node:fs';
const preview=await startPreview({port:0});
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
  const context=await browser.newContext({viewport:{width:1360,height:900}});
  const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  let state={chats:[],activeId:null,busy:false,enabled:false,browserOpen:false};
  let sends=0;let failSend=false;const mutations=[];
  await page.route('**/api/dsh-chatgpt-panel/**',async route=>{
    const req=route.request();const path=new URL(req.url()).pathname.split('/').pop();
    if(req.method()==='GET')return route.fulfill({json:state});
    const body=req.postDataJSON();mutations.push(path);
    assert.equal(req.headers()['x-dsh-chat'],'1');
    if(path==='new') {const c={id:'fixture-new',title:'新对话',updatedAt:Date.now(),url:null,messages:[],status:'idle'};state={...state,chats:[c,...state.chats],activeId:c.id};return route.fulfill({json:c});}
    if(path==='enable')state.enabled=body.enabled;
    if(path==='send') {sends++;assert.equal(body.id,'fixture-new');if(failSend)return route.fulfill({status:400,json:{error:'本地夹具：发送未确认'}});state.chats[0].messages=[{role:'user',content:body.text},{role:'assistant',content:'### 测试回复\n\n```js\nconsole.log("你好");\n```\n\n- 一条列表\n- 另一条列表\n\n<script>window.__unsafe=1</script><img src=x onerror="window.__unsafe=2">[危险](javascript:alert(1))'}];state.chats[0].title='界面测试示例';state.chats[0].status='complete';}
    if(path==='stop'){state.busy=false;state.chats[0].status='complete';}
    if(path==='delete'){state.chats=state.chats.filter(c=>c.id!==body.id);state.activeId=state.chats[0]?.id??null;}
    return route.fulfill({json:{ok:true}});
  });
  await page.goto(preview.url);
  await page.getByRole('button',{name:'连接设置',exact:true}).click();
  await page.getByRole('checkbox',{name:'启用实验性网页聊天连接'}).click();
  await page.waitForFunction(()=>document.querySelector('.dcp-enable input')?.checked===true);
  await page.getByLabel('聊天消息',{exact:true}).fill('测试输入法');
  await page.getByLabel('聊天消息',{exact:true}).dispatchEvent('keydown',{key:'Enter',code:'Enter',isComposing:true,bubbles:true});
  assert.equal(sends,0);
  await page.getByRole('button',{name:'关闭设置',exact:true}).click();
  await page.getByLabel('聊天消息',{exact:true}).press('Enter');
  await page.getByRole('heading',{name:'测试回复'}).waitFor();
  assert.equal(sends,1);
  assert.equal(await page.locator('.dcp-markdown img, .dcp-markdown script, .dcp-markdown a[href^="javascript:"]').count(),0);
  assert.equal(await page.evaluate(()=>window.__unsafe),undefined);
  assert.equal(await page.getByRole('button',{name:'复制代码',exact:true}).count(),1);
  await page.getByLabel('聊天消息',{exact:true}).fill('草稿应保留');
  await page.waitForTimeout(850);
  assert.equal(await page.getByLabel('聊天消息',{exact:true}).inputValue(),'草稿应保留');
  failSend=true;
  await page.getByRole('button',{name:'发送消息',exact:true}).click();
  await page.getByRole('alert').filter({hasText:'本地夹具：发送未确认'}).waitFor();
  assert.equal(await page.getByLabel('聊天消息',{exact:true}).inputValue(),'草稿应保留');
  state.busy=true;state.chats[0].status='streaming';
  state.chats[0].messages[1].content='正在逐步显示的本地测试回复';
  await page.getByText('正在逐步显示的本地测试回复',{exact:true}).waitFor();
  await page.getByRole('button',{name:'停止回复',exact:true}).click();
  await page.waitForFunction(()=>!document.querySelector('.dcp-send.is-stop'));
  assert.ok(mutations.includes('stop'));
  state.chats[0].messages[0].content='帮我整理一下插件开发方案';
  state.chats[0].messages[1].content='### 可以这样安排\n\n1. 先核实桌面版插件接口。\n2. 完成聊天历史与消息布局。\n3. 用本地测试页面检查交互。\n\n```js\nconsole.log("你好，DeepSeek");\n```\n\n真实网页登录和聊天还需要在你的客户端中验证。';
  state.chats[0].title='讨论插件开发方案';
  await page.getByRole('heading',{name:'可以这样安排'}).waitFor();
  mkdirSync('docs/screenshots',{recursive:true});
  if(await page.getByRole('button',{name:'关闭错误提示',exact:true}).count())await page.getByRole('button',{name:'关闭错误提示',exact:true}).click();
  await page.getByLabel('聊天消息',{exact:true}).fill('');
  await page.screenshot({path:'docs/screenshots/chat-preview.png'});
  await page.getByLabel('返回 DSH 原生 Agent',{exact:true}).click();
  await page.getByText('这是开发预览中的 Agent 占位。安装到 DSH 后，此按钮返回原生 Agent 对话。').waitFor();
  await page.getByRole('button',{name:'返回 Chat 预览',exact:true}).click();
  await page.setViewportSize({width:560,height:800});
  await page.getByRole('button',{name:'打开历史记录',exact:true}).click();
  await page.getByLabel('搜索本地聊天历史',{exact:true}).fill('插件开发');
  assert.equal(await page.locator('.dcp-history-select').count(),1);
  assert.deepEqual(errors,[]);
  console.log('UI PASS: default gate, IME, new-before-send, CSRF header, safe Markdown/code, draft preservation, failed send, streaming update/stop, Agent return, narrow history. Local fixtures only.');
} finally {await browser.close();await preview.close();}
