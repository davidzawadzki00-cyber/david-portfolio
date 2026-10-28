# David Zawadzki — portfolio

A Vite, semantic HTML/CSS, vanilla JavaScript, and Three.js portfolio. The existing chrome ribbon renders on demand, with native keyboard controls and a static SVG fallback. No backend, tracking, external fonts, models, or image services.

Repository: `davidzawadzki00-cyber/david-portfolio`. GitHub Pages base: `/david-portfolio/`.

## Development

Use Node 24 (`.nvmrc`), then:

```sh
npm ci
npm run dev
```

For production checks:

```sh
npm run check:portraits
npm run build
npm run preview
```

Vite serves the project under `/david-portfolio/`; production output is `dist/`. `PAGES_BASE` supports another leading/trailing-slash base for builds, but the static 404 return link targets this repository’s fixed Pages base. No separate automated test suite is configured.

## Content and assets

- `index.html`: introduction, About, unchanged artist statement, capabilities, and verified contact destinations.
- `src/style.css`: system-font typography, responsive editorial layouts, light and graphite palettes. Off-white is the default; an explicit theme choice is stored locally. No cookies or external services.
- `src/main.js`: optional theme and copy-email controls; content and navigation work without JavaScript.
- `src/sculpture.js`: existing chrome ribbon, drag/touch/keyboard rotation, Home/button reset, offscreen/hidden-tab suspension, and fallback. No idle animation or inertia.
- `src/projects.js`: intentionally empty future-project schema. Do not show projects until real entries exist.
- `public/favicon.svg`: DZ monogram. `public/404.html`: static Pages error page. `public/social-preview.png`: prepared 1200×630 sharing graphic, pending verified absolute metadata URLs.
- Optional résumé: place a real PDF at `public/resume.pdf`, then restart Vite/rebuild. The build enables the download link only when this file exists. No résumé is fabricated or linked by default.

Both original photographs are retained in `portraits/originals/`. `scripts/portraits.mjs` validates their dimensions and copies them to `public/portraits/` during development/build. Preserve both originals and their framing; no cropping, recoloring, or substitute portraits. The editorial photograph is eager/high-priority, and the square headshot is lazy-loaded.

## Review and deployment

Portfolio 2.0 changes are prepared on `feat/portfolio-2-editorial` for review. Do not merge or deploy without approval. `.github/workflows/pages.yml` retains its portrait validation and Pages deployment steps. Pushing to `main` triggers the live deployment; keep review changes on their working branch.

The supplied deployment address is `https://davidzawadzki00-cyber.github.io/david-portfolio/`. Live access was policy-blocked during this review, so canonical URL and absolute social-image metadata are deferred until deployment verification. Basic sharing title/description metadata is present. See `VALIDATION.md` for current checks and limitations.

## Archived portfolio and animations

`public/archive/` preserves the earlier class portfolio from `davidzawadzki00-cyber/portfolio`, commit `8424d02a1ddf63c5a9ee78f93b28662a9e9c5a9e`. Its three pages, stylesheet, and five screenshots are copied locally so the archive works under this site's Pages subpath. Each page adds an archive notice and a return link. Links to the original individual projects remain intact; the archive preserves their historical descriptions rather than certifying those external projects as repaired.

The main page's Work section links to this archive and reserves a small, noninteractive row for 2D animations. No video files, players, thumbnails, or film titles are invented. When films are available, add the real media and project notes in that row; the existing `src/projects.js` schema remains available for individual project entries.
