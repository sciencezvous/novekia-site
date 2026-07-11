import { siteConfig } from '@/lib/site-config'

type JsonLdProps = {
  data: Record<string, unknown>
}

/**
 * Injecte des données structurées JSON-LD (schema.org) pour le SEO.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // Contenu contrôlé côté serveur, non issu d'une entrée utilisateur.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

/** Données structurées Organization par défaut pour Novekia. */
export const organizationJsonLd: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  slogan: siteConfig.tagline,
  description: siteConfig.description,
  url: siteConfig.url,
  email: siteConfig.contact.email,
  telephone: siteConfig.contact.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '41 rue du Trêve',
    postalCode: '01480',
    addressLocality: 'Villeneuve',
    addressCountry: 'FR',
  },
}
