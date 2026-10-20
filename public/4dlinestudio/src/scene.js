import { interactiveModels } from './config.js';

// Deux véritables exports SketchUp, lecteur et textures servis localement.
export async function initScene() {
  const viewer = document.querySelector('#project-model');
  const frame = document.querySelector('#scene-frame');
  const fallback = document.querySelector('#scene-fallback');
  const status = document.querySelector('#model-status');
  const controls = frame.querySelectorAll('.scene-controls button');
  let selected = interactiveModels[0];
  let mode = 'interior';
  let center;

  const updateStatus = () => {
    status.textContent = mode === 'interior'
      ? 'Vue intérieure · glisser ou utiliser les flèches pour regarder autour de soi'
      : 'Vue d’ensemble · glisser pour tourner, molette pour zoomer';
  };
  const setView = (nextMode) => {
    mode = nextMode;
    if (mode === 'interior') {
      viewer.disablePan = true;
      const size = viewer.getDimensions();
      // Point de vue intérieur, avec ajustement propre au projet si nécessaire.
      const eyeHeight = center.y - size.y / 2 + Math.min(1.45, size.y * .58);
      viewer.minCameraOrbit = 'auto 25deg 0.015m';
      viewer.maxCameraOrbit = 'auto 155deg 0.015m';
      viewer.minFieldOfView = '45deg';
      viewer.maxFieldOfView = '90deg';
      viewer.fieldOfView = '75deg';
      const offset = selected.interiorOffset || {};
      viewer.cameraTarget = `${center.x + (offset.x || 0)}m ${eyeHeight}m ${center.z + (offset.z || 0)}m`;
      viewer.cameraOrbit = selected.interiorOrbit;
    } else {
      viewer.disablePan = false;
      viewer.minCameraOrbit = 'auto 15deg 20%';
      viewer.maxCameraOrbit = 'auto 100deg 180%';
      viewer.minFieldOfView = '12deg';
      viewer.maxFieldOfView = '45deg';
      viewer.fieldOfView = '30deg';
      viewer.cameraTarget = 'auto auto auto';
      viewer.cameraOrbit = selected.orbit;
    }
    // Les propriétés Lit sont appliquées lors de la prochaine microtâche.
    viewer.updateComplete.then(() => viewer.jumpCameraToGoal());
    frame.dataset.cameraMode = mode;
    frame.querySelectorAll('[data-view]').forEach((button) => {
      const active = button.dataset.view === mode;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    updateStatus();
  };
  const fail = () => {
    frame.dataset.modelState = 'error';
    viewer.hidden = true;
    fallback.hidden = false;
    controls.forEach((button) => { button.disabled = true; });
    status.textContent = 'L’aperçu 3D est indisponible ici. Retrouvez les médias du projet ci-dessous.';
  };
  viewer.addEventListener('error', fail);
  viewer.addEventListener('load', () => {
    center = viewer.getBoundingBoxCenter();
    frame.dataset.modelState = 'ready';
    controls.forEach((button) => { button.disabled = false; });
    if (!frame.requestFullscreen) document.querySelector('#model-fullscreen').hidden = true;
    setView('interior');
  });
  frame.querySelectorAll('[data-model]').forEach((button) => {
    button.addEventListener('click', () => {
      const model = interactiveModels.find((item) => item.id === button.dataset.model);
      if (selected === model && frame.dataset.modelState === 'ready') return;
      selected = model;
      frame.dataset.modelState = 'loading';
      frame.dataset.model = selected.id;
      viewer.hidden = false;
      fallback.hidden = true;
      controls.forEach((control) => { control.disabled = true; });
      status.textContent = 'Chargement du modèle 3D…';
      document.querySelector('#model-title').textContent = selected.label.toUpperCase();
      frame.querySelectorAll('[data-model]').forEach((other) => {
        const active = other === button;
        other.classList.toggle('is-active', active);
        other.setAttribute('aria-pressed', String(active));
      });
      viewer.alt = `Modèle 3D — ${selected.label}. Faites glisser ou utilisez les flèches du clavier pour regarder autour de vous.`;
      viewer.poster = selected.poster;
      viewer.querySelector('img[slot="poster"]').src = selected.poster;
      viewer.querySelector('img[slot="poster"]').alt = `Aperçu — ${selected.label}`;
      fallback.querySelector('img').src = selected.poster;
      fallback.querySelector('img').alt = `Rendu 3D — ${selected.label}`;
      fallback.querySelector('a').href = '#project-' + selected.id;
      viewer.src = selected.src;
    });
  });
  frame.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => setView(button.dataset.view)));
  frame.querySelectorAll('[data-light]').forEach((button) => {
    button.addEventListener('click', () => {
      const night = button.dataset.light === 'night';
      viewer.exposure = night ? .55 : 1;
      frame.classList.toggle('is-night', night);
      frame.querySelectorAll('[data-light]').forEach((other) => {
        const active = other === button;
        other.classList.toggle('is-active', active);
        other.setAttribute('aria-pressed', String(active));
      });
    });
  });
  document.querySelector('#model-reset').addEventListener('click', () => setView(mode));
  const fullscreen = document.querySelector('#model-fullscreen');
  fullscreen.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement === frame) await document.exitFullscreen();
      else await frame.requestFullscreen();
    } catch {
      status.textContent = 'Le plein écran est indisponible. La vue 3D reste accessible.';
    }
  });
  document.addEventListener('fullscreenchange', () => {
    fullscreen.textContent = document.fullscreenElement === frame ? 'Réduire' : 'Agrandir';
  });
  frame.dataset.model = selected.id;
  try {
    await import(new URL('../public/vendor/model-viewer-4.4.0/model-viewer.min.js', import.meta.url).href);
  } catch {
    fail();
  }
}
