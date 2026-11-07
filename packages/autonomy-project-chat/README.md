# Autonomy 项目只读 Chat（社区改造）

版本 `0.1.5-project-read.3`，基于 JinkaiLiu 的 `dsh-autonomy` 0.1.5（MIT）修改。面向 DSH Desktop **0.2.2-rc.1 / macOS arm64，内置 Node 24**，不是上游官方发布版。后续 DSH 更新需要重新验证公开插件 API。

在同一条原生 DSH 会话里，Chat 可以查找和读取项目资料，Agent 可以继续操作。四个 Chat 专属能力是列目录、读取文档正文、搜索正文和列出 ZIP 内容。读取 Word、PPT、PDF 和图片文字不需要切到 Agent 或手动执行转换。

## 使用

1. 在 DSH 打开或选择实际的本地项目，进入该项目的原生会话。
2. 点击 **Chat · 只读**。例如：“请用读取工具打开上机练习1.doc，并结合 w21DB01.pptx 解释题目，标明来源。”旧会话先前说“只能读取 UTF-8”属于旧能力；新版系统提示已更新，无需清空历史。
3. 长文档用 `autonomy_read_file` 的 `offset` / `limit` 分段读取，或用 `autonomy_search_text` 搜索正文。结果保留 PDF 页、PPT 幻灯片/备注、章节/工作表标记。图片自动进行本机 OCR。纯扫描 PDF 默认识别前 3 页；指定 `ocr:true, page:4` 可识别第 4 页，混合 PDF 的指定扫描页也可这样读取。多页 TIFF 等图片用 `page` 指定帧/页。行号指**提取后的正文行**，不是原文档排版行。`warnings` / `truncated` 会说明缺失与上限，模型不应把部分读取说成全文。
4. ZIP 先用 `autonomy_list_archive` 列目录，再用 `autonomy_read_file` 的 `archive_entry` 指定包内文档。数据库 `.mdf/.ldf`、程序和其他二进制数据不是文档正文，目录会明确标记不支持。
5. 需要改文件或执行操作时，在**同一会话**点击 **Agent**。已有聊天和读取结果继续保留在这条会话中，无需另建对话或复制交接内容。

这里使用 **DSH 当前选择的模型与原有额度**；被读取片段作为普通工具结果进入这条模型会话。没有新增云端资料库。左侧 **DeepSeek Chat** 是独立的免费官网内嵌面板，不能通过本改造自动读取本机项目。其他会话不会自动继承当前会话的记忆，同项目新会话可以重新读取这些文件。

## 格式支持

| 格式 | 提取范围与位置 |
| --- | --- |
| Word `.doc` / `.docx`，相同结构的模板及宏容器 | 正文、表格文字、脚注、尾注、页眉页脚、可读取的批注/文本框；不计算真实页码 |
| PowerPoint `.ppt` / `.pptx`，相同结构的放映/模板文件 | 当前保存版本的幻灯片文字、表格文字、备注，PPTX 可读取的图表缓存文字；旧 PPT 备注按备注列表编号 |
| PDF | 先按页提取已有文字层，附带中文 CMap/标准字体资源；纯扫描件自动 OCR 前 3 页，也能指定页 OCR |
| PNG / JPEG / WebP / TIFF / HEIC / GIF / BMP 等系统支持的图片 | 通过 macOS Vision 识别中英文等文字；默认第 1 帧，`page` 可选择其他帧。已验证 PNG、JPEG、TIFF；其余格式受系统解码器和具体文件影响 |
| Excel `.xls` / `.xlsx` / `.xlsb` | 工作表名、单元格地址、文字、缓存值和可读取的公式文字；不执行宏、公式或外部连接 |
| OpenDocument `.odt` / `.odp` / `.ods` 及对应模板 | 段落、幻灯片或工作表文字，不完全还原重复单元格和排版 |
| EPUB / RTF / HTML | 章节顺序与正文；排除脚本、样式、RTF 二进制对象和字段指令 |
| TXT、Markdown、CSV、JSON、代码等 | UTF-8、UTF-16 LE/BE、GB18030/GBK；普通源码保留缩进 |
| ZIP | 列目录、读取其中支持的文档，搜索最多前 12 个支持的条目；不在磁盘解压，不递归展开 ZIP |

目标是广泛支持**文字型资料**，无法保证所有专有格式和所有内部结构。加密、损坏、未知私有格式（如未转换的部分 iWork/WPS 文件）、部分 SmartArt/公式/嵌入对象和缺少字形映射的 PDF 可能无法提取。多栏与表格顺序可能与视觉排版不同，不能把提取文本当作精确版面还原。

