import { siteConfig } from '@/lib/site-config'

type JsonLdProps = {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export const organizationIdentityJsonLd: Record<string, unknown> = {
  '@type': 'Organization',
  '@id': `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  url: siteConfig.url,
  logo: {
    '@type': 'ImageObject',
    '@id': `${siteConfig.url}/#logo`,
    url: `${siteConfig.url}/novekia-icon.svg`,
    contentUrl: `${siteConfig.url}/novekia-icon.svg`,
    width: 1254,
    height: 1254,
    caption: 'Logo officiel de Novekia',
  },
}

export const founderIdentityJsonLd: Record<string, unknown> = {
  '@type': 'Person',
  '@id': `${siteConfig.url}/auteurs/andy-legrand#person`,
  name: 'Andy Legrand',
  url: `${siteConfig.url}/auteurs/andy-legrand`,
  jobTitle: 'Fondateur de Novekia',
  image: `${siteConfig.url}/andy-legrand-novekia-v3.png`,
  worksFor: {
    '@id': `${siteConfig.url}/#organization`,
  },
}

export const leadEngineIdentityJsonLd: Record<string, unknown> = {
  '@type': ['SoftwareApplication', 'Product'],
  '@id': `${siteConfig.url}/lead-engine-studio#product`,
  name: 'Lead Engine',
  alternateName: 'Novekia Lead Engine Studio',
  url: `${siteConfig.url}/lead-engine-studio`,
  description:
    'Produit de prospection B2B développé par Novekia pour détecter des entreprises, qualifier des opportunités à partir de signaux publics et préparer des approches sous supervision humaine.',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  owner: { '@id': `${siteConfig.url}/#organization` },
  creator: { '@id': `${siteConfig.url}/#organization` },
  brand: { '@id': `${siteConfig.url}/#organization` },
  manufacturer: { '@id': `${siteConfig.url}/#organization` },
  mainEntityOfPage: { '@id': `${siteConfig.url}/lead-engine-studio#webpage` },
}

export const novekiActIdentityJsonLd: Record<string, unknown> = {
  '@type': ['SoftwareApplication', 'Product'],
  '@id': `${siteConfig.url}/novekiact#product`,
  name: 'NovekiAct',
  alternateName: 'NovekiAct by Novekia',
  url: `${siteConfig.url}/novekiact`,
  description:
    'Produit en développement par Novekia pour aider les PME à structurer la gouvernance de leurs usages d’intelligence artificielle.',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  creativeWorkStatus: 'En développement',
  owner: { '@id': `${siteConfig.url}/#organization` },
  creator: { '@id': `${siteConfig.url}/#organization` },
  brand: { '@id': `${siteConfig.url}/#organization` },
  manufacturer: { '@id': `${siteConfig.url}/#organization` },
  mainEntityOfPage: { '@id': `${siteConfig.url}/novekiact#webpage` },
}

export const organizationJsonLd: Record<string, unknown> = {
  '@context': 'https://schema.org',
  ...organizationIdentityJsonLd,
  '@type': ['Organization', 'ProfessionalService'],
  legalName: siteConfig.legal.owner,
  alternateName: 'Novekia — Synergies Intelligentes',
  slogan: siteConfig.tagline,
  description: siteConfig.entityDescription,
  image: `${siteConfig.url}/opengraph-image`,
  email: siteConfig.contact.email,
  telephone: siteConfig.contact.phoneE164,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phoneE164,
    availableLanguage: ['fr'],
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: siteConfig.legal.streetAddress,
    postalCode: siteConfig.legal.postalCode,
    addressLocality: siteConfig.legal.locality,
    addressCountry: 'FR',
  },
  identifier: [
    {
      '@type': 'PropertyValue',
      propertyID: 'SIREN',
      value: siteConfig.legal.siren,
    },
    {
      '@type': 'PropertyValue',
      propertyID: 'SIRET',
      value: siteConfig.legal.siret,
    },
  ],
  founder: {
    '@id': `${siteConfig.url}/auteurs/andy-legrand#person`,
  },
  areaServed: {
    '@type': 'Country',
    name: 'France',
  },
  owns: [
    { '@id': `${siteConfig.url}/lead-engine-studio#product` },
    { '@id': `${siteConfig.url}/novekiact#product` },
  ],
  knowsAbout: [
    'Prospection B2B',
    'Qualification commerciale',
    'Recherche d’entreprises et de décideurs',
    'Gouvernance des usages de l’intelligence artificielle',
    'Ingénierie logicielle',
    'Intelligence artificielle locale',
    'IA privée et souveraine',
    'Infrastructure de calcul haute performance',
    'Serveurs GPU',
    'Logiciels métiers',
    'Applications web',
    'SEO',
    'Generative Engine Optimization',
    'Answer Engine Optimization',
  ],
}

export const founderJsonLd: Record<string, unknown> = {
  '@context': 'https://schema.org',
  ...founderIdentityJsonLd,
  knowsAbout: [
    'Ingénierie logicielle',
    'Intelligence artificielle locale',
    'Infrastructure de calcul',
    'Architecture de systèmes',
  ],
}

export const websiteJsonLd: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteConfig.url}/#website`,
  url: siteConfig.url,
  name: siteConfig.name,
  description: siteConfig.description,
  inLanguage: 'fr-FR',
  publisher: {
    '@id': `${siteConfig.url}/#organization`,
  },
  about: {
    '@id': `${siteConfig.url}/#organization`,
  },
}

export const homePageJsonLd: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${siteConfig.url}/#webpage`,
  url: siteConfig.url,
  name: 'Novekia — IA, logiciels et systèmes numériques',
  description: siteConfig.description,
  inLanguage: 'fr-FR',
  isPartOf: {
    '@id': `${siteConfig.url}/#website`,
  },
  about: {
    '@id': `${siteConfig.url}/#organization`,
  },
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: `${siteConfig.url}/opengraph-image`,
    width: 1200,
    height: 630,
  },
}

function withoutContext(node: Record<string, unknown>) {
  const entity = { ...node }
  delete entity['@context']
  return entity
}

export const brandGraphJsonLd: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@graph': [
    organizationJsonLd,
    founderJsonLd,
    websiteJsonLd,
    homePageJsonLd,
    leadEngineIdentityJsonLd,
    novekiActIdentityJsonLd,
  ].map(withoutContext),
}
