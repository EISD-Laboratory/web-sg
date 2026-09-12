# e2e — Certificate announcement check (playwright-cli)

Verifies that `/announcement` renders the **exact same data** as
`src/data/certificates/index.ts`, by driving the real UI through
[`@playwright/cli`](https://www.npmjs.com/package/@playwright/cli).

For every NIM in the data file it:

1. fills the NIM into the `CertificateChecker` form on `/`
2. submits it and waits for the `/announcement?nim=…` page
3. asserts the rendered **name**, **NIM**, **division**, **team_name**, the
   **certificate count**, and every certificate **title + link** match the
   data source byte-for-byte

It also checks the edge cases: unknown NIM → “Certificate Not Found”, invalid
NIM in the form → inline error, and `/announcement` with no `nim` param.

## Prerequisites

- Node.js 18+ with dependencies installed (`npm install`)
- Playwright browser binaries installed (`npx playwright-cli install-browser chromium`)

## Run

The check drives a server on `http://localhost:3000` (override with the
`E2E_BASE_URL` env var). Either start one first, or let the runner build and
start it:

```bash
# against a server you already started (e.g. `npm run build && npm start`)
npm run e2e:check

# or auto-build + auto-start + check + shutdown
npm run e2e:check -- --start
```

The runner prints a summary and exits with code `1` when any student or edge
case fails.

## How it works

```
e2e/
├── lib/
│   ├── build-expected.mjs            # transpiles src/data/certificates/index.ts → build/expected.json
│   ├── run.mjs                       # orchestrator: bundle template → playwright-cli run-code → report
│   └── run-drive-check.mjs           # orchestrator for Drive link verification (no local server needed)
├── check-certificates.template.js    # the verify loop (single expression, runs in run-code sandbox)
├── check-drive-links.template.js     # visits every drive_link: accessible? owner name present?
└── build/                            # gitignored generated artifacts
```

The `run-code` sandbox blocks `require()`, so the orchestrator inlines the
expected data (derived from the single source of truth) into the template
before invoking `playwright-cli run-code --filename=…`. Nothing is duplicated
by hand.

## Troubleshooting

- **Exit 1 with no result line** — run-code failed; the tail of its output is
  printed. Usually the dev server re-triggering a rebuild mid-iteration; retry.
- **Browser fails to launch with `libnspr4.so … error while loading shared
  libraries`** — the OS is missing Chromium's system libs. Install them via
  `sudo npx playwright-cli install-deps chromium` (or apt: `libnss3 libnspr4 libasound2`).
- **Port already in use** — the runner targets `http://localhost:3000`; change
  with `E2E_BASE_URL`.

## Drive link verification (ownership + accessibility)

Visits every `drive_link` in `src/data/certificates/index.ts` with Playwright
and checks two things per certificate:

1. **Accessible** — Drive renders instead of `Request access` / `not found` /
   login wall / quota error.
2. **Owner match (strict)** — the student's full name appears in the Drive page
   title / `og:title` / body text (underscores normalized to spaces, `M. Faizul`
   also matches `faizul kamal`). Team folders are checked strictly too, so they
   will normally report `fail-owner` unless the folder page lists the name.

Bot/consent pages (`consent.google.com`, captcha, `unusual traffic`) are reported
as `needs-manual` and do **not** fail the run. Only `fail-access` / `fail-owner`
exit non-zero.

```bash
# all 64 links (~5-10 min, 1.5s delay between hits)
npm run e2e:drive-check

# faster trial: first 2 students only
npm run e2e:drive-check -- --limit=2

# specific NIMs only
npm run e2e:drive-check -- --nim=102022400135,103032300040

# tune delay (ms) to be gentler on Google rate-limiting
E2E_DELAY_MS=2500 npm run e2e:drive-check
```

Output: `e2e/build/drive-check.json` with `{ summary, details[] }` where each
detail is `{ nim, name, title, linkType: file|folder, accessible, ownerMatch,
status: pass|fail-access|fail-owner|needs-manual, titleSeen, note }`.