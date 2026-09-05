import { NextRequest, NextResponse } from 'next/server'
import {
  AuditFacadeError,
  clientAddress,
  enforceRateLimit,
  enforceSameOrigin,
} from '@/lib/audit-server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    enforceSameOrigin(request)
    enforceRateLimit(`audit:premium-report:${clientAddress(request)}`, 20)

    return NextResponse.json(
      {
        error:
          'Le rapport premium est remis uniquement après validation du paiement et exécution de l’audit complet.',
        code: 'PAID_AUDIT_REQUIRED',
      },
      {
        status: 403,
        headers: {
          'Cache-Control': 'private, no-store, max-age=0',
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
        },
      }
    )
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
      { error: 'Le rapport premium est indisponible sur le parcours gratuit.' },
      {
        status: 403,
        headers: {
          'Cache-Control': 'no-store',
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
        },
      }
    )
  }
}
