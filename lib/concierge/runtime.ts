import {
  conciergeDefinition,
  getAllStepsForFlow,
  getFlowByPath,
  getStepById,
} from './flows'
import { qualifyConciergeSession, calculateCompletenessScore } from './qualification'
import { createConciergeSummary } from './summary'
import {
  CONTACT_CONSENT_VERSION,
  PRIVACY_POLICY_VERSION,
  conciergeSectionLabels,
} from './config'
import {
  getMissingRequiredFields,
  getNextStepId,
  shouldDisplayQuestion,
  validateAnswer,
} from './validation'
import type {
  ConciergeAnswer,
  ConciergeAnswers,
  ConciergeAttribution,
  ConciergeConsent,
  ConciergeContact,
  ConciergePath,
  ConciergeQuestion,
  ConciergeSession,
  ConciergeSessionError,
  ConciergeStatus,
  ConciergeStep,
} from './types'

export type ConciergeRuntimeState = {
  session: ConciergeSession
  visitedStepIds: readonly string[]
  skippedStepIds: readonly string[]
}

export type ConciergeRuntimeResult = {
  state: ConciergeRuntimeState
  ok: boolean
  errors: readonly string[]
}

export type ConciergeProgress = {
  sectionLabel: string
  current: number
  total: number
  percent: number
}

type SessionInput = {
  sessionId: string
  sourcePage: string
  referrer?: string
  now?: string
}

const OBVIOUS_SECRET_PATTERNS = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i,
  /\bsk-[a-z0-9_-]{20,}\b/i,
  /\bBearer\s+[a-z0-9._~+/=-]{20,}/i,
  /\b(?:password|motdepasse)\s*=\s*\S{4,}/i,
] as const

function nowIso(now?: string): string {
  return now ?? new Date().toISOString()
}

function safeReferrerHost(referrer: string): string {
  if (!referrer) return ''
  try {
    return new URL(referrer).host
  } catch {
    return ''
  }
}

function buildAttribution(sourcePage: string, referrer: string): ConciergeAttribution {
  return {
    landingPath: sourcePage,
    currentPath: sourcePage,
    referrer,
    referrerHost: safeReferrerHost(referrer),
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    utmContent: '',
    utmTerm: '',
  }
}

export function createConciergeSession(input: SessionInput): ConciergeRuntimeState {
  const timestamp = nowIso(input.now)
  const referrer = input.referrer ?? ''

  return {
    session: {
      sessionId: input.sessionId,
      schemaVersion: conciergeDefinition.schemaVersion,
      status: 'choosing_path',
      activePath: 'unknown',
      currentStepId: null,
      startedAt: null,
      updatedAt: timestamp,
      completedAt: null,
      sourcePage: input.sourcePage,
      referrer,
      attribution: buildAttribution(input.sourcePage, referrer),
      answers: {},
      missingRequiredFields: [],
      completionScore: 0,
      qualificationResult: null,
      summary: null,
      contact: null,
      consent: null,
      humanReviewRequired: false,
      errors: [],
    },
    visitedStepIds: [],
    skippedStepIds: [],
  }
}

export function detectObviousSecret(answer: ConciergeAnswer | undefined): boolean {
  const values = Array.isArray(answer) ? answer : [answer]
  return values.some(
    (value) =>
      typeof value === 'string' &&
      OBVIOUS_SECRET_PATTERNS.some((pattern) => pattern.test(value)),
  )
}

function getStatusForStep(step: ConciergeStep | undefined): ConciergeStatus {
  if (!step) return 'error'
  if (step.kind === 'system') {
    if (step.stepType === 'summary') return 'reviewing_summary'
    if (step.stepType === 'ready_to_submit') return 'ready_to_submit'
  }
  if (step.section === 'contact') return 'collecting_contact'
  if (step.section === 'consent') return 'awaiting_consent'
  return 'qualifying'
}

function answerText(answers: ConciergeAnswers, id: string): string {
  const answer = answers[id]
  return typeof answer === 'string' ? answer.trim() : ''
}

function buildContact(answers: ConciergeAnswers): ConciergeContact | null {
  const fullName = answerText(answers, 'contact.full_name')
  const company = answerText(answers, 'contact.company')
  const professionalEmail = answerText(answers, 'contact.email')
  if (!fullName || !company || !professionalEmail) return null

  const preferred = answers['contact.preferred_contact']
  const preferredContact =
    preferred === 'email' || preferred === 'phone' || preferred === 'either'
      ? preferred
      : undefined

  return {
    fullName,
    company,
    professionalEmail,
    role: answerText(answers, 'contact.role') || undefined,
    phone: answerText(answers, 'contact.phone') || undefined,
    preferredContact,
  }
}

