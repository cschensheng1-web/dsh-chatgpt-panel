/* dsh-chatgpt-panel; built from src/client.jsx */
window.__ModuleLoader__.load({id:'dsh-chatgpt-panel',factory:(require)=>{const module={exports:{}};const exports=module.exports;
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.jsx
var client_exports = {};
__export(client_exports, {
  ChatPanel: () => ChatPanel,
  apply: () => apply2,
  inject: () => inject
});
module.exports = __toCommonJS(client_exports);
var import_react = __toESM(require("react"), 1);

// node_modules/marked/lib/marked.esm.js
function L() {
  return { async: false, breaks: false, extensions: null, gfm: true, hooks: null, pedantic: false, renderer: null, silent: false, tokenizer: null, walkTokens: null };
}
var T = L();
function G(u3) {
  T = u3;
}
var I = { exec: () => null };
function h(u3, e = "") {
  let t = typeof u3 == "string" ? u3 : u3.source, n = { replace: (r, i) => {
    let s = typeof i == "string" ? i : i.source;
    return s = s.replace(m.caret, "$1"), t = t.replace(r, s), n;
  }, getRegex: () => new RegExp(t, e) };
  return n;
}
var m = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceTabs: /^\t+/, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] /, listReplaceTask: /^\[[ xX]\] +/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (u3) => new RegExp(`^( {0,3}${u3})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}#`), htmlBeginRegex: (u3) => new RegExp(`^ {0,${Math.min(3, u3 - 1)}}<(?:[a-z].*>|!--)`, "i") };
var be = /^(?:[ \t]*(?:\n|$))+/;
var Re = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/;
var Te = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
var E = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
var Oe = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
var F = /(?:[*+-]|\d{1,9}[.)])/;
var ie = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/;
var oe = h(ie).replace(/bull/g, F).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex();
var we = h(ie).replace(/bull/g, F).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex();
var j = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/;
var ye = /^[^\n]+/;
var Q = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/;
var Pe = h(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Q).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
var Se = h(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, F).getRegex();
var v = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
var U = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
var $e = h("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", U).replace("tag", v).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
var ae = h(j).replace("hr", E).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex();
var _e = h(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", ae).getRegex();
var K = { blockquote: _e, code: Re, def: Pe, fences: Te, heading: Oe, hr: E, html: $e, lheading: oe, list: Se, newline: be, paragraph: ae, table: I, text: ye };
var re = h("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", E).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex();
var Le = { ...K, lheading: we, table: re, paragraph: h(j).replace("hr", E).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", re).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex() };
var Me = { ...K, html: h(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", U).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: I, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: h(j).replace("hr", E).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", oe).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() };
var ze = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
var Ae = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
var le = /^( {2,}|\\)\n(?!\s*$)/;
var Ie = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
var D = /[\p{P}\p{S}]/u;
var W = /[\s\p{P}\p{S}]/u;
var ue = /[^\s\p{P}\p{S}]/u;
var Ee = h(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, W).getRegex();
var pe = /(?!~)[\p{P}\p{S}]/u;
var Ce = /(?!~)[\s\p{P}\p{S}]/u;
var Be = /(?:[^\s\p{P}\p{S}]|~)/u;
var qe = h(/link|code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<!`)(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("code", /(?<!`)(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex();
var ce = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/;
var ve = h(ce, "u").replace(/punct/g, D).getRegex();
var De = h(ce, "u").replace(/punct/g, pe).getRegex();
var he = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)";
var He = h(he, "gu").replace(/notPunctSpace/g, ue).replace(/punctSpace/g, W).replace(/punct/g, D).getRegex();
var Ze = h(he, "gu").replace(/notPunctSpace/g, Be).replace(/punctSpace/g, Ce).replace(/punct/g, pe).getRegex();
var Ge = h("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, ue).replace(/punctSpace/g, W).replace(/punct/g, D).getRegex();
var Ne = h(/\\(punct)/, "gu").replace(/punct/g, D).getRegex();
var Fe = h(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
var je = h(U).replace("(?:-->|$)", "-->").getRegex();
var Qe = h("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", je).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
var q = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/;
var Ue = h(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", q).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
var de = h(/^!?\[(label)\]\[(ref)\]/).replace("label", q).replace("ref", Q).getRegex();
var ke = h(/^!?\[(ref)\](?:\[\])?/).replace("ref", Q).getRegex();
var Ke = h("reflink|nolink(?!\\()", "g").replace("reflink", de).replace("nolink", ke).getRegex();
var se = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/;
var X = { _backpedal: I, anyPunctuation: Ne, autolink: Fe, blockSkip: qe, br: le, code: Ae, del: I, emStrongLDelim: ve, emStrongRDelimAst: He, emStrongRDelimUnd: Ge, escape: ze, link: Ue, nolink: ke, punctuation: Ee, reflink: de, reflinkSearch: Ke, tag: Qe, text: Ie, url: I };
var We = { ...X, link: h(/^!?\[(label)\]\((.*?)\)/).replace("label", q).getRegex(), reflink: h(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", q).getRegex() };
var N = { ...X, emStrongRDelimAst: Ze, emStrongLDelim: De, url: h(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", se).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: h(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", se).getRegex() };
var Xe = { ...N, br: h(le).replace("{2,}", "*").getRegex(), text: h(N.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() };
var C = { normal: K, gfm: Le, pedantic: Me };
var M = { normal: X, gfm: N, breaks: Xe, pedantic: We };
var Je = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
var ge = (u3) => Je[u3];
function w(u3, e) {
  if (e) {
    if (m.escapeTest.test(u3)) return u3.replace(m.escapeReplace, ge);
  } else if (m.escapeTestNoEncode.test(u3)) return u3.replace(m.escapeReplaceNoEncode, ge);
  return u3;
}
function J(u3) {
  try {
    u3 = encodeURI(u3).replace(m.percentDecode, "%");
  } catch {
    return null;
  }
  return u3;
}
function V(u3, e) {
  let t = u3.replace(m.findPipe, (i, s, o) => {
    let a = false, l = s;
    for (; --l >= 0 && o[l] === "\\"; ) a = !a;
    return a ? "|" : " |";
  }), n = t.split(m.splitPipe), r = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), e) if (n.length > e) n.splice(e);
  else for (; n.length < e; ) n.push("");
  for (; r < n.length; r++) n[r] = n[r].trim().replace(m.slashPipe, "|");
  return n;
}
function z(u3, e, t) {
  let n = u3.length;
  if (n === 0) return "";
  let r = 0;
  for (; r < n; ) {
    let i = u3.charAt(n - r - 1);
    if (i === e && !t) r++;
    else if (i !== e && t) r++;
    else break;
  }
  return u3.slice(0, n - r);
}
function fe(u3, e) {
  if (u3.indexOf(e[1]) === -1) return -1;
  let t = 0;
  for (let n = 0; n < u3.length; n++) if (u3[n] === "\\") n++;
  else if (u3[n] === e[0]) t++;
  else if (u3[n] === e[1] && (t--, t < 0)) return n;
  return t > 0 ? -2 : -1;
}
function me(u3, e, t, n, r) {
  let i = e.href, s = e.title || null, o = u3[1].replace(r.other.outputLinkReplace, "$1");
  n.state.inLink = true;
  let a = { type: u3[0].charAt(0) === "!" ? "image" : "link", raw: t, href: i, title: s, text: o, tokens: n.inlineTokens(o) };
  return n.state.inLink = false, a;
}
function Ve(u3, e, t) {
  let n = u3.match(t.other.indentCodeCompensation);
  if (n === null) return e;
  let r = n[1];
  return e.split(`
`).map((i) => {
    let s = i.match(t.other.beginningSpace);
    if (s === null) return i;
    let [o] = s;
    return o.length >= r.length ? i.slice(r.length) : i;
  }).join(`
`);
}
var y = class {
  options;
  rules;
  lexer;
  constructor(e) {
    this.options = e || T;
  }
  space(e) {
    let t = this.rules.block.newline.exec(e);
    if (t && t[0].length > 0) return { type: "space", raw: t[0] };
  }
  code(e) {
    let t = this.rules.block.code.exec(e);
    if (t) {
      let n = t[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: t[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : z(n, `
`) };
    }
  }
  fences(e) {
    let t = this.rules.block.fences.exec(e);
    if (t) {
      let n = t[0], r = Ve(n, t[3] || "", this.rules);
      return { type: "code", raw: n, lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2], text: r };
    }
  }
  heading(e) {
    let t = this.rules.block.heading.exec(e);
    if (t) {
      let n = t[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let r = z(n, "#");
        (this.options.pedantic || !r || this.rules.other.endingSpaceChar.test(r)) && (n = r.trim());
      }
      return { type: "heading", raw: t[0], depth: t[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(e) {
    let t = this.rules.block.hr.exec(e);
    if (t) return { type: "hr", raw: z(t[0], `
`) };
  }
  blockquote(e) {
    let t = this.rules.block.blockquote.exec(e);
    if (t) {
      let n = z(t[0], `
`).split(`
`), r = "", i = "", s = [];
      for (; n.length > 0; ) {
        let o = false, a = [], l;
        for (l = 0; l < n.length; l++) if (this.rules.other.blockquoteStart.test(n[l])) a.push(n[l]), o = true;
        else if (!o) a.push(n[l]);
        else break;
        n = n.slice(l);
        let c = a.join(`
`), p = c.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        r = r ? `${r}
${c}` : c, i = i ? `${i}
${p}` : p;
        let g = this.lexer.state.top;
        if (this.lexer.state.top = true, this.lexer.blockTokens(p, s, true), this.lexer.state.top = g, n.length === 0) break;
        let d = s.at(-1);
        if (d?.type === "code") break;
        if (d?.type === "blockquote") {
          let R = d, f = R.raw + `
` + n.join(`
`), O = this.blockquote(f);
          s[s.length - 1] = O, r = r.substring(0, r.length - R.raw.length) + O.raw, i = i.substring(0, i.length - R.text.length) + O.text;
          break;
        } else if (d?.type === "list") {
          let R = d, f = R.raw + `
` + n.join(`
`), O = this.list(f);
          s[s.length - 1] = O, r = r.substring(0, r.length - d.raw.length) + O.raw, i = i.substring(0, i.length - R.raw.length) + O.raw, n = f.substring(s.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: r, tokens: s, text: i };
    }
  }
  list(e) {
    let t = this.rules.block.list.exec(e);
    if (t) {
      let n = t[1].trim(), r = n.length > 1, i = { type: "list", raw: "", ordered: r, start: r ? +n.slice(0, -1) : "", loose: false, items: [] };
      n = r ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = r ? n : "[*+-]");
      let s = this.rules.other.listItemRegex(n), o = false;
      for (; e; ) {
        let l = false, c = "", p = "";
        if (!(t = s.exec(e)) || this.rules.block.hr.test(e)) break;
        c = t[0], e = e.substring(c.length);
        let g = t[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (H) => " ".repeat(3 * H.length)), d = e.split(`
`, 1)[0], R = !g.trim(), f = 0;
        if (this.options.pedantic ? (f = 2, p = g.trimStart()) : R ? f = t[1].length + 1 : (f = t[2].search(this.rules.other.nonSpaceChar), f = f > 4 ? 1 : f, p = g.slice(f), f += t[1].length), R && this.rules.other.blankLine.test(d) && (c += d + `
`, e = e.substring(d.length + 1), l = true), !l) {
          let H = this.rules.other.nextBulletRegex(f), ee = this.rules.other.hrRegex(f), te = this.rules.other.fencesBeginRegex(f), ne = this.rules.other.headingBeginRegex(f), xe = this.rules.other.htmlBeginRegex(f);
          for (; e; ) {
            let Z = e.split(`
`, 1)[0], A;
            if (d = Z, this.options.pedantic ? (d = d.replace(this.rules.other.listReplaceNesting, "  "), A = d) : A = d.replace(this.rules.other.tabCharGlobal, "    "), te.test(d) || ne.test(d) || xe.test(d) || H.test(d) || ee.test(d)) break;
            if (A.search(this.rules.other.nonSpaceChar) >= f || !d.trim()) p += `
` + A.slice(f);
            else {
              if (R || g.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || te.test(g) || ne.test(g) || ee.test(g)) break;
              p += `
` + d;
            }
            !R && !d.trim() && (R = true), c += Z + `
`, e = e.substring(Z.length + 1), g = A.slice(f);
          }
        }
        i.loose || (o ? i.loose = true : this.rules.other.doubleBlankLine.test(c) && (o = true));
        let O = null, Y;
        this.options.gfm && (O = this.rules.other.listIsTask.exec(p), O && (Y = O[0] !== "[ ] ", p = p.replace(this.rules.other.listReplaceTask, ""))), i.items.push({ type: "list_item", raw: c, task: !!O, checked: Y, loose: false, text: p, tokens: [] }), i.raw += c;
      }
      let a = i.items.at(-1);
      if (a) a.raw = a.raw.trimEnd(), a.text = a.text.trimEnd();
      else return;
      i.raw = i.raw.trimEnd();
      for (let l = 0; l < i.items.length; l++) if (this.lexer.state.top = false, i.items[l].tokens = this.lexer.blockTokens(i.items[l].text, []), !i.loose) {
        let c = i.items[l].tokens.filter((g) => g.type === "space"), p = c.length > 0 && c.some((g) => this.rules.other.anyLine.test(g.raw));
        i.loose = p;
      }
      if (i.loose) for (let l = 0; l < i.items.length; l++) i.items[l].loose = true;
      return i;
    }
  }
  html(e) {
    let t = this.rules.block.html.exec(e);
    if (t) return { type: "html", block: true, raw: t[0], pre: t[1] === "pre" || t[1] === "script" || t[1] === "style", text: t[0] };
  }
  def(e) {
    let t = this.rules.block.def.exec(e);
    if (t) {
      let n = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), r = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", i = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
      return { type: "def", tag: n, raw: t[0], href: r, title: i };
    }
  }
  table(e) {
    let t = this.rules.block.table.exec(e);
    if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
    let n = V(t[1]), r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], s = { type: "table", raw: t[0], header: [], align: [], rows: [] };
    if (n.length === r.length) {
      for (let o of r) this.rules.other.tableAlignRight.test(o) ? s.align.push("right") : this.rules.other.tableAlignCenter.test(o) ? s.align.push("center") : this.rules.other.tableAlignLeft.test(o) ? s.align.push("left") : s.align.push(null);
      for (let o = 0; o < n.length; o++) s.header.push({ text: n[o], tokens: this.lexer.inline(n[o]), header: true, align: s.align[o] });
      for (let o of i) s.rows.push(V(o, s.header.length).map((a, l) => ({ text: a, tokens: this.lexer.inline(a), header: false, align: s.align[l] })));
      return s;
    }
  }
  lheading(e) {
    let t = this.rules.block.lheading.exec(e);
    if (t) return { type: "heading", raw: t[0], depth: t[2].charAt(0) === "=" ? 1 : 2, text: t[1], tokens: this.lexer.inline(t[1]) };
  }
  paragraph(e) {
    let t = this.rules.block.paragraph.exec(e);
    if (t) {
      let n = t[1].charAt(t[1].length - 1) === `
` ? t[1].slice(0, -1) : t[1];
      return { type: "paragraph", raw: t[0], text: n, tokens: this.lexer.inline(n) };
    }
  }
  text(e) {
    let t = this.rules.block.text.exec(e);
    if (t) return { type: "text", raw: t[0], text: t[0], tokens: this.lexer.inline(t[0]) };
  }
  escape(e) {
    let t = this.rules.inline.escape.exec(e);
    if (t) return { type: "escape", raw: t[0], text: t[1] };
  }
  tag(e) {
    let t = this.rules.inline.tag.exec(e);
    if (t) return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = true : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = false), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = true : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = false), { type: "html", raw: t[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: false, text: t[0] };
  }
  link(e) {
    let t = this.rules.inline.link.exec(e);
    if (t) {
      let n = t[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n)) {
        if (!this.rules.other.endAngleBracket.test(n)) return;
        let s = z(n.slice(0, -1), "\\");
        if ((n.length - s.length) % 2 === 0) return;
      } else {
        let s = fe(t[2], "()");
        if (s === -2) return;
        if (s > -1) {
          let a = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + s;
          t[2] = t[2].substring(0, s), t[0] = t[0].substring(0, a).trim(), t[3] = "";
        }
      }
      let r = t[2], i = "";
      if (this.options.pedantic) {
        let s = this.rules.other.pedanticHrefTitle.exec(r);
        s && (r = s[1], i = s[3]);
      } else i = t[3] ? t[3].slice(1, -1) : "";
      return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? r = r.slice(1) : r = r.slice(1, -1)), me(t, { href: r && r.replace(this.rules.inline.anyPunctuation, "$1"), title: i && i.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
    }
  }
  reflink(e, t) {
    let n;
    if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
      let r = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), i = t[r.toLowerCase()];
      if (!i) {
        let s = n[0].charAt(0);
        return { type: "text", raw: s, text: s };
      }
      return me(n, i, n[0], this.lexer, this.rules);
    }
  }
  emStrong(e, t, n = "") {
    let r = this.rules.inline.emStrongLDelim.exec(e);
    if (!r || r[3] && n.match(this.rules.other.unicodeAlphaNumeric)) return;
    if (!(r[1] || r[2] || "") || !n || this.rules.inline.punctuation.exec(n)) {
      let s = [...r[0]].length - 1, o, a, l = s, c = 0, p = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (p.lastIndex = 0, t = t.slice(-1 * e.length + s); (r = p.exec(t)) != null; ) {
        if (o = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !o) continue;
        if (a = [...o].length, r[3] || r[4]) {
          l += a;
          continue;
        } else if ((r[5] || r[6]) && s % 3 && !((s + a) % 3)) {
          c += a;
          continue;
        }
        if (l -= a, l > 0) continue;
        a = Math.min(a, a + l + c);
        let g = [...r[0]][0].length, d = e.slice(0, s + r.index + g + a);
        if (Math.min(s, a) % 2) {
          let f = d.slice(1, -1);
          return { type: "em", raw: d, text: f, tokens: this.lexer.inlineTokens(f) };
        }
        let R = d.slice(2, -2);
        return { type: "strong", raw: d, text: R, tokens: this.lexer.inlineTokens(R) };
      }
    }
  }
  codespan(e) {
    let t = this.rules.inline.code.exec(e);
    if (t) {
      let n = t[2].replace(this.rules.other.newLineCharGlobal, " "), r = this.rules.other.nonSpaceChar.test(n), i = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
      return r && i && (n = n.substring(1, n.length - 1)), { type: "codespan", raw: t[0], text: n };
    }
  }
  br(e) {
    let t = this.rules.inline.br.exec(e);
    if (t) return { type: "br", raw: t[0] };
  }
  del(e) {
    let t = this.rules.inline.del.exec(e);
    if (t) return { type: "del", raw: t[0], text: t[2], tokens: this.lexer.inlineTokens(t[2]) };
  }
  autolink(e) {
    let t = this.rules.inline.autolink.exec(e);
    if (t) {
      let n, r;
      return t[2] === "@" ? (n = t[1], r = "mailto:" + n) : (n = t[1], r = n), { type: "link", raw: t[0], text: n, href: r, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  url(e) {
    let t;
    if (t = this.rules.inline.url.exec(e)) {
      let n, r;
      if (t[2] === "@") n = t[0], r = "mailto:" + n;
      else {
        let i;
        do
          i = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? "";
        while (i !== t[0]);
        n = t[0], t[1] === "www." ? r = "http://" + t[0] : r = t[0];
      }
      return { type: "link", raw: t[0], text: n, href: r, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  inlineText(e) {
    let t = this.rules.inline.text.exec(e);
    if (t) {
      let n = this.lexer.state.inRawBlock;
      return { type: "text", raw: t[0], text: t[0], escaped: n };
    }
  }
};
var x = class u {
  tokens;
  options;
  state;
  tokenizer;
  inlineQueue;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || T, this.options.tokenizer = this.options.tokenizer || new y(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: false, inRawBlock: false, top: true };
    let t = { other: m, block: C.normal, inline: M.normal };
    this.options.pedantic ? (t.block = C.pedantic, t.inline = M.pedantic) : this.options.gfm && (t.block = C.gfm, this.options.breaks ? t.inline = M.breaks : t.inline = M.gfm), this.tokenizer.rules = t;
  }
  static get rules() {
    return { block: C, inline: M };
  }
  static lex(e, t) {
    return new u(t).lex(e);
  }
  static lexInline(e, t) {
    return new u(t).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(m.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      let n = this.inlineQueue[t];
      this.inlineTokens(n.src, n.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], n = false) {
    for (this.options.pedantic && (e = e.replace(m.tabCharGlobal, "    ").replace(m.spaceLine, "")); e; ) {
      let r;
      if (this.options.extensions?.block?.some((s) => (r = s.call({ lexer: this }, e, t)) ? (e = e.substring(r.raw.length), t.push(r), true) : false)) continue;
      if (r = this.tokenizer.space(e)) {
        e = e.substring(r.raw.length);
        let s = t.at(-1);
        r.raw.length === 1 && s !== void 0 ? s.raw += `
` : t.push(r);
        continue;
      }
      if (r = this.tokenizer.code(e)) {
        e = e.substring(r.raw.length);
        let s = t.at(-1);
        s?.type === "paragraph" || s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.at(-1).src = s.text) : t.push(r);
        continue;
      }
      if (r = this.tokenizer.fences(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.heading(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.hr(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.blockquote(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.list(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.html(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.def(e)) {
        e = e.substring(r.raw.length);
        let s = t.at(-1);
        s?.type === "paragraph" || s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.raw, this.inlineQueue.at(-1).src = s.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = { href: r.href, title: r.title }, t.push(r));
        continue;
      }
      if (r = this.tokenizer.table(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.lheading(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      let i = e;
      if (this.options.extensions?.startBlock) {
        let s = 1 / 0, o = e.slice(1), a;
        this.options.extensions.startBlock.forEach((l) => {
          a = l.call({ lexer: this }, o), typeof a == "number" && a >= 0 && (s = Math.min(s, a));
        }), s < 1 / 0 && s >= 0 && (i = e.substring(0, s + 1));
      }
      if (this.state.top && (r = this.tokenizer.paragraph(i))) {
        let s = t.at(-1);
        n && s?.type === "paragraph" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s.text) : t.push(r), n = i.length !== e.length, e = e.substring(r.raw.length);
        continue;
      }
      if (r = this.tokenizer.text(e)) {
        e = e.substring(r.raw.length);
        let s = t.at(-1);
        s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s.text) : t.push(r);
        continue;
      }
      if (e) {
        let s = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(s);
          break;
        } else throw new Error(s);
      }
    }
    return this.state.top = true, t;
  }
  inline(e, t = []) {
    return this.inlineQueue.push({ src: e, tokens: t }), t;
  }
  inlineTokens(e, t = []) {
    let n = e, r = null;
    if (this.tokens.links) {
      let o = Object.keys(this.tokens.links);
      if (o.length > 0) for (; (r = this.tokenizer.rules.inline.reflinkSearch.exec(n)) != null; ) o.includes(r[0].slice(r[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (r = this.tokenizer.rules.inline.anyPunctuation.exec(n)) != null; ) n = n.slice(0, r.index) + "++" + n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (; (r = this.tokenizer.rules.inline.blockSkip.exec(n)) != null; ) n = n.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
    let i = false, s = "";
    for (; e; ) {
      i || (s = ""), i = false;
      let o;
      if (this.options.extensions?.inline?.some((l) => (o = l.call({ lexer: this }, e, t)) ? (e = e.substring(o.raw.length), t.push(o), true) : false)) continue;
      if (o = this.tokenizer.escape(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.tag(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.link(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(o.raw.length);
        let l = t.at(-1);
        o.type === "text" && l?.type === "text" ? (l.raw += o.raw, l.text += o.text) : t.push(o);
        continue;
      }
      if (o = this.tokenizer.emStrong(e, n, s)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.codespan(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.br(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.del(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.autolink(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (!this.state.inLink && (o = this.tokenizer.url(e))) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      let a = e;
      if (this.options.extensions?.startInline) {
        let l = 1 / 0, c = e.slice(1), p;
        this.options.extensions.startInline.forEach((g) => {
          p = g.call({ lexer: this }, c), typeof p == "number" && p >= 0 && (l = Math.min(l, p));
        }), l < 1 / 0 && l >= 0 && (a = e.substring(0, l + 1));
      }
      if (o = this.tokenizer.inlineText(a)) {
        e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (s = o.raw.slice(-1)), i = true;
        let l = t.at(-1);
        l?.type === "text" ? (l.raw += o.raw, l.text += o.text) : t.push(o);
        continue;
      }
      if (e) {
        let l = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(l);
          break;
        } else throw new Error(l);
      }
    }
    return t;
  }
};
var P = class {
  options;
  parser;
  constructor(e) {
    this.options = e || T;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: n }) {
    let r = (t || "").match(m.notSpaceStart)?.[0], i = e.replace(m.endingNewline, "") + `
`;
    return r ? '<pre><code class="language-' + w(r) + '">' + (n ? i : w(i, true)) + `</code></pre>
` : "<pre><code>" + (n ? i : w(i, true)) + `</code></pre>
`;
  }
  blockquote({ tokens: e }) {
    return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
  }
  html({ text: e }) {
    return e;
  }
  def(e) {
    return "";
  }
  heading({ tokens: e, depth: t }) {
    return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
  }
  hr(e) {
    return `<hr>
`;
  }
  list(e) {
    let t = e.ordered, n = e.start, r = "";
    for (let o = 0; o < e.items.length; o++) {
      let a = e.items[o];
      r += this.listitem(a);
    }
    let i = t ? "ol" : "ul", s = t && n !== 1 ? ' start="' + n + '"' : "";
    return "<" + i + s + `>
` + r + "</" + i + `>
`;
  }
  listitem(e) {
    let t = "";
    if (e.task) {
      let n = this.checkbox({ checked: !!e.checked });
      e.loose ? e.tokens[0]?.type === "paragraph" ? (e.tokens[0].text = n + " " + e.tokens[0].text, e.tokens[0].tokens && e.tokens[0].tokens.length > 0 && e.tokens[0].tokens[0].type === "text" && (e.tokens[0].tokens[0].text = n + " " + w(e.tokens[0].tokens[0].text), e.tokens[0].tokens[0].escaped = true)) : e.tokens.unshift({ type: "text", raw: n + " ", text: n + " ", escaped: true }) : t += n + " ";
    }
    return t += this.parser.parse(e.tokens, !!e.loose), `<li>${t}</li>
`;
  }
  checkbox({ checked: e }) {
    return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph({ tokens: e }) {
    return `<p>${this.parser.parseInline(e)}</p>
`;
  }
  table(e) {
    let t = "", n = "";
    for (let i = 0; i < e.header.length; i++) n += this.tablecell(e.header[i]);
    t += this.tablerow({ text: n });
    let r = "";
    for (let i = 0; i < e.rows.length; i++) {
      let s = e.rows[i];
      n = "";
      for (let o = 0; o < s.length; o++) n += this.tablecell(s[o]);
      r += this.tablerow({ text: n });
    }
    return r && (r = `<tbody>${r}</tbody>`), `<table>
<thead>
` + t + `</thead>
` + r + `</table>
`;
  }
  tablerow({ text: e }) {
    return `<tr>
${e}</tr>
`;
  }
  tablecell(e) {
    let t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
    return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
  }
  strong({ tokens: e }) {
    return `<strong>${this.parser.parseInline(e)}</strong>`;
  }
  em({ tokens: e }) {
    return `<em>${this.parser.parseInline(e)}</em>`;
  }
  codespan({ text: e }) {
    return `<code>${w(e, true)}</code>`;
  }
  br(e) {
    return "<br>";
  }
  del({ tokens: e }) {
    return `<del>${this.parser.parseInline(e)}</del>`;
  }
  link({ href: e, title: t, tokens: n }) {
    let r = this.parser.parseInline(n), i = J(e);
    if (i === null) return r;
    e = i;
    let s = '<a href="' + e + '"';
    return t && (s += ' title="' + w(t) + '"'), s += ">" + r + "</a>", s;
  }
  image({ href: e, title: t, text: n, tokens: r }) {
    r && (n = this.parser.parseInline(r, this.parser.textRenderer));
    let i = J(e);
    if (i === null) return w(n);
    e = i;
    let s = `<img src="${e}" alt="${n}"`;
    return t && (s += ` title="${w(t)}"`), s += ">", s;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : w(e.text);
  }
};
var $ = class {
  strong({ text: e }) {
    return e;
  }
  em({ text: e }) {
    return e;
  }
  codespan({ text: e }) {
    return e;
  }
  del({ text: e }) {
    return e;
  }
  html({ text: e }) {
    return e;
  }
  text({ text: e }) {
    return e;
  }
  link({ text: e }) {
    return "" + e;
  }
  image({ text: e }) {
    return "" + e;
  }
  br() {
    return "";
  }
};
var b = class u2 {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || T, this.options.renderer = this.options.renderer || new P(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new $();
  }
  static parse(e, t) {
    return new u2(t).parse(e);
  }
  static parseInline(e, t) {
    return new u2(t).parseInline(e);
  }
  parse(e, t = true) {
    let n = "";
    for (let r = 0; r < e.length; r++) {
      let i = e[r];
      if (this.options.extensions?.renderers?.[i.type]) {
        let o = i, a = this.options.extensions.renderers[o.type].call({ parser: this }, o);
        if (a !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(o.type)) {
          n += a || "";
          continue;
        }
      }
      let s = i;
      switch (s.type) {
        case "space": {
          n += this.renderer.space(s);
          continue;
        }
        case "hr": {
          n += this.renderer.hr(s);
          continue;
        }
        case "heading": {
          n += this.renderer.heading(s);
          continue;
        }
        case "code": {
          n += this.renderer.code(s);
          continue;
        }
        case "table": {
          n += this.renderer.table(s);
          continue;
        }
        case "blockquote": {
          n += this.renderer.blockquote(s);
          continue;
        }
        case "list": {
          n += this.renderer.list(s);
          continue;
        }
        case "html": {
          n += this.renderer.html(s);
          continue;
        }
        case "def": {
          n += this.renderer.def(s);
          continue;
        }
        case "paragraph": {
          n += this.renderer.paragraph(s);
          continue;
        }
        case "text": {
          let o = s, a = this.renderer.text(o);
          for (; r + 1 < e.length && e[r + 1].type === "text"; ) o = e[++r], a += `
` + this.renderer.text(o);
          t ? n += this.renderer.paragraph({ type: "paragraph", raw: a, text: a, tokens: [{ type: "text", raw: a, text: a, escaped: true }] }) : n += a;
          continue;
        }
        default: {
          let o = 'Token with "' + s.type + '" type was not found.';
          if (this.options.silent) return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return n;
  }
  parseInline(e, t = this.renderer) {
    let n = "";
    for (let r = 0; r < e.length; r++) {
      let i = e[r];
      if (this.options.extensions?.renderers?.[i.type]) {
        let o = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (o !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i.type)) {
          n += o || "";
          continue;
        }
      }
      let s = i;
      switch (s.type) {
        case "escape": {
          n += t.text(s);
          break;
        }
        case "html": {
          n += t.html(s);
          break;
        }
        case "link": {
          n += t.link(s);
          break;
        }
        case "image": {
          n += t.image(s);
          break;
        }
        case "strong": {
          n += t.strong(s);
          break;
        }
        case "em": {
          n += t.em(s);
          break;
        }
        case "codespan": {
          n += t.codespan(s);
          break;
        }
        case "br": {
          n += t.br(s);
          break;
        }
        case "del": {
          n += t.del(s);
          break;
        }
        case "text": {
          n += t.text(s);
          break;
        }
        default: {
          let o = 'Token with "' + s.type + '" type was not found.';
          if (this.options.silent) return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return n;
  }
};
var S = class {
  options;
  block;
  constructor(e) {
    this.options = e || T;
  }
  static passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"]);
  static passThroughHooksRespectAsync = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"]);
  preprocess(e) {
    return e;
  }
  postprocess(e) {
    return e;
  }
  processAllTokens(e) {
    return e;
  }
  emStrongMask(e) {
    return e;
  }
  provideLexer() {
    return this.block ? x.lex : x.lexInline;
  }
  provideParser() {
    return this.block ? b.parse : b.parseInline;
  }
};
var B = class {
  defaults = L();
  options = this.setOptions;
  parse = this.parseMarkdown(true);
  parseInline = this.parseMarkdown(false);
  Parser = b;
  Renderer = P;
  TextRenderer = $;
  Lexer = x;
  Tokenizer = y;
  Hooks = S;
  constructor(...e) {
    this.use(...e);
  }
  walkTokens(e, t) {
    let n = [];
    for (let r of e) switch (n = n.concat(t.call(this, r)), r.type) {
      case "table": {
        let i = r;
        for (let s of i.header) n = n.concat(this.walkTokens(s.tokens, t));
        for (let s of i.rows) for (let o of s) n = n.concat(this.walkTokens(o.tokens, t));
        break;
      }
      case "list": {
        let i = r;
        n = n.concat(this.walkTokens(i.items, t));
        break;
      }
      default: {
        let i = r;
        this.defaults.extensions?.childTokens?.[i.type] ? this.defaults.extensions.childTokens[i.type].forEach((s) => {
          let o = i[s].flat(1 / 0);
          n = n.concat(this.walkTokens(o, t));
        }) : i.tokens && (n = n.concat(this.walkTokens(i.tokens, t)));
      }
    }
    return n;
  }
  use(...e) {
    let t = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return e.forEach((n) => {
      let r = { ...n };
      if (r.async = this.defaults.async || r.async || false, n.extensions && (n.extensions.forEach((i) => {
        if (!i.name) throw new Error("extension name required");
        if ("renderer" in i) {
          let s = t.renderers[i.name];
          s ? t.renderers[i.name] = function(...o) {
            let a = i.renderer.apply(this, o);
            return a === false && (a = s.apply(this, o)), a;
          } : t.renderers[i.name] = i.renderer;
        }
        if ("tokenizer" in i) {
          if (!i.level || i.level !== "block" && i.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let s = t[i.level];
          s ? s.unshift(i.tokenizer) : t[i.level] = [i.tokenizer], i.start && (i.level === "block" ? t.startBlock ? t.startBlock.push(i.start) : t.startBlock = [i.start] : i.level === "inline" && (t.startInline ? t.startInline.push(i.start) : t.startInline = [i.start]));
        }
        "childTokens" in i && i.childTokens && (t.childTokens[i.name] = i.childTokens);
      }), r.extensions = t), n.renderer) {
        let i = this.defaults.renderer || new P(this.defaults);
        for (let s in n.renderer) {
          if (!(s in i)) throw new Error(`renderer '${s}' does not exist`);
          if (["options", "parser"].includes(s)) continue;
          let o = s, a = n.renderer[o], l = i[o];
          i[o] = (...c) => {
            let p = a.apply(i, c);
            return p === false && (p = l.apply(i, c)), p || "";
          };
        }
        r.renderer = i;
      }
      if (n.tokenizer) {
        let i = this.defaults.tokenizer || new y(this.defaults);
        for (let s in n.tokenizer) {
          if (!(s in i)) throw new Error(`tokenizer '${s}' does not exist`);
          if (["options", "rules", "lexer"].includes(s)) continue;
          let o = s, a = n.tokenizer[o], l = i[o];
          i[o] = (...c) => {
            let p = a.apply(i, c);
            return p === false && (p = l.apply(i, c)), p;
          };
        }
        r.tokenizer = i;
      }
      if (n.hooks) {
        let i = this.defaults.hooks || new S();
        for (let s in n.hooks) {
          if (!(s in i)) throw new Error(`hook '${s}' does not exist`);
          if (["options", "block"].includes(s)) continue;
          let o = s, a = n.hooks[o], l = i[o];
          S.passThroughHooks.has(s) ? i[o] = (c) => {
            if (this.defaults.async && S.passThroughHooksRespectAsync.has(s)) return (async () => {
              let g = await a.call(i, c);
              return l.call(i, g);
            })();
            let p = a.call(i, c);
            return l.call(i, p);
          } : i[o] = (...c) => {
            if (this.defaults.async) return (async () => {
              let g = await a.apply(i, c);
              return g === false && (g = await l.apply(i, c)), g;
            })();
            let p = a.apply(i, c);
            return p === false && (p = l.apply(i, c)), p;
          };
        }
        r.hooks = i;
      }
      if (n.walkTokens) {
        let i = this.defaults.walkTokens, s = n.walkTokens;
        r.walkTokens = function(o) {
          let a = [];
          return a.push(s.call(this, o)), i && (a = a.concat(i.call(this, o))), a;
        };
      }
      this.defaults = { ...this.defaults, ...r };
    }), this;
  }
  setOptions(e) {
    return this.defaults = { ...this.defaults, ...e }, this;
  }
  lexer(e, t) {
    return x.lex(e, t ?? this.defaults);
  }
  parser(e, t) {
    return b.parse(e, t ?? this.defaults);
  }
  parseMarkdown(e) {
    return (n, r) => {
      let i = { ...r }, s = { ...this.defaults, ...i }, o = this.onError(!!s.silent, !!s.async);
      if (this.defaults.async === true && i.async === false) return o(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof n > "u" || n === null) return o(new Error("marked(): input parameter is undefined or null"));
      if (typeof n != "string") return o(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected"));
      if (s.hooks && (s.hooks.options = s, s.hooks.block = e), s.async) return (async () => {
        let a = s.hooks ? await s.hooks.preprocess(n) : n, c = await (s.hooks ? await s.hooks.provideLexer() : e ? x.lex : x.lexInline)(a, s), p = s.hooks ? await s.hooks.processAllTokens(c) : c;
        s.walkTokens && await Promise.all(this.walkTokens(p, s.walkTokens));
        let d = await (s.hooks ? await s.hooks.provideParser() : e ? b.parse : b.parseInline)(p, s);
        return s.hooks ? await s.hooks.postprocess(d) : d;
      })().catch(o);
      try {
        s.hooks && (n = s.hooks.preprocess(n));
        let l = (s.hooks ? s.hooks.provideLexer() : e ? x.lex : x.lexInline)(n, s);
        s.hooks && (l = s.hooks.processAllTokens(l)), s.walkTokens && this.walkTokens(l, s.walkTokens);
        let p = (s.hooks ? s.hooks.provideParser() : e ? b.parse : b.parseInline)(l, s);
        return s.hooks && (p = s.hooks.postprocess(p)), p;
      } catch (a) {
        return o(a);
      }
    };
  }
  onError(e, t) {
    return (n) => {
      if (n.message += `
Please report this to https://github.com/markedjs/marked.`, e) {
        let r = "<p>An error occurred:</p><pre>" + w(n.message + "", true) + "</pre>";
        return t ? Promise.resolve(r) : r;
      }
      if (t) return Promise.reject(n);
      throw n;
    };
  }
};
var _ = new B();
function k(u3, e) {
  return _.parse(u3, e);
}
k.options = k.setOptions = function(u3) {
  return _.setOptions(u3), k.defaults = _.defaults, G(k.defaults), k;
};
k.getDefaults = L;
k.defaults = T;
k.use = function(...u3) {
  return _.use(...u3), k.defaults = _.defaults, G(k.defaults), k;
};
k.walkTokens = function(u3, e) {
  return _.walkTokens(u3, e);
};
k.parseInline = _.parseInline;
k.Parser = b;
k.parser = b.parse;
k.Renderer = P;
k.TextRenderer = $;
k.Lexer = x;
k.lexer = x.lex;
k.Tokenizer = y;
k.Hooks = S;
k.parse = k;
var Ht = k.options;
var Zt = k.setOptions;
var Gt = k.use;
var Nt = k.walkTokens;
var Ft = k.parseInline;
var Qt = b.parse;
var Ut = x.lex;

// node_modules/dompurify/dist/purify.es.mjs
var {
  entries,
  setPrototypeOf,
  isFrozen,
  getPrototypeOf,
  getOwnPropertyDescriptor
} = Object;
var {
  freeze,
  seal,
  create
} = Object;
var {
  apply,
  construct
} = typeof Reflect !== "undefined" && Reflect;
if (!freeze) {
  freeze = function freeze2(x2) {
    return x2;
  };
}
if (!seal) {
  seal = function seal2(x2) {
    return x2;
  };
}
if (!apply) {
  apply = function apply3(func, thisArg) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }
    return func.apply(thisArg, args);
  };
}
if (!construct) {
  construct = function construct2(Func) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    return new Func(...args);
  };
}
var arrayForEach = unapply(Array.prototype.forEach);
var arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
var arrayPop = unapply(Array.prototype.pop);
var arrayPush = unapply(Array.prototype.push);
var arraySplice = unapply(Array.prototype.splice);
var stringToLowerCase = unapply(String.prototype.toLowerCase);
var stringToString = unapply(String.prototype.toString);
var stringMatch = unapply(String.prototype.match);
var stringReplace = unapply(String.prototype.replace);
var stringIndexOf = unapply(String.prototype.indexOf);
var stringTrim = unapply(String.prototype.trim);
var objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
var regExpTest = unapply(RegExp.prototype.test);
var typeErrorCreate = unconstruct(TypeError);
function unapply(func) {
  return function(thisArg) {
    if (thisArg instanceof RegExp) {
      thisArg.lastIndex = 0;
    }
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    return apply(func, thisArg, args);
  };
}
function unconstruct(Func) {
  return function() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return construct(Func, args);
  };
}
function addToSet(set, array) {
  let transformCaseFunc = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : stringToLowerCase;
  if (setPrototypeOf) {
    setPrototypeOf(set, null);
  }
  let l = array.length;
  while (l--) {
    let element = array[l];
    if (typeof element === "string") {
      const lcElement = transformCaseFunc(element);
      if (lcElement !== element) {
        if (!isFrozen(array)) {
          array[l] = lcElement;
        }
        element = lcElement;
      }
    }
    set[element] = true;
  }
  return set;
}
function cleanArray(array) {
  for (let index = 0; index < array.length; index++) {
    const isPropertyExist = objectHasOwnProperty(array, index);
    if (!isPropertyExist) {
      array[index] = null;
    }
  }
  return array;
}
function clone(object) {
  const newObject = create(null);
  for (const [property, value] of entries(object)) {
    const isPropertyExist = objectHasOwnProperty(object, property);
    if (isPropertyExist) {
      if (Array.isArray(value)) {
        newObject[property] = cleanArray(value);
      } else if (value && typeof value === "object" && value.constructor === Object) {
        newObject[property] = clone(value);
      } else {
        newObject[property] = value;
      }
    }
  }
  return newObject;
}
function lookupGetter(object, prop) {
  while (object !== null) {
    const desc = getOwnPropertyDescriptor(object, prop);
    if (desc) {
      if (desc.get) {
        return unapply(desc.get);
      }
      if (typeof desc.value === "function") {
        return unapply(desc.value);
      }
    }
    object = getPrototypeOf(object);
  }
  function fallbackValue() {
    return null;
  }
  return fallbackValue;
}
var html$1 = freeze(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]);
var svg$1 = freeze(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]);
var svgFilters = freeze(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]);
var svgDisallowed = freeze(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]);
var mathMl$1 = freeze(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]);
var mathMlDisallowed = freeze(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]);
var text = freeze(["#text"]);
var html = freeze(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]);
var svg = freeze(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]);
var mathMl = freeze(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]);
var xml = freeze(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]);
var MUSTACHE_EXPR = seal(/\{\{[\w\W]*|[\w\W]*\}\}/gm);
var ERB_EXPR = seal(/<%[\w\W]*|[\w\W]*%>/gm);
var TMPLIT_EXPR = seal(/\$\{[\w\W]*/gm);
var DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/);
var ARIA_ATTR = seal(/^aria-[\-\w]+$/);
var IS_ALLOWED_URI = seal(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
);
var IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
var ATTR_WHITESPACE = seal(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
);
var DOCTYPE_NAME = seal(/^html$/i);
var CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);
var EXPRESSIONS = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR,
  ATTR_WHITESPACE,
  CUSTOM_ELEMENT,
  DATA_ATTR,
  DOCTYPE_NAME,
  ERB_EXPR,
  IS_ALLOWED_URI,
  IS_SCRIPT_OR_DATA,
  MUSTACHE_EXPR,
  TMPLIT_EXPR
});
var NODE_TYPE = {
  element: 1,
  attribute: 2,
  text: 3,
  cdataSection: 4,
  entityReference: 5,
  // Deprecated
  entityNode: 6,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9,
  documentType: 10,
  documentFragment: 11,
  notation: 12
  // Deprecated
};
var getGlobal = function getGlobal2() {
  return typeof window === "undefined" ? null : window;
};
var _createTrustedTypesPolicy = function _createTrustedTypesPolicy2(trustedTypes, purifyHostElement) {
  if (typeof trustedTypes !== "object" || typeof trustedTypes.createPolicy !== "function") {
    return null;
  }
  let suffix = null;
  const ATTR_NAME = "data-tt-policy-suffix";
  if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) {
    suffix = purifyHostElement.getAttribute(ATTR_NAME);
  }
  const policyName = "dompurify" + (suffix ? "#" + suffix : "");
  try {
    return trustedTypes.createPolicy(policyName, {
      createHTML(html2) {
        return html2;
      },
      createScriptURL(scriptUrl) {
        return scriptUrl;
      }
    });
  } catch (_2) {
    console.warn("TrustedTypes policy " + policyName + " could not be created.");
    return null;
  }
};
var _createHooksMap = function _createHooksMap2() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
};
function createDOMPurify() {
  let window2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
  const DOMPurify = (root) => createDOMPurify(root);
  DOMPurify.version = "3.3.0";
  DOMPurify.removed = [];
  if (!window2 || !window2.document || window2.document.nodeType !== NODE_TYPE.document || !window2.Element) {
    DOMPurify.isSupported = false;
    return DOMPurify;
  }
  let {
    document: document2
  } = window2;
  const originalDocument = document2;
  const currentScript = originalDocument.currentScript;
  const {
    DocumentFragment,
    HTMLTemplateElement,
    Node,
    Element,
    NodeFilter,
    NamedNodeMap = window2.NamedNodeMap || window2.MozNamedAttrMap,
    HTMLFormElement,
    DOMParser,
    trustedTypes
  } = window2;
  const ElementPrototype = Element.prototype;
  const cloneNode = lookupGetter(ElementPrototype, "cloneNode");
  const remove = lookupGetter(ElementPrototype, "remove");
  const getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
  const getChildNodes = lookupGetter(ElementPrototype, "childNodes");
  const getParentNode = lookupGetter(ElementPrototype, "parentNode");
  if (typeof HTMLTemplateElement === "function") {
    const template = document2.createElement("template");
    if (template.content && template.content.ownerDocument) {
      document2 = template.content.ownerDocument;
    }
  }
  let trustedTypesPolicy;
  let emptyHTML = "";
  const {
    implementation,
    createNodeIterator,
    createDocumentFragment,
    getElementsByTagName
  } = document2;
  const {
    importNode
  } = originalDocument;
  let hooks = _createHooksMap();
  DOMPurify.isSupported = typeof entries === "function" && typeof getParentNode === "function" && implementation && implementation.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: MUSTACHE_EXPR2,
    ERB_EXPR: ERB_EXPR2,
    TMPLIT_EXPR: TMPLIT_EXPR2,
    DATA_ATTR: DATA_ATTR2,
    ARIA_ATTR: ARIA_ATTR2,
    IS_SCRIPT_OR_DATA: IS_SCRIPT_OR_DATA2,
    ATTR_WHITESPACE: ATTR_WHITESPACE2,
    CUSTOM_ELEMENT: CUSTOM_ELEMENT2
  } = EXPRESSIONS;
  let {
    IS_ALLOWED_URI: IS_ALLOWED_URI$1
  } = EXPRESSIONS;
  let ALLOWED_TAGS = null;
  const DEFAULT_ALLOWED_TAGS = addToSet({}, [...html$1, ...svg$1, ...svgFilters, ...mathMl$1, ...text]);
  let ALLOWED_ATTR = null;
  const DEFAULT_ALLOWED_ATTR = addToSet({}, [...html, ...svg, ...mathMl, ...xml]);
  let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
    tagNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    attributeNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: false
    }
  }));
  let FORBID_TAGS = null;
  let FORBID_ATTR = null;
  const EXTRA_ELEMENT_HANDLING = Object.seal(create(null, {
    tagCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    attributeCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    }
  }));
  let ALLOW_ARIA_ATTR = true;
  let ALLOW_DATA_ATTR = true;
  let ALLOW_UNKNOWN_PROTOCOLS = false;
  let ALLOW_SELF_CLOSE_IN_ATTR = true;
  let SAFE_FOR_TEMPLATES = false;
  let SAFE_FOR_XML = true;
  let WHOLE_DOCUMENT = false;
  let SET_CONFIG = false;
  let FORCE_BODY = false;
  let RETURN_DOM = false;
  let RETURN_DOM_FRAGMENT = false;
  let RETURN_TRUSTED_TYPE = false;
  let SANITIZE_DOM = true;
  let SANITIZE_NAMED_PROPS = false;
  const SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
  let KEEP_CONTENT = true;
  let IN_PLACE = false;
  let USE_PROFILES = {};
  let FORBID_CONTENTS = null;
  const DEFAULT_FORBID_CONTENTS = addToSet({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let DATA_URI_TAGS = null;
  const DEFAULT_DATA_URI_TAGS = addToSet({}, ["audio", "video", "img", "source", "image", "track"]);
  let URI_SAFE_ATTRIBUTES = null;
  const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]);
  const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
  const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
  let NAMESPACE = HTML_NAMESPACE;
  let IS_EMPTY_INPUT = false;
  let ALLOWED_NAMESPACES = null;
  const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
  let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ["mi", "mo", "mn", "ms", "mtext"]);
  let HTML_INTEGRATION_POINTS = addToSet({}, ["annotation-xml"]);
  const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ["title", "style", "font", "a", "script"]);
  let PARSER_MEDIA_TYPE = null;
  const SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
  const DEFAULT_PARSER_MEDIA_TYPE = "text/html";
  let transformCaseFunc = null;
  let CONFIG = null;
  const formElement = document2.createElement("form");
  const isRegexOrFunction = function isRegexOrFunction2(testValue) {
    return testValue instanceof RegExp || testValue instanceof Function;
  };
  const _parseConfig = function _parseConfig2() {
    let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (CONFIG && CONFIG === cfg) {
      return;
    }
    if (!cfg || typeof cfg !== "object") {
      cfg = {};
    }
    cfg = clone(cfg);
    PARSER_MEDIA_TYPE = // eslint-disable-next-line unicorn/prefer-includes
    SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
    transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
    ALLOWED_TAGS = objectHasOwnProperty(cfg, "ALLOWED_TAGS") ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc) : DEFAULT_ALLOWED_TAGS;
    ALLOWED_ATTR = objectHasOwnProperty(cfg, "ALLOWED_ATTR") ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc) : DEFAULT_ALLOWED_ATTR;
    ALLOWED_NAMESPACES = objectHasOwnProperty(cfg, "ALLOWED_NAMESPACES") ? addToSet({}, cfg.ALLOWED_NAMESPACES, stringToString) : DEFAULT_ALLOWED_NAMESPACES;
    URI_SAFE_ATTRIBUTES = objectHasOwnProperty(cfg, "ADD_URI_SAFE_ATTR") ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR, transformCaseFunc) : DEFAULT_URI_SAFE_ATTRIBUTES;
    DATA_URI_TAGS = objectHasOwnProperty(cfg, "ADD_DATA_URI_TAGS") ? addToSet(clone(DEFAULT_DATA_URI_TAGS), cfg.ADD_DATA_URI_TAGS, transformCaseFunc) : DEFAULT_DATA_URI_TAGS;
    FORBID_CONTENTS = objectHasOwnProperty(cfg, "FORBID_CONTENTS") ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc) : DEFAULT_FORBID_CONTENTS;
    FORBID_TAGS = objectHasOwnProperty(cfg, "FORBID_TAGS") ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc) : clone({});
    FORBID_ATTR = objectHasOwnProperty(cfg, "FORBID_ATTR") ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc) : clone({});
    USE_PROFILES = objectHasOwnProperty(cfg, "USE_PROFILES") ? cfg.USE_PROFILES : false;
    ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
    ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
    ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
    ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false;
    SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
    SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false;
    WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
    RETURN_DOM = cfg.RETURN_DOM || false;
    RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
    RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
    FORCE_BODY = cfg.FORCE_BODY || false;
    SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
    SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false;
    KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
    IN_PLACE = cfg.IN_PLACE || false;
    IS_ALLOWED_URI$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI;
    NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;
    MATHML_TEXT_INTEGRATION_POINTS = cfg.MATHML_TEXT_INTEGRATION_POINTS || MATHML_TEXT_INTEGRATION_POINTS;
    HTML_INTEGRATION_POINTS = cfg.HTML_INTEGRATION_POINTS || HTML_INTEGRATION_POINTS;
    CUSTOM_ELEMENT_HANDLING = cfg.CUSTOM_ELEMENT_HANDLING || {};
    if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.tagNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck;
    }
    if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.attributeNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck;
    }
    if (cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements === "boolean") {
      CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements;
    }
    if (SAFE_FOR_TEMPLATES) {
      ALLOW_DATA_ATTR = false;
    }
    if (RETURN_DOM_FRAGMENT) {
      RETURN_DOM = true;
    }
    if (USE_PROFILES) {
      ALLOWED_TAGS = addToSet({}, text);
      ALLOWED_ATTR = [];
      if (USE_PROFILES.html === true) {
        addToSet(ALLOWED_TAGS, html$1);
        addToSet(ALLOWED_ATTR, html);
      }
      if (USE_PROFILES.svg === true) {
        addToSet(ALLOWED_TAGS, svg$1);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.svgFilters === true) {
        addToSet(ALLOWED_TAGS, svgFilters);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.mathMl === true) {
        addToSet(ALLOWED_TAGS, mathMl$1);
        addToSet(ALLOWED_ATTR, mathMl);
        addToSet(ALLOWED_ATTR, xml);
      }
    }
    if (cfg.ADD_TAGS) {
      if (typeof cfg.ADD_TAGS === "function") {
        EXTRA_ELEMENT_HANDLING.tagCheck = cfg.ADD_TAGS;
      } else {
        if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
          ALLOWED_TAGS = clone(ALLOWED_TAGS);
        }
        addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
      }
    }
    if (cfg.ADD_ATTR) {
      if (typeof cfg.ADD_ATTR === "function") {
        EXTRA_ELEMENT_HANDLING.attributeCheck = cfg.ADD_ATTR;
      } else {
        if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
          ALLOWED_ATTR = clone(ALLOWED_ATTR);
        }
        addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
      }
    }
    if (cfg.ADD_URI_SAFE_ATTR) {
      addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
    }
    if (cfg.FORBID_CONTENTS) {
      if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
        FORBID_CONTENTS = clone(FORBID_CONTENTS);
      }
      addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
    }
    if (KEEP_CONTENT) {
      ALLOWED_TAGS["#text"] = true;
    }
    if (WHOLE_DOCUMENT) {
      addToSet(ALLOWED_TAGS, ["html", "head", "body"]);
    }
    if (ALLOWED_TAGS.table) {
      addToSet(ALLOWED_TAGS, ["tbody"]);
      delete FORBID_TAGS.tbody;
    }
    if (cfg.TRUSTED_TYPES_POLICY) {
      if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== "function") {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      }
      if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== "function") {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      }
      trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
      emptyHTML = trustedTypesPolicy.createHTML("");
    } else {
      if (trustedTypesPolicy === void 0) {
        trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
      }
      if (trustedTypesPolicy !== null && typeof emptyHTML === "string") {
        emptyHTML = trustedTypesPolicy.createHTML("");
      }
    }
    if (freeze) {
      freeze(cfg);
    }
    CONFIG = cfg;
  };
  const ALL_SVG_TAGS = addToSet({}, [...svg$1, ...svgFilters, ...svgDisallowed]);
  const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
  const _checkValidNamespace = function _checkValidNamespace2(element) {
    let parent = getParentNode(element);
    if (!parent || !parent.tagName) {
      parent = {
        namespaceURI: NAMESPACE,
        tagName: "template"
      };
    }
    const tagName = stringToLowerCase(element.tagName);
    const parentTagName = stringToLowerCase(parent.tagName);
    if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
      return false;
    }
    if (element.namespaceURI === SVG_NAMESPACE) {
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === "svg";
      }
      if (parent.namespaceURI === MATHML_NAMESPACE) {
        return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
      }
      return Boolean(ALL_SVG_TAGS[tagName]);
    }
    if (element.namespaceURI === MATHML_NAMESPACE) {
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === "math";
      }
      if (parent.namespaceURI === SVG_NAMESPACE) {
        return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
      }
      return Boolean(ALL_MATHML_TAGS[tagName]);
    }
    if (element.namespaceURI === HTML_NAMESPACE) {
      if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
    }
    if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && ALLOWED_NAMESPACES[element.namespaceURI]) {
      return true;
    }
    return false;
  };
  const _forceRemove = function _forceRemove2(node) {
    arrayPush(DOMPurify.removed, {
      element: node
    });
    try {
      getParentNode(node).removeChild(node);
    } catch (_2) {
      remove(node);
    }
  };
  const _removeAttribute = function _removeAttribute2(name, element) {
    try {
      arrayPush(DOMPurify.removed, {
        attribute: element.getAttributeNode(name),
        from: element
      });
    } catch (_2) {
      arrayPush(DOMPurify.removed, {
        attribute: null,
        from: element
      });
    }
    element.removeAttribute(name);
    if (name === "is") {
      if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
        try {
          _forceRemove(element);
        } catch (_2) {
        }
      } else {
        try {
          element.setAttribute(name, "");
        } catch (_2) {
        }
      }
    }
  };
  const _initDocument = function _initDocument2(dirty) {
    let doc = null;
    let leadingWhitespace = null;
    if (FORCE_BODY) {
      dirty = "<remove></remove>" + dirty;
    } else {
      const matches = stringMatch(dirty, /^[\r\n\t ]+/);
      leadingWhitespace = matches && matches[0];
    }
    if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) {
      dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + "</body></html>";
    }
    const dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
    if (NAMESPACE === HTML_NAMESPACE) {
      try {
        doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
      } catch (_2) {
      }
    }
    if (!doc || !doc.documentElement) {
      doc = implementation.createDocument(NAMESPACE, "template", null);
      try {
        doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
      } catch (_2) {
      }
    }
    const body = doc.body || doc.documentElement;
    if (dirty && leadingWhitespace) {
      body.insertBefore(document2.createTextNode(leadingWhitespace), body.childNodes[0] || null);
    }
    if (NAMESPACE === HTML_NAMESPACE) {
      return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
    }
    return WHOLE_DOCUMENT ? doc.documentElement : body;
  };
  const _createNodeIterator = function _createNodeIterator2(root) {
    return createNodeIterator.call(
      root.ownerDocument || root,
      root,
      // eslint-disable-next-line no-bitwise
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_PROCESSING_INSTRUCTION | NodeFilter.SHOW_CDATA_SECTION,
      null
    );
  };
  const _isClobbered = function _isClobbered2(element) {
    return element instanceof HTMLFormElement && (typeof element.nodeName !== "string" || typeof element.textContent !== "string" || typeof element.removeChild !== "function" || !(element.attributes instanceof NamedNodeMap) || typeof element.removeAttribute !== "function" || typeof element.setAttribute !== "function" || typeof element.namespaceURI !== "string" || typeof element.insertBefore !== "function" || typeof element.hasChildNodes !== "function");
  };
  const _isNode = function _isNode2(value) {
    return typeof Node === "function" && value instanceof Node;
  };
  function _executeHooks(hooks2, currentNode, data) {
    arrayForEach(hooks2, (hook) => {
      hook.call(DOMPurify, currentNode, data, CONFIG);
    });
  }
  const _sanitizeElements = function _sanitizeElements2(currentNode) {
    let content = null;
    _executeHooks(hooks.beforeSanitizeElements, currentNode, null);
    if (_isClobbered(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    const tagName = transformCaseFunc(currentNode.nodeName);
    _executeHooks(hooks.uponSanitizeElement, currentNode, {
      tagName,
      allowedTags: ALLOWED_TAGS
    });
    if (SAFE_FOR_XML && currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(/<[/\w!]/g, currentNode.innerHTML) && regExpTest(/<[/\w!]/g, currentNode.textContent)) {
      _forceRemove(currentNode);
      return true;
    }
    if (currentNode.nodeType === NODE_TYPE.progressingInstruction) {
      _forceRemove(currentNode);
      return true;
    }
    if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(/<[/\w]/g, currentNode.data)) {
      _forceRemove(currentNode);
      return true;
    }
    if (!(EXTRA_ELEMENT_HANDLING.tagCheck instanceof Function && EXTRA_ELEMENT_HANDLING.tagCheck(tagName)) && (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName])) {
      if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName)) {
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) {
          return false;
        }
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) {
          return false;
        }
      }
      if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
        const parentNode = getParentNode(currentNode) || currentNode.parentNode;
        const childNodes = getChildNodes(currentNode) || currentNode.childNodes;
        if (childNodes && parentNode) {
          const childCount = childNodes.length;
          for (let i = childCount - 1; i >= 0; --i) {
            const childClone = cloneNode(childNodes[i], true);
            childClone.__removalCount = (currentNode.__removalCount || 0) + 1;
            parentNode.insertBefore(childClone, getNextSibling(currentNode));
          }
        }
      }
      _forceRemove(currentNode);
      return true;
    }
    if (currentNode instanceof Element && !_checkValidNamespace(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    if ((tagName === "noscript" || tagName === "noembed" || tagName === "noframes") && regExpTest(/<\/no(script|embed|frames)/i, currentNode.innerHTML)) {
      _forceRemove(currentNode);
      return true;
    }
    if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
      content = currentNode.textContent;
      arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
        content = stringReplace(content, expr, " ");
      });
      if (currentNode.textContent !== content) {
        arrayPush(DOMPurify.removed, {
          element: currentNode.cloneNode()
        });
        currentNode.textContent = content;
      }
    }
    _executeHooks(hooks.afterSanitizeElements, currentNode, null);
    return false;
  };
  const _isValidAttribute = function _isValidAttribute2(lcTag, lcName, value) {
    if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document2 || value in formElement)) {
      return false;
    }
    if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR2, lcName)) ;
    else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR2, lcName)) ;
    else if (EXTRA_ELEMENT_HANDLING.attributeCheck instanceof Function && EXTRA_ELEMENT_HANDLING.attributeCheck(lcName, lcTag)) ;
    else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
      if (
        // First condition does a very basic check if a) it's basically a valid custom element tagname AND
        // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
        // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
        _isBasicCustomElement(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName, lcTag)) || // Alternative, second condition checks if it's an `is`-attribute, AND
        // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
        lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))
      ) ;
      else {
        return false;
      }
    } else if (URI_SAFE_ATTRIBUTES[lcName]) ;
    else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE2, ""))) ;
    else if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag]) ;
    else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA2, stringReplace(value, ATTR_WHITESPACE2, ""))) ;
    else if (value) {
      return false;
    } else ;
    return true;
  };
  const _isBasicCustomElement = function _isBasicCustomElement2(tagName) {
    return tagName !== "annotation-xml" && stringMatch(tagName, CUSTOM_ELEMENT2);
  };
  const _sanitizeAttributes = function _sanitizeAttributes2(currentNode) {
    _executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
    const {
      attributes
    } = currentNode;
    if (!attributes || _isClobbered(currentNode)) {
      return;
    }
    const hookEvent = {
      attrName: "",
      attrValue: "",
      keepAttr: true,
      allowedAttributes: ALLOWED_ATTR,
      forceKeepAttr: void 0
    };
    let l = attributes.length;
    while (l--) {
      const attr = attributes[l];
      const {
        name,
        namespaceURI,
        value: attrValue
      } = attr;
      const lcName = transformCaseFunc(name);
      const initValue = attrValue;
      let value = name === "value" ? initValue : stringTrim(initValue);
      hookEvent.attrName = lcName;
      hookEvent.attrValue = value;
      hookEvent.keepAttr = true;
      hookEvent.forceKeepAttr = void 0;
      _executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
      value = hookEvent.attrValue;
      if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name")) {
        _removeAttribute(name, currentNode);
        value = SANITIZE_NAMED_PROPS_PREFIX + value;
      }
      if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|title|textarea)/i, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (lcName === "attributename" && stringMatch(value, "href")) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (hookEvent.forceKeepAttr) {
        continue;
      }
      if (!hookEvent.keepAttr) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(/\/>/i, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (SAFE_FOR_TEMPLATES) {
        arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
          value = stringReplace(value, expr, " ");
        });
      }
      const lcTag = transformCaseFunc(currentNode.nodeName);
      if (!_isValidAttribute(lcTag, lcName, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      if (trustedTypesPolicy && typeof trustedTypes === "object" && typeof trustedTypes.getAttributeType === "function") {
        if (namespaceURI) ;
        else {
          switch (trustedTypes.getAttributeType(lcTag, lcName)) {
            case "TrustedHTML": {
              value = trustedTypesPolicy.createHTML(value);
              break;
            }
            case "TrustedScriptURL": {
              value = trustedTypesPolicy.createScriptURL(value);
              break;
            }
          }
        }
      }
      if (value !== initValue) {
        try {
          if (namespaceURI) {
            currentNode.setAttributeNS(namespaceURI, name, value);
          } else {
            currentNode.setAttribute(name, value);
          }
          if (_isClobbered(currentNode)) {
            _forceRemove(currentNode);
          } else {
            arrayPop(DOMPurify.removed);
          }
        } catch (_2) {
          _removeAttribute(name, currentNode);
        }
      }
    }
    _executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
  };
  const _sanitizeShadowDOM = function _sanitizeShadowDOM2(fragment) {
    let shadowNode = null;
    const shadowIterator = _createNodeIterator(fragment);
    _executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
    while (shadowNode = shadowIterator.nextNode()) {
      _executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
      _sanitizeElements(shadowNode);
      _sanitizeAttributes(shadowNode);
      if (shadowNode.content instanceof DocumentFragment) {
        _sanitizeShadowDOM2(shadowNode.content);
      }
    }
    _executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
  };
  DOMPurify.sanitize = function(dirty) {
    let cfg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let body = null;
    let importedNode = null;
    let currentNode = null;
    let returnNode = null;
    IS_EMPTY_INPUT = !dirty;
    if (IS_EMPTY_INPUT) {
      dirty = "<!-->";
    }
    if (typeof dirty !== "string" && !_isNode(dirty)) {
      if (typeof dirty.toString === "function") {
        dirty = dirty.toString();
        if (typeof dirty !== "string") {
          throw typeErrorCreate("dirty is not a string, aborting");
        }
      } else {
        throw typeErrorCreate("toString is not a function");
      }
    }
    if (!DOMPurify.isSupported) {
      return dirty;
    }
    if (!SET_CONFIG) {
      _parseConfig(cfg);
    }
    DOMPurify.removed = [];
    if (typeof dirty === "string") {
      IN_PLACE = false;
    }
    if (IN_PLACE) {
      if (dirty.nodeName) {
        const tagName = transformCaseFunc(dirty.nodeName);
        if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
          throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
        }
      }
    } else if (dirty instanceof Node) {
      body = _initDocument("<!---->");
      importedNode = body.ownerDocument.importNode(dirty, true);
      if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === "BODY") {
        body = importedNode;
      } else if (importedNode.nodeName === "HTML") {
        body = importedNode;
      } else {
        body.appendChild(importedNode);
      }
    } else {
      if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && // eslint-disable-next-line unicorn/prefer-includes
      dirty.indexOf("<") === -1) {
        return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
      }
      body = _initDocument(dirty);
      if (!body) {
        return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
      }
    }
    if (body && FORCE_BODY) {
      _forceRemove(body.firstChild);
    }
    const nodeIterator = _createNodeIterator(IN_PLACE ? dirty : body);
    while (currentNode = nodeIterator.nextNode()) {
      _sanitizeElements(currentNode);
      _sanitizeAttributes(currentNode);
      if (currentNode.content instanceof DocumentFragment) {
        _sanitizeShadowDOM(currentNode.content);
      }
    }
    if (IN_PLACE) {
      return dirty;
    }
    if (RETURN_DOM) {
      if (RETURN_DOM_FRAGMENT) {
        returnNode = createDocumentFragment.call(body.ownerDocument);
        while (body.firstChild) {
          returnNode.appendChild(body.firstChild);
        }
      } else {
        returnNode = body;
      }
      if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) {
        returnNode = importNode.call(originalDocument, returnNode, true);
      }
      return returnNode;
    }
    let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
    if (WHOLE_DOCUMENT && ALLOWED_TAGS["!doctype"] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
      serializedHTML = "<!DOCTYPE " + body.ownerDocument.doctype.name + ">\n" + serializedHTML;
    }
    if (SAFE_FOR_TEMPLATES) {
      arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
        serializedHTML = stringReplace(serializedHTML, expr, " ");
      });
    }
    return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
  };
  DOMPurify.setConfig = function() {
    let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    _parseConfig(cfg);
    SET_CONFIG = true;
  };
  DOMPurify.clearConfig = function() {
    CONFIG = null;
    SET_CONFIG = false;
  };
  DOMPurify.isValidAttribute = function(tag, attr, value) {
    if (!CONFIG) {
      _parseConfig({});
    }
    const lcTag = transformCaseFunc(tag);
    const lcName = transformCaseFunc(attr);
    return _isValidAttribute(lcTag, lcName, value);
  };
  DOMPurify.addHook = function(entryPoint, hookFunction) {
    if (typeof hookFunction !== "function") {
      return;
    }
    arrayPush(hooks[entryPoint], hookFunction);
  };
  DOMPurify.removeHook = function(entryPoint, hookFunction) {
    if (hookFunction !== void 0) {
      const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
      return index === -1 ? void 0 : arraySplice(hooks[entryPoint], index, 1)[0];
    }
    return arrayPop(hooks[entryPoint]);
  };
  DOMPurify.removeHooks = function(entryPoint) {
    hooks[entryPoint] = [];
  };
  DOMPurify.removeAllHooks = function() {
    hooks = _createHooksMap();
  };
  return DOMPurify;
}
var purify = createDOMPurify();

