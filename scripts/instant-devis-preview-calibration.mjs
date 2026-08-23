import { randomUUID } from 'node:crypto'

if (process.env.VERCEL_ENV !== 'preview') process.exit(0)

const token = process.env.NOVEKIA_AUDIT_INGRESS_TOKEN?.trim()
const baseUrl = (
  process.env.NOVEKIA_AUDIT_INGRESS_URL?.trim() ||
  'https://novekia-lead-engine-studio-production.up.railway.app/api/public/website-audit'
).replace(/\/+$/, '')

if (!token) {
  console.log('INSTANT_DEVIS_CALIBRATION_RESULT', JSON.stringify({ ok: false, reason: 'missing_preview_token' }))
  process.exit(0)
}

try {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Novekia-Audit-Key': token,
      'Idempotency-Key': `instant-devis-build-${randomUUID()}`,
    },
    body: JSON.stringify({ target_url: 'https://instant-devis.fr/' }),
  })

  const payload = await response.json().catch(() => null)
  if (!response.ok || !payload || typeof payload !== 'object') {
    const safeError =
      payload && typeof payload === 'object'
        ? {
            error: typeof payload.error === 'string' ? payload.error.slice(0, 300) : undefined,
            detail: typeof payload.detail === 'string' ? payload.detail.slice(0, 300) : undefined,
            message: typeof payload.message === 'string' ? payload.message.slice(0, 300) : undefined,
          }
        : undefined
    console.log(
      'INSTANT_DEVIS_CALIBRATION_RESULT',
      JSON.stringify({ ok: false, status: response.status, safe_error: safeError })
    )
    process.exit(0)
  }

  const findings = Array.isArray(payload.findings) ? payload.findings : []
  const preview = findings.slice(0, 3)
  console.log(
    'INSTANT_DEVIS_CALIBRATION_RESULT',
    JSON.stringify({
      ok: true,
      target_domain: payload.target_domain,
      public_audit_score: payload.public_audit_score,
      coverage: payload.coverage,
      score_version: payload.score_version,
      pages_collected: payload.pages_collected,
      pages_planned: payload.pages_planned,
      total_findings: payload.total_findings,
      engine_findings_returned: findings.length,
      public_findings_returned: preview.length,
      hidden_findings_in_preview: Math.max(0, findings.length - preview.length),
      category_scores: payload.category_scores,
      preview_findings: preview.map((finding) => ({
        category: finding.category,
        severity: finding.severity,
        title: finding.title,
        verification_status: finding.verification_status,
      })),
    })
  )
} catch (error) {
  console.log(
    'INSTANT_DEVIS_CALIBRATION_RESULT',
    JSON.stringify({
      ok: false,
      reason: error instanceof Error ? error.name : 'unknown_error',
    })
  )
}