function buildConsent(
  answers: ConciergeAnswers,
  previous: ConciergeConsent | null,
  timestamp: string,
): ConciergeConsent {
  const contactGranted = answers['consent.contact'] === true
  const privacyGranted = answers['consent.privacy'] === true

  return {
    contact: {
      consentGranted: contactGranted,
      consentTextVersion: CONTACT_CONSENT_VERSION,
      consentedAt: contactGranted
        ? (previous?.contact.consentedAt ?? timestamp)
        : null,
      privacyPolicyVersion: PRIVACY_POLICY_VERSION,
    },
    privacy: {
      consentGranted: privacyGranted,
      consentTextVersion: PRIVACY_POLICY_VERSION,
      consentedAt: privacyGranted
        ? (previous?.privacy.consentedAt ?? timestamp)
        : null,
      privacyPolicyVersion: PRIVACY_POLICY_VERSION,
    },
  }
}

function isSharedStage(stepId: string | null): boolean {
  return Boolean(
    stepId &&
      (stepId === 'summary.review' ||
        stepId.startsWith('contact.') ||
        stepId.startsWith('consent.') ||
        stepId === 'submission.ready'),
  )
}

function recalculateState(
  state: ConciergeRuntimeState,
  timestamp = new Date().toISOString(),
): ConciergeRuntimeState {
  const flow = getFlowByPath(state.session.activePath)
  if (!flow) return state

  const step = state.session.currentStepId
    ? getStepById(flow, state.session.currentStepId)
    : undefined
  const contact = buildContact(state.session.answers)
  const consent = buildConsent(state.session.answers, state.session.consent, timestamp)
  const missingRequiredFields = getMissingRequiredFields(
    state.session.activePath,
    state.session.answers,
    { includeSharedSteps: isSharedStage(state.session.currentStepId) },
  )
  const completionScore = calculateCompletenessScore(
    state.session.activePath,
    state.session.answers,
  )
  const baseSession: ConciergeSession = {
    ...state.session,
    status: getStatusForStep(step),
    updatedAt: timestamp,
    contact,
    consent,
    missingRequiredFields,
    completionScore,
  }
  const initialQualification = qualifyConciergeSession(baseSession)
  const shouldHaveSummary = Boolean(
    baseSession.summary || isSharedStage(baseSession.currentStepId),
  )
  const sessionWithSummary: ConciergeSession = {
    ...baseSession,
    qualificationResult: initialQualification,
    humanReviewRequired: initialQualification.humanReviewRequired,
    summary: shouldHaveSummary ? createConciergeSummary({
      ...baseSession,
      qualificationResult: initialQualification,
    }) : null,
  }
  const qualificationResult = qualifyConciergeSession(sessionWithSummary)
  const ready = Boolean(
    sessionWithSummary.currentStepId === 'submission.ready' &&
      contact &&
      consent.contact.consentGranted &&
      consent.contact.consentedAt &&
      consent.privacy.consentGranted &&
      consent.privacy.consentedAt,
  )

  return {
    ...state,
    session: {
      ...sessionWithSummary,
      status: ready ? 'ready_to_submit' : sessionWithSummary.status,
      completedAt: ready ? (sessionWithSummary.completedAt ?? timestamp) : null,
      qualificationResult,
      humanReviewRequired: qualificationResult.humanReviewRequired,
      summary: shouldHaveSummary
        ? createConciergeSummary({
            ...sessionWithSummary,
            qualificationResult,
          })
        : null,
    },
  }
}

function appendError(
  state: ConciergeRuntimeState,
  code: string,
  message: string,
  recoverable = true,
): ConciergeRuntimeState {
  const error: ConciergeSessionError = {
    code,
    message,
    stepId: state.session.currentStepId ?? undefined,
    occurredAt: new Date().toISOString(),
    recoverable,
  }
  return {
    ...state,
    session: {
      ...state.session,
      errors: [...state.session.errors, error],
      status: recoverable ? state.session.status : 'error',
    },
  }
}

export function startConciergePath(
  state: ConciergeRuntimeState,
  path: Exclude<ConciergePath, 'unknown'>,
  now?: string,
): ConciergeRuntimeResult {
  const flow = getFlowByPath(path)
  if (!flow) {
    const message = 'Ce parcours est indisponible.'
    return { state: appendError(state, 'invalid_flow', message, false), ok: false, errors: [message] }
  }

  const timestamp = nowIso(now)
  const nextState: ConciergeRuntimeState = {
    session: {
      ...state.session,
      status: 'qualifying',
      activePath: path,
      currentStepId: flow.startStepId,
      startedAt: state.session.startedAt ?? timestamp,
      updatedAt: timestamp,
      completedAt: null,
      answers: {},
      missingRequiredFields: [],
      completionScore: 0,
      qualificationResult: null,
      summary: null,
      contact: null,
      consent: null,
      humanReviewRequired: false,
      errors: [],
    },
    visitedStepIds: [flow.startStepId],
    skippedStepIds: [],
  }

  return { state: recalculateState(nextState, timestamp), ok: true, errors: [] }
}

