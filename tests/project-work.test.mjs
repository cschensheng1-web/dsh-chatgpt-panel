import test from 'node:test';
import assert from 'node:assert/strict';
import { ProjectStore } from '../src/project-store.mjs';
import { buildHandoff, officialChatUrl } from '../src/project-context.mjs';
import { WorkBridge } from '../src/work-bridge.mjs';
const workspace = { workspaceId: 'project-a', title: '项目 A', path: '/project/a' };
function fixture() {
  const created = []; const opened = []; const released = []; const drafts = new Map(); let fail = false;
  const ctx = {
    sessions: {
      create: async options => { created.push(options); return 'work-' + created.length; },
      retain(id) {
        const binding = { ctx: { id }, session: { getSnapshot: () => ({ openState: fail ? 'error' : 'open', blank: true, running: false }), prompt() { throw Error('MUST NOT SEND'); } } };
        return { binding, ready: Promise.resolve(binding), release() { released.push(id); } };
      },
    },
    conversation: { input: { for: ({ id }) => ({ state: { getSnapshot: () => ({ draft: drafts.get(id) || '' }) }, requestDraftInitialization({ prompt, whenDraftExists }) { assert.equal(whenDraftExists, 'keep'); if (drafts.get(id)) return 'preserved'; drafts.set(id, prompt); return 'applied'; } }) } },
    uiWorkspace: { openSession: id => opened.push(id) },
  };
  return { ctx, created, opened, released, drafts, setFailure(value) { fail = value; } };
}
test('project notes and imported context stay isolated and survive reload without guest secrets', () => {
  const data = new Map(); const storage = { getItem: key => data.get(key), setItem: (key, value) => data.set(key, value) };
  const store = new ProjectStore(storage);
  store.update('a', { notes: '项目 A', context: 'A 的讨论', source: { kind: 'messages', url: 'https://chat.deepseek.com/a/chat?token=secret', cookie: 'must not keep' } });
  store.update('b', { notes: '项目 B' }); store.select('b');
  const reloaded = new ProjectStore(storage);
  assert.equal(reloaded.project('a').context, 'A 的讨论'); assert.equal(reloaded.project('b').context, '');
  assert.equal(reloaded.getSnapshot().activeId, 'b');
  assert.doesNotMatch([...data.values()][0], /token|secret|cookie|must not keep/);
  assert.equal(officialChatUrl('https://user:pass@chat.deepseek.com/'), null);
});
test('handoff contains reviewed task, notes and source context without silently truncating', () => {
  const prompt = buildHandoff(workspace, { task: '实现功能', notes: '约束 A', context: '讨论 B', source: { kind: 'messages', url: 'https://chat.deepseek.com/a/chat' }, workResult: '结果 C' });
  for (const value of ['实现功能', '约束 A', '讨论 B', '结果 C', '/project/a', '可能不含较早历史与附件']) assert.ok(prompt.includes(value));
  assert.throws(() => buildHandoff(workspace, { task: '' }), /填写/);
  assert.throws(() => buildHandoff(workspace, { task: '继续', notes: 'x'.repeat(130000) }), /过长/);
});
test('storage write failure retains editable text and the previous durable copy', () => {
  let raw;let fail=false;
  const storage={getItem:()=>raw,setItem:(key,value)=>{if(fail)throw Error('quota');raw=value;}};
  const store=new ProjectStore(storage);store.update('a',{notes:'saved'});fail=true;store.update('a',{notes:'unsaved edit'});
  assert.equal(store.project('a').notes,'unsaved edit');assert.match(store.getSnapshot().error,/未写入/);
  assert.equal(new ProjectStore(storage).project('a').notes,'saved');
});
test('staging creates in the chosen workspace, preserves native settings, and never sends', async () => {
  const f = fixture(); const bridge = new WorkBridge(f.ctx);
  const id = await bridge.stage(workspace, '交接内容');
  assert.equal(id, 'work-1'); assert.deepEqual(f.created, [{ workspaceId: 'project-a' }]);
  assert.equal(f.drafts.get(id), '交接内容'); assert.deepEqual(f.opened, [id]); assert.deepEqual(f.released, [id]);
});
test('failed preparation can retry without duplicate sessions or overwriting an existing draft', async () => {
  const f = fixture(); const bridge = new WorkBridge(f.ctx); f.setFailure(true);
  await assert.rejects(bridge.stage(workspace, '交接内容'), /未就绪/);
  f.setFailure(false); f.drafts.set('work-1', '用户自己的草稿');
  await assert.rejects(bridge.stage(workspace, '交接内容'), /未覆盖/);
  assert.equal(f.created.length, 1); assert.equal(f.drafts.get('work-1'), '用户自己的草稿'); assert.deepEqual(f.opened, []);
});
test('navigation cancellation after creation does not hijack the active screen', async () => {
  const f = fixture(); const bridge = new WorkBridge(f.ctx); const abort = new AbortController();
  await assert.rejects(bridge.stage(workspace, '交接内容', { signal: abort.signal, onCreated() { abort.abort(); } }), /abort/i);
  assert.deepEqual(f.opened, []); assert.equal(f.drafts.size, 0);
  await bridge.stage(workspace, '交接内容'); assert.equal(f.created.length, 1);
});
test('reading Work only imports completed public answer text, excluding reasoning and tools', async () => {
  const f = fixture(); let released = false;
  f.ctx.sessions.retain = () => ({ ready: Promise.resolve(), release() { released = true; }, binding: {
    session: { getSnapshot: () => ({ openState: 'open', running: false }) }, eventSource: { getSnapshot: () => ({ entries: [
      { type: 'user/message', data: { message: { content: [{ type: 'text', text: 'private instruction' }] } } },
      { kind: 'durable', event: { type: 'assistant/message', surfaceOp: 'append', data: { message: { content: [{ type: 'text', text: '已完成' }, { type: 'reasoning', text: 'hidden reasoning' }, { type: 'tool-call', arguments: 'secret' }] } } } },
    ] }) },
  } });
  assert.equal(await new WorkBridge(f.ctx).readLatest('work-1'), '已完成'); assert.equal(released, true);
});
