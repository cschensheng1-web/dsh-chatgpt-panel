import { homedir } from 'node:os';
import { join } from 'node:path';
import { ChatStore } from './store.mjs';
import { DeepSeekWebEngine } from './engine.mjs';
import { createRoutes } from './routes.mjs';

export const name = 'dsh-chatgpt-panel';
export const inject = ['webServer'];
export function apply(ctx) {
  const root = join(process.env.DSH_HOME || join(homedir(), '.dsh'), 'plugin-data', name);
  const store = new ChatStore(root);
  const engine = new DeepSeekWebEngine({ profileDir: join(root, 'browser-profile') });
  const app = createRoutes({ store, engine });
  ctx.effect(() => {
    const dispose = app.routes.map(route => ctx.webServer.register(route));
    return () => { for (const d of dispose.reverse()) d(); void app.dispose(); };
  }, 'dsh-chatgpt-panel: routes');
}
