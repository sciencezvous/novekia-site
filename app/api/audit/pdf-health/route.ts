import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DEFAULT_AUDIT_INGRESS_URL =
  'https://novekia-lead-engine-studio-production.up.railway.app/api/public/website-audit'

export async function GET() {
  const rawUrl =
    process.env.NOVEKIA_AUDIT_INGRESS_URL?.trim() || DEFAULT_AUDIT_INGRESS_URL
  const token = process.env.NOVEKIA_AUDIT_INGRESS_TOKEN?.trim()

  if (!token) {
    return NextResponse.json(
      { ok: false, classification: 'missing_ingress_token' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    )
  }

  const baseUrl = rawUrl.replace(/\/+$/, '')
  const probeId = '00000000-0000-4000-8000-000000000000'

  try {
    const response = await fetch(`${baseUrl}/${probeId}/report.pdf`, {
      method: 'GET',
      headers: {
        Accept: 'application/pdf',
        'X-Novekia-Audit-Key': token,
      },
      cache: 'no-store',
    })

    const contentType = response.headers.get('content-type')?.toLowerCase() ?? ''
    let detail = ''
    if (!contentType.includes('application/pdf')) {
      detail = (await response.text()).slice(0, 240)
    }

    let classification = 'unexpected_response'
    if (response.status === 404 && /Audit not found/i.test(detail)) {
      classification = 'pdf_route_present'
    } else if (response.status === 404 && /Not Found/i.test(detail)) {
      classification = 'pdf_route_missing_or_stale_backend'
    } else if (response.status === 401) {
      classification = 'ingress_auth_mismatch'
    } else if (response.status >= 500) {
      classification = 'pdf_route_server_error'
    } else if (response.ok && contentType.includes('application/pdf')) {
      classification = 'unexpected_probe_pdf'
    }

    return NextResponse.json(
      {
        ok: classification === 'pdf_route_present',
        upstreamStatus: response.status,
        contentType,
        classification,
        detail,
      },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        classification: 'upstream_network_error',
        detail: error instanceof Error ? error.name : 'unknown',
      },
      { status: 502, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
