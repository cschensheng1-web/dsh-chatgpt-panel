import React, { useEffect, useRef, useState } from 'react';
import { EmbeddedBrowser, hasEmbeddedBrowser } from './embedded-browser.mjs';

export function embeddedAvailable() { return hasEmbeddedBrowser(window.dshDesktop?.browser); }

export function EmbeddedChat({ ctx, onLegacy }) {
  const host = useRef(null);
  const browser = useRef(null);
  const [status, setStatus] = useState({ loading: true, error: '' });
  const [generation, setGeneration] = useState(0);
  useEffect(() => {
    let active = true;
    setStatus({ loading: true, error: '' });
    const controller = new EmbeddedBrowser({ bridge: window.dshDesktop?.browser, document,
      onState: next => { if (active) setStatus(previous => ({ ...previous, ...next })); } });
    browser.current = controller;
    void controller.mount(host.current).catch(() => { if (active) setStatus({ loading: false, error: '当前 DSH 无法创建内嵌网页，请返回面板或更新桌面版。' }); });
    return () => { active = false; browser.current = null; void controller.dispose().catch(() => {}); };
  }, [generation]);
  const reload = () => { if (!browser.current?.reload()) setGeneration(value => value + 1); };
  const returnToDSH = () => {
    try { ctx.layout.selectPanel(null); }
    catch { setStatus({ loading: false, error: '当前 DSH 无法切回原会话，请点击左侧会话列表。' }); }
  };
  return <section className="dcp-embedded" aria-label="DSH 内嵌官网聊天">
    <header className="dcp-embedded-top" data-window-drag>
      <strong>DeepSeek Chat <span>官网内嵌</span></strong>
      <div><button disabled={status.loading} onClick={reload}>重新加载</button><button onClick={returnToDSH}>返回 DSH 对话</button></div>
    </header>
    <div className="dcp-embedded-note">直接在下方官网页面登录和聊天，无需独立 Chrome。完全退出 DSH 后需重新登录；离开或刷新前请先保存未发送的草稿。</div>
    {status.loading && <div className="dcp-embedded-status" role="status">正在打开官网…</div>}
    {status.error && <div className="dcp-embedded-error" role="alert">{status.error}</div>}
    <div ref={host} className="dcp-embedded-host" />
    <details className="dcp-embedded-options"><summary>其他选项</summary><button onClick={onLegacy}>查看旧版面板记录（Chrome 方案）</button></details>
  </section>;
}
