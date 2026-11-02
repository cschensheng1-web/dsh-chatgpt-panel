# 兼容性

preview.7 的目标：官方 DSH Desktop 0.2.1-rc.5 / macOS arm64。

- Desktop 浏览器：acquire/release/onOpenRequested 与获批 webview bootstrap。
- 界面：main/sidebar.panellist、原生会话 header actions / hero options、layout.selectPanel。
- 项目交接：sessions.create/retain/list、workspaces.list、uiWorkspace.openSession、conversation.input.for 和 requestDraftInitialization。
- Work 回复：Session eventSource 的已加载窗口，仅 public assistant text。
- 官网读取：Electron 标准 executeJavaScript，一次性只读；网站消息 DOM 可能变化，失败需手动导入。

这些接口尚处 DSH 预览版阶段。DSH 升级、社区桌面包装或网页改版可能要求插件适配。普通 Web 无内嵌浏览器；缺少 Work 接口时不能自动交接。不修改 App 安装包以补齐功能。

原生官网登录、验证码、真实流式回答、完整聊天快照、Intel Mac 与其他 DSH 版本的验证范围见 TESTING.zh-CN.md。官网账号记忆不会因为模型或账号相同而自动进入 DSH。
