const ROOT = '/api/dsh-chatgpt-panel';
function json(res, status, value) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', 'referrer-policy': 'no-referrer' });
  res.end(JSON.stringify(value));
}
export function isTrusted(req, mutation = false) {
  const ip = req.socket.remoteAddress;
  if (!['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(ip)) return false;
  let target;
  try {
    target = new URL(`http://${req.headers.host}`);
    if (!['127.0.0.1', 'localhost', '[::1]'].includes(target.hostname) || target.username || target.password || target.pathname !== '/' || target.search || target.hash) return false;
  } catch { return false; }
  const origin = req.headers.origin;
  if (origin && origin !== target.origin) return false;
  if (['cross-site', 'same-site'].includes(req.headers['sec-fetch-site'])) return false;
  // Desktop's dsh-app://app protocol forwards to the local Host after removing
  // Origin and Sec-Fetch-Site. Their absence is not authentication: keep the
  // loopback/Host checks and require a non-simple JSON request with our header.
  if (mutation && (req.headers['x-dsh-chat'] !== '1' || !/^application\/json(?:;|$)/i.test(req.headers['content-type'] ?? ''))) return false;
  return true;
}
async function readBody(req) {
  let size = 0; const chunks = [];
  for await (const chunk of req) { size += chunk.length; if (size > 65536) throw Error('请求过大'); chunks.push(chunk); }
  const body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
  if (!body || Array.isArray(body) || typeof body !== 'object') throw Error('请求格式错误');
  return body;
}
export function createRoutes({ store, engine }) {
  let enabled = false; // Deliberately requires opt-in after each host restart.
  let busy = false;
  let disposed = false;
  const state = async () => ({ ...store.view(), enabled, busy, browserOpen: (await engine.status()).opened });
  const idle = () => { if (busy) throw Error('请先停止并等待当前回复结束。'); };
  const route = (path, method, action) => ({ kind: 'exact', path: ROOT + path, handler: async (req, res) => {
    if (!isTrusted(req, method === 'POST')) return json(res, 403, { error: '仅允许本机 DSH 同源页面访问。' });
    if (req.method !== method) { res.setHeader('allow', method); return json(res, 405, { error: '请求方法不支持' }); }
    try { const body = method === 'POST' ? await readBody(req) : {}; const result = await action(body); json(res, path === '/send' ? 202 : 200, result ?? { ok: true }); }
    catch (error) { json(res, 400, { error: error.message || '操作未完成' }); }
  }});
  const routes = [
    route('/state', 'GET', state),
    route('/enable', 'POST', async b => { idle(); if (typeof b.enabled !== 'boolean') throw Error('需要明确选择实验功能'); enabled = b.enabled; if (!enabled) await engine.close(); }),
    route('/open', 'POST', async () => { if (!enabled) throw Error('请先启用实验网页连接，或直接使用官网入口。'); idle(); await engine.open(); }),
    route('/new', 'POST', () => { idle(); return store.create(); }),
    route('/select', 'POST', b => { store.select(b.id); }),
    route('/delete', 'POST', b => { idle(); store.delete(b.id); }),
    route('/send', 'POST', b => {
      if (!enabled) throw Error('实验网页连接尚未启用；不会调用付费 API。');
      idle();
      if (typeof b.text !== 'string' || !b.text.trim() || b.text.length > 16000) throw Error('消息应为 1–16000 个字符');
      const chat = store.get(b.id);
      if (chat.messages.length && !chat.url) throw Error('此对话没有已确认的网页地址，请先查看官网或新建对话。');
      const url = chat.url;
      const text = b.text.trim();
      const previousMessages = structuredClone(chat.messages);
      const acceptSnapshot = snapshot => {
        // The website virtualizes older messages. Only append this bound turn
        // to the durable local baseline; never replace history with its viewport.
        const turn = snapshot.turnMessages;
        const messages = Array.isArray(turn) && turn[0]?.role === 'user' && turn[0]?.content === text
          ? [...previousMessages, ...turn] : undefined;
        store.snapshot(chat.id, { ...snapshot, messages });
      };
      store.begin(chat.id, text);
      busy = true;
      // A single manual click creates exactly one attempt; never retry or route to an LLM.
      void Promise.resolve().then(() => engine.send({ text, url, onSnapshot: snapshot => { if (!disposed) acceptSnapshot(snapshot); } }))
        .then(snapshot => { if (!disposed) acceptSnapshot(snapshot); })
        .catch(error => { if (!disposed) store.fail(chat.id, error.message || '发送状态未确认，请查看官网。'); })
        .finally(() => { busy = false; });
      return { ok: true };
    }),
    route('/stop', 'POST', async () => { if (busy) { const result = await engine.stop(); if (result?.stopped === false) throw Error(result.reason || '未能确认停止，请在官网操作。'); } }),
  ];
  return { routes, dispose: async () => { disposed = true; enabled = false; await engine.close(); } };
}
