# 官网内嵌模式

版本：0.1.0-preview.5；核实日期：2026-11-02。目标为本机官方 DSH Desktop 0.2.1-rc.5 / macOS arm64。

## 功能和边界

主面板内展示真实 `https://chat.deepseek.com/` 页面。官网管理登录、历史、输入、Markdown 和回复；插件不再将这些内容抓取到自定义历史中。原 Chrome 面板的本地记录保留为其他选项。

顶栏只保留“重新加载”和“返回 DSH 对话”。没有可返回页面时仍显示“返回”的旧设计已移除；“历史面板”也不再被用作官网历史的名称。

“返回 DSH 对话”只选择原主会话，不改动模型、权限或第三方 autonomy 插件状态。离开、刷新前应先保存官网的未发送草稿。重新打开内嵌页会加载官网，官网已发送的会话由其自身账号管理。

## 登录是否能保存

当前主进程 `DesktopBrowserGuests.acquire` 对同一个存储分组使用进程内 `dsh-sidebar-browser-<随机ID>` partition，没有 `persist:` 前缀。租约释放不会立刻清空分组，但完全退出应用会丢失内存会话。因此同一次运行可以沿用登录，跨重启不能记住。插件没有可开启的持久化选项，不提取 Cookie，不复制 Chrome 的登录数据，也不修改 App 安全设置。

## 实现依据

使用本机 `window.dshDesktop.browser.acquire/release/onOpenRequested`，与内置 Sidebar Browser 相同的租约初始化流程：先将获批 partition 与 `about:blank#<lease>` 配置到 webview，待宿主批准并加载后再导航官网。主进程强制 Node 关闭、上下文隔离、sandbox 和 webSecurity 打开；插件不添加 guest preload、脚本注入、User-Agent 或 disablewebsecurity。

参考：[官方 Sidebar Browser](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/client/ui-sidebar-browser/README.md)、[Electron webview 文档](https://www.electronjs.org/docs/latest/api/webview-tag)。该 Desktop bridge 不保证其他版本或社区桌面包装兼容。

## 已验证与未验证

已在本机实际 DSH 的主面板中看到官网页面、DeepThink/Search 与输入框。更新后顶栏仅显示“重新加载”和“返回 DSH 对话”；实际点击返回后看到了原会话与输入框，再次进入 Chat 仍可加载官网。检查时独立插件 Chrome 主进程数量为 0。容器租约、关闭期间初始化、失败清理、安全属性、返回 DSH 及旧版切换有本地自动化检查。

尚未验证用户在内嵌页面中的实际登录、验证码、真实回答与跨系统兼容性。页面可以拒绝内嵌环境；此时显示失败信息，不伪装客户端、不绕过限制，也不自动打开独立 Chrome。
