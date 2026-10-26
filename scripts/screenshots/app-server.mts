import { spawn, type ChildProcess } from 'node:child_process';
import { createWriteStream } from 'node:fs';
import path from 'node:path';
import type { ScreenshotConfig } from './config.mts';
import { REPO_ROOT } from './config.mts';

export type RunningApp = { url: string; stop: () => Promise<void> };

const LOG_FILE = path.join(REPO_ROOT, 'scripts/screenshots/.output/app-server.log');

async function waitForHttp(url: string, timeoutMs: number, child?: ChildProcess): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (child && child.exitCode !== null) {
      throw new Error(`The app dev server exited early (code ${child.exitCode}). See ${LOG_FILE}`);
    }
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(5_000) });
      if (response.status < 500) {
        return;
      }
    } catch {
      // Not up yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

/**
 * Uses APP_URL when it is set. Otherwise starts the app's dev server from
 * APP_DIR with its proxy pointed at DHIS2_BASE_URL. The proxy serves DHIS2 on
 * localhost, which avoids CORS and cross-site cookie problems on the instance.
 */
export async function startApp(config: ScreenshotConfig): Promise<RunningApp> {
  if (config.appUrl) {
    const url = config.appUrl.endsWith('/') ? config.appUrl : `${config.appUrl}/`;
    await waitForHttp(url, config.timeoutMs);
    return { url, stop: async () => {} };
  }
  if (!config.appDir) {
    throw new Error(
      'Set APP_URL to a running app or APP_DIR to a program-rules-playground checkout.'
    );
  }

  const log = createWriteStream(LOG_FILE);
  const child = spawn(
    'pnpm',
    [
      'exec',
      'd2-app-scripts',
      'start',
      '--proxy',
      config.dhis2BaseUrl,
      '--port',
      String(config.appPort),
      '--proxyPort',
      String(config.proxyPort),
    ],
    {
      cwd: config.appDir,
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, BROWSER: 'none' },
    }
  );
  child.stdout?.pipe(log);
  child.stderr?.pipe(log);

  const url = `http://localhost:${config.appPort}/`;
  // The first start bootstraps the app shell, which takes a while on a cold cache.
  await waitForHttp(url, 5 * 60_000, child);
  await waitForHttp(`http://localhost:${config.proxyPort}/api/ping`, 60_000, child);

  return {
    url,
    stop: async () => {
      if (child.pid && child.exitCode === null) {
        // Kill the whole group: pnpm, d2-app-scripts, Vite and the proxy.
        process.kill(-child.pid, 'SIGTERM');
      }
      log.end();
    },
  };
}
