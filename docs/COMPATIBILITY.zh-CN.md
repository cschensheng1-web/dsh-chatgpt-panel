# DSH Mac 兼容性与核实依据

核实日期：2026-11-02。preview.5 默认提供官网内嵌页面；详细实现、临时登录会话限制和实测范围见 [内嵌说明](EMBEDDED.zh-CN.md)。本交付为实验预览，目标是官方 DeepSeek Harness Desktop；社区同名 Mac 包装不自动兼容。

## 已核实的环境与接口

本机安装包 `/Applications/DeepSeek Harness.app` 中的只读资源声明：

| 项目 | 结果 |
| --- | --- |
| 官方 Desktop / DSH runtime | `0.2.1-rc.5` |
| 平台 | `darwin arm64` |
| Host protocol | `4` |
| 内置 Node / pnpm | `24.21.0` / `11.28.5` |

以上来自 App 包内 `package.json` 与 `dsh/desktop-runtime.json`，不是用户设置。研究过程没有修改 App、读取真实 DSH 会话/凭据或启动真实客户端。

官方 [Desktop reference](https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/desktop/README.md) 说明桌面版用 Electron 承载共享 Web UI，Plugins 页面管理 Desktop profile。官方 [客户端模块文档](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/client-modules.md) 规定 `dsh.client` 与 `exports["./client"]` 的浏览器扩展入口。仓库仍处于 [developer preview](https://github.com/deepseek-ai/deepseek-harness#developer-preview)，接口会有破坏性变化。

本机 0.2.1-rc.5 的内建 UI 代码确认下列调用形状：

```js
ctx.slots.inject('main', () => ctx.slots.register({
  name: 'main', key: 'dsh-chatgpt-panel'
}, ChatPanel))

ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
  name: 'sidebar.panellist', id: 'dsh-chatgpt-panel',
  label: () => 'DeepSeek Chat'
}, ChatIcon))

ctx.layout.selectPanel('dsh-chatgpt-panel') // 插件面板
ctx.layout.selectPanel(null)               // 原 Agent 对话
```

`main` 使用 keyed slot；sidebar `id` 与 `main.key` 相同。组件由 React renderer 渲染，注册与卸载由 Slot 生命周期管理。见官方 [Layout](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/client/ui-layout/README.md)、[Sidebar](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/client/ui-sidebar/README.md)、[UI Slots](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/client/ui-slots/README.md) 与 [UI Renderer](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/client/ui-renderer/README.md)。

因此本插件使用官方主面板扩展位置。它不依赖参考项目通过查找和隐藏官方中栏 DOM 的方法，减少了布局变化对原 Agent 界面的影响。切回 Agent 调用 `selectPanel(null)`，保留当前 DSH Session。插件不注册模型适配器、Agent 工具或系统提示词；Agent 功能和请求仍由原 DSH 管理。

## 免费网页聊天的兼容边界

没有查到 DeepSeek 官方向第三方开放 `chat.deepseek.com` 免费登录会话 API 的承诺。**本插件不是官方免费 API 适配器，也不保证无限调用。** 登录、限流、模型可用性、验证码与会话权限由官方网页决定。

Chat 的实验桥接只面向用户自己打开并登录的可见官方网页。发送由用户主动操作触发；插件不接受账号密码，不提取浏览器 Cookie/登录令牌，不捕获网络私有接口，不处理验证码或反自动化挑战。遇到网页限制时必须由用户在网页中处理；没有可用网页登录会话时，不回落到 DSH 付费模型。

官方另有 [Sidebar Browser](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/client/ui-sidebar-browser/README.md)，可用 `ctx.sidebarRight.openTab('browser', {params:{url}})` 打开页面。它展示真实网页，不能因此推导出网页 API 可用。本机 Desktop 的 Browser guest 强制隔离、无 Node/guest preload，网页存储是进程内存且与系统 Chrome 分离；不能用它承诺跨 App 重启免登录。本插件实验 Chrome 桥接与这个内建 Browser 属于不同路径。

网页 DOM 不是稳定接口。网页改版、中文/英文标签变化、A/B 试验、浏览器更新、登录弹窗等均可能使发送或文本读取失效。流式显示来自页面中可见文本变化，不是已获支持的服务端流式协议。官方历史仍以官方网页为准；插件本地记录不等于完整官方账号历史。

## 安装机制

按官方 [打包与安装教程](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/publish.md)，可安装 bundle 需在 `package.json` 声明 `dsh.bundle.patch`，并通过 patch 的 `insert` 添加插件行。只有 `dsh.client` 而无 bundle 声明，不会自动激活 profile layer。

确认 `dsh --version` 对应当前 App 后，在**完全退出 DSH**的情况下，从本交付目录的上一级运行：

```sh
dsh plugin --profile desktop add ./dsh-chatgpt-panel
```

也可把 `./dsh-chatgpt-panel` 替换为解压后包目录的绝对路径。本地目录由 pnpm 链接，安装后请保留目录。macOS 应用菜单 **Manage dsh Command…** 可以安装/修复随 App 配套的命令。若使用另一套全局 npm DSH，其版本与 Desktop 不一定相同。

首次需要打开一次官方 App 让其初始化 Desktop profile，然后完全退出再执行命令。源码需先完成构建；本交付的 release 包应包含 `lib/client.js`。安装输出如要求重启，退出并重新打开 App。不要手工改写 App 包内文件。

## 尚未在用户真实客户端验证

- Desktop 插件管理器的 GitHub 下载、更新与卸载；本机配套 CLI 的本地安装、加载与浏览器复用已验证，见测试说明。
- 用户自己的 `chat.deepseek.com` 登录、网页历史、真实回答和验证码流程。
- 该 Mac 的 Chrome 可见窗口启动与多窗口行为。
- 官方真实网络请求是否受地域、限流或反自动化策略影响。
- Intel Mac、社区桌面版、其他 DSH 或 Chrome 版本。

已使用本机 0.2.1-rc.5 runtime 在独立 `DSH_HOME` 的 Web profile 中验证真实插件安装、Host 启动、状态接口、正式面板注册与返回 Agent，详见 [隔离 Host 验证记录](HOST-SMOKE.zh-CN.md)。这不是实际 Mac Desktop profile 验证。隔离 Host/页面测试或模拟网页测试通过，不能代替以上实机验收；其他检查见本包测试说明，未进行的检查应保留为“未验证”。

## 更新与恢复

DSH 更新后先查看版本，重新测试面板入口、Chat/Agent 切换和卸载。网页改版后先在官方网页确认能正常手动聊天，再判断是否需要更新桥接选择器；不要禁用网页安全策略来恢复功能。

插件错误时先切回 Agent 或退出 App，再移除本插件：

```sh
dsh plugin --profile desktop remove dsh-chatgpt-panel
```

重新打开 App，原 Agent 会话应由 DSH 自身继续提供。本插件不应要求删除 DSH home、凭据或用户历史。如果第三方插件导致 Host 无法启动，官方 Desktop 的原生恢复界面提供 **Disable third-party plugins**；详细行为见 [官方恢复与诊断文档](https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/desktop/docs/diagnostics/README.md)。