// src/panel.css
var panel_default = '.dcp-root{--dcp-bg:#fff;--dcp-side:#f8f9fb;--dcp-text:#22252b;--dcp-muted:#848991;--dcp-line:#e9ebef;--dcp-accent:#4b6bdb;--dcp-soft:#eef2ff;--dcp-hover:#eceff4;display:flex;width:100%;height:100%;min-height:0;background:var(--dcp-bg);color:var(--dcp-text);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC",sans-serif;font-size:14px;line-height:1.6;position:relative;isolation:isolate;overflow:hidden}.dcp-root *{box-sizing:border-box}.dcp-root button,.dcp-root input,.dcp-root textarea{font:inherit;color:inherit}.dcp-root button{cursor:pointer;line-height:1.4}.dcp-root button:disabled{cursor:default;opacity:.4}.dcp-root button:focus-visible,.dcp-root input:focus-visible,.dcp-root textarea:focus-visible{outline:2px solid var(--dcp-accent);outline-offset:3px}.dcp-root svg{flex-shrink:0}.dcp-root button{transition:background .15s,color .15s,opacity .15s}.dcp-icon{border:0;background:transparent;width:30px;height:30px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;color:var(--dcp-muted)!important}.dcp-icon:hover{background:var(--dcp-hover);color:var(--dcp-text)!important}.dcp-sidebar{width:224px;flex-shrink:0;background:var(--dcp-side);border-right:1px solid var(--dcp-line);display:flex;flex-direction:column;padding:0 13px}.dcp-sidebar-head{height:76px;padding-top:var(--dsh-frame-top-clearance,0px);min-height:76px;display:flex;align-items:center;justify-content:space-between;gap:7px}.dcp-brand{display:flex;align-items:center;gap:9px;font-size:13px;white-space:nowrap}.dcp-brand b{font-weight:600}.dcp-brand-mark,.dcp-mini-mark{display:inline-flex;align-items:center;justify-content:center;border-radius:8px;background:var(--dcp-accent);color:#fff;font-weight:700;font-size:16px;width:27px;height:27px;font-family:Georgia,serif}.dcp-new{background:var(--dcp-bg);border:1px solid var(--dcp-line);border-radius:9px;width:100%;height:40px;display:flex;align-items:center;gap:9px;padding:0 11px;font-size:13px!important;box-shadow:0 1px 2px #00000004}.dcp-new:hover{background:var(--dcp-soft)}.dcp-new>span{margin-left:auto;color:#a1a6af;font-size:10px;display:none}.dcp-search{display:flex;align-items:center;gap:8px;margin:15px 2px 19px;color:var(--dcp-muted)}.dcp-search input{background:none;border:0;outline:none;width:100%;font-size:12px!important;padding:3px 0}.dcp-search input:focus-visible{outline:0}.dcp-search input::placeholder{color:var(--dcp-muted)}.dcp-history-heading{padding:0 10px 9px;color:var(--dcp-muted);font-size:10px;letter-spacing:.08em;display:flex;justify-content:space-between}.dcp-history-heading span{font-size:10px;opacity:.65}.dcp-history{overflow:auto;flex:1;min-height:0;margin:0 -4px;padding:0 4px 20px;scrollbar-width:thin}.dcp-history-row{display:flex;align-items:center;border-radius:8px;min-height:38px;margin-bottom:4px}.dcp-history-row:hover{background:var(--dcp-hover)}.dcp-history-row.is-active{background:#e9edf7}.dcp-history-select{flex:1;min-width:0;border:0;background:transparent;display:flex;align-items:center;gap:6px;text-align:left;padding:10px 10px;font-size:12px!important;line-height:1.4!important}.dcp-history-select>span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1}.dcp-history-select small{font-size:9px;color:var(--dcp-muted);flex-shrink:0}.dcp-delete{width:26px;flex-shrink:0;border:0;background:transparent;color:var(--dcp-muted)!important;display:none;align-items:center;justify-content:center;padding:4px}.dcp-history-row:hover .dcp-delete,.dcp-history-row:focus-within .dcp-delete{display:flex}.dcp-history-row:hover .dcp-history-select small{display:none}.dcp-delete:hover{color:#c14444!important}.dcp-empty-history{color:var(--dcp-muted);font-size:12px;margin:12px 10px}.dcp-sidebar-foot{border-top:1px solid var(--dcp-line);display:flex;align-items:center;gap:7px;color:var(--dcp-muted);font-size:10px;padding:12px 2px;min-height:56px}.dcp-sidebar-foot>.dcp-icon{margin-left:auto}.dcp-dot{width:6px;height:6px;border-radius:50%;background:#b6bbc4;display:inline-block;flex-shrink:0}.dcp-dot.is-online{background:#5aa382}.dcp-main{flex:1;min-width:0;min-height:0;display:flex;flex-direction:column;position:relative}.dcp-topbar{height:65px;min-height:65px;display:flex;align-items:center;justify-content:space-between;padding:0 26px 0 max(26px,var(--dsh-frame-leading-clearance,0px));gap:12px;border-bottom:1px solid var(--dcp-line)}.dcp-heading{display:flex;align-items:center;gap:9px;white-space:nowrap;font-size:14px;font-weight:600}.dcp-web-badge{font-size:9px;font-weight:400;color:var(--dcp-muted);padding:1px 5px;border:1px solid var(--dcp-line);border-radius:4px}.dcp-top-actions{display:flex;align-items:center;gap:12px}.dcp-mode{padding:3px;background:var(--dcp-side);border:1px solid var(--dcp-line);border-radius:8px;display:flex}.dcp-mode button{border:0;border-radius:5px;background:transparent;color:var(--dcp-muted);font-size:11px!important;padding:5px 13px}.dcp-mode .is-active{color:var(--dcp-text);background:var(--dcp-bg);box-shadow:0 1px 4px #0000000d}.dcp-mode button:not(.is-active):hover{color:var(--dcp-text)}.dcp-route-note{display:flex;align-items:center;justify-content:center;flex-shrink:0;gap:6px;min-height:36px;font-size:9px;color:var(--dcp-muted);background:color-mix(in srgb,var(--dcp-side) 55%,var(--dcp-bg));padding:4px 10px}.dcp-route-dot{width:4px;height:4px;background:var(--dcp-accent);border-radius:50%}.dcp-route-separator{margin:0 3px;opacity:.6}.dcp-route-note button{border:0;background:none;color:var(--dcp-accent);font-size:9px!important;display:inline-flex;gap:3px;align-items:center;padding:1px 3px;margin-left:7px}.dcp-alert{margin:10px 22px 0;border:1px solid #e7d9ba;border-radius:8px;background:#fffaf0;color:#85652d;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 11px;font-size:12px;flex-shrink:0;max-height:100px;overflow:auto}.dcp-alert .dcp-icon{height:24px;width:24px;flex-shrink:0}.dcp-settings{margin:14px 22px 0;padding:16px 18px;border:1px solid var(--dcp-line);border-radius:12px;background:var(--dcp-side);font-size:12px;flex-shrink:0;max-height:50%;overflow:auto}.dcp-settings>div:first-child{display:flex;justify-content:space-between;align-items:center}.dcp-settings strong{font-size:13px}.dcp-settings p{color:var(--dcp-muted);margin:7px 0 14px}.dcp-enable{display:flex;align-items:center;gap:8px;font-size:12px}.dcp-enable input{accent-color:var(--dcp-accent);width:15px;height:15px}.dcp-settings-actions{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin:14px 0 9px}.dcp-settings>small{font-size:10px;color:var(--dcp-muted);display:block}.dcp-secondary,.dcp-primary,.dcp-danger{border:1px solid var(--dcp-line);border-radius:7px;background:var(--dcp-bg);padding:8px 13px;font-size:12px!important;display:inline-flex;align-items:center;justify-content:center;gap:6px}.dcp-secondary:hover{background:var(--dcp-hover)}.dcp-primary{background:var(--dcp-accent);color:white!important;border-color:var(--dcp-accent)}.dcp-primary:hover{background:#3c5bc8}.dcp-danger{background:#c54a4a;color:#fff!important;border-color:#c54a4a}.dcp-text-button{display:inline-flex;align-items:center;gap:4px;border:0;background:none;color:var(--dcp-accent)!important;font-size:11px!important;padding:0}.dcp-messages{flex:1;min-height:0;overflow-y:auto;scrollbar-width:thin;padding:28px 24px 12px;scroll-behavior:auto}.dcp-welcome{max-width:640px;margin:clamp(25px,7vh,90px) auto 15px;text-align:center}.dcp-welcome-mark{font-family:Georgia,serif;position:relative;margin:0 auto 17px;width:50px;height:50px;border-radius:16px;color:var(--dcp-accent);background:var(--dcp-soft);display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:700}.dcp-welcome-mark span{font-size:13px;position:absolute;right:-5px;top:-3px;font-family:inherit}.dcp-welcome h1{font-size:25px;letter-spacing:-.5px;font-weight:550;line-height:1.4;margin:0 0 9px}.dcp-welcome>p{font-size:12px;color:var(--dcp-muted);margin:0 0 25px}.dcp-start-card{max-width:450px;text-align:left;margin:0 auto;padding:17px 20px;border:1px solid var(--dcp-line);border-radius:13px;background:var(--dcp-bg);box-shadow:0 3px 16px #00000003}.dcp-start-card>strong{font-size:12px;font-weight:600}.dcp-start-card>p{font-size:11px;color:var(--dcp-muted);line-height:1.85;margin:5px 0 15px}.dcp-start-card>div{display:flex;gap:9px;flex-wrap:wrap}.dcp-start-card>small{display:block;font-size:9px;color:var(--dcp-muted);margin-top:10px}.dcp-suggestions{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin-top:18px}.dcp-suggestions button{background:transparent;border:1px solid var(--dcp-line);border-radius:7px;padding:9px 11px;display:flex;align-items:center;gap:16px;font-size:10px!important;color:var(--dcp-muted)}.dcp-suggestions button:hover{background:var(--dcp-side)}.dcp-suggestions button span{color:#b0b5bf}.dcp-message-list{max-width:760px;margin:0 auto}.dcp-message{display:flex;flex-direction:column;margin:0 0 24px}.dcp-message-label{font-size:10px;font-weight:600;display:flex;align-items:center;gap:6px;margin-bottom:8px;color:var(--dcp-muted)}.dcp-mini-mark{width:18px;height:18px;border-radius:5px;font-size:11px}.dcp-message-user{align-items:flex-end}.dcp-message-user .dcp-message-label{display:none}.dcp-message-content{max-width:100%;min-width:0}.dcp-message-user .dcp-message-content{max-width:85%}.dcp-user-text{padding:11px 16px;background:var(--dcp-side);border-radius:16px 16px 3px 16px;white-space:pre-wrap;overflow-wrap:anywhere;font-size:13px}.dcp-markdown{font-size:13px;line-height:1.9;overflow-wrap:anywhere}.dcp-markdown>:first-child{margin-top:0}.dcp-markdown>:last-child{margin-bottom:0}.dcp-markdown p{margin:0 0 14px}.dcp-markdown h1,.dcp-markdown h2,.dcp-markdown h3,.dcp-markdown h4{line-height:1.5;margin:22px 0 10px;font-weight:600}.dcp-markdown h1{font-size:23px}.dcp-markdown h2{font-size:20px}.dcp-markdown h3{font-size:17px}.dcp-markdown h4{font-size:15px}.dcp-markdown a{color:var(--dcp-accent);text-decoration:underline;text-underline-offset:3px}.dcp-markdown blockquote{border-left:3px solid var(--dcp-line);padding:2px 15px;margin:15px 0;color:var(--dcp-muted)}.dcp-markdown ul,.dcp-markdown ol{padding-left:23px;margin:8px 0 15px}.dcp-markdown li{margin:4px 0}.dcp-markdown li>p{margin:0}.dcp-markdown pre{padding:0;margin:14px 0;background:#f5f6f8;border:1px solid var(--dcp-line);border-radius:9px;overflow:hidden;max-width:100%;line-height:1.7}.dcp-markdown pre>code{display:block;padding:13px 15px;overflow-x:auto;font-size:12px;background:transparent;white-space:pre;word-break:normal}.dcp-markdown code{font-family:"SFMono-Regular",Consolas,"Liberation Mono",monospace;border-radius:4px;padding:2px 5px;background:var(--dcp-side);font-size:12px}.dcp-code-bar{display:flex;justify-content:space-between;align-items:center;padding:7px 13px;background:#edefF2;border-bottom:1px solid var(--dcp-line);color:var(--dcp-muted);font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:10px}.dcp-code-bar button{border:0;background:transparent;font-size:10px!important;color:var(--dcp-muted);padding:1px 0}.dcp-code-bar button:hover{color:var(--dcp-text)}.dcp-markdown table{display:block;border-collapse:collapse;max-width:100%;overflow-x:auto;margin:14px 0;font-size:12px}.dcp-markdown th,.dcp-markdown td{border:1px solid var(--dcp-line);padding:7px 11px;white-space:normal}.dcp-markdown th{background:var(--dcp-side);text-align:left}.dcp-markdown hr{border:0;border-top:1px solid var(--dcp-line);margin:22px 0}.dcp-markdown input{pointer-events:none;accent-color:var(--dcp-accent)}.dcp-copy-message{display:inline-flex;align-items:center;gap:4px;margin:7px 0 0;padding:3px 0;border:0;background:none;color:var(--dcp-muted)!important;font-size:10px!important}.dcp-copy-message:hover{color:var(--dcp-text)!important}.dcp-stream-state{display:flex;align-items:center;gap:4px;font-size:10px;color:var(--dcp-muted);margin:0 0 12px}.dcp-stream-state>span{display:inline-block;width:4px;height:4px;border-radius:50%;background:var(--dcp-accent);animation:dcp-pulse 1.4s infinite}.dcp-stream-state>span:nth-child(2){animation-delay:.15s}.dcp-stream-state>span:nth-child(3){animation-delay:.3s;margin-right:5px}@keyframes dcp-pulse{0%,70%,100%{opacity:.3;transform:translateY(0)}35%{opacity:1;transform:translateY(-3px)}}.dcp-partial-note{font-size:11px;color:var(--dcp-muted);border-left:2px solid #d9c699;padding:4px 10px;margin-bottom:16px}.dcp-composer-wrap{flex-shrink:0;padding:12px 24px 13px;background:var(--dcp-bg)}.dcp-composer{max-width:760px;margin:0 auto;border:1px solid #e3e5ea;border-radius:16px;background:#fafbfc;padding:14px 14px 10px;box-shadow:0 3px 12px #00000003}.dcp-composer:focus-within{border-color:#b7c5f1;box-shadow:0 0 0 2px #4b6bdb07}.dcp-composer textarea{resize:none;width:100%;display:block;min-height:28px;max-height:180px;padding:0 3px;background:none;border:0;outline:0!important;font-size:13px;line-height:1.65}.dcp-composer textarea::placeholder{color:#a4a9b1}.dcp-composer textarea:disabled{cursor:default}.dcp-composer-bottom{display:flex;align-items:center;justify-content:space-between;margin-top:7px;gap:10px}.dcp-composer-source{display:flex;align-items:center;gap:6px;background:transparent;border:0;font-size:9px!important;color:var(--dcp-muted)!important;padding:4px 3px}.dcp-send{width:32px;height:32px;display:flex;align-items:center;justify-content:center;border:0;border-radius:10px;color:white!important;background:var(--dcp-accent)}.dcp-send:hover{background:#3c5bc8}.dcp-send:disabled{background:#dce1e9;opacity:1;color:#fff!important}.dcp-send.is-stop{background:var(--dcp-text);border-radius:50%}.dcp-composer-caption{max-width:760px;margin:9px auto 0;text-align:center;color:#a1a6ae;font-size:8px;display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap}.dcp-composer-caption button{font-size:8px!important;border:0;background:none;color:var(--dcp-muted);padding:0}.dcp-composer-caption button:hover{color:var(--dcp-accent)}.dcp-scroll-bottom{position:absolute;bottom:165px;left:50%;width:30px;height:30px;border:1px solid var(--dcp-line);border-radius:50%;background:var(--dcp-bg);box-shadow:0 2px 8px #0000000a;color:var(--dcp-muted);font-size:18px!important;line-height:1!important;z-index:2}.dcp-dialog-mask{position:absolute;inset:0;z-index:20;background:#20242c45;backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:22px}.dcp-dialog{background:var(--dcp-bg);border:1px solid var(--dcp-line);width:min(400px,100%);border-radius:15px;box-shadow:0 10px 40px #00000015;padding:22px}.dcp-dialog h2{font-size:17px;font-weight:600;margin:0 0 9px}.dcp-dialog p{font-size:12px;color:var(--dcp-muted);margin:0 0 22px;line-height:1.8}.dcp-dialog>div{display:flex;justify-content:flex-end;gap:10px}.dcp-mobile-menu,.dcp-mobile-close,.dcp-sidebar-mask{display:none}.dcp-root [data-window-drag]{-webkit-app-region:drag}.dcp-root button,.dcp-root input,.dcp-root textarea{-webkit-app-region:no-drag}\n@media(max-width:1000px){.dcp-sidebar{width:195px;padding:0 10px}.dcp-topbar{padding-right:18px;padding-left:max(18px,var(--dsh-frame-leading-clearance,0px))}.dcp-heading{font-size:13px}.dcp-top-actions{gap:5px}.dcp-mode button{padding:5px 9px}.dcp-messages{padding:24px 18px 10px}.dcp-composer-wrap{padding-left:18px;padding-right:18px}.dcp-welcome h1{font-size:23px}.dcp-suggestions{gap:6px}.dcp-suggestions button{padding:8px 9px;gap:8px}}\n@media(max-width:650px){.dcp-sidebar{position:absolute;inset:0 auto 0 0;z-index:12;width:240px;transform:translateX(-100%);transition:transform .18s}.dcp-sidebar.is-open{transform:translateX(0)}.dcp-sidebar-head{height:70px;min-height:70px;padding-top:10px}.dcp-mobile-menu,.dcp-mobile-close{display:inline-flex}.dcp-sidebar-mask{display:block;border:0;position:absolute;inset:0;background:#0004;z-index:11}.dcp-topbar{height:58px;min-height:58px;padding-right:12px;padding-left:max(10px,var(--dsh-frame-leading-clearance,0px))}.dcp-heading{gap:5px;font-size:12px}.dcp-web-badge{display:none}.dcp-top-actions>.dcp-icon{display:none}.dcp-mode button{font-size:10px!important;padding:5px 9px}.dcp-route-note{font-size:8px;gap:4px;min-height:32px}.dcp-route-note button{font-size:8px!important;margin-left:0}.dcp-messages{padding:22px 16px 8px}.dcp-welcome{margin-top:30px}.dcp-welcome h1{font-size:21px}.dcp-welcome>p{font-size:11px}.dcp-start-card{padding:15px}.dcp-start-card .dcp-primary,.dcp-start-card .dcp-secondary{font-size:10px!important;padding:8px 10px}.dcp-suggestions button{font-size:9px!important;padding:7px 8px}.dcp-composer-wrap{padding:9px 12px 12px}.dcp-composer-caption{font-size:7px;gap:5px}.dcp-composer-caption button{font-size:7px!important}.dcp-settings{margin:10px 12px 0;padding:12px}.dcp-alert{margin:10px 12px 0}.dcp-message-user .dcp-message-content{max-width:92%}.dcp-markdown,.dcp-user-text{font-size:12px}.dcp-markdown pre>code{font-size:11px}.dcp-delete{display:flex}.dcp-history-select small{display:none}}\n@media(prefers-color-scheme:dark){.dcp-root{--dcp-bg:#202124;--dcp-side:#1a1b1e;--dcp-text:#e5e7ed;--dcp-muted:#9298a5;--dcp-line:#33363e;--dcp-accent:#7995ff;--dcp-soft:#2a334d;--dcp-hover:#2d3037}.dcp-history-row.is-active{background:#2b3141}.dcp-composer{background:#282a2f;border-color:#383c45}.dcp-composer:focus-within{border-color:#5b6d9d}.dcp-composer textarea::placeholder{color:#7d8390}.dcp-send{background:#617fe0}.dcp-send:disabled{background:#3d4350;color:#656d80!important}.dcp-send.is-stop{background:#dae1f2;color:#202124!important}.dcp-markdown pre{background:#17191d}.dcp-code-bar{background:#24272e}.dcp-alert{background:#352e20;border-color:#5b4d30;color:#d0b885}.dcp-start-card{box-shadow:none}.dcp-primary{background:#5b77d4;color:#fff!important;border-color:#5b77d4}.dcp-route-note{background:#1d1f23}.dcp-scroll-bottom{box-shadow:0 2px 8px #0004}}\n@media(prefers-reduced-motion:reduce){.dcp-root *{transition:none!important;animation:none!important;scroll-behavior:auto!important}}\n\n.dcp-recovery{border:1px solid var(--dcp-line);border-radius:10px;padding:13px 15px;margin:16px 0;font-size:11px;color:var(--dcp-muted)}.dcp-recovery p{margin:0 0 11px}.dcp-recovery button+button{margin-left:8px}\n';

