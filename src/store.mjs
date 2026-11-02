import { mkdirSync, chmodSync, readFileSync, writeFileSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

export function safeChatUrl(value) {
  if (value == null) return null;
  try {
    const u = new URL(value);
    if (u.origin !== 'https://chat.deepseek.com' || u.username || u.password || u.search || u.hash || !/^\/a\/chat\/s\/[a-zA-Z0-9-]+$/.test(u.pathname)) throw Error();
    return u.href;
  } catch { throw new Error('网页会话地址不受支持，请在官网确认后新建对话。'); }
}

export class ChatStore {
  constructor(dir) {
    this.dir = dir;
    mkdirSync(dir, { recursive: true, mode: 0o700 });
    chmodSync(dir, 0o700);
    this.file = join(dir, 'chats.json');
    this.data = { schema: 1, activeId: null, chats: [] };
    try {
      const saved = JSON.parse(readFileSync(this.file, 'utf8'));
      if (saved.schema !== 1 || !Array.isArray(saved.chats)) throw Error('不兼容的聊天文件格式');
      for (const c of saved.chats) {
        if (typeof c.id !== 'string' || !Array.isArray(c.messages)) throw Error('聊天文件损坏');
        c.url = safeChatUrl(c.url);
        if (c.status === 'streaming') { c.status = 'partial'; c.error = '上次运行已中断；发送状态未确认，请先查看官网。'; }
      }
      this.data = saved;
    } catch (error) { if (error.code !== 'ENOENT') throw new Error(`无法安全读取历史，已停止覆盖文件：${error.message}`); }
  }
  save() {
    const temp = `${this.file}.tmp`;
    writeFileSync(temp, JSON.stringify(this.data, null, 2), { mode: 0o600 });
    chmodSync(temp, 0o600);
    renameSync(temp, this.file);
  }
  view() { return structuredClone(this.data); }
  get(id) { const c = this.data.chats.find(c => c.id === id); if (!c) throw Error('对话不存在'); return c; }
  create() {
    if (this.data.chats.length >= 500) throw Error('本地历史已达 500 条，请先删除旧对话。');
    const c = { id: randomUUID(), title: '新对话', updatedAt: Date.now(), url: null, messages: [], status: 'idle', error: '' };
    this.data.chats.unshift(c); this.data.activeId = c.id; this.save(); return c;
  }
  select(id) { this.get(id); this.data.activeId = id; this.save(); }
  delete(id) { this.get(id); this.data.chats = this.data.chats.filter(c => c.id !== id); if (this.data.activeId === id) this.data.activeId = this.data.chats[0]?.id ?? null; this.save(); }
  begin(id, text) {
    const c = this.get(id);
    if (c.status === 'partial' || c.status === 'blocked' || c.status === 'error') throw Error('上一条发送状态尚未确认。请先在官网核对，或新建对话，避免重复发送。');
    c.messages.push({ role: 'user', content: text });
    if (c.title === '新对话') c.title = text.slice(0, 40);
    c.status = 'streaming'; c.error = ''; c.updatedAt = Date.now(); this.save();
  }
  snapshot(id, value) {
    const c = this.get(id);
    const messages = value.messages?.filter(m => ['user', 'assistant'].includes(m.role) && typeof m.content === 'string').map(m => ({ role: m.role, content: m.content.slice(0, 500000) }));
    if (messages?.length) c.messages = messages;
    if (value.url) c.url = safeChatUrl(value.url);
    if (typeof value.title === 'string' && value.title.trim()) c.title = value.title.slice(0, 80);
    c.status = value.status ?? 'streaming';
    c.error = value.reason ?? '';
    c.updatedAt = Date.now();
    this.save();
  }
  fail(id, reason) { const c = this.get(id); c.status = 'error'; c.error = reason; c.updatedAt = Date.now(); this.save(); }
}
