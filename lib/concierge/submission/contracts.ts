import type { AssistedQualificationSummary } from '../ai-schemas'
import type {
  ConciergeAnswers,
  ConciergeAttribution,
  ConciergeConsent,
  ConciergeContact,
  ConciergePath,
  ConciergeSession,
} from '../types'

export const MAX_SUBMISSION_REQUEST_BYTES = 64 * 1024
export const MAX_SUBMISSION_DEPTH = 7
export const MAX_SUBMISSION_ANSWERS = 100
export const MAX_SUBMISSION_TOTAL_CHARACTERS = 40_000
export const MIN_SUBMISSION_ELAPSED_MS = 8_000

export const submissionErrorCodes = [
  'INVALID_REQUEST',
  'INVALID_STATE',
  'CONSENT_REQUIRED',
  'SECRET_DETECTED',
  'RATE_LIMITED',
  'DUPLICATE_SUBMISSION',
  'SUBMISSION_DISABLED',
  'EMAIL_DELIVERY_FAILED',
  'INTERNAL_ERROR',
] as const

export type ConciergeSubmissionErrorCode = (typeof submissionErrorCodes)[number]
export type ConciergeSubmissionPath = Exclude<ConciergePath, 'unknown'>
export type ConfirmationEmailStatus = 'sent' | 'failed' | 'skipped'

export type ConciergeSubmissionContact = {
  fullName: string
  company: string
  role?: string
  email: string
  phone?: string
  preferredContact?: 'email' | 'phone' | 'either'
}

export type ConciergeSubmissionRequest = {
  submissionId: string
  schemaVersion: string
  sessionStartedAt: string
  sourcePage: string
  attribution: ConciergeAttribution
  activePath: ConciergeSubmissionPath
  answers: ConciergeAnswers
  contact: ConciergeSubmissionContact
  consent: ConciergeConsent
  assistedSummary?: AssistedQualificationSummary
  honeypot: string
  elapsedMs: number
}

export type ConciergeSubmissionSuccess = {
  success: true
  submissionId: string
  status: 'submitted'
  message: string
  confirmationEmail: ConfirmationEmailStatus
  warnings: readonly string[]
}

export type ConciergeSubmissionFailure = {
  success: false
  submissionId: string | null
  error: {
    code: ConciergeSubmissionErrorCode
    message: string
    retryable: boolean
  }
}

export type ConciergeSubmissionEnvelope =
  | ConciergeSubmissionSuccess
  | ConciergeSubmissionFailure

export type RecomputedConciergeSubmission = {
  submissionId: string
  receivedAt: string
  sourcePage: string
  attribution: ConciergeAttribution
  activePath: ConciergeSubmissionPath
  answers: ConciergeAnswers
  contact: ConciergeContact
  consent: ConciergeConsent
  session: ConciergeSession
  assistedSummary?: AssistedQualificationSummary
  inaccessibleAnswerIds: readonly string[]
  clientServerConsistent: boolean
}

export type SubmissionValidationIssue = {
  code: 'INVALID_REQUEST' | 'CONSENT_REQUIRED' | 'SECRET_DETECTED'
  message: string
}

export type SubmissionParseResult =
  | { valid: true; request: ConciergeSubmissionRequest }
  | { valid: false; issue: SubmissionValidationIssue }
