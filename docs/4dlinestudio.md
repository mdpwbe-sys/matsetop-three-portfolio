# Publication de 4D Line Concept

Le site de visualisation est ajouté aux fichiers publics Vite dans `public/4dlinestudio/`. Le workflow GitHub Pages existant copie ces fichiers dans `dist/4dlinestudio/` sans modifier leur arborescence. Aucun changement de DNS ni de workflow n’est nécessaire.

- URL principale : https://m.atsetop.be/4dlinestudio/
- Alias avec la casse demandée : https://m.atsetop.be/4Dlinestudio/
- Une nouvelle tuile « 4D Line Concept — Studio 3D » est ajoutée au portfolio principal.
- L’alias conserve les paramètres et les ancres lors de la redirection.
- Les modules, médias et modèles utilisent des chemins relatifs au sous-dossier. Le lecteur 3D est hébergé avec le site.

## Contenu

La publication reprend le projet local 4D Line Concept au commit `1054fae`, avec cinq images, deux vidéos et deux modèles GLB. Les fichiers sources SKP et les dossiers d’originaux Windows ne sont pas publiés. Les logs, le dépôt Git, les outils de développement et les rapports locaux sont exclus de la copie web.

Les réglages précédemment validés sont conservés : vues intérieures, point de départ décalé du van dans son couloir, éclairage Soir par défaut et sélecteur Jour/Soir caché. Le formulaire garde son fonctionnement existant sans backend d’envoi ; l’adresse professionnelle n’est pas inventée. La tuile porte donc le statut « prototype ».

## Mise à jour

```bash
python3 scripts/sync-4d-studio.py /chemin/du/projet/4d-line-concept
npm ci
npm run build
```

Le script synchronise uniquement `index.html`, `src/` et `public/` du projet source. Il ne touche pas aux fichiers de développement locaux. Il faut conserver les chemins portables pour les futures copies.

## Validation

`npm run build` vérifie TypeScript et construit l’artefact Pages. Le script `scripts/check-pages.cjs` vérifie la nouvelle tuile, le chargement des deux modèles sous le sous-dossier, les vues intérieures et extérieures, le réglage Soir, les images, les vidéos, la galerie, les formats 320/390 px, la redirection et la page Homelab existante. Le navigateur de validation nécessite Playwright et Chromium sur la machine de développement, sans dépendance supplémentaire pour le site.

```bash
PLAYWRIGHT_MODULE=/chemin/vers/playwright \
CHROMIUM_PATH=/chemin/vers/chromium \
SITE_URL=http://127.0.0.1:4180 \
node scripts/check-pages.cjs
```

La même commande avec `SITE_URL=https://m.atsetop.be` permet de vérifier le résultat publié. Les tests s’exécutent dans Chromium, avec des tailles mobiles simulées. La compilation conserve l’avertissement de taille du module Three.js du portfolio existant.
