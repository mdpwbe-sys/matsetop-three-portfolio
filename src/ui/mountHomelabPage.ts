import { labGroups } from "../data/homelab";

export function mountHomelabPage(root: HTMLElement) {
  const count = labGroups.reduce((total, group) => total + group.services.length, 0);
  root.innerHTML = `
    <header class="topbar">
      <a class="brand" href="/#home" aria-label="Accueil"><span class="brand__mark"><canvas id="brand-core" width="38" height="38" aria-hidden="true"></canvas></span><span>MATSETOP</span></a>
      <nav class="nav" aria-label="Navigation principale"><a href="/#services">Services</a><a href="/#projects">Projets</a><a href="/#about">Profil</a><a class="nav__cta" href="/#contact">Contact</a></nav>
    </header>
    <main class="case-study-page homelab-page">
      <article class="case-study-container">
        <header class="case-study-header">
          <a class="back-link" href="/#projects">← Retour au portfolio</a>
          <div class="case-study-meta"><span class="eyebrow">SYSTEMS · AUTOMATION · LOCAL AI</span><span class="read-time">Inventaire éditorial · octobre 2026</span></div>
          <h1 class="case-study-title">Un homelab hybride.<br>Des services, des liens, des usages.</h1>
          <p class="case-study-lead">Windows et Ubuntu WSL2 accueillent une infrastructure personnelle pour développer, automatiser, créer et conserver des données. Docker, services Linux et outils de bureau forment un ensemble piloté, surveillé et sauvegardé.</p>
          <div class="case-study-tags"><span>WSL2 / Ubuntu</span><span>Docker & Compose</span><span>CasaOS + Coolify</span><span>IA & médias</span><span>Récupération testée</span></div>
        </header>
        <div class="lab-overview">
          <div class="glass-card lab-summary"><span class="eyebrow">INVENTAIRE</span><strong>${count}</strong><p>Briques décrites, regroupées par usage. Ce nombre inclut socle, applications et dépendances : ce n’est pas un compteur de conteneurs actifs.</p></div>
          <div class="glass-card lab-summary"><span class="eyebrow">EXÉCUTION</span><strong>Étagée</strong><p>Infrastructure essentielle en priorité, démarrage différé pour certains outils IA et backends lourds à la demande.</p></div>
          <div class="glass-card lab-summary"><span class="eyebrow">ACCÈS</span><strong>Sélectif</strong><p>Services publics choisis, outils privés derrière les accès prévus. Cette page présente les usages, pas les consoles d’administration.</p></div>
        </div>
        <nav class="lab-index" aria-label="Sections du homelab"><a href="#architecture">Architecture</a>${labGroups.map(g => `<a href="#${g.id}">${g.title}</a>`).join("")}<a href="#recovery">Résilience</a><a href="#projects">Projets actuels</a></nav>
        <section class="case-study-section" id="architecture">
          <span class="eyebrow">01 / RELATIONS</span><h2>Une architecture par couches</h2>
          <div class="lab-flows">
            <article class="glass-card lab-flow"><h3>Accès public</h3><p class="lab-route">Internet → Cloudflare → tunnel → services publiés</p><p>La publication d’un service est un choix explicite. Elle est séparée de la gestion des applications et de leurs dépendances.</p></article>
            <article class="glass-card lab-flow"><h3>Accès privé</h3><p class="lab-route">Réseau local / WireGuard → DNS → proxy TLS → applications</p><p>Technitium fournit la résolution ; Caddy achemine les requêtes HTTPS. L’authentification dépend ensuite du service et de sa passerelle.</p></article>
            <article class="glass-card lab-flow"><h3>Exécution & données</h3><p class="lab-route">Windows → WSL2 → Docker / systemd → stockage persistant</p><p>CasaOS et Coolify administrent leurs stacks. Le code, les images de build et les données de production sont conservés comme éléments distincts.</p></article>
            <article class="glass-card lab-flow"><h3>Observer & récupérer</h3><p class="lab-route">Sondes + métriques + logs → diagnostic → backup / restauration</p><p>Uptime Kuma, Beszel et Dozzle donnent des vues complémentaires. Duplicati et les dumps de bases protègent les éléments nécessaires à la reconstruction.</p></article>
          </div>
          <p class="lab-note">Schéma logique simplifié : il ne représente pas chaque route réseau. Un hôte principal reste un point de dépendance ; ce lab n’est pas une infrastructure haute disponibilité.</p>
        </section>
        ${labGroups.map((group, index) => `
          <section class="case-study-section lab-category" id="${group.id}" aria-labelledby="title-${group.id}">
            <span class="eyebrow">${String(index + 2).padStart(2, "0")} / ${group.services.length} BRIQUES</span>
            <h2 id="title-${group.id}">${group.title}</h2><p>${group.intro}</p>
            <div class="lab-service-grid">${group.services.map(s => `<article class="glass-card lab-service"><span class="lab-role">${s.role}</span><h3>${s.name}</h3><p>${s.description}</p></article>`).join("")}</div>
          </section>`).join("")}
        <section class="case-study-section" id="recovery">
          <span class="eyebrow">LIFECYCLE / RECOVERY</span><h2>Résilience : préparer la relance</h2>
          <p>Le durcissement vise un cycle complet : démarrer, fonctionner, terminer les écritures, puis redémarrer. Les contrôles et les essais de restauration réduisent les fragilités sans garantir l’absence d’incident.</p>
          <ol class="lab-lifecycle"><li><strong>Preflight</strong><span>Vérifier fichiers, montages et données indispensables. Un secret, une clé ou une base absente ne sont pas recréés silencieusement.</span></li><li><strong>Boot ordonné</strong><span>Attendre Docker, DNS et passerelles avec des délais bornés, puis relancer les services permanents attendus.</span></li><li><strong>Readiness</strong><span>Tester réponses DNS et HTTP, état des services et dépendances. Préserver les lancements différés et à la demande.</span></li><li><strong>Arrêt contrôlé</strong><span>Mettre les tâches au repos, laisser les bases terminer leurs écritures et arrêter les services avant la fermeture de WSL.</span></li></ol>
          <div class="lab-flows"><article class="glass-card lab-flow"><h3>Montages protégés</h3><p>Les sources critiques sont vérifiées comme fichiers ou dossiers selon leur usage. Les configurations durcies refusent un bind absent au lieu de créer un répertoire inattendu.</p></article><article class="glass-card lab-flow"><h3>Trois périmètres de backup</h3><p>Configurations du lab, projets en cours et bibliothèques personnelles ont des tâches distinctes. Les caches, environnements reconstruisibles et modèles IA sont exclus selon le périmètre.</p></article><article class="glass-card lab-flow"><h3>Données cohérentes</h3><p>Dumps SQL, snapshots SQLite cohérents, exports de configuration et guide de restauration accompagnent les archives chiffrées. Des restaurations de fichiers et de bases ont été vérifiées.</p></article><article class="glass-card lab-flow"><h3>Disponibilité ≠ sauvegarde</h3><p>Un service qui répond peut encore avoir des données à protéger. Une copie locale n’atteste pas à elle seule d’une copie cloud terminée : publication et contrôles sont des étapes distinctes.</p></article></div>
        </section>
        <section class="case-study-section" id="security-principles"><h2>Sécurité : des décisions explicites</h2><ul class="case-study-list"><li><strong>Accès limité :</strong> séparer publication publique, accès privé et administration ; conserver l’authentification des passerelles et applications.</li><li><strong>Secrets séparés :</strong> sauvegarder les éléments nécessaires à la récupération dans des archives chiffrées, sans les exposer dans le portfolio.</li><li><strong>Alertes sans suppression :</strong> le watchdog Windows signale les fichiers à examiner ; un moteur indisponible est un état dégradé à diagnostiquer.</li><li><strong>Visibilité mesurée :</strong> l’observation WSL ne couvre pas tout Windows, et un contrôle de santé ne remplace pas une validation fonctionnelle authentifiée.</li></ul></section>
        <section class="case-study-section" id="projects"><span class="eyebrow">CURRENT PROJECTS</span><h2>Ce que le lab permet de construire</h2><div class="lab-flows"><article class="glass-card lab-flow"><h3>JARVIS · sécurité & pilotage</h3><p>Une interface Windows associe surveillance de fichiers, alertes et contrôle du cycle d’arrêt du homelab depuis la zone de notification.</p></article><article class="glass-card lab-flow"><h3>Forum · une seule codebase</h3><p>Le même forum fonctionne via accès classique, Tor et I2P. Ses polices et bibliothèques frontend sont auto-hébergées, y compris le lecteur HLS.</p></article><article class="glass-card lab-flow"><h3>ATSETOP · photo & drone</h3><p>Le portail relie carnet de vol, photogrammétrie, galeries et diffusion vidéo. Chaque outil garde sa fonction et ses dépendances propres.</p></article><article class="glass-card lab-flow"><h3>IA · création & automatisation</h3><p>Agents, workflows visuels, recherche et audio partagent la même infrastructure avec une attention portée au démarrage et à l’usage des ressources.</p></article></div></section>
        <footer class="case-study-footer glass-card"><div><h3>Relier les outils à leurs usages.</h3><p>Infrastructure, automatisation, diagnostic et récupération : les projets du lab alimentent une pratique concrète du support IT.</p></div><div class="case-study-footer__actions"><a class="button button--primary" href="/#contact">Parlons de votre projet</a><a class="button button--ghost" href="/#projects">Retour au portfolio</a></div></footer>
      </article>
    </main>
    <footer><span>© ${new Date().getFullYear()} Matsetop</span><span>Built with Three.js</span></footer>
  `;
}
