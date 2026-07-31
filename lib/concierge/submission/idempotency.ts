type SubmissionState = {
  status: 'processing' | 'internal_failed' | 'completed'
  updatedAt: number
}

export type IdempotencyLease = {
  allowed: boolean
  duplicate: boolean
  markInternalFailure: () => void
  markCompleted: () => void
}

const RETENTION_MS = 24 * 60 * 60 * 1000
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000
const submissions = new Map<string, SubmissionState>()
let lastCleanupAt = 0

function cleanup(now: number) {
  if (now - lastCleanupAt < CLEANUP_INTERVAL_MS) return
  lastCleanupAt = now
  for (const [submissionId, state] of submissions) {
    if (now - state.updatedAt > RETENTION_MS) submissions.delete(submissionId)
  }
}

export function claimSubmissionId(submissionId: string): IdempotencyLease {
  const now = Date.now()
  cleanup(now)
  const previous = submissions.get(submissionId)

  if (previous?.status === 'processing' || previous?.status === 'completed') {
    return {
      allowed: false,
      duplicate: true,
      markInternalFailure: () => undefined,
      markCompleted: () => undefined,
    }
  }

  submissions.set(submissionId, { status: 'processing', updatedAt: now })
  return {
    allowed: true,
    duplicate: false,
    markInternalFailure: () => {
      submissions.set(submissionId, {
        status: 'internal_failed',
        updatedAt: Date.now(),
      })
    },
    markCompleted: () => {
      submissions.set(submissionId, {
        status: 'completed',
        updatedAt: Date.now(),
      })
    },
  }
}

export function buildInternalIdempotencyKey(submissionId: string): string {
  return `concierge-internal:${submissionId}:v1`
}

export function buildConfirmationIdempotencyKey(submissionId: string): string {
  return `concierge-confirmation:${submissionId}:v1`
}
