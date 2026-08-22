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
  opportunity_index: number
  coverage_score: number
  confidence_score: number
  pages_collected: number
  pages_planned: number
  total_findings: number
  summary: string
  positive_observations: string[]
  findings: PublicAuditFinding[]
}

export function isPublicAuditResult(value: unknown): value is PublicAuditResult {
  if (!value || typeof value !== 'object') return false
  const data = value as Record<string, unknown>

  return (
    typeof data.audit_id === 'string' &&
    typeof data.target_url === 'string' &&
    typeof data.target_domain === 'string' &&
    data.status === 'completed' &&
    typeof data.opportunity_index === 'number' &&
    data.opportunity_index >= 0 &&
    data.opportunity_index <= 100 &&
    typeof data.coverage_score === 'number' &&
    typeof data.confidence_score === 'number' &&
    typeof data.pages_collected === 'number' &&
    typeof data.pages_planned === 'number' &&
    typeof data.total_findings === 'number' &&
    typeof data.summary === 'string' &&
    Array.isArray(data.positive_observations) &&
    Array.isArray(data.findings)
  )
}
