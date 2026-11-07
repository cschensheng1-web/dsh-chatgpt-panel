import { isAbsolute, relative, sep } from 'node:path';
import { createDocumentParser } from './document-reader.mjs';
import { DOCUMENT_LIMITS } from './document-common.mjs';

export const PROJECT_READ_TOOLS = ['autonomy_read_file', 'autonomy_list_files', 'autonomy_search_text', 'autonomy_list_archive'];
// PTC transports may invoke exactly one owned read tool using JSON literals.
// No loops, imports, variables, templates, comments or escalation arguments.
export function parseReadProgram(args) {
  if (!args || typeof args !== 'object' || Object.keys(args).some(key => !['code', 'description'].includes(key)) || typeof args.code !== 'string' || args.code.length > 8192) return;
  const match = /^\s*return\s+await\s+tools\.(autonomy_(?:read_file|list_files|search_text|list_archive))\((\{[\s\S]*\})\);?\s*$/.exec(args.code);
  if (!match) return;
  let value;
  try { value = JSON.parse(match[2]); } catch { return; }
  if (!value || Array.isArray(value) || Object.entries(value).some(([key, val]) => ['__proto__', 'constructor', 'prototype'].includes(key) || !['string', 'number', 'boolean'].includes(typeof val))) return;
  return { name: match[1], arguments: value };
}
const MAX_BYTES = DOCUMENT_LIMITS.inputBytes;
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
  const parser = createDocumentParser();
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
  async function readDocument(scope, resolved, options = {}) {
    const info = await scope.ctx.fs.stat(resolved.target, scope.signal);
    if (info?.type !== 'file') throw Error('请选择项目中的文档文件。');
    if (typeof info.size === 'number' && info.size > MAX_BYTES) throw Error('文件超过 32 MiB，请选择较小的文档。');
    const bytes = await scope.ctx.fs.readBytes(resolved.target, scope.signal, MAX_BYTES);
    if (!(bytes instanceof Uint8Array) || bytes.byteLength > MAX_BYTES) throw Error('文件内容超出只读 Chat 的读取范围。');
    const before = await targetFor(scope, resolved.path);
    if (before.actual !== resolved.actual) throw Error('读取期间文件路径发生变化，请重新读取。');
    const result = await parser.parse(bytes, resolved.path, options, scope.signal);
    // Re-resolve before publishing to reject a changed symlink or directory.
    const fresh = await targetFor(scope, resolved.path);
    if (fresh.actual !== resolved.actual) throw Error('读取期间文件路径发生变化，请重新读取。');
    abort(scope.signal);
    return result;
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
      const offset = boundedInteger(args.offset, 1, 10000000);
      const limit = boundedInteger(args.limit, 200, 400);
      const scope = await rootFor(exec);
      const resolved = await targetFor(scope, args.file_path);
      const document = await readDocument(scope, resolved, args.archive_entry === undefined ? {} : { entry: args.archive_entry });
      if (document.format === 'zip') {
        const listing = JSON.stringify(document.entries.slice(0, 150), null, 2);
        return { path: resolved.path, format: 'zip', text: listing.slice(0, MAX_TEXT), totalLines: 0, offset: 1, warnings: document.warnings, truncated: document.entries.length > 150 || listing.length > MAX_TEXT };
      }
      const value = document.sections.map(s => (s.location ? `[${s.location}]\n` : '') + s.text).join('\n\n');
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
      const warnings = [...document.warnings];
      if (!value.trim()) warnings.push('未提取到可读正文，不能根据空结果推断文件内容。');
      return { path: resolved.path, ...(args.archive_entry === undefined ? {} : { archiveEntry: args.archive_entry }), format: document.format, ...(document.encoding ? { encoding: document.encoding } : {}), text: selected.join('\n'), totalLines: lines.length, offset, warnings, truncated: document.truncated || lineTruncated || offset - 1 + selected.length < lines.length };
    },
    async archive(args, exec) {
      const scope = await rootFor(exec); const resolved = await targetFor(scope, args.file_path);
      const limit = boundedInteger(args.limit, 150, 400);
      const document = await readDocument(scope, resolved, { operation: 'list' });
      return { path: resolved.path, entries: document.entries.slice(0, limit), warnings: document.warnings, truncated: document.truncated || document.entries.length > limit };
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
      const matches = []; let filesRead = 0; let skipped = 0; let incomplete = false; const issues = [];
      const query = args.query.toLocaleLowerCase();
      const maximum = boundedInteger(args.limit, 30, 50);
      for (const file of candidates.slice(0, MAX_SEARCH_FILES)) {
        abort(scope.signal);
        let document; const resolved = await targetFor(scope, file.path);
        try { document = await readDocument(scope, resolved); filesRead++; }
        catch (error) { abort(scope.signal); skipped++; if (issues.length < 8) issues.push({ path: file.path, reason: error.message }); continue; }
        const documents = [];
        if (document.format === 'zip') {
          const candidates = document.entries.filter(e => e.supported);
          for (const entry of candidates.slice(0, 12)) {
            try { documents.push({ document: await readDocument(scope, resolved, { entry: entry.path }), archiveEntry: entry.path }); }
            catch (error) { abort(scope.signal); skipped++; if (issues.length < 8) issues.push({ path: file.path + ':' + entry.path, reason: error.message }); }
          }
          if (candidates.length > 12) issues.push({ path: file.path, reason: '搜索只读取 ZIP 内前 12 个受支持文档。' });
        } else documents.push({ document });
        for (const item of documents) {
          if (item.document.truncated) { incomplete = true; if (issues.length < 8) issues.push({ path: file.path, reason: '文档达到提取上限，仅搜索已提取部分。' }); }
          if (!item.document.sections.some(s => s.text.trim())) { incomplete = true; if (issues.length < 8) issues.push({ path: file.path, reason: '此文档没有提取到可搜索的正文；可能是扫描件。' }); }
          const content = item.document.sections.map(s => (s.location ? `[${s.location}]\n` : '') + s.text).join('\n\n');
          let location;
          for (const [index, line] of content.split(/\r?\n/).entries()) {
            if (line.startsWith('[') && line.endsWith(']')) location = line.slice(1, -1);
            if (line.toLocaleLowerCase().includes(query)) matches.push({ path: file.path, ...(item.archiveEntry ? { archiveEntry: item.archiveEntry } : {}), ...(location ? { location } : {}), line: index + 1, text: line.slice(0, 500) });
            if (matches.length >= maximum) break;
          }
          if (matches.length >= maximum) break;
        }
        if (matches.length >= maximum) break;
      }
      return { matches, filesRead, skipped, issues, truncated: incomplete || listing.truncated || candidates.length > MAX_SEARCH_FILES || matches.length >= maximum || issues.length > 0 };
    },
    dispose() { parser.dispose(); },
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
    add('autonomy_read_file', '只读当前项目的文档正文：Word(doc/docx)、PPT(ppt/pptx，含备注)、PDF文字层、Excel、OpenDocument、EPUB、RTF、HTML及UTF-8/UTF-16/GB18030文本。自动按格式解析，不用切到Agent。按提取后的行号分段，保留页/幻灯片/章节标记；不能读取扫描图片、加密或损坏文件。ZIP用archive_entry指定包内文档，不在磁盘解压。', { file_path: field('string', '相对于当前项目的文件路径。', true), archive_entry: field('string', '可选：ZIP 内文档的完整条目路径，先用 autonomy_list_archive 查看。'), offset: field('number', '提取正文的起始行，从 1 开始；不是原文档排版行。'), limit: field('number', '最多 400 行，默认 200；单次最多约 24,000 字符。') }, { path: stringValue, archiveEntry: field('string', '包内条目'), format: stringValue, encoding: field('string', '纯文字编码'), text: stringValue, offset: integerValue, totalLines: integerValue, warnings: { type: 'array', required: true, items: { type: 'string' } }, truncated: booleanValue }, reader.read);
    add('autonomy_list_files', '只读列出当前项目内的文件目录，寻找资料。项目外符号链接、凭据与依赖目录会跳过；不会运行命令。', { path: field('string', '相对项目的目录，默认当前项目。'), recursive: field('boolean', '是否有限递归，默认 false。'), limit: field('number', '最多 400 项，默认 150。') }, { path: stringValue, entries: { type: 'array', required: true, items: object({ path: stringValue, type: stringValue }) }, truncated: booleanValue }, reader.list);
    add('autonomy_list_archive', '只读查看ZIP内的文档目录、文件大小和格式支持情况。不展开到磁盘，不读取加密条目、符号链接或凭据。可用read_file的archive_entry读取其中的文档；数据库MDF/LDF不是文档正文。', { file_path: field('string', '项目内ZIP路径。', true), limit: field('number', '最多400项，默认150。') }, { path: stringValue, entries: { type: 'array', required: true, items: object({ path: stringValue, size: integerValue, type: stringValue, supported: booleanValue, encrypted: booleanValue }) }, warnings: { type: 'array', required: true, items: { type: 'string' } }, truncated: booleanValue }, reader.archive);
    add('autonomy_search_text', '在当前项目的文本、Word、PPT、PDF文字层等文档正文中搜索普通文字。ZIP内最多搜索12个文档；只做有上限的检索，注意issues和truncated。标明提取后的文件行号、页或幻灯片位置；不修改文件、不运行命令。', { query: field('string', '需要查找的普通文字，不超过 200 字。', true), path: field('string', '相对项目的搜索目录，默认当前项目。'), limit: field('number', '最多 50 个匹配，默认 30。') }, { matches: { type: 'array', required: true, items: object({ path: stringValue, archiveEntry: field('string', '包内条目'), location: field('string', '页或章节'), line: integerValue, text: stringValue }) }, filesRead: integerValue, skipped: integerValue, issues: { type: 'array', required: true, items: object({ path: stringValue, reason: stringValue }) }, truncated: booleanValue }, reader.search);
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
    dispose() { for (const dispose of disposers.splice(0).reverse()) dispose(); owned.clear(); reader.dispose(); },
  };
}
