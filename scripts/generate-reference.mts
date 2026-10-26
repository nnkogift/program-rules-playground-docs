/**
 * Writes the generated tables of the effect badges legend and the provenance tags
 * reference pages, between their `<!-- generated:start -->` and `<!-- generated:end -->`
 * markers.
 *
 * Source: `scripts/data/legend.json`, a dump of `EFFECT_LEGEND` and `PROVENANCE_TAGS`
 * from `@nnkogift/dhis2-form-utils-devtools@0.1.0-alpha.14` (src/constants/legend.ts,
 * src/styles/effectStyles.ts, recovered from the package source maps), plus the field
 * badge labels the app owns (src/modules/program-playground/components/rules/FieldEffectBadge.tsx).
 * The package itself can't be imported in Node: it pulls in `@dhis2/ui`, which needs browser
 * globals and `styled-jsx`. Refresh the JSON when the devtools package is upgraded.
 *
 * Run: pnpm generate:reference
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

type Variant = {
  variant: string;
  label?: string;
  description?: string;
  icon: string;
  tagClassName: string;
  edgeStroke: string;
  actionTypes: string[];
  fieldBadgeLabel: string;
};

type ProvenanceTag = {
  id: string;
  label: string;
  description: string;
  dhis2Tag: string;
};

type Legend = {
  EFFECT_LEGEND: Variant[];
  OTHER_VARIANTS_NOT_IN_LEGEND: Variant[];
  PROVENANCE_TAGS: ProvenanceTag[];
};

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const legend = JSON.parse(readFileSync(join(root, 'scripts/data/legend.json'), 'utf8')) as Legend;

const ICON_NAMES: Record<string, string> = {
  IconLink16: 'Link',
  IconViewOff16: 'Eye, crossed out',
  IconView16: 'Eye',
  IconEdit16: 'Pencil',
  IconStarFilled16: 'Star',
  IconWarningFilled16: 'Warning',
  IconErrorFilled16: 'Error',
  IconMessages16: 'Speech bubbles',
  IconMail16: 'Envelope',
  IconInfo16: 'Info',
};

/** Where each variant shows up when it has no badge on a field. */
const NO_FIELD_BADGE: Record<string, string> = {
  read: 'None. Graph edges only.',
  feedback: 'None. Shown in the **Feedback** or **Indicators** card.',
  message: 'None. Shown in the **Server effects** dialog.',
  default: 'None.',
};

/** What a reader should do about each provenance tag. Every tag must have an entry. */
const PROVENANCE_ADVICE: Record<string, { appearance: string; whatToDo: string }> = {
  simulated: {
    appearance: 'Blue tag',
    whatToDo:
      'Run **Verify with server** to compare. Notification rows always stay **Simulated**, because the dry run does not report notifications.',
  },
  'server-verified': {
    appearance: 'Green tag',
    whatToDo: 'Nothing. The playground and the server agree.',
  },
  'server-only': {
    appearance: 'Red tag',
    whatToDo:
      'Find out why the playground did not produce it: check the rule condition and the values in the form. See [Why client and server results differ](../concepts/why-client-and-server-results-differ.md).',
  },
  'not-executed': {
    appearance:
      'No tag. The row is dashed and dimmed, with the note "Not executed by this server" or "Not executed by this server (requires 2.43)".',
    whatToDo:
      'Treat the row as reference only. The server you are connected to will not run this action.',
  },
};

const TAG_APPEARANCE_CHECK: Record<string, string> = {
  neutral: 'simulated',
  positive: 'server-verified',
  negative: 'server-only',
};

