import React, { useEffect, useRef, useState } from 'react';
import { EmbeddedBrowser, hasEmbeddedBrowser } from './embedded-browser.mjs';

export function embeddedAvailable() { return hasEmbeddedBrowser(window.dshDesktop?.browser); }

export function EmbeddedChat({ initialUrl, onLocation, onController }) {
  const host = useRef(null);
  const browser = useRef(null);
  const [status, setStatus] = useState({ loading: true, error: '' });
  const [generation, setGeneration] = useState(0);
  useEffect(() => {
    let active = true;
    setStatus({ loading: true, error: '' });
    const controller = new EmbeddedBrowser({ bridge: window.dshDesktop?.browser, document, initialUrl, onLocation,
      onState: next => { if (active) setStatus(previous => ({ ...previous, ...next })); } });
    browser.current = controller;
    onController?.(controller);
    void controller.mount(host.current).catch(() => { if (active) setStatus({ loading: false, error: '当前 DSH 无法创建内嵌网页，请返回面板或更新桌面版。' }); });
    return () => { active = false; browser.current = null; onController?.(null); void controller.dispose().catch(() => {}); };
  }, [generation]);
  const reload = () => { if (!browser.current?.reload()) setGeneration(value => value + 1); };
  return <section className="dcp-embedded" aria-label="DSH 内嵌官网聊天">
    <header className="dcp-embedded-top" data-window-drag>
      <strong>官网免费 Chat</strong>
      <div><button disabled={status.loading} onClick={reload}>重新加载</button></div>
    </header>
    <div className="dcp-embedded-note">在官网页面自行登录和聊天。转入 Work 可读取当前已加载的消息，核对后交接。完全退出 DSH 后需重新登录；离开 Chat 或刷新前请保存未发送的草稿。</div>
    {status.loading && <div className="dcp-embedded-status" role="status">正在打开官网…</div>}
    {status.error && <div className="dcp-embedded-error" role="alert">{status.error}</div>}
    <div ref={host} className="dcp-embedded-host" />
  </section>;
}
