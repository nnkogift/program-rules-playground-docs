# Program Rules Playground docs

End-user documentation for [Program Rules Playground](https://github.com/nnkogift/program-rules-playground), an open-source DHIS2 app for testing and debugging program rules. Built with [Docusaurus](https://docusaurus.io/) 3.10.

- Canonical site: <https://prp-docs.nnkogift.dev>
- Mirror: <https://nnkogift.github.io/program-rules-playground-docs/>

## Develop

Use the Node version in `.nvmrc` and pnpm.

```bash
pnpm install
pnpm start    # dev server with live reload
pnpm build    # production build; fails on broken links
pnpm lint     # prettier, tsc --noEmit on the config, markdownlint
```

## Build the mirror

The mirror is built from the same source. `DOCS_MIRROR=true` marks every page `noindex`, points canonical links at <https://prp-docs.nnkogift.dev> and omits `sitemap.xml`.

```bash
DOCS_MIRROR=true \
DOCS_URL=https://nnkogift.github.io \
DOCS_BASE_URL=/program-rules-playground-docs/ \
pnpm build
```

`pnpm build:mirror` runs the same command.

## Where it deploys

| Host                  | Trigger        | Workflow                                                   |
| --------------------- | -------------- | ---------------------------------------------------------- |
| GitHub Pages (mirror) | Push to `main` | [`deploy-pages.yml`](.github/workflows/deploy-pages.yml)   |
| prp-docs.nnkogift.dev | Push to `main` | [`deploy-server.yml`](.github/workflows/deploy-server.yml) |

Pull requests and pushes run [`ci.yml`](.github/workflows/ci.yml), which lints and builds both variants.

### One-time setup

- **GitHub Pages:** in the repository settings, set Pages source to **GitHub Actions**.
- **Dokploy:** create an application from this repo that builds the `Dockerfile`, and copy its deploy webhook URL into the `DOKPLOY_DEPLOY_WEBHOOK` repository secret.
- **DNS and TLS:** DNS and TLS for `prp-docs.nnkogift.dev` are set up in Dokploy (domain with Let's Encrypt), not in this repo.

### Run the image locally

```bash
docker build -t prp-docs .
docker run --rm -p 8080:80 prp-docs
```

## Contributing

Read [`docs-contributing/STYLE_GUIDE.md`](docs-contributing/STYLE_GUIDE.md) and start from a template in [`docs-contributing/templates/`](docs-contributing/templates). Agent guidance is in [`AGENTS.md`](AGENTS.md).

## License

BSD-3-Clause. See [`LICENSE`](LICENSE).
