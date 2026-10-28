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
