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
