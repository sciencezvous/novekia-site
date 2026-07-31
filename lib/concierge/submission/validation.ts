import {
  validateConciergeAITaskOutput,
  type AssistedQualificationSummary,
} from '../ai-schemas'
import {
  CONTACT_CONSENT_VERSION,
  PRIVACY_POLICY_VERSION,
} from '../config'
import { conciergeDefinition, getFlowByPath } from '../flows'
import { sanitizeAttribution } from '@/lib/lead-attribution'
import { CONCIERGE_SCHEMA_VERSION } from '../types'
import type {
  ConciergeAnswer,
  ConciergeAnswers,
  ConciergeAttribution,
  ConciergeConsent,
  ConciergeQuestion,
} from '../types'
import {
  MAX_SUBMISSION_ANSWERS,
  MIN_SUBMISSION_ELAPSED_MS,
  type ConciergeSubmissionContact,
  type ConciergeSubmissionPath,
  type SubmissionParseResult,
} from './contracts'
import {
  inspectFreeText,
  inspectSubmissionPayload,
  normalizeSubmissionText,
} from './sanitization'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[+()\d\s.-]{6,40}$/
const ROOT_KEYS = [
  'submissionId',
  'schemaVersion',
  'sessionStartedAt',
  'sourcePage',
  'attribution',
  'activePath',
  'answers',
  'contact',
  'consent',
  'assistedSummary',
  'honeypot',
  'elapsedMs',
] as const
const ATTRIBUTION_KEYS = [
  'landingPath',
  'currentPath',
  'referrer',
  'referrerHost',
  'utmSource',
  'utmMedium',
  'utmCampaign',
  'utmContent',
  'utmTerm',
] as const
const CONTACT_KEYS = [
  'fullName',
  'company',
  'role',
  'email',
  'phone',
  'preferredContact',
] as const
const CONSENT_KEYS = ['contact', 'privacy'] as const
const CONSENT_RECORD_KEYS = [
  'consentGranted',
  'consentTextVersion',
  'consentedAt',
  'privacyPolicyVersion',
] as const
const PATHS = [
  'lead_engine',
  'solutions',
  'information',
  'direct_contact',
] as const satisfies readonly ConciergeSubmissionPath[]

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

function hasOnlyKeys(
  record: Record<string, unknown>,
  allowed: readonly string[],
): boolean {
  const allowedSet = new Set(allowed)
  return Object.keys(record).every((key) => allowedSet.has(key))
}

function failure(
  code: 'INVALID_REQUEST' | 'CONSENT_REQUIRED' | 'SECRET_DETECTED',
  message: string,
): SubmissionParseResult {
  return { valid: false, issue: { code, message } }
}

function boundedText(
  value: unknown,
  minimum: number,
  maximum: number,
  required = true,
): string | null {
  if (typeof value !== 'string') return null
  const normalized = normalizeSubmissionText(value, maximum + 1)
  if (!required && normalized.length === 0) return ''
  return normalized.length >= minimum && normalized.length <= maximum
    ? normalized
    : null
}

function normalizePath(value: unknown): string | null {
  if (typeof value !== 'string' || value.length > 300 || !value.startsWith('/')) {
    return null
  }
  try {
    const url = new URL(value, 'https://novekia.fr')
    return `${url.pathname}${url.hash}`.slice(0, 300)
  } catch {
    return null
  }
}

function parseAttribution(value: unknown): ConciergeAttribution | null {
  if (!isPlainRecord(value) || !hasOnlyKeys(value, ATTRIBUTION_KEYS)) return null
  const sanitized = sanitizeAttribution(value)
  return {
    ...sanitized,
    landingPath: normalizePath(sanitized.landingPath) ?? '',
    currentPath: normalizePath(sanitized.currentPath) ?? '',
    referrer: (() => {
      if (!sanitized.referrer) return ''
      try {
        const url = new URL(sanitized.referrer)
        return `${url.origin}${url.pathname}`.slice(0, 200)
      } catch {
        return ''
      }
    })(),
  }
}

