import { build } from 'esbuild';
import { mkdir, copyFile, readFile, writeFile } from 'node:fs/promises';
await mkdir('lib', { recursive: true });
await build({ entryPoints: ['src/index.mjs'], outfile: 'lib/index.js', bundle: true, format: 'esm', platform: 'node', target: 'node22', legalComments: 'eof', banner: { js: '/* Community adaptation of dsh-autonomy 0.1.5 (MIT); see LICENSE and NOTICE. */' } });
const host = await readFile('lib/index.js', 'utf8');
await writeFile('lib/index.js', host.replace(/^[ \t]+$/gm, ''));
await copyFile('src/client.cjs', 'lib/client.cjs');
const notices = [];
for (const pkg of ['@deepseek-ai/schemastery', '@deepseek-ai/cosmokit', 'zod']) {
  let license;
  for (const file of ['LICENSE', 'LICENSE.md', 'LICENSE.txt']) {
    try { license = await readFile('node_modules/' + pkg + '/' + file, 'utf8'); break; } catch {}
  }
  if (!license) throw Error('Missing dependency license: ' + pkg);
  notices.push(pkg + '\n' + license);
}
await writeFile('THIRD-PARTY-NOTICES.txt', notices.join('\n\n---\n\n').trimEnd() + '\n');
console.log('Built standalone autonomy host and client; no runtime npm dependencies.');
