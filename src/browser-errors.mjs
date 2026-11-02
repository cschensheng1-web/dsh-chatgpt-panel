const PROFILE_IN_USE = '插件的专用 Chrome 窗口仍在使用中。请先关闭该专用窗口，再点击“打开 Chrome 登录窗口”；登录状态会保留。';

export function browserErrorMessage(error) {
  if (typeof error?.userMessage === 'string') return error.userMessage;
  const text = String(error?.message ?? error ?? '');
  if (/ProcessSingleton|SingletonLock|user data directory.*(?:in use|already)|profile directory.*(?:in use|existing process)/i.test(text)) return PROFILE_IN_USE;
  if (/Executable doesn't exist|chromium distribution.*not found|Google Chrome.*not found/i.test(text)) return '未找到 Google Chrome。安装 Chrome 后，再打开登录窗口。';
  if (/Target.*(?:context|browser).*closed|Browser.*closed|BROWSER_CLOSED/i.test(text)) return '官网浏览器已关闭，请重新打开登录窗口。';
  if (error?.name === 'TimeoutError' || /net::ERR_|Timeout.*exceeded/i.test(text)) return '官网页面暂时无法打开或等待超时，请检查网络后再试。';
  return '官网浏览器操作未完成。请关闭插件的专用 Chrome 窗口后重试。';
}

// Older versions persisted Playwright launch logs in a chat's error field.
// Clean that field for display; never rewrite the user's message content.
export function displayChatError(value) {
  const text = String(value ?? '');
  return /ProcessSingleton|SingletonLock|browserType\.launchPersistentContext|Call log:|\[pid=\d+\]/i.test(text)
    ? browserErrorMessage(new Error(text)) : text;
}
