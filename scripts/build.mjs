import { build } from 'esbuild';
import { mkdirSync, writeFileSync } from 'node:fs';
mkdirSync('lib', { recursive: true });
const out = await build({ entryPoints: ['src/client.jsx'], bundle: true, write: false, format: 'cjs', platform: 'browser', target: ['chrome120'], external: ['react', 'react-dom', 'react-dom/client'], loader: { '.css': 'text' }, minify: false, legalComments: 'eof' });
const code = out.outputFiles[0].text;
writeFileSync('lib/client.js', `/* dsh-chatgpt-panel; built from src/client.jsx */\nwindow.__ModuleLoader__.load({id:'dsh-chatgpt-panel',factory:(require)=>{const module={exports:{}};const exports=module.exports;\n${code}\nreturn module.exports;}});\n`);
console.log('Built lib/client.js');
