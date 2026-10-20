// PLAYWRIGHT_MODULE et CHROMIUM_PATH désignent les outils locaux de validation.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
  const base = (process.env.SITE_URL || JSON.parse(fs.readFileSync('/tmp/matsetop-pages-preview.json')).base_url).replace(/\/$/, '');
  const browser = await chromium.launch({ headless: true, args: ['--enable-unsafe-swiftshader'], ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
    const errors = [], results = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(`${m.text()} (${m.location().url})`); });
    page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
    await page.goto(base + '/', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.project-card').count(), 13);
    const tile = page.locator('[data-project="4d-line-concept"]');
    assert.equal(await tile.getByRole('link').getAttribute('href'), '/4dlinestudio/');
    await tile.screenshot({ path: '/tmp/matsetop-tuile-4d.png' });
    await tile.getByRole('link').click();
    await page.waitForURL(base + '/4dlinestudio/');
    results.push('Portfolio principal : 13 tuiles, dont la nouvelle tuile vers /4dlinestudio/.');
    const frame = page.locator('#scene-frame');
    const viewer = page.locator('#project-model');
    for (const id of ['studio', 'van', 'studio']) {
      if (id === 'van' || await frame.getAttribute('data-model') === 'van') await page.locator(`button[data-model="${id}"]`).click();
      await page.waitForFunction(id => {
        const f = document.querySelector('#scene-frame'), v = document.querySelector('#project-model');
        return f.dataset.model === id && f.dataset.modelState === 'ready' && v.loaded && Math.abs(v.getCameraOrbit().radius - .015) < .001;
      }, id, { timeout: 60000 });
      assert.equal(await viewer.evaluate(v => v.exposure), .55);
      assert.equal(await page.locator('.lighting-toggle').isVisible(), false);
      if (id === 'van') assert.ok(await viewer.evaluate(v => Math.abs(v.getCameraTarget().z - v.getBoundingBoxCenter().z - .35) < .001));
      await page.locator('[data-view="exterior"]').click();
      await page.waitForFunction(() => document.querySelector('#project-model').getCameraOrbit().radius > 1);
      await page.locator('[data-view="interior"]').click();
      await page.waitForFunction(() => Math.abs(document.querySelector('#project-model').getCameraOrbit().radius - .015) < .001);
    }
    results.push('Sous-dossier : deux modèles 3D chargés, vues intérieures et extérieures, décalage du van, Soir actif et sélecteur caché.');
    const studio = page.locator('.work-card-featured');
    for (let index = 0; index < 5; index++) {
      await studio.locator('.gallery-thumbnail').nth(index).click();
      await studio.locator('.gallery-stage img').evaluate(image => image.decode());
    }
    const checkVideo = async locator => {
      await locator.evaluate(async video => {
        await video.play();
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(Error('Lecture bloquée')), 15000);
          const tick = () => video.currentTime > .2 ? (clearTimeout(timeout), resolve()) : setTimeout(tick, 100);
          tick();
        });
        video.pause();
        if (video.error) throw Error(video.error.message);
      });
    };
    await studio.locator('.gallery-thumbnail').last().click();
    await checkVideo(studio.locator('video'));
    await checkVideo(page.locator('.work-card').nth(1).locator('video'));
    await studio.locator('.gallery-thumbnail').first().click();
    await studio.getByRole('button', { name: /Agrandir :/ }).click();
    await page.locator('#project-dialog').waitFor({ state: 'visible' });
    await page.locator('#project-dialog .gallery-stage img').evaluate(image => image.decode());
    await page.keyboard.press('Escape');
    await page.locator('#project-dialog').waitFor({ state: 'hidden' });
    results.push('Cinq images, deux vidéos et galerie agrandie fonctionnent sous le chemin de publication.');
    await page.locator('.hero-visual').screenshot({ path: '/tmp/4d-pages-desktop.png' });
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    }
    await page.locator('.hero-visual').screenshot({ path: '/tmp/4d-pages-mobile.png' });
    await page.goto(base + '/4Dlinestudio/?vue=studio#realisations');
    await page.waitForURL(base + '/4dlinestudio/?vue=studio#realisations');
    results.push('Alias /4Dlinestudio/ : redirection vers /4dlinestudio/, paramètres et ancre préservés.');
    const homelab = await page.request.get(base + '/homelab.html');
    assert.equal(homelab.status(), 200);
    assert.deepEqual(errors, []);
    results.push('Page Homelab toujours accessible, aucune erreur console ou requête HTTP en échec durant les parcours.');
    console.log(JSON.stringify({ date: new Date().toISOString(), base, results, errors }, null, 2));
  } finally {
    await browser.close();
  }
})().catch(e => { console.error(e); process.exit(1); });
