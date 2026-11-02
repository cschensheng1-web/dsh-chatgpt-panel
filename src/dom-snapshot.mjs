// A small, deliberately conservative rendered-DOM adapter. It never reads
// cookies, storage, network responses, credentials, or the login form.
export const DEEPSEEK_ORIGIN = 'https://chat.deepseek.com';

export function validateChatUrl(value, { allowNew = false } = {}) {
  if (value === null && allowNew) return `${DEEPSEEK_ORIGIN}/`;
  if (typeof value !== 'string' || value.length > 2048) throw new Error('INVALID_CHAT_URL');
  let url;
  try { url = new URL(value); } catch { throw new Error('INVALID_CHAT_URL'); }
  if (url.origin !== DEEPSEEK_ORIGIN || url.username || url.password || url.search || url.hash ||
      !/^\/a\/chat\/s\/[A-Za-z0-9-]+$/.test(url.pathname)) {
    throw new Error('INVALID_CHAT_URL');
  }
  return url.href;
}

function safeHref(value) {
  try {
    const url = new URL(value, DEEPSEEK_ORIGIN);
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ?
      url.href.replace(/[()\\]/g, char => `\\${char}`) : null;
  } catch { return null; }
}

const escapeText = text => String(text ?? '').replace(/\\/g, '\\\\').replace(/([`*_[\]<>])/g, '\\$1');
const rawText = node => node?.tag === 'BR' ? '\n' : node?.tag === '#text' ?
  String(node.text ?? '') : (node?.children ?? []).map(rawText).join('');

function plainTextFromTree(node) {
  if (!node) return '';
  if (node.tag === '#text') return String(node.text ?? '');
  if (node.tag === 'BR') return '\n';
  const value = (node.children ?? []).map(plainTextFromTree).join('');
  return /^(?:P|DIV|LI|SECTION|ARTICLE|TR|H[1-6])$/.test(node.tag) ? `${value}\n` : value;
}

/** Convert a plain, filtered DOM tree to Markdown without rendering raw HTML. */
export function markdownFromTree(node, depth = 0) {
  if (!node || depth > 64) return '';
  const tag = String(node.tag ?? '').toUpperCase();
  const children = node.children ?? [];
  const inner = () => children.map(child => markdownFromTree(child, depth + 1)).join('');
  if (tag === '#TEXT') return escapeText(node.text);
  if (['SCRIPT', 'STYLE', 'IFRAME', 'BUTTON', 'INPUT', 'TEXTAREA', 'SVG', 'IMG'].includes(tag)) return '';
  if (tag === 'BR') return '\n';
  if (tag === 'PRE') {
    const code = children.find(child => child.tag === 'CODE') ?? node;
    const text = rawText(code).replace(/\n$/, '');
    const longest = Math.max(0, ...(text.match(/`+/g) ?? []).map(run => run.length));
    const fence = '`'.repeat(Math.max(3, longest + 1));
    const language = /^[A-Za-z0-9_+-]{1,32}$/.test(code.language ?? '') ? code.language : '';
    return `\n\n${fence}${language}\n${text}\n${fence}\n\n`;
  }
  if (tag === 'CODE') {
    const text = rawText(node);
    const longest = Math.max(0, ...(text.match(/`+/g) ?? []).map(run => run.length));
    const fence = '`'.repeat(Math.max(1, longest + 1));
    return `${fence} ${text} ${fence}`;
  }
  if (tag === 'A') {
    const href = safeHref(node.href);
    return href ? `[${inner()}](${href})` : inner();
  }
  if (tag === 'STRONG' || tag === 'B') return `**${inner()}**`;
  if (tag === 'EM' || tag === 'I') return `*${inner()}*`;
  if (/^H[1-6]$/.test(tag)) return `\n\n${'#'.repeat(Number(tag[1]))} ${inner().trim()}\n\n`;
  if (tag === 'BLOCKQUOTE') return `\n\n${inner().trim().split('\n').map(line => `> ${line}`).join('\n')}\n\n`;
  if (tag === 'HR') return '\n\n---\n\n';
  if (tag === 'UL' || tag === 'OL') {
    const start = Number.isInteger(node.start) ? node.start : 1;
    return '\n' + children.filter(child => child.tag === 'LI').map((child, index) => {
      const lines = markdownFromTree(child, depth + 1).trim().split('\n');
      const marker = tag === 'OL' ? `${start + index}. ` : '- ';
      return marker + lines[0] + lines.slice(1).map(line => `\n${' '.repeat(marker.length)}${line}`).join('');
    }).join('\n') + '\n';
  }
  if (tag === 'LI') return inner();
  if (['P', 'DIV', 'SECTION', 'ARTICLE', 'TABLE', 'TR'].includes(tag)) return `\n\n${inner()}\n\n`;
  if (tag === 'TD' || tag === 'TH') return `${inner()} | `;
  return inner();
}

export function normalizeDomSnapshot(snapshot) {
  return {
    ...snapshot,
    messages: (snapshot.messages ?? []).map(message => ({
      key: message.key,
      role: message.role,
      content: message.role === 'user' ? String(message.text ?? plainTextFromTree(message.tree)).trim() :
        markdownFromTree(message.tree).trim(),
      explicitComplete: Boolean(message.explicitComplete),
      terminalActions: Boolean(message.terminalActions),
    })),
  };
}

/**
 * Executed by Playwright as a one-off, read-only DOM evaluation. Keep this
 * function self-contained; no init scripts or page API monkey-patching.
 * Selectors are based on the inspected upstream project, not a DeepSeek API
 * contract. Unknown layouts produce no usable message keys and fail closed.
 */
export function readVisibleDom() {
  const visible = element => {
    if (!element || !element.getClientRects().length) return false;
    const style = getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden';
  };
  const label = element => `${element.getAttribute('aria-label') ?? ''} ${element.getAttribute('title') ?? ''} ${element.textContent ?? ''}`.trim();
  const stopPattern = /^(?:停止|停止生成|停止回答|Stop|Stop generating|Stop response)(?:\s|$)/i;
  const riskPattern = /验证码|人机验证|安全验证|请求(?:过于|太)频繁|操作过于频繁|访问过于频繁|限流|稍后重试|服务繁忙|系统繁忙|captcha|verify you are human|too many requests|rate limit|unusual activity|security verification/i;
  const controls = Array.from(document.querySelectorAll('button,[role="button"]')).filter(visible);
  const stopPresent = controls.some(element => stopPattern.test(label(element)));
  const riskNodes = Array.from(document.querySelectorAll('[role="alert"],[role="dialog"],[aria-live="assertive"],.ds-toast,[class*="captcha" i],[id*="captcha" i],iframe[title*="challenge" i],iframe[title*="captcha" i]')).filter(visible);
  const blockedNode = riskNodes.find(element => riskPattern.test(label(element)) || element.tagName === 'IFRAME' ||
    element.matches('[class*="captcha" i],[id*="captcha" i]'));
  // Do not classify model-generated discussion of captcha/rate limits as a
  // platform block: only inspect alerts, verification widgets, and headings.
  const blockedHeading = Array.from(document.querySelectorAll('h1,h2')).filter(visible)
    .find(element => !element.closest('[data-virtual-list-item-key],[data-message-role]') && riskPattern.test(label(element)));
  const blocked = Boolean(blockedNode || blockedHeading);
  const blockedReason = blocked ? '页面出现验证、风控或限流提示；请自行在官网处理。' : undefined;
  let budget = 30000;
  const tree = (node, depth = 0, preserveWhitespace = false) => {
    if (--budget < 0 || depth > 64) return null;
    if (node.nodeType === Node.TEXT_NODE) return { tag: '#text', text: node.textContent ?? '' };
    if (node.nodeType !== Node.ELEMENT_NODE) return null;
    const tag = node.tagName;
    if (['SCRIPT', 'STYLE', 'IFRAME', 'BUTTON', 'INPUT', 'TEXTAREA', 'SVG', 'IMG', 'NAV'].includes(tag) ||
        node.matches('[role="button"],.ds-think-content,.ds-markdown-code-copy-button,[class*="copy-button"]') ||
        (!preserveWhitespace && !visible(node))) return null;
    const result = { tag, children: Array.from(node.childNodes).map(child => tree(child, depth + 1, preserveWhitespace || tag === 'PRE')).filter(Boolean) };
    if (tag === 'A') result.href = node.getAttribute('href') ?? '';
    if (tag === 'CODE') result.language = /(?:^|\s)language-([A-Za-z0-9_+-]+)/.exec(node.className)?.[1] ?? '';
    if (tag === 'OL') result.start = Number.parseInt(node.getAttribute('start') ?? '1', 10) || 1;
    return result;
  };
  const elements = Array.from(document.querySelectorAll('[data-virtual-list-item-key],[data-message-id][data-message-role]'))
    .filter(visible);
  const items = elements.filter(element => !elements.some(other => other !== element && other.contains(element)));
  const messages = [];
  for (const item of items) {
    const key = item.getAttribute('data-virtual-list-item-key') ?? item.getAttribute('data-message-id');
    if (!key || key.length > 512) continue;
    const assistant = item.matches('.ds-assistant-message-main-content') ? item : item.querySelector('.ds-assistant-message-main-content');
    const thinking = item.matches('.ds-think-content') ? item : item.querySelector('.ds-think-content');
    const user = item.matches('.ds-collapsible-text') ? item : item.querySelector('.ds-collapsible-text');
    const declaredRole = item.getAttribute('data-message-role');
    // The assistant's main body is absent while it is thinking or mounting.
    // A virtual-list key is only an identity, never proof of a user message.
    const role = declaredRole === 'assistant' || assistant || thinking ? 'assistant' : declaredRole === 'user' || user ? 'user' : null;
    if (!role) continue;
    let body = role === 'assistant' ? assistant : user ?? item;
    if (!body && declaredRole === 'assistant' && !thinking) body = item;
    if (role === 'assistant' && body) body = body.matches('.ds-markdown') ? body : body.querySelector('.ds-markdown') ?? body;
    const contentTree = body ? tree(body) : null;
    const status = item.getAttribute('data-status') ?? body?.getAttribute('data-status') ?? '';
    const actions = Array.from(item.querySelectorAll('button,[role="button"]')).filter(visible).map(label);
    messages.push({
      key, role, tree: contentTree,
      explicitComplete: /^(?:complete|completed|finished|done)$/.test(status),
      terminalActions: actions.some(value => /重新生成|再生成|Regenerate|Retry response|^Read aloud\b|^朗读/i.test(value)),
    });
  }
  const allTextareas = Array.from(document.querySelectorAll('textarea'));
  const available = allTextareas.map((element, index) => ({ element, index }))
    .filter(({ element }) => visible(element) && !element.disabled && !element.readOnly);
  const composer = available.length === 1 ? {
    selector: 'textarea', index: available[0].index, value: available[0].element.value,
  } : null;
  return {
    url: location.href,
    title: document.title.replace(/\s*[-–|]\s*DeepSeek\s*$/i, '').trim().slice(0, 160),
    messages, composer, stopPresent, blocked, blockedReason, truncated: budget < 0,
  };
}
