import type {
  ConciergeSubmissionEnvelope,
  ConciergeSubmissionErrorCode,
} from './contracts'

export const SUBMISSION_RESPONSE_HEADERS = {
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
} as const

export function submissionJson(
  body: ConciergeSubmissionEnvelope,
  status: number,
) {
  return Response.json(body, {
    status,
    headers: SUBMISSION_RESPONSE_HEADERS,
  })
}

export function submissionError(
  submissionId: string | null,
  code: ConciergeSubmissionErrorCode,
  message: string,
  status: number,
  retryable = false,
) {
  return submissionJson(
    {
      success: false,
      submissionId,
      error: { code, message, retryable },
    },
    status,
  )
}
