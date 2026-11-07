import { isAbsolute, relative, sep } from 'node:path';

export const PROJECT_READ_TOOLS = ['autonomy_read_file', 'autonomy_list_files', 'autonomy_search_text'];
// PTC transports may invoke exactly one owned read tool using JSON literals.
// No loops, imports, variables, templates, comments or escalation arguments.
export function parseReadProgram(args) {
  if (!args || typeof args !== 'object' || Object.keys(args).some(key => !['code', 'description'].includes(key)) || typeof args.code !== 'string' || args.code.length > 8192) return;
  const match = /^\s*return\s+await\s+tools\.(autonomy_(?:read_file|list_files|search_text))\((\{[\s\S]*\})\);?\s*$/.exec(args.code);
  if (!match) return;
  let value;
  try { value = JSON.parse(match[2]); } catch { return; }
  if (!value || Array.isArray(value) || Object.entries(value).some(([key, val]) => ['__proto__', 'constructor', 'prototype'].includes(key) || !['string', 'number', 'boolean'].includes(typeof val))) return;
  return { name: match[1], arguments: value };
}
const MAX_BYTES = 512 * 1024;
const MAX_TEXT = 24000;
const MAX_ENTRIES = 400;
const MAX_SCANNED = 2500;
const MAX_SEARCH_FILES = 80;
const secretName = name => /^(?:\.env(?:\..*)?|\.npmrc|\.netrc|\.pypirc|\.git-credentials|id_(?:rsa|dsa|ecdsa|ed25519)(?:\.pub)?|(?:credentials|secrets|tokens?)\.(?:json|ya?ml|toml))$/i.test(name) || /\.(?:pem|key|p12|pfx|keystore)$/i.test(name);
const blockedDirectory = name => ['.git', '.ssh', '.aws', '.gnupg', '.azure', '.kube'].includes(name.toLowerCase());
const hiddenInSearch = name => blockedDirectory(name) || ['node_modules', '.venv', 'venv', '__pycache__', 'dist', 'build'].includes(name);
function safeRelative(path) {
  return path.split(/[\\/]/).filter(Boolean).every(part => !secretName(part) && !blockedDirectory(part));
}
function abort(signal) { signal?.throwIfAborted(); }
function boundedInteger(value, fallback, maximum) {
  const result = value === undefined ? fallback : value;
  if (!Number.isSafeInteger(result) || result < 1 || result > maximum) throw Error(`参数必须是 1 到 ${maximum} 的整数。`);
  return result;
}

