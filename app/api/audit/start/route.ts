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

function campaignFromRequest(request: NextRequest) {
  const referer = request.headers.get('referer')
  if (!referer) {
    return { utmSource: '', utmMedium: '', utmCampaign: '' }
  }

  try {
    const url = new URL(referer)
    return {
      utmSource: (url.searchParams.get('utm_source') || '').slice(0, 120),
      utmMedium: (url.searchParams.get('utm_medium') || '').slice(0, 120),
      utmCampaign: (url.searchParams.get('utm_campaign') || '').slice(0, 120),
    }
  } catch {
    return { utmSource: '', utmMedium: '', utmCampaign: '' }
  }
}

function logAuditFunnel(
  event: 'audit_completed' | 'audit_failed',
  data: Record<string, string | number | boolean>
) {
  console.info(
    '[novekia-audit-funnel]',
    JSON.stringify({ event, ...data })
  )
}

export async function POST(request: NextRequest) {
  const campaign = campaignFromRequest(request)

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

    logAuditFunnel('audit_completed', {
      score: result.public_audit_score,
      coverage: result.coverage,
      pagesCollected: result.pages_collected,
      scoreVersion: result.score_version,
      utmSource: campaign.utmSource,
      utmMedium: campaign.utmMedium,
      utmCampaign: campaign.utmCampaign,
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
      logAuditFunnel('audit_failed', {
        status: error.status,
        utmSource: campaign.utmSource,
        utmMedium: campaign.utmMedium,
        utmCampaign: campaign.utmCampaign,
      })
      return NextResponse.json(
        { error: error.publicMessage },
        { status: error.status }
      )
    }

    logAuditFunnel('audit_failed', {
      status: 502,
      utmSource: campaign.utmSource,
      utmMedium: campaign.utmMedium,
      utmCampaign: campaign.utmCampaign,
    })
    return NextResponse.json(
      { error: 'Le pré-audit est momentanément indisponible.' },
      { status: 502 }
    )
  }
}
