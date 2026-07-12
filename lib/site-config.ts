export const siteConfig = {
  name: 'Novekia',
  tagline: 'Synergies Intelligentes',
  description:
    "Novekia est un studio français d'ingénierie logicielle, d'intelligence artificielle locale, d'infrastructures de calcul haute performance et de R&D technologique. Nous concevons des infrastructures modulaires, sécurisées et évolutives pour accélérer vos performances.",
  url: 'https://www.novekia.fr',
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
    href: '#expertises',
    children: [
      {
        label: 'Vue d\'ensemble',
        href: '#expertises',
        description: 'Tous nos domaines d\'expertise.',
      },
      {
        label: 'Logiciels métiers sur mesure',
        href: '#solution-logiciels-metiers',
        description: 'Applications sur mesure pour vos opérations.',
      },
      {
        label: 'Intelligence artificielle locale',
        href: '#solution-ia-locale',
        description: 'Modèles IA déployés sur site, sans dépendance cloud.',
      },
      {
        label: 'Infrastructures de calcul & serveurs IA',
        href: '#solution-infrastructures-ia',
        description: 'Conception, intégration et optimisation de stations GPU et serveurs IA.',
      },
      {
        label: 'Applications web et intégrations',
        href: '#solution-applications-web',
        description: 'Interfaces, API et automatisations.',
      },
      {
        label: 'SEO et GEO',
        href: '#solution-seo-geo',
        description: 'Sites structurés et recherche assistée.',
      },
    ],
  },
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
    href: '#positionnement',
    children: [
      {
        label: 'Le studio Novekia',
        href: '#positionnement',
        description: 'Qui nous sommes.',
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
    href: '#research',
    children: [
      {
        label: 'Technologies',
        href: '#technologies',
        description: 'Notre stack technologique.',
      },
      {
        label: 'Expertises',
        href: '#expertises',
        description: 'Nos domaines d\'intervention.',
      },
      {
        label: 'Recherche et développement',
        href: '#research',
        description: 'Nos innovations.',
      },
      {
        label: 'Contact',
        href: '#contact',
        description: 'Nous contacter.',
      },
      {
        label: 'Demander un audit',
        href: '#contact',
        description: 'Demande d\'audit gratuit.',
      },
    ],
  },
  { label: 'Contact', href: '#contact' },
]

export const footerNavigation: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Solutions',
    links: [
      { label: 'Vue d\'ensemble', href: '#expertises' },
      { label: 'Logiciels métiers', href: '#solution-logiciels-metiers' },
      { label: 'Intelligence locale', href: '#solution-ia-locale' },
      { label: 'Infrastructures & IA', href: '#solution-infrastructures-ia' },
      { label: 'Applications web', href: '#solution-applications-web' },
      { label: 'SEO et GEO', href: '#solution-seo-geo' },
    ],
  },
  {
    title: 'Studio',
    links: [
      { label: 'Le studio', href: '#positionnement' },
      { label: 'Méthode', href: '#methode' },
      { label: 'Souveraineté', href: '#souverainete' },
      { label: 'R&D', href: '#research' },
    ],
  },
  {
    title: 'Ressources',
    links: [
      { label: 'Technologies', href: '#technologies' },
      { label: 'Contact', href: '#contact' },
      { label: 'Demander un audit', href: '#contact' },
    ],
  },
]
