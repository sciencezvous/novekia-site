export const siteConfig = {
  name: 'Novekia',
  tagline: 'Synergies Intelligentes',
  description:
    'Novekia réunit un Lead Engine Studio pour la prospection B2B et un studio de solutions numériques : IA locale, logiciels métiers et infrastructures de calcul.',
  url: 'https://novekia.fr',
  contact: {
    email: 'contact@novekia.fr',
    phone: '07 67 84 27 57',
    phoneE164: '+33767842757',
    phoneHref: 'tel:+33767842757',
  },
  legal: {
    owner: 'Andy Legrand',
    tradingName: 'Novekia',
    status: 'Entrepreneur individuel (EI)',
    siren: '106 923 758',
    siret: '106 923 758 00010',
    streetAddress: '41 rue du Trève',
    postalCode: '01480',
    locality: 'Villeneuve',
    country: 'France',
  },
} as const

export type NavItem = {
  label: string
  href: string
  children?: { label: string; href: string; description?: string }[]
}

export const mainNavigation: NavItem[] = [
  { label: 'Lead Engine Studio', href: '/lead-engine-studio' },
  {
    label: 'Solutions',
    href: '/solutions',
    children: [
      {
        label: 'Vue d’ensemble',
        href: '/solutions',
        description: 'Le point d’entrée des prestations techniques.',
      },
      {
        label: 'Sites web SEO & GEO',
        href: '/creation-site-web-seo-geo',
        description: 'Sites premium, visibles et structurés.',
      },
      {
        label: 'Logiciels métiers',
        href: '/logiciels-metiers-sur-mesure',
        description: 'Outils sur mesure pour vos opérations.',
      },
      {
        label: 'Applications et automatisations',
        href: '/applications-web-integrations',
        description: 'Interfaces, API, intégrations et flux.',
      },
      {
        label: 'IA locale',
        href: '/intelligence-artificielle-locale',
        description: 'Systèmes d’IA exécutés sous votre contrôle.',
      },
      {
        label: 'Infrastructures et serveurs IA',
        href: '/infrastructures-serveurs-ia',
        description: 'Stations GPU et infrastructures de calcul.',
      },
    ],
  },
  { label: 'Méthode', href: '/#methode' },
  { label: 'À propos', href: '/a-propos' },
  {
    label: 'Ressources',
    href: '/ressources',
    children: [
      {
        label: 'Centre de ressources',
        href: '/ressources',
        description: 'Guides, preuves et outils de cadrage.',
      },
      {
        label: 'Actualités & analyses IA',
        href: '/actualites-ia',
        description: 'Les nouveautés IA traduites en décisions utiles.',
      },
      {
        label: 'Calculateur IA local',
        href: '/outils/dimensionnement-ia',
        description: 'Estimer VRAM, RAM, stockage et architecture.',
      },
      {
        label: 'IA locale ou API cloud',
        href: '/ressources/ia-locale-vs-api-cloud',
        description: 'Comparer les architectures et leurs contraintes.',
      },
    ],
  },
  { label: 'Contact', href: '/#contact' },
]

export const footerNavigation: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Lead Engine Studio',
    links: [
      { label: 'Présentation', href: '/lead-engine-studio' },
      { label: 'Méthode', href: '/lead-engine-studio#methode' },
      { label: 'Contact', href: '/#contact' },
    ],
  },
  {
    title: 'Novekia Solutions',
    links: [
      { label: 'Vue d’ensemble', href: '/solutions' },
      { label: 'Sites web SEO & GEO', href: '/creation-site-web-seo-geo' },
      { label: 'Logiciels métiers', href: '/logiciels-metiers-sur-mesure' },
      { label: 'IA locale', href: '/intelligence-artificielle-locale' },
      { label: 'Infrastructures IA', href: '/infrastructures-serveurs-ia' },
    ],
  },
  {
    title: 'Studio',
    links: [
      { label: 'À propos', href: '/a-propos' },
      { label: 'Vision du fondateur', href: '/a-propos#vision' },
      { label: 'Méthode', href: '/#methode' },
      { label: 'Contact', href: '/#contact' },
    ],
  },
  {
    title: 'Ressources',
    links: [
      { label: 'Centre de ressources', href: '/ressources' },
      { label: 'Actualités & analyses IA', href: '/actualites-ia' },
      { label: 'Calculateur IA local', href: '/outils/dimensionnement-ia' },
      { label: 'Démonstrateur RAG local', href: '/ressources/demonstrateur-rag-local' },
      { label: 'IA locale ou API cloud', href: '/ressources/ia-locale-vs-api-cloud' },
      { label: 'RAG local en entreprise', href: '/ressources/rag-local-entreprise' },
    ],
  },
]
