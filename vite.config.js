import { defineConfig } from 'vite';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { portraitPlugin } from './scripts/portraits.mjs';

// Set PAGES_BASE=/another-repository/ if the GitHub repository is renamed.
const base = process.env.PAGES_BASE || '/david-portfolio/';
if (!base.startsWith('/') || !base.endsWith('/')) {
  throw new Error('PAGES_BASE must start and end with a slash.');
}
export default defineConfig({
  base,
  plugins: [portraitPlugin(base), {
    name: 'optional-resume',
    transformIndexHtml(html) {
      const available = existsSync(fileURLToPath(new URL('./public/resume.pdf', import.meta.url)));
      return html.replace('<!-- RESUME_LINK -->', available
        ? `<a id="resume-link" href="${base}resume.pdf" download>Download résumé ↓</a>`
        : '');
    },
  }],
  build: { target: 'es2022' },
});
