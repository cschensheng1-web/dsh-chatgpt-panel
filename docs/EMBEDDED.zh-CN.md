# 官网内嵌模式

当前版本 0.1.0-preview.6；核实日期 2026-11-02。仅提供官网内嵌，旧版 Chrome 面板与相关代码已经移除。

## 实现

主面板使用本机 `window.dshDesktop.browser.acquire/release/onOpenRequested`，遵循内置 Sidebar Browser 的获批租约流程：配置主进程发放的 partition 与 `about:blank#<lease>`，待宿主批准后导航 `https://chat.deepseek.com/`。

主进程强制关闭 Node，开启上下文隔离、sandbox 与 webSecurity。插件不添加 guest preload、脚本注入、自定义 User-Agent 或 disablewebsecurity。HTTPS 弹出页面由宿主审核后在同一个内嵌容器中导航，不自动打开独立浏览器。

官网负责消息、历史、输入和回复，本插件没有消息读取接口、模型适配器或付费模型回退。顶栏只保留实际刷新页面和返回原 DSH 会话两个操作。

## 登录

当前 Desktop 的 `DesktopBrowserGuests.acquire` 为同一个存储分组分配进程内 `dsh-sidebar-browser-<随机ID>` partition，没有 `persist:` 前缀。租约释放不会立刻清空分组，完全退出应用则丢失内存会话。插件不能自行开启持久化，不提取登录 Cookie，也不复制其他浏览器的登录数据。

因此同次运行可以沿用登录，跨重启不能记住。切换或刷新前需保存未发送草稿。用户登录、验证码和页面限制均在官网中自行处理。

## 依据和实测边界

参考：[官方 Sidebar Browser](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/client/ui-sidebar-browser/README.md)、[Electron webview 文档](https://www.electronjs.org/docs/latest/api/webview-tag)。Desktop bridge 的其他版本或社区包装兼容性未保证。

在本机官方 Desktop 0.2.1-rc.5 / macOS arm64 中，主面板显示了官网首页、DeepThink/Search 和输入框；顶栏返回原会话、再进入 Chat 已验证；检查时独立插件 Chrome 进程为 0。

用户在内嵌网页中的实际登录、验证码、真实聊天与更多操作系统仍未记为验证通过。网页拒绝内嵌时只显示失败提示，不更改安全策略或伪装客户端。
