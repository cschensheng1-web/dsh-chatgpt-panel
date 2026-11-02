import { MAX_NOTES, MAX_CONTEXT, MAX_TASK, officialChatUrl } from './project-context.mjs';

const KEY = 'dsh-chatgpt-panel.projects.v1';
const text = (value, max) => typeof value === 'string' ? value.slice(0, max) : '';
const empty = () => ({ notes: '', context: '', task: '', workResult: '', chatUrl: 'https://chat.deepseek.com/', source: null, lastWorkId: '' });
function normalize(input = {}) {
  return {
    notes: text(input.notes, MAX_NOTES), context: text(input.context, MAX_CONTEXT), task: text(input.task, MAX_TASK),
    workResult: text(input.workResult, MAX_CONTEXT), chatUrl: officialChatUrl(input.chatUrl) || 'https://chat.deepseek.com/',
    lastWorkId: text(input.lastWorkId, 256),
    source: input.source && ['manual', 'messages', 'selection'].includes(input.source.kind) ? {
      kind: input.source.kind, url: officialChatUrl(input.source.url),
      count: Number.isSafeInteger(input.source.count) ? Math.max(0, input.source.count) : 0,
      capturedAt: text(input.source.capturedAt, 40),
    } : null,
  };
}

// Only explicit project notes and imported text are stored. No browser profile,
// credentials, guest storage, or background website synchronization is involved.
export class ProjectStore {
  constructor(storage) {
    this.storage = storage; this.listeners = new Set();
    this.state = { activeId: '', projects: {}, error: '' };
    try {
      const raw = storage?.getItem(KEY);
      if (raw && raw.length > 2000000) throw Error('项目资料过大');
      if (raw) {
        const saved = JSON.parse(raw);
        const projects = Object.fromEntries(Object.entries(saved.projects || {}).map(([id, value]) => [id, normalize(value)]));
        this.state = { activeId: text(saved.activeId, 256), projects, error: '' };
      }
    } catch { this.state.error = '无法读取已保存的项目资料；当前内容不会覆盖原存储。'; this.storage = null; }
  }
  getSnapshot = () => this.state;
  subscribe = listener => { this.listeners.add(listener); return () => this.listeners.delete(listener); };
  project(id) { return Object.hasOwn(this.state.projects, id) ? this.state.projects[id] : empty(); }
  publish(next) {
    this.state = next;
    try {
      if (!this.storage) throw Error('storage unavailable');
      const raw = JSON.stringify({ activeId: next.activeId, projects: next.projects });
      if (raw.length > 2000000) throw Error('project storage full');
      this.storage.setItem(KEY, raw);
      this.state = { ...next, error: '' };
    } catch { this.state = { ...next, error: '项目资料暂未写入本机存储，请在关闭 DSH 前复制备份。' }; }
    for (const listener of this.listeners) listener();
  }
  select(id) { if (this.state.activeId !== id) this.publish({ ...this.state, activeId: id }); }
  update(id, patch) {
    if (!id) return;
    const project = normalize({ ...this.project(id), ...patch });
    this.publish({ ...this.state, projects: { ...this.state.projects, [id]: project } });
  }
}
