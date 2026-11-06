import deferredToolsGuard from './compat/all-deferred-tools-guard/index.js';

export const name = 'dsh-chatgpt-panel';
export const inject = ['llm'];
// Read-only request compatibility repair. No model adapter, executable tool,
// credential access, network route, or conversation-history mutation is added.
export function apply(ctx) {
  ctx.plugin(deferredToolsGuard, { mode: 'guard', report: false });
}
