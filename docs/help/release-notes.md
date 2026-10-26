---
title: 'Release notes'
description: 'Lists what changed in each release of Program Rules Playground, newest first.'
sidebar_position: 3
---

# Release notes

This page lists what changed in each release of the app, newest first. Program Rules Playground is in its alpha channel: versions end in `-alpha.N`, features and labels can still change between releases, and some notes describe behaviour that a later release changed. Older notes keep the names the app used at the time, for example **Trigger server rules**, which is now **Preview server effects**. The downloads and the full history are on the [GitHub releases page](https://github.com/nnkogift/program-rules-playground/releases).

To see which version you have, open the program list and select **About** at the bottom of the page.

<!-- The list below is generated from the app's CHANGELOG.md by `pnpm generate:release-notes`. Do not edit it by hand. -->

<!-- generated:start -->

## 0.1.0-alpha.11

### Fixes and improvements

- Place event form fields inside their program stage sections by bumping `@nnkogift/dhis2-form-utils-*` to `0.1.0-alpha.13`, and call `useMemo` before the early return in `EventFormFields`

## 0.1.0-alpha.10

### New features and changes

- Fields made mandatory by a program rule are now marked with an asterisk in their label.
- Select the organisation unit from a modal tree limited to the program's assigned org units (searchable, with unassigned ancestors shown but not selectable). The same selector is used for org unit fields inside forms. Validate form, Verify with server and Save now require an org unit and flag the selector when it is missing.
- Splits the event form submit into **Save** (posts `ACTIVE`) and **Complete** (posts `COMPLETED` with `completedAt`). The registration form keeps a single action, and `status` is never sent as a data value.
- The registration form now opens the server effects summary (with **Verify with server**) before posting, like the event form. The actions are renamed to **Trigger server rules** (registration and event Save) and **Trigger on-complete rules** (event Complete).
- Registration and event forms have a Validate form button that runs form validation and highlights field issues without posting anything.
- Adds **Verify with server** to the save review dialog. It posts the exact event payload with `importMode=VALIDATE&async=false` (nothing is saved), attributes the server's rule errors and warnings to their rules, flags rules only the server fired as "Server only", and lists other import errors separately.

### Fixes and improvements

- Updates the `@nnkogift/dhis2-form-utils-*` packages to `0.1.0-alpha.12`.
- Fixes saving events and registrations that could not be submitted: numeric and boolean values are now accepted, and `orgUnit` and the date fields (which the form resolver strips) are restored before validation and kept after the post-save reset.
- Redesigns the footer of the server review dialog. Status, import errors and the dry-run note are one compact block beside the actions, the duplicate Cancel is gone (Close does the same), and a failed verification raises an alert instead of a notice box in the footer.
- The review dialog actions no longer wrap onto two lines, and a failed retry keeps the last good server check on screen instead of clearing it.
- Polishes the server review dialog: verification results are announced to screen readers, a status line says when the server check finished (including a clean run), the button becomes **Verify again**, Cancel moves before Verify, and other import errors show their code as a tag without the importer's backticks. Result messages now say server rules were triggered instead of saved.
- Adds a `typecheck` script and CI job, fixes a strict-mode type error for programs without a `code`, and refreshes the agent guidance (`AGENTS.md` is now the single source, imported by `CLAUDE.md`).
- Validate form now reports invalid results too: a focused alert lists the fields with issues (each links to its field) and a failed validation is shown instead of being swallowed. Shared by the registration and event forms.
- Verify with server now sits beside Validate form instead of in the server summary modal. Rule errors from the dry run appear on the fields they target, and anything else shows in a notice. The summary modal is read-only, and its Trigger server rules button, which posted the payload, is removed.

## 0.1.0-alpha.9

### Fixes and improvements

- Fixes issues with rule list not showing any rules in scope for event programs
- Refactors the app to follow the team's coding standards: dedupes magic strings into `as const` objects, enables TypeScript strict mode (fixing the nullability gaps and one real bug it surfaced), validates DHIS2 API responses and form payloads with Zod, reorganizes `src` into `modules/program-list`, `modules/program-playground`, and `shared`, and decomposes `EnrollmentRail`/`ProgramPage` into smaller components. No user-facing behavior changes.

## 0.1.0-alpha.8

### Fixes and improvements

- Adds description to program rule condition in the details modal. Adds links to maintenance apps in the program rules details modal. Improvements on Coordinate and GeoJSON fields

## 0.1.0-alpha.7

### Fixes and improvements

- Move rule feedback and indicators into a persistent sidebar with separate Feedback/Indicators cards, replacing the inline tinted banner

## 0.1.0-alpha.6

### Fixes and improvements

- Fixes and improvements on the rules list filtering and performance improvements

## 0.1.0-alpha.5

### Fixes and improvements

- Code-split routes and program forms with React.lazy

## 0.1.0-alpha.4

### Fixes and improvements

- The rules are now sorted to allow those firing to move on top

## 0.1.0-alpha.3

### Fixes and improvements

- Fix issues with multi value texts throwing errors
- Updates on devtools panel

## 0.1.0-alpha.2

### Fixes and improvements

- Performance fixes
- Move the add-event button inline next to repeatable stage labels

## 0.1.0-alpha.1

### Fixes and improvements

- Fixes issues with missing renderType causing whole form to crash
- Fixes issues with event form displays fields outside of sections

## 0.1.0-alpha.0

### New features and changes

- Initial release

<!-- generated:end -->
