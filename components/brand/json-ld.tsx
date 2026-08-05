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
    url: `${siteConfig.url}/novekia-icon.svg`,
  },
}

export const founderIdentityJsonLd: Record<string, unknown> = {
  '@type': 'Person',
  '@id': `${siteConfig.url}/#andy-legrand`,
  name: 'Andy Legrand',
  url: `${siteConfig.url}/a-propos`,
  jobTitle: 'Fondateur',
  image: `${siteConfig.url}/andy-legrand-novekia-v3.png`,
  worksFor: {
    '@id': `${siteConfig.url}/#organization`,
  },
}

export const organizationJsonLd: Record<string, unknown> = {
  '@context': 'https://schema.org',
  ...organizationIdentityJsonLd,
  '@type': ['Organization', 'ProfessionalService'],
  legalName: 'Andy Legrand — Novekia',
  slogan: siteConfig.tagline,
  description: siteConfig.description,
  image: `${siteConfig.url}/og.png`,
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
    '@id': `${siteConfig.url}/#andy-legrand`,
  },
  areaServed: {
    '@type': 'Country',
    name: 'France',
  },
  department: [
    {
      '@type': 'Organization',
      '@id': `${siteConfig.url}/lead-engine-studio#department`,
      name: 'Novekia Lead Engine Studio',
      url: `${siteConfig.url}/lead-engine-studio`,
      description:
        'Pôle Novekia consacré à la prospection et à la qualification commerciale B2B sous supervision humaine.',
      parentOrganization: {
        '@id': `${siteConfig.url}/#organization`,
      },
    },
    {
      '@type': 'Organization',
      '@id': `${siteConfig.url}/solutions#department`,
      name: 'Novekia Solutions',
      url: `${siteConfig.url}/solutions`,
      description:
        'Pôle Novekia consacré à la conception et à l’intégration de solutions numériques et d’infrastructures.',
      parentOrganization: {
        '@id': `${siteConfig.url}/#organization`,
      },
    },
  ],
  knowsAbout: [
    'Prospection B2B',
    'Qualification commerciale',
    'Recherche d’entreprises et de décideurs',
    'Ingénierie logicielle',
    'Intelligence artificielle locale',
    'IA privée et souveraine',
    'Infrastructure de calcul haute performance',
    'Serveurs GPU',
    'Logiciels métiers',
    'Applications web',
    'SEO',
    'Generative Engine Optimization',
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
}

export const homePageJsonLd: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${siteConfig.url}/#webpage`,
  url: siteConfig.url,
  name: 'Novekia — Lead Engine Studio et solutions technologiques',
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
    url: `${siteConfig.url}/og.png`,
  },
}
