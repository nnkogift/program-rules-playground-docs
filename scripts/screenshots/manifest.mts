import type { Viewport } from './actions.mts';
import type { ScenarioKey } from './scenarios.mts';

/**
 * The single list of screenshots. Each image has a stable name and a stable
 * path, so pages can reference it before or after a refresh.
 *
 * Docs images go to `docs/<folder>/img/<name>.png`, next to the pages that use
 * them. App Hub images go to `static/app-hub/<name>.png`.
 */

export type ScreenshotKind = 'docs' | 'app-hub';

export type ScreenshotEntry = {
  /** Stable file name without extension. Never rename one that a page uses. */
  name: string;
  kind: ScreenshotKind;
  /** Output path relative to the repository root. */
  output: string;
  scenario: ScenarioKey;
  /** `element` captures what the scenario returns; `viewport` always captures the viewport. */
  capture: 'element' | 'viewport';
  /** What the image shows, used as a starting point for alt text. */
  description: string;
  /** Pages expected to use the image, relative to the repository root. */
  usedBy: string[];
  /** Overrides the default size (1440 x 900 for docs, 1280 x 800 for the App Hub). */
  viewport?: Viewport;
};

type DocsEntryInput = Omit<ScreenshotEntry, 'kind' | 'output' | 'capture' | 'usedBy'> & {
  folder: string;
  pages: string[];
  capture?: ScreenshotEntry['capture'];
};

function docs({ folder, pages, capture = 'element', ...entry }: DocsEntryInput): ScreenshotEntry {
  return {
    ...entry,
    kind: 'docs',
    capture,
    output: `docs/${folder}/img/${entry.name}.png`,
    usedBy: pages.map((page) => `docs/${folder}/${page}`),
  };
}

function appHub(
  name: string,
  scenario: ScenarioKey,
  description: string,
  viewport?: Viewport
): ScreenshotEntry {
  return {
    viewport,
    name,
    kind: 'app-hub',
    scenario,
    capture: 'viewport',
    description,
    output: `static/app-hub/${name}.png`,
    usedBy: ['DHIS2 App Hub listing'],
  };
}

/**
 * Tracker forms need more width: the enrollment rail, the form, the sidebar and
 * the Rules panel do not fit side by side at 1440 px, and the form scrolls.
 */
const WIDE: Viewport = { width: 1680, height: 900 };

const USING = 'using-the-app';
const GETTING_STARTED = 'getting-started';

