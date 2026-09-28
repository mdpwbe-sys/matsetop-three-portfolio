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
    name: "SafeDrag",
    slug: "safedrag",
    category: "Windows Utility",
    description:
      "Utilitaire Windows conçu pour réduire les déplacements accidentels de fichiers et améliorer la sécurité des manipulations dans Explorer.",
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
    category: "Security",
    description:
      "Portail de CV sécurisé avec chiffrement côté client et accès contrôlé.",
    stack: ["Web Crypto", "AES-GCM", "PBKDF2", "Frontend"],
    status: "prototype"
  },
  {
    name: "Jarvis / AI Lab",
    slug: "jarvis-ai-lab",
    category: "AI & Automation",
    description:
      "Environnement expérimental d'agents, modèles locaux, automatisation et contrôle distant.",
    stack: ["Python", "LLM", "Ollama", "Automation"],
    status: "lab"
  }
];

export const services = [
  {
    title: "IT Fix",
    text: "Diagnostic Windows, matériel, réseau, logiciels, sauvegardes et assistance."
  },
  {
    title: "IT Automate",
    text: "Scripts, workflows, PowerShell, Python et automatisations adaptées aux tâches répétitives."
  },
  {
    title: "IT Build",
    text: "Petits outils métiers, interfaces internes, prototypes et reprise de projets existants."
  }
];
