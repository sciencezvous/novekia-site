import { getEphemeralClientAddress } from '@/lib/concierge/ai-rate-limit'
import {
  MAX_SUBMISSION_REQUEST_BYTES,
  acquireConciergeSubmissionRateLimit,
  claimSubmissionId,
  deliverConciergeSubmission,
  getConciergeResendConfig,
  isAllowedConciergeOrigin,
  parseConciergeSubmissionRequest,
  recomputeConciergeSubmission,
  submissionError,
  submissionJson,
  type ConciergeDeliveryResult,
  type ConciergeResendConfig,
  type IdempotencyLease,
  type RecomputedConciergeSubmission,
  type SubmissionRateLimitLease,
} from '@/lib/concierge/submission'

type SubmitRouteDependencies = {
  now: () => Date
  acquireRateLimit: (address: string) => SubmissionRateLimitLease
  claimId: (submissionId: string) => IdempotencyLease
  getConfig: () => ConciergeResendConfig
  deliver: (
    submission: RecomputedConciergeSubmission,
    config: ConciergeResendConfig,
  ) => Promise<ConciergeDeliveryResult>
}

const defaultDependencies: SubmitRouteDependencies = {
  now: () => new Date(),
  acquireRateLimit: acquireConciergeSubmissionRateLimit,
  claimId: claimSubmissionId,
  getConfig: getConciergeResendConfig,
  deliver: deliverConciergeSubmission,
}

export async function handleConciergeSubmission(
  request: Request,
  overrides: Partial<SubmitRouteDependencies> = {},
) {
  const dependencies = { ...defaultDependencies, ...overrides }
  let activeIdempotency: IdempotencyLease | null = null
  if (!isAllowedConciergeOrigin(request.headers.get('origin'))) {
    return submissionError(null, 'INVALID_REQUEST', 'L’origine de la requête n’est pas autorisée.', 403)
  }

  const contentType = request.headers.get('content-type')?.toLowerCase() ?? ''
  if (!contentType.startsWith('application/json')) {
    return submissionError(null, 'INVALID_REQUEST', 'Le contenu doit être envoyé en JSON.', 415)
  }

  const declaredLength = Number(request.headers.get('content-length') ?? 0)
  if (Number.isFinite(declaredLength) && declaredLength > MAX_SUBMISSION_REQUEST_BYTES) {
    return submissionError(null, 'INVALID_REQUEST', 'La requête est trop volumineuse.', 413)
  }

  const config = dependencies.getConfig()
  if (!config.enabled) {
    return submissionError(
      null,
      'SUBMISSION_DISABLED',
      'La transmission est temporairement indisponible.',
      503,
      false,
    )
  }

  const rateLease = dependencies.acquireRateLimit(
    getEphemeralClientAddress(request.headers),
  )
  if (!rateLease.allowed) {
    return submissionError(
      null,
      'RATE_LIMITED',
      'Trop de demandes ont été effectuées. Réessayez plus tard.',
      429,
      true,
    )
  }

  try {
    let rawBody: string
    try {
      rawBody = await request.text()
    } catch {
      return submissionError(null, 'INVALID_REQUEST', 'Le corps de la requête est illisible.', 400)
    }
    if (new TextEncoder().encode(rawBody).byteLength > MAX_SUBMISSION_REQUEST_BYTES) {
      return submissionError(null, 'INVALID_REQUEST', 'La requête est trop volumineuse.', 413)
    }

    let payload: unknown
    try {
      payload = JSON.parse(rawBody)
    } catch {
      return submissionError(null, 'INVALID_REQUEST', 'Le JSON transmis est invalide.', 400)
    }

    const parsed = parseConciergeSubmissionRequest(payload, dependencies.now())
    if (!parsed.valid) {
      return submissionError(
        typeof payload === 'object' && payload &&
          typeof (payload as { submissionId?: unknown }).submissionId === 'string'
          ? (payload as { submissionId: string }).submissionId
          : null,
        parsed.issue.code,
        parsed.issue.message,
        400,
      )
    }

    const recomputed = recomputeConciergeSubmission(
      parsed.request,
      dependencies.now(),
    )
    if (!recomputed.valid) {
      return submissionError(
        parsed.request.submissionId,
        'INVALID_STATE',
        'La demande doit être vérifiée avant sa transmission.',
        400,
      )
    }

    const idempotency = dependencies.claimId(parsed.request.submissionId)
    activeIdempotency = idempotency
    if (!idempotency.allowed) {
      return submissionError(
        parsed.request.submissionId,
        'DUPLICATE_SUBMISSION',
        'Cette demande a déjà été prise en compte ou est en cours de traitement.',
        409,
        false,
      )
    }

    const delivery = await dependencies.deliver(recomputed.submission, config)
    if (!delivery.success) {
      idempotency.markInternalFailure()
      return submissionError(
        parsed.request.submissionId,
        'EMAIL_DELIVERY_FAILED',
        'La demande n’a pas pu être transmise. Vous pouvez réessayer.',
        502,
        true,
      )
    }

    idempotency.markCompleted()
    return submissionJson({
      success: true,
      submissionId: parsed.request.submissionId,
      status: 'submitted',
      message: 'Votre demande a bien été transmise à Novekia.',
      confirmationEmail: delivery.confirmationEmail,
      warnings: delivery.warnings,
    }, 200)
  } catch {
    activeIdempotency?.markInternalFailure()
    return submissionError(
      null,
      'INTERNAL_ERROR',
      'La demande n’a pas pu être traitée. Réessayez plus tard.',
      500,
      true,
    )
  } finally {
    rateLease.release()
  }
}

export async function POST(request: Request) {
  return handleConciergeSubmission(request)
}

function methodNotAllowed() {
  return submissionError(null, 'INVALID_REQUEST', 'Méthode non autorisée.', 405)
}

export const GET = methodNotAllowed
export const PUT = methodNotAllowed
export const PATCH = methodNotAllowed
export const DELETE = methodNotAllowed
export const OPTIONS = methodNotAllowed
