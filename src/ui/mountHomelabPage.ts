export function mountHomelabPage(root: HTMLElement) {
  root.innerHTML = `
    <header class="topbar">
      <a class="brand" href="/#home" aria-label="Accueil">
        <span class="brand__mark" title="Noyau 3D interactif">
          <canvas id="brand-core" width="38" height="38"></canvas>
        </span>
        <span>MATSETOP</span>
      </a>

      <nav class="nav" aria-label="Navigation principale">
        <a href="/#services">Services</a>
        <a href="/#projects">Projets</a>
        <a href="/#about">Profil</a>
        <a class="nav__cta" href="/#contact">Contact</a>
      </nav>
    </header>

    <main class="case-study-page">
      <article class="case-study-container">
        
        <!-- HEADER / HERO DE L'ÉTUDE DE CAS -->
        <header class="case-study-header">
          <a class="back-link" href="/#projects">← Retour au portfolio</a>
          <div class="case-study-meta">
            <span class="eyebrow">INFRASTRUCTURE · NETWORKING · SECURITY · LAB</span>
            <span class="read-time">⏱️ 12 Min Read</span>
          </div>
          <h1 class="case-study-title">Building and Securing a Multi-Service Hybrid Home Lab</h1>
          <p class="case-study-lead">
            Architecture, isolation réseau, reverse-proxying double flux, zone DNS privée split-horizon, 
            supervision temps réel et modèle de sécurité zéro-confiance pour plus de 50 microservices interconnectés (Activepieces, GLPI, Chevereto, WebODM, Home Assistant, Ollama).
          </p>
          <div class="case-study-tags">
            <span>WSL2 / Linux</span>
            <span>Docker & Compose</span>
            <span>Coolify & Traefik</span>
            <span>Technitium DNS (*.home.arpa)</span>
            <span>Caddy Gateway</span>
            <span>WireGuard Zero-Trust</span>
            <span>Cloudflare Tunnel</span>
            <span>Activepieces & n8n</span>
            <span>Uptime Kuma & Beszel</span>
            <span>Local AI (Ollama & Open WebUI)</span>
            <span>GLPI ITSM</span>
            <span>Chevereto & Immich</span>
            <span>WebODM & Drone Log</span>
            <span>Home Assistant</span>
          </div>
        </header>

        <!-- INTRODUCTION -->
        <section class="case-study-section">
          <h2>1. Vision Globale & Philosophie du Lab</h2>
          <p>
            Plutôt que de dédier une machine physique à une seule application ou d'empiler des conteneurs de manière monolithique, 
            ce lab a été conçu comme une <strong>plateforme d'infrastructure agile, sécurisée et modulaire</strong>. Il sert d'environnement 
            d'expérimentation et de production pour l'administration système Linux, l'orchestration Docker Compose / Coolify, l'ingénierie réseau, 
            la sécurité périmétrique, la supervision proactive et le déploiement d'IA locale souveraine.
          </p>
          <p>
            L'environnement orchestre plus de 50 conteneurs actifs répartis en piles thématiques interconnectées par des réseaux virtuels dédiés.
          </p>
          
          <div class="homelab-stats-grid">
            <div class="homelab-stat-card glass-card">
              <span class="homelab-stat-card__number">50+</span>
              <span class="homelab-stat-card__label">Microservices Opérationnels</span>
              <p>Orchestration modulaire sous Ubuntu WSL2 durci et hôte Windows physique.</p>
            </div>
            <div class="homelab-stat-card glass-card">
              <span class="homelab-stat-card__number">37+</span>
              <span class="homelab-stat-card__label">Moniteurs Actifs</span>
              <p>Supervision active end-to-end (routes HTTP/TLS, résolutions DNS, API et métriques matérielles).</p>
            </div>
            <div class="homelab-stat-card glass-card">
              <span class="homelab-stat-card__number">Zero</span>
              <span class="homelab-stat-card__label">Port Web Exposé sur le WAN</span>
              <p>Flux publics exclusivement sécurisés via Cloudflare Tunnel chiffré sans ouverture de port entrant.</p>
            </div>
            <div class="homelab-stat-card glass-card">
              <span class="homelab-stat-card__number">*.home.arpa</span>
              <span class="homelab-stat-card__label">Zone DNS & TLS Interne</span>
              <p>Résolution split-horizon (Technitium DNS) avec certificats SSL locaux automatiques (Caddy).</p>
            </div>
          </div>
        </section>

        <!-- FLUX & TOPOLOGIE -->
        <section class="case-study-section">
          <h2>2. Topologie Réseau & Flux de Communication</h2>
          <p>
            L'architecture applique une séparation stricte entre les <strong>accès internes privés</strong> (réservés au LAN et aux pairs VPN authentifiés) 
            et les <strong>rares points d'entrée publics</strong>.
          </p>

          <div class="diagram-card glass-card">
            <div class="diagram-title">Schéma d'Architecture & Flux Logique</div>
            <pre class="ascii-diagram">
+-----------------------------------------------------------------------------------+
|                              POINTS D'ACCÈS CLIENTS                               |
|                                                                                   |
|   [ Client Externe / Internet ]                    [ Client Distant / LAN ]       |
|                 │                                              │                  |
|                 ▼ (Tunnel sortant chiffré)                     ▼ (Tunnel VPN)     |
|       ┌──────────────────┐                           ┌──────────────────┐         |
|       │ Cloudflare Edge  │                           │    WireGuard     │         |
|       └─────────┬────────┘                           │   (UDP Chiffré)  │         |
|                 │                                    └─────────┬────────┘         |
|                 ▼                                              ▼                  |
|       ┌──────────────────┐                           ┌──────────────────┐         |
|       │  cloudflared     │                           │  Technitium DNS  │         |
|       │  (Origine Locale)│                           │ (*.home.arpa)    │         |
|       └─────────┬────────┘                           └─────────┬────────┘         |
+─────────────────┼──────────────────────────────────────────────┼──────────────────+
                  │                                              │
                  ▼                                              ▼
+───────────────────────────────────────────────────────────────────────────────────+
|                           COUCHE DE REVERSE-PROXYING                              |
|                                                                                   |
|    [ Traefik / Coolify (Flux Publics) ]            [ Caddy Gateway (Flux Privés) ]|
|                 │                                              │                  |
|                 ├────────► forum.balboing.com                  ├────────► Vaultwarden / Bitwarden
|                 ├────────► helpdesk.balboing.com (GLPI)        ├────────► Activepieces Automation
|                 ├────────► media.balboing.com (Chevereto)      ├────────► GLPI IT Service Desk
|                 ├────────► n8n.balboing.com                    ├────────► Chevereto & Immich
|                 └────────► uptime.balboing.com                 ├────────► WebODM & Drone Portal
|                                                                ├────────► Home Assistant & IoT
|                                                                └────────► Local AI (Ollama & Codex)
+───────────────────────────────────────────────────────────────────────────────────+
|                           RÉSEAUX DOCKER INTERNES ISOLÉS                          |
|                                                                                   |
|  [ DB Networks ]              [ App Networks ]              [ Monitoring Network ]|
|  • PostgreSQL (Activepieces)  • Activepieces Worker         • Uptime Kuma Engine  |
|  • MariaDB (GLPI / Chevereto) • Immich Machine Learning     • Beszel Node Agent   |
|  • Redis Brokers & Queues     • WebODM Worker & Broker      • Dozzle Log Streamer |
|  • Coolify DB & Realtime      • Ollama GPU Inférence        • Technitium Core     |
+-----------------------------------------------------------------------------------+
            </pre>
          </div>
        </section>

        <!-- SERVICES DETALLES -->
        <section class="case-study-section">
          <h2>3. Piliers Applicatifs & Écosystème de Services</h2>
          <p>
            Chaque brique logicielle a été choisie et déployée pour répondre à des cas d'usage réels :
          </p>

          <div class="homelab-pillars-grid">
            <article class="homelab-pillar glass-card">
              <div class="homelab-pillar__header">
                <span class="homelab-pillar__tag">ITSM, Automatisation & IoT</span>
                <h3>Support, Workflows & Domotique</h3>
              </div>
              <ul>
                <li><strong>GLPI Custom IT Service Desk :</strong> Gestion de parc d'équipements, SLA, inventaire d'actifs et formulaires de tickets personnalisés.</li>
                <li><strong>Activepieces & n8n.io :</strong> Plateformes d'automatisation sans code et pipelines événementiels pour synchroniser les alertes et orchestrer les données.</li>
                <li><strong>Home Assistant :</strong> Contrôle domotique centralisé, orchestration de capteurs IoT et télémétrie locale.</li>
                <li><strong>WebODM & Flight Portal :</strong> Traitement photogrammétrique par drone, modélisation 3D de terrains et carnets de vol numériques (Open DroneLog).</li>
                <li><strong>Vaultwarden :</strong> Gestionnaire de mots de passe et coffre-fort chiffré auto-hébergé avec synchronisation multi-appareils.</li>
              </ul>
            </article>

            <article class="homelab-pillar glass-card">
              <div class="homelab-pillar__header">
                <span class="homelab-pillar__tag">Streaming, Gaming & Médias</span>
                <h3>Divertissement & Rétro-Gaming</h3>
              </div>
              <ul>
                <li><strong>Jellyfin :</strong> Serveur de streaming multimédia haute fidélité (films, séries, musique) avec transcodage matériel.</li>
                <li><strong>RomM (Rom Manager) :</strong> Bibliothèque et gestionnaire de ROMs rétro-gaming avec serveur de streaming Webstation dédié.</li>
                <li><strong>Chevereto & Immich :</strong> Plateformes d'hébergement photo et galerie multimédia avec reconnaissance faciale ML et sauvegarde mobile instantanée.</li>
                <li><strong>Kavita :</strong> Serveur de lecture numérique et bibliothèque d'e-books / mangas auto-hébergée.</li>
                <li><strong>MediaMTX :</strong> Passerelle de flux vidéo et flux temps réel RTSP / WebRTC à ultra-faible latence.</li>
              </ul>
            </article>

            <article class="homelab-pillar glass-card">
              <div class="homelab-pillar__header">
                <span class="homelab-pillar__tag">IA Locale & Inférence</span>
                <h3>Intelligence Artificielle Souveraine</h3>
              </div>
              <ul>
                <li><strong>Ollama & Moteurs LLM Locaux :</strong> Exécution de modèles d'inférence (Qwen, Mistral-Nemo) garantissant 100% de souveraineté sans fuite de données.</li>
                <li><strong>Open WebUI & Page Assist :</strong> Interfaces web et extensions de navigateur pour le prompt-engineering multimodal et les assistants IA.</li>
                <li><strong>ComfyUI & Stable Diffusion Control :</strong> Génération et manipulation d'images assistée par GPU avec pipelines de contrôle avancés.</li>
                <li><strong>Agents Autonomes (OpenClaw, Hermes, MiroFish) :</strong> Passerelles d'agents IA distribuées (Swagger UI / ReDoc) connectées aux outils système.</li>
              </ul>
            </article>

            <article class="homelab-pillar glass-card">
              <div class="homelab-pillar__header">
                <span class="homelab-pillar__tag">Outils, GED & Supervision</span>
                <h3>Productivité, Knowledge & Monitoring</h3>
              </div>
              <ul>
                <li><strong>Uptime Kuma & Beszel :</strong> 37+ sondes de disponibilité end-to-end et télémétrie matérielle légère (CPU, RAM, stockage, GPU).</li>
                <li><strong>Dozzle & Technitium DNS :</strong> Visualisation en direct des logs conteneurs et serveur DNS récursif privé (zone <code>home.arpa</code>).</li>
                <li><strong>GED & Organisation :</strong> Paperless-ngx (indexation OCR), Filebrowser sécurisé, Obsidian Sync et Excalidraw Whiteboard.</li>
                <li><strong>Boîte à Outils & Portails :</strong> Homarr Dashboard, CasaOS, IT-Tools, SearXNG (moteur de recherche privé), Linkding et Reactive Resume.</li>
                <li><strong>Sauvegardes :</strong> Duplicati pour les sauvegardes chiffrées automatiques des volumes de configuration.</li>
              </ul>
            </article>
          </div>
        </section>

        <!-- MODELE DE SECURITE -->
        <section class="case-study-section">
          <h2>4. Modèle de Sécurité en Couches (Defense in Depth)</h2>
          <p>
            Pour éviter l'écueil classique des conteneurs qui publient leurs ports par défaut sur toutes les interfaces réseau (<code>0.0.0.0</code>), 
            une stratégie de défense en profondeur a été mise en œuvre :
          </p>
          
          <div class="homelab-audit-card glass-card">
            <div class="homelab-audit-grid">
              <div class="homelab-audit-item">
                <span class="audit-badge audit-badge--ok">Niveau 1 — Pare-feu Hôte</span>
                <h4>Filtrage Strict des Entrées</h4>
                <p>
                  Les règles du pare-feu bloquent par défaut toutes les connexions entrantes sur les interfaces WAN. 
                  Seul le port d'échange chiffré VPN est autorisé. L'interface d'administration est strictement isolée.
                </p>
              </div>
              <div class="homelab-audit-item">
                <span class="audit-badge audit-badge--ok">Niveau 2 — Isolation Docker</span>
                <h4>Réseaux Internes Étanches</h4>
                <p>
                  Les bases de données (PostgreSQL, MariaDB, Redis) sont confinées dans des réseaux virtuels Docker 
                  sans aucun mappage de port sur l'hôte, rendant impossible tout accès non autorisé depuis l'extérieur.
                </p>
              </div>
              <div class="homelab-audit-item">
                <span class="audit-badge audit-badge--ok">Niveau 3 — Zéro Exposition Directe</span>
                <h4>Cloudflare Tunnel & VPN</h4>
                <p>
                  Les rares applications accessibles depuis Internet utilisent un tunnel sortant chiffré. 
                  L'adresse IP réelle de l'infrastructure n'est jamais exposée dans les enregistrements DNS publics.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- AUDIT & HARDENING -->
        <section class="case-study-section">
          <h2>5. Méthodologie d'Audit & Durcissement Continu</h2>
          <p>
            Une campagne d'audit approfondie en lecture seule a été menée pour éliminer les points uniques de défaillance et fiabiliser la production :
          </p>
          <ul class="case-study-list">
            <li><strong>Vérification des Upstreams de Reverse Proxy :</strong> Audit systématique de l'ensemble des cibles de routage (alignement des ports de production, protocoles HTTPS pour les services sensibles).</li>
            <li><strong>Persistance des Ponts Docker Compose :</strong> Déclaration explicite des réseaux partagés dans les configurations Compose pour éviter toute perte de connectivité ou de résolution d'alias DNS lors des recréations de conteneurs.</li>
            <li><strong>Surveillance du Parcours Utilisateur Réel :</strong> Migration des sondes Uptime Kuma pour tester non seulement le processus backend brut, mais l'ensemble de la chaîne (DNS local + certificat TLS + négociation reverse-proxy).</li>
            <li><strong>Hygiène des Données & Secrets :</strong> Strict respect de l'isolation des fichiers d'environnement (<code>.env</code>), rotation des clés de session et exclusion des identifiants dans les systèmes de contrôle de version.</li>
          </ul>
        </section>

        <!-- ENSEIGNEMENTS -->
        <section class="case-study-section">
          <h2>6. Enseignements & Perspectives</h2>
          <p>
            Ce projet démontre qu'une infrastructure auto-hébergée robuste ne repose pas uniquement sur l'accumulation d'outils, 
            mais sur la <strong>maîtrise des flux réseau, l'automatisation des pipelines et la rigueur du cloisonnement de sécurité</strong>.
          </p>
          <p>
            L'architecture hybride permet aujourd'hui d'exécuter des modèles d'IA souverains, d'automatiser des flux métier (Activepieces / n8n), 
            de gérer des parcs d'équipements réels (GLPI), de centraliser des téraoctets de données multimédias et de tester en continu de nouvelles intégrations sans compromettre la sécurité globale.
          </p>
        </section>

        <!-- FOOTER DE L'ARTICLE -->
        <footer class="case-study-footer glass-card">
          <div>
            <h3>Besoin d'auditer ou structurer votre infrastructure ?</h3>
            <p>Support IT, déploiement GLPI, durcissement de serveurs Linux/Windows ou automatisation de processus métier.</p>
          </div>
          <div class="case-study-footer__actions">
            <a class="button button--primary" href="mailto:hello@matsetop.be">Contacter Matsetop</a>
            <a class="button button--ghost" href="/#projects">Voir les autres projets</a>
          </div>
        </footer>

      </article>
    </main>

    <footer>
      <span>© ${new Date().getFullYear()} Matsetop</span>
      <span>Built with Three.js</span>
    </footer>
  `;
}
