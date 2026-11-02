// One bounded, read-only snapshot after an explicit user click. It visits only
// recognized rendered message containers; never inputs, cookies, storage, APIs,
// hidden app state, or unloaded history. Unknown layouts fail to manual import.
export function readLoadedChat(limit = 80000) {
  if (location.origin !== 'https://chat.deepseek.com') return { error: '请先回到 DeepSeek 官网聊天页面。' };
  const visible = element => element && element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden' && getComputedStyle(element).display !== 'none';
  const label = element => (element.getAttribute('aria-label') || element.getAttribute('title') || element.textContent || '').trim();
  const risk = /验证码|人机验证|安全验证|请求过于频繁|操作过于频繁|限流|captcha|verify you are human|too many requests|rate limit|security verification/i;
  if (Array.from(document.querySelectorAll('[role="alert"],[role="dialog"],.ds-toast,[class*="captcha" i],iframe[title*="challenge" i],iframe[title*="captcha" i]')).some(element => visible(element) && (risk.test(label(element)) || element.tagName === 'IFRAME' || element.matches('[class*="captcha" i]')))) return { error: '页面正在验证或限流，请先自行在官网处理。' };
  if (Array.from(document.querySelectorAll('button,[role="button"]')).some(element => visible(element) && /^(停止|停止生成|停止回答|Stop|Stop generating|Stop response)(\s|$)/i.test(label(element)))) return { error: '官网仍在生成回复，请完成后再读取。' };
  const containers = Array.from(document.querySelectorAll('[data-virtual-list-item-key],[data-message-id][data-message-role]')).filter(visible);
  const items = containers.filter(element => !containers.some(other => other !== element && other.contains(element)));
  if (items.some(item => /^(streaming|running|generating|pending)$/.test(item.getAttribute('data-status') || ''))) return { error: '官网仍在生成回复，请完成后再读取。' };
  const selection = window.getSelection();
  const selected = selection?.toString().trim();
  const insideMessage = node => items.some(item => item.contains(node));
  const url = location.origin + location.pathname;
  if (selected && insideMessage(selection.anchorNode) && insideMessage(selection.focusNode)) {
    if (selected.length > limit) return { error: '选中内容过长，请缩小范围后重试。' };
    return { text: selected, kind: 'selection', count: 0, url };
  }
  let budget = 25000;
  const render = (node, depth = 0) => {
    if (--budget < 0 || depth > 50) throw Error('页面内容过长，请选中需要交接的部分再读取。');
    if (node.nodeType === Node.TEXT_NODE) return node.textContent || '';
    if (node.nodeType !== Node.ELEMENT_NODE || !visible(node)) return '';
    const tag = node.tagName;
    if (['SCRIPT', 'STYLE', 'INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'IFRAME', 'SVG', 'IMG', 'NAV'].includes(tag) || node.matches('[role="button"],.ds-think-content,.ds-markdown-code-copy-button,[class*="copy-button"]')) return '';
    if (tag === 'BR') return '\n';
    const body = Array.from(node.childNodes).map(child => render(child, depth + 1)).join('');
    if (tag === 'PRE') {
      const fence = '`'.repeat(Math.max(3, ...(body.match(/`+/g) || []).map(run => run.length + 1)));
      const code = node.querySelector('code');
      const language = /(?:^|\s)language-([\w+-]{1,32})(?:\s|$)/.exec(code?.className || '')?.[1] || '';
      return '\n\n' + fence + language + '\n' + body.replace(/\n$/, '') + '\n' + fence + '\n\n';
    }
    if (tag === 'LI') return '\n- ' + body.trim();
    if (tag === 'TD' || tag === 'TH') return body + ' | ';
    return /^(P|DIV|SECTION|ARTICLE|TR|H[1-6]|UL|OL|BLOCKQUOTE)$/.test(tag) ? '\n\n' + body + '\n\n' : body;
  };
  try {
    const messages = [];
    for (const item of items) {
      const assistant = item.matches('.ds-assistant-message-main-content') ? item : item.querySelector('.ds-assistant-message-main-content');
      const user = item.matches('.ds-collapsible-text') ? item : item.querySelector('.ds-collapsible-text');
      const role = item.getAttribute('data-message-role');
      let body = assistant || (role === 'assistant' ? item.querySelector('.ds-markdown') : null);
      let heading = 'DeepSeek';
      if (!body && (role === 'user' || user)) { body = user || item; heading = '用户'; }
      if (!body) continue;
      const value = render(body).trim();
      if (!value) continue;
      messages.push('## ' + heading + '\n\n' + value);
      if (messages.length > 200 || messages.reduce((total, text) => total + text.length, 0) > limit) return { error: '已加载聊天过长，请选中需要交接的部分再读取。' };
    }
    if (!messages.length) return { error: '没有识别到已加载的聊天消息。请在官网打开对话，或手动粘贴内容。' };
    return { text: messages.join('\n\n'), kind: 'messages', count: messages.length, url };
  } catch { return { error: '无法完整读取已加载内容，请选中所需部分或手动粘贴。' }; }
}
