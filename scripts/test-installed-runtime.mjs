// Offline check with the installed DSH runtime; use the DSH Electron binary.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import * as panel from '../src/index.mjs';
const base = '/Applications/DeepSeek Harness.app/Contents/Resources/app.asar/dsh';
const require = createRequire(base + '/package.json');
const load = name => import(pathToFileURL(require.resolve(name)).href);
const { Context } = await load('@deepseek-ai/cordis');
const { LlmRuntime, LlmAdapter } = await load('@deepseek-ai/dsh-llm');
const ctx = new Context();
const seen = [];
class OfflineAdapter extends LlmAdapter {
  providerInfo(id) { return { id, name: 'Offline fixture only' }; }
  async resolveModel(provider, model) { return { provider, id: model, name: model, toolUpdate: 'addition-only' }; }
  async *stream(options) {
    seen.push(options);
    assert.ok(options.tools.some(t => t.deferLoading !== true));
    yield { type: 'text-delta', index: 0, text: 'offline-ok' };
    yield { type: 'finish', reason: { kind: 'stop' } };
  }
}
try {
  await ctx.plugin(LlmRuntime);
  ctx.llm.registerAdapter(['offline-fixture'], new OfflineAdapter());
  await ctx.plugin(panel);
  assert.ok(ctx.allDeferredToolsGuard, 'compatibility service mounted through actual panel entry');
  const tool = name => ({ name, description: 'fixture', parameters: { type: 'object', properties: {} } });
  const tools = [tool('read_fixture')];
  const request = { provider: 'offline-fixture', model: 'fixture', messages: [{ id: 'change', role: 'developer', content: [{ type: 'tool-removal', toolName: 'run_code' }, { type: 'tool-addition', toolName: 'read_fixture' }] }], tools, toolHistory: { tools: [tool('run_code')], updates: [{ messageId: 'change', additions: tools }] } };
  const before = JSON.stringify(request);
  const chunks = [];
  for await (const chunk of ctx.llm.stream(request)) chunks.push(chunk);
  assert.equal(chunks[0].text, 'offline-ok');
  assert.equal(seen.length, 1, 'only one offline adapter dispatch');
  assert.equal(JSON.stringify(request), before);
  assert.equal(ctx.allDeferredToolsGuard.snapshot().repaired.predicted, 1);
  const version = require(base + '/node_modules/@deepseek-ai/dsh-llm/package.json').version;
  console.log(JSON.stringify({ actualDshRuntime: version, actualPanelMounted: true, guardedDispatches: seen.length, originalRequestUnchanged: true, networkRequests: 0, paidModelCalls: 0 }));
} finally {
  // All services and the fixture adapter live only in this short-lived process.
}
