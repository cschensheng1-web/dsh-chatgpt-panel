import { MAX_CONTEXT } from './project-context.mjs';

export function workAvailable(ctx) {
  return typeof ctx.sessions?.create === 'function' && typeof ctx.sessions?.retain === 'function' &&
    typeof ctx.conversation?.input?.for === 'function' && typeof ctx.uiWorkspace?.openSession === 'function';
}

// Uses the shipped Session Controller and composer. Staging never calls prompt,
// send, a model selector, a permission toggle, or a persistence-file writer.
export class WorkBridge {
  constructor(ctx) { this.ctx = ctx; this.prepared = new Map(); this.pending = new Map(); }
  stage(workspace, prompt, { signal, onCreated = () => {} } = {}) {
    const key = workspace.workspaceId;
    const pending = this.pending.get(key);
    if (pending) return pending.prompt === prompt ? pending.promise : Promise.reject(Error('正在准备另一份交接，请完成后再重试。'));
    const promise = this.prepare(workspace, prompt, { signal, onCreated }).finally(() => this.pending.delete(key));
    this.pending.set(key, { prompt, promise }); return promise;
  }
  async prepare(workspace, prompt, { signal, onCreated }) {
    if (!workAvailable(this.ctx)) throw Error('当前 DSH 缺少 Work 交接接口，请复制交接内容到原生会话。');
    signal?.throwIfAborted();
    let saved = this.prepared.get(workspace.workspaceId);
    if (!saved || saved.prompt !== prompt) {
      const id = await this.ctx.sessions.create({ workspaceId: workspace.workspaceId });
      saved = { id, prompt }; this.prepared.set(workspace.workspaceId, saved);
      onCreated(id);
    }
    signal?.throwIfAborted();
    const reference = this.ctx.sessions.retain(saved.id, { source: 'dsh-chatgpt-panel:handoff' });
    try {
      await reference.ready; signal?.throwIfAborted();
      const binding = reference.binding;
      const state = binding.session.getSnapshot();
      if (state.openState !== 'open') throw Error('DSH Work 会话暂未就绪，交接内容已保留，可稍后重试。');
      if (state.running || state.blank === false) { this.prepared.delete(workspace.workspaceId); throw Error('此 Work 已经开始，未修改它的内容。请再次点击以创建新的 Work。'); }
      const input = this.ctx.conversation.input.for(binding.ctx);
      const result = input.requestDraftInitialization({ prompt, whenDraftExists: 'keep' });
      if (result === 'blocked') throw Error('Work 输入框正在处理其他操作，请稍后重试。');
      if (result !== 'applied' && input.state.getSnapshot().draft !== prompt) throw Error('该 Work 已有草稿，未覆盖。请打开它核对，或修改任务后创建新 Work。');
      signal?.throwIfAborted();
      this.ctx.uiWorkspace.openSession(saved.id);
      return saved.id;
    } finally { reference.release(); }
  }
  async readLatest(id, { signal } = {}) {
    signal?.throwIfAborted();
    const reference = this.ctx.sessions.retain(id, { source: 'dsh-chatgpt-panel:result' });
    try {
      await reference.ready; signal?.throwIfAborted();
      const binding = reference.binding;
      const state = binding.session.getSnapshot();
      if (state.openState !== 'open') throw Error('暂时无法读取这个 Work，请先在 DSH 中打开它。');
      if (state.running) throw Error('Work 仍在运行，请等回复完成后再读取。');
      const window = (binding.eventSource || binding.session.eventSource).getSnapshot();
      for (const entry of [...window.entries].reverse()) {
        const event = entry.type === 'event' ? entry.event : entry;
        if (event.type !== 'assistant/message' || event.surfaceOp !== 'append') continue;
        const blocks = event.data?.message?.content;
        if (!Array.isArray(blocks)) continue;
        const value = blocks.filter(block => block.type === 'text' && typeof block.text === 'string').map(block => block.text).join('\n\n').trim();
        if (!value) continue;
        if (value.length > MAX_CONTEXT) throw Error('这条 Work 回复过长，请手动选取需要带回 Chat 的部分。');
        return value;
      }
      throw Error('已加载记录中没有可导入的文字回复，请手动复制所需内容。');
    } finally { reference.release(); }
  }
}
