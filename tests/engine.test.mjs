import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { DeepSeekWebEngine } from '../src/engine.mjs';
import { validateChatUrl, markdownFromTree } from '../src/dom-snapshot.mjs';

const root = 'https://chat.deepseek.com/';
const chat = 'https://chat.deepseek.com/a/chat/s/test-123';
const text = content => ({ tag: '#text', text: content });
const user = (key, content) => ({ key, role: 'user', text: content });
const assistant = (key, content, extra = {}) => ({ key, role: 'assistant', tree: { tag: 'P', children: [text(content)] }, ...extra });
const snapshot = (messages = [], extra = {}) => ({
  url: chat, title: 'Test conversation', messages,
  composer: { selector: 'textarea', index: 0, value: '' },
  stopPresent: false, blocked: false, ...extra,
});

class FakePage {
  constructor({ before = snapshot(), after = [], visibleStop = false } = {}) {
    this.before = before;
    this.after = after;
    this.current = structuredClone(before);
    this.pressed = 0;
    this.gotoCalls = [];
    this.fills = [];
    this.clicks = 0;
    this.visibleStop = visibleStop;
    this.closed = false;
  }
  isClosed() { return this.closed; }
  url() { return this.current.url; }
  async goto(url) { this.gotoCalls.push(url); this.current = { ...structuredClone(this.before), url }; }
  async bringToFront() {}
  async evaluate() {
    if (this.pressed && this.after.length) this.current = structuredClone(this.after.length > 1 ? this.after.shift() : this.after[0]);
    return structuredClone(this.current);
  }
  locator(selector) {
    assert.equal(selector, 'textarea');
    return { nth: () => ({
      isVisible: async () => true,
      isEditable: async () => true,
      fill: async value => { this.fills.push(value); this.current.composer.value = value; },
      press: async key => { assert.equal(key, 'Enter'); this.pressed++; },
    }) };
  }
  getByRole(role, { name }) {
    assert.equal(role, 'button');
    assert.ok(name.test('Stop generating'));
    return {
      count: async () => 1,
      nth: () => ({
        isVisible: async () => this.visibleStop,
        isEnabled: async () => true,
        click: async () => { this.clicks++; this.visibleStop = false; },
      }),
    };
  }
}

async function engineFor(t, page, extra = {}) {
  const profileDir = await mkdtemp(join(tmpdir(), 'dsh-engine-test-'));
  t.after(() => rm(profileDir, { recursive: true, force: true }));
  let launchOptions;
  const engine = new DeepSeekWebEngine({
    profileDir, timeoutMs: 30, _pollIntervalMs: 1,
    _launchBrowser: async (directory, options) => {
      assert.equal(directory, profileDir);
      launchOptions = options;
      return { pages: () => [page], close: async () => { page.closed = true; } };
    }, ...extra,
  });
  t.after(() => engine.close());
  return { engine, profileDir, options: () => launchOptions };
}

test('only exact official conversation URLs and explicit null new-chat are accepted', () => {
  assert.equal(validateChatUrl(chat), chat);
  assert.equal(validateChatUrl(null, { allowNew: true }), root);
  for (const value of [root, null, undefined, '/a/chat/s/test',
    'https://chat.deepseek.com.evil.test/a/chat/s/x',
    'https://user:password@chat.deepseek.com/a/chat/s/x',
    'http://chat.deepseek.com/a/chat/s/x',
    `${chat}?token=secret`, `${chat}#x`,
    'https://chat.deepseek.com/a/chat/s/a%2Fb',
    'https://chat.deepseek.com/a/chat/s/../sign_in']) {
    assert.throws(() => validateChatUrl(value), /INVALID_CHAT_URL/);
  }
});

test('Markdown conversion preserves code and lists, removes HTML and unsafe link schemes', () => {
  const tree = { tag: 'DIV', children: [
    { tag: 'PRE', children: [{ tag: 'CODE', language: 'js', children: [text('const value = "```";\n  alert(1);')] }] },
    { tag: 'UL', children: [{ tag: 'LI', children: [text('first')] }, { tag: 'LI', children: [text('second')] }] },
    { tag: 'A', href: 'javascript:alert(1)', children: [text('unsafe')] },
    { tag: 'A', href: 'https://example.org/docs', children: [text('docs')] },
    { tag: 'SCRIPT', children: [text('BAD')] },
    text('<script>literal</script>'),
  ] };
  const rendered = markdownFromTree(tree);
  assert.match(rendered, /````js\nconst value = "```";\n  alert\(1\);\n````/);
  assert.match(rendered, /- first\n- second/);
  assert.match(rendered, /\[docs\]\(https:\/\/example.org\/docs\)/);
  assert.ok(!rendered.includes('javascript:'));
  assert.ok(!rendered.includes('BAD'));
  assert.ok(rendered.includes('\\<script\\>literal\\</script\\>'));
});

