export const PUBLIC_AUDIT_SCORE_VERSION = 'public-audit-v1' as const

const PUBLIC_AUDIT_SCORE_CATEGORIES = [
  'accessibility_indexability',
  'on_page_seo',
  'structured_data_entity',
  'technical_integrity',
] as const

export type PublicAuditFinding = {
  id: string
  category: string
  severity: string
  title: string
  finding: string
  affected_url: string
  confidence: string
  verification_status: string
  evidence_excerpt: string | null
  evidence_source_url: string | null
  recommendation?: string | null
}

export type PublicAuditResult = {
  audit_id: string
  target_url: string
  target_domain: string
  status: 'completed'
  public_audit_score: number
  category_scores: Record<string, number>
  category_coverage: Record<string, number>
  coverage: number
  score_version: typeof PUBLIC_AUDIT_SCORE_VERSION
  confidence_score: number
  pages_collected: number
  pages_planned: number
  total_findings: number
  summary: string
  positive_observations: string[]
  findings: PublicAuditFinding[]
}

function isBoundedScore(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100
}

function isV1ScoreMap(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const scores = value as Record<string, unknown>
  return (
    Object.values(scores).every(isBoundedScore) &&
    PUBLIC_AUDIT_SCORE_CATEGORIES.every((category) => isBoundedScore(scores[category]))
  )
}

function isNonNegativeInteger(value: unknown) {
  return Number.isInteger(value) && typeof value === 'number' && value >= 0
}

export function isPublicAuditResult(value: unknown): value is PublicAuditResult {
  if (!value || typeof value !== 'object') return false
  const data = value as Record<string, unknown>

  return (
    typeof data.audit_id === 'string' &&
    typeof data.target_url === 'string' &&
    typeof data.target_domain === 'string' &&
    data.status === 'completed' &&
    isBoundedScore(data.public_audit_score) &&
    isV1ScoreMap(data.category_scores) &&
    isV1ScoreMap(data.category_coverage) &&
    isBoundedScore(data.coverage) &&
    data.score_version === PUBLIC_AUDIT_SCORE_VERSION &&
    isBoundedScore(data.confidence_score) &&
    isNonNegativeInteger(data.pages_collected) &&
    isNonNegativeInteger(data.pages_planned) &&
    isNonNegativeInteger(data.total_findings) &&
    typeof data.summary === 'string' &&
    Array.isArray(data.positive_observations) &&
    Array.isArray(data.findings)
  )
}
