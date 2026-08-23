import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { AuditFacadeError, callAuditIngress } from '@/lib/audit-server'

export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-dynamic'

export async function GET() {
  if (process.env.VERCEL_ENV !== 'preview') {
    return new NextResponse(null, { status: 404 })
  }

  try {
    const result = await callAuditIngress({
      method: 'POST',
      idempotencyKey: `railway-self-test-${randomUUID()}`,
      body: { target_url: 'https://novekia.fr/' },
    })

    return NextResponse.json(
      {
        ok: true,
        audit_id: result.audit_id,
        target_domain: result.target_domain,
        public_audit_score: result.public_audit_score,
        coverage: result.coverage,
        score_version: result.score_version,
        confidence_score: result.confidence_score,
        pages_collected: result.pages_collected,
        pages_planned: result.pages_planned,
        total_findings: result.total_findings,
        category_scores: result.category_scores,
        category_coverage: result.category_coverage,
        findings: result.findings.map((finding) => ({
          category: finding.category,
          severity: finding.severity,
          title: finding.title,
          finding: finding.finding,
          verification_status: finding.verification_status,
          evidence_excerpt: finding.evidence_excerpt,
          evidence_source_url: finding.evidence_source_url,
        })),
      },
      { headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' } }
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
