export const PAID_AUDIT_OFFERS = {
  full: {
    id: 'full',
    label: 'Audit Visibility Full',
    priceCents: 9_900,
    priceLabel: '99 € HT',
    startingAt: false,
    audience: 'Entreprise qui veut un diagnostic complet à partir des données publiques avant toute remédiation',
    description:
      'Audit complet sur données publiques : SEO technique et on-page, Entity SEO, GEO/AEO, preuves, scoring, priorisation, rapport premium et plan de remédiation. Aucune correction technique n’est incluse.',
  },
} as const

export const REMEDIATION_OFFERS = {
  optimisation: {
    id: 'optimisation',
    label: 'Remédiation ciblée',
    priceLabel: '490 € HT',
    startingAt: false,
    description:
      'Correction des priorités clairement démontrées par l’audit, avec validation humaine et retest des points corrigés.',
  },
  visibility: {
    id: 'visibility',
    label: 'Remédiation Visibility',
    priceLabel: '990 € HT',
    startingAt: false,
    description:
      'Exécution d’un plan de remédiation plus large couvrant SEO, Entity SEO, GEO/AEO et retest.',
  },
  authority: {
    id: 'authority',
    label: 'Visibility Authority',
    priceLabel: 'À partir de 1 490 € HT',
    startingAt: true,
    description:
      'Extension à l’autorité externe : backlinks, domaines référents, mentions, citation gaps, concurrence et opportunités Digital PR.',
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
