'use client'

import type { AssistedQualificationSummary } from '../ai-schemas'
import type { ConciergeSession } from '../types'
import type {
  ConciergeSubmissionEnvelope,
  ConciergeSubmissionRequest,
} from './contracts'

const SUBMISSION_TIMEOUT_MS = 16_000

export type ConciergeSubmissionUIStatus =
  | 'idle'
  | 'submitting'
  | 'submitted'
  | 'error'
  | 'rate_limited'
  | 'disabled'

export type ConciergeSubmissionUIState = {
  status: ConciergeSubmissionUIStatus
  message: string
  confirmationEmail: 'sent' | 'failed' | 'skipped' | null
  warnings: readonly string[]
}

export const initialConciergeSubmissionState: ConciergeSubmissionUIState = {
  status: 'idle',
  message: '',
  confirmationEmail: null,
  warnings: [],
}

function randomUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

export function createConciergeSubmissionId(): string {
  return randomUuid()
}

function isSubmissionEnvelope(value: unknown): value is ConciergeSubmissionEnvelope {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Record<string, unknown>
  if (candidate.success === true) {
    return typeof candidate.submissionId === 'string' &&
      candidate.status === 'submitted' &&
      typeof candidate.message === 'string' &&
      Array.isArray(candidate.warnings)
  }
  if (candidate.success !== false || !candidate.error || typeof candidate.error !== 'object') {
    return false
  }
  const error = candidate.error as Record<string, unknown>
  return typeof error.code === 'string' &&
    typeof error.message === 'string' &&
    typeof error.retryable === 'boolean'
}

function localFailure(
  submissionId: string,
  message: string,
  retryable = true,
): ConciergeSubmissionEnvelope {
  return {
    success: false,
    submissionId,
    error: { code: 'INTERNAL_ERROR', message, retryable },
  }
}

export function buildConciergeSubmissionRequest(input: {
  session: ConciergeSession
  submissionId: string
  honeypot: string
  assistedSummary: AssistedQualificationSummary | null
  now?: number
}): ConciergeSubmissionRequest | null {
  const { session } = input
  if (
    !session.startedAt ||
    session.activePath === 'unknown' ||
    !session.contact ||
    !session.consent
  ) {
    return null
  }

  const answers = Object.fromEntries(
    Object.entries(session.answers).filter(([answerId]) =>
      !answerId.startsWith('contact.') && !answerId.startsWith('consent.'),
    ),
  )

  return {
    submissionId: input.submissionId,
    schemaVersion: session.schemaVersion,
    sessionStartedAt: session.startedAt,
    sourcePage: session.sourcePage,
    attribution: session.attribution,
    activePath: session.activePath,
    answers,
    contact: {
      fullName: session.contact.fullName,
      company: session.contact.company,
      email: session.contact.professionalEmail,
      ...(session.contact.role ? { role: session.contact.role } : {}),
      ...(session.contact.phone ? { phone: session.contact.phone } : {}),
      ...(session.contact.preferredContact
        ? { preferredContact: session.contact.preferredContact }
        : {}),
    },
    consent: session.consent,
    ...(input.assistedSummary ? { assistedSummary: input.assistedSummary } : {}),
    honeypot: input.honeypot,
    elapsedMs: Math.max(0, (input.now ?? Date.now()) - new Date(session.startedAt).getTime()),
  }
}

export async function requestConciergeSubmission(
  payload: ConciergeSubmissionRequest,
  options: { signal?: AbortSignal; fetcher?: typeof fetch } = {},
): Promise<ConciergeSubmissionEnvelope> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), SUBMISSION_TIMEOUT_MS)
  const abort = () => controller.abort()
  options.signal?.addEventListener('abort', abort, { once: true })

  try {
    const response = await (options.fetcher ?? fetch)('/api/concierge/submit', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    const body: unknown = await response.json().catch(() => null)
    if (isSubmissionEnvelope(body)) return body
    return localFailure(
      payload.submissionId,
      response.status === 503
        ? 'La transmission est temporairement indisponible.'
        : 'La réponse du service est invalide. Réessayez plus tard.',
      response.status >= 500,
    )
  } catch (error) {
    if (options.signal?.aborted) {
      return localFailure(payload.submissionId, 'L’envoi a été interrompu.', true)
    }
    if (error instanceof DOMException && error.name === 'AbortError') {
      return localFailure(
        payload.submissionId,
        'Le délai d’envoi est dépassé. Vérifiez votre connexion avant de réessayer.',
        true,
      )
    }
    return localFailure(
      payload.submissionId,
      'La demande n’a pas pu être transmise. Vérifiez votre connexion puis réessayez.',
      true,
    )
  } finally {
    clearTimeout(timeout)
    options.signal?.removeEventListener('abort', abort)
  }
}