test('browser is visible, passwords saving disabled, permissions private; no credential read is needed', async t => {
  const page = new FakePage({ before: snapshot([], { url: root }) });
  const { engine, profileDir, options } = await engineFor(t, page);
  await engine.open();
  assert.equal(options().headless, false);
  assert.equal(options().chromiumSandbox, true);
  assert.deepEqual(options().args, ['--disable-save-password-bubble']);
  const preferences = JSON.parse(await readFile(join(profileDir, 'Default', 'Preferences'), 'utf8'));
  assert.equal(preferences.credentials_enable_service, false);
  assert.equal(preferences.profile.password_manager_enabled, false);
  assert.equal((await stat(profileDir)).mode & 0o777, 0o700);
  assert.equal((await stat(join(profileDir, 'Default', 'Preferences'))).mode & 0o777, 0o600);
});

test('new chat binds fresh user and assistant keys and returns the new canonical URL', async t => {
  const page = new FakePage({
    before: snapshot([], { url: root }),
    after: [snapshot([user('u1', 'Hello'), assistant('a1', 'Hello back', { explicitComplete: true })])],
  });
  const updates = [];
  const { engine } = await engineFor(t, page);
  const result = await engine.send({ text: 'Hello', url: null, onSnapshot: value => updates.push(value) });
  assert.equal(result.status, 'complete');
  assert.equal(result.url, chat);
  assert.deepEqual(result.messages, [{ role: 'user', content: 'Hello' }, { role: 'assistant', content: 'Hello back' }]);
  assert.deepEqual(result.turnMessages, result.messages);
  assert.deepEqual(page.gotoCalls, [root]);
  assert.equal(page.pressed, 1);
  assert.equal(updates.at(-1).status, 'complete');
});

test('an old assistant message is never captured as the new response', async t => {
  const old = [user('old-u', 'Old question'), assistant('old-a', 'Old answer')];
  const page = new FakePage({ before: snapshot(old), after: [snapshot(old)] });
  const { engine } = await engineFor(t, page);
  const result = await engine.send({ text: 'New question', url: chat });
  assert.equal(result.status, 'partial');
  assert.deepEqual(result.messages, []);
  assert.equal(page.pressed, 1);
});

test('unchanged response text without a terminal marker remains partial', async t => {
  const page = new FakePage({ after: [snapshot([user('u1', 'Hello'), assistant('a1', 'Text has paused')])] });
  const { engine } = await engineFor(t, page);
  const result = await engine.send({ text: 'Hello', url: chat });
  assert.equal(result.status, 'partial');
  assert.match(result.reason, /未识别到明确结束/);
  assert.equal(page.pressed, 1);
});

test('observed generation and per-message terminal controls confirm completion', async t => {
  const messages = [user('u1', 'Hello'), assistant('a1', 'Reply')];
  const page = new FakePage({ after: [
    snapshot(messages, { stopPresent: true }),
    snapshot([user('u1', 'Hello'), assistant('a1', 'Reply', { terminalActions: true })]),
  ] });
  const { engine } = await engineFor(t, page);
  assert.equal((await engine.send({ text: 'Hello', url: chat })).status, 'complete');
  assert.equal(page.pressed, 1);
});

test('a platform block pauses immediately and remains latched until explicit open', async t => {
  const page = new FakePage({ after: [snapshot([], { blocked: true, blockedReason: '验证' })] });
  const { engine } = await engineFor(t, page);
  const first = await engine.send({ text: 'Hello', url: chat });
  assert.equal(first.status, 'blocked');
  assert.equal((await engine.status()).blocked, true);
  await engine.send({ text: 'Hello', url: chat });
  assert.equal(page.pressed, 1);
  assert.equal(page.gotoCalls.length, 1);
  page.pressed = 0;
  page.current = snapshot();
  await engine.open();
  assert.equal((await engine.status()).blocked, false);
});

test('a verification banner before submit never sends text', async t => {
  const page = new FakePage({ before: snapshot([], { blocked: true, blockedReason: '限流' }) });
  const { engine } = await engineFor(t, page);
  assert.equal((await engine.send({ text: 'Hello', url: chat })).status, 'blocked');
  assert.equal(page.pressed, 0);
  assert.deepEqual(page.fills, []);
});

test('history is explicitly navigated and an unexpected switch blocks capture', async t => {
  const page = new FakePage({ after: [snapshot([user('u1', 'Hello'), assistant('a1', 'wrong')], {
    url: 'https://chat.deepseek.com/a/chat/s/different',
  })] });
  const { engine } = await engineFor(t, page);
  const result = await engine.send({ text: 'Hello', url: chat });
  assert.deepEqual(page.gotoCalls, [chat]);
  assert.equal(result.status, 'blocked');
  assert.deepEqual(result.messages, []);
});