function pruneInactiveBranchAnswers(
  state: ConciergeRuntimeState,
  answers: ConciergeAnswers,
): { answers: ConciergeAnswers; visitedStepIds: readonly string[] } {
  const flow = getFlowByPath(state.session.activePath)
  if (!flow) return { answers, visitedStepIds: state.visitedStepIds }

  const nextAnswers = { ...answers }
  for (const step of flow.steps) {
    if (
      step.kind === 'question' &&
      step.condition &&
      !shouldDisplayQuestion(step, answers)
    ) {
      delete nextAnswers[step.id]
      delete nextAnswers[`${step.id}.__other`]
    }
  }

  const visitedStepIds = state.visitedStepIds.filter((stepId) => {
    const step = getStepById(flow, stepId)
    return !step || step.kind === 'system' || shouldDisplayQuestion(step, nextAnswers)
  })

  return { answers: nextAnswers, visitedStepIds }
}

export function recordConciergeAnswer(
  state: ConciergeRuntimeState,
  answer: ConciergeAnswer,
  now?: string,
): ConciergeRuntimeResult {
  const flow = getFlowByPath(state.session.activePath)
  const step = flow && state.session.currentStepId
    ? getStepById(flow, state.session.currentStepId)
    : undefined

  if (!step || step.kind !== 'question') {
    const message = 'Cette étape ne peut pas recevoir de réponse.'
    return { state: appendError(state, 'transition_impossible', message), ok: false, errors: [message] }
  }

  if (detectObviousSecret(answer)) {
    const message = 'Un secret évident semble présent. Reformulez sans mot de passe, clé ou jeton.'
    return { state: appendError(state, 'secret_detected', message), ok: false, errors: [message] }
  }

  if (typeof answer === 'number' && !Number.isFinite(answer)) {
    const message = 'La réponse doit être un nombre valide.'
    return { state: appendError(state, 'invalid_answer', message), ok: false, errors: [message] }
  }

  const validation = validateAnswer(step, answer)
  if (!validation.valid) {
    return {
      state: appendError(state, 'invalid_answer', validation.errors.join(' ')),
      ok: false,
      errors: validation.errors,
    }
  }

  const rawAnswers: ConciergeAnswers = {
    ...state.session.answers,
    [step.id]: answer,
  }
  const pruned = pruneInactiveBranchAnswers(state, rawAnswers)
  const timestamp = nowIso(now)
  const nextState = recalculateState({
    ...state,
    visitedStepIds: pruned.visitedStepIds,
    skippedStepIds: state.skippedStepIds.filter((id) => id !== step.id),
    session: {
      ...state.session,
      answers: pruned.answers,
      updatedAt: timestamp,
    },
  }, timestamp)

  return { state: nextState, ok: true, errors: [] }
}

export function recordConciergeSupplementalAnswer(
  state: ConciergeRuntimeState,
  questionId: string,
  value: string,
  now?: string,
): ConciergeRuntimeResult {
  const trimmed = value.trim()
  if (!trimmed) return { state, ok: true, errors: [] }
  if (detectObviousSecret(trimmed)) {
    const message = 'Un secret évident semble présent. Reformulez sans mot de passe, clé ou jeton.'
    return { state: appendError(state, 'secret_detected', message), ok: false, errors: [message] }
  }

  const timestamp = nowIso(now)
  return {
    state: recalculateState({
      ...state,
      session: {
        ...state.session,
        answers: { ...state.session.answers, [`${questionId}.__other`]: trimmed },
        updatedAt: timestamp,
      },
    }, timestamp),
    ok: true,
    errors: [],
  }
}