export const manifest: ScreenshotEntry[] = [
  docs({
    name: 'program-list',
    folder: USING,
    pages: ['find-and-open-a-program.md'],
    scenario: 'programList',
    capture: 'viewport',
    description:
      'Program list filtered by the search term "PRT", showing one event and one tracker program.',
  }),
  docs({
    name: 'context-bar',
    folder: USING,
    pages: ['set-the-org-unit-and-date.md', 'start-over.md'],
    scenario: 'contextBar',
    description:
      'Context bar with the back link, program name, organisation unit, event date and Reset playground.',
  }),
  docs({
    name: 'org-unit-selector',
    folder: USING,
    pages: ['set-the-org-unit-and-date.md'],
    scenario: 'orgUnitSelector',
    description:
      'Select organisation unit dialog with a search term and a matching organisation unit selected.',
  }),
  docs({
    name: 'event-form-badges',
    folder: USING,
    pages: ['read-field-badges-and-hidden-field-placeholders.md'],
    scenario: 'eventFormBadges',
    capture: 'viewport',
    description:
      'Event form with Hidden, Warning, Assigned and Required by rule badges and a hidden-field placeholder.',
  }),
  docs({
    name: 'feedback-and-indicators',
    folder: USING,
    pages: ['read-the-feedback-and-indicators-sidebar.md'],
    scenario: 'feedbackIndicators',
    description:
      'Feedback and Indicators sidebar, each with one item and the rule that produced it.',
  }),
  docs({
    name: 'rules-tab',
    folder: USING,
    pages: ['find-out-why-a-rule-did-or-didnt-fire.md'],
    scenario: 'rulesTab',
    description: 'Rules panel on the Rules tab, with firing rules sorted to the top.',
  }),
  docs({
    name: 'trace-tab',
    folder: USING,
    pages: ['find-out-why-a-rule-did-or-didnt-fire.md'],
    scenario: 'traceTab',
    description: 'Rules panel on the Trace tab, listing rule evaluations.',
  }),
  docs({
    name: 'graph-tab',
    folder: USING,
    pages: ['map-rule-dependencies.md'],
    scenario: 'graphTab',
    description: 'Rules panel on the Graph tab, with the full-screen button.',
  }),
  docs({
    name: 'graph-full-screen',
    folder: USING,
    pages: ['map-rule-dependencies.md'],
    scenario: 'graphFullscreen',
    description: 'Rule dependency graph opened in full screen.',
  }),
  docs({
    name: 'rule-details',
    folder: USING,
    pages: ['open-and-edit-a-rule.md'],
    scenario: 'ruleDetails',
    description: 'Program rule details dialog for an ASSIGN rule.',
  }),
  docs({
    name: 'validate-form',
    folder: USING,
    pages: ['validate-a-form.md'],
    scenario: 'validateForm',
    capture: 'viewport',
    // Tall enough to show the field errors and the notice together.
    viewport: { width: 1680, height: 1250 },
    description:
      'Tracker enrollment form after Validate form: the Form has issues notice lists the empty mandatory First name and an Age that breaks its value type.',
  }),
  docs({
    name: 'verify-with-server',
    folder: USING,
    pages: ['check-rules-against-the-server.md'],
    scenario: 'verifyWithServer',
    capture: 'viewport',
    description:
      'Server check passed notice after Verify with server, for an event whose values break no rule.',
  }),
  docs({
    name: 'server-effects-summary',
    folder: USING,
    pages: ['preview-server-effects.md'],
    scenario: 'serverEffectsSummary',
    description: 'Server effects dialog with a notification row and its provenance tag.',
  }),
  docs({
    name: 'completion-banner',
    folder: USING,
    pages: ['test-on-complete-rules.md'],
    scenario: 'completionBanner',
    capture: 'viewport',
    description: 'Cannot complete this event yet banner raised by an on-complete error rule.',
  }),
  docs({
    name: 'tracker-repeatable-stage',
    folder: USING,
    pages: ['work-with-repeatable-stages.md'],
    scenario: 'trackerRepeatableStage',
    capture: 'viewport',
    viewport: WIDE,
    description:
      'Tracker program with the enrollment rail, a repeatable stage holding two events, and the second event open.',
  }),
  docs({
    name: 'tracker-cross-form-rule',
    folder: GETTING_STARTED,
    pages: ['tutorial-tracker-rules-across-enrollment-and-events.md'],
    scenario: 'trackerCrossForm',
    capture: 'viewport',
    viewport: WIDE,
    description: 'Stage form warning driven by an attribute entered in the enrollment form.',
  }),

  appHub(
    '01-event-form',
    'eventFormBadges',
    'Event form with rule effect badges, sidebar and rules panel.'
  ),
  // Same 16:10 ratio as the other App Hub images, wide enough for the tracker layout.
  appHub(
    '02-tracker-enrollment',
    'trackerRepeatableStage',
    'Tracker enrollment with a repeatable stage.',
    { width: 1680, height: 1050 }
  ),
  appHub('03-rule-graph', 'graphFullscreen', 'Rule dependency graph in full screen.'),
  appHub(
    '04-server-effects',
    'serverEffectsSummary',
    'Server effects compared with the server dry run.'
  ),
  appHub(
    '05-program-list',
    'programList',
    'Program list searched for "PRT", with the type filter.'
  ),
];
