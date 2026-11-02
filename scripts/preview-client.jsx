import React from 'react';
import { createRoot } from 'react-dom/client';
const entries = new Map();
const disposers=[];
const main=createRoot(document.getElementById('main'));
const nav=document.getElementById('nav');
const ctx={
  effect(fn){const d=fn();if(typeof d==='function')disposers.push(d);return d;},
  slots:{ inject(name,fn){return fn();}, register(meta,Comp){
    if(meta.name==='main')entries.set(meta.key,Comp);
    else {const button=document.createElement('button');button.textContent='◌ '+meta.label();button.onclick=()=>ctx.layout.selectPanel(meta.id);nav.append(button);return()=>button.remove();}
    return()=>entries.delete(meta.key);
  }},
  layout:{selectPanel(id){if(id===null)main.render(<div style={{padding:48}}>这是开发预览中的 Agent 占位。安装到 DSH 后，此按钮返回原生 Agent 对话。<p><button onClick={()=>ctx.layout.selectPanel('dsh-chatgpt-panel')}>返回 Chat 预览</button></p></div>);else {const C=entries.get(id);main.render(<C/>);}}}
};
window.__ModuleLoader__={load({id,factory}) {
  if(id!=='dsh-chatgpt-panel')throw Error('Unexpected plugin');
  const plugin=factory(name=>{if(name==='react')return React;throw Error('Unexpected require '+name);});
  plugin.apply(ctx);
  ctx.layout.selectPanel('dsh-chatgpt-panel');
}};
