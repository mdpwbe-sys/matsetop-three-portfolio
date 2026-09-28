# Matsetop — Three.js Portfolio

Starter portfolio 3D construit avec :

- Vite
- TypeScript
- Three.js natif
- HTML/CSS sans framework UI

## Démarrage

```bash
npm install
npm run dev
```

Puis ouvre :

```text
http://localhost:5173
```

## Build production

```bash
npm run build
npm run preview
```

## Architecture

```text
src/
├── data/
│   └── portfolio.ts
├── styles/
│   └── main.css
├── three/
│   └── PortfolioScene.ts
├── ui/
│   └── mountUI.ts
└── main.ts
```

## Direction artistique actuelle

La scène sert de fond spatial / technique discret :

- noyau 3D en icosaèdre métallique ;
- wireframe lumineux ;
- anneaux orbitaux ;
- nuage de particules ;
- grille technique ;
- parallaxe à la souris ;
- animation liée au scroll.

Le contenu HTML reste au-dessus de Three.js pour préserver :

- accessibilité ;
- SEO ;
- lisibilité ;
- responsive ;
- performance.

## Prochaines étapes recommandées

1. Remplacer les projets placeholder par les études de cas définitives.
2. Ajouter des textures / modèles GLTF uniquement si elles servent réellement l'expérience.
3. Mettre en place une transition de scène par section.
4. Ajouter une page `/project/:slug` ou un système de modales détaillées.
5. Remplacer l'adresse email placeholder.
6. Ajouter analytics respectueux de la vie privée.
7. Déployer sur Cloudflare Pages / Netlify / Vercel.

## Philosophie

Le 3D doit augmenter la perception de qualité du portfolio, pas cacher le contenu.
Le DOM reste la couche principale ; Three.js apporte mouvement, profondeur et identité.
