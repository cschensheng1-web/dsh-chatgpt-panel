import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { createRoutes } from '../src/routes.mjs';

// Model DSH Desktop's protocol forwarder: it accepts only its app origin,
// removes Origin / Host / Sec-Fetch-Site, and forwards to its loopback Host.
// This exercises real HTTP, rather than fabricating IncomingMessage headers.
test('Desktop forwarded requests work without weakening cross-site protections', async t => {
  const store = { view: () => ({ schema: 1, activeId: null, chats: [] }) };
  const engine = { status: async () => ({ opened: false }), close: async () => {} };
  const app = createRoutes({ store, engine });
  const host = createServer((req, res) => {
    const route = app.routes.find(item => item.path === req.url);
    if (!route) { res.writeHead(404).end(); return; }
    void route.handler(req, res);
  });
  host.listen(0, '127.0.0.1');
  await once(host, 'listening');
  const hostURL = `http://127.0.0.1:${host.address().port}`;
  const proxy = createServer(async (req, res) => {
    const origin = req.headers.origin;
    if (origin !== undefined && origin !== 'dsh-app://app') {
      res.writeHead(403).end();
      return;
    }
    const headers = new Headers(req.headers);
    for (const header of ['host', 'origin', 'cookie', 'sec-fetch-site']) headers.delete(header);
    // Desktop attaches a Host cookie, but plugin routes cannot assume that
    // the dispatcher authenticates them; this fixture tests the route guard.
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    try {
      const response = await fetch(`${hostURL}${req.url}`, {
        method: req.method,
        headers,
        ...(req.method === 'GET' || req.method === 'HEAD' ? {} : { body: Buffer.concat(chunks) }),
        redirect: 'manual',
      });
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(Buffer.from(await response.arrayBuffer()));
    } catch (error) {
      res.writeHead(500).end(error.message);
    }
  });
  proxy.listen(0, '127.0.0.1');
  await once(proxy, 'listening');
  t.after(async () => {
    await app.dispose();
    await Promise.all([new Promise(resolve => proxy.close(resolve)), new Promise(resolve => host.close(resolve))]);
  });
  const proxyURL = `http://127.0.0.1:${proxy.address().port}`;
  const path = '/api/dsh-chatgpt-panel/enable';
  const jsonHeaders = { 'content-type': 'application/json', 'x-dsh-chat': '1' };
  const payload = JSON.stringify({ enabled: true });
  const desktop = await fetch(proxyURL + path, {
    method: 'POST', headers: { ...jsonHeaders, origin: 'dsh-app://app', 'sec-fetch-site': 'same-origin' }, body: payload,
  });
  assert.equal(desktop.status, 200, 'Desktop origin and fetch-site are removed before reaching Host');
  assert.deepEqual(await desktop.json(), { ok: true });

  const blockedProxy = await fetch(proxyURL + path, {
    method: 'POST', headers: { ...jsonHeaders, origin: 'https://attacker.example' }, body: payload,
  });
  assert.equal(blockedProxy.status, 403, 'Desktop rejects foreign origins before forwarding');
  assert.equal(blockedProxy.headers.get('access-control-allow-origin'), null);

  const foreign = await fetch(hostURL + path, {
    method: 'POST', headers: { ...jsonHeaders, origin: 'https://attacker.example' }, body: payload,
  });
  assert.equal(foreign.status, 403);
  assert.equal(foreign.headers.get('access-control-allow-origin'), null);
  const crossSite = await fetch(hostURL + path, {
    method: 'POST', headers: { ...jsonHeaders, origin: hostURL, 'sec-fetch-site': 'cross-site' }, body: payload,
  });
  assert.equal(crossSite.status, 403);
  const sameSite = await fetch(hostURL + path, {
    method: 'POST', headers: { ...jsonHeaders, 'sec-fetch-site': 'same-site' }, body: payload,
  });
  assert.equal(sameSite.status, 403, 'Another same-site origin cannot impersonate the Desktop forwarder');
  const preflight = await fetch(hostURL + path, {
    method: 'OPTIONS', headers: { origin: 'https://attacker.example', 'access-control-request-method': 'POST', 'access-control-request-headers': 'x-dsh-chat,content-type' },
  });
  assert.ok([403, 405].includes(preflight.status));
  assert.equal(preflight.headers.get('access-control-allow-origin'), null);
  const missingHeader = await fetch(hostURL + path, {
    method: 'POST', headers: { 'content-type': 'application/json', origin: hostURL }, body: payload,
  });
  assert.equal(missingHeader.status, 403);
  const form = await fetch(hostURL + path, {
    method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded', origin: hostURL }, body: 'enabled=true',
  });
  assert.equal(form.status, 403);
});
