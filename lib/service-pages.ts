import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site-config'

export type ServiceFaq = {
  question: string
  answer: string
}

export type ServiceContentItem = {
  title: string
  description: string
}

export type ServiceSource = {
  label: string
  publisher: string
  href: string
}

export type ServiceDecisionGuide = {
  introduction: string
  architectures: ServiceContentItem[]
  criteria: ServiceContentItem[]
  limits: ServiceContentItem[]
  sources: ServiceSource[]
}

export type ServicePageData = {
  slug: string
  eyebrow: string
  title: string
  metaTitle: string
  metaDescription: string
  serviceType: string
  intro: string
  directAnswer: string
  problems: ServiceContentItem[]
  deliverables: ServiceContentItem[]
  useCases: string[]
  process: ServiceContentItem[]
  faq: ServiceFaq[]
  keywords: string[]
  decisionGuide?: ServiceDecisionGuide
}

export const servicePages = [
  {
    slug: 'logiciels-metiers-sur-mesure',
    eyebrow: 'Ingénierie logicielle',
    title: 'Logiciels métiers sur mesure pour vos opérations',
    metaTitle: 'Logiciels métiers sur mesure',
    metaDescription:
      'Logiciels métiers sur mesure, applications internes, portails professionnels et intégrations adaptés aux processus de votre organisation.',
    serviceType: 'Conception et développement de logiciels métiers sur mesure',
    intro:
      'Nous transformons des processus complexes, dispersés ou encore manuels en outils professionnels clairs, maintenables et intégrés à votre environnement.',
    directAnswer:
      'Un logiciel métier sur mesure est une application conçue autour des règles, des utilisateurs et des contraintes propres à une organisation. Il peut remplacer des fichiers dispersés, réduire les doubles saisies, automatiser des contrôles et relier les systèmes déjà en place.',
    problems: [
      {
        title: 'Processus fragmentés',
        description:
          'Les informations circulent entre feuilles de calcul, e-mails, documents et outils qui ne communiquent pas entre eux.',
      },
      {
        title: 'Logiciels standards trop rigides',
        description:
          'Les équipes contournent l’outil existant parce qu’il ne reflète pas les règles réelles du métier.',
      },
      {
        title: 'Manque de traçabilité',
        description:
          'Les validations, responsabilités et changements sont difficiles à suivre ou à expliquer.',
      },
    ],
    deliverables: [
      {
        title: 'Cadrage fonctionnel et technique',
        description:
          'Cartographie des utilisateurs, flux, règles métier, données, contraintes et critères de validation.',
      },
      {
        title: 'Interface métier',
        description:
          'Application responsive conçue pour les tâches quotidiennes, les droits d’accès et les usages réels.',
      },
      {
        title: 'API et intégrations',
        description:
          'Connexion aux bases, logiciels, services et équipements existants lorsque le contexte le permet.',
      },
      {
        title: 'Documentation et transfert',
        description:
          'Documentation d’exploitation, décisions d’architecture et accompagnement des équipes.',
      },
    ],
    useCases: [
      'Pilotage d’opérations et suivi de dossiers',
      'Portail client, fournisseur ou partenaire',
      'Workflow de validation et gestion des responsabilités',
      'Automatisation de saisies, contrôles et notifications',
      'Tableaux de bord et consolidation de données',
    ],
    process: [
      {
        title: 'Comprendre',
        description:
          'Observer le travail réel, les exceptions, les dépendances et les résultats attendus.',
      },
      {
        title: 'Prototyper',
        description:
          'Valider rapidement les parcours, les données et les règles les plus risquées.',
      },
      {
        title: 'Construire',
        description:
          'Développer par jalons testables avec des critères de validation explicites.',
      },
      {
        title: 'Déployer',
        description:
          'Mettre en production, documenter, transférer et faire évoluer l’outil.',
      },
    ],
    faq: [
      {
        question: 'Quand faut-il choisir un logiciel métier sur mesure ?',
        answer:
          'Le sur-mesure devient pertinent lorsque les processus différencient réellement l’organisation, que les contournements d’un logiciel standard coûtent du temps ou que plusieurs systèmes doivent être réunis dans un même flux.',
      },
      {
        question: 'Pouvez-vous reprendre un outil ou une base de données existante ?',
        answer:
          'Oui, après audit de l’architecture, du code, des données et des dépendances. La reprise peut être progressive afin de limiter les risques opérationnels.',
      },
      {
        question: 'Comment est défini le périmètre du projet ?',
        answer:
          'Le périmètre est découpé en fonctionnalités et jalons validables. Les utilisateurs, données, intégrations, contraintes de sécurité et critères de réussite sont clarifiés avant la construction.',
      },
      {
        question: 'Le logiciel peut-il évoluer après la mise en production ?',
        answer:
          'Oui. L’architecture, la documentation et le découpage sont pensés pour permettre des évolutions maîtrisées lorsque les processus ou les volumes changent.',
      },
    ],
    keywords: [
      'logiciel métier sur mesure',
      'application métier',
      'développement logiciel entreprise',
      'automatisation processus métier',
      'portail professionnel',
    ],
  },
  {
    slug: 'intelligence-artificielle-locale',
    eyebrow: 'IA privée et souveraine',
    title: 'Intelligence artificielle locale pour l’entreprise',
    metaTitle: 'Intelligence artificielle locale en entreprise',
    metaDescription:
      'Cadrage, prototypage et déploiement de modèles d’intelligence artificielle locale, RAG privé et inférence sur infrastructure contrôlée par votre organisation.',
    serviceType: 'Conception et déploiement de systèmes d’intelligence artificielle locale',
    intro:
      'Novekia conçoit des systèmes d’IA exécutés sur une infrastructure définie avec vous, afin de maîtriser les données, les modèles, les accès et les conditions d’exploitation.',
    directAnswer:
      'Une intelligence artificielle locale exécute tout ou partie des modèles et traitements sur une infrastructure contrôlée par l’organisation. Elle permet d’adapter la confidentialité, la disponibilité, les performances et les coûts au cas d’usage, sans dépendre systématiquement d’une API publique.',
    problems: [
      {
        title: 'Données sensibles',
        description:
          'Les documents, procédures ou bases métier ne peuvent pas être envoyés sans contrôle vers un service externe.',
      },
      {
        title: 'Dépendance aux API',
        description:
          'Les coûts, quotas, changements de modèles ou indisponibilités externes rendent le service difficile à maîtriser.',
      },
      {
        title: 'Réponses non évaluées',
        description:
          'Un prototype impressionnant ne suffit pas : il faut mesurer la qualité, les erreurs et les limites sur des cas représentatifs.',
      },
    ],
    deliverables: [
      {
        title: 'Cadrage du cas d’usage',
        description:
          'Objectif, utilisateurs, données autorisées, niveau de risque, validation humaine et indicateurs d’évaluation.',
      },
      {
        title: 'Choix des modèles',
        description:
          'Comparaison de modèles, quantifications et architectures selon la qualité attendue et les ressources disponibles.',
      },
      {
        title: 'RAG et outils métier',
        description:
          'Recherche documentaire, sources citées, règles, connecteurs et actions contrôlées lorsque le besoin le justifie.',
      },
      {
        title: 'Chaîne d’inférence exploitable',
        description:
          'Déploiement, supervision, journalisation, contrôle des accès et documentation d’exploitation.',
      },
    ],
    useCases: [
      'Recherche et synthèse dans une base documentaire privée',
      'Assistant interne relié aux procédures de l’entreprise',
      'Classification, extraction et contrôle de documents',
      'Aide à la rédaction avec validation humaine',
      'Automatisation assistée dans un logiciel métier',
    ],
    process: [
      {
        title: 'Qualifier',
        description:
          'Vérifier que l’IA apporte une valeur mesurable et définir les limites acceptables.',
      },
      {
        title: 'Évaluer',
        description:
          'Comparer les approches sur un corpus et des questions représentatives.',
      },
      {
        title: 'Intégrer',
        description:
          'Relier le modèle aux données, outils et contrôles nécessaires.',
      },
      {
        title: 'Exploiter',
        description:
          'Superviser la qualité, les performances, les accès et les évolutions.',
      },
    ],
    decisionGuide: {
      introduction:
        'Le lieu d’exécution n’est pas une fin en soi. La bonne architecture relie la sensibilité des données, la qualité attendue, la charge, la disponibilité et la capacité de l’organisation à exploiter le système.',
      architectures: [
        {
          title: 'Poste ou station isolée',
          description:
            'Approche adaptée au prototypage, à un petit nombre d’utilisateurs ou à un environnement volontairement déconnecté. Les modèles et les données restent sur une machine identifiée.',
        },
        {
          title: 'Service IA sur réseau privé',
          description:
            'Un serveur d’inférence mutualisé expose une API interne avec authentification, journalisation, supervision et règles d’accès. Cette architecture facilite l’intégration aux logiciels métiers.',
        },
        {
          title: 'Architecture hybride contrôlée',
          description:
            'Les traitements sensibles restent dans le périmètre privé ; un service externe peut être utilisé pour des tâches explicitement autorisées. Les flux, données envoyées et solutions de repli doivent être documentés.',
        },
      ],
      criteria: [
        {
          title: 'Données et risque',
          description:
            'Classer les données, les destinataires autorisés, les obligations contractuelles et les conséquences d’une réponse incorrecte avant de choisir l’hébergement.',
        },
        {
          title: 'Qualité vérifiable',
          description:
            'Comparer les modèles sur un jeu de questions représentatif, avec des réponses attendues, des cas d’échec et une règle de validation humaine.',
        },
        {
          title: 'Charge et performance',
          description:
            'Mesurer le contexte, la concurrence, la latence acceptable, le débit et la disponibilité. Ces éléments déterminent la mémoire et l’architecture, pas l’inverse.',
        },
        {
          title: 'Exploitation et coût complet',
          description:
            'Inclure intégration, énergie, hébergement, supervision, mises à jour, sécurité et temps d’exploitation dans la comparaison avec une API facturée à l’usage.',
        },
      ],
      limits: [
        {
          title: 'Le local ne supprime pas les erreurs',
          description:
            'Un modèle local peut produire une réponse fausse, non sourcée ou sensible à une consigne malveillante. Évaluation, citations, permissions et garde-fous restent nécessaires.',
        },
        {
          title: 'La qualité des sources reste décisive',
          description:
            'Un RAG ne corrige ni des documents obsolètes ni des droits d’accès mal définis. L’index doit être maintenu et les autorisations appliquées à la recherche.',
        },
        {
          title: 'L’infrastructure impose des contraintes',
          description:
            'Mémoire, contexte, concurrence, stockage, refroidissement et disponibilité limitent les modèles réellement exploitables. Un test représentatif précède l’achat.',
        },
        {
          title: 'L’exploitation est une responsabilité',
          description:
            'Les modèles, dépendances et pilotes évoluent. Il faut prévoir les mises à jour, la surveillance, le retour arrière et la personne responsable du service.',
        },
      ],
      sources: [
        {
          label: 'Recommandations de sécurité pour un système d’IA générative',
          publisher: 'ANSSI',
          href: 'https://messervices.cyber.gouv.fr/guides/recommandations-de-securite-pour-un-systeme-dia-generative',
        },
        {
          label: 'Questions-réponses sur l’utilisation d’un système d’IA générative',
          publisher: 'CNIL',
          href: 'https://cnil.fr/fr/les-questions-reponses-de-la-cnil-sur-lutilisation-dun-systeme-dia-generative',
        },
        {
          label: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
          publisher: 'Lewis et al.',
          href: 'https://arxiv.org/abs/2005.11401',
        },
      ],
    },
    faq: [
      {
        question: 'Quelle différence entre IA locale, privée et souveraine ?',
        answer:
          'Une IA locale s’exécute sur une infrastructure proche ou contrôlée. Une IA privée insiste sur la confidentialité des accès et des données. La souveraineté ajoute la maîtrise des dépendances, des modèles, de l’hébergement et des conditions d’exploitation.',
      },
      {
        question: 'Une IA locale fonctionne-t-elle sans Internet ?',
        answer:
          'Certains usages peuvent fonctionner hors ligne si les modèles, données et dépendances sont présents localement. D’autres architectures restent hybrides pour conserver des services externes précisément identifiés.',
      },
      {
        question: 'Quels modèles peuvent être déployés localement ?',
        answer:
          'Le choix dépend de la tâche, de la langue, du niveau de qualité, de la mémoire disponible et des conditions de licence. Plusieurs familles de modèles open weight peuvent être évaluées avant décision.',
      },
      {
        question: 'Faut-il déjà posséder un serveur GPU ?',
        answer:
          'Non. Le cas d’usage et les volumes doivent être évalués avant le matériel. Un prototype peut servir à estimer la mémoire, les performances et le dimensionnement nécessaires.',
      },
    ],
    keywords: [
      'intelligence artificielle locale',
      'IA privée entreprise',
      'IA souveraine',
      'RAG privé',
      'LLM local entreprise',
      'inférence locale',
    ],
  },
  {
    slug: 'infrastructures-serveurs-ia',
    eyebrow: 'Calcul haute performance',
    title: 'Infrastructures de calcul et serveurs IA',
    metaTitle: 'Infrastructures de calcul et serveurs IA',
    metaDescription:
      'Conception et intégration de stations GPU, serveurs IA, stockage et réseau dimensionnés pour l’inférence locale, le calcul intensif et vos contraintes d’exploitation.',
    serviceType: 'Conception et intégration d’infrastructures de calcul et serveurs IA',
    intro:
      'Nous dimensionnons l’ensemble de la chaîne — calcul, mémoire, stockage, réseau, énergie et exploitation — à partir des charges de travail réelles.',
    directAnswer:
      'Une infrastructure IA ne se résume pas au choix d’un GPU. Le dimensionnement doit relier les modèles utilisés, leur précision, la mémoire nécessaire, le nombre d’utilisateurs, la latence attendue, le stockage, le réseau, l’énergie et les possibilités d’évolution.',
    problems: [
      {
        title: 'Matériel choisi trop tôt',
        description:
          'Une configuration est achetée avant d’avoir mesuré les modèles, les volumes et les usages simultanés.',
      },
      {
        title: 'Goulots d’étranglement',
        description:
          'Le stockage, la mémoire, le réseau ou le refroidissement limitent une machine pourtant puissante sur le papier.',
      },
      {
        title: 'Exploitation sous-estimée',
        description:
          'Les sauvegardes, accès, mises à jour, journaux et procédures de reprise ne sont pas intégrés au projet.',
      },
    ],
    deliverables: [
      {
        title: 'Profil de charge',
        description:
          'Modèles, précision, mémoire, concurrence, volumes de données, latence et disponibilité attendues.',
      },
      {
        title: 'Architecture dimensionnée',
        description:
          'Calcul, stockage, réseau, alimentation, contraintes thermiques et capacité d’évolution.',
      },
      {
        title: 'Environnement logiciel',
        description:
          'Système, pilotes, conteneurs, services d’inférence, supervision et gestion des accès.',
      },
      {
        title: 'Dossier d’exploitation',
        description:
          'Documentation, sauvegardes, maintenance, tests, procédures de mise à jour et de reprise.',
      },
    ],
    useCases: [
      'Station de travail GPU pour prototypage et ingénierie',
      'Serveur d’inférence IA partagé par plusieurs équipes',
      'Infrastructure privée pour RAG et assistants internes',
      'Calcul intensif, traitement documentaire ou vision',
      'Stockage et réseau adaptés aux jeux de données volumineux',
    ],
    process: [
      {
        title: 'Mesurer',
        description:
          'Tester les charges représentatives et identifier les ressources réellement limitantes.',
      },
      {
        title: 'Dimensionner',
        description:
          'Comparer plusieurs architectures et leurs compromis techniques et opérationnels.',
      },
      {
        title: 'Intégrer',
        description:
          'Assembler et configurer la chaîne matérielle et logicielle.',
      },
      {
        title: 'Valider',
        description:
          'Tester les performances, la stabilité, la supervision et les procédures d’exploitation.',
      },
    ],
    faq: [
      {
        question: 'Quelle différence entre une station GPU et un serveur IA ?',
        answer:
          'Une station cible généralement un ou quelques utilisateurs proches de la machine. Un serveur est pensé pour des services partagés, des accès distants, une exploitation continue et des exigences plus fortes de supervision et de disponibilité.',
      },
      {
        question: 'Comment déterminer la quantité de mémoire GPU nécessaire ?',
        answer:
          'Elle dépend du modèle, de sa quantification, de la longueur de contexte, du nombre de requêtes simultanées et des composants supplémentaires. Des essais représentatifs sont préférables à une estimation fondée uniquement sur la taille du modèle.',
      },
      {
        question: 'L’infrastructure peut-elle évoluer ?',
        answer:
          'Oui, si les choix de châssis, alimentation, réseau, stockage et architecture logicielle prévoient cette évolution. Les limites physiques et économiques sont documentées avant décision.',
      },
      {
        question: 'Intervenez-vous sur une infrastructure existante ?',
        answer:
          'Oui. Un audit permet d’identifier les ressources réutilisables, les goulots d’étranglement et les changements nécessaires avant d’ajouter du matériel.',
      },
    ],
    keywords: [
      'serveur IA',
      'station GPU',
      'infrastructure de calcul',
      'serveur GPU entreprise',
      'dimensionnement GPU',
      'inférence IA locale',
    ],
  },
  {
    slug: 'applications-web-integrations',
    eyebrow: 'Applications professionnelles',
    title: 'Applications web et intégrations métier',
    metaTitle: 'Applications web et intégrations métier',
    metaDescription:
      'Conception d’applications web professionnelles, portails, API, automatisations et intégrations avec vos logiciels, bases de données et services existants.',
    serviceType: 'Conception d’applications web professionnelles et intégrations',
    intro:
      'Nous concevons des interfaces rapides et accessibles, reliées proprement aux données, règles et systèmes qui font fonctionner votre organisation.',
    directAnswer:
      'Une application web métier est une interface accessible depuis un navigateur qui permet à des utilisateurs autorisés de consulter, créer ou traiter des données. Elle peut réunir plusieurs systèmes grâce à des API et automatisations, tout en conservant des règles d’accès et une traçabilité adaptées.',
    problems: [
      {
        title: 'Outils isolés',
        description:
          'Les équipes passent d’un logiciel à l’autre et recopient les mêmes informations dans plusieurs systèmes.',
      },
      {
        title: 'Interfaces peu adaptées',
        description:
          'Les parcours sont lents, complexes ou impossibles à utiliser correctement sur certains appareils.',
      },
      {
        title: 'Intégrations fragiles',
        description:
          'Des scripts non documentés ou des échanges manuels rendent les flux difficiles à maintenir.',
      },
    ],
    deliverables: [
      {
        title: 'Architecture web',
        description:
          'Découpage des interfaces, services, données, droits d’accès et dépendances.',
      },
      {
        title: 'Interface responsive',
        description:
          'Parcours adaptés aux postes de travail, tablettes ou mobiles selon les usages.',
      },
      {
        title: 'API et automatisations',
        description:
          'Échanges structurés, tâches asynchrones, notifications et connexions aux systèmes existants.',
      },
      {
        title: 'Qualité et exploitation',
        description:
          'Tests, journalisation, supervision, sécurité, documentation et procédures de déploiement.',
      },
    ],
    useCases: [
      'Portail client ou extranet partenaire',
      'Interface de pilotage opérationnel',
      'API entre logiciels et bases de données',
      'Automatisation de traitements et notifications',
      'Outil collaboratif adapté à un processus spécifique',
    ],
    process: [
      {
        title: 'Cartographier',
        description:
          'Identifier utilisateurs, données, systèmes, droits et événements.',
      },
      {
        title: 'Concevoir',
        description:
          'Définir les parcours, contrats d’API et responsabilités de chaque composant.',
      },
      {
        title: 'Développer',
        description:
          'Construire par incréments testables, avec des retours réguliers des utilisateurs.',
      },
      {
        title: 'Opérer',
        description:
          'Déployer, superviser, documenter et améliorer l’application.',
      },
    ],
    faq: [
      {
        question: 'Quelle différence entre un site web et une application web ?',
        answer:
          'Un site présente principalement des contenus. Une application web permet à des utilisateurs d’effectuer des actions, de manipuler des données et de suivre un processus avec des droits et règles spécifiques.',
      },
      {
        question: 'Pouvez-vous connecter une application à nos logiciels existants ?',
        answer:
          'Oui, lorsque ces logiciels exposent une API, une base ou un mécanisme d’échange exploitable. Les responsabilités, limites et reprises sur erreur sont définies explicitement.',
      },
      {
        question: 'Comment gérez-vous les accès et la sécurité ?',
        answer:
          'Les mécanismes dépendent du risque et de l’environnement : authentification, rôles, séparation des données, protection des secrets, journaux, sauvegardes et validation côté serveur.',
      },
      {
        question: 'L’application peut-elle être hébergée sur notre infrastructure ?',
        answer:
          'Oui. Un hébergement sur site, dans un cloud défini ou dans une architecture hybride peut être étudié selon les contraintes de sécurité, de disponibilité et d’exploitation.',
      },
    ],
    keywords: [
      'application web métier',
      'développement application web',
      'intégration API entreprise',
      'portail professionnel',
      'automatisation web',
    ],
  },
  {
    slug: 'creation-site-web-seo-geo',
    eyebrow: 'Visibilité organique',
    title: 'Création de sites web optimisés SEO et GEO',
    metaTitle: 'Création de sites web optimisés SEO et GEO',
    metaDescription:
      'Création de sites web B2B rapides et structurés pour le SEO, Google AI Overviews et les moteurs de réponse générative, avec contenus clairs et données structurées.',
    serviceType: 'Création de sites web optimisés pour le SEO et le GEO',
    intro:
      'Nous réunissons performance technique, architecture de contenu, données structurées et clarté éditoriale afin que vos pages soient utiles aux visiteurs, compréhensibles par Google et exploitables par les moteurs génératifs.',
    directAnswer:
      'Un site optimisé SEO et GEO associe des pages rapides et indexables à une architecture couvrant chaque intention de recherche. Il formule des réponses précises, relie les entités et services avec des données structurées, cite des preuves vérifiables et facilite l’attribution de l’information par les moteurs de recherche et de réponse.',
    problems: [
      {
        title: 'Une page pour trop de sujets',
        description:
          'Plusieurs services et intentions concurrentes sont regroupés sur une seule URL difficile à positionner.',
      },
      {
        title: 'Contenu abstrait',
        description:
          'Les promesses sont esthétiques mais les offres, réponses, limites et preuves restent difficiles à extraire.',
      },
      {
        title: 'Signaux techniques incohérents',
        description:
          'Canonical, sitemap, métadonnées, liens ou données structurées n’indiquent pas clairement les pages de référence.',
      },
    ],
    deliverables: [
      {
        title: 'Architecture SEO',
        description:
          'Arborescence, intentions, URLs, titres, maillage interne et priorités d’indexation.',
      },
      {
        title: 'Site performant',
        description:
          'Rendu rapide, responsive, accessible et conçu pour limiter les instabilités visuelles.',
      },
      {
        title: 'Contenus orientés réponse',
        description:
          'Propositions de valeur, définitions, processus, FAQ, preuves et limites formulés sans ambiguïté.',
      },
      {
        title: 'Données structurées',
        description:
          'Schémas Schema.org cohérents pour l’organisation, les personnes, services, pages et questions fréquentes.',
      },
    ],
    useCases: [
      'Refonte d’un site B2B trop concentré sur une seule page',
      'Création de pages de services ciblant des requêtes distinctes',
      'Migration technique avec conservation des signaux SEO',
      'Structuration d’une entité pour les moteurs génératifs',
      'Amélioration de la performance et de l’indexabilité',
    ],
    process: [
      {
        title: 'Auditer',
        description:
          'Analyser technique, contenus, concurrence, indexation et cohérence des entités.',
      },
      {
        title: 'Structurer',
        description:
          'Définir les pages, intentions, relations et informations vérifiables à publier.',
      },
      {
        title: 'Construire',
        description:
          'Développer le site, les métadonnées, le maillage et les données structurées.',
      },
      {
        title: 'Mesurer',
        description:
          'Suivre l’indexation, les requêtes, les pages d’entrée, les conversions et les citations observables.',
      },
    ],
    faq: [
      {
        question: 'Quelle différence entre SEO et GEO ?',
        answer:
          'Le SEO vise la découverte et le classement dans les moteurs de recherche. Le GEO renforce la capacité d’un moteur génératif à comprendre, sélectionner, résumer et attribuer correctement les informations d’une page. Les deux reposent sur une base technique et éditoriale commune.',
      },
      {
        question: 'Pouvez-vous garantir une première position ou une citation par une IA ?',
        answer:
          'Non. Aucun prestataire sérieux ne peut garantir un classement ou une citation contrôlé par un moteur tiers. Le travail consiste à améliorer les signaux techniques, la pertinence, la clarté, les preuves et la mesure.',
      },
      {
        question: 'Faut-il créer une page pour chaque service ?',
        answer:
          'Une page dédiée est pertinente lorsque le service répond à une intention distincte et peut fournir un contenu réellement spécifique. Multiplier des pages presque identiques serait contre-productif.',
      },
      {
        question: 'Les données structurées suffisent-elles pour être cité par les moteurs génératifs ?',
        answer:
          'Non. Elles clarifient les entités et relations, mais ne remplacent ni un contenu utile, ni des preuves vérifiables, ni une architecture de liens cohérente.',
      },
    ],
    keywords: [
      'création site web SEO',
      'Generative Engine Optimization',
      'GEO référencement',
      'site optimisé AI Overviews',
      'SEO technique B2B',
      'données structurées Schema.org',
    ],
  },
] satisfies ServicePageData[]

export const servicePagesBySlug = Object.fromEntries(
  servicePages.map((service) => [service.slug, service]),
) as Record<string, ServicePageData>

export function createServiceMetadata(service: ServicePageData): Metadata {
  const canonical = `/${service.slug}`

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    keywords: service.keywords,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      url: `${siteConfig.url}${canonical}`,
      title: `${service.metaTitle} — Novekia`,
      description: service.metaDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: '/og.png',
          width: 1200,
          height: 630,
          alt: `${service.metaTitle} — Novekia`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${service.metaTitle} — Novekia`,
      description: service.metaDescription,
      images: ['/og.png'],
    },
  }
}
