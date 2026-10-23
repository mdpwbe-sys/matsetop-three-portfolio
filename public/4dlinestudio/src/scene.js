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
  let size;
  /** @type {{ min: {x:number,y:number,z:number}, max: {x:number,y:number,z:number}, minRadius: number } | null} */
  let safeBox = null;
  let clamping = false;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const buildSafeBox = () => {
    // Marge intérieure pour limiter la traversée des parois (approx. collision AABB).
    const margin = selected.interiorMargin ?? 0.35;
    const half = { x: size.x / 2, y: size.y / 2, z: size.z / 2 };
    safeBox = {
      min: {
        x: center.x - half.x + margin,
        y: center.y - half.y + margin,
        z: center.z - half.z + margin
      },
      max: {
        x: center.x + half.x - margin,
        y: center.y + half.y - margin,
        z: center.z + half.z - margin
      },
      minRadius: selected.interiorMinRadius ?? 0.015
    };
    // Si le modèle est trop petit pour la marge, recentrer une boîte minimale.
    ['x', 'y', 'z'].forEach((axis) => {
      if (safeBox.min[axis] > safeBox.max[axis]) {
        const mid = center[axis];
        safeBox.min[axis] = mid - 0.05;
        safeBox.max[axis] = mid + 0.05;
      }
    });
  };

  const maxRadiusAt = (point) => {
    if (!safeBox) return selected.interiorMinRadius ?? 0.015;
    return Math.max(
      safeBox.minRadius,
      Math.min(
        point.x - safeBox.min.x,
        safeBox.max.x - point.x,
        point.y - safeBox.min.y,
        safeBox.max.y - point.y,
        point.z - safeBox.min.z,
        safeBox.max.z - point.z
      ) * 0.92
    );
  };

  const interiorTarget = () => {
    const offset = selected.interiorOffset || {};
    if (selected.interiorAtCenter) {
      return {
        x: center.x + (offset.x || 0),
        y: center.y + (offset.y || 0),
        z: center.z + (offset.z || 0)
      };
    }
    // Studio : hauteur d’œil debout plutôt que centre géométrique.
    const eyeHeight = center.y - size.y / 2 + Math.min(1.45, size.y * 0.58);
    return {
      x: center.x + (offset.x || 0),
      y: eyeHeight + (offset.y || 0),
      z: center.z + (offset.z || 0)
    };
  };

  const updateStatus = () => {
    status.textContent = mode === 'interior'
      ? 'Vue intérieure · glisser pour regarder · clic droit pour se déplacer · molette pour zoomer'
      : 'Vue d’ensemble · glisser pour tourner, molette pour zoomer, clic droit pour déplacer';
  };

  const setView = (nextMode) => {
    mode = nextMode;
    viewer.disablePan = false;
    if (mode === 'interior') {
      buildSafeBox();
      const target = interiorTarget();
      const startRadius = selected.interiorMinRadius ?? 0.015;
      const maxR = maxRadiusAt(target);
      viewer.minCameraOrbit = `auto 25deg ${startRadius}m`;
      viewer.maxCameraOrbit = `auto 155deg ${Math.max(startRadius, maxR)}m`;
      viewer.minFieldOfView = '45deg';
      viewer.maxFieldOfView = '90deg';
      viewer.fieldOfView = '75deg';
      // Zoom 0 = rayon minimal au départ, cible au point central configuré.
      viewer.cameraTarget = `${target.x}m ${target.y}m ${target.z}m`;
      viewer.cameraOrbit = selected.interiorOrbit || `90deg 85deg ${startRadius}m`;
    } else {
      safeBox = null;
      viewer.minCameraOrbit = 'auto 15deg 20%';
      viewer.maxCameraOrbit = 'auto 100deg 180%';
      viewer.minFieldOfView = '12deg';
      viewer.maxFieldOfView = '45deg';
      viewer.fieldOfView = '30deg';
      viewer.cameraTarget = 'auto auto auto';
      viewer.cameraOrbit = selected.orbit;
    }
    viewer.updateComplete.then(() => viewer.jumpCameraToGoal());
    frame.dataset.cameraMode = mode;
    frame.querySelectorAll('[data-view]').forEach((button) => {
      const active = button.dataset.view === mode;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    updateStatus();
  };

  // Empêche la caméra (cible + rayon) de sortir de la boîte intérieure ≈ surfaces.
  viewer.addEventListener('camera-change', () => {
    if (mode !== 'interior' || !safeBox || clamping) return;
    const target = viewer.getCameraTarget();
    const orbit = viewer.getCameraOrbit();
    const nx = clamp(target.x, safeBox.min.x, safeBox.max.x);
    const ny = clamp(target.y, safeBox.min.y, safeBox.max.y);
    const nz = clamp(target.z, safeBox.min.z, safeBox.max.z);
    const maxR = maxRadiusAt({ x: nx, y: ny, z: nz });
    const nr = clamp(orbit.radius, safeBox.minRadius, maxR);
    const moved =
      Math.abs(nx - target.x) > 0.001 ||
      Math.abs(ny - target.y) > 0.001 ||
      Math.abs(nz - target.z) > 0.001 ||
      Math.abs(nr - orbit.radius) > 0.001;
    if (!moved) return;
    clamping = true;
    viewer.cameraTarget = `${nx}m ${ny}m ${nz}m`;
    viewer.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${nr}m`;
    viewer.jumpCameraToGoal();
    requestAnimationFrame(() => { clamping = false; });
  });

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
    size = viewer.getDimensions();
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