function cell(text: string): string {
  return text.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function colourName(tagClassName: string): string {
  const match = /bg-dhis2-([a-z]+)-\d+/.exec(tagClassName);
  if (!match) {
    throw new Error(`Unknown tag colour: ${tagClassName}`);
  }
  return match[1][0].toUpperCase() + match[1].slice(1);
}

function swatch(hex: string): string {
  return `<span aria-hidden="true" style={{display: 'inline-block', width: '0.9em', height: '0.9em', borderRadius: '2px', verticalAlign: 'middle', background: '${hex}'}}></span> \`${hex}\``;
}

/** Action types that show no field badge, although their variant has one. */
const NO_BADGE_TYPES = new Set(['HIDESECTION', 'HIDEPROGRAMSTAGE']);

/**
 * Action types whose field badge is "On complete: " plus the lowercased variant badge
 * label (FieldEffectBadge.tsx, `onComplete`).
 */
const ON_COMPLETE_TYPES = new Set(['WARNINGONCOMPLETE', 'ERRORONCOMPLETE']);

function fieldBadge(variant: Variant): string {
  if (variant.variant in NO_FIELD_BADGE) {
    return NO_FIELD_BADGE[variant.variant];
  }
  const parts = [`**${variant.fieldBadgeLabel}**`];
  const noBadge = variant.actionTypes.filter((type) => NO_BADGE_TYPES.has(type));
  if (noBadge.length) {
    parts.push(`${noBadge.map((type) => `\`${type}\``).join(' and ')}: none.`);
  }
  for (const type of variant.actionTypes.filter((t) => ON_COMPLETE_TYPES.has(t))) {
    parts.push(`\`${type}\`: **On complete: ${variant.fieldBadgeLabel.toLowerCase()}**.`);
  }
  if (parts.length > 1) {
    const typed = new Set([...NO_BADGE_TYPES, ...ON_COMPLETE_TYPES]);
    const plain = variant.actionTypes.filter((type) => !typed.has(type));
    parts[0] = `${plain.map((type) => `\`${type}\``).join(', ')}: ${parts[0]}.`;
  }
  return parts.join(' ');
}

function icon(name: string): string {
  const label = ICON_NAMES[name];
  if (!label) {
    throw new Error(`Add a name for icon ${name} to ICON_NAMES.`);
  }
  return label;
}

/** Action types as code; the legend's free-text entries become plain sentences. */
function actionTypes(variant: Variant): string {
  if (variant.variant === 'read') {
    return 'None. The condition reads the field.';
  }
  return variant.actionTypes
    .map((type) => (/^[A-Z]+$/.test(type) ? `\`${type}\`` : 'Any other action type'))
    .join(', ');
}

function variantRow(variant: Variant, inLegend: boolean): string {
  const cells = [
    inLegend ? `**${variant.label}**` : `\`${variant.variant}\``,
    fieldBadge(variant),
    actionTypes(variant),
    icon(variant.icon),
    colourName(variant.tagClassName),
    swatch(variant.edgeStroke),
  ];
  if (inLegend) {
    cells.push(cell(variant.description ?? ''));
  }
  return `| ${cells.join(' | ')} |`;
}

function effectTables(): string {
  const header = [
    '| Graph legend | Field badge | Action types | Icon | Badge colour | Graph edge | Meaning |',
    '| --- | --- | --- | --- | --- | --- | --- |',
  ];
  const others = [
    '| Variant | Field badge | Action types | Icon | Badge colour | Graph edge |',
    '| --- | --- | --- | --- | --- | --- |',
  ];
  return [
    '### In the graph legend',
    '',
    ...header,
    ...legend.EFFECT_LEGEND.map((variant) => variantRow(variant, true)),
    '',
    '### Not in the graph legend',
    '',
    'These variants have an icon and colours, but no entry in the legend.',
    '',
    ...others,
    ...legend.OTHER_VARIANTS_NOT_IN_LEGEND.map((variant) => variantRow(variant, false)),
  ].join('\n');
}

function provenanceTable(): string {
  const rows = legend.PROVENANCE_TAGS.map((tag) => {
    const advice = PROVENANCE_ADVICE[tag.id];
    if (!advice) {
      throw new Error(`Add advice for provenance tag "${tag.id}" to PROVENANCE_ADVICE.`);
    }
    const expectedId = TAG_APPEARANCE_CHECK[tag.dhis2Tag];
    if (expectedId && expectedId !== tag.id) {
      throw new Error(`Provenance tag "${tag.id}" changed colour (${tag.dhis2Tag}).`);
    }
    return `| **${tag.label}** | ${cell(advice.appearance)} | ${cell(tag.description)} | ${cell(advice.whatToDo)} |`;
  });
  return [
    '| Tag | How it looks | What it means | What to do |',
    '| --- | --- | --- | --- |',
    ...rows,
  ].join('\n');
}

const START = '<!-- generated:start -->';
const END = '<!-- generated:end -->';
const NOTICE =
  '<!-- Generated by scripts/generate-reference.mts from scripts/data/legend.json. Run pnpm generate:reference, do not edit by hand. -->';

function writeBetweenMarkers(relativePath: string, content: string): void {
  const path = join(root, relativePath);
  const page = readFileSync(path, 'utf8');
  const start = page.indexOf(START);
  const end = page.indexOf(END);
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`${relativePath} needs ${START} and ${END} markers.`);
  }
  const next = `${page.slice(0, start + START.length)}\n\n${NOTICE}\n\n${content}\n\n${page.slice(end)}`;
  if (next !== page) {
    writeFileSync(path, next);
    console.log(`Updated ${relativePath}`);
  } else {
    console.log(`${relativePath} is up to date`);
  }
}

writeBetweenMarkers('docs/reference/effect-badges-legend.md', effectTables());
writeBetweenMarkers('docs/reference/provenance-tags.md', provenanceTable());
