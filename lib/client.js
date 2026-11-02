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
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_exports);
var import_react2 = __toESM(require("react"), 1);

// src/panel.css
var panel_default = '.dcp-embedded{display:flex;flex-direction:column;flex:1;min-height:0;height:100%;width:100%;background:var(--dsw-alias-bg-base,#fff);color:var(--dsw-alias-label-primary,#202124);font:14px -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif;overflow:hidden}.dcp-embedded-top{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:68px;padding:0 20px 0 max(20px,var(--dsh-frame-leading-clearance,0px));border-bottom:1px solid #ddd8;flex-shrink:0}.dcp-embedded-top strong{font-size:16px;font-weight:600}.dcp-embedded-top strong span{font-size:11px;font-weight:400;margin-left:8px;opacity:.65}.dcp-embedded-top>div{display:flex;gap:7px}.dcp-embedded button{font:inherit;font-size:12px;padding:7px 10px;border:1px solid #b8becb70;border-radius:7px;background:transparent;color:inherit;cursor:pointer;-webkit-app-region:no-drag}.dcp-embedded button:hover{background:#9baad51c}.dcp-embedded-note{font-size:11px;line-height:1.6;padding:7px 16px;background:#7b91db12;opacity:.8;flex-shrink:0}.dcp-embedded-host{flex:1;min-height:0;min-width:0;display:flex;position:relative}.dcp-embedded-webview{display:flex;flex:1;width:100%;height:100%;min-height:0;border:0;-webkit-app-region:no-drag}.dcp-embedded-status,.dcp-embedded-error{padding:8px 16px;font-size:12px;flex-shrink:0}.dcp-embedded-error{background:#fff2df;color:#856227}\n@media(max-width:720px){.dcp-embedded-top{align-items:flex-start;flex-direction:column;padding:12px;gap:8px}.dcp-embedded-top>div{flex-wrap:wrap}.dcp-embedded-note{font-size:10px}}\n\n.dcp-embedded button:disabled{opacity:.4;cursor:default}\n.dcp-unsupported{padding:48px 24px;font:14px system-ui;color:var(--dsw-alias-label-primary,#222)}.dcp-unsupported h1{font-size:20px}.dcp-unsupported button{padding:8px 14px;border:1px solid #aab3c4;border-radius:8px;background:transparent;color:inherit;cursor:pointer}\n';

// src/EmbeddedChat.jsx
var import_react = __toESM(require("react"), 1);

