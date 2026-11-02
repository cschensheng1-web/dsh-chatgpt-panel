import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';
import { readFileSync } from 'node:fs';
import { build } from 'esbuild';

export async function startPreview({port=4318}={}) {
  const bundle=await build({entryPoints:['scripts/preview-client.jsx'],bundle:true,write:false,format:'iife',platform:'browser'});
  const server=createServer((req,res)=>{
    if(req.url==='/client.js'){res.writeHead(200,{'content-type':'application/javascript'});return res.end(bundle.outputFiles[0].text);}
    if(req.url==='/production-client.js'){res.writeHead(200,{'content-type':'application/javascript'});return res.end(readFileSync('lib/client.js'));}
    if(req.url!=='/'){res.writeHead(404);return res.end();}
    res.writeHead(200,{'content-type':'text/html;charset=utf-8'});
    res.end('<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DSH 内嵌插件开发预览</title><style>html,body{margin:0;height:100%;font:14px system-ui;background:#fff;color:#202124}body{display:flex;flex-direction:column}#notice{padding:6px 18px;background:#eef3ff;font-size:12px}#shell{display:flex;flex:1;min-height:0}#nav{width:160px;padding:16px;background:#f4f4f4}#nav button{border:0;background:#e6e6e6;padding:12px;border-radius:10px;cursor:pointer}#main{min-width:0;flex:1;display:flex;flex-direction:column}</style><div id="notice">开发预览 · 真实内嵌官网仅在 DSH Desktop 提供</div><div id="shell"><nav id="nav"></nav><main id="main"></main></div><script src="/client.js"></script><script src="/production-client.js"></script></html>');
  });
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});
  return {server,url:`http://127.0.0.1:${server.address().port}`,close:()=>new Promise(resolve=>server.close(resolve))};
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href){
  const preview=await startPreview();console.log(`Preview: ${preview.url} (local only)`);
  process.on('SIGINT',async()=>{await preview.close();process.exit(0);});
}
