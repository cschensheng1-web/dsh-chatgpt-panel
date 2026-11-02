# DSH DeepSeek Chat（预览版）

版本：`0.1.0-preview.6`。独立社区插件，将 `chat.deepseek.com` 放在 DeepSeek Harness Mac 桌面版中，使用官网自身的聊天界面。仅保留内嵌版本，不需要独立 Chrome。

## 使用

点击 DSH 左侧 **DeepSeek Chat**，在下方官网页面自行登录和聊天。聊天历史、新建对话、输入、Markdown、代码块和流式回复均由官网直接提供。

顶栏仅保留：

- **重新加载**：刷新内嵌网页；加载中暂不可点击。
- **返回 DSH 对话**：打开原 DSH 会话，保留原模型、工具、权限和额度配置。它不替第三方插件切换权限模式。

**登录限制：同一次 DSH 运行期间可以沿用登录；完全退出 DSH 后需重新登录。** 当前 DSH 的内嵌容器使用内存存储，没有可让插件开启的跨重启持久化选项。离开或刷新前请先保存未发送的草稿。

插件不保存密码、不提取 Cookie、不读取官网消息、不注入访客脚本，不修改 User-Agent、浏览器安全策略或 App 安装包。登录和验证码由你在官网页面自行处理。没有免费 API、模型转发或自动付费回退；官网可用性和限流由服务方决定。

## 安装和更新

公开仓库：[cschensheng1-web/dsh-chatgpt-panel](https://github.com/cschensheng1-web/dsh-chatgpt-panel)。在 DSH 插件管理的 GitHub 来源中填写：

```text
github:cschensheng1-web/dsh-chatgpt-panel
```

也可使用与 App 配套的命令：

```sh
dsh plugin --profile desktop add github:cschensheng1-web/dsh-chatgpt-panel
```

`lib/client.js` 已构建，无运行时外部依赖。支持本地目录安装；本地安装会建立链接，请保留插件目录。第三方 GitHub 插件在当前 DSH 管理器中需先卸载再安装新版，下载还取决于本机网络。

本机已验证官方 DSH Desktop `0.2.1-rc.5` / macOS arm64 的官网页面加载、返回原会话、重新打开以及没有独立插件 Chrome 进程。普通 Web 宿主或不提供内嵌接口的桌面版会显示“不支持”提示，不会打开外部浏览器。

## 旧版本地数据

旧版入口、Chrome 桥接、消息抓取和本地聊天 API 已移除。以前位于 `$DSH_HOME/plugin-data/dsh-chatgpt-panel`（默认 `~/.dsh/plugin-data/dsh-chatgpt-panel`）的文件没有删除；本版本不读取它们。官网历史仍由官网账号管理。

## 开发与验证

```sh
npm ci --ignore-scripts
npm run check
npm run test:ui
npm run preview
```

UI 测试使用 Chrome 和模拟的 Desktop bridge，只访问本地夹具。**Chrome 仅供开发测试使用，不是插件运行依赖。** 普通浏览器预览不能创建真实 Desktop webview，会显示兼容性提示。

说明：[内嵌实现与登录限制](docs/EMBEDDED.zh-CN.md)、[测试记录](docs/TESTING.zh-CN.md)、[版本兼容性](docs/COMPATIBILITY.zh-CN.md)。用户在内嵌页面中的实际登录、验证码和真实聊天尚未记为测试通过。