export function advanceConcierge(
  state: ConciergeRuntimeState,
  now?: string,
): ConciergeRuntimeResult {
  const flow = getFlowByPath(state.session.activePath)
  const currentStepId = state.session.currentStepId
  const step = flow && currentStepId ? getStepById(flow, currentStepId) : undefined

  if (!flow || !step || !currentStepId) {
    const message = 'Impossible de déterminer la prochaine étape.'
    return { state: appendError(state, 'step_not_found', message), ok: false, errors: [message] }
  }

  if (step.kind === 'question') {
    const validation = validateAnswer(step, state.session.answers[step.id])
    if (!validation.valid) {
      return { state: appendError(state, 'invalid_answer', validation.errors.join(' ')), ok: false, errors: validation.errors }
    }
  }

  const nextStepId = getNextStepId(flow, currentStepId, state.session.answers)
  if (!nextStepId) {
    if (currentStepId === flow.exitStepId) return { state, ok: true, errors: [] }
    const message = 'Aucune transition valide n’est disponible.'
    return { state: appendError(state, 'transition_impossible', message), ok: false, errors: [message] }
  }

  const nextStep = getStepById(flow, nextStepId)
  if (!nextStep) {
    const message = 'La prochaine étape est introuvable.'
    return { state: appendError(state, 'step_not_found', message, false), ok: false, errors: [message] }
  }

  const timestamp = nowIso(now)
  const visited = state.visitedStepIds[state.visitedStepIds.length - 1] === nextStepId
    ? state.visitedStepIds
    : [...state.visitedStepIds, nextStepId]
  const nextState = recalculateState({
    ...state,
    visitedStepIds: visited,
    session: {
      ...state.session,
      currentStepId: nextStepId,
      updatedAt: timestamp,
    },
  }, timestamp)

  return { state: nextState, ok: true, errors: [] }
}

export function goBackConcierge(
  state: ConciergeRuntimeState,
  now?: string,
): ConciergeRuntimeResult {
  if (state.visitedStepIds.length < 2) {
    const message = 'Aucune étape précédente n’est disponible.'
    return { state, ok: false, errors: [message] }
  }

  const visited = state.visitedStepIds.slice(0, -1)
  const previousStepId = visited[visited.length - 1]
  const timestamp = nowIso(now)
  return {
    state: recalculateState({
      ...state,
      visitedStepIds: visited,
      session: {
        ...state.session,
        currentStepId: previousStepId,
        completedAt: null,
        updatedAt: timestamp,
      },
    }, timestamp),
    ok: true,
    errors: [],
  }
}

export function skipConciergeQuestion(
  state: ConciergeRuntimeState,
  now?: string,
): ConciergeRuntimeResult {
  const flow = getFlowByPath(state.session.activePath)
  const step = flow && state.session.currentStepId
    ? getStepById(flow, state.session.currentStepId)
    : undefined

  if (!step || step.kind !== 'question' || step.required) {
    const message = 'Cette question ne peut pas être passée.'
    return { state, ok: false, errors: [message] }
  }

  const answers = { ...state.session.answers }
  delete answers[step.id]
  delete answers[`${step.id}.__other`]
  const recorded: ConciergeRuntimeState = {
    ...state,
    skippedStepIds: Array.from(new Set([...state.skippedStepIds, step.id])),
    session: { ...state.session, answers },
  }
  return advanceConcierge(recalculateState(recorded, nowIso(now)), now)
}

export function getCurrentConciergeStep(
  state: ConciergeRuntimeState,
): ConciergeStep | null {
  const flow = getFlowByPath(state.session.activePath)
  return flow && state.session.currentStepId
    ? (getStepById(flow, state.session.currentStepId) ?? null)
    : null
}

export function getVisibleConciergeQuestions(
  state: ConciergeRuntimeState,
): readonly ConciergeQuestion[] {
  const flow = getFlowByPath(state.session.activePath)
  if (!flow) return []
  return getAllStepsForFlow(flow)
    .filter((step): step is ConciergeQuestion => step.kind === 'question')
    .filter((question) => shouldDisplayQuestion(question, state.session.answers))
}

export function getConciergeProgress(state: ConciergeRuntimeState): ConciergeProgress {
  const questions = getVisibleConciergeQuestions(state)
  const currentStep = getCurrentConciergeStep(state)
  const currentIndex = currentStep?.kind === 'question'
    ? questions.findIndex((question) => question.id === currentStep.id)
    : questions.filter((question) => state.visitedStepIds.includes(question.id)).length - 1
  const current = Math.max(0, Math.min(questions.length, currentIndex + 1))
  const total = Math.max(questions.length, 1)
  return {
    sectionLabel: currentStep
      ? (conciergeSectionLabels[currentStep.section] ?? currentStep.section)
      : 'Orientation',
    current,
    total,
    percent: Math.round((current / total) * 100),
  }
}

export function restartConciergeSession(
  state: ConciergeRuntimeState,
  sessionId = state.session.sessionId,
  now?: string,
): ConciergeRuntimeState {
  return createConciergeSession({
    sessionId,
    sourcePage: state.session.sourcePage,
    referrer: state.session.referrer,
    now,
  })
}
