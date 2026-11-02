import React from 'react';
import css from './panel.css';
import { ProjectPanel, ProjectReturn } from './ProjectPanel.jsx';
import { ProjectStore } from './project-store.mjs';
import { WorkBridge } from './work-bridge.mjs';

const PANEL_ID = 'dsh-chatgpt-panel';
export const inject = ['slots', 'layout', 'workspaces', 'sessions', 'uiWorkspace', 'conversation'];

function ChatIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z" /></svg>;
}

export function apply(ctx) {
  if (typeof ctx.slots?.inject !== 'function' || typeof ctx.slots?.register !== 'function' || typeof ctx.layout?.selectPanel !== 'function') {
    console.warn('[dsh-chatgpt-panel] Required main/sidebar panel API is unavailable.');
    return;
  }
  let storage;
  try { storage = window.localStorage; } catch { /* A readable save notice is shown by the project store. */ }
  const store = new ProjectStore(storage);
  const work = new WorkBridge(ctx);
  const Panel = () => <ProjectPanel ctx={ctx} store={store} work={work} />;
  const Return = props => <ProjectReturn {...props} ctx={ctx} store={store} panelId={PANEL_ID} />;
  ctx.effect(() => {
    const style = document.createElement('style');
    style.dataset.dshChatPanelStyle = '';
    style.textContent = css;
    document.head.appendChild(style);
    return () => style.remove();
  }, 'dsh-chatgpt-panel: styles');
  ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: PANEL_ID }, Panel));
  ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({ name: 'sidebar.panellist', id: PANEL_ID, order: 0, label: () => 'DeepSeek Chat' }, ChatIcon));
  for (const slot of ['conversation.session.header.actions', 'conversation.hero.options']) {
    ctx.slots.inject(slot, () => ctx.slots.register({ name: slot, id: 'dsh-chatgpt-panel:return', order: 10 }, Return));
  }
  ctx.effect(() => () => {
    try { if (ctx.layout.panelInfo?.getSnapshot?.()?.activePanelId === PANEL_ID) ctx.layout.selectPanel(null); }
    catch { /* The layout may already be disposing. */ }
  }, 'dsh-chatgpt-panel: return on unload');
}