test('nonempty official draft is preserved and never replaced', async t => {
  const page = new FakePage({ before: snapshot([], { composer: { index: 0, value: 'My draft' } }) });
  const { engine } = await engineFor(t, page);
  assert.equal((await engine.send({ text: 'Hello', url: chat })).status, 'blocked');
  assert.deepEqual(page.fills, []);
  assert.equal(page.pressed, 0);
});

test('global busy guard rejects overlapping sends instead of queueing', async t => {
  const firstPage = new FakePage();
  const secondPage = new FakePage();
  const first = await engineFor(t, firstPage);
  const second = await engineFor(t, secondPage);
  const running = first.engine.send({ text: 'Hello', url: chat });
  await assert.rejects(second.engine.send({ text: 'Another', url: chat }), error => error.code === 'BUSY');
  await running;
  assert.equal(secondPage.pressed, 0);
});

test('stop clicks only a visible official stop button; absent buttons do nothing', async t => {
  const page = new FakePage({ visibleStop: false });
  const { engine } = await engineFor(t, page);
  await engine.open();
  assert.equal((await engine.stop()).stopped, false);
  assert.equal(page.clicks, 0);
  page.visibleStop = true;
  assert.equal((await engine.stop()).stopped, true);
  assert.equal(page.clicks, 1);
});

test('UI callback errors never cause resend or loss of completion', async t => {
  const page = new FakePage({ after: [snapshot([user('u1', 'Hello'), assistant('a1', 'Reply', { explicitComplete: true })])] });
  const { engine } = await engineFor(t, page, { onUpdate: () => { throw new Error('UI failure'); } });
  const result = await engine.send({ text: 'Hello', url: chat, onSnapshot: () => { throw new Error('stream closed'); } });
  assert.equal(result.status, 'complete');
  assert.equal(page.pressed, 1);
});

test('multiline user DOM and new-turn delta preserve local history boundaries', async t => {
  const old = [user('old-u', 'Earlier'), assistant('old-a', 'Earlier reply')];
  const multi = { key: 'u-new', role: 'user', tree: { tag: 'DIV', children: [
    { tag: 'P', children: [text('First paragraph')] },
    { tag: 'P', children: [text('Second paragraph')] },
  ] } };
  const page = new FakePage({ before: snapshot(old), after: [snapshot([
    ...old, multi, assistant('a-new', 'Answer', { explicitComplete: true }),
  ])] });
  const { engine } = await engineFor(t, page);
  const result = await engine.send({ text: 'First paragraph\n\nSecond paragraph', url: chat });
  assert.equal(result.status, 'complete');
  assert.equal(result.messages.length, 4);
  assert.deepEqual(result.turnMessages, [
    { role: 'user', content: 'First paragraph\n\nSecond paragraph' },
    { role: 'assistant', content: 'Answer' },
  ]);
});

test('close during a pending browser launch closes the eventual context', async t => {
  const page = new FakePage();
  let resolveLaunch;
  let started;
  const launchStarted = new Promise(resolveStarted => { started = resolveStarted; });
  let contextClosed = false;
  const { engine } = await engineFor(t, page, {
    _launchBrowser: async () => {
      started();
      return new Promise(resolveContext => { resolveLaunch = () => resolveContext({
        pages: () => [page], close: async () => { contextClosed = true; page.closed = true; },
      }); });
    },
  });
  const opening = engine.open();
  await launchStarted;
  const closing = engine.close();
  resolveLaunch();
  await Promise.allSettled([opening, closing]);
  assert.equal(contextClosed, true);
  assert.equal((await engine.status()).opened, false);
});

test('a thinking-only assistant can become the reply without a false extra-user error', async t=>{
  const thinking=assistant('a1','');
  const page=new FakePage({after:[snapshot([user('u1','Hello'),thinking]),snapshot([user('u1','Hello'),assistant('a1','Final answer',{terminalActions:true})])]});
  const {engine}=await engineFor(t,page);
  const result=await engine.send({text:'Hello',url:chat});
  assert.equal(result.status,'complete');assert.equal(result.turnMessages[1].content,'Final answer');assert.equal(page.pressed,1);
});

test('sync reads an existing answer without typing or submitting any message', async t=>{
  const page=new FakePage({before:snapshot([user('u1','Hello'),assistant('a1','Already answered',{terminalActions:true})])});
  const {engine}=await engineFor(t,page);
  const result=await engine.sync({url:chat,text:'Hello'});
  assert.equal(result.status,'complete');assert.equal(result.turnMessages[1].content,'Already answered');
  assert.equal(page.pressed,0);assert.deepEqual(page.fills,[]);
});

test('sync refuses a later different user message instead of attaching its reply', async t=>{
  const page=new FakePage({before:snapshot([user('u1','Hello'),assistant('a1','First'),user('u2','Different'),assistant('a2','Other',{terminalActions:true})])});
  const {engine}=await engineFor(t,page);
  await assert.rejects(engine.sync({url:chat,text:'Hello'}),/后续新消息/);assert.equal(page.pressed,0);
});
