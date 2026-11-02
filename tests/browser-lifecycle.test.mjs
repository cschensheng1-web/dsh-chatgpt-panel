import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { mkdtemp, rm, readFile, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DeepSeekWebEngine } from '../src/engine.mjs';
import { displayChatError } from '../src/browser-errors.mjs';

class Page {
  constructor(url = 'about:blank') { this.address = url; this.closed = false; }
  isClosed() { return this.closed; }
  url() { return this.address; }
  async goto(url) { this.address = url; }
  async bringToFront() {}
  async evaluate() { return { url: this.address, title: 'Fixture', messages: [], composer: null, stopPresent: false, blocked: false }; }
}
class Context extends EventEmitter {
  constructor(pages = [new Page()]) { super(); this.items = pages; this.closed = false; this.newPages = 0; this.closeGate = null; }
  pages() { return this.items.filter(page => !page.closed); }
  async newPage() {
    if (this.closed) throw Error('Target page, context or browser has been closed');
    this.newPages++; const page = new Page(); this.items.push(page); return page;
  }
  async close() {
    await this.closeGate;
    this.closed = true; for (const page of this.items) page.closed = true;
    this.emit('close');
  }
}
async function fixture(t, options = {}) {
  const profileDir = await mkdtemp(join(tmpdir(), 'dsh-browser-lifecycle-'));
  const contexts = [];
  const engine = new DeepSeekWebEngine({ profileDir, _launchBrowser: async () => { const context = new Context(); contexts.push(context); return context; }, ...options });
  t.after(async () => { await engine.close(); await rm(profileDir, { recursive: true, force: true }); });
  return { engine, profileDir, contexts };
}

test('repeated open and send setup share one launch', async t => {
  let finishLaunch; let launched;
  const started = new Promise(resolve => { launched = resolve; });
  let launches = 0;
  const { engine } = await fixture(t, { _launchBrowser: async () => { launches++; launched(); return new Promise(resolve => { finishLaunch = () => resolve(new Context()); }); } });
  const first = engine.open(); await started;
  const second = engine.open();
  finishLaunch(); await Promise.all([first, second]);
  await engine._ensureBrowser();
  assert.equal(launches, 1);
});

test('closing the tracked tab reuses another official tab in the same browser', async t => {
  const { engine, contexts } = await fixture(t);
  await engine.open();
  const previous = engine.page;
  const next = new Page('https://chat.deepseek.com/');
  contexts[0].items.push(next); previous.closed = true;
  await engine.open();
  assert.equal(contexts.length, 1);
  assert.equal(engine.page, next);
});

test('a missing tracked tab creates a page in the live context, not a second Chrome', async t => {
  const { engine, contexts } = await fixture(t);
  await engine.open(); engine.page.closed = true;
  await engine.open();
  assert.equal(contexts.length, 1);
  assert.equal(contexts[0].newPages, 1);
  assert.equal(engine.page.isClosed(), false);
});

test('a closed context is released before a replacement starts', async t => {
  const { engine, contexts } = await fixture(t);
  await engine.open();
  const previous = contexts[0];
  previous.items[0].closed = true; previous.closed = true;
  await engine.open();
  assert.equal(contexts.length, 2);
  assert.equal(engine.context, contexts[1]);
});

test('open waits until a concurrent close has released the profile', async t => {
  const { engine, contexts } = await fixture(t);
  await engine.open();
  let finishClose;
  contexts[0].closeGate = new Promise(resolve => { finishClose = resolve; });
  const closing = engine.close();
  const opening = engine.open();
  await Promise.resolve(); await Promise.resolve();
  assert.equal(contexts.length, 1);
  finishClose(); await Promise.all([closing, opening]);
  assert.equal(contexts.length, 2);
  assert.equal(contexts[0].closed, true);
  assert.equal((await engine.status()).opened, true);
});

test('another plugin instance cannot start Chrome against an owned profile', async t => {
  const { engine, contexts, profileDir } = await fixture(t);
  await engine.open();
  let launches = 0;
  const other = new DeepSeekWebEngine({ profileDir, _launchBrowser: async () => { launches++; return new Context(); } });
  t.after(() => other.close());
  await assert.rejects(other.open(), /另一个实例/);
  assert.equal(launches, 0);
  await engine.close(); await other.open();
  assert.equal(launches, 1); assert.equal(contexts[0].closed, true);
});

test('context close event clears stale browser state and permits reopening', async t => {
  const { engine, contexts } = await fixture(t);
  await engine.open(); await contexts[0].close();
  assert.equal((await engine.status()).opened, false);
  await engine.open(); assert.equal(contexts.length, 2);
});

test('profile conflicts give concise errors without leaking launch logs or retrying', async t => {
  let launches = 0;
  const raw = 'browserType.launchPersistentContext: [pid=123] ProcessSingleton failed /Users/private/person/browser-profile';
  const { engine } = await fixture(t, { _launchBrowser: async () => { launches++; throw Error(raw); } });
  await assert.rejects(engine.open(), error => {
    assert.match(error.message, /专用 Chrome 窗口仍在使用中/);
    assert.doesNotMatch(error.message, /\/Users\/|pid=|ProcessSingleton/);
    return true;
  });
  assert.equal(launches, 1);
  const response = await engine.send({ text: 'not submitted', url: null });
  assert.equal(launches, 2, 'one new manual send causes one attempt, never retries');
  assert.equal(response.status, 'partial');
  assert.match(response.reason, /专用 Chrome/);
  assert.doesNotMatch(response.reason, /\/Users\/|pid=|ProcessSingleton/);
  assert.match(displayChatError(raw), /专用 Chrome/);
});

test('existing browser preferences are never replaced during a new launch attempt', async t => {
  const { engine, profileDir } = await fixture(t);
  await mkdir(join(profileDir, 'Default'));
  const path = join(profileDir, 'Default', 'Preferences');
  const original = '{"credentials_enable_service":false,"fixture":"keep"}';
  await writeFile(path, original);
  await engine.open();
  assert.equal(await readFile(path, 'utf8'), original);
});
