# Screenshots

This guide is for people who add or refresh screenshots. It is not published on the site.

Screenshots are captured by a Playwright script, not by hand, so you can refresh them after every app release. The script runs the app against a DHIS2 instance, drives it into each state and saves the images at stable paths.

## Where images live

- Docs images: `docs/<folder>/img/<name>.png`, next to the pages that use them. For example `docs/using-the-app/img/rules-tab.png`.
- App Hub images: `static/app-hub/<name>.png`, captured at 1280 x 800 (the tracker image at 1680 x 1050, the same ratio).
- Docs images use a 1440 x 900 viewport, a device scale factor of 1 and the light theme. Tracker images use 1680 x 900 (`validate-form` uses 1680 x 1250 to fit the whole form), because the enrollment rail, form, sidebar and Rules panel do not fit side by side at 1440. Some images are cropped to one element, such as the context bar or the Rules panel.

`scripts/screenshots/manifest.mts` is the single list of images. Each entry gives the image name, its output path, the scenario that produces it, a description to start your alt text from and the pages expected to use it. Never rename an image that a page already uses.

## Use an image on a page

Use plain Markdown with a relative path and alt text:

```md
![Rules panel on the Rules tab, with firing rules at the top.](./img/rules-tab.png)
```

The build fails on a broken image path (`onBrokenMarkdownImages: 'throw'`), so reference an image only once it is committed.

## Run the script

You need a checkout of [program-rules-playground](https://github.com/nnkogift/program-rules-playground) with its dependencies installed, and Chromium for Playwright (`pnpm exec playwright install chromium`).

```bash
# .env in the root of this repository (git ignores it)
APP_DIR=../program-rules-playground
DHIS2_USERNAME=...
DHIS2_PASSWORD=...

pnpm screenshots                                   # every image
pnpm screenshots --only=rules-tab,trace-tab        # some images, by manifest name
```

The script starts the app's dev server (`d2-app-scripts start`) with its proxy pointed at `DHIS2_BASE_URL`, signs in through the app shell and writes the images. Failed scenarios leave a screenshot of the page and the dev server log in `scripts/screenshots/.output/` (git ignores it). A failed image is not overwritten.

### Environment variables

| Variable                 | Default                     | Purpose                                                                    |
| ------------------------ | --------------------------- | -------------------------------------------------------------------------- |
| `DHIS2_BASE_URL`         | `https://dhis.rufaa.co.tz`  | DHIS2 instance that holds the PRT programs.                                |
| `DHIS2_USERNAME`         | none, required              | User to sign in with.                                                      |
| `DHIS2_PASSWORD`         | none, required              | Password for that user. Never commit it.                                   |
| `APP_DIR`                | none                        | App checkout. The script starts and stops its dev server.                  |
| `APP_URL`                | none                        | URL of an app dev server that is already running. Wins over `APP_DIR`.     |
| `APP_PORT`               | `3001`                      | Dev server port when the script starts it.                                 |
| `DHIS2_PROXY_PORT`       | `8081`                      | Port of the dev server's DHIS2 proxy.                                      |
| `DHIS2_LOGIN_SERVER_URL` | `http://localhost:8081`     | Value typed in the app shell's **Server** field. Defaults to the proxy.    |
| `SCREENSHOTS_FIXED_TIME` | `2026-03-02T09:00:00Z`      | The browser clock starts here, so default dates are the same on each run. |
| `SCREENSHOTS_ONLY`       | none                        | Comma-separated manifest names, same as `--only=`.                         |
| `SCREENSHOTS_TIMEOUT_MS` | `90000`                     | Timeout for each wait.                                                     |
| `HEADLESS`               | `true`                      | Set to `false` to watch the browser.                                       |

The default instance is the demo at `https://dhis.rufaa.co.tz` (DHIS2 2.43). Ask the maintainer for access to it, and keep the credentials in `.env`, never in a committed file. The scenarios use its two PRT test programs, the event program `xo87zwzLEqc` and the tracker program `XQpDo4JXQra`, and the organisation unit Ngelehun CHC.

## Add a scenario

1. Put the form inputs in `scripts/screenshots/scenarios.json`: program, route, organisation unit, and steps with the field id, label, value and widget. Scenario code reads values from this file, so change values there, not in code.
2. Add a function to `scripts/screenshots/scenarios.mts`. It drives the app into the state and returns the element to capture, or `null` for the whole viewport. Wait for the outcome you expect (a badge, a notice, a rule status), never for a fixed time.
3. Add an entry to `scripts/screenshots/manifest.mts` with a stable name, the folder of the pages that use it and a description.
4. Run `pnpm screenshots --only=<name>` and open the image to check it.

Put every locator in `scripts/screenshots/selectors.mts`. Prefer `data-test` attributes, then roles and accessible names, then visible text. Labels the app renames go there once, as alternatives.

## In CI

`.github/workflows/screenshots.yml` runs every Monday, on manual dispatch and when the app repository sends a `repository_dispatch` event of type `app-released` or `app-compat-changed`. It checks out the app at `client_payload.ref` (or the `alpha` branch), captures every image and opens a pull request when any image changed.

It needs these repository secrets: `DHIS2_USERNAME` and `DHIS2_PASSWORD`. The `DHIS2_BASE_URL` repository variable is optional.
