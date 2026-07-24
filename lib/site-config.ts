export const siteConfig = {
  name: 'Novekia',
  tagline: 'Synergies Intelligentes',
  description:
    "Novekia est un studio français d'ingénierie logicielle, d'intelligence artificielle locale, d'infrastructures de calcul haute performance et de R&D technologique. Nous concevons des infrastructures modulaires, sécurisées et évolutives pour accélérer vos performances.",
  url: 'https://novekia.fr',
  contact: {
    email: 'contact@novekia.fr',
  },
} as const

export type NavItem = {
  label: string
  href: string
  children?: { label: string; href: string; description?: string }[]
}

export const mainNavigation: NavItem[] = [
  {
    label: 'Solutions',
    href: '/offres',
    children: [
      {
        label: 'Vue d\'ensemble',
        href: '/offres',
        description: 'Tous nos domaines d\'expertise.',
      },
      {
        label: 'Logiciels métiers sur mesure',
        href: '/logiciels-metiers-sur-mesure',
        description: 'Applications sur mesure pour vos opérations.',
      },
      {
        label: 'Intelligence artificielle locale',
        href: '/intelligence-artificielle-locale',
        description: 'Modèles IA déployés sur site, sans dépendance cloud.',
      },
      {
        label: 'Infrastructures de calcul & serveurs IA',
        href: '/infrastructures-serveurs-ia',
        description: 'Conception, intégration et optimisation de stations GPU et serveurs IA.',
      },
      {
        label: 'Applications web et intégrations',
        href: '/applications-web-integrations',
        description: 'Interfaces, API et automatisations.',
      },
      {
        label: 'Création de sites web optimisés SEO & GEO',
        href: '/creation-site-web-seo-geo',
        description: 'Sites premium structurés pour Google et les moteurs de réponse IA.',
      },
    ],
  },
  { label: 'Offres', href: '/offres' },
  {
    label: 'Services',
    href: '#methode',
    children: [
      {
        label: 'Vue d\'ensemble',
        href: '#methode',
        description: 'Notre démarche d\'ingénierie.',
      },
      {
        label: 'Cadrage',
        href: '#service-cadrage',
        description: 'Compréhension du besoin et objectifs.',
      },
      {
        label: 'Audit',
        href: '#service-audit',
        description: 'Analyse de l\'existant et des risques.',
      },
      {
        label: 'Architecture',
        href: '#service-architecture',
        description: 'Définition de la solution.',
      },
      {
        label: 'Prototypage',
        href: '#service-prototypage',
        description: 'Version testable et validation.',
      },
      {
        label: 'Déploiement',
        href: '#service-deploiement',
        description: 'Mise en production et suivi.',
      },
    ],
  },
  {
    label: 'À propos',
    href: '/a-propos',
    children: [
      {
        label: 'Le studio Novekia',
        href: '/a-propos',
        description: 'Qui nous sommes.',
      },
      {
        label: 'La vision du fondateur',
        href: '/a-propos#vision',
        description: 'Pourquoi Novekia est un studio, pas une agence.',
      },
      {
        label: 'Notre méthode',
        href: '#methode',
        description: 'Notre démarche d\'ingénierie.',
      },
      {
        label: 'Intelligence souveraine',
        href: '#souverainete',
        description: 'Nos valeurs technologiques.',
      },
      {
        label: 'Recherche et développement',
        href: '#research',
        description: 'Nos innovations.',
      },
    ],
  },
  {
    label: 'Ressources',
    href: '/ressources',
    children: [
      {
        label: 'Centre de ressources',
        href: '/ressources',
        description: 'Guides, schémas et outils de décision.',
      },
      {
        label: 'IA locale ou API cloud',
        href: '/ressources/ia-locale-vs-api-cloud',
        description: 'Coûts, confidentialité et exploitation.',
      },
      {
        label: 'RAG local en entreprise',
        href: '/ressources/rag-local-entreprise',
        description: 'Architecture et conditions de réussite.',
      },
      {
        label: 'Choisir un serveur GPU',
        href: '/ressources/choisir-station-serveur-gpu-ia',
        description: 'Méthode et calculateur de mémoire.',
      },
      {
        label: 'Checklist de cadrage IA',
        href: '/ressources/checklist-cadrage-ia-locale',
        description: '40 points à vérifier avant le prototype.',
      },
    ],
  },
  { label: 'Contact', href: '#contact' },
]

export const footerNavigation: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Offres',
    links: [
      { label: 'Vue d’ensemble', href: '/offres' },
      { label: 'Logiciels métiers sur mesure', href: '/logiciels-metiers-sur-mesure' },
      { label: 'Intelligence artificielle locale', href: '/intelligence-artificielle-locale' },
      { label: 'Infrastructures de calcul & serveurs IA', href: '/infrastructures-serveurs-ia' },
      { label: 'Applications web et intégrations', href: '/applications-web-integrations' },
      { label: 'Sites optimisés SEO & GEO', href: '/creation-site-web-seo-geo' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'Vue d\'ensemble', href: '/offres' },
      { label: 'Logiciels métiers', href: '/logiciels-metiers-sur-mesure' },
      { label: 'Intelligence locale', href: '/intelligence-artificielle-locale' },
      { label: 'Infrastructures & IA', href: '/infrastructures-serveurs-ia' },
      { label: 'Applications web', href: '/applications-web-integrations' },
      { label: 'Sites optimisés SEO & GEO', href: '/creation-site-web-seo-geo' },
    ],
  },
  {
    title: 'Studio',
    links: [
      { label: 'Le studio', href: '/a-propos' },
      { label: 'Vision du fondateur', href: '/a-propos#vision' },
      { label: 'Méthode', href: '#methode' },
      { label: 'Souveraineté', href: '#souverainete' },
      { label: 'R&D', href: '#research' },
    ],
  },
  {
    title: 'Ressources',
    links: [
      { label: 'Tous les guides', href: '/ressources' },
      { label: 'IA locale ou API cloud', href: '/ressources/ia-locale-vs-api-cloud' },
      { label: 'RAG local en entreprise', href: '/ressources/rag-local-entreprise' },
      { label: 'Choisir un serveur GPU', href: '/ressources/choisir-station-serveur-gpu-ia' },
      { label: 'Checklist de cadrage IA', href: '/ressources/checklist-cadrage-ia-locale' },
    ],
  },
]
