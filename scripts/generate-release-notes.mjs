#!/usr/bin/env node
// Generates docs/help/release-notes.md from the app's Changesets CHANGELOG.md.
//
// Usage:
//   node scripts/generate-release-notes.mjs                  # fetch from GitHub (alpha branch)
//   node scripts/generate-release-notes.mjs --from <path>    # read a local CHANGELOG.md
//   node scripts/generate-release-notes.mjs --from <url>     # fetch another raw URL
//   node scripts/generate-release-notes.mjs --out <path>     # write another page
//
// Only the text between the generated markers in the page is replaced.

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_SOURCE =
  'https://raw.githubusercontent.com/nnkogift/program-rules-playground/alpha/CHANGELOG.md';
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_OUT = path.join(REPO_ROOT, 'docs/help/release-notes.md');
const START_MARKER = '<!-- generated:start -->';
const END_MARKER = '<!-- generated:end -->';

// Changesets section headings, mapped to user-facing headings.
const SECTION_TITLES = {
  'major changes': 'Breaking changes',
  'minor changes': 'New features and changes',
  'patch changes': 'Fixes and improvements',
};

// Notes with these conventional-commit prefixes are for maintainers, not users.
const INTERNAL_PREFIXES = ['docs', 'chore', 'ci', 'test', 'build'];

function parseArgs(argv) {
  const args = { from: DEFAULT_SOURCE, out: DEFAULT_OUT };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--from' || arg === '--out') {
      const value = argv[i + 1];
      if (!value) throw new Error(`${arg} needs a value`);
      args[arg.slice(2)] = value;
      i += 1;
    } else if (arg === '--help' || arg === '-h') {
      console.log('Usage: generate-release-notes.mjs [--from <path|url>] [--out <path>]');
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

async function readSource(source) {
  if (/^https?:\/\//.test(source)) {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(`Could not fetch ${source}: HTTP ${response.status}`);
    }
    return response.text();
  }
  return readFile(source, 'utf8');
}

// Splits "## <version>" blocks into { version, sections: [{ title, entries }] }.
function parseChangelog(text) {
  const releases = [];
  let release = null;
  let section = null;
  let entry = null;

  const pushEntry = () => {
    if (entry && section) section.entries.push(entry);
    entry = null;
  };

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/\s+$/, '');
    const versionMatch = /^## (.+)$/.exec(line);
    const sectionMatch = /^### (.+)$/.exec(line);
    const entryMatch = /^- (.*)$/.exec(line);

    if (versionMatch) {
      pushEntry();
      release = { version: versionMatch[1].trim(), sections: [] };
      section = null;
      releases.push(release);
    } else if (sectionMatch && release) {
      pushEntry();
      section = { title: sectionMatch[1].trim(), entries: [] };
      release.sections.push(section);
    } else if (entryMatch && section) {
      pushEntry();
      entry = [entryMatch[1]];
    } else if (entry && line.trim() !== '') {
      entry.push(line);
    } else if (line.trim() === '') {
      pushEntry();
    }
  }
  pushEntry();
  return releases;
}

// Removes the commit hash Changesets puts in front of each note, in plain
// ("abc1234: ") or linked ("[`abc1234`](url) ") form, plus PR links and thanks.
function stripHash(text) {
  return text
    .replace(/^\[#\d+\]\([^)]*\)\s*/, '')
    .replace(/^\[`?[0-9a-f]{7,40}`?\]\([^)]*\)\s*/, '')
    .replace(/^`?[0-9a-f]{7,40}`?:\s*/, '')
    .replace(/^Thanks \[@[^\]]+\]\([^)]*\)!\s*-\s*/, '');
}

// A note can be a single line, a paragraph over several lines, or a nested
// list ("- abc1234: - fix: one\n    - fix: two"). Returns flat note strings.
function splitNotes(lines) {
  const [first, ...rest] = lines;
  const head = stripHash(first.trim());
  const nested = [];
  if (head.startsWith('- ')) nested.push([head.slice(2)]);
  else nested.push([head]);

  for (const line of rest) {
    const item = /^\s+- (.*)$/.exec(line);
    if (item) nested.push([item[1]]);
    else nested[nested.length - 1].push(line.trim());
  }
  return nested.map((parts) => parts.join(' ').replace(/\s+/g, ' ').trim()).filter(Boolean);
}

