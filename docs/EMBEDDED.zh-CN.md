# 内嵌官网与项目交接

版本 0.1.0-preview.7；2026-11-02。

## 容器

沿用官方 Sidebar Browser 的 main-approved lease / partition / about:blank bootstrap。保留 sandbox、contextIsolation、webSecurity、无 guest preload 与无 Node 集成，不修改 App 包、安全策略或 User-Agent。只使用 `window.dshDesktop.browser.acquire/release/onOpenRequested` 创建和回收容器。

同一次主进程运行中，各项目使用相同获批浏览器分区以沿用官网登录；项目分别记住自己的官网对话路径。官方 0.2.1-rc.5 使用内存分区，完全退出后登录失效，插件没有持久化开关。

## 显式网页读取

preview.7 新增用户主动点击后的只读 `webview.executeJavaScript` 快照。与旧版 Chrome 桥接不同，它不发消息、不控制表单、不监听聊天流，不在后台轮询；本机没有独立插件浏览器进程。

读取函数仅访问识别到的已渲染消息容器及其中选中的文字，不访问 Cookie、存储、网络、输入框值或应用内部状态。消息源码中的验证控件和生成状态用于阻止读取，不会操作或绕过它们。仅允许 HTTPS 的 chat.deepseek.com；来源 URL 去掉查询参数和片段。

未知布局、无消息、验证/限流、过长、超时和导航变化保留原项目内容，显示手动粘贴入口。页面是动态网站，不保证捕获未加载历史、附件或完整 Markdown；必须在资料区检查。

## 原生 Work

客户端注入官方 sessions/workspaces/uiWorkspace/conversation 服务。`sessions.create({workspaceId})` 创建原生项目会话，短期 retain 后经 `conversation.input.for(binding.ctx).requestDraftInitialization({prompt,whenDraftExists:'keep'})` 填入草稿，再 `uiWorkspace.openSession` 导航。已有草稿不覆盖，异步离开后不劫持导航，失败可复用已创建的准备会话。

交接不调用 prompt/send，不写 DSH 持久化文件，不选择模型、不切换权限；发送和后续任务由原生 DSH 管理。Work 最新回复从官方已加载事件窗口读取公开 text 块，不读取工具参数或 reasoning 块；它是显式导入，不是持续同步。

## 本地资料

`dsh-chatgpt-panel.projects.v1` 页面存储按 workspaceId 分隔资料、聊天快照、任务、导入回复与已准备会话 ID。不是官网记忆服务，也不自动注入所有 DSH 请求。存储失败有可见提示。官网登录不在这个存储中。
