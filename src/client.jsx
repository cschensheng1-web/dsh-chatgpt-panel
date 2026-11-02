import React from 'react';
import css from './panel.css';
import { EmbeddedChat, embeddedAvailable } from './EmbeddedChat.jsx';

const PANEL_ID = 'dsh-chatgpt-panel';
export const inject = ['slots', 'layout'];

function ChatIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z" /></svg>;
}

export function apply(ctx) {
  if (typeof ctx.slots?.inject !== 'function' || typeof ctx.slots?.register !== 'function' || typeof ctx.layout?.selectPanel !== 'function') {
    console.warn('[dsh-chatgpt-panel] Required main/sidebar panel API is unavailable.');
    return;
  }
  const Panel = () => embeddedAvailable() ? <EmbeddedChat ctx={ctx} /> :
    <section className="dcp-unsupported" role="status"><h1>当前环境不支持官网内嵌</h1><p>请在适配的 DSH Mac 桌面版中打开此插件。普通 Web 宿主不提供该能力。</p><button onClick={() => ctx.layout.selectPanel(null)}>返回 DSH 对话</button></section>;
  ctx.effect(() => {
    const style = document.createElement('style');
    style.dataset.dshChatPanelStyle = '';
    style.textContent = css;
    document.head.appendChild(style);
    return () => style.remove();
  }, 'dsh-chatgpt-panel: styles');
  ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: PANEL_ID }, Panel));
  ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({ name: 'sidebar.panellist', id: PANEL_ID, order: 0, label: () => 'DeepSeek Chat' }, ChatIcon));
  ctx.effect(() => () => {
    try { if (ctx.layout.panelInfo?.getSnapshot?.()?.activePanelId === PANEL_ID) ctx.layout.selectPanel(null); }
    catch { /* The layout may already be disposing. */ }
  }, 'dsh-chatgpt-panel: return on unload');
}
