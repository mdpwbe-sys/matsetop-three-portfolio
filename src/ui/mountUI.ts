import { projects, services } from "../data/portfolio";

export function mountUI(root: HTMLElement) {
  root.innerHTML = `
    <header class="topbar">
      <a class="brand" href="#home" aria-label="Accueil">
        <span class="brand__mark" title="Noyau 3D interactif">
          <canvas id="brand-core" width="38" height="38"></canvas>
        </span>
        <span>MATSETOP</span>
      </a>

      <nav class="nav" aria-label="Navigation principale">
        <a href="#services">Services</a>
        <a href="#projects">Projets</a>
        <a href="#homelab">Homelab Lab</a>
        <a href="#about">Profil</a>
        <a class="nav__cta" href="#contact">Contact</a>
      </nav>
    </header>

    <main>
      <section id="home" class="hero section">
        <div class="hero__content">
          <p class="eyebrow">IT · SYSTEMS · NETWORKS · AUTOMATION</p>

          <h1>
            I fix systems.<br />
            <span>I automate work.</span><br />
            I build tools.
          </h1>

          <p class="hero__lead">
            Support IT, infrastructure, automatisation et développement
            d'outils sur mesure pour résoudre des problèmes concrets.
          </p>

          <div class="hero__actions">
            <a class="button button--primary" href="#projects">Voir les projets</a>
            <a class="button button--ghost" href="#homelab">Explorer le Homelab</a>
          </div>

          <div class="hero__meta">
            <span>Bruxelles · Belgique</span>
            <span class="status"><i></i> Disponible pour missions</span>
          </div>
        </div>

        <div class="scroll-hint" aria-hidden="true">
          <span>SCROLL</span>
          <div></div>
        </div>
      </section>

      <section id="services" class="section content-section">
        <div class="section-heading">
          <p class="eyebrow">01 / SERVICES</p>
          <h2>Du problème à la solution.</h2>
          <p>
            Une approche pragmatique : comprendre le besoin, corriger ce qui bloque,
            automatiser ce qui se répète et construire uniquement ce qui apporte une vraie valeur.
          </p>
        </div>

        <div class="services-grid">
          ${services
            .map(
              (service, index) => `
                <article class="service-card glass-card">
                  <span class="service-card__index">0${index + 1}</span>
                  <h3>${service.title}</h3>
                  <p>${service.text}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </section>

      <section id="projects" class="section content-section">
        <div class="section-heading">
          <p class="eyebrow">02 / SELECTED WORK</p>
          <h2>Projets & réalisations.</h2>
          <p>
            Des projets utilisés comme preuves techniques : systèmes Windows,
            sécurité, automatisation, web et IA locale.
          </p>
        </div>

        <div class="projects-grid">
          ${projects
            .map(
              (project) => `
                <article class="project-card glass-card" data-project="${project.slug}">
                  <div class="project-card__topline">
                    <span>${project.category}</span>
                    <span class="project-status project-status--${project.status}">
                      ${project.status}
                    </span>
                  </div>

                  <h3>${project.name}</h3>
                  <p>${project.description}</p>

                  <div class="tags">
                    ${project.stack.map((tech) => `<span>${tech}</span>`).join("")}
                  </div>

                  ${
                    project.url
                      ? `<a class="project-link" href="${project.url}" target="_blank" rel="noreferrer">Ouvrir ↗</a>`
                      : project.internalRoute
                      ? `<a class="project-link project-link--internal" href="${project.internalRoute}">Explorer le Lab ↓</a>`
                      : `<span class="project-link project-link--muted">Étude de cas bientôt</span>`
                  }
                </article>
              `
            )
            .join("")}
        </div>
      </section>

      <section id="homelab" class="section content-section homelab-section">
        <div class="section-heading">
          <p class="eyebrow">03 / ARCHITECTURE & LAB</p>
          <h2>WSL Multi-Service Homelab</h2>
          <p>
            Cartographie et audit d'une infrastructure hybride auto-hébergée (Ubuntu WSL2 / Windows Host) 
            orchestrant plus de 50 conteneurs avec isolation réseau, supervision temps réel et accès zéro-confiance.
          </p>
        </div>

        <div class="homelab-stats-grid">
          <div class="homelab-stat-card glass-card">
            <span class="homelab-stat-card__number">50+</span>
            <span class="homelab-stat-card__label">Microservices & Conteneurs</span>
            <p>Orchestration modulaire via Docker & Compose sous environnement WSL2 durci.</p>
          </div>
          <div class="homelab-stat-card glass-card">
            <span class="homelab-stat-card__number">37+</span>
            <span class="homelab-stat-card__label">Moniteurs de Disponibilité</span>
            <p>Supervision active end-to-end (Uptime Kuma, Beszel) sur les couches applicatives et reverse proxy.</p>
          </div>
          <div class="homelab-stat-card glass-card">
            <span class="homelab-stat-card__number">Zero</span>
            <span class="homelab-stat-card__label">Exposition Directe Web</span>
            <p>Trafic public routé exclusivement par tunnel chiffré Cloudflare, accès privé restreint via VPN WireGuard.</p>
          </div>
          <div class="homelab-stat-card glass-card">
            <span class="homelab-stat-card__number">*.home.arpa</span>
            <span class="homelab-stat-card__label">DNS Local & Certificats Internes</span>
            <p>Résolution split-horizon (Technitium DNS) avec TLS automatique Caddy sur les domaines privés.</p>
          </div>
        </div>

        <div class="homelab-pillars-grid">
          <article class="homelab-pillar glass-card">
            <div class="homelab-pillar__header">
              <span class="homelab-pillar__tag">Réseau & Sécurité</span>
              <h3>Routage & Cloisonnement</h3>
            </div>
            <ul>
              <li><strong>Réseau privé WireGuard :</strong> Accès distant chiffré avec filtrage strict par pare-feu sur le point d'entrée HTTPS.</li>
              <li><strong>Double Reverse-Proxy :</strong> Caddy pour le réseau privé local/VPN avec TLS interne, Traefik & Cloudflare Tunnel pour les passerelles sécurisées.</li>
              <li><strong>DNS Interne Dédié :</strong> Serveur Technitium DNS gérant la zone locale <code>home.arpa</code> en UDP/TCP.</li>
              <li><strong>Sécurité d'Accès :</strong> Isolation des ports de bases de données (PostgreSQL, MariaDB, Redis) sur réseaux internes Docker étanches.</li>
            </ul>
          </article>

          <article class="homelab-pillar glass-card">
            <div class="homelab-pillar__header">
              <span class="homelab-pillar__tag">Services & Outils</span>
              <h3>Écosystème Applicatif</h3>
            </div>
            <ul>
              <li><strong>ITSM & Support :</strong> GLPI Helpdesk personnalisé pour la gestion de parc, inventaire et ticketing.</li>
              <li><strong>Gestion de Médias & Fichiers :</strong> Chevereto (hébergement d'images), Immich (sauvegarde photos), Filebrowser & Paperless-ngx (GED).</li>
              <li><strong>Domotique & IoT :</strong> Home Assistant pour l'automatisation domotique et la télémétrie des objets connectés.</li>
              <li><strong>Drone Data & Topographie :</strong> Station de traitement des captations aériennes et photogrammétrie terrain.</li>
              <li><strong>Collaboration & Knowledge :</strong> Forum privé sécurisé, AFFiNE, Excalidraw, Vaultwarden et Obsidian.</li>
            </ul>
          </article>

          <article class="homelab-pillar glass-card">
            <div class="homelab-pillar__header">
              <span class="homelab-pillar__tag">IA & Automatisation</span>
              <h3>IA Locale & Pipelines</h3>
            </div>
            <ul>
              <li><strong>Moteurs IA Locaux :</strong> Serveurs Ollama, ComfyUI, Open WebUI et modèles d'inférence embarqués sans fuite de données vers le cloud.</li>
              <li><strong>Agents & Workflows :</strong> Orchestration n8n pour les pipelines d'automatisation et passerelles d'agents IA (Jarvis, MiroFish, Codex).</li>
              <li><strong>Surveillance & Logs :</strong> Métriques matérielles via Beszel, inspection centralisée des conteneurs via Dozzle.</li>
            </ul>
          </article>
        </div>

        <div class="homelab-audit-card glass-card">
          <div class="homelab-audit-card__header">
            <span class="eyebrow">MÉTHODOLOGIE D'AUDIT & RÉSULTATS</span>
            <h3>Revue d'Architecture & Bonnes Pratiques</h3>
          </div>
          <div class="homelab-audit-grid">
            <div class="homelab-audit-item">
              <span class="audit-badge audit-badge--ok">Conforme</span>
              <h4>Exposition Réseau Sécurisée</h4>
              <p>Aucun port d'administration web n'est publié directement sur le WAN. Tous les flux publics transitent par tunnel chiffré sans ouverture de port entrant.</p>
            </div>
            <div class="homelab-audit-item">
              <span class="audit-badge audit-badge--ok">Conforme</span>
              <h4>Supervision Complète</h4>
              <p>Contrôle de disponibilité end-to-end des routes utilisateur et des couches de transport (HTTP/TLS/DNS) en plus des backends applicatifs.</p>
            </div>
            <div class="homelab-audit-item">
              <span class="audit-badge audit-badge--ok">Optimisé</span>
              <h4>Persistance des Réseaux</h4>
              <p>Déclaration pérenne des ponts inter-conteneurs dans Compose pour préserver la connectivité et la résolution DNS interne après redémarrage.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" class="section content-section split-section">
        <div>
          <p class="eyebrow">04 / PROFILE</p>
          <h2>Technicien & Ingénierie de Solutions.</h2>
        </div>

        <div class="about-copy">
          <p>
            À l'intersection du support IT, de l'administration systèmes/réseaux (Homelab WSL2, DNS local home.arpa, microservices)
            et de l'assistance numérique technique. Mon objectif : résoudre rapidement les incidents, automatiser les flux de travail
            et concevoir des solutions opérationnelles pérennes.
          </p>

          <div class="skills">
            <span>Windows & WSL2</span>
            <span>Linux & Docker</span>
            <span>DNS & Networking (home.arpa)</span>
            <span>GLPI / Helpdesk</span>
            <span>Chevereto & Immich</span>
            <span>Home Assistant & IoT</span>
            <span>Active Directory & M365</span>
            <span>PowerShell & Python</span>
            <span>Drone & Captation Aérienne</span>
            <span>Three.js / Web</span>
          </div>
        </div>
      </section>

      <section id="contact" class="section contact-section">
        <p class="eyebrow">05 / CONTACT</p>
        <h2>Un problème à résoudre ?</h2>
        <p>
          Dépannage, automatisation ou petit outil sur mesure :
          expliquez-moi simplement ce qui vous fait perdre du temps.
        </p>

        <a class="button button--primary" href="mailto:hello@matsetop.be">
          hello@matsetop.be
        </a>
      </section>
    </main>

    <footer>
      <span>© ${new Date().getFullYear()} Matsetop</span>
      <span>Built with Three.js</span>
    </footer>
  `;

  installSmoothNavigation();
}

function installSmoothNavigation() {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;

      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}
