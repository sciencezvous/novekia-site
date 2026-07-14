import type { Metadata } from 'next'

export type OfferFaq = {
  question: string
  answer: string
}

export type OfferData = {
  slug: string
  shortLabel: string
  eyebrow: string
  title: string
  summary: string
  intro: string
  startingPrice: string
  duration: string
  forWhom: string[]
  outcomes: string[]
  deliverables: string[]
  process: { title: string; description: string }[]
  prerequisites: string[]
  exclusions: string[]
  faq: OfferFaq[]
  diagram: 'wifi' | 'network' | 'workshop' | 'ai'
  ctaLabel: string
}

export const offers = {
  'audit-wifi-entreprise': {
    slug: 'audit-wifi-entreprise',
    shortLabel: 'Audit Wi-Fi entreprise',
    eyebrow: 'Connectivité sur site',
    title: 'Audit Wi-Fi entreprise',
    summary: 'Diagnostiquer la couverture, les interférences et la capacité réelle de votre réseau sans fil.',
    intro: 'Une intervention structurée pour objectiver les zones faibles, comprendre les causes de dégradation et établir un plan d’amélioration exploitable par vos équipes ou votre intégrateur.',
    startingPrice: 'À partir de 1 200 € HT',
    duration: '2 à 5 jours ouvrés selon le périmètre',
    forWhom: [
      'PME, ETI et sites industriels confrontés à des coupures ou à une couverture irrégulière',
      'Établissements recevant du public avec une forte densité d’utilisateurs',
      'Équipes IT préparant un renouvellement de bornes ou une extension de site',
    ],
    outcomes: [
      'Une vision factuelle de la couverture, de la capacité et des interférences',
      'Des priorités de correction classées par impact et complexité',
      'Une base technique pour décider entre optimisation, ajout ou remplacement d’équipements',
    ],
    deliverables: [
      'Cartographie des zones couvertes et des points de vigilance',
      'Analyse des canaux, de la puissance et de la densité radio',
      'Rapport de recommandations avec ordre de priorité',
      'Restitution technique avec les parties prenantes',
    ],
    process: [
      { title: 'Cadrage', description: 'Collecte des plans, usages, équipements et incidents observés.' },
      { title: 'Mesures sur site', description: 'Relevés radio, vérifications de capacité et analyse de l’environnement.' },
      { title: 'Analyse', description: 'Corrélation des mesures avec les usages et les contraintes du bâtiment.' },
      { title: 'Restitution', description: 'Présentation des constats et d’un plan d’action hiérarchisé.' },
    ],
    prerequisites: ['Plans des zones à auditer si disponibles', 'Accès aux locaux et aux équipements concernés', 'Interlocuteur IT ou exploitation pendant le cadrage'],
    exclusions: ['Travaux de câblage ou pose de bornes', 'Achat de licences et d’équipements', 'Garantie d’un débit uniforme sans étude complémentaire de dimensionnement'],
    faq: [
      { question: 'L’audit nécessite-t-il une interruption du réseau ?', answer: 'Non dans la majorité des cas. Les mesures sont réalisées sur le réseau existant et les manipulations potentiellement perturbatrices sont convenues en amont.' },
      { question: 'Pouvez-vous intervenir sur plusieurs bâtiments ?', answer: 'Oui. Le périmètre, le calendrier et le tarif sont alors adaptés au nombre de zones, à leur surface et à leurs contraintes d’accès.' },
      { question: 'Le rapport impose-t-il une marque de matériel ?', answer: 'Non. Les recommandations sont formulées à partir des besoins observés. Une orientation constructeur peut être étudiée séparément si elle est demandée.' },
      { question: 'L’audit couvre-t-il aussi la sécurité ?', answer: 'Les configurations visibles et les risques évidents peuvent être signalés. Un audit de sécurité approfondi constitue toutefois une mission distincte.' },
    ],
    diagram: 'wifi',
    ctaLabel: 'Planifier un audit Wi-Fi',
  },
  'interconnexion-multi-sites': {
    slug: 'interconnexion-multi-sites',
    shortLabel: 'Interconnexion multi-sites',
    eyebrow: 'Réseaux privés',
    title: 'Interconnexion multi-sites',
    summary: 'Relier vos agences, ateliers et infrastructures avec une architecture lisible, sécurisée et adaptée aux usages.',
    intro: 'Nous cadrons l’architecture d’interconnexion, les flux critiques, les mécanismes de résilience et le plan de migration pour réduire le risque avant toute mise en production.',
    startingPrice: 'À partir de 2 800 € HT',
    duration: '1 à 3 semaines selon le nombre de sites',
    forWhom: [
      'Organisations réparties sur plusieurs bureaux, agences ou sites de production',
      'Équipes qui souhaitent remplacer un assemblage historique de VPN',
      'Entreprises préparant une ouverture, une fusion ou une migration opérateur',
    ],
    outcomes: [
      'Une architecture cible documentée et compréhensible',
      'Des flux et responsabilités clairement identifiés',
      'Un scénario de migration qui limite les interruptions',
    ],
    deliverables: [
      'Cartographie logique des sites et des flux',
      'Architecture cible et principes de segmentation',
      'Matrice des accès, dépendances et niveaux de criticité',
      'Plan de migration, de validation et de retour arrière',
    ],
    process: [
      { title: 'Inventaire', description: 'Recensement des sites, accès opérateurs, équipements et dépendances.' },
      { title: 'Conception', description: 'Définition de l’architecture cible, du routage et de la segmentation.' },
      { title: 'Plan de migration', description: 'Ordonnancement des bascules, validations et solutions de repli.' },
      { title: 'Accompagnement', description: 'Revue avec vos équipes et assistance pendant les étapes critiques convenues.' },
    ],
    prerequisites: ['Inventaire des accès et équipements existants', 'Accès aux configurations utiles ou disponibilité de l’intégrateur', 'Interlocuteurs réseau, sécurité et métier identifiés'],
    exclusions: ['Abonnements opérateurs et frais de raccordement', 'Fourniture de pare-feu, routeurs ou licences', 'Exploitation récurrente après la période d’accompagnement'],
    faq: [
      { question: 'Travaillez-vous avec nos opérateurs existants ?', answer: 'Oui. L’offre est indépendante des opérateurs et peut intégrer les contraintes de contrats ou de technologies déjà en place.' },
      { question: 'La mission inclut-elle la mise en œuvre ?', answer: 'La conception et le plan de migration sont inclus. La mise en œuvre peut être ajoutée au périmètre après validation de l’architecture.' },
      { question: 'Pouvez-vous prévoir une continuité en cas de panne ?', answer: 'Oui. Les besoins de redondance sont analysés selon la criticité des sites et les options réellement disponibles.' },
      { question: 'Le télétravail est-il pris en compte ?', answer: 'Les accès distants peuvent être intégrés à l’architecture si leur analyse figure dans le périmètre de cadrage.' },
    ],
    diagram: 'network',
    ctaLabel: 'Cadrer mon interconnexion',
  },
  'atelier-architecture-ia-privee': {
    slug: 'atelier-architecture-ia-privee',
    shortLabel: 'Atelier architecture IA privée',
    eyebrow: 'Cadrage IA souveraine',
    title: 'Atelier architecture IA privée',
    summary: 'Transformer un cas d’usage IA en architecture privée réaliste, dimensionnée et gouvernable.',
    intro: 'Un atelier de décision pour aligner les objectifs métier, les données, les modèles, la sécurité et les contraintes d’exploitation avant d’engager des achats ou un développement.',
    startingPrice: 'À partir de 1 900 € HT',
    duration: '1 atelier préparé puis restitution sous 5 jours ouvrés',
    forWhom: [
      'Directions métier et IT qui explorent un assistant ou un moteur documentaire privé',
      'Organisations soumises à des contraintes de confidentialité ou de localisation des données',
      'Équipes qui doivent arbitrer entre API externe, cloud privé et déploiement sur site',
    ],
    outcomes: [
      'Un cas d’usage priorisé avec des critères de réussite explicites',
      'Une architecture cible adaptée au niveau de confidentialité',
      'Des hypothèses de dimensionnement et une feuille de route testable',
    ],
    deliverables: [
      'Synthèse du cas d’usage et des contraintes',
      'Schéma d’architecture privée et flux de données',
      'Options de modèles, d’inférence et de stockage à évaluer',
      'Plan de prototype avec risques et décisions à lever',
    ],
    process: [
      { title: 'Préparation', description: 'Questionnaire, collecte des contraintes et sélection du cas d’usage.' },
      { title: 'Atelier', description: 'Session collaborative autour des données, usages, sécurité et exploitation.' },
      { title: 'Conception', description: 'Formalisation des options d’architecture et des hypothèses de capacité.' },
      { title: 'Restitution', description: 'Décisions recommandées et plan de validation progressif.' },
    ],
    prerequisites: ['Un cas d’usage ou une famille de cas d’usage identifiée', 'Représentants métier, IT et sécurité disponibles', 'Exemples de données ou description de leur nature et de leur volume'],
    exclusions: ['Entraînement ou développement d’un modèle', 'Benchmark matériel complet', 'Avis juridique ou certification de conformité'],
    faq: [
      { question: 'Faut-il déjà avoir choisi un modèle ?', answer: 'Non. L’atelier sert justement à définir les critères de choix et les familles de modèles à tester.' },
      { question: 'Pouvons-nous venir avec plusieurs cas d’usage ?', answer: 'Oui, mais l’atelier vise à les comparer puis à prioriser un périmètre suffisamment précis pour obtenir une architecture actionnable.' },
      { question: 'Abordez-vous le RAG et les bases vectorielles ?', answer: 'Oui lorsqu’ils répondent au cas d’usage. Ils ne sont pas retenus par défaut et doivent être justifiés par les données et les attentes.' },
      { question: 'Le livrable peut-il servir à consulter des fournisseurs ?', answer: 'Oui. Il fournit une base technique structurée, à compléter si nécessaire par un cahier des charges d’achat détaillé.' },
    ],
    diagram: 'workshop',
    ctaLabel: 'Organiser un atelier IA privée',
  },
  'deploiement-ia-on-premise': {
    slug: 'deploiement-ia-on-premise',
    shortLabel: 'Déploiement IA on-premise',
    eyebrow: 'Mise en production privée',
    title: 'Déploiement IA on-premise',
    summary: 'Installer et intégrer une chaîne d’inférence IA dans votre environnement, sous le contrôle de vos équipes.',
    intro: 'Nous mettons en place un socle d’exécution privé, documenté et observable, puis accompagnons la validation technique du cas d’usage retenu avant son passage en exploitation.',
    startingPrice: 'À partir de 6 500 € HT',
    duration: '3 à 8 semaines selon l’intégration',
    forWhom: [
      'Organisations ayant validé un cas d’usage et une architecture cible',
      'Équipes disposant ou prévoyant une infrastructure GPU compatible',
      'Environnements où les données ou les traitements doivent rester maîtrisés',
    ],
    outcomes: [
      'Un service d’inférence privé intégré à votre environnement',
      'Une configuration reproductible et documentée',
      'Des critères de validation avant ouverture aux utilisateurs',
    ],
    deliverables: [
      'Installation du runtime et configuration de l’inférence',
      'Intégration aux sources de données et aux interfaces prévues au périmètre',
      'Journalisation, supervision de base et procédures d’exploitation',
      'Dossier de validation et transfert aux équipes',
    ],
    process: [
      { title: 'Validation technique', description: 'Revue de l’infrastructure, du modèle, des données et des interfaces.' },
      { title: 'Installation', description: 'Déploiement du runtime, des dépendances et des contrôles d’accès.' },
      { title: 'Intégration', description: 'Connexion au cas d’usage et mise en place de l’observabilité prévue.' },
      { title: 'Recette et transfert', description: 'Tests, documentation et accompagnement des équipes d’exploitation.' },
    ],
    prerequisites: ['Architecture cible validée', 'Infrastructure disponible et accès administrateur encadré', 'Cas d’usage, données de test et critères de recette définis'],
    exclusions: ['Fourniture de serveurs ou de GPU', 'Coûts de licences propriétaires éventuelles', 'Entraînement fondamental d’un modèle ou exploitation 24/7'],
    faq: [
      { question: 'Pouvez-vous dimensionner le matériel avant le projet ?', answer: 'Oui, mais cette étude doit être ajoutée si le dimensionnement n’a pas déjà été validé pendant le cadrage.' },
      { question: 'Le déploiement fonctionne-t-il sans accès Internet ?', answer: 'C’est possible selon les modèles, licences et dépendances retenus. Les contraintes de fonctionnement isolé sont à préciser dès le cadrage.' },
      { question: 'Intégrez-vous l’authentification de l’entreprise ?', answer: 'Oui lorsque le système d’identité et le niveau d’intégration sont inclus dans le périmètre technique.' },
      { question: 'Assurez-vous la maintenance après la recette ?', answer: 'Un accompagnement ou un contrat de maintenance peut être proposé séparément selon les niveaux de service attendus.' },
    ],
    diagram: 'ai',
    ctaLabel: 'Étudier mon déploiement on-premise',
  },
} satisfies Record<string, OfferData>

export type OfferSlug = keyof typeof offers

export const offerList = Object.values(offers)

export function getOffer(slug: string) {
  return offers[slug as OfferSlug]
}

export function getOfferMetadata(offer: OfferData): Metadata {
  return {
    title: offer.title,
    description: offer.summary,
    alternates: { canonical: `/offres/${offer.slug}` },
    openGraph: {
      title: `${offer.title} | Novekia`,
      description: offer.summary,
      url: `/offres/${offer.slug}`,
      type: 'website',
      locale: 'fr_FR',
    },
  }
}
