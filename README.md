# DSH DeepSeek Chat（预览版）

当前版本：`0.1.0-preview.5`。在 DeepSeek Harness Mac 桌面版里打开官方 DeepSeek 网页聊天，并保留原 DSH 会话入口。

## 当前默认：官网内嵌

在已核实的官方 Mac Desktop `0.2.1-rc.5` 上，点击侧边栏 **DeepSeek Chat**，官网页面直接显示在 DSH 主面板中，默认不启动独立 Chrome。

- 在内嵌官网中自行登录、查看官网历史、新建对话和发消息。Markdown、代码块和流式回复由官网直接提供。
- **重新加载**刷新内嵌网页；加载中暂不可点击。
- **返回 DSH 对话**打开原 DSH 会话，保留其模型、工具和使用额度配置。该按钮不会替其他第三方插件切换权限模式。
- **其他选项 → 查看旧版面板记录（Chrome 方案）**可查看之前的本地记录；旧版不会自动启用。

**登录保留限制：当前 DSH 的内嵌容器只使用内存会话。同一次 DSH 运行期间可沿用登录；完全退出 DSH 后需要重新登录。宿主没有开放可由插件启用的跨重启持久化选项。** 离开或刷新前请先保存未发送的草稿。官网界面加载已在本机看到；用户账号在内嵌页面的实际登录、验证码和真实聊天仍需人工验证。

内嵌方案使用 Desktop 预加载层提供的浏览器 lease 和隔离 webview，保持宿主的安全策略。不注入访客脚本、不读取页面消息或登录 Cookie，不改 User-Agent，不复制独立 Chrome 的登录数据，不修改 App 安装包。账号和密码只在官网中由你自行操作。

## 安装和更新

仓库：[cschensheng1-web/dsh-chatgpt-panel](https://github.com/cschensheng1-web/dsh-chatgpt-panel)。在 DSH 插件管理的 GitHub 来源中填入：

```text
github:cschensheng1-web/dsh-chatgpt-panel
```

本机 DSH 0.2.1-rc.5 的管理器要求第三方插件先卸载再安装新版；卸载插件包不会删除本插件独立数据目录。也可通过 DSH 配套命令安装：

```sh
dsh plugin --profile desktop add github:cschensheng1-web/dsh-chatgpt-panel
```

`lib/client.js` 已提交，安装无需构建。可以解压源码包，在插件管理器选择本地目录，指定含 `package.json` 的目录。本地目录安装会建立链接，安装后请保留目录。本机已通过该方式安装和加载；GitHub 来源下载受本机网络影响。仅使用命令行 Web 宿主时用 `--profile web`；普通 Web 页面没有 Desktop 的内嵌能力，会保留旧版面板。

## 保留的旧版 Chrome 面板

旧版自定义面板有本地历史、搜索、Markdown/代码复制、多行输入和官网 DOM 桥接。选择旧版后，需自行勾选实验连接并打开专用 Chrome；它的网页登录数据与内嵌官网相互独立。

该方案只操作可见的官网输入和按钮、读取可见回复，不请求私有聊天 API、不截取网络流、不处理验证码、不重试发送、不回退到付费 API。若读取中断而官网已有回答，可点 **同步官网回复**恢复已有内容；该操作不再次发送。网页改版可能使它失效。

- preview.2 修复 Desktop 转发移除 Origin 后启用连接被拒的问题。
- preview.3 修复关闭原标签后重复启动 Chrome、关闭过程中重开及配置目录占用提示。
- preview.4 修复思考区域误判为用户消息，并增加只读回复同步。
- preview.5 默认使用官网内嵌；原 Chrome 面板作为可选旧版保留。

参考研究：[xmuwenxiang/dsh-web-chat](https://github.com/xmuwenxiang/dsh-web-chat)，Apache-2.0。没有采用其网络流捕获、Agent 工具、系统提示或可能使用模型额度的摘要转交。没有把官网账号当作官方免费 API，也不保证无限使用；网页登录、限流与可用性由官网决定。

## 本地数据和卸载

旧版本地数据位于 `$DSH_HOME/plugin-data/dsh-chatgpt-panel`；没有 DSH_HOME 时位于 `~/.dsh/plugin-data/dsh-chatgpt-panel`。`chats.json` 是明文历史，权限 0600、目录权限 0700。`browser-profile` 仅用于可选 Chrome 方案；插件不读取其中的 Cookie 或密码。删除本地记录不删除官网历史。

内嵌会话存储由 DSH 管理，完全退出后不保留。两种方案都不修改原 DSH Agent 的计费来源；切回 DSH 会话后的请求仍按原规则处理。

在插件管理中禁用/移除即可卸载。需要清除旧版 Chrome 登录时，关闭专用窗口后删除本插件的 `browser-profile`；不要删除整个 DSH_HOME。

## 开发与验证

Node.js 22+：

```sh
npm ci --ignore-scripts
npm run check
npm run test:ui
npm run test:embedded
npm run test:dom
npm run test:browser
npm run preview
```

测试使用临时目录和本地夹具，不登录官网、不发送真实消息。浏览器检查需要已安装 Google Chrome。开发预览的 Agent 为占位；实际 Desktop 页面与隔离测试的边界见 [测试记录](docs/TESTING.zh-CN.md)、[兼容性](docs/COMPATIBILITY.zh-CN.md) 和 [内嵌说明](docs/EMBEDDED.zh-CN.md)。

DSH 的 lease、webview 或主面板接口变化可能影响内嵌版本。升级后先检查官网加载、返回原会话和重新打开。内嵌加载失败时不会自动改用独立 Chrome或付费模型。
