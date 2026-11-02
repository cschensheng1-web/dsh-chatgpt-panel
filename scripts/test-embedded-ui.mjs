import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { startPreview } from './preview.mjs';
const preview=await startPreview({port:0});
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1200,height:800}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const mutations=[];
 await page.route('**/api/dsh-chatgpt-panel/**',async route=>{
  const req=route.request();const name=new URL(req.url()).pathname.split('/').pop();
  if(req.method()==='GET')return route.fulfill({json:{chats:[],activeId:null,busy:false,enabled:false,browserOpen:false}});
  mutations.push(name);assert.equal(name,'enable');assert.deepEqual(req.postDataJSON(),{enabled:false});
  return route.fulfill({json:{ok:true}});
 });
 await page.addInitScript(()=>{
  window.__embeddedFixture={acquired:[],released:[],loaded:[]};
  window.dshDesktop={browser:{
   acquire:async key=>{window.__embeddedFixture.acquired.push(key);return {lease:'fixture-'+window.__embeddedFixture.acquired.length,partition:'memory-fixture'};},
   release:async lease=>{window.__embeddedFixture.released.push(lease);},
   onOpenRequested:()=>()=>{},
  }};
  const create=document.createElement.bind(document);
  document.createElement=function(name,...args){
   const node=create(name,...args);
   if(name.toLowerCase()==='webview'){
    node.loadURL=async url=>{window.__embeddedFixture.loaded.push(url);node.setAttribute('data-fixture-url',url);node.dispatchEvent(new Event('did-navigate'));node.dispatchEvent(new Event('did-stop-loading'));};
    node.reload=()=>{};node.canGoBack=()=>false;
    const observer=new MutationObserver(()=>{if(node.isConnected){observer.disconnect();node.dispatchEvent(new Event('dom-ready'));}});
    observer.observe(document,{childList:true,subtree:true});
   }
   return node;
  };
 });
 await page.goto(preview.url);
 await page.locator('webview[data-fixture-url="https://chat.deepseek.com/"]').waitFor();
 assert.equal(await page.getByRole('region',{name:'DSH 内嵌官网聊天',exact:true}).count(),1);
 for(const attr of ['nodeintegration','preload','disablewebsecurity','useragent'])assert.equal(await page.locator('webview').getAttribute(attr),null);
 await page.getByRole('button',{name:'返回 DSH 对话',exact:true}).click();
 await page.getByText('这是开发预览中的 Agent 占位。安装到 DSH 后，此按钮返回原生 Agent 对话。').waitFor();
 await page.waitForFunction(()=>window.__embeddedFixture.released.length===1);
 await page.getByRole('button',{name:'返回 Chat 预览',exact:true}).click();
 await page.locator('webview[data-fixture-url]').waitFor();
 await page.getByText('其他选项',{exact:true}).click();
 await page.getByRole('button',{name:'查看旧版面板记录（Chrome 方案）',exact:true}).click();
 await page.getByRole('button',{name:'在 DSH 内聊天',exact:true}).waitFor();
 await page.getByRole('button',{name:'在 DSH 内聊天',exact:true}).click();
 await page.locator('webview[data-fixture-url]').waitFor();
 assert.deepEqual(await page.evaluate(()=>window.__embeddedFixture.acquired),Array(3).fill('plugin:dsh-chatgpt-panel:official'));
 assert.ok(mutations.length>0);assert.ok(!mutations.includes('open'));assert.deepEqual(errors,[]);
 console.log('Embedded UI PASS: default native view, isolated guest bootstrap, Agent return, guest cleanup, legacy switch, no external Chrome launch. Local fixtures only.');
} finally {await browser.close();await preview.close();}
