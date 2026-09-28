export type Project = {
  name: string;
  slug: string;
  category: string;
  description: string;
  stack: string[];
  status: "live" | "prototype" | "lab";
  url?: string;
};

export const projects: Project[] = [
  {
    name: "AeroAssist & TopoSurvey",
    slug: "aero-assist-topo",
    category: "Drone & Aerial Digital Assistance",
    description:
      "Assistance numérique sur le terrain pour la création de devis, observations techniques par drone, captation de contenus et modélisation de plans aériens pour chantiers et expertises.",
    stack: ["Drone Photogrammetry", "GIS", "CAD/Plans", "Data Processing"],
    status: "live"
  },
  {
    name: "GLPI Custom IT Service Desk",
    slug: "glpi-custom-helpdesk",
    category: "IT Service Management",
    description:
      "Déploiement et personnalisation intégrale d'un Helpdesk GLPI sur mesure : gestion de parc d'équipements, SLA, formulaires de tickets automatisés et flux d'escalade.",
    stack: ["GLPI", "ITIL", "MariaDB", "PHP", "Linux / Docker"],
    status: "live"
  },
  {
    name: "CollabVault & Remote Hub",
    slug: "collabvault-remote-hub",
    category: "Collaborative Platform & Media",
    description:
      "Plateforme privée communautaire intégrant partage de fichiers multimédias chiffrés, gestion de documents et flux collaboratifs en temps réel à faible latence (P2P / WebRTC).",
    stack: ["phpBB / Node.js", "WebSockets", "P2P / WebRTC", "Storage"],
    status: "live"
  },
  {
    name: "WSL Multi-Service Homelab",
    slug: "wsl-homelab-infrastructure",
    category: "Infrastructure & Networking",
    description:
      "Architecture Homelab hybride sous WSL2/Linux : orchestration de microservices open-source, serveur DNS local sécurisé (zone home.arpa), reverse proxy SSL et routage réseau dédié.",
    stack: ["WSL2", "Docker", "DNS / home.arpa", "Reverse Proxy", "Linux"],
    status: "lab"
  },
  {
    name: "SafeDrag",
    slug: "safedrag",
    category: "Windows Utility",
    description:
      "Utilitaire Windows conçu pour réduire les déplacements accidentels de fichiers et sécuriser les manipulations dans l'Explorateur.",
    stack: [".NET", "Windows", "Shell", "UX"],
    status: "prototype"
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
    status: "prototype"
  },
  {
    name: "Jarvis / AI Lab",
    slug: "jarvis-ai-lab",
    category: "AI & Automation",
    description:
      "Environnement expérimental d'agents IA, modèles locaux, automatisation système et passerelles de contrôle distant.",
    stack: ["Python", "LLM", "Ollama", "Automation"],
    status: "lab"
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

