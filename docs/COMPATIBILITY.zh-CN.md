# DSH Mac 兼容性

核实日期：2026-11-02；当前插件版本 0.1.0-preview.6。

本机官方 Desktop / runtime 为 `0.2.1-rc.5`，平台为 `darwin arm64`。主面板使用 `ctx.slots` 的 `main` 键与 `sidebar.panellist` 入口，返回原会话调用 `ctx.layout.selectPanel(null)`；不改动模型、工具或用户设置。

内嵌容器使用 Desktop 预加载层提供的 `browser.acquire/release/onOpenRequested`。应用主进程审批 webview lease，强制访客隔离和安全属性。没有该桥接的环境显示不支持，不转向外部浏览器。

当前宿主只提供内存 partition，同次运行可沿用登录，完全退出后不能保留。详细依据及测试边界见 [内嵌说明](EMBEDDED.zh-CN.md) 与 [测试记录](TESTING.zh-CN.md)。

官方资料：[Desktop](https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/desktop/README.md)、[UI Layout](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/client/ui-layout/README.md)、[Sidebar Browser](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/client/ui-sidebar-browser/README.md)。

升级 DSH 后应重新检查租约创建、官网加载和返回原会话。插件不能保证未来版本兼容；失效时可在插件管理中禁用或移除，不需要删除 DSH home。GitHub 下载和网站登录的失败应按实际错误处理，不能通过降低安全策略恢复。
