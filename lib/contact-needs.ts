export const contactNeedOptions = [
  'Prospection B2B et qualification commerciale',
  'Logiciel sur mesure',
  'Intelligence artificielle locale',
  'Station ou serveur IA',
  'Infrastructure de calcul',
  'Application web',
  'SEO et GEO',
  'Audit technique',
  'Autre',
] as const

export type ContactNeed = (typeof contactNeedOptions)[number]

export function isContactNeed(value: string): value is ContactNeed {
  return (contactNeedOptions as readonly string[]).includes(value)
}
