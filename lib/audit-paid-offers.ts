export const PAID_AUDIT_OFFERS = {
  optimisation: {
    id: 'optimisation',
    label: 'Pack Optimisation',
    priceCents: 49_000,
    priceLabel: '490 € HT',
    startingAt: false,
    audience: 'Site dont le pré-audit révèle quelques corrections prioritaires clairement démontrées',
    description:
      'Validation humaine des constats prioritaires, corrections techniques essentielles, SEO on-page, données structurées et retest.',
  },
  visibility: {
    id: 'visibility',
    label: 'Pack Visibility',
    priceCents: 99_000,
    priceLabel: '990 € HT',
    startingAt: false,
    audience: 'Entreprise qui doit traiter ensemble SEO, GEO, AEO et compréhension de l’entité',
    description:
      'Audit approfondi Evidence-First, SEO technique et on-page, Entity SEO, GEO/AEO, plan de remédiation et retest.',
  },
  authority: {
    id: 'authority',
    label: 'Visibility Authority',
    priceCents: 149_000,
    priceLabel: 'À partir de 1 490 € HT',
    startingAt: true,
    audience: 'Entreprise qui doit étendre l’analyse à l’autorité externe et aux écarts concurrentiels',
    description:
      'Périmètre Visibility étendu aux backlinks, domaines référents, mentions, citation gaps, concurrence et opportunités Digital PR.',
  },
} as const

export type PaidAuditOfferId = keyof typeof PAID_AUDIT_OFFERS

export const PAID_AUDIT_OFFER_IDS = Object.keys(PAID_AUDIT_OFFERS) as PaidAuditOfferId[]

export function isPaidAuditOfferId(value: unknown): value is PaidAuditOfferId {
  return (
    typeof value === 'string' &&
    Object.prototype.hasOwnProperty.call(PAID_AUDIT_OFFERS, value)
  )
}
