import { siteConfig } from './config.js';
import { initScene } from './scene.js';

// Les données du portfolio ne sont jamais injectées en HTML brut.
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function releaseVideos(container) {
  container.querySelectorAll('video').forEach((video) => {
    video.pause();
    video.removeAttribute('src');
    video.load();
  });
}

function createGallery(project, { enlarged = false, startIndex = 0, onEnlarge } = {}) {
  const gallery = element('div', 'project-gallery');
  gallery.setAttribute('role', 'group');
  gallery.setAttribute('aria-label', 'Galerie — ' + project.title);
  const stage = element('div', 'gallery-stage');
  const toolbar = element('div', 'gallery-toolbar');
  const status = element('p', 'gallery-status');
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('aria-atomic', 'true');
  const thumbs = element('div', 'gallery-thumbnails');
  thumbs.setAttribute('role', 'group');
  thumbs.setAttribute('aria-label', 'Choisir un média');
  let current = startIndex;
  const buttons = [];

  const show = (index) => {
    current = (index + project.media.length) % project.media.length;
    releaseVideos(stage);
    stage.replaceChildren();
    const media = project.media[current];
    if (media.kind === 'video') {
      const video = element('video', 'gallery-video');
      video.controls = true;
      video.playsInline = true;
      video.preload = 'none';
      video.poster = media.poster;
      video.src = media.src;
      video.width = media.width;
      video.height = media.height;
      video.setAttribute('aria-label', media.alt + ' Vidéo sans piste audio.');
      video.append(document.createTextNode('Votre navigateur ne prend pas en charge la lecture vidéo.'));
      stage.append(video);
    } else {
      const picture = element('img', 'gallery-image');
      picture.src = media.src;
      picture.srcset = media.srcset;
      picture.sizes = enlarged ? '(max-width: 960px) 92vw, 1100px' : '(max-width: 760px) 92vw, 65vw';
      picture.alt = media.alt;
      picture.width = media.width;
      picture.height = media.height;
      picture.loading = enlarged ? 'eager' : 'lazy';
      picture.decoding = 'async';
      if (onEnlarge) {
        const opener = element('button', 'gallery-enlarge');
        opener.type = 'button';
        opener.setAttribute('aria-label', 'Agrandir : ' + media.label);
        opener.append(picture, element('span', 'gallery-enlarge-label', 'Agrandir ↗'));
        opener.addEventListener('click', () => onEnlarge(current));
        stage.append(opener);
      } else stage.append(picture);
    }
    status.textContent = `${current + 1} / ${project.media.length} · ${media.label}`;
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
  };

  if (project.media.length > 1) {
    const previous = element('button', 'gallery-arrow', '←');
    const next = element('button', 'gallery-arrow', '→');
    previous.type = next.type = 'button';
    previous.setAttribute('aria-label', 'Média précédent');
    next.setAttribute('aria-label', 'Média suivant');
    previous.addEventListener('click', () => show(current - 1));
    next.addEventListener('click', () => show(current + 1));
    toolbar.append(previous, status, next);
    project.media.forEach((media, index) => {
      const button = element('button', 'gallery-thumbnail');
      button.type = 'button';
      button.setAttribute('aria-label', `${index + 1} / ${project.media.length} · ${media.label}`);
      const image = element('img');
      image.src = media.thumbnail || media.poster;
      image.alt = media.alt || media.label;
      image.loading = 'lazy';
      image.width = 160;
      image.height = 105;
      button.append(image, element('span', 'thumbnail-label', media.kind === 'video' ? '▶ Vidéo' : String(index + 1).padStart(2, '0')));
      button.addEventListener('click', () => show(index));
      buttons.push(button);
      thumbs.append(button);
    });
    gallery.addEventListener('keydown', (event) => {
      // Conserver les raccourcis natifs du lecteur vidéo (avance, volume…).
      if (event.target.closest('video')) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        show(current + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
  } else toolbar.append(status);
  gallery.append(stage, toolbar);
  if (project.media.length > 1) gallery.append(thumbs);
  show(current);
  return gallery;
}

function initPortfolio() {
  const grid = document.querySelector('#work-grid');
  const dialog = document.querySelector('#project-dialog');
  const dialogMedia = document.querySelector('#dialog-media');
  const openProject = (project, index) => {
    // Éviter deux lectures simultanées lorsqu’on ouvre la galerie agrandie.
    grid.querySelectorAll('video').forEach((video) => video.pause());
    releaseVideos(dialogMedia);
    dialogMedia.replaceChildren(createGallery(project, { enlarged: true, startIndex: index }));
    document.querySelector('#dialog-title').textContent = project.title;
    document.querySelector('#dialog-caption').textContent = project.note;
    document.querySelector('#dialog-category').textContent = project.type;
    dialog.showModal();
  };

  for (const project of siteConfig.projects) {
    const article = element('article', 'work-card' + (project.featured ? ' work-card-featured' : ''));
    const info = element('div', 'work-info');
    const title = element('h3', '', project.title);
    title.id = 'project-' + project.id;
    article.setAttribute('aria-labelledby', title.id);
    info.append(element('p', 'eyebrow eyebrow-dark', project.category), title,
      element('p', 'work-caption', project.caption),
      element('p', 'work-media-count', project.featured ? '5 images · 1 vidéo' : '1 vidéo · explorer d’autres espaces'),
      element('p', 'work-note', project.note));
    const open = element('button', 'underlined-link gallery-open', project.featured ? 'Explorer la galerie ↗' : 'Ouvrir la vidéo en grand ↗');
    open.type = 'button';
    open.addEventListener('click', () => openProject(project, 0));
    info.append(open);
    article.append(info, createGallery(project, { onEnlarge: (index) => openProject(project, index) }));
    grid.append(article);
  }
  document.querySelector('#dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    }
  });
  dialog.addEventListener('close', () => {
    releaseVideos(dialogMedia);
    dialogMedia.replaceChildren();
  });
  document.querySelector('#dialog-cta').addEventListener('click', () => dialog.close());
}

function initNav() {
  const button = document.querySelector('#menu-toggle');
  const nav = document.querySelector('#primary-nav');
  const close = () => {
    nav.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Ouvrir le menu');
  };
  button.addEventListener('click', () => {
    const opening = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', opening);
    button.setAttribute('aria-expanded', String(opening));
    button.setAttribute('aria-label', opening ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
}

function getBrief(form) {
  const value = (name) => String(form.elements.namedItem(name)?.value || '').trim();
  const lines = [
    'Bonjour,',
    '',
    'Je souhaite discuter d’un projet de visualisation 3D.',
    '',
    'Nom : ' + value('name'),
    'E-mail : ' + value('email'),
    'Type de projet : ' + value('category'),
    'Profil : ' + value('profile'),
    '',
    'Présentation du projet :',
    value('message'),
    '',
    'Merci de me recontacter pour échanger sur la faisabilité et obtenir une proposition.',
    '',
    'Cordialement,',
    value('name')
  ];
  return lines.join('\n');
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Repli pour les environnements qui bloquent l'accès presse-papiers.
    }
  }
  const node = document.createElement('textarea');
  node.value = text;
  node.setAttribute('readonly', '');
  node.style.cssText = 'position:fixed;left:-9999px;top:0';
  document.body.append(node);
  node.select();
  let copied = false;
  try { copied = document.execCommand('copy'); } catch { copied = false; }
  node.remove();
  return copied;
}

function initForm() {
  const form = document.querySelector('#brief-form');
  const status = document.querySelector('#form-status');
  const prepare = document.querySelector('#prepare-brief');
  prepare.disabled = false;
  prepare.addEventListener('click', () => form.requestSubmit());
  form.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target instanceof HTMLInputElement) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = '';
    status.classList.remove('is-error');
    if (!form.reportValidity()) {
      status.textContent = 'Veuillez compléter les champs obligatoires avec une adresse e-mail valide.';
      status.classList.add('is-error');
      return;
    }
    const message = getBrief(form);
    if (siteConfig.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(siteConfig.email)) {
      const subject = 'Demande de visualisation 3D — 4D Line Concept';
      const url = 'mailto:' + encodeURIComponent(siteConfig.email) + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(message);
      window.location.href = url;
      status.textContent = 'Votre messagerie va s’ouvrir avec la demande préparée. Vérifiez-la avant de l’envoyer.';
      return;
    }
    const copied = await copyText(message);
    if (copied) {
      status.textContent = 'Votre demande est copiée dans le presse-papiers. Envoyez-la ensuite à hello@atsetop.be.';
    } else {
      status.textContent = 'Copie automatique indisponible. Sélectionnez et copiez votre demande dans la fenêtre qui s’ouvre.';
      window.prompt('Copiez ce message pour l’envoyer depuis votre messagerie :', message);
    }
  });
}

document.querySelector('#year').textContent = String(new Date().getFullYear());
initPortfolio();
initNav();
initForm();
initScene();