function isInternal(note) {
  const match = /^([a-z]+)(\([^)]*\))?!?:/i.exec(note);
  return Boolean(match && INTERNAL_PREFIXES.includes(match[1].toLowerCase()));
}

// "fix: something" -> "Something". Keeps the note otherwise unchanged.
function tidy(note) {
  const withoutPrefix = note.replace(
    /^(feat|fix|perf|refactor|style|revert)(\([^)]*\))?!?:\s*/i,
    ''
  );
  return withoutPrefix.charAt(0).toUpperCase() + withoutPrefix.slice(1);
}

// Docs pages are MDX: escape characters MDX would parse, outside code spans.
function escapeMdx(text) {
  return text
    .split(/(`[^`]*`)/)
    .map((part, index) =>
      index % 2 === 1 ? part : part.replace(/[{}]/g, '\\$&').replace(/</g, '&lt;')
    )
    .join('');
}

function parseVersion(version) {
  const match = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?/.exec(version);
  if (!match) return null;
  return {
    core: [Number(match[1]), Number(match[2]), Number(match[3])],
    pre: match[4] ? match[4].split('.') : [],
  };
}

// Semver precedence, newest first. Unparseable versions keep their order at the end.
function compareVersionsDesc(a, b) {
  const va = parseVersion(a);
  const vb = parseVersion(b);
  if (!va || !vb) return Number(!va) - Number(!vb);
  for (let i = 0; i < 3; i += 1) {
    if (va.core[i] !== vb.core[i]) return vb.core[i] - va.core[i];
  }
  if (!va.pre.length || !vb.pre.length) return va.pre.length - vb.pre.length;
  for (let i = 0; i < Math.max(va.pre.length, vb.pre.length); i += 1) {
    const pa = va.pre[i];
    const pb = vb.pre[i];
    if (pa === undefined) return 1;
    if (pb === undefined) return -1;
    const na = /^\d+$/.test(pa);
    const nb = /^\d+$/.test(pb);
    if (na && nb && Number(pa) !== Number(pb)) return Number(pb) - Number(pa);
    if (na !== nb) return na ? 1 : -1;
    if (pa !== pb) return pa < pb ? 1 : -1;
  }
  return 0;
}

function render(releases) {
  const sorted = [...releases].sort((a, b) => compareVersionsDesc(a.version, b.version));
  const out = [];
  for (const release of sorted) {
    out.push(`## ${release.version}`, '');
    let wroteSection = false;
    for (const section of release.sections) {
      const notes = section.entries
        .flatMap(splitNotes)
        .filter((note) => !isInternal(note))
        .map((note) => escapeMdx(tidy(note)));
      if (!notes.length) continue;
      const title = SECTION_TITLES[section.title.toLowerCase()] ?? section.title;
      out.push(`### ${title}`, '', ...notes.map((note) => `- ${note}`), '');
      wroteSection = true;
    }
    if (!wroteSection) out.push('No user-facing changes in this release.', '');
  }
  return out.join('\n').trimEnd();
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const changelog = await readSource(args.from);
  const releases = parseChangelog(changelog);
  if (!releases.length) throw new Error(`No releases found in ${args.from}`);

  const page = await readFile(args.out, 'utf8');
  const start = page.indexOf(START_MARKER);
  const end = page.indexOf(END_MARKER);
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`${args.out} needs ${START_MARKER} and ${END_MARKER} markers`);
  }

  const next = `${page.slice(0, start + START_MARKER.length)}\n\n${render(releases)}\n\n${page.slice(end)}`;
  if (next === page) {
    console.log(`${path.relative(REPO_ROOT, args.out)} is up to date`);
    return;
  }
  await writeFile(args.out, next);
  console.log(`Wrote ${releases.length} releases to ${path.relative(REPO_ROOT, args.out)}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
