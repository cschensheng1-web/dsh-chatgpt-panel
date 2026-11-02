import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { startPreview } from './preview.mjs';
import { readLoadedChat } from '../src/webpage-context.mjs';
const preview = await startPreview({ port: 0 });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  const apiRequests = [];
  await page.route('**/api/dsh-chatgpt-panel/**', async route => { apiRequests.push(route.request().url()); await route.abort(); });
  await page.addInitScript(() => {
    window.__embeddedFixture = { acquired: [], released: [], loaded: [], reads: 0, copied: '', capture: { text: '## 用户\n\n做一个项目面板\n\n## DeepSeek\n\n先实现 Chat 与 Work 交接。', kind: 'messages', count: 2, url: 'https://chat.deepseek.com/' } };
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async text => { window.__embeddedFixture.copied = text; } } });
    window.dshDesktop = { browser: {
      acquire: async key => { window.__embeddedFixture.acquired.push(key); return { lease: 'fixture-' + window.__embeddedFixture.acquired.length, partition: 'memory-fixture' }; },
      release: async lease => { window.__embeddedFixture.released.push(lease); }, onOpenRequested: () => () => {},
    } };
    const create = document.createElement.bind(document);
    document.createElement = function(name, ...args) {
      const node = create(name, ...args);
      if (name.toLowerCase() === 'webview') {
        node.loadURL = async url => { window.__embeddedFixture.loaded.push(url); node.setAttribute('data-fixture-url', url); node.dispatchEvent(Object.assign(new Event('did-navigate'), { url })); node.dispatchEvent(new Event('did-stop-loading')); };
        node.getURL = () => node.getAttribute('data-fixture-url'); node.reload = () => {};
        node.executeJavaScript = async () => { window.__embeddedFixture.reads++; return window.__embeddedFixture.capture; };
        const observer = new MutationObserver(() => { if (node.isConnected) { observer.disconnect(); node.dispatchEvent(new Event('dom-ready')); } });
        observer.observe(document, { childList: true, subtree: true });
      }
      return node;
    };
  });
  await page.goto(preview.url);
  await page.locator('webview[data-fixture-url]').waitFor();
  assert.equal(await page.evaluate(() => window.__embeddedFixture.reads), 0, 'No background webpage reads');
  for (const attr of ['nodeintegration', 'preload', 'disablewebsecurity', 'useragent']) assert.equal(await page.locator('webview').getAttribute(attr), null);
  await page.getByRole('button', { name: '带上聊天转入 Work', exact: true }).click();
  await page.getByText('已读取当前加载的 2 条消息', { exact: false }).waitFor();
  await page.getByRole('textbox', { name: '项目资料', exact: true }).fill('保持免费 Chat；Work 沿用 DSH。');
  await page.getByRole('textbox', { name: 'Work 下一步做什么', exact: true }).fill('实现项目面板并完成测试');
  await page.getByText(/查看完整交接内容/).click();
  const handoff = await page.getByRole('textbox', { name: '完整交接内容', exact: true }).inputValue();
  for (const text of ['做一个项目面板', '保持免费 Chat', '实现项目面板并完成测试', '/fixture/project-a']) assert.ok(handoff.includes(text));
  if (process.env.DSH_UI_SCREENSHOT) await page.screenshot({ path: process.env.DSH_UI_SCREENSHOT });
  await page.getByRole('button', { name: '新建 Work 草稿', exact: true }).click();
  await page.getByRole('heading', { name: 'DSH 原生 Work（本地模拟）' }).waitFor();
  assert.equal(await page.getByRole('textbox', { name: '原生 Work 草稿' }).inputValue(), handoff);
  assert.deepEqual(await page.evaluate(() => window.__previewNative.created), [{ workspaceId: 'project-a' }]);
  assert.deepEqual(await page.evaluate(() => window.__previewNative.sent), []);
  await page.getByRole('button', { name: '返回 Chat 预览' }).click();
  await page.locator('webview[data-fixture-url]').waitFor();
  await page.getByRole('button', { name: '项目资料', exact: true }).click();
  assert.match(await page.getByRole('textbox', { name: '聊天上下文', exact: true }).inputValue(), /做一个项目面板/);
  await page.getByLabel('当前项目').selectOption('project-b');
  assert.equal(await page.getByRole('textbox', { name: '聊天上下文', exact: true }).inputValue(), '');
  assert.equal(await page.getByRole('textbox', { name: '项目资料', exact: true }).inputValue(), '');
  await page.getByRole('textbox', { name: '项目资料', exact: true }).fill('B 项目独立资料');
  await page.getByLabel('当前项目').selectOption('project-a');
  assert.match(await page.getByRole('textbox', { name: '项目资料', exact: true }).inputValue(), /保持免费 Chat/);
  await page.evaluate(() => { window.__embeddedFixture.capture = { error: '页面正在验证或限流，请先自行在官网处理。' }; });
  await page.getByRole('button', { name: '重新读取当前聊天', exact: true }).click();
  await page.getByRole('alert').filter({ hasText: '验证或限流' }).waitFor();
  assert.match(await page.getByRole('textbox', { name: '聊天上下文', exact: true }).inputValue(), /做一个项目面板/);
  await page.getByRole('tab', { name: 'Work', exact: true }).click();
  await page.getByLabel('Work 对话', { exact: true }).selectOption('existing-work');
  await page.getByRole('button', { name: '读取最新回复到项目' }).click();
  await page.getByRole('textbox', { name: '已导入的 Work 回复' }).waitFor();
  assert.equal(await page.getByRole('textbox', { name: '已导入的 Work 回复' }).inputValue(), 'Work 已完成：项目构建通过。');
  await page.getByRole('button', { name: '复制项目资料给 Chat' }).click();
  await page.waitForFunction(() => window.__embeddedFixture.copied.includes('项目构建通过'));
  assert.doesNotMatch(await page.evaluate(() => window.__embeddedFixture.copied), /内部推理/);
  await page.reload(); await page.locator('webview[data-fixture-url]').waitFor();
  await page.getByRole('button', { name: '项目资料', exact: true }).click();
  assert.match(await page.getByRole('textbox', { name: '项目资料', exact: true }).inputValue(), /保持免费 Chat/);
  assert.deepEqual(apiRequests, []); assert.deepEqual(errors, []);

  // Execute the real snapshot function against local HTML served by interception.
  // No traffic reaches DeepSeek and no real account or conversation is used.
  const dom = await browser.newPage();
  let html = '<title>Local fixture</title><aside>不应读取的侧边栏</aside><input type="password" value="DO-NOT-READ"><div data-virtual-list-item-key="u"><div class="ds-collapsible-text">需求 A</div></div><div data-virtual-list-item-key="a"><div class="ds-think-content">隐藏推理</div><div class="ds-assistant-message-main-content"><div class="ds-markdown"><p>回答 B</p><pre><code class="language-js">const a = 1;</code></pre><button>复制</button><input value="DO-NOT-READ"></div></div></div>';
  await dom.route('**/*', route => route.fulfill({ contentType: 'text/html;charset=utf-8', body: html }));
  await dom.goto('https://chat.deepseek.com/a/chat?token=not-read');
  const result = await dom.evaluate(readLoadedChat);
  assert.equal(result.count, 2); assert.equal(result.url, 'https://chat.deepseek.com/a/chat');
  assert.match(result.text, /需求 A/); assert.match(result.text, /```js\nconst a = 1;/);
  assert.doesNotMatch(result.text, /DO-NOT-READ|侧边栏|隐藏推理|复制/);
  await dom.evaluate(() => { const range = document.createRange(); range.selectNodeContents(document.querySelector('.ds-collapsible-text')); window.getSelection().removeAllRanges(); window.getSelection().addRange(range); });
  assert.equal((await dom.evaluate(readLoadedChat)).kind, 'selection');
  html = '<div role="alert">captcha verify you are human</div>';
  await dom.reload(); assert.match((await dom.evaluate(readLoadedChat)).error, /验证或限流/);
  html = '<button>Stop generating</button>'; await dom.reload(); assert.match((await dom.evaluate(readLoadedChat)).error, /仍在生成/);
  html = '<main>unknown layout with private text</main>'; await dom.reload(); assert.match((await dom.evaluate(readLoadedChat)).error, /没有识别/);
  html = '<div data-message-id="a" data-message-role="user">' + 'x'.repeat(81000) + '</div>'; await dom.reload(); assert.match((await dom.evaluate(readLoadedChat)).error, /过长/);
  await dom.goto('https://example.org/'); assert.match((await dom.evaluate(readLoadedChat)).error, /官网/);
  console.log('Project UI PASS: explicit capture, reviewed native draft, zero sends, per-project isolation and persistence, Work reply return, safe DOM capture and manual fallback. Local fixtures only.');
} finally { await browser.close(); await preview.close(); }
