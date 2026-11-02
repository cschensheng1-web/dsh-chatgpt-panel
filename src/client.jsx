import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import css from './panel.css';
import { EmbeddedChat, embeddedAvailable } from './EmbeddedChat.jsx';

const PANEL_ID = 'dsh-chatgpt-panel';
const API_BASE = '/api/dsh-chatgpt-panel';
const OFFICIAL_URL = 'https://chat.deepseek.com/';
const EMPTY_STATE = { chats: [], activeId: null, busy: false, enabled: false, browserOpen: false };

export const inject = ['slots', 'layout'];

function Icon({ kind = 'chat', size = 18, ...props }) {
  const paths = {
    chat: <><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
    arrow: <path d="M12 19V5m-6 6 6-6 6 6" />,
    external: <><path d="M14 3h7v7m0-7L10 14" /><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" /></>,
    copy: <><rect x="8" y="8" width="12" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
    trash: <><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7" /></>,
    settings: <><path d="M4 7h16M4 17h16" /><circle cx="9" cy="7" r="3" /><circle cx="15" cy="17" r="3" /></>,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    stop: <rect x="6" y="6" width="12" height="12" rx="2" />,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[kind] || paths.chat}</svg>;
}

async function request(path, body, signal) {
  const response = await fetch(`${API_BASE}/${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    credentials: 'same-origin',
    headers: body === undefined ? {} : { 'Content-Type': 'application/json', 'X-DSH-Chat': '1' },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
    cache: 'no-store',
  });
  let payload;
  try { payload = await response.json(); }
  catch { throw new Error('无法读取插件响应。请确认插件已启用，再重新打开面板。'); }
  if (!response.ok) throw new Error(payload.error || `请求失败（${response.status}）`);
  return payload;
}

function safeMarkdown(content) {
  const result = DOMPurify.sanitize(marked.parse(String(content || ''), { gfm: true, breaks: true, async: false }), {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'del', 'a', 'blockquote', 'pre', 'code', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
    ALLOWED_ATTR: ['href', 'title', 'start', 'align'],
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP: /^(?:https?:\/\/|mailto:)/i,
  });
  return result.replace(/<a\b/g, '<a target="_blank" rel="noopener noreferrer"');
}

function Markdown({ content }) {
  const ref = useRef(null);
  const html = useMemo(() => safeMarkdown(content), [content]);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const removers = [];
    for (const pre of root.querySelectorAll('pre')) {
      const code = pre.querySelector('code');
      const bar = document.createElement('div');
      bar.className = 'dcp-code-bar';
      const language = document.createElement('span');
      language.textContent = code?.className.match(/language-([\w+-]+)/)?.[1] || '代码';
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = '复制代码';
      const click = async () => {
        try { await navigator.clipboard.writeText(code?.textContent || ''); button.textContent = '已复制'; }
        catch { button.textContent = '复制失败'; }
      };
      button.addEventListener('click', click);
      bar.append(language, button);
      pre.prepend(bar);
      removers.push(() => button.removeEventListener('click', click));
    }
    return () => removers.forEach(remove => remove());
  }, [html]);
  return <div ref={ref} className="dcp-markdown" dangerouslySetInnerHTML={{ __html: html }} />;
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  return <button type="button" className="dcp-copy-message" onClick={async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); clearTimeout(timer.current); timer.current = setTimeout(() => setCopied(false), 1800); }
    catch { setCopied(false); }
  }} aria-label={copied ? '已复制消息' : '复制消息'} title={copied ? '已复制' : '复制消息'}><Icon kind={copied ? 'check' : 'copy'} size={15} />{copied && <span>已复制</span>}</button>;
}

function formatDate(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
}

export function ChatPanel({ ctx, onEmbedded }) {
  const [state, setState] = useState(EMPTY_STATE);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [drafts, setDrafts] = useState({});
  const [pending, setPending] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [atBottom, setAtBottom] = useState(true);
  const mounted = useRef(false);
  const refreshInFlight = useRef(false);
  const list = useRef(null);
  const input = useRef(null);
  const composing = useRef(false);
  const abort = useRef(null);
  const mutationInFlight = useRef(false);
  const active = state.chats.find(chat => chat.id === state.activeId) || null;
  const draftKey = active?.id || '__new';
  const draft = drafts[draftKey] || '';
  const busy = Boolean(state.busy || pending);
  const lockedChat = ['error', 'partial', 'blocked'].includes(active?.status);
  const chatList = useMemo(() => [...state.chats].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).filter(chat => chat.title?.toLocaleLowerCase().includes(query.toLocaleLowerCase())), [state.chats, query]);
  const refresh = useCallback(async () => {
    if (refreshInFlight.current) return;
    refreshInFlight.current = true;
    try {
      const next = await request('state', undefined, abort.current?.signal);
      if (mounted.current) { setState({ ...EMPTY_STATE, ...next }); setLoaded(true); }
    } catch (failure) {
      if (mounted.current && failure.name !== 'AbortError') { setError(failure.message); setLoaded(true); }
    } finally { refreshInFlight.current = false; }
  }, []);
  useEffect(() => {
    mounted.current = true;
    abort.current = new AbortController();
    void refresh();
    const timer = setInterval(() => { if (!document.hidden) void refresh(); }, 750);
    const visible = () => { if (!document.hidden) void refresh(); };
    document.addEventListener('visibilitychange', visible);
    return () => { mounted.current = false; clearInterval(timer); document.removeEventListener('visibilitychange', visible); abort.current?.abort(); };
  }, [refresh]);
  useEffect(() => {
    const element = list.current;
    if (element && atBottom) element.scrollTop = element.scrollHeight;
  }, [active?.messages, active?.id, atBottom]);
  useEffect(() => { setAtBottom(true); setDeleteId(null); }, [active?.id]);
  useEffect(() => {
    if (!input.current) return;
    input.current.style.height = 'auto';
    input.current.style.height = `${Math.min(input.current.scrollHeight, 180)}px`;
  }, [draft]);
  useEffect(() => {
    if (!deleteId && !showSettings && !mobileSidebar) return;
    const escape = event => {
      if (event.key === 'Escape') { setDeleteId(null); setShowSettings(false); setMobileSidebar(false); }
    };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [deleteId, showSettings, mobileSidebar]);

  const mutate = async (path, body = {}) => {
    if (mutationInFlight.current) return null;
    mutationInFlight.current = true;
    setPending(true);
    setError('');
    try { const result = await request(path, body, abort.current?.signal); await refresh(); return result; }
    catch (failure) { if (mounted.current && failure.name !== 'AbortError') setError(failure.message); return null; }
    finally { mutationInFlight.current = false; if (mounted.current) setPending(false); }
  };
  const newChat = async () => { if (busy) return; if (await mutate('new')) { setMobileSidebar(false); input.current?.focus(); } };
  const send = async () => {
    if (!state.enabled || busy || lockedChat || mutationInFlight.current || !draft.trim()) return;
    mutationInFlight.current = true;
    setPending(true);
    setError('');
    const text = draft.trim();
    setAtBottom(true);
    let targetId = active?.id;
    try {
      if (!targetId) {
        const created = await request('new', {}, abort.current?.signal);
        if (!created?.id) throw new Error('无法创建对话，请重新打开面板。');
        targetId = created.id;
        if (mounted.current) setDrafts(previous => ({ ...previous, [targetId]: previous[draftKey] || text }));
      }
      await request('send', { id: targetId, text }, abort.current?.signal);
      if (mounted.current) setDrafts(previous => ({ ...previous, [draftKey]: '', [targetId]: '' }));
    } catch (failure) {
      if (mounted.current && failure.name !== 'AbortError') setError(failure.message);
    } finally {
      mutationInFlight.current = false;
      if (mounted.current) { setPending(false); await refresh(); }
    }
  };
  const official = async () => {
    try {
      if (typeof ctx.sidebarRight?.openTab === 'function') { await ctx.sidebarRight.openTab('browser', { params: { url: OFFICIAL_URL } }); return; }
    } catch { /* fall through to the official website */ }
    window.open(OFFICIAL_URL, '_blank', 'noopener,noreferrer');
  };
  const agent = () => { try { ctx.layout.selectPanel(null); } catch { setError('当前 DSH 版本无法返回 Agent。可点击 DSH 原生会话列表继续。'); } };

  return <div className="dcp-root" data-dsh-chat-panel>
    <aside className={`dcp-sidebar${mobileSidebar ? ' is-open' : ''}`} aria-label="Chat 历史记录">
      <div className="dcp-sidebar-head"><div className="dcp-brand"><span className="dcp-brand-mark">D</span><span>DeepSeek <b>Chat</b></span></div><button className="dcp-icon dcp-mobile-close" onClick={() => setMobileSidebar(false)} aria-label="收起历史记录"><Icon kind="close" /></button></div>
      <button className="dcp-new" onClick={newChat} disabled={busy}><Icon kind="plus" />新建对话<span>⌘ N</span></button>
      <label className="dcp-search"><Icon kind="search" size={15} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索对话" aria-label="搜索本地聊天历史" /></label>
      <div className="dcp-history-heading">本地对话<span>{state.chats.length}</span></div>
      <nav className="dcp-history" aria-label="历史对话">
        {!loaded && <p className="dcp-empty-history">正在读取…</p>}
        {loaded && chatList.length === 0 && <p className="dcp-empty-history">{query ? '没有找到对话' : '从新建对话开始'}</p>}
        {chatList.map(chat => <div key={chat.id} className={`dcp-history-row${chat.id === state.activeId ? ' is-active' : ''}`}>
          <button className="dcp-history-select" disabled={busy} onClick={async () => { if (await mutate('select', { id: chat.id })) setMobileSidebar(false); }} title={chat.title || '新对话'}><span>{chat.title || '新对话'}</span><small>{formatDate(chat.updatedAt)}</small></button>
          <button className="dcp-delete" disabled={busy} aria-label={`删除本地对话：${chat.title || '新对话'}`} title="删除本地记录" onClick={() => setDeleteId(chat.id)}><Icon kind="trash" size={14} /></button>
        </div>)}
      </nav>
      <div className="dcp-sidebar-foot"><span className={`dcp-dot${state.browserOpen ? ' is-online' : ''}`} /><span>{state.browserOpen ? '官网浏览器已打开' : '等待打开官网浏览器'}</span><button className="dcp-icon" onClick={() => setShowSettings(value => !value)} aria-label="聊天设置" title="聊天设置"><Icon kind="settings" size={17} /></button></div>
    </aside>
    {mobileSidebar && <button className="dcp-sidebar-mask" aria-label="关闭历史记录" onClick={() => setMobileSidebar(false)} />}
    <main className="dcp-main">
      <header className="dcp-topbar"><div className="dcp-heading"><button className="dcp-icon dcp-mobile-menu" aria-label="打开历史记录" onClick={() => setMobileSidebar(true)}><Icon kind="menu" /></button><span>DeepSeek Chat</span><span className="dcp-web-badge">网页</span></div><div className="dcp-top-actions"><div className="dcp-mode" aria-label="工作模式"><button className="is-active" aria-pressed="true">Chat</button><button onClick={agent} aria-label="返回 DSH 原生 Agent">Agent</button></div><button className="dcp-icon" onClick={() => setShowSettings(value => !value)} aria-label="聊天设置" title="聊天设置"><Icon kind="settings" /></button></div></header>
      <div className="dcp-route-note">{onEmbedded && <button className="dcp-embedded-entry" disabled={busy} onClick={() => void onEmbedded().catch(failure => setError(failure.message))}>在 DSH 内聊天</button>}<span className="dcp-route-dot" />官网网页聊天<span className="dcp-route-separator">·</span>Agent 使用 DSH 原有配置<button onClick={official}>打开官网<Icon kind="external" size={12} /></button></div>

      {error && <div className="dcp-alert" role="alert"><span>{error}</span><button className="dcp-icon" onClick={() => setError('')} aria-label="关闭错误提示"><Icon kind="close" size={15} /></button></div>}
      {active?.error && <div className="dcp-alert" role="status">{active.error}</div>}
      {showSettings && <section className="dcp-settings" aria-label="聊天设置"><div><strong>网页连接 · 实验功能</strong><button className="dcp-icon" onClick={() => setShowSettings(false)} aria-label="关闭设置"><Icon kind="close" size={16} /></button></div><p>在 Chrome 官网窗口自行登录后，回到这个面板输入，回复会显示在这里。插件不读取或保存账号密码。网页变化、验证码或限流会使聊天暂停。每次 DSH 重启后需重新启用。</p><label className="dcp-enable"><input type="checkbox" checked={state.enabled} disabled={busy} onChange={event => void mutate('enable', { enabled: event.target.checked })} /><span>启用实验性网页聊天连接</span></label><div className="dcp-settings-actions"><button className="dcp-secondary" onClick={() => void mutate('open')} disabled={pending || !state.enabled}>打开 Chrome 登录窗口</button><button className="dcp-text-button" onClick={official}>直接使用官网<Icon kind="external" size={13} /></button></div><small>本地删除只清除插件记录；官网历史和 Chrome 登录状态由对应应用管理。不会自动切换到付费 API。</small></section>}

      <div ref={list} className="dcp-messages" onScroll={event => { const element = event.currentTarget; setAtBottom(element.scrollHeight - element.scrollTop - element.clientHeight < 90); }}>
        {!active?.messages?.length ? <div className="dcp-welcome"><div className="dcp-welcome-mark">D<span>✦</span></div><h1>有什么想一起聊聊的？</h1><p>在这里讨论想法，随时回到 Agent 执行任务。</p>{!state.enabled ? <div className="dcp-start-card"><strong>先选择聊天方式</strong><p>直接在官网使用已有账号，或在设置中启用实验性连接，在这个面板聊天。</p><div><button className="dcp-primary" onClick={official}>打开 DeepSeek 官网<Icon kind="external" size={14} /></button><button className="dcp-secondary" onClick={() => setShowSettings(true)}>连接设置</button></div><small>官网连接未启用。下面的输入框暂不可发送。</small></div> : <div className="dcp-start-card"><strong>官网登录后，回到这里聊天</strong><p>在 Chrome 完成登录后，回到这个输入框聊天。浏览器需保持打开；遇到验证码请在官网自行处理。</p><button className="dcp-secondary" onClick={() => void mutate('open')} disabled={pending}>打开 Chrome 登录窗口<Icon kind="external" size={14} /></button></div>}<div className="dcp-suggestions">{['帮我梳理一个想法', '解释一段代码', '一起制定学习计划'].map(text => <button key={text} disabled={!state.enabled || busy || lockedChat} onClick={() => { setDrafts(previous => ({ ...previous, [draftKey]: text })); input.current?.focus(); }}>{text}<span>↗</span></button>)}</div></div> : <div className="dcp-message-list">{active.messages.map((message, index) => <article key={message.id || `${index}-${message.role}`} className={`dcp-message dcp-message-${message.role}`} aria-label={message.role === 'user' ? '你的消息' : 'DeepSeek 回复'}><div className="dcp-message-label">{message.role === 'user' ? '你' : <><span className="dcp-mini-mark">D</span>DeepSeek</>}</div><div className="dcp-message-content">{message.role === 'user' ? <div className="dcp-user-text">{message.content}</div> : <Markdown content={message.content} />}{message.role === 'assistant' && <CopyButton text={message.content || ''} />}</div></article>)}{state.busy && <div className="dcp-stream-state" role="status"><span /><span /><span />正在读取官网回复</div>}{active.status === 'partial' && <p className="dcp-partial-note">回复尚未确认完成，已保留当前内容。请到官网查看。</p>}{active.status === 'blocked' && <p className="dcp-partial-note">网页连接已暂停。请到官网核对这条消息的发送情况。</p>}{lockedChat && <div className="dcp-recovery"><p>回复读取已中断。可以同步官网已有回复，或先在官网核对消息。</p><button className="dcp-secondary" disabled={busy || !state.enabled || !active.url} onClick={() => void mutate('sync', { id: active.id })}>同步官网回复</button><button className="dcp-secondary" onClick={official}>查看官网<Icon kind="external" size={13} /></button><button className="dcp-secondary" disabled={busy} onClick={newChat}>新建对话</button></div>}</div>}
      </div>
      {!atBottom && <button className="dcp-scroll-bottom" onClick={() => { setAtBottom(true); list.current?.scrollTo({ top: list.current.scrollHeight, behavior: 'smooth' }); }} aria-label="滚动到最新消息">↓</button>}
      <footer className="dcp-composer-wrap"><form className={`dcp-composer${!state.enabled ? ' is-disabled' : ''}`} onSubmit={event => { event.preventDefault(); void send(); }}><textarea ref={input} value={draft} disabled={!state.enabled || lockedChat} placeholder={lockedChat ? '此对话发送状态未确认，请先核对官网' : state.enabled ? '给 DeepSeek 发送消息…' : '在连接设置中启用网页聊天'} aria-label="聊天消息" rows={1} maxLength={16000} onChange={event => setDrafts(previous => ({ ...previous, [draftKey]: event.target.value }))} onCompositionStart={() => { composing.current = true; }} onCompositionEnd={() => { composing.current = false; }} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && !composing.current && event.keyCode !== 229) { event.preventDefault(); void send(); } }} /><div className="dcp-composer-bottom"><button className="dcp-composer-source" type="button" onClick={() => setShowSettings(true)}><span className={`dcp-dot${state.enabled ? ' is-online' : ''}`} />{state.enabled ? '官网连接 · 实验性' : '尚未连接'}</button>{state.busy ? <button type="button" className="dcp-send is-stop" title="停止官网回复" aria-label="停止回复" disabled={pending} onClick={() => void mutate('stop')}><Icon kind="stop" size={17} /></button> : <button type="submit" className="dcp-send" aria-label="发送消息" title="发送消息" disabled={!state.enabled || busy || lockedChat || !draft.trim()}><Icon kind="arrow" size={20} /></button>}</div></form><div className="dcp-composer-caption">{state.enabled ? 'Enter 发送 · Shift + Enter 换行 · 网页操作受官网限制' : 'Chat 不调用 DSH 模型 API · Agent 保留原有功能'}<button onClick={agent}>返回 Agent ↗</button></div></footer>
    </main>
    {deleteId && <div className="dcp-dialog-mask" role="presentation" onMouseDown={event => { if (event.currentTarget === event.target) setDeleteId(null); }}><section className="dcp-dialog" role="dialog" aria-modal="true" aria-labelledby="dcp-delete-title"><h2 id="dcp-delete-title">删除这条本地记录？</h2><p>这只会清除插件中的聊天记录，不会删除 DeepSeek 官网的对话。</p><div><button className="dcp-secondary" autoFocus onClick={() => setDeleteId(null)}>取消</button><button className="dcp-danger" disabled={busy} onClick={async () => { if (await mutate('delete', { id: deleteId })) setDeleteId(null); }}>删除本地记录</button></div></section></div>}
  </div>;
}

export function apply(ctx) {
  if (typeof ctx.slots?.inject !== 'function' || typeof ctx.slots?.register !== 'function' || typeof ctx.layout?.selectPanel !== 'function') {
    console.warn('[dsh-chatgpt-panel] This DSH version does not expose the required main/sidebar panel API.');
    return;
  }
  const Panel = () => {
    const [mode, setMode] = useState(() => {
      if (!embeddedAvailable()) return 'legacy';
      try { return localStorage.getItem('dsh-chatgpt-panel-view') === 'legacy' ? 'legacy' : 'embedded'; } catch { return 'embedded'; }
    });
    const choose = next => {
      setMode(next);
      try { localStorage.setItem('dsh-chatgpt-panel-view', next); } catch { /* optional preference only */ }
    };
    const enterEmbedded = async () => {
      await request('enable', { enabled: false });
      choose('embedded');
    };
    useEffect(() => {
      if (mode === 'embedded') void request('enable', { enabled: false }).catch(() => {});
    }, [mode]);
    return mode === 'embedded' ? <EmbeddedChat ctx={ctx} onLegacy={() => choose('legacy')} />
      : <ChatPanel ctx={ctx} onEmbedded={embeddedAvailable() ? enterEmbedded : undefined} />;
  };
  const PanelIcon = () => <Icon kind="chat" size={18} />;
  try {
    ctx.effect(() => {
      const style = document.createElement('style');
      style.dataset.dshChatPanelStyle = '';
      style.textContent = css;
      document.head.appendChild(style);
      return () => style.remove();
    }, 'dsh-chatgpt-panel: styles');
    // slots.inject registrations are bound to the Cordis context, matching the
    // shipped DSH Plugins panel. The host disposes both slots on plugin unload.
    ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: PANEL_ID }, Panel));
    ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({ name: 'sidebar.panellist', id: PANEL_ID, order: 0, label: () => 'DeepSeek Chat' }, PanelIcon));
    ctx.effect(() => () => {
      try {
        if (ctx.layout.panelInfo?.getSnapshot?.()?.activePanelId === PANEL_ID) ctx.layout.selectPanel(null);
      } catch { /* host is already disposing its layout */ }
    }, 'dsh-chatgpt-panel: restore Agent on disposal');
  } catch (error) {
    console.warn('[dsh-chatgpt-panel] Panel registration failed; use the original DSH conversation.', error);
  }
}
