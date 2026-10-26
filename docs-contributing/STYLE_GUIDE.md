# Style guide

This guide is for people who write or review pages in `docs/`. It is not published on the site.

## Voice

- Write in the second person ("you"), in the present tense. Say "Select **Validate form**", not "The user will select".
- Use short sentences. Put the action first.
- Use commas, not em dashes. Rewrite the sentence if a comma does not work.
- Do not describe app behaviour you have not confirmed in the app or its repository. Leave a `TODO(verify)` instead.

## UI labels

- Write UI labels in **bold**, exactly as the app shows them, including capitalisation: **Verify with server**, **Preview server effects**, **Show hidden fields**.
- Use the current terms from the [glossary](../docs/reference/glossary.md). Do not use the retired names "Trigger server rules", "Registration" for the enrollment form, or "ghost placeholders".
- Write code, URLs, file names and API values in `code` formatting, for example `importMode=VALIDATE`.

## DHIS2 spellings

- "organisation unit" (not "organization unit"). "Org unit" is fine only where the app itself shows it.
- "enrollment" (not "enrolment").
- "program", "program rule" and "program stage" use the US spelling, as DHIS2 does in its UI.

## Admonitions

- `:::note` for version gates, for example "Available on DHIS2 2.43 and later".
- `:::warning` only where real data could be affected. The app saves nothing, so most pages need no warning.
- `:::info Draft` marks a stub page. Remove it when the page is complete.
- `:::tip` sparingly, for shortcuts.

## Pages

- File names are kebab-case. Folders group pages with a `_category_.json`.
- Every page has front matter with `title`, `description` and `sidebar_position`.
- Start each page from a template in [`templates/`](./templates).
- Link to other pages with relative file paths (`../reference/glossary.md`) so broken links fail the build.
- Put screenshots next to the page that uses them, in an `img/` folder. Every image has alt text. Screenshots are captured by script, see [`SCREENSHOTS.md`](./SCREENSHOTS.md).
- Use Mermaid code blocks for flows. Keep each diagram small.
