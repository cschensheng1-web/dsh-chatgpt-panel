// Browser-only fixture checks. This headless Chrome is used exclusively for
// local synthetic HTML. Production engine.mjs always uses a visible Chrome.
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { normalizeDomSnapshot, readVisibleDom } from '../src/dom-snapshot.mjs';

const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-background-networking'] });
const context = await browser.newContext({ serviceWorkers: 'block' });
let blockedRequests = 0;
await context.route('**/*', async route => { blockedRequests++; await route.abort(); });
const page = await context.newPage();
const tests = [];
async function fixture(name, body, check) {
  await page.setContent(`<!doctype html><html><head><title>Fixture - DeepSeek</title></head><body>${body}</body></html>`);
  const snapshot = normalizeDomSnapshot(await page.evaluate(readVisibleDom));
  await check(snapshot);
  tests.push(name);
  console.log(`PASS ${name}`);
}
const composer = '<textarea id="chat-input" placeholder="给 DeepSeek 发送消息"></textarea>';

try {
  await fixture('rendered roles, stable keys, Markdown/code/lists and terminal controls', `
    <div data-virtual-list-item-key="u-old"><div class="ds-collapsible-text"><p>Old question</p></div><button>Copy</button></div>
    <div data-virtual-list-item-key="a-old"><div class="ds-assistant-message-main-content ds-markdown"><p>Old answer</p></div></div>
    <div data-virtual-list-item-key="u-new"><div class="ds-collapsible-text"><p>First paragraph</p><p>Second paragraph</p></div></div>
    <div data-virtual-list-item-key="a-new" data-status="complete">
      <div class="ds-assistant-message-main-content ds-markdown">
        <h2>Answer</h2><p>A <strong>safe</strong> answer.</p>
        <pre><code class="language-js">const answer = 42;\n  console.log(answer);</code><button class="ds-markdown-code-copy-button">COPY_SECRET</button></pre>
        <ul><li>First item</li><li>Second item</li></ul>
        <a href="javascript:alert(1)">Unsafe link</a><a href="https://example.org/docs">Docs</a>
        <script type="text/plain">SCRIPT_SECRET</script>
        <span style="display:none">HIDDEN_SECRET</span>
      </div>
      <button aria-label="Regenerate">Regenerate</button>
    </div>${composer}`, value => {
    assert.deepEqual(value.messages.map(message => [message.key, message.role]), [
      ['u-old', 'user'], ['a-old', 'assistant'], ['u-new', 'user'], ['a-new', 'assistant'],
    ]);
    assert.equal(value.messages[2].content, 'First paragraph\nSecond paragraph');
    const answer = value.messages[3];
    assert.match(answer.content, /## Answer/);
    assert.match(answer.content, /```js\nconst answer = 42;\n  console.log\(answer\);\n```/);
    assert.match(answer.content, /- First item\n- Second item/);
    assert.match(answer.content, /\[Docs\]\(https:\/\/example.org\/docs\)/);
    assert.ok(!/javascript:|COPY_SECRET|SCRIPT_SECRET|HIDDEN_SECRET/.test(answer.content));
    assert.equal(answer.explicitComplete, true);
    assert.equal(answer.terminalActions, true);
    assert.equal(value.blocked, false);
    assert.equal(value.composer.index, 0);
  });
  await fixture('thinking-only assistant and empty placeholders are never classified as users', `
    <div data-virtual-list-item-key="u"><div class="ds-collapsible-text">Hello</div></div>
    <div data-virtual-list-item-key="a"><div class="ds-think-content"><div class="ds-markdown">PRIVATE_THOUGHT_FIXTURE</div></div></div>
    <div data-virtual-list-item-key="mounting"></div>${composer}`, value => {
    assert.deepEqual(value.messages.map(m => m.role), ['user','assistant']);
    assert.equal(value.messages[1].content, '');
    assert.ok(!JSON.stringify(value.messages).includes('PRIVATE_THOUGHT_FIXTURE'));
  });
  await fixture('completed current-page assistant exposes its own Read aloud terminal control', `
    <div data-virtual-list-item-key="a"><div class="ds-markdown ds-assistant-message-main-content"><p>Final reply</p></div><div role="button" aria-label="Read aloud"></div></div>${composer}`, value => {
    assert.equal(value.messages[0].role,'assistant');
    assert.equal(value.messages[0].content,'Final reply');
    assert.equal(value.messages[0].terminalActions,true);
  });
  await fixture('visible official stop affordance is observed', `<button aria-label="Stop generating">Stop generating</button>${composer}`, value => {
    assert.equal(value.stopPresent, true);
  });
  await fixture('hidden stop affordance is ignored', `<button aria-label="Stop generating" hidden>Stop generating</button>${composer}`, value => {
    assert.equal(value.stopPresent, false);
  });
  await fixture('verification alert blocks immediately', `<div role="alert">请完成人机验证</div>${composer}`, value => {
    assert.equal(value.blocked, true);
    assert.match(value.blockedReason, /风控/);
  });
  await fixture('rate limit dialog blocks immediately', `<div role="dialog">Too many requests. Please try again later.</div>${composer}`, value => {
    assert.equal(value.blocked, true);
  });
  await fixture('visible captcha widget blocks even without readable text', `<div id="captcha-widget" style="width:200px;height:80px"></div>${composer}`, value => {
    assert.equal(value.blocked, true);
  });
  await fixture('model discussing verification is not mistaken for a platform alert', `
    <div data-virtual-list-item-key="a-model"><div class="ds-assistant-message-main-content ds-markdown">
      <h2>验证码与 rate limit 的区别</h2><p>这里是在讨论人机验证和 too many requests。</p>
    </div></div>${composer}`, value => {
    assert.equal(value.blocked, false);
    assert.equal(value.messages[0].role, 'assistant');
  });
  await fixture('hidden risk banner is ignored', `<div role="alert" style="display:none">验证码</div>${composer}`, value => {
    assert.equal(value.blocked, false);
  });
  await fixture('password inputs and account form values never enter snapshots', `
    <form><input type="text" name="account" value="ACCOUNT_VALUE_SECRET"><input type="password" value="PASSWORD_VALUE_SECRET"></form>
    <div data-virtual-list-item-key="a-safe"><div class="ds-assistant-message-main-content ds-markdown">
      <p>Visible reply</p><input type="password" value="NESTED_PASSWORD_SECRET">
    </div></div>${composer}`, value => {
    const serialized = JSON.stringify(value);
    assert.ok(!/ACCOUNT_VALUE_SECRET|PASSWORD_VALUE_SECRET|NESTED_PASSWORD_SECRET/.test(serialized));
    assert.equal(value.messages[0].content, 'Visible reply');
  });
  await fixture('unrecognized generic message markup is not guessed', `<div class="message">Unknown</div>${composer}`, value => {
    assert.deepEqual(value.messages, []);
  });
  assert.equal(blockedRequests, 0, 'Synthetic fixtures should not attempt any network requests.');
  console.log(`${tests.length} local DOM fixture checks passed; no website request was made.`);
} finally {
  await browser.close();
}