// This capability reads through DSH's composed filesystem, resolves every target,
// and checks canonical containment. It does not call native read tools behind
// autonomy's guard, use a shell, fetch URLs, or copy a private project database.
export function createProjectReader(agent, context = agent.ctx) {
  async function rootFor(exec) {
    if (exec?.agent && exec.agent !== agent) throw Error('此读取能力只属于当前会话。');
    const signal = exec?.signal;
    abort(signal);
    const ctx = context;
    const cwd = await ctx.workingDirectory.ensure(agent, signal);
    if (typeof cwd !== 'string' || !isAbsolute(cwd)) throw Error('当前 Chat 没有可读取的本地项目目录。');
    const root = await ctx.fs.resolve(cwd, { signal });
    const physical = ctx.fs.processPath(root);
    if (typeof physical !== 'string' || !isAbsolute(physical) || blockedDirectory(physical.split(/[\\/]/).at(-1))) throw Error('当前项目目录不适合只读 Chat。');
    const info = await ctx.fs.stat(root, signal);
    if (info?.type !== 'directory') throw Error('当前项目目录不存在，请先在 DSH 中打开项目。');
    return { ctx, root, physical, signal };
  }
  async function targetFor(scope, requested = '.') {
    if (typeof requested !== 'string' || requested.length > 4096 || /[\u0000-\u001f]/.test(requested)) throw Error('请提供项目内的有效文件路径。');
    if (!safeRelative(requested)) throw Error('只读 Chat 不读取凭据文件或私有配置目录，请改选项目资料。');
    abort(scope.signal);
    const target = await scope.ctx.fs.resolve(requested, { cwd: scope.physical, signal: scope.signal });
    if (!scope.ctx.fs.contains(scope.root, target)) throw Error('只读 Chat 仅能读取当前项目内的文件，项目外路径和外部符号链接已阻止。');
    const actual = scope.ctx.fs.processPath(target);
    if (typeof actual !== 'string' || !isAbsolute(actual)) throw Error('文件没有可验证的本地项目路径。');
    const local = relative(scope.physical, actual);
    if (local === '..' || local.startsWith('..' + sep) || isAbsolute(local) || !safeRelative(local)) throw Error('只读 Chat 不读取项目外路径或凭据文件。');
    return { target, path: local.split(sep).join('/') || '.', actual };
  }
  async function readText(scope, resolved) {
    const info = await scope.ctx.fs.stat(resolved.target, scope.signal);
    if (info?.type !== 'file') throw Error('请选择项目中的普通文本文件。');
    if (typeof info.size === 'number' && info.size > MAX_BYTES) throw Error('文件超过 512 KiB，请先拆分或选择较小的资料文件。');
    const bytes = await scope.ctx.fs.readBytes(resolved.target, scope.signal, MAX_BYTES);
    if (!(bytes instanceof Uint8Array) || bytes.byteLength > MAX_BYTES) throw Error('文件内容超出只读 Chat 的读取范围。');
    let text;
    try { text = new TextDecoder('utf-8', { fatal: true }).decode(bytes); }
    catch { throw Error('当前只读 Chat 支持 UTF-8 文本；PDF、Word、图片等请先转换或使用相应附件功能。'); }
    if (text.includes('\0') || /^(?:%PDF-|PK\u0003\u0004)/.test(text)) throw Error('这不是可直接读取的文本文件，请先转换资料格式。');
    // Re-resolve before publishing to reject a changed symlink or directory.
    const fresh = await targetFor(scope, resolved.path);
    if (fresh.actual !== resolved.actual) throw Error('读取期间文件路径发生变化，请重新读取。');
    abort(scope.signal);
    return text;
  }
  async function walk(scope, requested, recursive, maximum) {
    const start = await targetFor(scope, requested);
    if ((await scope.ctx.fs.stat(start.target, scope.signal))?.type !== 'directory') throw Error('请选择项目中的目录。');
    const queue = [{ ...start, depth: 0 }]; const visited = new Set(); const entries = [];
    let scanned = 0; let truncated = false;
    while (queue.length) {
      abort(scope.signal);
      const current = queue.shift();
      if (visited.has(current.actual)) continue;
      visited.add(current.actual);
      const children = await scope.ctx.fs.listDir(current.target, scope.signal);
      for (const entry of children.sort((a, b) => a.name.localeCompare(b.name))) {
        if (++scanned > MAX_SCANNED) { truncated = true; break; }
        if (!entry.name || /[\\/\u0000-\u001f]/.test(entry.name) || entry.name === '.' || entry.name === '..' || secretName(entry.name) || hiddenInSearch(entry.name)) continue;
        let child;
        try { child = await targetFor(scope, current.path === '.' ? entry.name : current.path + '/' + entry.name); }
        catch (error) { abort(scope.signal); continue; }
        const info = await scope.ctx.fs.stat(child.target, scope.signal);
        if (!info || !['file', 'directory'].includes(info.type)) continue;
        entries.push({ path: child.path, type: info.type });
        if (recursive && info.type === 'directory') {
          if (current.depth < 5) queue.push({ ...child, depth: current.depth + 1 }); else truncated = true;
        }
        if (entries.length >= maximum) { truncated = true; break; }
      }
      if (truncated && (entries.length >= maximum || scanned > MAX_SCANNED)) break;
    }
    return { path: start.path, entries, truncated };
  }
  return {
    async read(args, exec) {
      const scope = await rootFor(exec);
      const resolved = await targetFor(scope, args.file_path);
      const value = await readText(scope, resolved);
      const offset = boundedInteger(args.offset, 1, 10000000);
      const limit = boundedInteger(args.limit, 200, 400);
      const lines = value.split(/\r?\n/); const selected = [];
      let chars = 0; let lineTruncated = false;
      for (let index = offset - 1; index < Math.min(lines.length, offset - 1 + limit); index++) {
        const line = `${index + 1}: ${lines[index]}`;
        if (chars + line.length > MAX_TEXT) {
          if (!selected.length) selected.push(line.slice(0, MAX_TEXT - 16) + ' … [本行截断]');
          lineTruncated = true;
          break;
        }
        selected.push(line); chars += line.length + 1;
      }
      return { path: resolved.path, text: selected.join('\n'), totalLines: lines.length, offset, truncated: lineTruncated || offset - 1 + selected.length < lines.length };
    },
    async list(args, exec) {
      const scope = await rootFor(exec);
      return walk(scope, args.path ?? '.', args.recursive === true, boundedInteger(args.limit, 150, MAX_ENTRIES));
    },
    async search(args, exec) {
      if (typeof args.query !== 'string' || !args.query.trim() || args.query.length > 200) throw Error('请提供 1 到 200 字的普通搜索文字。');
      const scope = await rootFor(exec);
      const listing = await walk(scope, args.path ?? '.', true, MAX_ENTRIES);
      const candidates = listing.entries.filter(entry => entry.type === 'file');
      const matches = []; let filesRead = 0; let skipped = 0;
      const query = args.query.toLocaleLowerCase();
      const maximum = boundedInteger(args.limit, 30, 50);
      for (const file of candidates.slice(0, MAX_SEARCH_FILES)) {
        abort(scope.signal);
        let content;
        try { content = await readText(scope, await targetFor(scope, file.path)); filesRead++; }
        catch { abort(scope.signal); skipped++; continue; }
        for (const [index, line] of content.split(/\r?\n/).entries()) {
          if (line.toLocaleLowerCase().includes(query)) matches.push({ path: file.path, line: index + 1, text: line.slice(0, 500) });
          if (matches.length >= maximum) break;
        }
        if (matches.length >= maximum) break;
      }
      return { matches, filesRead, skipped, truncated: listing.truncated || candidates.length > MAX_SEARCH_FILES || matches.length >= maximum };
    },
  };
}

