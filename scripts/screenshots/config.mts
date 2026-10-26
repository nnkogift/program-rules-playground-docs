import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Every setting comes from an environment variable. The base URL defaults to
 * the instance that holds the PRT programs. Credentials have no defaults: set
 * them in .env locally, CI passes them from repository secrets.
 */

export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function readEnv(name: string, fallback: string): string {
  const value = process.env[name];
  return value === undefined || value === '' ? fallback : value;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} is not set. Put DHIS2_USERNAME and DHIS2_PASSWORD in .env (local runs) or in ` +
        'repository secrets (CI). Ask the maintainer for access to the demo instance.'
    );
  }
  return value;
}

function readNumber(name: string, fallback: number): number {
  const value = Number(readEnv(name, String(fallback)));
  if (!Number.isFinite(value)) {
    throw new Error(`${name} must be a number`);
  }
  return value;
}

export type ScreenshotConfig = {
  /** DHIS2 instance the app talks to. */
  dhis2BaseUrl: string;
  username: string;
  password: string;
  /** Checkout of nnkogift/program-rules-playground; the script starts its dev server. */
  appDir: string | undefined;
  /** URL of an app that is already running. Takes precedence over appDir. */
  appUrl: string | undefined;
  /** What to type in the app shell's "Server" field. */
  loginServerUrl: string;
  appPort: number;
  proxyPort: number;
  /** The browser clock is frozen at this instant so dates in the images are stable. */
  fixedTime: string;
  headless: boolean;
  only: string[];
  timeoutMs: number;
};

export function loadConfig(argv: string[] = process.argv.slice(2)): ScreenshotConfig {
  const appPort = readNumber('APP_PORT', 3001);
  const proxyPort = readNumber('DHIS2_PROXY_PORT', 8081);
  const appUrl = process.env.APP_URL || undefined;
  const appDir = process.env.APP_DIR ? path.resolve(process.env.APP_DIR) : undefined;
  const dhis2BaseUrl = readEnv('DHIS2_BASE_URL', 'https://dhis.rufaa.co.tz').replace(/\/$/, '');

  const onlyArg = argv.find((arg) => arg.startsWith('--only='));
  const onlyList = onlyArg ? onlyArg.slice('--only='.length) : readEnv('SCREENSHOTS_ONLY', '');

  return {
    dhis2BaseUrl,
    // No defaults: credentials are never committed. See docs-contributing/SCREENSHOTS.md.
    username: requireEnv('DHIS2_USERNAME'),
    password: requireEnv('DHIS2_PASSWORD'),
    appDir,
    appUrl,
    // The dev server proxies DHIS2 on proxyPort, which avoids CORS and cookie issues.
    loginServerUrl: readEnv('DHIS2_LOGIN_SERVER_URL', `http://localhost:${proxyPort}`),
    appPort,
    proxyPort,
    fixedTime: readEnv('SCREENSHOTS_FIXED_TIME', '2026-03-02T09:00:00Z'),
    headless: readEnv('HEADLESS', 'true') !== 'false',
    only: onlyList
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean),
    timeoutMs: readNumber('SCREENSHOTS_TIMEOUT_MS', 90_000),
  };
}
