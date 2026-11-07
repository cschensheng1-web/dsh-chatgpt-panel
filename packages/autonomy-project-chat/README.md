# Autonomy 项目只读 Chat（社区改造）

版本 `0.1.5-project-read.1`，基于 JinkaiLiu 的 `dsh-autonomy` 0.1.5（MIT）修改。面向官方 DSH Desktop **0.2.2-rc.1 / macOS arm64**，不是上游官方发布版。

原版 Autonomy 的 Chat 会禁用所有工具，包括读取文件。本版在同一原生 DSH 会话中加入三个仅供 Chat 使用的项目读取能力：列目录、查找文字、按行读取 UTF-8 文件。

## 使用

1. 在 DSH 打开或选择实际的本地项目，进入该项目的原生会话。
2. 点击 **Chat · 只读**。例如输入“请先读取项目里的 README.md，再说明这个项目做什么”。模型可以按需定位和读取项目里的文字、Markdown、代码、JSON、CSV 等文件。
3. 需要改文件或执行操作时，在**同一会话**点击 **Agent**。已有聊天和已读取的资料仍在这条会话的历史中，无需另建会话或复制交接内容。

这里使用 DSH 已选择的模型和原有额度。它没有连接免费官网账号，也没有新增云端存储。被读取的内容会作为正常工具结果进入这条 DSH 模型会话，按当前模型服务的方式处理。

左侧 **DeepSeek Chat** 是独立的官网内嵌面板，不受本改造影响，仍不能自动读取本机项目。其他会话也不会自动继承当前会话的记忆；同项目中的新会话可以重新读取这些项目文件。

## 安装

本包沿用 `dsh-autonomy` 包名及 `autonomy` 组件 ID，安装后替换原版，避免两套 Chat/Agent 开关同时生效。会话和模式事件仍由 DSH 原生管理。

下载整个仓库并保留目录，从仓库根目录执行：

```sh
dsh plugin --profile desktop add "$PWD/packages/autonomy-project-chat"
```

`lib` 中已有构建产物，用户不需要安装开发依赖。DSH 本地目录安装建立链接，安装后请勿移动或删除目录。若界面仍显示旧版，在 DSH 插件页停用再启用 **dsh-autonomy**，确认版本为 `0.1.5-project-read.1`。

卸载本改造后，可从原版来源重新安装 `dsh-autonomy`。旧会话记录未被改写。若想保留本版但恢复严格无工具 Chat，在插件配置中将 `chatReadProjectFiles` 设为 `false`。

## 范围与限制

- 直接读取会话当前工作目录里的现有文件，没有另建资料库或复制整个项目。项目外路径、外部符号链接、常见凭据文件及私有配置目录会被拒绝。普通文本中的敏感内容无法仅凭文件名识别，使用前应选择合适的项目和模型。
- 目前只支持 UTF-8 文本，**不解析 PDF、Word、图片、音视频或网页来源**。单文件最多 512 KiB；每次最多 400 行、约 24,000 字符，超出时明确标记截断。目录和搜索也有返回量限制，不保证扫描整个大型项目。
- Chat 中文件写入、命令、网络工具和委派仍被拒绝。已开始的 Agent 操作不会因切换而自动取消，需使用 DSH 的停止按钮。
- Native executor 直接调用只读能力。PTC 的 TypeScript 函数体模式只允许一个固定格式的 JSON 参数读取调用；其他程序、语句、循环、导入、权限升级参数均拒绝。未替换或卸载 DSH 选中的执行器。Python 等其他 PTC 运行时尚未验证。
- 不读取账号密码、Cookie 或官网登录信息，不绕过验证码或网站限制。
- 通过 DSH 公开的 scoped tools、单调 guard、system-prompt/assemble、session projection 与命令接口实现。作用域模块从当前 DSH Host 入口解析，以共享宿主的身份与权限管线，没有打包第二份 DSH SDK，也没有修改 App 安装包。后续 DSH 更新需要重新验证。

## 测试

```sh
npm ci --ignore-scripts
npm run check
env -u NODE_TLS_REJECT_UNAUTHORIZED ELECTRON_RUN_AS_NODE=1 \
  '/Applications/DeepSeek Harness.app/Contents/MacOS/DeepSeek Harness' \
  scripts/test-installed-runtime.mjs
```

2026-11-07 已通过：

- 构建及 10 项文本读取测试：真实临时文件、路径和符号链接边界、凭据排除、编码和大小限制、取消、截断、搜索及 PTC 语法边界。
- 使用已安装 0.2.2-rc.1 的实际 Cordis、Session、Tools、Command、Projection、Filesystem 和 Native/PTC 执行器完成 6 项集成测试：Chat 读取、写入和任意程序拒绝、Agent 保留原执行器、会话隔离、历史回放、卸载恢复、严格 Chat、上游默认提示迁移以及文件系统服务稍后可用时的能力挂载。PTC 运行环境使用本地固定调用夹具；没有模型或网络调用。
- 在实际 Mac 客户端安装后，已确认新包来源、版本和原生会话中的 **Chat · 只读**；执行模式命令得到了新版只读提示。没有发送模型测试消息。安装替换可能需要等插件来源刷新，再停用和启用一次以清理旧 Host。

没有代发真实模型测试请求。用户实际资料的模型检索选择、回答质量、非文本附件、其他 DSH 版本与 Intel Mac 尚未验证。请先用小型文字资料，在自己的项目会话中验证一次读取。
