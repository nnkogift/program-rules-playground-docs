import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium, type BrowserContext, type Page } from 'playwright';
import {
  APP_HUB_VIEWPORT,
  type AppTarget,
  DOCS_VIEWPORT,
  failurePath,
  newScreenshotContext,
} from './actions.mts';
import { startApp } from './app-server.mts';
import { loadConfig, REPO_ROOT, type ScreenshotConfig } from './config.mts';
import { manifest, type ScreenshotEntry } from './manifest.mts';
import { scenarios } from './scenarios.mts';
import { appShell, hiddenTooltips, VOLATILE_CSS } from './selectors.mts';

const OUTPUT_DIR = path.join(REPO_ROOT, 'scripts/screenshots/.output');
const ATTEMPTS = 2;

type Result = { name: string; output: string; ok: boolean; error?: string; ms: number };

function selectEntries(config: ScreenshotConfig): ScreenshotEntry[] {
  if (config.only.length === 0) {
    return manifest;
  }
  const unknown = config.only.filter((name) => !manifest.some((entry) => entry.name === name));
  if (unknown.length > 0) {
    throw new Error(`Unknown screenshot name(s): ${unknown.join(', ')}`);
  }
  return manifest.filter((entry) => config.only.includes(entry.name));
}

async function prepareForCapture(page: Page) {
  await page.evaluate(async () => {
    (document.activeElement as HTMLElement | null)?.blur();
    // Typing scrolls wide layouts sideways; show them from their start edge.
    // A huge negative value also reaches the start of row-reverse containers.
    for (const element of Array.from(document.querySelectorAll<HTMLElement>('*'))) {
      if (element.scrollWidth > element.clientWidth) {
        element.scrollLeft = -element.scrollWidth;
      }
    }
    await document.fonts.ready;
  });
  await page.mouse.move(0, 0);
  await hiddenTooltips(page).waitFor({ state: 'detached' });
  // The header bar loads its title, icons and logo after the app renders.
  await appShell.headerBar(page).filter({ hasText: /\S/ }).waitFor();
  await appShell.headerLogo(page).waitFor();
  await page.waitForFunction(() =>
    Array.from(document.images).every((image) => image.complete && image.naturalWidth > 0)
  );
}

async function captureEntry(
  context: BrowserContext,
  target: Omit<AppTarget, 'page'>,
  entry: ScreenshotEntry
) {
  const page = await context.newPage();
  try {
    const element = await scenarios[entry.scenario]({ ...target, page });
    await prepareForCapture(page);
    const options = { animations: 'disabled', caret: 'hide', style: VOLATILE_CSS } as const;
    const image =
      element && entry.capture === 'element'
        ? await element.screenshot(options)
        : await page.screenshot(options);
    const file = path.join(REPO_ROOT, entry.output);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, image);
  } catch (error) {
    await page.screenshot({ path: failurePath(entry.name) }).catch(() => undefined);
    throw error;
  } finally {
    await page.close();
  }
}

async function main() {
  const config = loadConfig();
  const entries = selectEntries(config);
  await mkdir(path.join(OUTPUT_DIR, 'failures'), { recursive: true });

  const app = await startApp(config);
  const browser = await chromium.launch({ headless: config.headless });
  const results: Result[] = [];
  try {
    console.log(`App: ${app.url}  DHIS2: ${config.dhis2BaseUrl}  Images: ${entries.length}`);
    // One browser context per image size. Pages in a context share the session,
    // and each image gets a fresh page, so app state never leaks between images.
    const contexts = new Map<string, BrowserContext>();
    const contextFor = async (entry: ScreenshotEntry) => {
      const viewport =
        entry.viewport ?? (entry.kind === 'app-hub' ? APP_HUB_VIEWPORT : DOCS_VIEWPORT);
      const key = `${viewport.width}x${viewport.height}`;
      let context = contexts.get(key);
      if (!context) {
        context = await newScreenshotContext(browser, config, viewport);
        contexts.set(key, context);
      }
      return context;
    };
    const target = { appUrl: app.url, config };

    for (const entry of entries) {
      const started = Date.now();
      let lastError: unknown;
      for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
        try {
          await captureEntry(await contextFor(entry), target, entry);
          lastError = undefined;
          break;
        } catch (error) {
          lastError = error;
          console.warn(`  retry ${entry.name} (attempt ${attempt} failed)`);
        }
      }
      const ms = Date.now() - started;
      const error = lastError instanceof Error ? lastError.message.split('\n')[0] : undefined;
      results.push({ name: entry.name, output: entry.output, ok: !lastError, error, ms });
      console.log(`${lastError ? 'FAIL' : 'ok  '} ${entry.name} -> ${entry.output} (${ms} ms)`);
      if (error) {
        console.log(`     ${error}`);
      }
    }
  } finally {
    await browser.close();
    await app.stop();
  }

  await writeFile(path.join(OUTPUT_DIR, 'report.json'), `${JSON.stringify(results, null, 2)}\n`);
  const failed = results.filter((result) => !result.ok);
  console.log(`\n${results.length - failed.length} captured, ${failed.length} failed.`);
  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

await main();
