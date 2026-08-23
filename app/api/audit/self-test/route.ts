import { NextResponse } from 'next/server'
import { AuditFacadeError, callAuditIngress } from '@/lib/audit-server'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET() {
  if (process.env.VERCEL_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const result = await callAuditIngress({
      method: 'POST',
      idempotencyKey: 'preview-public-audit-v1-contract-self-test',
      body: { target_url: 'https://novekia.fr/' },
    })

    return NextResponse.json(
      {
        ok: true,
        score_version: result.score_version,
        public_audit_score: result.public_audit_score,
        coverage: result.coverage,
        category_scores: result.category_scores,
        category_coverage: result.category_coverage,
        pages_collected: result.pages_collected,
        pages_planned: result.pages_planned,
        total_findings: result.total_findings,
      },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    if (error instanceof AuditFacadeError) {
      return NextResponse.json(
        { ok: false, status: error.status, error: error.publicMessage },
        { status: error.status, headers: { 'Cache-Control': 'no-store' } }
      )
    }

    return NextResponse.json(
      { ok: false, status: 502, error: 'Self-test failed.' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
