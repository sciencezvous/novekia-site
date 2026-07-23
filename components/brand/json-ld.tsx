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

export const organizationJsonLd: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'ProfessionalService'],
  '@id': `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  legalName: 'Andy Legrand — Novekia',
  slogan: siteConfig.tagline,
  description: siteConfig.description,
  url: siteConfig.url,
  logo: `${siteConfig.url}/novekia-icon.svg`,
  image: `${siteConfig.url}/og.png`,
  email: siteConfig.contact.email,
  founder: {
    '@id': `${siteConfig.url}/#andy-legrand`,
  },
  areaServed: {
    '@type': 'Country',
    name: 'France',
  },
  knowsAbout: [
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
  '@type': 'Person',
  '@id': `${siteConfig.url}/#andy-legrand`,
  name: 'Andy Legrand',
  jobTitle: 'Fondateur',
  image: `${siteConfig.url}/andy-legrand-novekia.png`,
  worksFor: {
    '@id': `${siteConfig.url}/#organization`,
  },
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
  name: 'Novekia — Infrastructure locale et intelligence souveraine',
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