// src/embedded-browser.mjs
var OFFICIAL = "https://chat.deepseek.com/";
function hasEmbeddedBrowser(bridge) {
  return typeof bridge?.acquire === "function" && typeof bridge?.release === "function" && typeof bridge?.onOpenRequested === "function";
}
function safePopup(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}
var EmbeddedBrowser = class {
  constructor({ bridge, document: document2, onState = () => {
  } }) {
    this.bridge = bridge;
    this.document = document2;
    this.onState = onState;
    this.view = null;
    this.lease = null;
    this.disposed = false;
    this.disposal = null;
    this.pending = null;
    this.unsubscribe = null;
    this.listeners = [];
    this.ready = false;
  }
  emit(value) {
    if (!this.disposed) this.onState(value);
  }
  async mount(host) {
    if (!hasEmbeddedBrowser(this.bridge)) throw Error("\u5F53\u524D DSH \u6CA1\u6709\u63D0\u4F9B\u5185\u5D4C\u5B98\u7F51\u80FD\u529B\uFF0C\u8BF7\u4F7F\u7528 Mac \u684C\u9762\u7248\u3002");
    if (this.pending || this.view || this.disposed) return this.pending;
    this.pending = this.create(host).catch(async (error) => {
      this.pending = null;
      await this.dispose();
      throw error;
    });
    return this.pending;
  }
  async create(host) {
    const reservation = await this.bridge.acquire("plugin:dsh-chatgpt-panel:official");
    if (this.disposed) {
      await this.bridge.release(reservation.lease);
      return;
    }
    this.lease = reservation.lease;
    const view = this.document.createElement("webview");
    this.view = view;
    view.className = "dcp-embedded-webview";
    view.setAttribute("aria-label", "DeepSeek \u5B98\u7F51\u5185\u5D4C\u804A\u5929");
    view.setAttribute("name", reservation.lease);
    view.setAttribute("partition", reservation.partition);
    view.setAttribute("allowpopups", "");
    view.setAttribute("src", "about:blank#" + reservation.lease);
    const listen = (name, fn) => {
      view.addEventListener(name, fn);
      this.listeners.push(() => view.removeEventListener(name, fn));
    };
    listen("dom-ready", () => {
      if (!this.ready) {
        this.ready = true;
        void this.load(OFFICIAL);
      }
    });
    listen("did-start-loading", () => this.emit({ loading: true }));
    listen("did-stop-loading", () => this.emit({ loading: false }));
    listen("did-navigate", () => this.emit({ loading: false, error: "" }));
    listen("did-fail-load", (event) => {
      if (event.isMainFrame && event.errorCode !== -3) this.emit({ loading: false, error: "\u5B98\u7F51\u6682\u65F6\u672A\u80FD\u52A0\u8F7D\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u540E\u70B9\u201C\u91CD\u65B0\u52A0\u8F7D\u201D\u3002" });
    });
    listen("render-process-gone", () => this.emit({ loading: false, error: "\u5185\u5D4C\u7F51\u9875\u5DF2\u9000\u51FA\uFF0C\u8BF7\u8FD4\u56DE\u804A\u5929\u5165\u53E3\u540E\u91CD\u65B0\u6253\u5F00\u3002" }));
    this.unsubscribe = this.bridge.onOpenRequested(reservation.lease, (url) => {
      const target = safePopup(url);
      if (target) void this.load(target);
    });
    host.appendChild(view);
    this.emit({ loading: true, error: "" });
  }
  async load(url) {
    if (!this.view || this.disposed) return;
    this.emit({ loading: true, error: "" });
    try {
      await this.view.loadURL(url);
    } catch {
      this.emit({ loading: false, error: "\u5B98\u7F51\u6682\u65F6\u672A\u80FD\u52A0\u8F7D\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u540E\u70B9\u201C\u91CD\u65B0\u52A0\u8F7D\u201D\u3002" });
    }
  }
  reload() {
    if (!this.ready || !this.view || this.disposed) return false;
    this.emit({ loading: true, error: "" });
    try {
      this.view.reload();
    } catch {
      void this.load(OFFICIAL);
    }
    return true;
  }
  dispose() {
    if (this.disposal) return this.disposal;
    this.disposed = true;
    this.disposal = (async () => {
      await this.pending?.catch(() => {
      });
      this.unsubscribe?.();
      this.unsubscribe = null;
      for (const remove of this.listeners.splice(0)) remove();
      this.view?.remove();
      this.view = null;
      if (this.lease) {
        const lease = this.lease;
        this.lease = null;
        await this.bridge.release(lease);
      }
    })();
    return this.disposal;
  }
};

