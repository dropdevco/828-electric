# 828-electric — Handoff

> Onboarding doc for a fresh AI agent context window. Harness-agnostic.

## 1. Purpose

This is the marketing/brochure website for 828 Electric, a family-owned residential and
commercial electrical contractor in El Paso, TX. It's a single-page React site: hero,
about, services (residential/commercial/specialty), FAQ, and a live Google Reviews
section, with an English/Spanish language toggle. There is no admin panel, database, or
user accounts — the site's job is to present the business and drive phone-call leads. A
small serverless function (`api/reviews.js`) proxies Google Places API calls so the
Places API key never ships to the browser.

## 2. Status

**Active** (recently maintained, production-ready, not a scaffold). Last commit:
`dc15cb6` — "Remove Facebook icon connection and update Instagram link" — dated
2026-08-07 (per `git log -1 --format=%cd`). Current branch: `main`. The commit history
shows real iterative content fixes (phone number updates, image swaps, review wiring),
not placeholder/starter activity. Remote: `https://github.com/idropdev/828-electric.git`.

## 3. Stack

Read directly from `package.json` (exact versions, all caret-ranged except TypeScript):

- **React** `^19.2.7` + **react-dom** `^19.2.7`
- **TypeScript** `~6.0.2` (`tsc -b` for type-checking/build)
- **Vite** `^8.1.0` with `@vitejs/plugin-react` `^6.0.2`
- **Tailwind CSS** `^4.3.1` via `@tailwindcss/vite` `^4.3.1` (no separate `tailwind.config`
  needed with the v4 Vite plugin) + `autoprefixer` `^10.5.2`, `postcss` `^8.5.15`
- **framer-motion** `^12.42.0` — page/section animations
- **lucide-react** `^1.21.0` — icon set
- **oxlint** `^1.69.0` — linter (see `.oxlintrc.json`)
- Type packages: `@types/react` `^19.2.17`, `@types/react-dom` `^19.2.3`,
  `@types/node` `^24.13.2`
- No `engines` field in `package.json`, no `.nvmrc` — required Node version is
  `UNKNOWN — not pinned anywhere in the repo`.

## 4. Setup & Commands

From `package.json` `scripts` (these are the only defined scripts — no test script exists):

```bash
npm install       # install dependencies
npm run dev       # vite — local dev server with HMR + the reviews proxy middleware
npm run build     # tsc -b && vite build — type-check then production build to dist/
npm run lint      # oxlint
npm run preview   # vite preview — serve the built dist/ locally
```

"No test script defined." — there is no test runner, no test files, and no `test` entry
in `package.json`.

For local dev, `.env.local` must define `GOOGLE_PLACES_API_KEY` (and optionally
`GOOGLE_PLACE_ID`) or the `/api/reviews` dev middleware in `vite.config.ts` returns a
500. `.env.local` already exists in this working copy and is gitignored via the `*.local`
pattern in `.gitignore` — never commit it or print its contents.

## 5. Architecture Map

```
828-electric/
├── index.html            Vite HTML entry — mounts #root, loads src/main.tsx
├── vite.config.ts         Vite config: React + Tailwind plugins, plus a custom dev-only
│                           middleware that proxies GET /api/reviews to Google Places API
├── api/
│   └── reviews.js         Vercel serverless function — same Google Places proxy,
│                           used in production (Vercel-style default export handler)
├── src/
│   ├── main.tsx            React root bootstrap (StrictMode + <App />)
│   ├── App.tsx              THE entire application — ~1400 lines: types, bilingual
│   │                        content dictionary, and every page section (hero, about,
│   │                        services, FAQ, reviews, footer/CTA) in one component tree
│   ├── App.css / index.css  Global + Tailwind styles
│   └── assets/               Local images (hero, service photos, logos, award badges)
├── public/                  Static assets served as-is (favicons, icons.svg)
├── .agents/skills/dns-manager/  A Claude Code skill (not app code) for managing this
│                                 site's Porkbun DNS + linking the domain to Vercel
├── graphify-out/             Generated knowledge graph (GRAPH_REPORT.md, graph.json) —
│                              regenerate with `graphify update .` after code changes
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json   TS project references
├── .oxlintrc.json            Lint rule config (react/typescript/oxc plugins)
└── dist/                     Build output (gitignored, not source)
```

There is no router, no state management library, and no backend beyond the single
reviews proxy endpoint — this is deliberately a static-content site with one dynamic
integration.

## 6. Entry Points — Read These First

1. `src/App.tsx` — the entire UI, content (including the `content.en` / `content.es`
   bilingual dictionary), and section layout live here. Start at the top for the
   `Service`/`Testimonial`/`FAQItem` types and `content` object, then `export default
   function App()` at line 449 for the component/render logic.
2. `src/main.tsx` — confirms there's nothing else going on at bootstrap (just StrictMode
   + App).
