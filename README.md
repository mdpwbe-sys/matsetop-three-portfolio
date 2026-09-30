# Matsetop — 3D Systems & Automation Portfolio

[![Deploy to GitHub Pages](https://github.com/mdpwbe-sys/matsetop-three-portfolio/actions/workflows/deploy.yml/badge.svg)](https://m.atsetop.be)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built with Three.js](https://img.shields.io/badge/Built%20with-Three.js-000000.svg?logo=three.dot.js)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF.svg?logo=vite)](https://vitejs.dev/)

> Portfolio interactif 3D dédié aux services et réalisations en **Support IT, Infrastructure Systèmes & Réseaux, Automatisation et Outillage sur mesure**.

🌐 **Production live** : [https://m.atsetop.be](https://m.atsetop.be)

---

## ⚡ Stack Technique

- **Moteur 3D** : Three.js (r179) natif (sans surcouche lourde)
- **Bundler & Dev Server** : Vite 7 + TypeScript 5
- **Design & UI** : HTML5 sémantique, CSS Modern Glassmorphism, Responsive Mobile & Desktop
- **Déploiement** : GitHub Actions (CI/CD automatisé) ➔ GitHub Pages avec domaine personnalisé `m.atsetop.be`

---

## 🎨 Caractéristiques 3D

1. **Brand Core (Logo Header 3D interactif)** :
   - Cœur icosaédrique saphir avec étincelle interne.
   - Cage icosaédrique extérieure en acier inox brossé / gunmetal sombre.
   - Anneaux gyroscopiques contrarotatifs (cyan & émeraude).
   - Vortex de 85 particules quantiques en dérive orbitale lente.
   - Réaction au survol et à l'interaction souris.

2. **Scène d'Arrière-Plan (Topologie Réseau & Infrastructure IT)** :
   - Nœuds de calcul et arêtes géodésiques d'interconnexion.
   - Paquets de données circulant en temps réel le long des routes réseau.
   - Anneaux de télémétrie orbitaux.
   - Parallaxe fluide avec inertie souris et réactivité au défilement (scroll).

---

## 🚀 Démarrage Rapide

### Prérequis
- Node.js (v18+)
- npm ou pnpm

### Installation
```bash
# Cloner le dépôt
git clone https://github.com/YOUR_USERNAME/matsetop-three-portfolio.git
cd matsetop-three-portfolio

# Installer les dépendances
npm install

# Démarrer le serveur de développement local
npm run dev
```

L'application sera accessible sur `http://localhost:5173`.

### Build pour la Production
```bash
npm run build
npm run preview
```

---

## 📁 Architecture du Projet

```text
matsetop-three-portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml        # Workflow de déploiement GitHub Pages
├── public/
│   └── CNAME                 # Configuration du domaine personnalisé (matsetop.be)
├── src/
│   ├── data/
│   │   └── portfolio.ts      # Données des projets et des services
│   ├── styles/
│   │   └── main.css          # Styles dark luxury tech & glassmorphism
│   ├── three/
│   │   ├── BrandCore.ts      # Mini-noyau 3D interactif du logo header
│   │   └── PortfolioScene.ts # Scène 3D d'arrière-plan (topologie & réseau)
│   ├── ui/
│   │   └── mountUI.ts        # Rendu sémantique de l'interface utilisateur
│   └── main.ts               # Point d'entrée & initialisation WebGL
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── LICENSE                   # Licence MIT
└── README.md
```

---

## 🔒 Confidentialité & Données Personnelles

Ce dépôt public contient uniquement le code source du portfolio interactif. Les documents sensibles (CV complet, détails confidentiels d'infrastructures d'entreprises) sont hébergés et protégés séparément sur un portail sécurisé dédié.

---

## 📄 Licence

Ce projet est sous licence [MIT](LICENSE).

