# 隔离 DSH Host 与正式 Web UI 验证

执行日期：2026-11-02。目标是本交付的真实 `dsh-chatgpt-panel`，不是仅模拟 DSH 接口的预览页面。

## 测试环境

- 读取已安装官方 Mac App 包内的 DSH CLI/runtime，版本 `0.2.1-rc.5`，`darwin arm64`。
- 通过 Electron **RunAsNode** 执行 CLI；这没有启动实际 Mac App 窗口或 Desktop profile。
- `DSH_HOME` 指向独立测试目录，使用单独 `web` profile。本机服务仅监听 `127.0.0.1:39347`。
- 使用临时、无账号的 headless Chrome 打开**该 DSH 自身提供的 Web UI**。未访问 `chat.deepseek.com`。
- 插件安装命令用测试环境 PATH 上的 pnpm `11.25.0`；真实 Desktop Plugins 页的内置 pnpm 安装流程未验证。App 资源声明的内置 pnpm 是 `11.28.5`。
- 本轮未启用实验网页连接，未打开官网浏览器，未登录任何账号，也未向模型发送消息。

## 结果

| 检查 | 结果 |
| --- | --- |
| 使用本地目录安装真实插件 bundle | 通过；pnpm 建立链接，profile bundle 列表包含该插件 |
| 使用实际 DSH runtime 启动隔离 Web Host | 通过 |
| Host 扫描实际插件浏览器入口 | 通过；`__DSH_BOOT__.entries` 包含 `dsh-chatgpt-panel` |
| `GET /api/dsh-chatgpt-panel/state` | HTTP 200 |
| 默认连接状态 | `enabled:false`、`busy:false`、`browserOpen:false` |
| 真实 DSH 侧栏出现 `DeepSeek Chat` | 通过 |
| 点击侧栏后显示正式主面板 | 通过；显示中文历史栏、新建对话、输入框与 Chat/Agent 控件 |
| 点击 `返回 DSH 原生 Agent` | 通过；回到原 DSH Conversation 与原输入区 |
| 浏览器 `pageerror` | 0 |
| Host 正常停止 | 通过；SIGTERM 后退出码 0 |

初始状态接口的实际响应如下：

```json
{
  "schema": 1,
  "activeId": null,
  "chats": [],
  "enabled": false,
  "busy": false,
  "browserOpen": false
}
```

首次启动的 DSH 自身会显示预览须知和模型配置引导。测试点击须知的 Continue，再关闭配置引导，没有填写 API Key 或登录。之后使用正常点击验证了正式面板导航。

## 复现隔离检查

以下仅用于有开发经验的人复核。先确保发布包包含 `lib/client.js`，并将 `<隔离目录>`、`<插件绝对路径>` 替换为自己的路径。不要把隔离目录设成现有 DSH home。

确认命令与 App 版本一致：

```sh
dsh --version
```

应为本次测试的 `0.2.1-rc.5`。若系统 `dsh` 不是随 App 的版本，macOS 菜单 **Manage dsh Command…** 可管理配套命令。本轮实际使用了下列包内入口的 RunAsNode 模式：

```sh
ELECTRON_RUN_AS_NODE=1 "/Applications/DeepSeek Harness.app/Contents/MacOS/DeepSeek Harness" "/Applications/DeepSeek Harness.app/Contents/Resources/app.asar/dsh/node_modules/@deepseek-ai/dsh/lib/bin.js" --version
```

在独立 home 初始化 Web profile、安装本地插件并启动服务：

```sh
DSH_HOME="<隔离目录>" dsh --profile web --dump-config
DSH_HOME="<隔离目录>" dsh plugin --profile web add "<插件绝对路径>"
DSH_HOME="<隔离目录>" DSH_TELEMETRY_MODE=DISABLED DEEPSEEK_API_KEY= dsh web --no-open --port 39347
```

打开该命令打印的本机地址，不要把含访问令牌的地址发布出去。关闭测试引导后，点击 `DeepSeek Chat`，确认输入框默认不可发送；点击 Agent，确认原 DSH 页面回来。无需执行任何模型请求。用 Ctrl+C 停止测试服务。

在独立 profile 中卸载时使用：

```sh
DSH_HOME="<隔离目录>" dsh plugin --profile web remove dsh-chatgpt-panel
```

## 本结果不能证明的部分

**这不是用户实际 Mac 客户端验收。** 本轮未运行真实 Desktop profile，也未验证 Mac 原生窗口布局、Desktop Plugins 页安装/卸载、DeepSeek 网页登录、验证码、真实流式回答、账号官网历史、Chrome 可见窗口启动行为或实际额度。网页桥接与模型使用的模拟测试见单独测试说明；它们同样不能替代真实官网人工验收。
