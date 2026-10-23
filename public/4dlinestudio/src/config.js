// Configuration publique : aucune clé privée ni secret ici.
const mediaRoot = new URL('../public/assets/portfolio/', import.meta.url).href;
const modelRoot = new URL('../public/assets/models/', import.meta.url).href;
const studioImage = (number, label, alt) => ({
  kind: 'image',
  src: `${mediaRoot}studio-${number}-1920.webp`,
  srcset: `${mediaRoot}studio-${number}-960.webp 960w, ${mediaRoot}studio-${number}-1920.webp 1920w`,
  thumbnail: `${mediaRoot}studio-${number}-320.webp`,
  width: 1920,
  height: number === 22 ? 1287 : 1263,
  label,
  alt
});

export const siteConfig = {
  brand: '4D LINE CONCEPT',
  email: 'hello@atsetop.be',
  cityLabel: 'Belgique • projets à distance ou sur étude',
  canonicalUrl: 'https://m.atsetop.be/4dlinestudio/',
  projects: [
    {
      id: 'studio',
      featured: true,
      title: 'Appartement studio — Modélisation & rendu 3D',
      category: '01 / PROJET PRINCIPAL',
      caption: 'Explorer un studio en images et en mouvement : espace de vie, kitchenette et salle d’eau. Cinq rendus et une visite vidéo donnent à voir les volumes, les matières et la lumière du modèle 3D.',
      type: 'Visualisation & rendu 3D',
      note: 'Une représentation numérique du studio. Ces visuels ne présentent pas des travaux réalisés par l’agence.',
      media: [
        studioImage(17, 'Vue d’ensemble', 'Rendu 3D du studio : pièce de vie et kitchenette dans des tons clairs.'),
        studioImage(18, 'Salle d’eau', 'Rendu 3D de la salle d’eau du studio, avec douche, vasque et toilettes.'),
        studioImage(20, 'Espace de vie', 'Rendu 3D de la pièce de vie du studio et de son accès à la salle d’eau.'),
        studioImage(21, 'Kitchenette · détail', 'Rendu 3D de la kitchenette : évier, plaques et rangements.'),
        studioImage(22, 'Kitchenette · perspective', 'Rendu 3D en perspective de la kitchenette et de son intégration dans le studio.'),
        { kind: 'video', src: `${mediaRoot}studio.mp4`, poster: `${mediaRoot}studio-poster.webp`, label: 'Visite vidéo', alt: 'Visite du modèle 3D de l’appartement studio.', width: 1920, height: 1080 }
      ]
    },
    {
      id: 'van',
      featured: false,
      title: 'Projet van — Modélisation & rendu 3D',
      category: '02 / AUTRE HORIZON',
      caption: 'La visualisation 3D se prête aussi à d’autres univers. Cette vidéo explore un projet de van et illustre une approche ouverte aux espaces et aux projets variés.',
      type: 'Visualisation & rendu 3D',
      note: 'Une étude visuelle en 3D, sans prestation de construction ni d’aménagement réel.',
      media: [
        { kind: 'video', src: `${mediaRoot}van.mp4`, poster: `${mediaRoot}van-poster.webp`, label: 'Découvrir le van', alt: 'Présentation vidéo du modèle 3D du van.', width: 1920, height: 1080 }
      ]
    }
  ]
};

// Modèles personnels exportés depuis SketchUp, servis exclusivement en local.
export const interactiveModels = [
  { id: 'studio', label: 'Appartement studio', src: `${modelRoot}studio.glb`, poster: `${mediaRoot}studio-poster.webp`, orbit: '125deg 65deg 115%', interiorOrbit: '65deg 85deg 0.015m' },
  { id: 'van', label: 'Projet van', src: `${modelRoot}van.glb`, poster: `${mediaRoot}van-poster.webp`, orbit: '125deg 65deg 115%', interiorOrbit: '90deg 85deg 0.08m', interiorOffset: { z: 0.2 }, interiorRadius: '0.08m', interiorRadiusMax: '2.5m' }
];
