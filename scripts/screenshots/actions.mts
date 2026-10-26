import path from 'node:path';
import type { Browser, BrowserContext, Locator, Page } from 'playwright';
import { REPO_ROOT, type ScreenshotConfig } from './config.mts';
import type { ScenarioData } from './scenario-data.mts';
import { appShell, devtools, playground, programList } from './selectors.mts';

export function failurePath(name: string): string {
  return path.join(REPO_ROOT, 'scripts/screenshots/.output/failures', `${name}.png`);
}

export type Viewport = { width: number; height: number };

export const DOCS_VIEWPORT: Viewport = { width: 1440, height: 900 };
export const APP_HUB_VIEWPORT: Viewport = { width: 1280, height: 800 };

/**
 * Signs in through the app shell when the page shows its login form. The dev
 * shell also asks for the server URL; the production shell does not.
 */
export async function signInIfNeeded(page: Page, config: ScreenshotConfig, ready: Locator) {
  await appShell.usernameInput(page).or(ready).first().waitFor({ timeout: config.timeoutMs });
  if (!(await appShell.usernameInput(page).isVisible())) {
    return;
  }
  if (await appShell.serverInput(page).isVisible()) {
    await appShell.serverInput(page).fill(config.loginServerUrl);
  }
  await appShell.usernameInput(page).fill(config.username);
  await appShell.passwordInput(page).fill(config.password);
  await appShell.submit(page).click();
  try {
    await ready.waitFor({ timeout: config.timeoutMs });
  } catch (error) {
    await page.screenshot({ path: failurePath('sign-in') }).catch(() => undefined);
    throw error;
  }
}

export async function newScreenshotContext(
  browser: Browser,
  config: ScreenshotConfig,
  viewport: Viewport
): Promise<BrowserContext> {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    colorScheme: 'light',
    locale: 'en-GB',
    timezoneId: 'UTC',
    reducedMotion: 'reduce',
  });
  // Starts the clock at a fixed instant (it then runs normally), so default
  // dates such as the event date are the same on every run.
  await context.clock.install({ time: new Date(config.fixedTime) });
  context.setDefaultTimeout(config.timeoutMs);
  return context;
}

export type AppTarget = { page: Page; appUrl: string; config: ScreenshotConfig };

/** Opens a route of the app, signing in first if the session has gone. */
export async function gotoApp({ page, appUrl, config }: AppTarget, route: string, ready: Locator) {
  try {
    await page.goto(`${appUrl}${route}`, { waitUntil: 'commit' });
  } catch (error) {
    // The app shell can replace the document while it boots; the wait below covers it.
    if (!String(error).includes('ERR_ABORTED')) {
      throw error;
    }
  }
  await signInIfNeeded(page, config, ready);
  await ready.waitFor();
}

export async function openProgramList(target: AppTarget, query: string) {
  await gotoApp(target, `#/?${query}`, programList.heading(target.page));
  await programList.rows(target.page).first().waitFor();
}

/** Opens the playground for the scenario's program and waits for the form and rules panel. */
export async function openPlayground(target: AppTarget, scenario: ScenarioData) {
  const { page } = target;
  await gotoApp(target, scenario.route, page.locator('[data-field-id]:visible').first());
  await devtools.ruleCard(page).first().waitFor();
}

export async function selectOrgUnit(page: Page, orgUnitName: string) {
  await playground.orgUnitSelectButton(page).click();
  const modal = playground.orgUnitModal(page);
  await modal.waitFor();
  await modal.getByPlaceholder('Search program organisation units').fill(orgUnitName);
  await playground.orgUnitTreeLabel(page, orgUnitName).click();
  await playground.orgUnitConfirm(page, orgUnitName).click();
  await modal.waitFor({ state: 'detached' });
  // The button reads "Change" once an organisation unit is set.
  await playground.contextBar(page).getByRole('button', { name: 'Change', exact: true }).waitFor();
}

export async function openOrgUnitModal(page: Page, orgUnitName: string) {
  await playground.orgUnitSelectButton(page).click();
  const modal = playground.orgUnitModal(page);
  await modal.waitFor();
  await modal.getByPlaceholder('Search program organisation units').fill(orgUnitName);
  await playground.orgUnitTreeLabel(page, orgUnitName).click();
  await playground.orgUnitConfirm(page, orgUnitName).waitFor();
  return modal;
}

/** Waits until a field carries a rule badge or text, which means the rule engine has run. */
export async function waitForFieldText(page: Page, fieldId: string, text: string | RegExp) {
  await playground
    .field(playground.visibleForm(page), fieldId)
    .filter({ hasText: text })
    .first()
    .waitFor();
}

/** Scrolls an element to the middle of its scroll container. */
export async function scrollToCenter(page: Page, locator: ReturnType<Page['locator']>) {
  await locator.evaluate((element) => element.scrollIntoView({ block: 'center' }));
}
