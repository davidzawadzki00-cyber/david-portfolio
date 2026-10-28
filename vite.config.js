import { defineConfig } from 'vite';
import { portraitPlugin } from './scripts/portraits.mjs';

// Set PAGES_BASE=/another-repository/ if the GitHub repository is renamed.
const base = process.env.PAGES_BASE || '/david-portfolio/';
if (!base.startsWith('/') || !base.endsWith('/')) {
  throw new Error('PAGES_BASE must start and end with a slash.');
}
export default defineConfig({
  base,
  plugins: [portraitPlugin(base)],
  build: { target: 'es2022' },
});
