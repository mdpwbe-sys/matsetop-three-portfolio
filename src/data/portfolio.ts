export type Project = {
  name: string;
  slug: string;
  category: string;
  description: string;
  stack: string[];
  status: "live" | "prototype" | "lab";
  url?: string;
  internalRoute?: string;
};

export const projects: Project[] = [
  {
    name: "AeroAssist & TopoSurvey",
    slug: "aero-assist-topo",
    category: "Drone & Aerial Digital Assistance",
    description:
      "Assistance numérique sur le terrain pour la création de devis, observations techniques par drone, captation de contenus et modélisation de plans aériens pour chantiers et expertises.",
    stack: ["Drone Photogrammetry", "GIS", "CAD/Plans", "Data Processing"],
    status: "live",
    url: "https://atsetop.be"
  },
  {
    name: "GLPI Custom IT Service Desk",
    slug: "glpi-custom-helpdesk",
    category: "IT Service Management",
    description:
      "Déploiement et personnalisation intégrale d'un Helpdesk GLPI sur mesure : gestion de parc d'équipements, SLA, formulaires de tickets automatisés et flux d'escalade.",
    stack: ["GLPI", "ITIL", "MariaDB", "PHP", "Linux / Docker"],
    status: "live",
    url: "https://helpdesk.balboing.com"
  },
  {
    name: "CollabVault & Remote Hub",
    slug: "collabvault-remote-hub",
    category: "Collaborative Platform & Media",
    description:
      "Plateforme privée communautaire intégrant partage de fichiers multimédias chiffrés, gestion de documents et flux collaboratifs en temps réel à faible latence (P2P / WebRTC).",
    stack: ["phpBB / Node.js", "WebSockets", "P2P / WebRTC", "Storage"],
    status: "live",
    url: "https://forum.balboing.com"
  },
  {
    name: "WSL Multi-Service Homelab",
    slug: "wsl-homelab-infrastructure",
    category: "Infrastructure & Networking",
    description:
      "Architecture Homelab hybride sous WSL2/Linux : orchestration de 50+ microservices (Activepieces, GLPI, Chevereto, WebODM, Home Assistant, Ollama), double reverse proxy SSL, zone DNS privée (home.arpa) et modèle zéro-confiance.",
    stack: ["WSL2", "Docker", "DNS / home.arpa", "Caddy / Traefik", "WireGuard", "Activepieces", "Uptime Kuma"],
    status: "live",
    internalRoute: "/homelab.html"
  },
  {
    name: "SafeDrag",
    slug: "safedrag",
    category: "Windows Utility",
    description:
      "Utilitaire Windows sécurisé réduisant les déplacements accidentels de fichiers et protégeant les manipulations de glisser-déposer dans l'Explorateur.",
    stack: [".NET 10", "WPF", "Windows Hook", "C#"],
    status: "live",
    url: "https://github.com/mdpwbe-sys/SafeDrag"
  },
  {
    name: "RGPD.click",
    slug: "rgpd-click",
    category: "Knowledge Platform",
    description:
      "Base de connaissances RGPD structurée autour de sources officielles, jurisprudence et outils d'aide à la décision.",
    stack: ["HTML", "CSS", "JavaScript", "SEO"],
    status: "live",
    url: "https://rgpd.click"
  },
  {
    name: "Secure CV Hub",
    slug: "secure-cv-hub",
    category: "Security & Privacy",
    description:
      "Portail de CV sécurisé avec chiffrement côté client et contrôle d'accès sécurisé aux données personnelles.",
    stack: ["Web Crypto", "AES-GCM", "PBKDF2", "Frontend"],
    status: "live",
    url: "https://cv-mdp.netlify.app"
  },
  {
    name: "Jarvis / AI Lab",
    slug: "jarvis-ai-lab",
    category: "AI & Automation",
    description:
      "Suite complète d'assistance IA autonome locale, orchestration d'agents (OpenClaw), contrôle KVM, clients Desktop et Mobile iOS.",
    stack: ["Python", "Ollama", "Electron", "React Native", "KVM"],
    status: "live",
    url: "https://github.com/mdpwbe-sys/Jarvis.package"
  },
  {
    name: "DiagToolIT",
    slug: "diagtoolit",
    category: "IT Support L3 & Forensics",
    description:
      "Suite d'ingénierie système autonome, audit prédictif, scanner CVE (CVSS >= 7.0), télémétrie matérielle et cartographie 3D WebGL pour techniciens N3.",
    stack: ["PowerShell 7+", "Three.js", "CVE Scanner", "i18n (4 Langues)", "Windows API"],
    status: "live",
    url: "https://github.com/mdpwbe-sys/DiagToolIT"
  },
  {
    name: "MMD - Market & Tactical Engine",
    slug: "mmd-market-engine",
    category: "Financial Analytics & Spatial Map",
    description:
      "Application de trading de marché et cartographie spatiale 3D temps réel pour EVE Online : analyse d'ordres multi-personnages (ESI OAuth2), flux de combat zKillboard/R2Z2 et moteur de routage sécurisé.",
    stack: ["Python 3.14", "EVE Online ESI", "SQLite WAL", "Three.js / 3D Map", "AsyncIO"],
    status: "live",
    url: "https://github.com/mdpwbe-sys/mmd-public-trader"
  },
  {
    name: "CardStudio - Cartes de Visite Next-Gen",
    slug: "cardstudio-nextgen",
    category: "Web App & Print-on-Demand",
    description:
      "Studio de personnalisation en ligne de cartes de visite interactives (éditeur HTML5/CSS3/Canvas haute résolution, micro-animations, prévisualisation 3D temps réel) avec service d'impression premium et livraison à domicile.",
    stack: ["HTML5 Canvas", "CSS3 3D / Shaders", "JavaScript", "Vector Export / PDF Print", "E-Commerce"],
    status: "prototype"
  },
  {
    name: "Ultra E-Shop & Analytics Suite",
    slug: "ultra-eshop",
    category: "Full-Stack E-Commerce & BI",
    description:
      "Plateforme e-commerce responsive complète avec espace d'administration CSM, gestion de stock temps réel, encaissement Stripe et pipelines n8n automatisés pour l'import de métriques vers Power BI.",
    stack: ["TypeScript", "Stripe API", "n8n Automation", "Power BI", "PostgreSQL / REST"],
    status: "live",
    url: "https://morromodscreen.web1337.net"
  }
];

export const services = [
  {
    title: "IT Support & Helpdesk",
    text: "Diagnostic hardware/OS, déploiement Helpdesk GLPI, maintenance de parcs, réseaux et résolutions d'incidents Niveau 1-3."
  },
  {
    title: "Automatisation & DevOps",
    text: "Scripts PowerShell/Python, orchestration Docker, workflows d'infrastructure et suppression des tâches répétitives."
  },
  {
    title: "Assistance Numérique & Terrain",
    text: "Relevés d'observation, captation aérienne par drone pour devis/plans, et création de petits outils sur mesure."
  }
];
