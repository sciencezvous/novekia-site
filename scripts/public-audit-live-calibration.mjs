import { randomUUID } from 'node:crypto'

if (process.env.VERCEL_ENV !== 'preview') process.exit(0)

const token = process.env.NOVEKIA_AUDIT_INGRESS_TOKEN?.trim()
const baseUrl = (
  process.env.NOVEKIA_AUDIT_INGRESS_URL?.trim() ||
  'https://novekia-lead-engine-studio-production.up.railway.app/api/public/website-audit'
).replace(/\/+$/, '')

if (!token) {
  console.log('PUBLIC_AUDIT_LIVE_CALIBRATION', JSON.stringify({ ok: false, reason: 'missing_preview_token' }))
  process.exit(0)
}

const targets = ['https://instant-devis.fr/', 'https://novekia.fr/']

for (const target_url of targets) {
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Novekia-Audit-Key': token,
        'Idempotency-Key': `live-calibration-${randomUUID()}`,
      },
      body: JSON.stringify({ target_url }),
    })

    const payload = await response.json().catch(() => null)
    if (!response.ok || !payload || typeof payload !== 'object') {
      console.log(
        'PUBLIC_AUDIT_LIVE_CALIBRATION',
        JSON.stringify({ target_url, ok: false, status: response.status })
      )
      continue
    }

    const findings = Array.isArray(payload.findings) ? payload.findings : []
    console.log(
      'PUBLIC_AUDIT_LIVE_CALIBRATION',
      JSON.stringify({
        target_url,
        ok: true,
        target_domain: payload.target_domain,
        public_audit_score: payload.public_audit_score,
        coverage: payload.coverage,
        score_version: payload.score_version,
        pages_collected: payload.pages_collected,
        pages_planned: payload.pages_planned,
        total_findings: payload.total_findings,
        public_findings_returned: findings.length,
        category_scores: payload.category_scores,
        category_coverage: payload.category_coverage,
        findings: findings.map((finding) => ({
          category: finding.category,
          severity: finding.severity,
          title: finding.title,
          verification_status: finding.verification_status,
          evidence_excerpt:
            typeof finding.evidence_excerpt === 'string'
              ? finding.evidence_excerpt.slice(0, 240)
              : null,
        })),
      })
    )
  } catch (error) {
    console.log(
      'PUBLIC_AUDIT_LIVE_CALIBRATION',
      JSON.stringify({
        target_url,
        ok: false,
        reason: error instanceof Error ? error.name : 'unknown_error',
      })
    )
  }
}
