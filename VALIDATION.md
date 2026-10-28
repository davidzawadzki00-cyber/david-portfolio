# First-version validation

## Verified locally

- `npm ci --no-audit --no-fund`: passed with the lockfile (Node 24.19.0, Vite 7.3.7, Three.js 0.185.1).
- `npm run build`: passed. Vite reports the lazy-loaded Three.js/sculpture chunk above its default 500 kB warning threshold (~129 kB gzip). The initial page enhancement is ~1.2 kB gzip; text/links do not wait for the 3D chunk.
- Served `dist/` with Vite preview under `/david-zawadzki-portfolio/`, not the domain root.
- Chromium screenshots visually reviewed at 375, 768, and 1440 CSS pixels. No horizontal overflow, clipped name, or portrait/sculpture/text overlap in the reserved layouts. Fixed unsupported arrow glyphs and the statement heading alignment.
- Normal browser review: HTTP 200, no page/console errors, no failed asset requests at all three widths.
- Mouse drag, touch drag, arrow-key rotation, Home reset, reset button: passed.
- No idle rendering and no offscreen render requests after settling: passed. Hidden-tab suspension is implemented with `visibilitychange`; not separately exercised in the browser automation.
- Reduced-motion preference: no inertia/idle movement; rotation stops immediately after dragging. Native mobile touch scroll outside the sculpture: passed.
- Statement/Contact/top anchors and exact email/LinkedIn destinations: passed.
- JavaScript-disabled content and static SVG: passed. Simulated WebGL initialization failure and context loss preserve the fallback: passed. Fallback controls/labels reflect the static state.
- Isolated abstract JPEG fixtures (outside this project) verified portrait directory creation, byte-identical copying, retained originals, explicit intrinsic dimensions, eager/high-priority hero and lazy headshot, correct subpath URLs, and rejection of wrong proportions. These fixture tests do not verify the actual photographs.
- Original `/workspace/david-portfolio` checkout remains clean at `9e63e729973ad7f387d38ad4ddc2cff2f91fc02e`. Its repository files and publishing settings were not modified.

## Blocked / unverified

- `npm run check:portraits`: intentionally FAILS until the two original JPEG files are available. Both are visible in chat, but no downloadable JPEGs were exposed to the runtime, including the shared downloads directory. The site contains honest reserved portrait areas; no substitute person or generated portrait was used.
- Missing: `9ECD2D50-8857-4FC8-9CF5-3FE607DCA73D.jpeg` and `04E1A846-D312-432C-8A35-C57442047E2D(2).jpeg`. Actual image loading, full-color delivery, full-figure/shoes framing, and headshot clarity still require final review after copying those originals.
- GitHub API is policy-blocked, so account identity, new repository creation, Actions execution, and live deployment are not verified. No live URL is claimed. The environment configuration draft saves additions for `api.github.com`, `vite.dev`, `docs.github.com`, and `threejs.org`; saving the draft does not apply or publish it. Review/save the changes in environment settings, then publish the environment to activate them.
- Intended new repository name/base path: `david-zawadzki-portfolio` / `/david-zawadzki-portfolio/`, pending authenticated creation. The workflow refuses to deploy until the portraits pass validation.

See README for exact asset and publishing instructions. Re-review the actual portraits at the three widths and check the deployed URL/assets before calling the site live.
