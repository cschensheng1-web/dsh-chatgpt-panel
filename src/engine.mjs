import { mkdir, writeFile, chmod, lstat } from 'node:fs/promises';
import { isAbsolute, join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { DEEPSEEK_ORIGIN, normalizeDomSnapshot, readVisibleDom, validateChatUrl } from './dom-snapshot.mjs';
import { browserErrorMessage } from './browser-errors.mjs';

// One user-triggered send at a time across every engine instance. There is no
// queue: a second request is rejected and is never sent later unexpectedly.
let activeSend;
const profileOwners = new Map();
const sleep = milliseconds => new Promise(resolveSleep => setTimeout(resolveSleep, milliseconds));
const normalizeText = value => String(value).trim().replace(/\s+/g, ' ');
const stopPattern = /^(?:停止|停止生成|停止回答|Stop|Stop generating|Stop response)(?:\s|$)/i;

function failure(code, message) {
  const error = new Error(message);
  error.code = code;
  error.userMessage = message;
  return error;
}

function canonicalOrNull(value) {
  try { return validateChatUrl(value); } catch { return null; }
}

async function secureDirectory(path) {
  await mkdir(path, { recursive: true, mode: 0o700 });
  const info = await lstat(path);
  if (info.isSymbolicLink() || !info.isDirectory()) throw failure('UNSAFE_PROFILE', '浏览器专用目录必须是普通目录。');
  await chmod(path, 0o700);
}

async function prepareProfile(profileDir) {
  await secureDirectory(profileDir);
  const defaultDir = join(profileDir, 'Default');
  await secureDirectory(defaultDir);
  // Initialize this dedicated profile once, without reading existing account
  // information or overwriting preferences held by a running Chrome process.
  const preferences = join(defaultDir, 'Preferences');
  const existing = await lstat(preferences).catch(error => {
    if (error.code === 'ENOENT') return null;
    throw error;
  });
  if (existing?.isSymbolicLink()) throw failure('UNSAFE_PROFILE', '浏览器设置文件不能是符号链接。');
  try {
    await writeFile(preferences, JSON.stringify({
      credentials_enable_service: false,
      profile: { password_manager_enabled: false },
      autofill: { profile_enabled: false, credit_card_enabled: false },
    }), { mode: 0o600, flag: 'wx' });
  } catch (error) { if (error.code !== 'EEXIST') throw error; }
  await chmod(preferences, 0o600);
}

/**
 * Experimental visible-browser adapter. It types one explicit user message
 * in the official web UI, then observes rendered message DOM. It never calls
 * a private endpoint or a paid provider. A changed layout returns partial or
 * blocked; no resend, captcha solver, stealth, or automatic fallback exists.
 */
export class DeepSeekWebEngine {
  constructor({ profileDir, onUpdate, timeoutMs = 180000, _launchBrowser, _pollIntervalMs = 300 } = {}) {
    if (typeof profileDir !== 'string' || !isAbsolute(profileDir)) throw failure('INVALID_PROFILE', '请指定独立的绝对路径浏览器目录。');
    this.profileDir = resolve(profileDir);
    if (this.profileDir === homedir() || this.profileDir === '/' || /\/(?:Google\/Chrome|Microsoft Edge)(?:\/|$)/i.test(this.profileDir)) {
      throw failure('UNSAFE_PROFILE', '请使用插件独立目录，不能使用个人浏览器配置。');
    }
    if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) throw failure('INVALID_TIMEOUT', '等待时间必须大于零。');
    this.timeoutMs = timeoutMs;
    this.onUpdate = onUpdate;
    this.pollIntervalMs = _pollIntervalMs;
    this.launchBrowser = _launchBrowser;
    this.context = null;
    this.page = null;
    this.opening = null;
    this.closing = null;
    this.busy = false;
    this.stopped = false;
    this.closed = false;
    this.pausedReason = null;
  }

  async _ensureBrowser() {
    if (this.closing) await this.closing;
    if (this.opening) return this.opening;
    this.opening = (async () => {
      // A closed tab does not mean that its persistent browser has exited.
      // Recover a live page in the owned context before considering a launch.
      if (this.context) {
        const context = this.context;
        try {
          this.page = await this._contextPage(context);
          return;
        } catch (error) {
          if (!/Target.*closed|Browser.*closed|context.*closed/i.test(String(error.message))) throw error;
          await this._closeContext(context);
        }
      }
      const previous = profileOwners.get(this.profileDir);
      if (previous && previous !== this) {
        if (previous.closing) await previous.closing;
        if (profileOwners.get(this.profileDir) && profileOwners.get(this.profileDir) !== this) {
          throw failure('PROFILE_IN_USE', '插件的官网浏览器正由另一个实例使用，请关闭该专用窗口并重启 DSH 后再试。');
        }
      }
      profileOwners.set(this.profileDir, this);
      try {
        await prepareProfile(this.profileDir);
        const launch = this.launchBrowser ?? (async (directory, options) => {
          const { chromium } = await import('playwright-core');
          return chromium.launchPersistentContext(directory, options);
        });
        const context = await launch(this.profileDir, {
          channel: 'chrome', headless: false, viewport: null, acceptDownloads: false, chromiumSandbox: true,
          args: ['--disable-save-password-bubble'],
        });
        this.context = context;
        context.on?.('close', () => {
          if (this.context !== context) return;
          this.context = null;
          this.page = null;
          this.closed = true;
          if (profileOwners.get(this.profileDir) === this) profileOwners.delete(this.profileDir);
        });
        this.page = await this._contextPage(context);
        this.closed = false;
      } catch (error) {
        if (this.context) await this._closeContext(this.context);
        if (profileOwners.get(this.profileDir) === this) profileOwners.delete(this.profileDir);
        throw failure('BROWSER_START_FAILED', browserErrorMessage(error));
      }
    })().finally(() => { this.opening = null; });
    return this.opening;
  }

  async _contextPage(context) {
    const pages = context.pages().filter(page => !page.isClosed());
    if (this.page && pages.includes(this.page)) return this.page;
    return pages.find(page => page.url().startsWith(`${DEEPSEEK_ORIGIN}/`))
      ?? pages.find(page => page.url() === 'about:blank')
      ?? await context.newPage();
  }

  async _closeContext(context) {
    // Keep ownership until Chrome has actually released its profile lock.
    await context.close();
    if (this.context === context) {
      this.context = null;
      this.page = null;
    }
    if (profileOwners.get(this.profileDir) === this) profileOwners.delete(this.profileDir);
  }

  async _read() {
    if (!this.page || this.page.isClosed()) throw failure('BROWSER_CLOSED', '官网浏览器已关闭。');
    return normalizeDomSnapshot(await this.page.evaluate(readVisibleDom));
  }

  async open() {
    try {
      if (this.busy) {
        await this.page?.bringToFront();
        return this.status();
      }
      await this._ensureBrowser();
      const current = this.page.url();
      if (current === 'about:blank' || !current.startsWith(`${DEEPSEEK_ORIGIN}/`)) {
        await this.page.goto(`${DEEPSEEK_ORIGIN}/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      }
      await this.page.bringToFront();
      const snapshot = await this._read();
      // An explicit reopen after the user handles a verification page is the
      // only way to release a latched platform block. Nothing retries a send.
      this.pausedReason = snapshot.blocked ? snapshot.blockedReason : null;
      return this.status();
    } catch (error) { throw failure('BROWSER_OPEN_FAILED', browserErrorMessage(error)); }
  }

  async status() {
    const opened = Boolean(this.page && !this.page.isClosed());
    let snapshot;
    if (opened) snapshot = await this._read().catch(() => null);
    return {
      opened, busy: this.busy, url: snapshot?.url ?? null,
      blocked: Boolean(this.pausedReason || snapshot?.blocked),
      reason: this.pausedReason ?? snapshot?.blockedReason ?? null,
      ready: Boolean(snapshot?.composer && !snapshot?.blocked &&
        (canonicalOrNull(snapshot.url) || snapshot.url === `${DEEPSEEK_ORIGIN}/`)),
    };
  }

  async _emit(result, callback) {
    for (const subscriber of [this.onUpdate, callback]) {
      if (typeof subscriber !== 'function') continue;
      // A UI subscriber failure must never trigger a second browser send.
      try { await subscriber(structuredClone(result)); } catch { /* UI owns reporting. */ }
    }
    return result;
  }

  async send({ text, url, onSnapshot } = {}) {
    const target = validateChatUrl(url, { allowNew: true });
    if (typeof text !== 'string' || !text.trim() || text.length > 64000) throw failure('INVALID_TEXT', '消息须为 1–64000 字符。');
    if (activeSend || this.busy) throw failure('BUSY', '已有消息正在发送或生成，请先等待或停止。');
    activeSend = this;
    this.busy = true;
    this.stopped = false;
    let messages = [];
    let turnMessages = [];
    let canonical = url === null ? null : target;
    let title = '新的对话';
    const result = (status, reason) => ({ url: canonical, title, messages, turnMessages, status, ...(reason ? { reason } : {}) });
    const blocked = async reason => this._emit(result('blocked', reason), onSnapshot);
    try {
      if (this.pausedReason) return blocked(`${this.pausedReason} 处理后请点击打开官网，再手动重试。`);
      await this._ensureBrowser();
      await this.page.goto(target, { waitUntil: 'domcontentloaded', timeout: 30000 });
      const readyDeadline = Date.now() + Math.min(this.timeoutMs, 15000);
      let before;
      while (Date.now() < readyDeadline) {
        before = await this._read();
        if (before.blocked) {
          this.pausedReason = before.blockedReason;
          return blocked(this.pausedReason);
        }
        if (before.url !== target) return blocked('官网导航目标发生变化，请自行确认登录和会话；消息未发送。');
        if (before.truncated) return blocked('页面消息过多或结构已变化，无法可靠绑定本次消息。');
        if (before.stopPresent) return blocked('官网已有回复正在生成，请先在官网停止或等候完成。');
        if (before.composer) break;
        await sleep(this.pollIntervalMs);
      }
      if (!before?.composer) return blocked('未识别到可用的官网输入框，请自行登录；消息未发送。');
      if (url === null && before.messages.length) return blocked('官网根页面包含已有会话，无法确认是新对话；消息未发送。');
      title = before.title || title;
      const baselineKeys = new Set(before.messages.map(message => message.key));
      if (baselineKeys.size !== before.messages.length) return blocked('页面消息标识不唯一，无法可靠续聊。');
      const composer = this.page.locator('textarea').nth(before.composer.index);
      if (!await composer.isVisible() || !await composer.isEditable()) return blocked('官网输入框状态已变化；消息未发送。');
      if (before.composer.value?.trim()) return blocked('官网输入框已有草稿，请先在官网处理；消息未发送。');
      await composer.fill(text, { timeout: 10000 });
      const preSubmit = await this._read();
      if (preSubmit.blocked || preSubmit.url !== target || preSubmit.stopPresent || preSubmit.composer?.value !== text) {
        if (preSubmit.blocked) this.pausedReason = preSubmit.blockedReason;
        return blocked(preSubmit.blockedReason ?? '官网状态已变化，已保留草稿但未提交。');
      }
      // Exactly one user-initiated submit. There is deliberately no retry.
      await composer.press('Enter', { timeout: 10000 });
      const deadline = Date.now() + this.timeoutMs;
      let userKey = null;
      let sawGenerating = false;
      let boundAssistantKey = null;
      while (Date.now() < deadline && !this.closed) {
        const snapshot = await this._read();
        const currentCanonical = canonicalOrNull(snapshot.url);
        if (canonical && currentCanonical !== canonical) return blocked('网页已切换到其他页面，本次读取已暂停。');
        if (!canonical && currentCanonical) canonical = currentCanonical;
        if (!canonical && snapshot.url !== target) return blocked('官网导航到未允许的页面，本次读取已暂停。');
        if (snapshot.blocked) {
          this.pausedReason = snapshot.blockedReason;
          return blocked(this.pausedReason);
        }
        if (snapshot.truncated) return this._emit(result('partial', '页面快照超出安全读取范围，已停止读取。'), onSnapshot);
        title = snapshot.title || title;
        sawGenerating ||= snapshot.stopPresent;
        if (!userKey) {
          const candidates = snapshot.messages.filter(message => !baselineKeys.has(message.key) &&
            message.role === 'user' && normalizeText(message.content) === normalizeText(text));
          if (candidates.length > 1) return this._emit(result('partial', '无法唯一绑定刚提交的消息，已停止读取。'), onSnapshot);
          if (candidates.length === 1) userKey = candidates[0].key;
        }
        if (userKey) {
          const userIndex = snapshot.messages.findIndex(message => message.key === userKey && message.role === 'user');
          if (userIndex < 0) return this._emit(result('partial', '本次用户消息已不在渲染页面中，已停止读取。'), onSnapshot);
          const after = snapshot.messages.slice(userIndex + 1);
          if (after.some(message => message.role === 'user')) return this._emit(result('partial', '官网出现另一条用户消息，已停止读取以免混淆。'), onSnapshot);
          const assistant = after.find(message => message.role === 'assistant' && !baselineKeys.has(message.key));
          if (assistant) {
            if (boundAssistantKey && boundAssistantKey !== assistant.key) return this._emit(result('partial', '回复消息标识发生变化，已停止读取。'), onSnapshot);
            boundAssistantKey = assistant.key;
          }
          messages = snapshot.messages.slice(0, userIndex + 1).map(({ role, content }) => ({ role, content }));
          // This DOM message has already matched the submitted text after
          // whitespace normalization. Keep the original text in the delta
          // so the host can bind it exactly and preserve paragraph spacing.
          turnMessages = [{ role: 'user', content: text }];
          if (assistant) {
            const reply = { role: 'assistant', content: assistant.content };
            messages.push(reply);
            turnMessages.push(reply);
          }
          if (this.stopped) return this._emit(result('partial', '已请求停止；保留目前可见内容。'), onSnapshot);
          // Text stability is never an end signal. Require a new assistant
          // message's explicit terminal state, or observed generation plus
          // its own terminal action controls and the restored composer.
          const complete = canonical && assistant?.content && !snapshot.stopPresent &&
            (assistant.explicitComplete || (sawGenerating && assistant.terminalActions && snapshot.composer));
          if (complete) return this._emit(result('complete'), onSnapshot);
          await this._emit(result('partial', '正在读取官网可见回复；结束状态尚未确认。'), onSnapshot);
        }
        if (this.stopped) return this._emit(result('partial', '已请求停止；未自动重发。'), onSnapshot);
        await sleep(this.pollIntervalMs);
      }
      return this._emit(result('partial', this.closed ? '官网浏览器已关闭。' :
        '等待超时或未识别到明确结束标记；仅保留已读取内容，请在官网确认。'), onSnapshot);
    } catch (error) {
      return this._emit(result('partial', `操作中断，未自动重发：${browserErrorMessage(error)}`), onSnapshot);
    } finally {
      this.busy = false;
      if (activeSend === this) activeSend = undefined;
    }
  }

  async stop() {
    if (!this.page || this.page.isClosed()) return { stopped: false, reason: '官网浏览器未打开。' };
    const snapshot = await this._read();
    if (!canonicalOrNull(snapshot.url) && snapshot.url !== `${DEEPSEEK_ORIGIN}/`) return { stopped: false, reason: '当前不是允许的官网会话页面。' };
    if (snapshot.blocked) {
      this.pausedReason = snapshot.blockedReason;
      return { stopped: false, reason: snapshot.blockedReason };
    }
    const buttons = this.page.getByRole('button', { name: stopPattern });
    for (let index = 0; index < await buttons.count(); index++) {
      const button = buttons.nth(index);
      if (await button.isVisible() && await button.isEnabled()) {
        await button.click({ timeout: 5000 });
        this.stopped = true;
        return { stopped: true };
      }
    }
    return { stopped: false, reason: '未识别到可见的官网停止按钮；请在官网操作。' };
  }

  async close() {
    if (this.closing) return this.closing;
    this.closed = true;
    this.closing = (async () => {
      // Wait both for a pending launch and for Chrome's shutdown. A concurrent
      // open must not launch against a profile that is still shutting down.
      await this.opening?.catch(() => undefined);
      this.closed = true;
      if (this.context) await this._closeContext(this.context);
      if (profileOwners.get(this.profileDir) === this) profileOwners.delete(this.profileDir);
      return { opened: false };
    })();
    try { return await this.closing; } finally { this.closing = null; }
  }
}

export { DeepSeekWebEngine as WebChatEngine };
export default DeepSeekWebEngine;
