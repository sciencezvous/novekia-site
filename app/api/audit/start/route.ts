import { randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import {
  AuditFacadeError,
  callAuditIngress,
  clientAddress,
  enforceRateLimit,
  enforceSameOrigin,
  normalizeAuditTarget,
} from '@/lib/audit-server'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    enforceSameOrigin(request)
    enforceRateLimit(`audit:start:${clientAddress(request)}`, 5)

    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      throw new AuditFacadeError(400, 'Données de pré-audit invalides.')
    }

    if (JSON.stringify(body).length > 4_000) {
      throw new AuditFacadeError(413, 'Données trop volumineuses.')
    }

    const targetUrl = normalizeAuditTarget(body.url)
    const result = await callAuditIngress({
      method: 'POST',
      idempotencyKey: randomUUID(),
      body: { target_url: targetUrl },
    })

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    })
  } catch (error) {
    if (error instanceof AuditFacadeError) {
      return NextResponse.json(
        { error: error.publicMessage },
        { status: error.status }
      )
    }

    return NextResponse.json(
      { error: 'Le pré-audit est momentanément indisponible.' },
      { status: 502 }
    )
  }
}
