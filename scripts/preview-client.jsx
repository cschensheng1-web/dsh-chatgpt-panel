import React from 'react';
import { createRoot } from 'react-dom/client';
const entries = new Map();
const main = createRoot(document.getElementById('main'));
const nav = document.getElementById('nav');
const source = value => ({ value, listeners: new Set(), getSnapshot() { return this.value; }, subscribe(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }, set(next) { this.value = next; for (const fn of this.listeners) fn(); } });
const workspaces = source({ phase: 'ready', archivedSessionIds: [], items: [
  { workspaceId: 'project-a', title: '演示项目 A', path: '/fixture/project-a', sessionIds: ['existing-work'] },
  { workspaceId: 'project-b', title: '演示项目 B', path: '/fixture/project-b', sessionIds: [] },
] });
const sessions = source({ ids: ['existing-work'], byId: { 'existing-work': { title: '示例 Work', blank: false } } });
const selection = source({ sessionId: 'existing-work' });
const drafts = new Map();
const fixture = window.__previewNative = { created: [], released: [], sent: [], opened: [], drafts: {} };
const ctx = {
  effect(fn) { return fn(); },
  slots: { inject(name, fn) { return fn(); }, register(meta, Comp) {
    if (meta.name === 'main') entries.set(meta.key, Comp);
    if (meta.name === 'sidebar.panellist') {
      const button = document.createElement('button'); button.textContent = '◌ ' + meta.label(); button.onclick = () => ctx.layout.selectPanel(meta.id); nav.append(button); return () => button.remove();
    }
    return () => {};
  } },
  workspaces: { list: workspaces },
  sessions: {
    list: sessions,
    async create(options) {
      const id = 'new-work-' + (fixture.created.length + 1); fixture.created.push(options);
      workspaces.set({ ...workspaces.value, items: workspaces.value.items.map(item => item.workspaceId === options.workspaceId ? { ...item, sessionIds: [...item.sessionIds, id] } : item) });
      sessions.set({ ids: [...sessions.value.ids, id], byId: { ...sessions.value.byId, [id]: { title: '新的 Work 草稿', blank: true } } });
      return id;
    },
    retain(id) {
      const binding = { ctx: { id }, session: { getSnapshot: () => ({ openState: 'open', blank: sessions.value.byId[id]?.blank ?? true, running: false }), prompt: (...args) => { fixture.sent.push(args); } }, eventSource: { getSnapshot: () => ({ hasMore: false, entries: [{ type: 'assistant/message', surfaceOp: 'append', data: { message: { content: [{ type: 'text', text: 'Work 已完成：项目构建通过。' }, { type: 'reasoning', text: '不得导入的内部推理' }] } } }] }) } };
      return { binding, ready: Promise.resolve(binding), release: () => fixture.released.push(id) };
    },
  },
  conversation: { input: { for(scope) {
    if (!drafts.has(scope.id)) drafts.set(scope.id, '');
    return { state: { getSnapshot: () => ({ draft: drafts.get(scope.id) }) }, requestDraftInitialization({ prompt }) {
      if (drafts.get(scope.id)) return 'preserved';
      drafts.set(scope.id, prompt); fixture.drafts[scope.id] = prompt; return 'applied';
    } };
  } } },
  uiWorkspace: { selection, openSession(id) { fixture.opened.push(id); selection.set({ sessionId: id }); ctx.layout.selectPanel(null); } },
  layout: { selectPanel(id) {
    if (id === null) main.render(<section style={{ padding: 32, width: '100%' }}><h1>DSH 原生 Work（本地模拟）</h1><p>本地测试，不调用模型。</p><textarea aria-label="原生 Work 草稿" readOnly style={{ width: '90%', minHeight: 400 }} value={drafts.get(selection.value.sessionId) || ''} /><p><button onClick={() => ctx.layout.selectPanel('dsh-chatgpt-panel')}>返回 Chat 预览</button></p></section>);
    else { const Component = entries.get(id); main.render(<Component />); }
  } },
};
window.__ModuleLoader__ = { load({ id, factory }) {
  if (id !== 'dsh-chatgpt-panel') throw Error('Unexpected plugin');
  const plugin = factory(name => { if (name === 'react') return React; throw Error('Unexpected require ' + name); });
  plugin.apply(ctx); ctx.layout.selectPanel('dsh-chatgpt-panel');
} };
