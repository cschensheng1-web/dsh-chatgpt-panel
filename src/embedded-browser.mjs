import { officialChatUrl, MAX_CONTEXT } from './project-context.mjs';
import { readLoadedChat } from './webpage-context.mjs';
const OFFICIAL = 'https://chat.deepseek.com/';

export function hasEmbeddedBrowser(bridge) {
  return typeof bridge?.acquire === 'function' && typeof bridge?.release === 'function' && typeof bridge?.onOpenRequested === 'function';
}

function safePopup(value) {
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : null; }
  catch { return null; }
}

// Uses the same main-approved lease and webview bootstrap as the shipped
// Sidebar Browser. Context capture is a separate explicit read-only action.
export class EmbeddedBrowser {
  constructor({ bridge, document, onState = () => {}, initialUrl = OFFICIAL, onLocation = () => {} }) {
    this.bridge = bridge; this.document = document; this.onState = onState;
    this.initialUrl = officialChatUrl(initialUrl) || OFFICIAL; this.onLocation = onLocation; this.loading = true;
    this.view = null; this.lease = null; this.disposed = false;
    this.disposal = null; this.pending = null; this.unsubscribe = null;
    this.listeners = []; this.ready = false;
  }
  emit(value) { if ('loading' in value) this.loading = value.loading; if (!this.disposed) this.onState(value); }
  async mount(host) {
    if (!hasEmbeddedBrowser(this.bridge)) throw Error('当前 DSH 没有提供内嵌官网能力，请使用 Mac 桌面版。');
    if (this.pending || this.view || this.disposed) return this.pending;
    this.pending = this.create(host).catch(async error => {
      this.pending = null;
      await this.dispose();
      throw error;
    });
    return this.pending;
  }
  async create(host) {
    const reservation = await this.bridge.acquire('plugin:dsh-chatgpt-panel:official');
    if (this.disposed) { await this.bridge.release(reservation.lease); return; }
    this.lease = reservation.lease;
    const view = this.document.createElement('webview'); this.view = view;
    view.className = 'dcp-embedded-webview';
    view.setAttribute('aria-label', 'DeepSeek 官网内嵌聊天');
    view.setAttribute('name', reservation.lease);
    view.setAttribute('partition', reservation.partition);
    view.setAttribute('allowpopups', '');
    view.setAttribute('src', 'about:blank#' + reservation.lease);
    const listen = (name, fn) => { view.addEventListener(name, fn); this.listeners.push(() => view.removeEventListener(name, fn)); };
    listen('dom-ready', () => {
      if (!this.ready) { this.ready = true; void this.load(this.initialUrl); }
    });
    listen('did-start-loading', () => this.emit({ loading: true }));
    listen('did-stop-loading', () => this.emit({ loading: false }));
    const navigated = event => {
      this.emit({ loading: false, error: '' });
      const url = officialChatUrl(event.url || this.view?.getURL?.());
      if (url && !this.disposed) this.onLocation(url);
    };
    listen('did-navigate', navigated);
    listen('did-navigate-in-page', navigated);
    listen('did-fail-load', event => {
      if (event.isMainFrame && event.errorCode !== -3) this.emit({ loading: false, error: '官网暂时未能加载，请检查网络后点“重新加载”。' });
    });
    listen('render-process-gone', () => this.emit({ loading: false, error: '内嵌网页已退出，请返回聊天入口后重新打开。' }));
    this.unsubscribe = this.bridge.onOpenRequested(reservation.lease, url => {
      const target = safePopup(url);
      if (target) void this.load(target);
    });
    host.appendChild(view);
    this.emit({ loading: true, error: '' });
  }
  async load(url) {
    if (!this.view || this.disposed) return;
    this.emit({ loading: true, error: '' });
    try { await this.view.loadURL(url); }
    catch { this.emit({ loading: false, error: '官网暂时未能加载，请检查网络后点“重新加载”。' }); }
  }
  reload() {
    if (!this.ready || !this.view || this.disposed) return false;
    this.emit({ loading: true, error: '' });
    try { this.view.reload(); } catch { void this.load(OFFICIAL); }
    return true;
  }
  async readContext() {
    if (!this.ready || !this.view || this.disposed || this.loading) throw Error('请等官网页面加载完成后再读取。');
    const view = this.view;
    if (!officialChatUrl(view.getURL?.())) throw Error('请先打开 DeepSeek 官网的聊天对话。');
    if (typeof view.executeJavaScript !== 'function') throw Error('当前 DSH 不支持读取内嵌页面，请手动粘贴聊天内容。');
    let timer;
    try {
      const value = await Promise.race([
        view.executeJavaScript('(' + readLoadedChat.toString() + ')(' + MAX_CONTEXT + ')', false),
        new Promise((_, reject) => { timer = setTimeout(() => reject(Error('读取超时，请手动粘贴需要的聊天内容。')), 7000); }),
      ]);
      if (this.disposed || view !== this.view) throw Error('页面已关闭，请重新打开聊天后读取。');
      if (value?.error) throw Error(String(value.error).slice(0, 160));
      if (!value || !['messages', 'selection'].includes(value.kind) || typeof value.text !== 'string' || !value.text.trim() || value.text.length > MAX_CONTEXT || !officialChatUrl(value.url) || officialChatUrl(view.getURL?.()) !== officialChatUrl(value.url)) throw Error('网页布局已变化或内容不完整，请手动粘贴需要的聊天内容。');
      return { text: value.text, source: { kind: value.kind, url: officialChatUrl(value.url), count: Number.isSafeInteger(value.count) ? value.count : 0, capturedAt: new Date().toISOString() } };
    } finally { clearTimeout(timer); }
  }
  dispose() {
    if (this.disposal) return this.disposal;
    this.disposed = true;
    this.disposal = (async () => {
      await this.pending?.catch(() => {});
      this.unsubscribe?.(); this.unsubscribe = null;
      for (const remove of this.listeners.splice(0)) remove();
      this.view?.remove(); this.view = null;
      if (this.lease) { const lease = this.lease; this.lease = null; await this.bridge.release(lease); }
    })();
    return this.disposal;
  }
}
