// The page content and navigation work independently of this enhancement.
// Separate chunk: text and portraits never wait for Three.js.
const stage = document.querySelector('#sculpture-stage');
if (stage) {
  import('./sculpture.js')
    .then(({ initSculpture }) => initSculpture())
    .catch(() => {
      stage.dataset.renderer = 'fallback';
      stage.removeAttribute('tabindex');
      stage.setAttribute('role', 'img');
      stage.removeAttribute('aria-roledescription');
      document.querySelector('#sculpture-hint').textContent = 'Static chrome study · interaction unavailable';
      document.querySelector('.sculpture-caption-detail').hidden = true;
    });
}

// Enhancements are optional: content and contact links remain native HTML.
const themeToggle = document.querySelector('.theme-toggle');
if (themeToggle) {
  const applyTheme = theme => {
    document.documentElement.dataset.theme = theme;
    themeToggle.setAttribute('aria-pressed', String(theme === 'graphite'));
    document.querySelector('meta[name="theme-color"]').content = theme === 'graphite' ? '#242729' : '#f2f1ed';
  };
  try { applyTheme(localStorage.getItem('dz-theme') === 'graphite' ? 'graphite' : 'light'); } catch { applyTheme('light'); }
  themeToggle.hidden = false;
  themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'graphite' ? 'light' : 'graphite';
    applyTheme(theme);
    try { localStorage.setItem('dz-theme', theme); } catch { /* Theme still works without storage. */ }
  });
}
const copyEmail = document.querySelector('#copy-email');
if (copyEmail && navigator.clipboard?.writeText) {
  copyEmail.hidden = false;
  copyEmail.addEventListener('click', async () => {
    const status = document.querySelector('#copy-status');
    try {
      await navigator.clipboard.writeText('david.zawadzki00@gmail.com');
      status.textContent = 'Email address copied.';
    } catch {
      status.textContent = 'Could not copy. Use the email link above or select the address.';
    }
  });
}
