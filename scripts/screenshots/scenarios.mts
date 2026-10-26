import type { Locator, Page } from 'playwright';
import {
  type AppTarget,
  openOrgUnitModal,
  openPlayground,
  openProgramList,
  scrollToCenter,
  selectOrgUnit,
  waitForFieldText,
} from './actions.mts';
import { applySteps, fieldSteps, getScenario } from './scenario-data.mts';
import { devtools, LABELS, playground } from './selectors.mts';

/**
 * A scenario drives the app into one state and returns the element to capture,
 * or `null` for the whole viewport. Input values come from scenarios.json.
 */
export type ScenarioContext = AppTarget;
export type Scenario = (context: ScenarioContext) => Promise<Locator | null>;

// Field ids from the PRT programs, used for waits. Values live in scenarios.json.
const EVENT = {
  numberInput: 'whUEYdoURdQ',
  hideTarget: 'sKYuUOftlgO',
  assignedValue: 'rhmbkRxkgFT',
  mandatoryTarget: 'ikV37IrPaOv',
} as const;
const TRACKER = {
  age: 'CMGH8KxOLqD',
  ageAtVisit: 'FwZU55PBRcA',
  weight: 'vbqBp3bGvjY',
} as const;

const ASSIGN_RULE = 'PRT-E07 ASSIGN number x 2 to data element';

async function openEventProgram(context: ScenarioContext, scenarioId: string) {
  const scenario = getScenario(scenarioId);
  await openPlayground(context, scenario);
  await selectOrgUnit(context.page, scenario.orgUnit.name);
  return scenario;
}

/** Hidden field, hidden section, assigned value, warning and a rule-made mandatory field. */
async function fillEventFormWithEffects(context: ScenarioContext) {
  const { page } = context;
  await openEventProgram(context, 'event-hide-field-and-section');
  await applySteps(page, fieldSteps('event-hide-field-and-section'));
  await applySteps(page, fieldSteps('event-warning-error-feedback-mandatory'));
  await waitForFieldText(page, EVENT.hideTarget, 'Hidden');
  await waitForFieldText(page, EVENT.numberInput, 'Warning');
  await waitForFieldText(page, EVENT.mandatoryTarget, 'Required by rule');
  await waitForFieldText(page, EVENT.assignedValue, 'Assigned');
}

/** Feedback and indicator items plus the assign rules, so the rules panel has firing rules. */
async function fillEventFormWithOutputs(context: ScenarioContext) {
  const { page } = context;
  await openEventProgram(context, 'event-assign-and-indicator');
  await applySteps(page, fieldSteps('event-assign-and-indicator'));
  const triggerText = fieldSteps('event-warning-error-feedback-mandatory').filter(
    (step) => step.fieldId !== EVENT.numberInput
  );
  await applySteps(page, triggerText);
  await playground.ruleOutputCard(page, 'Indicators').getByText('Calculated double').waitFor();
  await playground.ruleOutputCard(page, 'Feedback').getByText('Trigger text is:').waitFor();
  await devtools
    .ruleStatus(devtools.ruleCard(page, ASSIGN_RULE))
    .filter({ hasText: 'Firing' })
    .waitFor();
}

/**
 * Waits for the notice the scenario expects and fails on any other form
 * notice, so an image never shows an outcome nobody checked.
 */
async function expectNotice(page: Page, title: string) {
  const notices = playground.visibleForm(page).locator('[role="alert"], [role="status"]');
  await notices.first().waitFor();
  const texts = await notices.allInnerTexts();
  if (!texts.some((text) => text.includes(title))) {
    throw new Error(`Expected the notice "${title}", got: ${texts.join(' | ') || 'none'}`);
  }
}

async function openRulesTab(context: ScenarioContext, tab: 'rules' | 'trace' | 'graph') {
  await fillEventFormWithOutputs(context);
  const { page } = context;
  await devtools.tab(page, tab).click();
  return devtools.panel(page);
}

