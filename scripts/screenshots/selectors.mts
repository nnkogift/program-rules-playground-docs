import type { Locator, Page } from 'playwright';

/**
 * Every locator the pipeline uses lives here, so a renamed label or a new
 * data-test attribute in the app is a one-line change.
 *
 * Order of preference: `data-test` (devtools and @dhis2/ui), then roles and
 * accessible names, then visible text. Labels that the app is about to rename
 * accept both the old and the new wording.
 */

const testId = (page: Page | Locator, id: string) => page.locator(`[data-test="${id}"]`);

/** Matches a whole accessible name, case sensitive. */
const exactly = (...names: string[]) =>
  new RegExp(`^(${names.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})$`);

export const LABELS = {
  previewServerEffects: exactly('Preview server effects', 'Trigger server rules'),
  previewOnCompleteEffects: exactly('Preview on-complete effects', 'Trigger on-complete rules'),
  validateForm: exactly('Validate form'),
  verifyWithServer: exactly('Verify with server'),
  resetPlayground: exactly('Reset playground'),
  addEvent: exactly('Add event'),
  enrollmentRail: exactly('Enrollment'),
  rulesPanel: exactly('Rules'),
};

export const appShell = {
  serverInput: (page: Page) => page.locator('input[name="server"]'),
  usernameInput: (page: Page) => page.locator('input[name="j_username"]'),
  passwordInput: (page: Page) => page.locator('input[name="j_password"]'),
  submit: (page: Page) => testId(page, 'dhis2-adapter-loginsubmit'),
  headerBar: (page: Page) => testId(page, 'headerbar-title'),
  headerLogo: (page: Page) => testId(page, 'headerbar-logo').locator('svg, img').first(),
};

/** Hidden in every image: they change with server activity, not with the app. */
export const VOLATILE_CSS = `
  [data-test="headerbar-interpretations-count"],
  [data-test="headerbar-messages-count"] { visibility: hidden !important; }
`;

/** Open @dhis2/ui tooltips, which must be gone before a capture. */
export const hiddenTooltips = (page: Page) => testId(page, 'dhis2-uicore-tooltip-content');

export const programList = {
  heading: (page: Page) => page.getByRole('heading', { name: 'Programs', exact: true }),
  // Wish: data-test="program-list-row"
  rows: (page: Page) => page.locator('tbody tr').filter({ has: page.getByRole('button') }),
};

export const playground = {
  // Wish: data-test="program-context-bar"
  contextBar: (page: Page) =>
    page
      .locator('div')
      .filter({ has: page.getByRole('link', { name: 'Programs' }) })
      .filter({ has: page.getByRole('button', { name: LABELS.resetPlayground }) })
      .last(),
  orgUnitSelectButton: (page: Page) =>
    playground.contextBar(page).getByRole('button', { name: /^(Select|Change)$/ }),
  orgUnitModal: (page: Page) =>
    testId(page, 'dhis2-uicore-modal').filter({ hasText: 'Select organisation unit' }),
  orgUnitTreeLabel: (page: Page, name: string) =>
    playground.orgUnitModal(page).getByText(name, { exact: true }),
  orgUnitConfirm: (page: Page, name: string) =>
    playground.orgUnitModal(page).getByRole('button', { name: `Select ${name}` }),
  orgUnitValue: (page: Page) =>
    playground.contextBar(page).getByPlaceholder('Select organisation unit'),

  /** The visible form. Tracker programs keep every form mounted and hide the others. */
  visibleForm: (page: Page) => page.locator('form:visible'),
  field: (scope: Page | Locator, fieldId: string) => scope.locator(`[data-field-id="${fieldId}"]`),

  // Wish: data-test="rule-output-column"
  ruleOutputColumn: (page: Page) =>
    page
      .locator('div')
      .filter({ has: page.getByRole('heading', { name: 'Feedback', exact: true }) })
      .filter({ has: page.getByRole('heading', { name: 'Indicators', exact: true }) })
      .filter({ visible: true })
      .last(),
  ruleOutputCard: (page: Page, title: 'Feedback' | 'Indicators') =>
    page
      .locator('section:visible')
      .filter({ has: page.getByRole('heading', { name: title, exact: true }) }),

  formButton: (page: Page, name: RegExp) =>
    playground.visibleForm(page).getByRole('button', { name }),
  completionBanner: (page: Page) => testId(page, 'completion-banner').filter({ visible: true }),
  // Wish: data-test="validation-notice"
  validationNotice: (page: Page) =>
    playground
      .visibleForm(page)
      .getByRole('alert')
      .or(playground.visibleForm(page).getByRole('status')),
  // Wish: data-test="server-check-status"
  serverCheckStatus: (page: Page) =>
    playground
      .visibleForm(page)
      .locator('[role="alert"], [role="status"]')
      .filter({ hasText: /Server check|Could not verify/ }),
  // Wish: data-test="form-actions"
  formActions: (page: Page) =>
    playground.visibleForm(page).locator('[data-test="dhis2-uicore-buttonstrip"]').last(),

  enrollmentRail: (page: Page) => page.getByRole('navigation', { name: LABELS.enrollmentRail }),
  railRow: (page: Page, label: string | RegExp) =>
    playground
      .enrollmentRail(page)
      .getByRole('button')
      .filter({ hasText: label })
      .filter({ hasNot: page.getByRole('button', { name: LABELS.addEvent }) })
      .last(),
  // Wish: data-test="rail-add-event-<stageId>"
  addEventButton: (page: Page, stageName: string) =>
    playground
      .enrollmentRail(page)
      .getByRole('button')
      .filter({ hasText: stageName })
      .getByRole('button', { name: LABELS.addEvent }),
};

export const devtools = {
  panel: (page: Page) =>
    page.getByRole('complementary', { name: LABELS.rulesPanel }).filter({ visible: true }),
  tab: (page: Page, key: 'rules' | 'trace' | 'graph') =>
    testId(devtools.panel(page), `devtools-tab-${key}`),
  ruleCard: (page: Page, ruleName?: string) => {
    const cards = testId(devtools.panel(page), 'devtools-rule-card');
    return ruleName ? cards.filter({ hasText: ruleName }) : cards;
  },
  ruleStatus: (card: Locator) => testId(card, 'devtools-rule-status'),
  ruleDetailsButton: (card: Locator) => testId(card, 'devtools-rule-details-button'),
  ruleDetailsModal: (page: Page) => testId(page, 'devtools-rule-details-modal'),
  loader: (scope: Locator) => testId(scope, 'dhis2-uicore-circularloader'),
  graphFullscreenButton: (page: Page) => testId(devtools.panel(page), 'devtools-graph-fullscreen'),
  scopeFilter: (page: Page) => testId(devtools.panel(page), 'devtools-scope-filter'),
  serverEffectsModal: (page: Page) =>
    testId(page, 'dhis2-uicore-modal').filter({
      has: page.getByText('Server effects', { exact: true }),
    }),
  serverEffectsSection: (page: Page) => testId(page, 'devtools-server-effects-section'),
  serverEffectRow: (page: Page) => testId(page, 'devtools-server-effect-row'),
  serverValidationRow: (page: Page) => testId(page, 'devtools-server-validation-row'),
  /** Any modal from @dhis2/ui, used for the full-screen graph. */
  anyModal: (page: Page) => testId(page, 'dhis2-uicore-modal'),
};