3. `vite.config.ts` — shows how the Google Reviews proxy works locally and what env vars
   it needs; explains why `/api/reviews` "just works" in dev without deploying.
4. `api/reviews.js` — the production (Vercel) equivalent of that proxy; keep both in
   sync if you change the request/response shape.
5. `index.html` — trivial, but confirms the page `<title>` and mount point.
6. `graphify-out/GRAPH_REPORT.md` — machine-generated map of symbol connections; useful
   for a second opinion on what's central vs. isolated.
7. `.agents/skills/dns-manager/SKILL.md` — only relevant if the task involves domain/DNS
   or Vercel linkage, not app functionality.

## 7. Conventions & Gotchas

- **Everything lives in one file.** `src/App.tsx` is ~1400 lines with no sub-components
  split into separate files. There is no `components/` directory — resist the urge to
  assume one exists.
- **Bilingual content is a single in-file object**, not i18n library-driven: `content =
  { en: {...}, es: {...} }`, selected via a `Locale = 'en' | 'es'` state variable. Add new
  copy to both locales or the missing-language text will be undefined at runtime.
- **`content.es.categories.all` is the string `'TODO'` — this is CORRECT, not a bug.**
  "TODO" is Spanish for "ALL", and it matches the uppercase style of its siblings
  (`RESIDENCIAL`, `COMERCIAL`, `ESPECIALIDAD`). Do not "fix" it into something else;
  automated scans flag it as a leftover TODO marker, and it is not one.
- **Two near-duplicate implementations of the Google Places proxy** exist by necessity:
  the Vite dev middleware in `vite.config.ts` and the Vercel function `api/reviews.js`.
  Any change to request params or response shape needs to be mirrored in both, or dev
  and prod will disagree.
- **Tailwind v4** is configured via the Vite plugin (`@tailwindcss/vite`), not a
  `tailwind.config.js` file — don't go looking for one; theme/customization is likely
  done via CSS (`src/index.css`) using Tailwind v4's CSS-first config approach.
- **No router** — navigation is anchor-link scrolling to section `id`s (`#about`,
  `#services`, `#faq`, `#reviews`), not client-side routing.
- **`dist/` exists in the working tree** as build output but is gitignored — don't treat
  it as source of truth for anything.
- **TypeScript is pinned to `~6.0.2`**, notably newer than the widely-used 5.x line as of
  this repo's last commit — double check any TS-version-sensitive tooling assumptions.

## 8. External Dependencies & Environment

- **Google Places API (Place Details endpoint)** — fetches business reviews, rating, and
  review count for the Reviews section. Required env vars:
  - `GOOGLE_PLACES_API_KEY`
  - `GOOGLE_PLACE_ID` (optional — falls back to a hardcoded Place ID in both
    `vite.config.ts` and `api/reviews.js` if unset)
- **Vercel** — production hosting; `api/reviews.js` follows the Vercel serverless
  function convention (default-exported `(req, res)` handler).
- **Porkbun** (DNS registrar) — only relevant via the `.agents/skills/dns-manager` tool,
  not the app itself. That skill expects a separate `.env.dns.local` (gitignored) with
  `PORKBUN_API_KEY`, `PORKBUN_SECRET_KEY`, `VERCEL_API_TOKEN`, `VERCEL_PROJECT_ID`, and
  optionally `VERCEL_TEAM_ID`.
- No database, no auth provider, no analytics SDK found in dependencies or source.
- **CRITICAL: only variable names are listed above — never place actual key/token
  values in this file or any other checked-in file.**

## 9. Known Issues & TODOs

- No automated tests exist anywhere in the repo (no test framework installed, no `test`
  script). Any regression testing is manual.
- No CI configuration (no `.github/workflows`) was found — verify before assuming builds
  or lint are gated automatically.

## 10. Fast Orientation for a New Agent

1. Ensure `graphify` is on PATH (`export PATH="$HOME/.local/bin:$PATH"` if needed), then
   run `graphify query "<question>"` to pull a scoped subgraph before opening files
   blind — cheaper than grepping a 1400-line component cold.
2. Run `graphify god-nodes --top 15` to see the most-connected symbols; useful mainly for
   the tooling/config graph here since `App.tsx` itself is mostly isolated nodes (a
   single big component, not a call graph).
3. Read `graphify-out/GRAPH_REPORT.md` for a pre-computed summary (communities, god
   nodes, knowledge gaps) — already reviewed while writing this doc.
4. **Most useful first question for this repo's graph:** `graphify query "what connects
   the reviews API proxy in vite.config.ts to api/reviews.js"` — since the two Google
   Places proxy implementations are the one piece of "real" logic/duplication risk in an
   otherwise static-content site, and confirming how they relate is the fastest way to
   avoid breaking one while fixing the other.
5. After making changes, run `npm run lint` and `npm run build` (there is no test suite)
   to catch type errors and lint issues before considering work done.
6. If you touch code, regenerate the graph with `graphify update .` so it stays useful
   for the next agent.