export const scenarios = {
  async programList(context) {
    // Searching "PRT" lists the PRT event and tracker programs.
    const { page } = context;
    await openProgramList(context, 'search=PRT');
    await page.waitForFunction(
      () => document.querySelectorAll('tbody tr [role="button"]').length === 2
    );
    await page.getByText('XQpDo4JXQra', { exact: true }).waitFor();
    return null;
  },

  async contextBar(context) {
    await openEventProgram(context, 'event-hide-field-and-section');
    return playground.contextBar(context.page);
  },

  async orgUnitSelector(context) {
    const scenario = getScenario('event-hide-field-and-section');
    await openPlayground(context, scenario);
    return openOrgUnitModal(context.page, scenario.orgUnit.name);
  },

  async eventFormBadges(context) {
    await fillEventFormWithEffects(context);
    return null;
  },

  async feedbackIndicators(context) {
    await fillEventFormWithOutputs(context);
    return playground.ruleOutputColumn(context.page);
  },

  async rulesTab(context) {
    return openRulesTab(context, 'rules');
  },

  async traceTab(context) {
    const panel = await openRulesTab(context, 'trace');
    await panel.getByText(ASSIGN_RULE).first().waitFor();
    return panel;
  },

  async graphTab(context) {
    const panel = await openRulesTab(context, 'graph');
    await devtools.graphFullscreenButton(context.page).waitFor();
    await panel.locator('svg').first().waitFor();
    return panel;
  },

  async graphFullscreen(context) {
    const { page } = context;
    await openRulesTab(context, 'graph');
    await devtools.graphFullscreenButton(page).click();
    const modal = devtools.anyModal(page).last();
    await modal.locator('svg').first().waitFor();
    return modal;
  },

  async ruleDetails(context) {
    const { page } = context;
    await fillEventFormWithOutputs(context);
    await devtools.ruleDetailsButton(devtools.ruleCard(page, ASSIGN_RULE)).click();
    const modal = devtools.ruleDetailsModal(page);
    await modal.waitFor();
    await modal.getByText(/Loading/).waitFor({ state: 'detached' });
    await devtools.loader(modal).waitFor({ state: 'detached' });
    return modal;
  },

  async validateForm(context) {
    // Validate form checks the metadata only (mandatory attributes, value
    // types); rule errors and rule-mandatory fields do not count. The PRT event
    // program has no compulsory field and a number input that rejects text, so
    // this uses the tracker enrollment form: First name is mandatory and left
    // empty, and Age gets a negative value.
    const { page } = context;
    const scenario = getScenario('tracker-validate-metadata');
    await openPlayground(context, scenario);
    await selectOrgUnit(page, scenario.orgUnit.name);
    await applySteps(page, scenario.steps);
    await playground.formButton(page, LABELS.validateForm).click();
    await expectNotice(page, 'Form has issues');
    await waitForFieldText(page, TRACKER.age, 'Must be zero or a positive whole number');
    await scrollToCenter(page, playground.formActions(page));
    return null;
  },

  async verifyWithServer(context) {
    // A value that breaks no rule. The dry run on the demo instance returns no
    // rule results for the PRT event program, so "Server check passed" is the
    // expected outcome.
    const { page } = context;
    await openEventProgram(context, 'event-assign-and-indicator');
    await applySteps(page, fieldSteps('event-assign-and-indicator'));
    await waitForFieldText(page, EVENT.assignedValue, 'Assigned');
    await playground.formButton(page, LABELS.verifyWithServer).click();
    await expectNotice(page, 'Server check passed');
    await scrollToCenter(page, playground.formActions(page));
    return null;
  },

  async serverEffectsSummary(context) {
    const { page } = context;
    await openEventProgram(context, 'event-server-effects-notifications');
    await applySteps(page, fieldSteps('event-server-effects-notifications'));
    // Verify first so the summary can compare the simulation with the server.
    await playground.formButton(page, LABELS.verifyWithServer).click();
    await playground.serverCheckStatus(page).waitFor();
    await playground.formButton(page, LABELS.previewServerEffects).click();
    const modal = devtools.serverEffectsModal(page);
    await devtools.serverEffectRow(page).first().waitFor();
    await modal.getByText(/Loading server-side actions/).waitFor({ state: 'detached' });
    return modal;
  },

  async completionBanner(context) {
    const { page } = context;
    await openEventProgram(context, 'event-completion-pass');
    await applySteps(page, fieldSteps('event-completion-pass'));
    await waitForFieldText(page, EVENT.numberInput, /On complete/);
    await playground.formButton(page, LABELS.previewOnCompleteEffects).click();
    const banner = playground.completionBanner(page);
    await banner.waitFor();
    await scrollToCenter(page, banner);
    return null;
  },

  async trackerRepeatableStage(context) {
    const { page } = context;
    const scenario = getScenario('tracker-repeatable-stage');
    await openPlayground(context, scenario);
    await selectOrgUnit(page, scenario.orgUnit.name);
    await applySteps(page, scenario.steps);
    await waitForFieldText(page, TRACKER.weight, /On complete/);
    await playground.ruleOutputCard(page, 'Indicators').getByText('Current weight (kg)').waitFor();
    return null;
  },

  async trackerCrossForm(context) {
    const { page } = context;
    const scenario = getScenario('tracker-cross-form');
    await openPlayground(context, scenario);
    await selectOrgUnit(page, scenario.orgUnit.name);
    await applySteps(page, scenario.steps);
    await waitForFieldText(page, TRACKER.ageAtVisit, 'Warning');
    // The rule reads an enrollment attribute, so it is out of scope for the
    // stage form. "All" shows it next to the stage rules.
    await devtools.scopeFilter(page).getByRole('button', { name: 'All', exact: true }).click();
    await devtools.ruleCard(page).first().waitFor();
    return null;
  },
} satisfies Record<string, Scenario>;

export type ScenarioKey = keyof typeof scenarios;
