# AGENTS.md

Guidance for AI coding agents working in this repository. `CLAUDE.md` imports this file, so keep this as the single source of truth.

## What this is

The end-user documentation site for [Program Rules Playground](https://github.com/nnkogift/program-rules-playground), an open-source DHIS2 app for testing and debugging program rules. Built with Docusaurus 3.10 (classic preset, TypeScript config, pnpm). English only, no versioning until the app reaches 1.0.0, blog disabled.

## Commands

```bash
pnpm install
pnpm start         # dev server
pnpm build         # canonical build (fails on broken links)
pnpm build:mirror  # GitHub Pages mirror build
pnpm lint          # prettier --check, tsc --noEmit, markdownlint
pnpm format        # prettier --write
```

## Two hosts, one source

- Canonical: `https://prp-docs.nnkogift.dev` (base URL `/`), served by the nginx image from `Dockerfile` via Dokploy.
- Mirror: GitHub Pages at `https://nnkogift.github.io/program-rules-playground-docs/`.
- `DOCS_URL` and `DOCS_BASE_URL` set `url` and `baseUrl`. `DOCS_MIRROR=true` marks the build `noIndex`, drops `sitemap.xml` and points every canonical link at the canonical host (`src/theme/SiteMetadata`).
- `trailingSlash` is `false`. `nginx.conf` depends on it, so change both together.

## Writing docs

- Read `docs-contributing/STYLE_GUIDE.md` first and start from a template in `docs-contributing/templates/`.
- Second person, present tense, no em dashes (use commas), UI labels in **bold** exactly as shown in the app, "organisation unit" and "enrollment".
- Do not invent app behaviour. If a fact is not in the app repo or the Linear plan, write `TODO(verify)`.
- Link pages with relative file paths so broken links fail the build.
- Docs are served at the site root (`routeBasePath: '/'`); the intro page has `slug: /`.

## Conventions

- Conventional commits (`feat:`, `fix:`, `docs:`, `chore:`). Branches: `feature/`, `fix/`, `docs/`, `chore/`.
- Prettier formats code and config. Markdown in `docs/` is checked by markdownlint, not reformatted.
- No secrets in the repo. The Dokploy webhook lives in the `DOKPLOY_DEPLOY_WEBHOOK` secret.
