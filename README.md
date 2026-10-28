# David Zawadzki — portfolio

An off-white editorial portfolio with a locally generated, interactive chrome ribbon. Vite, semantic HTML/CSS/JavaScript, and Three.js; no backend or external fonts, models, HDR files, analytics, or image services.

This is a **separate new project** in `david-portfolio-studio`. The existing `david-portfolio` repository and publishing settings are untouched. Intended new GitHub repository: `david-zawadzki-portfolio`.

## Local development

Use Node.js 24 (`.nvmrc`; at least Node 22.12 is required):

```sh
npm ci
npm run dev
```

Vite prints the development address with `/david-zawadzki-portfolio/`. For a production check:

```sh
npm run check:portraits
npm run build
npm run preview
```

Build output goes to `dist/`. Preview serves the same repository subpath. The initial name, statement, portraits (when supplied), and contact links are in built HTML and work without JavaScript.

## Portraits — required before publishing

The chat displayed both photographs, but downloadable originals were not exposed to the build workspace. Neither is included yet. The current local build labels the reserved photograph areas honestly; **the Pages workflow fails its portrait check rather than deploying without them**.

Add the exact originals in `portraits/originals/`:

- `9ECD2D50-8857-4FC8-9CF5-3FE607DCA73D.jpeg` — full-length gray outfit, bicycle, violet racks.
- `04E1A846-D312-432C-8A35-C57442047E2D(2).jpeg` — square outdoor headshot, navy shirt.

`npm run dev` / `npm run build` copy these to descriptive filenames under `public/portraits/`, read real intrinsic dimensions, and generate semantic `<img>` elements in HTML. Run the commands again after adding/replacing photos. The hero is eager-loaded with high priority; the headshot is lazy-loaded. Keep both the originals and generated public JPEGs in Git. No cropping or color filters are applied. Original proportions are preserved with `object-fit: contain`; the hero frame is 4:5, the headshot square. Adjust `.editorial-portrait` / `.headshot` in `src/style.css` if changing sizing. Keep shoes visible and the headshot square. Update alt text in `scripts/portraits.mjs` when replacing an image. The validation rejects substantially different aspect ratios.

## Editing content and appearance

- Edit the three statement paragraphs and email/LinkedIn labels and `href`s in `index.html`.
- Palette, spacing, typography, borders, and motion variables are at the top of `src/style.css`.
- `src/sculpture.js` owns the ribbon, generated studio reflections, rotation, and reset. It renders on demand, pauses offscreen/when hidden, and caps device pixel ratio at 1.6. There is no idle animation or inertia, including reduced-motion mode. Only the sculpture surface captures touch dragging; the rest of the page scrolls normally.
- The inline SVG is visible until the first successful 3D frame and remains the fallback when JavaScript/WebGL is unavailable or initialization/context fails. No text or links depend on Three.js.
- `public/favicon.svg` is the favicon. Metadata lives in `index.html`. Canonical/social URLs are intentionally absent until there is a confirmed deployment URL; don't invent them.

## Future projects

`src/projects.js` exports an initially empty array; no project navigation or empty sections are rendered. The documented schema supports `title`, `summary`, `medium`, `role`, `tools`, `image: { src, alt }`, and `links: [{ label, href }]`. To add real work, populate the array and add a semantic work section/navigation only when entries exist. Use relative public image paths, resolved with `import.meta.env.BASE_URL`. Do not add empty case study pages.

## Publish a new GitHub Pages repository

**Deployment is not yet complete.** GitHub API identity and repository creation could not be verified because `api.github.com` is blocked by the current environment network policy. Required domain additions have been saved in the environment configuration draft; review/save them in environment settings and publish the environment to apply them. Do not change the existing portfolio repository. No new remote or live URL is claimed here.

Once both photos are added and `npm run check:portraits && npm run build` passes, from **this directory** on a machine with authenticated GitHub access:

```sh
gh auth status
gh api user --jq .login
# Confirm this is your intended GitHub account before creating the new repository.
gh repo view davidzawadzki00-cyber/david-zawadzki-portfolio
# If that name is already taken, inspect ownership/content and choose another NEW name.
# Create an EMPTY public repository; do not reuse or overwrite an existing one.
gh repo create davidzawadzki00-cyber/david-zawadzki-portfolio --public --source=. --remote=origin

git add .
git commit -m "Add supplied portfolio portraits"
git push -u origin main
```

In the **new** repository, open Settings → Pages → Build and deployment → Source → **GitHub Actions**. Run the “Deploy static content to Pages” workflow in Actions (or push to `main`). The workflow uses Node 24, `npm ci`, portrait verification, the Vite production build, and current SHA-pinned official Pages actions. It uploads only `dist/`, with `contents: read`, `pages: write`, and `id-token: write`. Open the URL returned by the successful deployment; check both portrait assets, navigation, and sculpture there. A local preview is not proof of a live deployment.

If the new repository name differs, change the default in `vite.config.js` or set `PAGES_BASE=/new-repository/` in the workflow's Build step and locally when building. For a user/organization root Pages site use `/`. Always include leading and trailing slashes. Internal public assets are prefixed by Vite/the portrait plugin so project Pages subpaths work.

Official references used:

- https://vite.dev/guide/static-deploy#github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://threejs.org/docs/pages/MeshStandardMaterial.html

Their authoritative GitHub sources were consulted when those documentation hosts were policy-blocked.

Local review results and remaining blockers are recorded in [VALIDATION.md](VALIDATION.md).
