export const PAID_AUDIT_OFFERS = {
  optimisation: {
    id: 'optimisation',
    label: 'Fondations & Conversion',
    priceCents: 49_000,
    priceLabel: '490 € HT',
    audience: 'Indépendants / petites structures / site vitrine',
    description:
      'Audit priorisé des fondations techniques, SEO et conversion avant accélération de l’acquisition.',
  },
  visibility: {
    id: 'visibility',
    label: 'Visibilité Locale & GEO/AEO',
    priceCents: 99_000,
    priceLabel: '990 € HT',
    audience: 'Entreprises locales / multi-services / acquisition locale',
    description:
      'Audit approfondi de la découvrabilité locale et de la capacité du site à être compris et repris dans les moteurs et réponses IA.',
  },
  authority: {
    id: 'authority',
    label: 'Autorité & Plan Stratégique',
    priceCents: 149_000,
    priceLabel: '1 490 € HT',
    audience: 'PME en croissance / refonte / accompagnement direction',
    description:
      'Audit stratégique de l’autorité, des signaux externes et des priorités de croissance.',
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