// src/client.jsx
var PANEL_ID = "dsh-chatgpt-panel";
var API_BASE = "/api/dsh-chatgpt-panel";
var OFFICIAL_URL = "https://chat.deepseek.com/";
var EMPTY_STATE = { chats: [], activeId: null, busy: false, enabled: false, browserOpen: false };
var inject = ["slots", "layout"];
function Icon({ kind = "chat", size = 18, ...props }) {
  const paths = {
    chat: /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("path", { d: "M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" })),
    plus: /* @__PURE__ */ import_react.default.createElement("path", { d: "M12 5v14M5 12h14" }),
    search: /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("circle", { cx: "10.8", cy: "10.8", r: "6.8" }), /* @__PURE__ */ import_react.default.createElement("path", { d: "m16 16 4.5 4.5" })),
    arrow: /* @__PURE__ */ import_react.default.createElement("path", { d: "M12 19V5m-6 6 6-6 6 6" }),
    external: /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("path", { d: "M14 3h7v7m0-7L10 14" }), /* @__PURE__ */ import_react.default.createElement("path", { d: "M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" })),
    copy: /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("rect", { x: "8", y: "8", width: "12", height: "13", rx: "2" }), /* @__PURE__ */ import_react.default.createElement("path", { d: "M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" })),
    trash: /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("path", { d: "M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7" })),
    settings: /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("path", { d: "M4 7h16M4 17h16" }), /* @__PURE__ */ import_react.default.createElement("circle", { cx: "9", cy: "7", r: "3" }), /* @__PURE__ */ import_react.default.createElement("circle", { cx: "15", cy: "17", r: "3" })),
    menu: /* @__PURE__ */ import_react.default.createElement("path", { d: "M4 6h16M4 12h16M4 18h16" }),
    close: /* @__PURE__ */ import_react.default.createElement("path", { d: "m6 6 12 12M6 18 18 6" }),
    stop: /* @__PURE__ */ import_react.default.createElement("rect", { x: "6", y: "6", width: "12", height: "12", rx: "2" }),
    check: /* @__PURE__ */ import_react.default.createElement("path", { d: "m5 12 4 4L19 6" })
  };
  return /* @__PURE__ */ import_react.default.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", ...props }, paths[kind] || paths.chat);
}
async function request(path, body, signal) {
  const response = await fetch(`${API_BASE}/${path}`, {
    method: body === void 0 ? "GET" : "POST",
    credentials: "same-origin",
    headers: body === void 0 ? {} : { "Content-Type": "application/json", "X-DSH-Chat": "1" },
    body: body === void 0 ? void 0 : JSON.stringify(body),
    signal,
    cache: "no-store"
  });
  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error("\u65E0\u6CD5\u8BFB\u53D6\u63D2\u4EF6\u54CD\u5E94\u3002\u8BF7\u786E\u8BA4\u63D2\u4EF6\u5DF2\u542F\u7528\uFF0C\u518D\u91CD\u65B0\u6253\u5F00\u9762\u677F\u3002");
  }
  if (!response.ok) throw new Error(payload.error || `\u8BF7\u6C42\u5931\u8D25\uFF08${response.status}\uFF09`);
  return payload;
}
function safeMarkdown(content) {
  const result = purify.sanitize(k.parse(String(content || ""), { gfm: true, breaks: true, async: false }), {
    ALLOWED_TAGS: ["p", "br", "strong", "em", "del", "a", "blockquote", "pre", "code", "ul", "ol", "li", "h1", "h2", "h3", "h4", "h5", "h6", "hr", "table", "thead", "tbody", "tr", "th", "td"],
    ALLOWED_ATTR: ["href", "title", "start", "align"],
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP: /^(?:https?:\/\/|mailto:)/i
  });
  return result.replace(/<a\b/g, '<a target="_blank" rel="noopener noreferrer"');
}
function Markdown({ content }) {
  const ref = (0, import_react.useRef)(null);
  const html2 = (0, import_react.useMemo)(() => safeMarkdown(content), [content]);
  (0, import_react.useEffect)(() => {
    const root = ref.current;
    if (!root) return;
    const removers = [];
    for (const pre of root.querySelectorAll("pre")) {
      const code = pre.querySelector("code");
      const bar = document.createElement("div");
      bar.className = "dcp-code-bar";
      const language = document.createElement("span");
      language.textContent = code?.className.match(/language-([\w+-]+)/)?.[1] || "\u4EE3\u7801";
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "\u590D\u5236\u4EE3\u7801";
      const click = async () => {
        try {
          await navigator.clipboard.writeText(code?.textContent || "");
          button.textContent = "\u5DF2\u590D\u5236";
        } catch {
          button.textContent = "\u590D\u5236\u5931\u8D25";
        }
      };
      button.addEventListener("click", click);
      bar.append(language, button);
      pre.prepend(bar);
      removers.push(() => button.removeEventListener("click", click));
    }
    return () => removers.forEach((remove) => remove());
  }, [html2]);
  return /* @__PURE__ */ import_react.default.createElement("div", { ref, className: "dcp-markdown", dangerouslySetInnerHTML: { __html: html2 } });
}
function CopyButton({ text: text2 }) {
  const [copied, setCopied] = (0, import_react.useState)(false);
  const timer = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => () => clearTimeout(timer.current), []);
  return /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dcp-copy-message", onClick: async () => {
    try {
      await navigator.clipboard.writeText(text2);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }, "aria-label": copied ? "\u5DF2\u590D\u5236\u6D88\u606F" : "\u590D\u5236\u6D88\u606F", title: copied ? "\u5DF2\u590D\u5236" : "\u590D\u5236\u6D88\u606F" }, /* @__PURE__ */ import_react.default.createElement(Icon, { kind: copied ? "check" : "copy", size: 15 }), copied && /* @__PURE__ */ import_react.default.createElement("span", null, "\u5DF2\u590D\u5236"));
}
function formatDate(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" });
}
function ChatPanel({ ctx }) {
  const [state, setState] = (0, import_react.useState)(EMPTY_STATE);
  const [loaded, setLoaded] = (0, import_react.useState)(false);
  const [error, setError] = (0, import_react.useState)("");
  const [query, setQuery] = (0, import_react.useState)("");
  const [drafts, setDrafts] = (0, import_react.useState)({});
  const [pending, setPending] = (0, import_react.useState)(false);
  const [showSettings, setShowSettings] = (0, import_react.useState)(false);
  const [mobileSidebar, setMobileSidebar] = (0, import_react.useState)(false);
  const [deleteId, setDeleteId] = (0, import_react.useState)(null);
  const [atBottom, setAtBottom] = (0, import_react.useState)(true);
  const mounted = (0, import_react.useRef)(false);
  const refreshInFlight = (0, import_react.useRef)(false);
  const list = (0, import_react.useRef)(null);
  const input = (0, import_react.useRef)(null);
  const composing = (0, import_react.useRef)(false);
  const abort = (0, import_react.useRef)(null);
  const mutationInFlight = (0, import_react.useRef)(false);
  const active = state.chats.find((chat) => chat.id === state.activeId) || null;
  const draftKey = active?.id || "__new";
  const draft = drafts[draftKey] || "";
  const busy = Boolean(state.busy || pending);
  const lockedChat = ["error", "partial", "blocked"].includes(active?.status);
  const chatList = (0, import_react.useMemo)(() => [...state.chats].sort((a, b2) => new Date(b2.updatedAt) - new Date(a.updatedAt)).filter((chat) => chat.title?.toLocaleLowerCase().includes(query.toLocaleLowerCase())), [state.chats, query]);
  const refresh = (0, import_react.useCallback)(async () => {
    if (refreshInFlight.current) return;
    refreshInFlight.current = true;
    try {
      const next = await request("state", void 0, abort.current?.signal);
      if (mounted.current) {
        setState({ ...EMPTY_STATE, ...next });
        setLoaded(true);
      }
    } catch (failure) {
      if (mounted.current && failure.name !== "AbortError") {
        setError(failure.message);
        setLoaded(true);
      }
    } finally {
      refreshInFlight.current = false;
    }
  }, []);
  (0, import_react.useEffect)(() => {
    mounted.current = true;
    abort.current = new AbortController();
    void refresh();
    const timer = setInterval(() => {
      if (!document.hidden) void refresh();
    }, 750);
    const visible = () => {
      if (!document.hidden) void refresh();
    };
    document.addEventListener("visibilitychange", visible);
    return () => {
      mounted.current = false;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", visible);
      abort.current?.abort();
    };
  }, [refresh]);
  (0, import_react.useEffect)(() => {
    const element = list.current;
    if (element && atBottom) element.scrollTop = element.scrollHeight;
  }, [active?.messages, active?.id, atBottom]);
  (0, import_react.useEffect)(() => {
    setAtBottom(true);
    setDeleteId(null);
  }, [active?.id]);
  (0, import_react.useEffect)(() => {
    if (!input.current) return;
    input.current.style.height = "auto";
    input.current.style.height = `${Math.min(input.current.scrollHeight, 180)}px`;
  }, [draft]);
  (0, import_react.useEffect)(() => {
    if (!deleteId && !showSettings && !mobileSidebar) return;
    const escape = (event) => {
      if (event.key === "Escape") {
        setDeleteId(null);
        setShowSettings(false);
        setMobileSidebar(false);
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [deleteId, showSettings, mobileSidebar]);
  const mutate = async (path, body = {}) => {
    if (mutationInFlight.current) return null;
    mutationInFlight.current = true;
    setPending(true);
    setError("");
    try {
      const result = await request(path, body, abort.current?.signal);
      await refresh();
      return result;
    } catch (failure) {
      if (mounted.current && failure.name !== "AbortError") setError(failure.message);
      return null;
    } finally {
      mutationInFlight.current = false;
      if (mounted.current) setPending(false);
    }
  };
  const newChat = async () => {
    if (busy) return;
    if (await mutate("new")) {
      setMobileSidebar(false);
      input.current?.focus();
    }
  };
  const send = async () => {
    if (!state.enabled || busy || lockedChat || mutationInFlight.current || !draft.trim()) return;
    mutationInFlight.current = true;
    setPending(true);
    setError("");
    const text2 = draft.trim();
    setAtBottom(true);
    let targetId = active?.id;
    try {
      if (!targetId) {
        const created = await request("new", {}, abort.current?.signal);
        if (!created?.id) throw new Error("\u65E0\u6CD5\u521B\u5EFA\u5BF9\u8BDD\uFF0C\u8BF7\u91CD\u65B0\u6253\u5F00\u9762\u677F\u3002");
        targetId = created.id;
        if (mounted.current) setDrafts((previous) => ({ ...previous, [targetId]: previous[draftKey] || text2 }));
      }
      await request("send", { id: targetId, text: text2 }, abort.current?.signal);
      if (mounted.current) setDrafts((previous) => ({ ...previous, [draftKey]: "", [targetId]: "" }));
    } catch (failure) {
      if (mounted.current && failure.name !== "AbortError") setError(failure.message);
    } finally {
      mutationInFlight.current = false;
      if (mounted.current) {
        setPending(false);
        await refresh();
      }
    }
  };
  const official = async () => {
    try {
      if (typeof ctx.sidebarRight?.openTab === "function") {
        await ctx.sidebarRight.openTab("browser", { params: { url: OFFICIAL_URL } });
        return;
      }
    } catch {
    }
    window.open(OFFICIAL_URL, "_blank", "noopener,noreferrer");
  };
  const agent = () => {
    try {
      ctx.layout.selectPanel(null);
    } catch {
      setError("\u5F53\u524D DSH \u7248\u672C\u65E0\u6CD5\u8FD4\u56DE Agent\u3002\u53EF\u70B9\u51FB DSH \u539F\u751F\u4F1A\u8BDD\u5217\u8868\u7EE7\u7EED\u3002");
    }
  };
  return /* @__PURE__ */ import_react.default.createElement("div", { className: "dcp-root", "data-dsh-chat-panel": true }, /* @__PURE__ */ import_react.default.createElement("aside", { className: `dcp-sidebar${mobileSidebar ? " is-open" : ""}`, "aria-label": "Chat \u5386\u53F2\u8BB0\u5F55" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dcp-sidebar-head" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dcp-brand" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "dcp-brand-mark" }, "D"), /* @__PURE__ */ import_react.default.createElement("span", null, "DeepSeek ", /* @__PURE__ */ import_react.default.createElement("b", null, "Chat"))), /* @__PURE__ */ import_react.default.createElement("button", { className: "dcp-icon dcp-mobile-close", onClick: () => setMobileSidebar(false), "aria-label": "\u6536\u8D77\u5386\u53F2\u8BB0\u5F55" }, /* @__PURE__ */ import_react.default.createElement(Icon, { kind: "close" }))), /* @__PURE__ */ import_react.default.createElement("button", { className: "dcp-new", onClick: newChat, disabled: busy }, /* @__PURE__ */ import_react.default.createElement(Icon, { kind: "plus" }), "\u65B0\u5EFA\u5BF9\u8BDD", /* @__PURE__ */ import_react.default.createElement("span", null, "\u2318 N")), /* @__PURE__ */ import_react.default.createElement("label", { className: "dcp-search" }, /* @__PURE__ */ import_react.default.createElement(Icon, { kind: "search", size: 15 }), /* @__PURE__ */ import_react.default.createElement("input", { value: query, onChange: (event) => setQuery(event.target.value), placeholder: "\u641C\u7D22\u5BF9\u8BDD", "aria-label": "\u641C\u7D22\u672C\u5730\u804A\u5929\u5386\u53F2" })), /* @__PURE__ */ import_react.default.createElement("div", { className: "dcp-history-heading" }, "\u672C\u5730\u5BF9\u8BDD", /* @__PURE__ */ import_react.default.createElement("span", null, state.chats.length)), /* @__PURE__ */ import_react.default.createElement("nav", { className: "dcp-history", "aria-label": "\u5386\u53F2\u5BF9\u8BDD" }, !loaded && /* @__PURE__ */ import_react.default.createElement("p", { className: "dcp-empty-history" }, "\u6B63\u5728\u8BFB\u53D6\u2026"), loaded && chatList.length === 0 && /* @__PURE__ */ import_react.default.createElement("p", { className: "dcp-empty-history" }, query ? "\u6CA1\u6709\u627E\u5230\u5BF9\u8BDD" : "\u4ECE\u65B0\u5EFA\u5BF9\u8BDD\u5F00\u59CB"), chatList.map((chat) => /* @__PURE__ */ import_react.default.createElement("div", { key: chat.id, className: `dcp-history-row${chat.id === state.activeId ? " is-active" : ""}` }, /* @__PURE__ */ import_react.default.createElement("button", { className: "dcp-history-select", disabled: busy, onClick: async () => {
    if (await mutate("select", { id: chat.id })) setMobileSidebar(false);
  }, title: chat.title || "\u65B0\u5BF9\u8BDD" }, /* @__PURE__ */ import_react.default.createElement("span", null, chat.title || "\u65B0\u5BF9\u8BDD"), /* @__PURE__ */ import_react.default.createElement("small", null, formatDate(chat.updatedAt))), /* @__PURE__ */ import_react.default.createElement("button", { className: "dcp-delete", disabled: busy, "aria-label": `\u5220\u9664\u672C\u5730\u5BF9\u8BDD\uFF1A${chat.title || "\u65B0\u5BF9\u8BDD"}`, title: "\u5220\u9664\u672C\u5730\u8BB0\u5F55", onClick: () => setDeleteId(chat.id) }, /* @__PURE__ */ import_react.default.createElement(Icon, { kind: "trash", size: 14 }))))), /* @__PURE__ */ import_react.default.createElement("div", { className: "dcp-sidebar-foot" }, /* @__PURE__ */ import_react.default.createElement("span", { className: `dcp-dot${state.browserOpen ? " is-online" : ""}` }), /* @__PURE__ */ import_react.default.createElement("span", null, state.browserOpen ? "\u5B98\u7F51\u6D4F\u89C8\u5668\u5DF2\u6253\u5F00" : "\u7B49\u5F85\u6253\u5F00\u5B98\u7F51\u6D4F\u89C8\u5668"), /* @__PURE__ */ import_react.default.createElement("button", { className: "dcp-icon", onClick: () => setShowSettings((value) => !value), "aria-label": "\u804A\u5929\u8BBE\u7F6E", title: "\u804A\u5929\u8BBE\u7F6E" }, /* @__PURE__ */ import_react.default.createElement(Icon, { kind: "settings", size: 17 })))), mobileSidebar && /* @__PURE__ */ import_react.default.createElement("button", { className: "dcp-sidebar-mask", "aria-label": "\u5173\u95ED\u5386\u53F2\u8BB0\u5F55", onClick: () => setMobileSidebar(false) }), /* @__PURE__ */ import_react.default.createElement("main", { className: "dcp-main" }, /* @__PURE__ */ import_react.default.createElement("header", { className: "dcp-topbar" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dcp-heading" }, /* @__PURE__ */ import_react.default.createElement("button", { className: "dcp-icon dcp-mobile-menu", "aria-label": "\u6253\u5F00\u5386\u53F2\u8BB0\u5F55", onClick: () => setMobileSidebar(true) }, /* @__PURE__ */ import_react.default.createElement(Icon, { kind: "menu" })), /* @__PURE__ */ import_react.default.createElement("span", null, "DeepSeek Chat"), /* @__PURE__ */ import_react.default.createElement("span", { className: "dcp-web-badge" }, "\u7F51\u9875")), /* @__PURE__ */ import_react.default.createElement("div", { className: "dcp-top-actions" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dcp-mode", "aria-label": "\u5DE5\u4F5C\u6A21\u5F0F" }, /* @__PURE__ */ import_react.default.createElement("button", { className: "is-active", "aria-pressed": "true" }, "Chat"), /* @__PURE__ */ import_react.default.createElement("button", { onClick: agent, "aria-label": "\u8FD4\u56DE DSH \u539F\u751F Agent" }, "Agent")), /* @__PURE__ */ import_react.default.createElement("button", { className: "dcp-icon", onClick: () => setShowSettings((value) => !value), "aria-label": "\u804A\u5929\u8BBE\u7F6E", title: "\u804A\u5929\u8BBE\u7F6E" }, /* @__PURE__ */ import_react.default.createElement(Icon, { kind: "settings" })))), /* @__PURE__ */ import_react.default.createElement("div", { className: "dcp-route-note" }, /* @__PURE__ */ import_react.default.createElement("span", { className: "dcp-route-dot" }), "\u5B98\u7F51\u7F51\u9875\u804A\u5929", /* @__PURE__ */ import_react.default.createElement("span", { className: "dcp-route-separator" }, "\xB7"), "Agent \u4F7F\u7528 DSH \u539F\u6709\u914D\u7F6E", /* @__PURE__ */ import_react.default.createElement("button", { onClick: official }, "\u6253\u5F00\u5B98\u7F51", /* @__PURE__ */ import_react.default.createElement(Icon, { kind: "external", size: 12 }))), error && /* @__PURE__ */ import_react.default.createElement("div", { className: "dcp-alert", role: "alert" }, /* @__PURE__ */ import_react.default.createElement("span", null, error), /* @__PURE__ */ import_react.default.createElement("button", { className: "dcp-icon", onClick: () => setError(""), "aria-label": "\u5173\u95ED\u9519\u8BEF\u63D0\u793A" }, /* @__PURE__ */ import_react.default.createElement(Icon, { kind: "close", size: 15 }))), active?.error && /* @__PURE__ */ import_react.default.createElement("div", { className: "dcp-alert", role: "status" }, active.error), showSettings && /* @__PURE__ */ import_react.default.createElement("section", { className: "dcp-settings", "aria-label": "\u804A\u5929\u8BBE\u7F6E" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("strong", null, "\u7F51\u9875\u8FDE\u63A5 \xB7 \u5B9E\u9A8C\u529F\u80FD"), /* @__PURE__ */ import_react.default.createElement("button", { className: "dcp-icon", onClick: () => setShowSettings(false), "aria-label": "\u5173\u95ED\u8BBE\u7F6E" }, /* @__PURE__ */ import_react.default.createElement(Icon, { kind: "close", size: 16 }))), /* @__PURE__ */ import_react.default.createElement("p", null, "\u901A\u8FC7\u53EF\u89C1 Chrome \u9875\u9762\u64CD\u4F5C\u5B98\u7F51\u3002\u4F60\u5728\u5B98\u7F51\u81EA\u884C\u767B\u5F55\uFF0C\u63D2\u4EF6\u4E0D\u8BFB\u53D6\u6216\u4FDD\u5B58\u8D26\u53F7\u5BC6\u7801\u3002\u7F51\u9875\u53D8\u5316\u3001\u9A8C\u8BC1\u7801\u6216\u9650\u6D41\u4F1A\u4F7F\u804A\u5929\u6682\u505C\u3002\u6BCF\u6B21 DSH \u91CD\u542F\u540E\u9700\u91CD\u65B0\u542F\u7528\u3002"), /* @__PURE__ */ import_react.default.createElement("label", { className: "dcp-enable" }, /* @__PURE__ */ import_react.default.createElement("input", { type: "checkbox", checked: state.enabled, disabled: busy, onChange: (event) => void mutate("enable", { enabled: event.target.checked }) }), /* @__PURE__ */ import_react.default.createElement("span", null, "\u542F\u7528\u5B9E\u9A8C\u6027\u7F51\u9875\u804A\u5929\u8FDE\u63A5")), /* @__PURE__ */ import_react.default.createElement("div", { className: "dcp-settings-actions" }, /* @__PURE__ */ import_react.default.createElement("button", { className: "dcp-secondary", onClick: () => void mutate("open"), disabled: pending || !state.enabled }, "\u6253\u5F00 Chrome \u767B\u5F55\u7A97\u53E3"), /* @__PURE__ */ import_react.default.createElement("button", { className: "dcp-text-button", onClick: official }, "\u76F4\u63A5\u4F7F\u7528\u5B98\u7F51", /* @__PURE__ */ import_react.default.createElement(Icon, { kind: "external", size: 13 }))), /* @__PURE__ */ import_react.default.createElement("small", null, "\u672C\u5730\u5220\u9664\u53EA\u6E05\u9664\u63D2\u4EF6\u8BB0\u5F55\uFF1B\u5B98\u7F51\u5386\u53F2\u548C Chrome \u767B\u5F55\u72B6\u6001\u7531\u5BF9\u5E94\u5E94\u7528\u7BA1\u7406\u3002\u4E0D\u4F1A\u81EA\u52A8\u5207\u6362\u5230\u4ED8\u8D39 API\u3002")), /* @__PURE__ */ import_react.default.createElement("div", { ref: list, className: "dcp-messages", onScroll: (event) => {
    const element = event.currentTarget;
    setAtBottom(element.scrollHeight - element.scrollTop - element.clientHeight < 90);
  } }, !active?.messages?.length ? /* @__PURE__ */ import_react.default.createElement("div", { className: "dcp-welcome" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dcp-welcome-mark" }, "D", /* @__PURE__ */ import_react.default.createElement("span", null, "\u2726")), /* @__PURE__ */ import_react.default.createElement("h1", null, "\u6709\u4EC0\u4E48\u60F3\u4E00\u8D77\u804A\u804A\u7684\uFF1F"), /* @__PURE__ */ import_react.default.createElement("p", null, "\u5728\u8FD9\u91CC\u8BA8\u8BBA\u60F3\u6CD5\uFF0C\u968F\u65F6\u56DE\u5230 Agent \u6267\u884C\u4EFB\u52A1\u3002"), !state.enabled ? /* @__PURE__ */ import_react.default.createElement("div", { className: "dcp-start-card" }, /* @__PURE__ */ import_react.default.createElement("strong", null, "\u5148\u9009\u62E9\u804A\u5929\u65B9\u5F0F"), /* @__PURE__ */ import_react.default.createElement("p", null, "\u76F4\u63A5\u5728\u5B98\u7F51\u4F7F\u7528\u5DF2\u6709\u8D26\u53F7\uFF0C\u6216\u5728\u8BBE\u7F6E\u4E2D\u542F\u7528\u5B9E\u9A8C\u6027\u8FDE\u63A5\uFF0C\u5728\u8FD9\u4E2A\u9762\u677F\u804A\u5929\u3002"), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("button", { className: "dcp-primary", onClick: official }, "\u6253\u5F00 DeepSeek \u5B98\u7F51", /* @__PURE__ */ import_react.default.createElement(Icon, { kind: "external", size: 14 })), /* @__PURE__ */ import_react.default.createElement("button", { className: "dcp-secondary", onClick: () => setShowSettings(true) }, "\u8FDE\u63A5\u8BBE\u7F6E")), /* @__PURE__ */ import_react.default.createElement("small", null, "\u5B98\u7F51\u8FDE\u63A5\u672A\u542F\u7528\u3002\u4E0B\u9762\u7684\u8F93\u5165\u6846\u6682\u4E0D\u53EF\u53D1\u9001\u3002")) : /* @__PURE__ */ import_react.default.createElement("div", { className: "dcp-start-card" }, /* @__PURE__ */ import_react.default.createElement("strong", null, "\u5148\u5728\u5B98\u7F51\u5B8C\u6210\u767B\u5F55"), /* @__PURE__ */ import_react.default.createElement("p", null, "\u4FDD\u6301\u6D4F\u89C8\u5668\u7A97\u53E3\u53EF\u89C1\u3002\u9047\u5230\u9A8C\u8BC1\u7801\u6216\u5B89\u5168\u6821\u9A8C\uFF0C\u8BF7\u5728\u5B98\u7F51\u624B\u52A8\u5904\u7406\uFF0C\u5E76\u5148\u6838\u5BF9\u6D88\u606F\u662F\u5426\u5DF2\u7ECF\u53D1\u51FA\u3002"), /* @__PURE__ */ import_react.default.createElement("button", { className: "dcp-secondary", onClick: () => void mutate("open"), disabled: pending }, "\u6253\u5F00 Chrome \u767B\u5F55\u7A97\u53E3", /* @__PURE__ */ import_react.default.createElement(Icon, { kind: "external", size: 14 }))), /* @__PURE__ */ import_react.default.createElement("div", { className: "dcp-suggestions" }, ["\u5E2E\u6211\u68B3\u7406\u4E00\u4E2A\u60F3\u6CD5", "\u89E3\u91CA\u4E00\u6BB5\u4EE3\u7801", "\u4E00\u8D77\u5236\u5B9A\u5B66\u4E60\u8BA1\u5212"].map((text2) => /* @__PURE__ */ import_react.default.createElement("button", { key: text2, disabled: !state.enabled || busy || lockedChat, onClick: () => {
    setDrafts((previous) => ({ ...previous, [draftKey]: text2 }));
    input.current?.focus();
  } }, text2, /* @__PURE__ */ import_react.default.createElement("span", null, "\u2197"))))) : /* @__PURE__ */ import_react.default.createElement("div", { className: "dcp-message-list" }, active.messages.map((message, index) => /* @__PURE__ */ import_react.default.createElement("article", { key: message.id || `${index}-${message.role}`, className: `dcp-message dcp-message-${message.role}`, "aria-label": message.role === "user" ? "\u4F60\u7684\u6D88\u606F" : "DeepSeek \u56DE\u590D" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "dcp-message-label" }, message.role === "user" ? "\u4F60" : /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("span", { className: "dcp-mini-mark" }, "D"), "DeepSeek")), /* @__PURE__ */ import_react.default.createElement("div", { className: "dcp-message-content" }, message.role === "user" ? /* @__PURE__ */ import_react.default.createElement("div", { className: "dcp-user-text" }, message.content) : /* @__PURE__ */ import_react.default.createElement(Markdown, { content: message.content }), message.role === "assistant" && /* @__PURE__ */ import_react.default.createElement(CopyButton, { text: message.content || "" })))), state.busy && /* @__PURE__ */ import_react.default.createElement("div", { className: "dcp-stream-state", role: "status" }, /* @__PURE__ */ import_react.default.createElement("span", null), /* @__PURE__ */ import_react.default.createElement("span", null), /* @__PURE__ */ import_react.default.createElement("span", null), "\u6B63\u5728\u8BFB\u53D6\u5B98\u7F51\u56DE\u590D"), active.status === "partial" && /* @__PURE__ */ import_react.default.createElement("p", { className: "dcp-partial-note" }, "\u56DE\u590D\u5C1A\u672A\u786E\u8BA4\u5B8C\u6210\uFF0C\u5DF2\u4FDD\u7559\u5F53\u524D\u5185\u5BB9\u3002\u8BF7\u5230\u5B98\u7F51\u67E5\u770B\u3002"), active.status === "blocked" && /* @__PURE__ */ import_react.default.createElement("p", { className: "dcp-partial-note" }, "\u7F51\u9875\u8FDE\u63A5\u5DF2\u6682\u505C\u3002\u8BF7\u5230\u5B98\u7F51\u6838\u5BF9\u8FD9\u6761\u6D88\u606F\u7684\u53D1\u9001\u60C5\u51B5\u3002"), lockedChat && /* @__PURE__ */ import_react.default.createElement("div", { className: "dcp-recovery" }, /* @__PURE__ */ import_react.default.createElement("p", null, "\u4E3A\u907F\u514D\u91CD\u590D\u53D1\u9001\uFF0C\u6B64\u5BF9\u8BDD\u6682\u4E0D\u53EF\u7EE7\u7EED\u3002\u8BF7\u5148\u6838\u5BF9\u5B98\u7F51\uFF0C\u518D\u65B0\u5EFA\u5BF9\u8BDD\u3002"), /* @__PURE__ */ import_react.default.createElement("button", { className: "dcp-secondary", onClick: official }, "\u67E5\u770B\u5B98\u7F51", /* @__PURE__ */ import_react.default.createElement(Icon, { kind: "external", size: 13 })), /* @__PURE__ */ import_react.default.createElement("button", { className: "dcp-secondary", disabled: busy, onClick: newChat }, "\u65B0\u5EFA\u5BF9\u8BDD")))), !atBottom && /* @__PURE__ */ import_react.default.createElement("button", { className: "dcp-scroll-bottom", onClick: () => {
    setAtBottom(true);
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, "aria-label": "\u6EDA\u52A8\u5230\u6700\u65B0\u6D88\u606F" }, "\u2193"), /* @__PURE__ */ import_react.default.createElement("footer", { className: "dcp-composer-wrap" }, /* @__PURE__ */ import_react.default.createElement("form", { className: `dcp-composer${!state.enabled ? " is-disabled" : ""}`, onSubmit: (event) => {
    event.preventDefault();
    void send();
  } }, /* @__PURE__ */ import_react.default.createElement("textarea", { ref: input, value: draft, disabled: !state.enabled || lockedChat, placeholder: lockedChat ? "\u6B64\u5BF9\u8BDD\u53D1\u9001\u72B6\u6001\u672A\u786E\u8BA4\uFF0C\u8BF7\u5148\u6838\u5BF9\u5B98\u7F51" : state.enabled ? "\u7ED9 DeepSeek \u53D1\u9001\u6D88\u606F\u2026" : "\u5728\u8FDE\u63A5\u8BBE\u7F6E\u4E2D\u542F\u7528\u7F51\u9875\u804A\u5929", "aria-label": "\u804A\u5929\u6D88\u606F", rows: 1, maxLength: 16e3, onChange: (event) => setDrafts((previous) => ({ ...previous, [draftKey]: event.target.value })), onCompositionStart: () => {
    composing.current = true;
  }, onCompositionEnd: () => {
    composing.current = false;
  }, onKeyDown: (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing && !composing.current && event.keyCode !== 229) {
      event.preventDefault();
      void send();
    }
  } }), /* @__PURE__ */ import_react.default.createElement("div", { className: "dcp-composer-bottom" }, /* @__PURE__ */ import_react.default.createElement("button", { className: "dcp-composer-source", type: "button", onClick: () => setShowSettings(true) }, /* @__PURE__ */ import_react.default.createElement("span", { className: `dcp-dot${state.enabled ? " is-online" : ""}` }), state.enabled ? "\u5B98\u7F51\u8FDE\u63A5 \xB7 \u5B9E\u9A8C\u6027" : "\u5C1A\u672A\u8FDE\u63A5"), state.busy ? /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "dcp-send is-stop", title: "\u505C\u6B62\u5B98\u7F51\u56DE\u590D", "aria-label": "\u505C\u6B62\u56DE\u590D", disabled: pending, onClick: () => void mutate("stop") }, /* @__PURE__ */ import_react.default.createElement(Icon, { kind: "stop", size: 17 })) : /* @__PURE__ */ import_react.default.createElement("button", { type: "submit", className: "dcp-send", "aria-label": "\u53D1\u9001\u6D88\u606F", title: "\u53D1\u9001\u6D88\u606F", disabled: !state.enabled || busy || lockedChat || !draft.trim() }, /* @__PURE__ */ import_react.default.createElement(Icon, { kind: "arrow", size: 20 })))), /* @__PURE__ */ import_react.default.createElement("div", { className: "dcp-composer-caption" }, state.enabled ? "Enter \u53D1\u9001 \xB7 Shift + Enter \u6362\u884C \xB7 \u7F51\u9875\u64CD\u4F5C\u53D7\u5B98\u7F51\u9650\u5236" : "Chat \u4E0D\u8C03\u7528 DSH \u6A21\u578B API \xB7 Agent \u4FDD\u7559\u539F\u6709\u529F\u80FD", /* @__PURE__ */ import_react.default.createElement("button", { onClick: agent }, "\u8FD4\u56DE Agent \u2197")))), deleteId && /* @__PURE__ */ import_react.default.createElement("div", { className: "dcp-dialog-mask", role: "presentation", onMouseDown: (event) => {
    if (event.currentTarget === event.target) setDeleteId(null);
  } }, /* @__PURE__ */ import_react.default.createElement("section", { className: "dcp-dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": "dcp-delete-title" }, /* @__PURE__ */ import_react.default.createElement("h2", { id: "dcp-delete-title" }, "\u5220\u9664\u8FD9\u6761\u672C\u5730\u8BB0\u5F55\uFF1F"), /* @__PURE__ */ import_react.default.createElement("p", null, "\u8FD9\u53EA\u4F1A\u6E05\u9664\u63D2\u4EF6\u4E2D\u7684\u804A\u5929\u8BB0\u5F55\uFF0C\u4E0D\u4F1A\u5220\u9664 DeepSeek \u5B98\u7F51\u7684\u5BF9\u8BDD\u3002"), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("button", { className: "dcp-secondary", autoFocus: true, onClick: () => setDeleteId(null) }, "\u53D6\u6D88"), /* @__PURE__ */ import_react.default.createElement("button", { className: "dcp-danger", disabled: busy, onClick: async () => {
    if (await mutate("delete", { id: deleteId })) setDeleteId(null);
  } }, "\u5220\u9664\u672C\u5730\u8BB0\u5F55")))));
}
function apply2(ctx) {
  if (typeof ctx.slots?.inject !== "function" || typeof ctx.slots?.register !== "function" || typeof ctx.layout?.selectPanel !== "function") {
    console.warn("[dsh-chatgpt-panel] This DSH version does not expose the required main/sidebar panel API.");
    return;
  }
  const Panel = () => /* @__PURE__ */ import_react.default.createElement(ChatPanel, { ctx });
  const PanelIcon = () => /* @__PURE__ */ import_react.default.createElement(Icon, { kind: "chat", size: 18 });
  try {
    ctx.effect(() => {
      const style = document.createElement("style");
      style.dataset.dshChatPanelStyle = "";
      style.textContent = panel_default;
      document.head.appendChild(style);
      return () => style.remove();
    }, "dsh-chatgpt-panel: styles");
    ctx.slots.inject("main", () => ctx.slots.register({ name: "main", key: PANEL_ID }, Panel));
    ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({ name: "sidebar.panellist", id: PANEL_ID, order: 0, label: () => "DeepSeek Chat" }, PanelIcon));
    ctx.effect(() => () => {
      try {
        if (ctx.layout.panelInfo?.getSnapshot?.()?.activePanelId === PANEL_ID) ctx.layout.selectPanel(null);
      } catch {
      }
    }, "dsh-chatgpt-panel: restore Agent on disposal");
  } catch (error) {
    console.warn("[dsh-chatgpt-panel] Panel registration failed; use the original DSH conversation.", error);
  }
}
/*! Bundled license information:

dompurify/dist/purify.es.mjs:
  (*! @license DOMPurify 3.3.0 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.3.0/LICENSE *)
*/

return module.exports;}});
