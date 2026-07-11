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
        label: 'Infrastructures IA',
        href: '/solutions/infrastructures-ia',
        description: 'Stations de calcul et serveurs IA souverains.',
      },
      {
        label: 'Logiciels métiers',
        href: '/solutions/logiciels-metiers',
        description: 'Applications sur mesure pour vos opérations.',
      },
      {
        label: 'Intelligence locale',
        href: '/solutions/intelligence-locale',
        description: 'Modèles IA déployés sur site, sans dépendance cloud.',
      },
    ],
  },
  { label: 'Services', href: '#expertises' },
  { label: 'À propos', href: '#positionnement' },
  { label: 'Ressources', href: '#research' },
  { label: 'Contact', href: '#contact' },
]

export const footerNavigation: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Solutions',
    links: [
      { label: 'Infrastructures IA', href: '/solutions/infrastructures-ia' },
      { label: 'Logiciels métiers', href: '/solutions/logiciels-metiers' },
      { label: 'Intelligence locale', href: '/solutions/intelligence-locale' },
      { label: 'Stations de calcul', href: '/solutions/stations-de-calcul' },
    ],
  },
  {
    title: 'Studio',
    links: [
      { label: 'À propos', href: '/a-propos' },
      { label: 'Méthode', href: '#methode' },
      { label: 'R&D', href: '#research' },
      { label: 'Souveraineté', href: '/souverainete' },
    ],
  },
  {
    title: 'Ressources',
    links: [
      { label: 'Documentation', href: '/ressources' },
      { label: 'Études de cas', href: '/ressources/etudes-de-cas' },
      { label: 'Contact', href: '#contact' },
      { label: 'Demander un audit', href: '#contact' },
    ],
  },
]
