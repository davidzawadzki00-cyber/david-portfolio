import * as THREE from 'three';

// A closed, softly bevelled ribbon. Everything, including its studio reflection
// map, is generated here: no models, textures, or network requests are needed.
function createRibbon() {
  const segments = 240;
  const profile = [];
  const halfWidth = 0.32;
  const halfDepth = 0.067;
  const bevel = 0.048;
  for (let corner = 0; corner < 4; corner += 1) {
    const angle = corner * Math.PI / 2;
    const cx = Math.cos(angle + Math.PI / 4) > 0 ? halfWidth - bevel : -halfWidth + bevel;
    const cy = Math.sin(angle + Math.PI / 4) > 0 ? halfDepth - bevel : -halfDepth + bevel;
    for (let step = 0; step < 5; step += 1) {
      const a = angle + step / 4 * Math.PI / 2;
      profile.push([cx + Math.cos(a) * bevel, cy + Math.sin(a) * bevel]);
    }
  }
  const vertices = [];
  const indices = [];
  const axis = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  const binormal = new THREE.Vector3();
  const width = new THREE.Vector3();
  const depth = new THREE.Vector3();
  const center = new THREE.Vector3();
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments * Math.PI * 2;
    center.set(1.13 * Math.cos(t), 1.54 * Math.sin(t), 0.24 * Math.sin(2 * t));
    tangent.set(-1.13 * Math.sin(t), 1.54 * Math.cos(t), 0.48 * Math.cos(2 * t)).normalize();
    axis.set(Math.cos(t), Math.sin(t), 0);
    axis.addScaledVector(tangent, -axis.dot(tangent)).normalize();
    binormal.crossVectors(tangent, axis).normalize();
    const twist = t + 0.35;
    width.copy(axis).multiplyScalar(Math.cos(twist)).addScaledVector(binormal, Math.sin(twist));
    depth.crossVectors(tangent, width).normalize();
    for (const [u, v] of profile) {
      vertices.push(center.x + width.x * u + depth.x * v,
        center.y + width.y * u + depth.y * v,
        center.z + width.z * u + depth.z * v);
    }
    if (i < segments) {
      for (let j = 0; j < profile.length; j += 1) {
        const a = i * profile.length + j;
        const b = i * profile.length + (j + 1) % profile.length;
        const c = b + profile.length;
        const d = a + profile.length;
        indices.push(a, b, d, b, c, d);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createStudio(renderer) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Reflection canvas unavailable');
  context.fillStyle = '#33383e';
  context.fillRect(0, 0, 1024, 512);
  const horizon = context.createLinearGradient(0, 0, 0, 512);
  horizon.addColorStop(0, '#dbe1eb');
  horizon.addColorStop(0.36, '#646d7a');
  horizon.addColorStop(0.51, '#12151a');
  horizon.addColorStop(0.56, '#e5e8ea');
  horizon.addColorStop(1, '#777e86');
  context.fillStyle = horizon;
  context.fillRect(0, 0, 1024, 512);
  // Broad softboxes and narrow dark flags form the characteristic chrome bands.
  context.fillStyle = '#ffffff';
  context.fillRect(50, 20, 175, 215);
  context.fillRect(490, 42, 280, 135);
  context.fillRect(850, 125, 75, 265);
  context.fillStyle = '#080b10';
  context.fillRect(250, 0, 80, 512);
  context.fillRect(795, 200, 30, 312);
  context.fillStyle = '#bacde9';
  context.fillRect(360, 255, 70, 210);
  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  const generator = new THREE.PMREMGenerator(renderer);
  const environment = generator.fromEquirectangular(texture);
  texture.dispose();
  generator.dispose();
  return environment;
}

export function initSculpture() {
  const stage = document.querySelector('#sculpture-stage');
  const reset = document.querySelector('#sculpture-reset');
  if (!stage) return () => {};
  let renderer;
  let environment;
  let geometry;
  let material;
  let resizeObserver;
  let intersectionObserver;
  let frame = 0;
  let visible = false;
  let disposed = false;
  let pointer = null;
  let lastX = 0;
  let lastY = 0;
  const cleanups = [];
  const listen = (target, name, handler, options) => {
    target.addEventListener(name, handler, options);
    cleanups.push(() => target.removeEventListener(name, handler, options));
  };
  const cleanup = () => {
    disposed = true;
    cancelAnimationFrame(frame);
    resizeObserver?.disconnect();
    intersectionObserver?.disconnect();
    cleanups.forEach(remove => remove());
    geometry?.dispose();
    material?.dispose();
    environment?.dispose();
    renderer?.dispose();
    renderer?.domElement.remove();
    stage.dataset.renderer = 'fallback';
    stage.removeAttribute('tabindex');
    stage.setAttribute('role', 'img');
    stage.removeAttribute('aria-roledescription');
    stage.removeAttribute('aria-keyshortcuts');
    const hint = document.querySelector('#sculpture-hint');
    if (hint) hint.textContent = 'Static chrome study · interaction unavailable';
    const detail = document.querySelector('.sculpture-caption-detail');
    if (detail) detail.hidden = true;
    stage.dataset.dragging = 'false';
    stage.style.touchAction = 'auto';
    if (reset) reset.disabled = true;
  };
  try {
    const bounds = stage.getBoundingClientRect();
    visible = bounds.bottom > 0 && bounds.top < window.innerHeight;
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
    stage.append(renderer.domElement);
    stage.style.touchAction = 'none';
    stage.setAttribute('aria-keyshortcuts', 'ArrowUp ArrowDown ArrowLeft ArrowRight Home');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    camera.position.z = 6.8;
    environment = createStudio(renderer);
    scene.environment = environment.texture;
    geometry = createRibbon();
    material = new THREE.MeshStandardMaterial({
      color: 0xf5f6f8, metalness: 1, roughness: 0.13, envMapIntensity: 1.6,
      side: THREE.DoubleSide,
    });
    const ribbon = new THREE.Mesh(geometry, material);
    scene.add(ribbon);
    const initial = new THREE.Euler(0.26, -0.52, -0.36);
    ribbon.rotation.copy(initial);
    const render = () => {
      frame = 0;
      if (disposed || !visible || document.hidden) return;
      try {
        renderer.render(scene, camera);
        if (stage.dataset.renderer !== 'ready') {
          stage.tabIndex = 0;
          stage.setAttribute('role', 'group');
          stage.setAttribute('aria-roledescription', 'interactive sculpture');
          const hint = document.querySelector('#sculpture-hint');
          if (hint) hint.textContent = 'Drag to rotate · Arrow keys when focused';
          const detail = document.querySelector('.sculpture-caption-detail');
          if (detail) detail.hidden = false;
          stage.dataset.renderer = 'ready';
        }
      } catch {
        cleanup();
      }
    };
    const requestRender = () => {
      if (!disposed && visible && !document.hidden && !frame) frame = requestAnimationFrame(render);
    };
    const resize = () => {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      // Preserve the full silhouette in narrow containers.
      camera.position.z = Math.max(6.8, 5.2 / camera.aspect);
      camera.updateProjectionMatrix();
      requestRender();
    };
    const resetOrientation = () => {
      ribbon.rotation.copy(initial);
      requestRender();
    };
    listen(stage, 'pointerdown', event => {
      if (pointer !== null || (event.pointerType === 'mouse' && event.button !== 0)) return;
      pointer = event.pointerId;
      lastX = event.clientX;
      lastY = event.clientY;
      stage.setPointerCapture(pointer);
      stage.dataset.dragging = 'true';
      stage.focus({ preventScroll: true });
      event.preventDefault();
    });
    listen(stage, 'pointermove', event => {
      if (event.pointerId !== pointer) return;
      ribbon.rotation.y += (event.clientX - lastX) * 0.011;
      ribbon.rotation.x += (event.clientY - lastY) * 0.011;
      lastX = event.clientX;
      lastY = event.clientY;
      requestRender();
    });
    const release = event => {
      if (event.pointerId !== pointer) return;
      pointer = null;
      stage.dataset.dragging = 'false';
    };
    listen(stage, 'pointerup', release);
    listen(stage, 'pointercancel', release);
    listen(stage, 'lostpointercapture', release);
    listen(stage, 'keydown', event => {
      const step = event.shiftKey ? 0.3 : 0.12;
      if (event.key === 'ArrowLeft') ribbon.rotation.y -= step;
      else if (event.key === 'ArrowRight') ribbon.rotation.y += step;
      else if (event.key === 'ArrowUp') ribbon.rotation.x -= step;
      else if (event.key === 'ArrowDown') ribbon.rotation.x += step;
      else if (event.key === 'Home') resetOrientation();
      else return;
      event.preventDefault();
      requestRender();
    });
    if (reset) {
      reset.disabled = false;
      listen(reset, 'click', resetOrientation);
    }
    listen(document, 'visibilitychange', () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else requestRender();
    });
    listen(renderer.domElement, 'webglcontextlost', event => {
      event.preventDefault();
      cleanup();
    });
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    intersectionObserver = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) requestRender();
      else { cancelAnimationFrame(frame); frame = 0; }
    });
    intersectionObserver.observe(stage);
    // No animation loop, idle movement, or inertia, including reduced-motion mode.
    resize();
    requestRender();
  } catch {
    cleanup();
  }
  return cleanup;
}