function parseContact(value: unknown): ConciergeSubmissionContact | null {
  if (!isPlainRecord(value) || !hasOnlyKeys(value, CONTACT_KEYS)) return null

  const fullName = boundedText(value.fullName, 2, 120)
  const company = boundedText(value.company, 1, 160)
  const role = boundedText(value.role ?? '', 0, 120, false)
  const email = boundedText(value.email, 3, 254)?.toLowerCase() ?? null
  const phone = boundedText(value.phone ?? '', 0, 40, false)
  const preferredContact = value.preferredContact

  if (
    fullName === null ||
    company === null ||
    role === null ||
    !email ||
    !EMAIL_PATTERN.test(email) ||
    phone === null ||
    (phone && !PHONE_PATTERN.test(phone)) ||
    (
      preferredContact !== undefined &&
      preferredContact !== 'email' &&
      preferredContact !== 'phone' &&
      preferredContact !== 'either'
    )
  ) {
    return null
  }

  if (
    [fullName, company, role, phone].some((item) => item && inspectFreeText(item))
  ) {
    return null
  }

  return {
    fullName,
    company,
    email,
    ...(role ? { role } : {}),
    ...(phone ? { phone } : {}),
    ...(preferredContact ? { preferredContact } : {}),
  }
}

function parseIso(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const date = new Date(value)
  return Number.isFinite(date.getTime()) && date.toISOString() === value
    ? value
    : null
}

function parseConsentRecord(
  value: unknown,
  expectedTextVersion: string,
  sessionStartedAt: string,
  now: Date,
): ConciergeConsent['contact'] | null {
  if (!isPlainRecord(value) || !hasOnlyKeys(value, CONSENT_RECORD_KEYS)) return null
  if (
    value.consentGranted !== true ||
    value.consentTextVersion !== expectedTextVersion ||
    value.privacyPolicyVersion !== PRIVACY_POLICY_VERSION
  ) {
    return null
  }

  const consentedAt = parseIso(value.consentedAt)
  if (!consentedAt) return null
  const timestamp = new Date(consentedAt).getTime()
  const startedAt = new Date(sessionStartedAt).getTime()
  if (timestamp < startedAt || timestamp > now.getTime() + 5 * 60 * 1000) return null

  return {
    consentGranted: true,
    consentTextVersion: expectedTextVersion,
    consentedAt,
    privacyPolicyVersion: PRIVACY_POLICY_VERSION,
  }
}

function parseConsent(
  value: unknown,
  sessionStartedAt: string,
  now: Date,
): ConciergeConsent | null {
  if (!isPlainRecord(value) || !hasOnlyKeys(value, CONSENT_KEYS)) return null
  const contact = parseConsentRecord(
    value.contact,
    CONTACT_CONSENT_VERSION,
    sessionStartedAt,
    now,
  )
  const privacy = parseConsentRecord(
    value.privacy,
    PRIVACY_POLICY_VERSION,
    sessionStartedAt,
    now,
  )
  return contact && privacy ? { contact, privacy } : null
}

function questionMap(path: ConciergeSubmissionPath): Map<string, ConciergeQuestion> {
  const flow = getFlowByPath(path, conciergeDefinition)
  return new Map(
    (flow?.steps ?? [])
      .filter((step): step is ConciergeQuestion => step.kind === 'question')
      .map((question) => [question.id, question]),
  )
}

function sanitizeAnswer(
  answer: unknown,
  question: ConciergeQuestion,
): ConciergeAnswer | undefined {
  if (typeof answer === 'string') {
    const maximum = question.validation?.maxLength ?? 2_000
    const normalized = normalizeSubmissionText(answer, maximum + 1)
    return normalized.length <= maximum ? normalized : undefined
  }
  if (typeof answer === 'number') return Number.isFinite(answer) ? answer : undefined
  if (typeof answer === 'boolean') return answer
  if (Array.isArray(answer) && answer.length <= 20) {
    const values = answer.map((item) =>
      typeof item === 'string' ? normalizeSubmissionText(item, 200) : null,
    )
    return values.every((item): item is string => item !== null) ? values : undefined
  }
  if (answer === null) return null
  return undefined
}