// src/EmbeddedChat.jsx
function embeddedAvailable() {
  return hasEmbeddedBrowser(window.dshDesktop?.browser);
}
function EmbeddedChat({ ctx }) {
  const host = (0, import_react.useRef)(null);
  const browser = (0, import_react.useRef)(null);
  const [status, setStatus] = (0, import_react.useState)({ loading: true, error: "" });
  const [generation, setGeneration] = (0, import_react.useState)(0);
  (0, import_react.useEffect)(() => {
    let active = true;
    setStatus({ loading: true, error: "" });
    const controller = new EmbeddedBrowser({
      bridge: window.dshDesktop?.browser,
      document,
      onState: (next) => {
        if (active) setStatus((previous) => ({ ...previous, ...next }));
      }
    });
    browser.current = controller;
    void controller.mount(host.current).catch(() => {
      if (active) setStatus({ loading: false, error: "\u5F53\u524D DSH \u65E0\u6CD5\u521B\u5EFA\u5185\u5D4C\u7F51\u9875\uFF0C\u8BF7\u8FD4\u56DE\u9762\u677F\u6216\u66F4\u65B0\u684C\u9762\u7248\u3002" });
    });
    return () => {
      active = false;
      browser.current = null;
      void controller.dispose().catch(() => {
      });
    };
  }, [generation]);
  const reload = () => {
    if (!browser.current?.reload()) setGeneration((value) => value + 1);
  };
  const returnToDSH = () => {
    try {
      ctx.layout.selectPanel(null);
    } catch {
      setStatus({ loading: false, error: "\u5F53\u524D DSH \u65E0\u6CD5\u5207\u56DE\u539F\u4F1A\u8BDD\uFF0C\u8BF7\u70B9\u51FB\u5DE6\u4FA7\u4F1A\u8BDD\u5217\u8868\u3002" });
    }
  };
  return /* @__PURE__ */ import_react.default.createElement("section", { className: "dcp-embedded", "aria-label": "DSH \u5185\u5D4C\u5B98\u7F51\u804A\u5929" }, /* @__PURE__ */ import_react.default.createElement("header", { className: "dcp-embedded-top", "data-window-drag": true }, /* @__PURE__ */ import_react.default.createElement("strong", null, "DeepSeek Chat ", /* @__PURE__ */ import_react.default.createElement("span", null, "\u5B98\u7F51\u5185\u5D4C")), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("button", { disabled: status.loading, onClick: reload }, "\u91CD\u65B0\u52A0\u8F7D"), /* @__PURE__ */ import_react.default.createElement("button", { onClick: returnToDSH }, "\u8FD4\u56DE DSH \u5BF9\u8BDD"))), /* @__PURE__ */ import_react.default.createElement("div", { className: "dcp-embedded-note" }, "\u76F4\u63A5\u5728\u4E0B\u65B9\u5B98\u7F51\u9875\u9762\u767B\u5F55\u548C\u804A\u5929\uFF0C\u65E0\u9700\u72EC\u7ACB Chrome\u3002\u5B8C\u5168\u9000\u51FA DSH \u540E\u9700\u91CD\u65B0\u767B\u5F55\uFF1B\u79BB\u5F00\u6216\u5237\u65B0\u524D\u8BF7\u5148\u4FDD\u5B58\u672A\u53D1\u9001\u7684\u8349\u7A3F\u3002"), status.loading && /* @__PURE__ */ import_react.default.createElement("div", { className: "dcp-embedded-status", role: "status" }, "\u6B63\u5728\u6253\u5F00\u5B98\u7F51\u2026"), status.error && /* @__PURE__ */ import_react.default.createElement("div", { className: "dcp-embedded-error", role: "alert" }, status.error), /* @__PURE__ */ import_react.default.createElement("div", { ref: host, className: "dcp-embedded-host" }));
}

// src/client.jsx
var PANEL_ID = "dsh-chatgpt-panel";
var inject = ["slots", "layout"];
function ChatIcon() {
  return /* @__PURE__ */ import_react2.default.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.7", "aria-hidden": "true" }, /* @__PURE__ */ import_react2.default.createElement("path", { d: "M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z" }));
}
function apply(ctx) {
  if (typeof ctx.slots?.inject !== "function" || typeof ctx.slots?.register !== "function" || typeof ctx.layout?.selectPanel !== "function") {
    console.warn("[dsh-chatgpt-panel] Required main/sidebar panel API is unavailable.");
    return;
  }
  const Panel = () => embeddedAvailable() ? /* @__PURE__ */ import_react2.default.createElement(EmbeddedChat, { ctx }) : /* @__PURE__ */ import_react2.default.createElement("section", { className: "dcp-unsupported", role: "status" }, /* @__PURE__ */ import_react2.default.createElement("h1", null, "\u5F53\u524D\u73AF\u5883\u4E0D\u652F\u6301\u5B98\u7F51\u5185\u5D4C"), /* @__PURE__ */ import_react2.default.createElement("p", null, "\u8BF7\u5728\u9002\u914D\u7684 DSH Mac \u684C\u9762\u7248\u4E2D\u6253\u5F00\u6B64\u63D2\u4EF6\u3002\u666E\u901A Web \u5BBF\u4E3B\u4E0D\u63D0\u4F9B\u8BE5\u80FD\u529B\u3002"), /* @__PURE__ */ import_react2.default.createElement("button", { onClick: () => ctx.layout.selectPanel(null) }, "\u8FD4\u56DE DSH \u5BF9\u8BDD"));
  ctx.effect(() => {
    const style = document.createElement("style");
    style.dataset.dshChatPanelStyle = "";
    style.textContent = panel_default;
    document.head.appendChild(style);
    return () => style.remove();
  }, "dsh-chatgpt-panel: styles");
  ctx.slots.inject("main", () => ctx.slots.register({ name: "main", key: PANEL_ID }, Panel));
  ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({ name: "sidebar.panellist", id: PANEL_ID, order: 0, label: () => "DeepSeek Chat" }, ChatIcon));
  ctx.effect(() => () => {
    try {
      if (ctx.layout.panelInfo?.getSnapshot?.()?.activePanelId === PANEL_ID) ctx.layout.selectPanel(null);
    } catch {
    }
  }, "dsh-chatgpt-panel: return on unload");
}

return module.exports;}});
