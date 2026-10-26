import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { Page } from 'playwright';
import { REPO_ROOT } from './config.mts';
import { playground } from './selectors.mts';

/**
 * Typed access to scenarios.json, which holds the concrete form inputs for the
 * PRT programs (program ids, org units, field ids and values). Edit values
 * there, not in the scenario code.
 */

export type ScenarioStep = {
  fieldId?: string;
  label: string;
  value?: string;
  widget?: string;
  action?: string;
  pre_rename?: boolean;
};

export type ScenarioData = {
  id: string;
  programId: string;
  route: string;
  orgUnit: { id: string; name: string; path: string };
  steps: ScenarioStep[];
  expectedEffect: string[];
};

type ScenarioFile = { scenarios: ScenarioData[] };

const SCENARIO_FILE = path.join(REPO_ROOT, 'scripts/screenshots/scenarios.json');

let cache: ScenarioFile | undefined;

function readScenarioFile(): ScenarioFile {
  cache ??= JSON.parse(readFileSync(SCENARIO_FILE, 'utf8')) as ScenarioFile;
  return cache;
}

export function getScenario(id: string): ScenarioData {
  const scenario = readScenarioFile().scenarios.find((entry) => entry.id === id);
  if (!scenario) {
    throw new Error(`Scenario "${id}" is missing from scripts/screenshots/scenarios.json`);
  }
  return scenario;
}

/** Field steps only, keyed for overrides such as a different number for a variant. */
export function fieldSteps(id: string): ScenarioStep[] {
  return getScenario(id).steps.filter((step) => step.fieldId);
}

const ADD_EVENT_STEP = /^Add event \(\+ on (.+) row\)$/;

/**
 * Applies a scenario's steps in order: fills fields, clicks rail rows and adds
 * repeatable-stage events. Button clicks on the form (save, complete, verify)
 * are left to the scenario code so it can wait for the right outcome.
 */
export async function applySteps(page: Page, steps: ScenarioStep[]): Promise<void> {
  for (const step of steps) {
    if (step.fieldId) {
      await fillField(page, step);
      continue;
    }
    const addEvent = ADD_EVENT_STEP.exec(step.label);
    if (addEvent) {
      const rows = playground.enrollmentRail(page).locator('[role="button"]');
      const before = await rows.count();
      await playground.addEventButton(page, addEvent[1]).click();
      await rows.nth(before).waitFor();
      continue;
    }
    if (step.action === 'click rail row') {
      await playground.railRow(page, step.label).click();
      await playground.visibleForm(page).first().waitFor();
    }
  }
}

export async function fillField(page: Page, step: ScenarioStep): Promise<void> {
  const field = playground.field(playground.visibleForm(page), step.fieldId ?? '');
  await field.waitFor();
  const value = step.value ?? '';
  if (step.widget?.startsWith('radio')) {
    // The app points the first radio's aria-labelledby at the field label, so
    // pick the option by its visible text rather than its accessible name.
    const option = field
      .locator('label[data-test="dhis2-uicore-radio"]')
      .filter({ hasText: new RegExp(`^\\s*${value}\\s*$`) });
    await option.click();
    await option.locator('input').first().waitFor({ state: 'attached' });
    return;
  }
  const input = field.locator('input, textarea').first();
  await input.fill(value);
  // Validation runs on blur; rules run on change.
  await input.press('Tab');
}

export function withValue(steps: ScenarioStep[], fieldId: string, value: string): ScenarioStep[] {
  return steps.map((step) => (step.fieldId === fieldId ? { ...step, value } : step));
}
