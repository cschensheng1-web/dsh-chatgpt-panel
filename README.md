# DSH DeepSeek 项目 Chat / Work（预览版）

版本：`0.1.0-preview.8`。独立社区插件，在 DSH Mac 桌面版中使用 DeepSeek 官网免费 Chat，并将核对过的聊天上下文交接给同一项目的原生 DSH Work 会话。没有独立 Chrome，也没有免费网页 API 承诺。

## 使用

1. 点击左侧 **DeepSeek Chat**，选择 DSH 已有工作区。在 Chat 页的官网中自行登录和讨论。
2. 点击 **带上聊天转入 Work**：一次性读取当前页面已加载的聊天；如果你选中了消息中的文本，则只读取选中部分。网站布局不适配时可直接粘贴到“聊天上下文”。
3. 在“项目资料”中核对内容、补充目标和约束，填写 **Work 下一步做什么**，展开“查看完整交接内容”检查最终文本。
4. 点击 **新建 Work 草稿**。插件创建同项目的原生 DSH 会话并填入草稿；**你点击 DSH 发送后才调用模型，按 DSH 原配置与额度使用。** 不会替其他插件切换 Agent 权限模式。
5. 在 Work 页选择项目会话，可打开它，或读取其最新已完成的文字回复到项目。**复制项目资料给 Chat** 后，需自行粘贴到官网输入框。原生会话中的“项目 Chat”按钮可返回同项目。

Work 页用于管理和交接原生 DSH 会话；执行任务时打开原生对话页面。它没有复制 DSH 的工具或另造一套 Agent。

## 原生 Autonomy Chat 读取项目

如果你使用的是原生会话里的 Autonomy Chat，原版会把读取工具一并关闭。本仓库提供可单独安装的 [Autonomy 项目只读 Chat 改造](packages/autonomy-project-chat/README.md)：可以查找和读取当前项目的 Word、PPT、PDF 文字层、Excel、OpenDocument、EPUB 和普通文字资料，新增本机图片/扫描 PDF OCR，也可读取 ZIP 内文档或图片；切换 Agent 后沿用同一会话上下文，使用 DSH 当前模型及原额度。它不改变左侧官网 Chat。需要按子包说明安装，更新本面板不会自动替换 Autonomy。

## 上下文与记忆范围

- 项目资料、导入的聊天、任务和已导入的 Work 回复按工作区 ID 保存于本机 DSH 页面存储。它们不是官网账号记忆，也不是项目目录内的共享文件；只在交接时进入对应 Work 草稿。其他 DSH 对话不会自动获得这些内容。
- 网页读取只在你点击按钮时发生。仅识别已渲染的消息容器，保留基本文字和代码块；不读取账号密码、输入框值、Cookie、登录存储、私有接口或页面内部状态。
- 不自动滚动加载旧历史，不携带附件、图片、隐藏推理或未发送草稿，不保证整段历史完整。生成中、验证、限流、未知布局或过长内容会提示停止并支持手动导入。请核对快照后再交接。
- Work 回复读取仅包含已加载记录中最新的公开文字回复，不导入工具参数或内部推理，不调用模型生成摘要。
- 官网一侧仍需主动粘贴或上传项目资料。没有后台双向同步；不接管官网输入或发送操作。
- **官网登录仅在同一次 DSH 运行期间沿用；完全退出 DSH 后需重新登录。** 当前 Desktop 内嵌容器没有供插件启用的跨重启持久化选项。

项目资料保存在本机，交接文本会进入 DSH 自己的草稿/会话存储。导入与读取均可在资料区检查或编辑。切换项目前请保存官网尚未发送的草稿。

## 安装和更新

公开仓库：[cschensheng1-web/dsh-chatgpt-panel](https://github.com/cschensheng1-web/dsh-chatgpt-panel)。DSH 插件管理 GitHub 来源：

```text
github:cschensheng1-web/dsh-chatgpt-panel
```

或使用与 App 配套的命令：

```sh
dsh plugin --profile desktop add github:cschensheng1-web/dsh-chatgpt-panel
```

`lib/client.js` 已构建，无运行时外部依赖。支持本地目录安装；安装会建立链接，请保留目录。当前管理器更新第三方 GitHub 插件可能需要卸载后重装，网络问题仍会影响下载。

项目界面已在官方 DSH Desktop `0.2.1-rc.5` / macOS arm64 验证；本版新增的请求兼容修复已使用本机 `0.2.2-rc.1` 实际运行时离线验证。网页容器、Session Controller、Workspace 和 composer 接口均属预览版能力，后续 DSH 更新可能需要适配。测试范围见 [测试记录](docs/TESTING.zh-CN.md)。

## 原生会话工具兼容修复

preview.8 集成经过审查的 MIT 社区修复，处理原生会话的 `All tools cannot be deferred` / `INVALID_REQUEST`：在符合条件的请求副本中加入一个不可执行的兼容占位工具。不修改聊天历史或权限，也不把官网 Chat 切换到付费 API。

如果服务端已经开始输出内容，不会重发；只有明确的全延迟工具拒绝可能触发一次修正重试。此修复针对工具声明格式，不解决余额、网络或登录问题。来源与许可证见 NOTICE。

## 开发

```sh
npm ci --ignore-scripts
npm run check
npm run test:ui
npm run preview
```

UI 测试使用 Chrome 和模拟 Desktop/DSH 服务，仅访问本地夹具。Chrome 不是插件运行依赖。普通浏览器无法创建真实 Desktop webview。

旧版 Chrome 桥接和本地聊天 API 已移除；原先 `~/.dsh/plugin-data/dsh-chatgpt-panel` 的文件未删除，本版本不读取它们。说明：[内嵌与交接](docs/EMBEDDED.zh-CN.md)、[兼容性](docs/COMPATIBILITY.zh-CN.md)。
