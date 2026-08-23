export const siteConfig = {
  name: 'Novekia',
  tagline: 'Synergies Intelligentes',
  description:
    'Entreprise technologique française : Lead Engine pour la prospection B2B, NovekiAct pour la gouvernance IA, logiciels, IA locale et infrastructures.',
  entityDescription:
    'Novekia est une entreprise technologique française basée à Villeneuve, dans l’Ain. Elle développe Lead Engine, un produit de prospection B2B fondé sur les signaux, et NovekiAct, un produit de gouvernance des usages IA pour les PME. Novekia fournit aussi des services d’ingénierie logicielle, d’IA locale et d’infrastructure numérique.',
  url: 'https://novekia.fr',
  contact: {
    email: 'contact@novekia.fr',
    phone: '07 67 84 27 57',
    phoneE164: '+33767842757',
    phoneHref: 'tel:+33767842757',
  },
  profiles: {
    linkedinCompany: 'https://www.linkedin.com/company/novekia/',
    linkedinFounder: 'https://www.linkedin.com/in/andy-legrand-ba7b05426/',
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
  {
    label: 'Produits',
    href: '/produits',
    children: [
      {
        label: 'Vue d’ensemble',
        href: '/produits',
        description: 'Les produits développés par Novekia.',
      },
      {
        label: 'Lead Engine',
        href: '/lead-engine-studio',
        description: 'Prospection B2B fondée sur les signaux.',
      },
      {
        label: 'NovekiAct',
        href: '/novekiact',
        description: 'Gouvernance des usages IA pour les PME.',
      },
    ],
  },
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
  { label: 'Preuves', href: '/preuves' },
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
        label: 'Preuves Novekia',
        href: '/preuves',
        description: 'Validations techniques, démonstrations et retours terrain.',
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
    title: 'Produits Novekia',
    links: [
      { label: 'Vue d’ensemble', href: '/produits' },
      { label: 'Lead Engine', href: '/lead-engine-studio' },
      { label: 'Méthode Lead Engine', href: '/lead-engine-studio#methode' },
      { label: 'NovekiAct', href: '/novekiact' },
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
      { label: 'Fondateur et auteur', href: '/auteurs/andy-legrand' },
      { label: 'Vision du fondateur', href: '/a-propos#vision' },
      { label: 'Méthode', href: '/#methode' },
      { label: 'Preuves Novekia', href: '/preuves' },
      { label: 'Contact', href: '/#contact' },
    ],
  },
  {
    title: 'Ressources',
    links: [
      { label: 'Centre de ressources', href: '/ressources' },
      { label: 'Preuves propriétaires', href: '/preuves' },
      { label: 'Actualités & analyses IA', href: '/actualites-ia' },
      { label: 'Calculateur IA local', href: '/outils/dimensionnement-ia' },
      { label: 'Démonstrateur RAG local', href: '/ressources/demonstrateur-rag-local' },
      { label: 'IA locale ou API cloud', href: '/ressources/ia-locale-vs-api-cloud' },
      { label: 'RAG local en entreprise', href: '/ressources/rag-local-entreprise' },
    ],
  },
]
