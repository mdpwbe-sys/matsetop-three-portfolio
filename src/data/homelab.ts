export type LabService = { name: string; role: string; description: string };
export type LabGroup = { id: string; title: string; intro: string; services: LabService[] };
const service = (name: string, role: string, description: string): LabService => ({ name, role, description });

// Public editorial inventory: no live endpoint, identifier or deployment configuration.
export const labGroups: LabGroup[] = [
  { id: "foundation", title: "Socle & déploiement", intro: "Un hôte Windows, une couche Linux WSL2 et des applications conteneurisées. CasaOS et Coolify conservent leurs rôles respectifs.", services: [
    service("Windows / WSL2", "Socle hybride", "Windows accueille les outils de bureau et les interactions utilisateur. Ubuntu sous WSL2 héberge les services Linux ; le cycle de vie coordonne les deux environnements."),
    service("Docker & Compose", "Exécution", "Les conteneurs regroupent applications et dépendances. Compose décrit les déploiements, tandis que les volumes persistants séparent les données du remplacement des images."),
    service("CasaOS", "Orchestration historique", "Backend de gestion des applications et de leurs déploiements Docker, notamment pour le forum et les outils associés. Il reste une composante de l’administration du lab."),
    service("Coolify", "Déploiement applicatif", "Plateforme de déploiement pour les applications et leurs dépendances. Son proxy Traefik complète le routage des stacks qu’elle gère, à côté de la passerelle Caddy."),
    service("systemd", "Services Linux", "Gère les services système et utilisateur qui ne vivent pas dans Docker. Les unités et la séquence de démarrage coordonnent disponibilité, dépendances et lancement différé.")
  ] },
  { id: "network", title: "Réseau, accès & identités", intro: "Les chemins publics et privés ont des usages distincts. Les relations sont présentées ici sans exposer la topologie interne.", services: [
    service("Technitium DNS", "Résolution", "Centralise la résolution DNS et les noms des services locaux. Les contrôles de démarrage vérifient une vraie réponse DNS avant de considérer cette dépendance disponible."),
    service("Caddy", "Reverse proxy / TLS", "Fournit les points d’entrée HTTPS des applications internes et achemine les requêtes vers les bons backends. Il constitue une couche distincte des applications qu’il dessert."),
    service("Cloudflared", "Accès public", "Relie les services publiés à Cloudflare par un tunnel sortant. La publication est sélective : avoir une application dans le lab ne signifie pas la rendre publique."),
    service("WireGuard", "Accès privé", "Offre un accès distant chiffré aux ressources privées. Il complète les accès publics sans transformer les interfaces d’administration en pages ouvertes sur Internet."),
    service("Vaultwarden", "Coffre-fort", "Serveur compatible avec les clients Bitwarden pour conserver et synchroniser les identifiants dans un coffre chiffré. Il appartient à la couche privée de l’infrastructure.")
  ] },
  { id: "observability", title: "Observabilité & sauvegardes", intro: "Disponibilité, ressources et journaux répondent à des questions différentes. La récupération ajoute une protection distincte de la supervision.", services: [
    service("Uptime Kuma", "Disponibilité", "Surveille les services attendus et leurs points de contrôle. Les sondes permettent de repérer une application indisponible ou un problème dans le parcours DNS, proxy et backend."),
    service("Beszel", "Métriques", "Suit les ressources de l’hôte et des conteneurs avec un agent léger. Les mesures aident à comprendre la consommation de mémoire, de processeur et de stockage."),
    service("Dozzle", "Journaux Docker", "Présente les logs des conteneurs en direct pour diagnostiquer démarrages, erreurs et traitements. Il complète les sondes de disponibilité sans les remplacer."),
    service("Duplicati", "Sauvegardes chiffrées", "Organise les sauvegardes versionnées des configurations du lab, des projets et des bibliothèques. Un dépôt local précède leur publication cloud ; dumps cohérents et essais de restauration accompagnent la stratégie."),
    service("Preflight & lifecycle", "Récupération", "Des contrôles non destructifs vérifient stockage, fichiers critiques et readiness. Une séquence de démarrage et un arrêt contrôlé relient le fonctionnement quotidien à la récupération après redémarrage.")
  ] },
  { id: "security", title: "Sécurité & analyse locale", intro: "Les alertes donnent des éléments à examiner. Une analyse indisponible ne constitue pas une preuve qu’un fichier est malveillant.", services: [
    service("Security Hub", "API locale de sécurité", "Centralise le suivi des analyses et des événements de sécurité. Son backend authentifié et son contrôle de santé fournissent une base commune à la supervision et aux interfaces du lab."),
    service("ClamAV / SIEM", "Analyse de fichiers", "ClamAV fournit le moteur de scan utilisé par la chaîne de sécurité. Le suivi SIEM rassemble résultats et événements, notamment autour des fichiers reçus et des uploads."),
    service("KicomAV", "Moteur complémentaire", "Fournit un second moteur d’analyse dans la chaîne JARVIS. Son état est surveillé afin de distinguer une indisponibilité technique d’un résultat de détection."),
    service("JARVIS Watchdog", "Compagnon Windows", "Projet de surveillance des fichiers entrants côté Windows, avec interface, réglages et icône dans la zone de notification. Le mode d’alerte laisse l’inspection et les décisions à l’utilisateur, sans déplacement automatique."),
    service("Net Guard WSL", "Observation réseau", "Collecte les observations du trafic visible depuis WSL et les confronte à une liste de blocage pour signaler des correspondances. Cette visibilité ne couvre pas tout le trafic de l’hôte Windows.")
  ] },
  { id: "ai", title: "IA, agents & création", intro: "Les outils partagent des ressources de calcul limitées. Certains démarrent de manière différée ; les backends lourds peuvent rester à la demande.", services: [
    service("Ollama", "Inférence", "Sert les modèles de langage locaux aux interfaces et aux agents. Les connexions à des modèles distants sont un choix distinct : toutes les requêtes ne sont pas automatiquement locales."),
    service("Open WebUI", "Interface conversationnelle", "Fournit une interface de discussion pour utiliser les modèles et organiser les échanges. Il sépare l’expérience utilisateur du moteur d’inférence qui exécute les requêtes."),
    service("OpenClaw", "Passerelle d’agents", "Relie modèles, conversations et outils d’agent à travers un gateway dédié. Son accès privé passe par la passerelle web et les mécanismes d’authentification configurés."),
    service("Hermes", "Assistant outillé", "Réunit des agents et des outils pour interagir avec l’environnement. Le dashboard et les API locales permettent de piloter les tâches et de connecter des usages du forum et du bureau."),
    service("Feynman", "Workbench de recherche", "Espace de travail de recherche assistée, présenté derrière une interface web protégée. Il complète les assistants généralistes avec un environnement dédié à l’exploration."),
    service("MiroFish", "Expérimentation multi-agent", "Application avec frontend et backend distincts pour explorer des scénarios et des traitements multi-agents. Elle appartient à la couche d’expérimentation IA du lab."),
    service("ACE-Step", "Création audio", "Expose un environnement de génération musicale assistée par IA. Son lancement différé évite de cumuler toutes les charges avec les services essentiels au premier instant du boot."),
    service("ComfyUI", "Workflows visuels", "Permet de composer des pipelines de génération et de transformation d’images sous forme de graphe. Démarrer l’interface ne signifie pas charger immédiatement tous les modèles en mémoire GPU."),
    service("Stable Diffusion Control", "Backend à la demande", "Une interface de contrôle permet de lancer le backend de génération lorsqu’il est nécessaire. Cette séparation évite de charger son modèle GPU systématiquement au démarrage.")
  ] },
  { id: "applications", title: "Applications & connaissances", intro: "Des outils indépendants couvrent documents, inventaire, contenus personnels et organisation. Leurs interfaces d’administration restent des ressources privées.", services: [
    service("n8n", "Automatisation", "Construit des workflows reliant API, événements et transformations de données. Les tâches automatisées peuvent orchestrer plusieurs applications sans fusionner leurs responsabilités."),
    service("Activepieces", "Workflows low-code", "Propose une autre interface de construction d’automatisations. L’application et son worker séparent édition des flows et exécution, avec PostgreSQL et Redis comme dépendances internes."),
    service("GLPI", "Gestion IT", "Regroupe inventaire informatique et suivi des demandes de support. MariaDB conserve les données de l’application ; la couche web présente les tickets et les équipements."),
    service("Homebox", "Inventaire matériel", "Organise les objets, équipements, catégories et informations utiles d’un inventaire personnel. Il complète la gestion IT avec une approche centrée sur les biens du quotidien."),
    service("Paperless-ngx", "Documents / OCR", "Archive et indexe les documents numérisés afin de les retrouver par leur contenu et leurs métadonnées. Les documents originaux et la base font partie des données à préserver."),
    service("Immich", "Photothèque", "Centralise les photos et vidéos personnelles, avec indexation et traitements d’apprentissage automatique dans des composants distincts. Les fichiers originaux restent au cœur de la stratégie de sauvegarde."),
    service("Jellyfin", "Médiathèque", "Organise les collections multimédias et les diffuse vers les clients compatibles. Les fonctions de lecture et de streaming sont conservées indépendamment des outils d’administration du lab."),
    service("Kavita", "Lecture numérique", "Catalogue les bibliothèques de livres, bandes dessinées et mangas avec une interface de lecture web. Il couvre un usage différent du streaming audio et vidéo."),
    service("Chevereto", "Galeries", "Héberge les images et albums pour leur présentation et leur partage. Les galeries peuvent servir à valoriser des contenus, notamment ceux liés aux activités photo et drone."),
    service("Linkding", "Signets", "Centralise les liens enregistrés avec tags et recherche. Il transforme les ressources repérées en une collection organisée et réutilisable."),
    service("Excalidraw", "Tableau blanc", "Offre un espace de dessin pour schémas, idées et explications visuelles. Il sert notamment à préparer des représentations d’architecture ou des projets."),
    service("AFFiNE", "Espace de travail", "Combine documents, notes et tableaux visuels pour organiser les connaissances. Ses dépendances de stockage et de synchronisation restent séparées de l’interface."),
    service("Obsidian", "Notes liées", "Fournit un environnement de prise de notes et de navigation entre connaissances. Le déploiement géré par CasaOS utilise un stockage persistant pour le coffre de notes."),
    service("Homarr", "Tableau de bord", "Regroupe les accès aux applications dans un portail personnel. Il facilite la navigation sans devenir la source de vérité du déploiement ni de la disponibilité."),
    service("IT-Tools", "Utilitaires", "Rassemble de petits outils de conversion, de formatage et de diagnostic pour les opérations quotidiennes. Il évite de multiplier les services externes pour ces tâches simples."),
    service("SearXNG", "Métarecherche", "Agrège les résultats de plusieurs moteurs dans une interface auto-hébergée. Les requêtes vers les moteurs externes restent nécessaires à ce mode de recherche."),
    service("Reactive Resume", "Création de CV", "Application de composition et de présentation de CV. Le déploiement self-hosted permet de gérer les documents de travail sans publier leur contenu dans ce portfolio."),
    service("Paisa", "Finances personnelles", "Aide à consulter et analyser une comptabilité personnelle. Son rôle est celui d’une application privée, distincte de la gestion des équipements et des projets."),
    service("FileBrowser", "Gestion de fichiers", "Expose une interface de navigation et de transfert pour les espaces autorisés. Il reste un service CasaOS avec sa configuration et ses données persistantes."),
    service("Home Assistant", "Domotique", "Centralise les intégrations et les automatismes de la maison. Le service existe dans le lab ; sa présence ne préjuge pas de l’ensemble des appareils ou scénarios configurés.")
  ] },
  { id: "development", title: "Développement & dépendances", intro: "Le code canonique, les images et les données persistantes sont des éléments distincts. Les dépendances internes ne deviennent pas des portails publics.", services: [
    service("Codex WebUI", "Interface de développement", "Propose une interface locale pour les sessions de travail assistées sur les projets. Les contrôles de santé et de readiness distinguent accès web et disponibilité du backend."),
    service("PostgreSQL", "Données relationnelles", "Stocke les données de plusieurs applications, notamment des workflows et des outils collaboratifs. Les sauvegardes utilisent des dumps cohérents plutôt qu’une simple copie des fichiers d’une base en cours d’écriture."),
    service("MariaDB", "Données applicatives", "Fournit le stockage relationnel de stacks telles que GLPI et RomM. La restauration doit associer un dump compatible aux fichiers et à la configuration de chaque application."),
    service("Redis", "Files & cache", "Soutient les queues de traitement, le cache et les échanges de plusieurs stacks. Son rôle dépend de l’application ; la conservation des données est évaluée selon cet usage."),
    service("SQLite", "Persistance embarquée", "Conserve les données de services tels que le forum et Duplicati. Des sauvegardes cohérentes et des contrôles d’intégrité évitent de confondre copie de fichier et restauration validée.")
  ] },
  { id: "gaming", title: "Gaming & communications", intro: "Catalogue, sessions interactives et transport média sont des couches complémentaires ; un catalogue disponible ne signifie pas une session de jeu active.", services: [
    service("RomM", "Bibliothèque de jeux", "Catalogue les collections de jeux et leurs métadonnées dans une interface dédiée. Le stockage, les données applicatives et les sessions de jeu ont des cycles de vie distincts."),
    service("Webstation / Selkies", "Sessions interactives", "La Webstation liée à RomM fournit un environnement de session et de streaming interactif. Les composants de session permettent les usages d’émulation et de jeu sans lancer tous les workloads en permanence."),
    service("Sunshine · Windows", "Streaming de bureau", "Le composant installé sur l’hôte Windows permet le streaming de bureau et de jeux vers des clients compatibles. Il est distinct des services WSL et des sessions Webstation ; son installation ne constitue pas un indicateur de session active."),
    service("LiveKit", "Transport temps réel", "Fournit une brique de communication audio et vidéo WebRTC. Le service de transport et sa dépendance Redis sont distincts des interfaces qui consomment ces échanges.")
  ] },
  { id: "forum", title: "Forum & réseaux alternatifs", intro: "Une seule application et les mêmes assets servent les différents moyens d’accès. Aucun frontend séparé par réseau.", services: [
    service("Forum Balboing", "Communauté", "Réunit comptes, topics, réponses, flux RSS, chat et conversations privées. Les uploads, fonctions WebRTC et intégrations HLS et multimédias complètent le même backend et les mêmes templates."),
    service("I2P / RottenGhost", "Accès alternatif", "Un service caché I2P et son relais donnent accès au forum par ce réseau. L’identité persistante du tunnel est préservée, sans publier ici son adresse ni sa configuration."),
    service("Tor", "Accès alternatif", "L’accès onion du forum complète l’accès classique. Une brique de bridge Tor existe également dans le lab ; ces usages restent distincts du routage privé par VPN."),
    service("Nginx · origine forum", "Proxy spécialisé", "Le proxy d’origine accompagne la publication du forum et les informations de son accès alternatif. Il conserve son rôle spécialisé à côté des autres proxies de l’infrastructure.")
  ] },
  { id: "drone", title: "ATSETOP · drone, photo & vidéo", intro: "Une stack dédiée relie portail, traitement photogrammétrique, carnet de vol et diffusion média. Les traitements sont lancés selon les besoins.", services: [
    service("ATSETOP Flight", "Portail drone", "Réunit les accès aux outils de la stack drone dans une interface dédiée. Il constitue le point d’entrée fonctionnel, sans remplacer les moteurs de traitement et leurs données."),
    service("MediaMTX", "Passerelle vidéo", "Reçoit et redistribue les flux média avec les protocoles RTMP, HLS et WebRTC. Il relie les sources vidéo aux interfaces de lecture sans nécessiter de refonte des transports existants."),
    service("WebODM", "Photogrammétrie", "Organise les projets de reconstruction à partir de photos et présente les résultats. L’application et ses workers s’appuient sur une base et une file de traitement internes."),
    service("NodeODM", "Moteur de traitement", "Exécute les calculs photogrammétriques soumis par WebODM. Cette séparation permet de distinguer l’interface disponible du traitement, plus exigeant en ressources."),
    service("OpenDroneLog", "Carnet de vol", "Fournit un espace de consultation et d’organisation des informations de vols drone. Il complète les outils de traitement des images avec un suivi des opérations.")
  ] }
];
