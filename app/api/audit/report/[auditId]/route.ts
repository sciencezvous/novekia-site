import { NextRequest, NextResponse } from 'next/server'
import {
  AuditFacadeError,
  callAuditPdfIngress,
  clientAddress,
  enforceRateLimit,
  enforceSameOrigin,
} from '@/lib/audit-server'

export const runtime = 'nodejs'
export const maxDuration = 30

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ auditId: string }> }
) {
  try {
    enforceSameOrigin(request)
    enforceRateLimit(`audit:pdf:${clientAddress(request)}`, 20)

    const { auditId } = await context.params
    if (!UUID_RE.test(auditId)) {
      throw new AuditFacadeError(400, 'Identifiant de pré-audit invalide.')
    }

    const pdf = await callAuditPdfIngress(auditId)
    const filename = pdf.filename ?? `novekia-pre-audit-${auditId}.pdf`

    return new Response(new Uint8Array(pdf.bytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'private, no-store, max-age=0',
        'X-Robots-Tag': 'noindex, nofollow, noarchive',
        ...(pdf.reportVersion
          ? { 'X-Novekia-Report-Version': pdf.reportVersion }
          : {}),
      },
    })
  } catch (error) {
    if (error instanceof AuditFacadeError) {
      return NextResponse.json(
        { error: error.publicMessage },
        {
          status: error.status,
          headers: {
            'Cache-Control': 'no-store',
            'X-Robots-Tag': 'noindex, nofollow, noarchive',
          },
        }
      )
    }

    return NextResponse.json(
      { error: 'Le téléchargement du rapport est momentanément indisponible.' },
      {
        status: 502,
        headers: {
          'Cache-Control': 'no-store',
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
        },
      }
    )
  }
}
