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
        <a href="/homelab.html">Homelab Lab ↗</a>
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
            <a class="button button--ghost" href="/homelab.html">Étude de Cas Homelab ↗</a>
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
                      ? `<a class="project-link project-link--internal" href="${project.internalRoute}">Lire l'étude de cas ↗</a>`
                      : `<span class="project-link project-link--muted">Étude de cas bientôt</span>`
                  }
                </article>
              `
            )
            .join("")}
        </div>
      </section>

      <section id="about" class="section content-section split-section">
        <div>
          <p class="eyebrow">03 / PROFILE</p>
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
            <span>Activepieces & n8n</span>
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
        <p class="eyebrow">04 / CONTACT</p>
        <h2>Un problème à résoudre ?</h2>
        <p>
          Dépannage, automatisation ou petit outil sur mesure :
          expliquez-moi simplement ce qui vous fait perdre du temps.
        </p>

        <a class="button button--primary" href="mailto:hello@atsetop.be">
          hello@atsetop.be
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
