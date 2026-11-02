import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { EmbeddedChat, embeddedAvailable } from './EmbeddedChat.jsx';
import { buildHandoff, projectBrief, MAX_NOTES, MAX_CONTEXT, MAX_TASK } from './project-context.mjs';
import { workAvailable } from './work-bridge.mjs';

function useSource(source) {
  return useSyncExternalStore(listener => source.subscribe(listener), () => source.getSnapshot());
}

export function ProjectPanel({ ctx, store, work }) {
  const workspaces = useSource(ctx.workspaces.list);
  const sessions = useSource(ctx.sessions.list);
  const saved = useSource(store);
  const browser = useRef(null);
  const lifetime = useRef(null);
  if (!lifetime.current) lifetime.current = new AbortController();
  useEffect(() => { const controller = new AbortController(); lifetime.current = controller; return () => controller.abort(); }, []);
  const [tab, setTab] = useState('chat');
  const [materials, setMaterials] = useState(false);
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [copyFallback, setCopyFallback] = useState('');
  const [selectedWork, setSelectedWork] = useState('');
  const items = workspaces.items || [];
  const currentId = ctx.uiWorkspace.selection?.getSnapshot?.()?.sessionId;
  const workspace = items.find(item => item.workspaceId === saved.activeId) || items.find(item => item.sessionIds.includes(currentId)) || items[0];
  const id = workspace?.workspaceId;
  useEffect(() => { if (id) store.select(id); }, [id]);
  const project = store.project(id);
  const patch = value => store.update(id, value);
  const archived = new Set(workspaces.archivedSessionIds || []);
  const workIds = (workspace?.sessionIds || []).filter(sessionId => !archived.has(sessionId));
  const workId = workIds.includes(selectedWork) ? selectedWork : workIds.includes(project.lastWorkId) ? project.lastWorkId : workIds[0] || '';
  let prompt = ''; let promptError = '';
  try { if (workspace) prompt = buildHandoff(workspace, project); } catch (failure) { promptError = failure.message; }
  const run = async (name, action) => {
    if (busy) return;
    setBusy(name); setError(''); setNotice(''); setCopyFallback('');
    try { await action(lifetime.current.signal); }
    catch (failure) { if (!lifetime.current.signal.aborted) setError(failure.message || '操作未完成，内容仍保留在项目资料中。'); }
    finally { if (!lifetime.current.signal.aborted) setBusy(''); }
  };
  const capture = () => {
    setMaterials(true);
    return run('capture', async signal => {
      if (!browser.current) throw Error('请先打开 Chat 页面，或在项目资料中粘贴聊天内容。');
      const result = await browser.current.readContext(); signal.throwIfAborted();
      store.update(id, { context: result.text, source: result.source });
      setNotice(result.source.kind === 'selection' ? '已读取选中的聊天文本，请核对后填写 Work 任务。' : `已读取当前加载的 ${result.source.count} 条消息；较早未加载的历史和附件未包含，请核对。`);
    });
  };
  const stage = () => run('stage', async signal => {
    const text = buildHandoff(workspace, store.project(id));
    await work.stage(workspace, text, { signal, onCreated: sessionId => store.update(id, { lastWorkId: sessionId }) });
  });
  const copy = () => run('copy', async () => {
    const text = projectBrief(project);
    try { await navigator.clipboard.writeText(text); setTab('chat'); setNotice('已复制项目资料和导入的 Work 回复，请粘贴到官网输入框。'); }
    catch { setCopyFallback(text); throw Error('无法自动复制，请选择下方“待复制资料”中的文本复制。'); }
  });
  if (!workspace) return <section className="dcp-empty"><h1>DeepSeek 项目</h1><p>{workspaces.phase === 'loading' ? '正在读取 DSH 项目…' : '请先在 DSH 左侧添加或打开一个工作区，再进入 Chat。'}</p><button onClick={() => ctx.layout.selectPanel(null)}>返回 DSH</button></section>;
  return <section className="dcp-project" aria-label="DeepSeek 项目 Chat 与 Work">
    <header className="dcp-project-top" data-window-drag>
      <div className="dcp-project-title"><strong>DeepSeek 项目</strong><select aria-label="当前项目" value={id} disabled={!!busy} onChange={event => { store.select(event.target.value); setSelectedWork(''); setNotice(''); setError(''); setCopyFallback(''); }}>
        {items.map(item => <option key={item.workspaceId} value={item.workspaceId}>{item.title || item.path}</option>)}
      </select></div>
      <nav role="tablist" aria-label="项目模式"><button role="tab" aria-selected={tab === 'chat'} disabled={!!busy} onClick={() => setTab('chat')}>Chat</button><button role="tab" aria-selected={tab === 'work'} disabled={!!busy} onClick={() => setTab('work')}>Work</button></nav>
      <div className="dcp-project-actions"><button aria-expanded={materials} onClick={() => setMaterials(value => !value)}>项目资料</button><button className="dcp-primary" disabled={!!busy || tab !== 'chat'} onClick={capture}>{busy === 'capture' ? '正在读取…' : '带上聊天转入 Work'}</button></div>
    </header>
    <div className="dcp-project-path" title={workspace.path}>{workspace.path}</div>
    {saved.error && <div className="dcp-warning" role="alert">{saved.error}</div>}
    {error && <div className="dcp-warning" role="alert">{error}</div>}
    {notice && <div className="dcp-notice" role="status">{notice}</div>}
    <div className="dcp-project-body">
      <div className="dcp-chat-stage" hidden={tab !== 'chat'}>
        {embeddedAvailable() ? <EmbeddedChat key={id} initialUrl={project.chatUrl} onLocation={url => store.update(id, { chatUrl: url })} onController={controller => { browser.current = controller; }} /> : <div className="dcp-empty"><h2>当前环境不支持官网内嵌</h2><p>请使用适配的 DSH Mac 桌面版。仍可在右侧手动导入聊天并准备 Work。</p></div>}
      </div>
      {tab === 'work' && <div className="dcp-work-stage" role="tabpanel" aria-label="项目 Work">
        <h1>让 Work 接着做</h1><p>同一项目的 DSH 原生会话。交接会先填入草稿，发送后沿用 DSH 模型、权限和额度。</p>
        <button className="dcp-primary" onClick={() => setMaterials(true)}>准备带上下文的 Work</button>
        <div className="dcp-work-list"><h2>项目中的 Work 对话</h2>{workIds.length ? <>
          <select aria-label="Work 对话" value={workId} disabled={!!busy} onChange={event => setSelectedWork(event.target.value)}>{workIds.map(sessionId => <option key={sessionId} value={sessionId}>{sessions.byId?.[sessionId]?.title || '未命名对话'}</option>)}</select>
          <div className="dcp-button-row"><button disabled={!!busy} onClick={() => { patch({ lastWorkId: workId }); ctx.uiWorkspace.openSession(workId); }}>打开此 Work</button><button disabled={!!busy} onClick={() => run('result', async signal => { const text = await work.readLatest(workId, { signal }); signal.throwIfAborted(); store.update(id, { workResult: text, lastWorkId: workId }); setMaterials(true); setNotice('已导入这条 Work 最新的文字回复，可复制回 Chat。'); })}>{busy === 'result' ? '正在读取…' : '读取最新回复到项目'}</button></div>
        </> : <p>还没有原生会话。填写项目资料和任务后即可创建。</p>}</div>
        <p className="dcp-muted">官网 Chat 需要你将项目资料粘贴或上传；它不会自动读取本地文件。</p>
      </div>}
      {materials && <aside className="dcp-materials" aria-label="项目资料与交接">
        <div className="dcp-materials-title"><h2>项目资料与交接</h2><button aria-label="关闭项目资料" onClick={() => setMaterials(false)}>×</button></div>
        <p className="dcp-muted">本项目的资料和导入文本保存在本机。只有下方展示的内容会随 Work 草稿交接。</p>
        <label>项目资料<textarea aria-label="项目资料" maxLength={MAX_NOTES} value={project.notes} onChange={event => patch({ notes: event.target.value })} placeholder="目标、已确认的决定、约束、进度…" /></label>
        <label>聊天上下文 <small>{project.context.length.toLocaleString()} 字</small><textarea className="dcp-context-input" aria-label="聊天上下文" maxLength={MAX_CONTEXT} value={project.context} onChange={event => patch({ context: event.target.value, source: { kind: 'manual' } })} placeholder="点击读取当前聊天，或将官网讨论的内容粘贴到这里。" /></label>
        <div className="dcp-source">{project.source?.kind === 'messages' ? `网页快照 · ${project.source.count} 条已加载消息 · 不含未加载历史与附件` : project.source?.kind === 'selection' ? '网页快照 · 选中的聊天文本' : '手动导入 / 编辑'}{project.source?.url && <div title={project.source.url}>{project.source.url}</div>}</div>
        <div className="dcp-button-row"><button disabled={!!busy || tab !== 'chat'} onClick={capture}>重新读取当前聊天</button></div>
        <label>Work 下一步做什么<textarea aria-label="Work 下一步做什么" maxLength={MAX_TASK} value={project.task} onChange={event => patch({ task: event.target.value })} placeholder="例如：按照上面的讨论实现功能，并完成验证。" /></label>
        {project.workResult && <label>已导入的 Work 回复<textarea aria-label="已导入的 Work 回复" maxLength={MAX_CONTEXT} value={project.workResult} onChange={event => patch({ workResult: event.target.value })} /></label>}
        <details><summary>查看完整交接内容{prompt ? `（${prompt.length.toLocaleString()} 字）` : ''}</summary><textarea aria-label="完整交接内容" readOnly value={prompt || promptError} /></details>
        <p className="dcp-muted">会先打开 DSH 原生输入框，点击发送才开始调用模型。</p>
        {!workAvailable(ctx) && <p className="dcp-warning">当前 DSH 不支持自动填入，请复制交接内容到原生会话。</p>}
        <button className="dcp-primary dcp-stage-button" disabled={!!busy || !prompt || !workAvailable(ctx)} onClick={stage}>{busy === 'stage' ? '正在准备 Work…' : '新建 Work 草稿'}</button>
        {!prompt && <p className="dcp-muted">{promptError}</p>}
        <button disabled={!!busy || !(project.notes.trim() || project.workResult.trim())} onClick={copy}>复制项目资料给 Chat</button>
        {copyFallback && <label>待复制资料<textarea aria-label="待复制资料" readOnly value={copyFallback} /></label>}
      </aside>}
    </div>
  </section>;
}

export function ProjectReturn({ ctx, store, sessionId, panelId }) {
  const workspaces = useSource(ctx.workspaces.list);
  const workspace = workspaces.items?.find(item => item.sessionIds.includes(sessionId));
  if (!workspace) return null;
  return <button className="dcp-native-return" onClick={() => { store.select(workspace.workspaceId); ctx.layout.selectPanel(panelId); }}>项目 Chat</button>;
}
