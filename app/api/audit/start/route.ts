import { randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import {
  AuditFacadeError,
  callAuditIngress,
  clientAddress,
  enforceRateLimit,
  enforceSameOrigin,
  normalizeAuditTarget,
  releaseRateLimit,
} from '@/lib/audit-server'

export const runtime = 'nodejs'
export const maxDuration = 60

const TRANSIENT_AUDIT_STATUSES = new Set([429, 502, 503, 504])

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

function alternateAuditTarget(targetUrl: string) {
  const parsed = new URL(targetUrl)
  const hostname = parsed.hostname.toLowerCase()
  const alternateHostname = hostname.startsWith('www.')
    ? hostname.slice(4)
    : `www.${hostname}`

  if (!alternateHostname || !alternateHostname.includes('.')) return null
  return `https://${alternateHostname}/`
}

async function runAuditWithSameDomainHostFallback(targetUrl: string) {
  const alternate = alternateAuditTarget(targetUrl)
  const targets = alternate && alternate !== targetUrl
    ? [targetUrl, alternate]
    : [targetUrl]
  let lastError: unknown

  for (let index = 0; index < targets.length; index += 1) {
    try {
      const result = await callAuditIngress({
        method: 'POST',
        idempotencyKey: randomUUID(),
        body: { target_url: targets[index] },
      })
      return { result, hostFallbackUsed: index > 0 }
    } catch (error) {
      lastError = error
      const canTryAlternate =
        index === 0 &&
        targets.length > 1 &&
        error instanceof AuditFacadeError &&
        (error.status === 502 || error.status === 504)

      if (!canTryAlternate) throw error
    }
  }

  throw lastError
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

function isTransientAuditFailure(error: AuditFacadeError) {
  return TRANSIENT_AUDIT_STATUSES.has(error.status)
}

export async function POST(request: NextRequest) {
  const campaign = campaignFromRequest(request)
  let scanQuotaKey: string | null = null
  let scanQuotaReserved = false
  let quotaRefunded = false

  try {
    enforceSameOrigin(request)

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

    // Reserve the long-window quota only after local validation. Infrastructure
    // failures are refunded below so they cannot lock a legitimate visitor out.
    scanQuotaKey = `audit:start:${clientAddress(request)}`
    enforceRateLimit(scanQuotaKey, 5)
    scanQuotaReserved = true

    const { result, hostFallbackUsed } = await runAuditWithSameDomainHostFallback(targetUrl)

    logAuditFunnel('audit_completed', {
      score: result.public_audit_score,
      coverage: result.coverage,
      pagesCollected: result.pages_collected,
      scoreVersion: result.score_version,
      hostFallbackUsed,
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
    if (
      scanQuotaReserved &&
      scanQuotaKey &&
      error instanceof AuditFacadeError &&
      isTransientAuditFailure(error)
    ) {
      releaseRateLimit(scanQuotaKey)
      scanQuotaReserved = false
      quotaRefunded = true
    }

    if (error instanceof AuditFacadeError) {
      logAuditFunnel('audit_failed', {
        status: error.status,
        quotaRefunded,
        utmSource: campaign.utmSource,
        utmMedium: campaign.utmMedium,
        utmCampaign: campaign.utmCampaign,
      })
      return NextResponse.json(
        { error: error.publicMessage },
        { status: error.status }
      )
    }

    if (scanQuotaReserved && scanQuotaKey) {
      releaseRateLimit(scanQuotaKey)
      quotaRefunded = true
    }

    logAuditFunnel('audit_failed', {
      status: 502,
      quotaRefunded,
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