图片文字识别使用 [Apple Vision 的 VNRecognizeTextRequest](https://developer.apple.com/documentation/vision/recognizing-text-in-images)，处理在 Mac 本机完成，不需要 OCR 账号或云端 OCR 费用。识别文字随后作为普通工具结果进入当前 DSH 模型会话。原图没有由本插件自动上传给模型。**OCR 不等于视觉理解**：图表关系、照片内容、颜色含义、手写和公式可能识别不完整。需要模型实际看原图时，使用 DSH 原生图片附件并选择声明支持 image 输入的模型；本插件不会替你切换模型或服务。Word/PPT 内嵌图片的自动 OCR 尚未实现。

## 安装或更新

本包沿用 `dsh-autonomy` 包名及 `autonomy` 组件 ID，安装后替换原版，避免两套 Chat/Agent 开关同时生效。会话和模式事件仍由 DSH 原生管理。

下载整个仓库并保留目录，从仓库根目录执行：

```sh
dsh plugin --profile desktop add "$PWD/packages/autonomy-project-chat"
```

`lib` 已包含解析器、PDF 文字资源、macOS OCR 助手及第三方许可；用户无需另装 Xcode、Swift、Python、LibreOffice、解析库或运行 `npm install`。OCR 需要 macOS 13 或以上；助手是从仓库 Swift 源码构建的 arm64/x86_64 通用程序，已在当前 Apple Silicon Mac 验证。DSH 本地目录安装建立链接，安装后请勿移动或删除目录。若界面仍显示旧版，在插件页停用再启用 **dsh-autonomy**，确认版本 `0.1.5-project-read.3`。保留的旧拒绝回答不会自动被修改，可重新发出读取请求。

卸载后可从原来源重新安装 `dsh-autonomy`，旧会话记录不被改写。若要保留本版但恢复严格无工具 Chat，将插件配置 `chatReadProjectFiles` 设为 `false`。

## 边界与上限

- 通过 DSH 的当前项目文件系统读取现有文件。项目外路径、外部符号链接、常见凭据文件及私有配置目录被拒绝；解析后再次核对路径。ZIP 内也排除凭据、路径穿越、符号链接和加密条目。普通资料中的敏感文字无法仅靠文件名识别，应选择合适的项目和模型。
- 单文件 32 MiB；ZIP 单条目 16 MiB，累计展开 64 MiB、最多 1,500 项，并检查大小、压缩比例与 CRC。最多提取约 2,000,000 字符、600 页/幻灯片；旧 Excel 每表 20,000 行。一次返回最多 400 行、约 24,000 字符，超长单行明确标记截断。
- 最多同时两个文档工作线程，普通文档工作线程每项解析 30 秒、V8 堆上限 256 MiB。OCR 使用单独的固定本机助手，每次 30 秒，输入最多 4,000 万像素，识别前缩放到约 600 万像素/最长边 4096，单页最多 5,000 行、约 200,000 字符。原生 Vision 处理不受 V8 堆上限约束。解析器从字节读取，不运行文档宏、字段或外部链接；不调用 shell。工作线程用于隔离错误和限制资源，**不是操作系统安全沙箱**。模型可以逐个读取需要的文件；目录/搜索均有上限，不保证扫描完整大型项目。
- 最近四份解析结果仅在内存短暂缓存，总计不超过约 8 MiB；内容变化重新解析。没有写入隐藏文本副本，也不上传整个目录；返回片段和聊天仍由 DSH 正常记录与处理。
- Chat 中文件写入、命令、网络工具和委派被拒绝。切换模式不取消已经开始的操作，需要使用 DSH 的停止按钮。
- Native executor 直接调用专属读取能力。PTC TypeScript 函数体仅允许一个固定 JSON 参数的读取调用；其他程序、循环、导入和升级权限参数均拒绝。未更换 DSH 的执行器。Python 等其他 PTC 运行时尚未验证。
- 通过公开 scoped tools、单调 guard、system-prompt/assemble、session projection 和命令接口实现。作用域模块与宿主共享 SDK 身份，没有修改 App 安装包。不读取密码、Cookie 或官网登录信息，不绕过网站限制。

## 构建与测试

开发环境需要 Node 24；修改 OCR 的 Swift 源码后需要在带 Swift 编译器的 Mac 上构建。`scripts/build-native.mjs` 生成通用助手及源码/二进制 SHA-256 记录，生产安装直接使用已构建助手。SheetJS 从其官方 CDN 固定版本安装，`package-lock.json` 包含完整性记录。发布包没有运行时 npm 依赖。

```sh
env -u NODE_TLS_REJECT_UNAUTHORIZED npm ci --ignore-scripts
env -u NODE_TLS_REJECT_UNAUTHORIZED npm run check
env -u NODE_TLS_REJECT_UNAUTHORIZED ELECTRON_RUN_AS_NODE=1 \
  '/Applications/DeepSeek Harness.app/Contents/MacOS/DeepSeek Harness' \
  scripts/test-installed-runtime.mjs
```

2026-11-07 验证范围：

- 38 项自动测试：真实临时文件的项目边界/符号链接/凭据排除、格式与中文、PDF CMap、幻灯片和章节顺序、脚注和备注、旧版 Office、ZIP 内文档、搜索分页、取消、大小/截断、CRC/重复/加密/压缩比例及 PTC 语法限制。另验证了中英文 PNG/JPEG、TIFF 多页、ZIP 图片、扫描 PDF 自动回退与指定页、超过默认范围的扫描件、错误图片及 OCR 取消。发布夹具全部为人工生成的测试资料。
- 已用用户项目的四个 `.doc` 和四份 `.pptx` 在本机只读验证正文/中文提取，没有修改原文件，也没有把资料加入仓库。两份 ZIP 实际包含数据库 `.mdf/.ldf`，只验证了类型识别。
- 6 项离线集成测试使用已安装 DSH 0.2.2-rc.1 的实际 Cordis、Session、Tools、Command、Projection、Filesystem 和 Native/PTC 执行器，包含 DOCX、中文 PDF、PNG、扫描 PDF 以及 ZIP 内文档读取、原执行器保留、会话隔离/回放、卸载、严格模式和延迟文件系统。PTC 程序执行部分使用固定本地夹具，没有调用真实模型或付费服务。

已通过 DSH CLI 安装 `.3`，并在本机直接运行 OCR 与实际 DSH SDK 的 Native/PTC 工具管线验证。客户端界面重载状态本次未能确认；若旧会话仍说不支持图片，在插件页停用后重新启用 Autonomy 以加载新版。OCR 自动测试需在能访问 macOS Vision 系统服务的环境运行；受限沙箱可能无法启动该服务。没有代发真实模型测试请求。**实际模型是否正确选择工具、依据原始资料回答的质量，以及其他 DSH 版本/Intel Mac 尚未验证**。文档解析通过不等于模型已读完所有资料。