function parseAnswers(
  value: unknown,
  path: ConciergeSubmissionPath,
): { answers: ConciergeAnswers } | { issue: SubmissionParseResult } {
  if (!isPlainRecord(value)) {
    return { issue: failure('INVALID_REQUEST', 'Les réponses sont invalides.') }
  }
  const entries = Object.entries(value)
  if (entries.length > MAX_SUBMISSION_ANSWERS) {
    return { issue: failure('INVALID_REQUEST', 'La demande contient trop de réponses.') }
  }

  const questions = questionMap(path)
  const answers: ConciergeAnswers = {}
  for (const [answerId, answer] of entries) {
    const supplemental = answerId.endsWith('.__other')
    const questionId = supplemental ? answerId.slice(0, -'.__other'.length) : answerId
    const question = questions.get(questionId)
    if (!question || (supplemental && !question.allowsFreeText)) {
      return { issue: failure('INVALID_REQUEST', 'Une réponse ne correspond pas au parcours.') }
    }
    const sanitized = supplemental
      ? boundedText(answer, 1, 160)
      : sanitizeAnswer(answer, question)
    if (sanitized === undefined || sanitized === null) {
      return { issue: failure('INVALID_REQUEST', 'Une réponse est invalide.') }
    }
    const textValues = Array.isArray(sanitized) ? sanitized : [sanitized]
    for (const item of textValues) {
      if (typeof item !== 'string') continue
      const issue = inspectFreeText(item)
      if (issue) return { issue: { valid: false, issue } }
    }
    answers[answerId] = sanitized
  }
  return { answers }
}

export function parseConciergeSubmissionRequest(
  value: unknown,
  now = new Date(),
): SubmissionParseResult {
  const inspection = inspectSubmissionPayload(value)
  if (inspection) return { valid: false, issue: inspection }
  if (!isPlainRecord(value) || !hasOnlyKeys(value, ROOT_KEYS)) {
    return failure('INVALID_REQUEST', 'La requête contient un champ non autorisé.')
  }

  if (typeof value.submissionId !== 'string' || !UUID_PATTERN.test(value.submissionId)) {
    return failure('INVALID_REQUEST', 'L’identifiant de soumission est invalide.')
  }
  if (value.schemaVersion !== CONCIERGE_SCHEMA_VERSION) {
    return failure('INVALID_REQUEST', 'La version du formulaire est incompatible.')
  }
  const sessionStartedAt = parseIso(value.sessionStartedAt)
  if (!sessionStartedAt || new Date(sessionStartedAt).getTime() > now.getTime() + 60_000) {
    return failure('INVALID_REQUEST', 'La date de session est invalide.')
  }
  const sourcePage = normalizePath(value.sourcePage)
  const attribution = parseAttribution(value.attribution)
  if (!sourcePage || !attribution) {
    return failure('INVALID_REQUEST', 'L’origine de la demande est invalide.')
  }
  if (!PATHS.includes(value.activePath as ConciergeSubmissionPath)) {
    return failure('INVALID_REQUEST', 'Le parcours est invalide.')
  }
  if (typeof value.honeypot !== 'string') {
    return failure('INVALID_REQUEST', 'La requête est invalide.')
  }
  if (value.honeypot.trim()) {
    return failure('INVALID_REQUEST', 'La demande ne peut pas être transmise.')
  }
  if (
    typeof value.elapsedMs !== 'number' ||
    !Number.isInteger(value.elapsedMs) ||
    value.elapsedMs < MIN_SUBMISSION_ELAPSED_MS ||
    now.getTime() - new Date(sessionStartedAt).getTime() < MIN_SUBMISSION_ELAPSED_MS
  ) {
    return failure('INVALID_REQUEST', 'La demande ne peut pas encore être transmise.')
  }

  const parsedAnswers = parseAnswers(value.answers, value.activePath as ConciergeSubmissionPath)
  if ('issue' in parsedAnswers) return parsedAnswers.issue
  const contact = parseContact(value.contact)
  if (!contact) return failure('INVALID_REQUEST', 'Les coordonnées sont invalides.')
  const consent = parseConsent(value.consent, sessionStartedAt, now)
  if (!consent) {
    return failure(
      'CONSENT_REQUIRED',
      'Les consentements doivent être confirmés avant l’envoi.',
    )
  }

  const assistedSummary = value.assistedSummary === undefined
    ? undefined
    : validateConciergeAITaskOutput(
      'summarize_qualification',
      value.assistedSummary,
    ) as AssistedQualificationSummary | null
  if (value.assistedSummary !== undefined && !assistedSummary) {
    return failure('INVALID_REQUEST', 'La synthèse assistée est invalide.')
  }

  return {
    valid: true,
    request: {
      submissionId: value.submissionId,
      schemaVersion: CONCIERGE_SCHEMA_VERSION,
      sessionStartedAt,
      sourcePage,
      attribution,
      activePath: value.activePath as ConciergeSubmissionPath,
      answers: parsedAnswers.answers,
      contact,
      consent,
      ...(assistedSummary ? { assistedSummary } : {}),
      honeypot: '',
      elapsedMs: value.elapsedMs,
    },
  }
}
