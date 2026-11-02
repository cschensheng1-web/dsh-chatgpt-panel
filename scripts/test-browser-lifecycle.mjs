// Real visible Chrome, temporary empty profiles, and blank local pages only.
// No DeepSeek request, login, stored personal profile, or message submission.
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright-core';
import { DeepSeekWebEngine } from '../src/engine.mjs';

const dir = await mkdtemp(join(tmpdir(), 'dsh-real-browser-lifecycle-'));
const engine = new DeepSeekWebEngine({ profileDir: join(dir, 'engine') });
let external;
let contender;
try {
  await Promise.all([engine._ensureBrowser(), engine._ensureBrowser()]);
  const context = engine.context;
  const first = engine.page;
  const extra = await context.newPage();
  await first.close();
  await engine._ensureBrowser();
  assert.equal(engine.context, context);
  assert.equal(engine.page, extra);
  await engine.page.setContent('<title>Local lifecycle test</title><p>Local fixture</p>');
  console.log('PASS closing the tracked tab reuses the original Chrome context');

  await engine.page.close();
  await engine._ensureBrowser();
  assert.equal(engine.page.isClosed(), false);
  console.log('PASS closing the last tab permits a valid page without profile conflict');

  const old = engine.context;
  const closing = engine.close();
  const reopening = engine._ensureBrowser();
  await Promise.all([closing, reopening]);
  assert.notEqual(engine.context, old);
  assert.equal(engine.page.isClosed(), false);
  console.log('PASS a concurrent reopen waits for Chrome shutdown');
  await engine.close();

  const occupiedProfile = join(dir, 'occupied');
  external = await chromium.launchPersistentContext(occupiedProfile, { channel: 'chrome', headless: false, chromiumSandbox: true });
  contender = new DeepSeekWebEngine({ profileDir: occupiedProfile });
  await assert.rejects(contender.open(), error => {
    assert.match(error.message, /专用 Chrome 窗口仍在使用中/);
    assert.doesNotMatch(error.message, /ProcessSingleton|pid=|\/Users\/|Call log:/);
    return true;
  });
  assert.equal(await external.pages()[0].evaluate(() => 42), 42);
  console.log('PASS an externally occupied test profile returns a concise error and preserves its browser');
  console.log('4 real visible-Chrome lifecycle checks passed; no website or chat was used.');
} finally {
  await contender?.close();
  await engine.close();
  await external?.close();
  await rm(dir, { recursive: true, force: true });
}
