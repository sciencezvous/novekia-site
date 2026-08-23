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
  score_version: string
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

function isScoreMap(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  return Object.values(value as Record<string, unknown>).every(isBoundedScore)
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
    isScoreMap(data.category_scores) &&
    isScoreMap(data.category_coverage) &&
    isBoundedScore(data.coverage) &&
    typeof data.score_version === 'string' &&
    data.score_version.length > 0 &&
    isBoundedScore(data.confidence_score) &&
    typeof data.pages_collected === 'number' &&
    typeof data.pages_planned === 'number' &&
    typeof data.total_findings === 'number' &&
    typeof data.summary === 'string' &&
    Array.isArray(data.positive_observations) &&
    Array.isArray(data.findings)
  )
}