const field = (type, description, required = false) => ({ type, description, ...required ? { required: true } : {} });
const stringValue = { type: 'string', required: true };
const integerValue = { type: 'integer', required: true };
const booleanValue = { type: 'boolean', required: true };
const object = properties => ({
  type: 'object', additionalProperties: false,
  properties: Object.fromEntries(Object.entries(properties).map(([name, value]) => {
    const copy = { ...value }; if (typeof copy.required === 'boolean') delete copy.required; return [name, copy];
  })),
  required: Object.entries(properties).filter(([, value]) => value.required === true).map(([name]) => name),
});
export function registerProjectReadTools(agent, ctx = agent.ctx) {
  const reader = createProjectReader(agent, ctx); const owned = new Map(); const disposers = [];
  const add = (name, description, parameters, properties, execute) => {
    disposers.push(ctx.tools.register({ name, description, parameters: object(parameters), output: { schema: object(properties), render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }] }, isConcurrencySafe: () => true, execute }));
    owned.set(name, ctx.tools.get(name, agent));
  };
  try {
    add('autonomy_read_file', '只读当前项目内的 UTF-8 文件（文字、Markdown、代码、JSON、CSV）。不能读项目外、凭据、PDF 或 Word；按行分段读取，不修改文件。', { file_path: field('string', '相对于当前项目的文件路径。', true), offset: field('number', '起始行，从 1 开始。'), limit: field('number', '最多 400 行，默认 200。') }, { path: stringValue, text: stringValue, offset: integerValue, totalLines: integerValue, truncated: booleanValue }, reader.read);
    add('autonomy_list_files', '只读列出当前项目内的文件目录，寻找资料。项目外符号链接、凭据与依赖目录会跳过；不会运行命令。', { path: field('string', '相对项目的目录，默认当前项目。'), recursive: field('boolean', '是否有限递归，默认 false。'), limit: field('number', '最多 400 项，默认 150。') }, { path: stringValue, entries: { type: 'array', required: true, items: object({ path: stringValue, type: stringValue }) }, truncated: booleanValue }, reader.list);
    add('autonomy_search_text', '在当前项目的文本资料中进行有范围的纯文字搜索（不是正则表达式）。结果标明文件和行号；不修改文件、不运行命令。', { query: field('string', '需要查找的普通文字，不超过 200 字。', true), path: field('string', '相对项目的搜索目录，默认当前项目。'), limit: field('number', '最多 50 个匹配，默认 30。') }, { matches: { type: 'array', required: true, items: object({ path: stringValue, line: integerValue, text: stringValue }) }, filesRead: integerValue, skipped: integerValue, truncated: booleanValue }, reader.search);
  } catch (error) { for (const dispose of disposers.reverse()) dispose(); throw error; }
  const admitted = toolSet => ctx.tools.schemas(agent, toolSet).filter(schema => owned.has(schema.name) && ctx.tools.get(schema.name, agent, toolSet) === owned.get(schema.name));
  const ptcSchema = () => ctx.tools.selectExecutor(agent).describe([]).schemas.find(schema => schema.name === 'run_code');
  return {
    allows(exec) {
      if (exec.agent !== agent) return false;
      if (owned.has(exec.name)) return ctx.tools.get(exec.name, agent, exec.toolSet) === owned.get(exec.name);
      if (exec.name !== 'run_code' || exec.parent !== undefined || !ptcSchema()) return false;
      const parsed = parseReadProgram(exec.arguments);
      return parsed !== undefined && owned.has(parsed.name) && ctx.tools.get(parsed.name, agent, exec.toolSet) === owned.get(parsed.name);
    },
    presentation(context) {
      const tools = admitted(context?.toolSet); const transport = tools.length && ptcSchema();
      if (!transport) return { tools, sections: [] };
      const guidance = 'Read-only Chat transport: call run_code ONLY as `return await tools.TOOL_NAME(JSON_OBJECT);`, with one of the project-read tools below. Use strict JSON with double-quoted keys and scalar values. No other statements, variables, comments, loops, imports, timeout or sandbox arguments are permitted. Example: return await tools.autonomy_read_file({"file_path":"README.md"});\nAvailable read capabilities (names and JSON parameter schemas):\n' + JSON.stringify(tools.map(({ name, description, parameters }) => ({ name, description, parameters })));
      return { tools: [{ ...transport, description: 'Invoke exactly one project-read capability with a fixed JSON-literal call. No arbitrary code or execution.', parameters: object({ code: field('string', guidance, true), description: field('string', 'Describe the project read.', true) }) }], sections: [{ name: 'autonomy:project-read-transport', order: 41, text: guidance }] };
    },
    dispose() { for (const dispose of disposers.splice(0).reverse()) dispose(); owned.clear(); },
  };
}
