import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import {
  AuditFacadeError,
  callAuditIngress,
  toPublicAuditPreview,
} from '@/lib/audit-server'

export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-dynamic'

export async function GET() {
  if (process.env.VERCEL_ENV !== 'preview') {
    return new NextResponse(null, { status: 404 })
  }

  try {
    const full = await callAuditIngress({
      method: 'POST',
      idempotencyKey: `instant-devis-self-test-${randomUUID()}`,
      body: { target_url: 'https://instant-devis.fr/' },
    })
    const preview = toPublicAuditPreview(full)

    return NextResponse.json(
      {
        ok: true,
        audit_id: full.audit_id,
        target_domain: full.target_domain,
        public_audit_score: full.public_audit_score,
        coverage: full.coverage,
        score_version: full.score_version,
        pages_collected: full.pages_collected,
        pages_planned: full.pages_planned,
        total_findings: full.total_findings,
        engine_findings_returned: full.findings.length,
        public_findings_returned: preview.findings.length,
        hidden_findings_in_preview: Math.max(0, full.findings.length - preview.findings.length),
        category_scores: full.category_scores,
        category_coverage: full.category_coverage,
        public_findings: preview.findings.map((finding) => ({
          category: finding.category,
          severity: finding.severity,
          title: finding.title,
          finding: finding.finding,
          verification_status: finding.verification_status,
          evidence_excerpt: finding.evidence_excerpt,
          evidence_source_url: finding.evidence_source_url,
        })),
      },
      {
        headers: {
          'Cache-Control': 'no-store',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      }
    )
  } catch (error) {
    if (error instanceof AuditFacadeError) {
      return NextResponse.json(
        { ok: false, status: error.status, error: error.publicMessage },
        { status: error.status, headers: { 'Cache-Control': 'no-store' } }
      )
    }
    return NextResponse.json(
      { ok: false, status: 500, error: 'Unexpected self-test failure.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
