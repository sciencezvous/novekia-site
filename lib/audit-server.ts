import { isIP } from 'node:net'
import type { NextRequest } from 'next/server'
import {
  isPublicAuditResult,
  type PublicAuditResult,
} from '@/lib/audit-contract'

const MAX_TARGET_LENGTH = 1000
const AUDIT_TIMEOUT_MS = 55_000
const RATE_WINDOW_MS = 60 * 60 * 1000
const DEFAULT_AUDIT_INGRESS_URL =
  'https://novekia-lead-engine-studio-production.up.railway.app/api/public/website-audit'

type RateBucket = { count: number; resetAt: number }
const rateBuckets = new Map<string, RateBucket>()

export class AuditFacadeError extends Error {
  readonly status: number
  readonly publicMessage: string

  constructor(status: number, publicMessage: string) {
    super(publicMessage)
    this.status = status
    this.publicMessage = publicMessage
  }
}

export function enforceSameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (!origin) return

  let parsed: URL
  try {
    parsed = new URL(origin)
  } catch {
    throw new AuditFacadeError(403, 'Origine de requête invalide.')
  }

  if (parsed.origin !== request.nextUrl.origin) {
    throw new AuditFacadeError(403, 'Origine de requête refusée.')
  }
}

export function clientAddress(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for')
  return (forwarded?.split(',')[0] || request.headers.get('x-real-ip') || 'unknown')
    .trim()
    .slice(0, 80)
}

export function enforceRateLimit(
  key: string,
  limit: number,
  now = Date.now()
) {
  const current = rateBuckets.get(key)
  if (!current || current.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return
  }

  if (current.count >= limit) {
    throw new AuditFacadeError(
      429,
      'Trop de demandes depuis cette connexion. Réessayez plus tard.'
    )
  }

  current.count += 1
}

export function normalizeAuditTarget(rawValue: unknown) {
  let value = String(rawValue ?? '').trim()
  if (!value || value.length > MAX_TARGET_LENGTH) {
    throw new AuditFacadeError(400, 'Saisissez une adresse de site valide.')
  }

  if (!/^https?:\/\//i.test(value)) value = `https://${value}`

  let parsed: URL
  try {
    parsed = new URL(value)
  } catch {
    throw new AuditFacadeError(400, 'Saisissez une adresse de site valide.')
  }

  const hostname = parsed.hostname.toLowerCase().replace(/\.$/, '')
  if (
    parsed.protocol !== 'https:' ||
    parsed.username ||
    parsed.password ||
    (parsed.port && parsed.port !== '443') ||
    !hostname ||
    isIP(hostname) !== 0 ||
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    !hostname.includes('.')
  ) {
    throw new AuditFacadeError(
      400,
      'Le pré-audit accepte uniquement un site public accessible en HTTPS.'
    )
  }

  return `https://${hostname}/`
}

function readIngressConfig() {
  const rawUrl =
    process.env.NOVEKIA_AUDIT_INGRESS_URL?.trim() || DEFAULT_AUDIT_INGRESS_URL
  const token = process.env.NOVEKIA_AUDIT_INGRESS_TOKEN?.trim()
  if (!token) {
    throw new AuditFacadeError(
      503,
      'Le moteur de pré-audit est momentanément indisponible.'
    )
  }

  let parsed: URL
  try {
    parsed = new URL(rawUrl)
  } catch {
    throw new AuditFacadeError(503, 'Configuration du moteur indisponible.')
  }
  if (
    parsed.protocol !== 'https:' ||
    parsed.username ||
    parsed.password ||
    parsed.search ||
    parsed.hash
  ) {
    throw new AuditFacadeError(503, 'Configuration du moteur indisponible.')
  }

  return {
    baseUrl: parsed.toString().replace(/\/+$/, ''),
    token,
  }
}

export async function callAuditIngress(options: {
  method: 'GET' | 'POST'
  path?: string
  idempotencyKey?: string
  body?: unknown
}): Promise<PublicAuditResult> {
  const { baseUrl, token } = readIngressConfig()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), AUDIT_TIMEOUT_MS)

  try {
    const response = await fetch(`${baseUrl}${options.path ?? ''}`, {
      method: options.method,
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        'X-Novekia-Audit-Key': token,
        ...(options.idempotencyKey
          ? { 'Idempotency-Key': options.idempotencyKey }
          : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: 'no-store',
      signal: controller.signal,
    })

    if (!response.ok) {
      if (response.status === 400 || response.status === 422) {
        throw new AuditFacadeError(
          400,
          'Cette adresse ne peut pas être pré-auditée. Vérifiez le site puis réessayez.'
        )
      }
      if (response.status === 429) {
        throw new AuditFacadeError(429, 'Le moteur est temporairement très sollicité.')
      }
      throw new AuditFacadeError(
        502,
        'Le moteur n’a pas pu terminer ce pré-audit. Réessayez dans quelques instants.'
      )
    }

    const payload: unknown = await response.json()
    if (!isPublicAuditResult(payload)) {
      throw new AuditFacadeError(502, 'Réponse du moteur invalide.')
    }
    return payload
  } catch (error) {
    if (error instanceof AuditFacadeError) throw error
    if (error instanceof Error && error.name === 'AbortError') {
      throw new AuditFacadeError(
        504,
        'Le pré-audit a dépassé le temps disponible. Réessayez dans quelques instants.'
      )
    }
    throw new AuditFacadeError(
      502,
      'Le moteur de pré-audit est momentanément inaccessible.'
    )
  } finally {
    clearTimeout(timeout)
  }
}
