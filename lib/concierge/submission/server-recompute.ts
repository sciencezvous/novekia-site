import {
  advanceConcierge,
  createConciergeSession,
  getCurrentConciergeStep,
  recordConciergeAnswer,
  recordConciergeSupplementalAnswer,
  skipConciergeQuestion,
  startConciergePath,
  type ConciergeRuntimeState,
} from '../runtime'
import type { ConciergeAnswer, ConciergeAnswers, ConciergeContact } from '../types'
import type {
  ConciergeSubmissionRequest,
  RecomputedConciergeSubmission,
} from './contracts'

export type RecomputeResult =
  | { valid: true; submission: RecomputedConciergeSubmission }
  | { valid: false; message: string }

function contactAnswers(request: ConciergeSubmissionRequest): ConciergeAnswers {
  return {
    'contact.full_name': request.contact.fullName,
    'contact.company': request.contact.company,
    'contact.role': request.contact.role,
    'contact.email': request.contact.email,
    'contact.phone': request.contact.phone,
    'contact.preferred_contact': request.contact.preferredContact,
    'consent.contact': true,
    'consent.privacy': true,
  }
}

function stepTimestamp(
  stepId: string,
  request: ConciergeSubmissionRequest,
  fallback: string,
): string {
  if (stepId === 'consent.contact') {
    return request.consent.contact.consentedAt ?? fallback
  }
  if (stepId === 'consent.privacy') {
    return request.consent.privacy.consentedAt ?? fallback
  }
  return fallback
}

export function recomputeConciergeSubmission(
  request: ConciergeSubmissionRequest,
  now = new Date(),
): RecomputeResult {
  const initial = createConciergeSession({
    sessionId: request.submissionId,
    sourcePage: request.sourcePage,
    now: request.sessionStartedAt,
  })
  const started = startConciergePath(
    initial,
    request.activePath,
    request.sessionStartedAt,
  )
  if (!started.ok) return { valid: false, message: 'Le parcours est indisponible.' }

  let state: ConciergeRuntimeState = {
    ...started.state,
    session: {
      ...started.state.session,
      attribution: request.attribution,
    },
  }
  const suppliedAnswers: ConciergeAnswers = {
    ...request.answers,
    ...contactAnswers(request),
  }
  const consumed = new Set<string>()
  const replayedAt = now.toISOString()

  for (let transition = 0; transition < 220; transition += 1) {
    const step = getCurrentConciergeStep(state)
    if (!step) return { valid: false, message: 'Une étape du parcours est introuvable.' }

    if (step.kind === 'system') {
      if (step.stepType === 'ready_to_submit') break
      const advanced = advanceConcierge(state, replayedAt)
      if (!advanced.ok) return { valid: false, message: 'Le parcours ne peut pas progresser.' }
      state = advanced.state
      continue
    }

    const answer = suppliedAnswers[step.id]
    if (answer === undefined || answer === null || answer === '') {
      if (step.required) {
        return { valid: false, message: 'Des informations requises sont manquantes.' }
      }
      const skipped = skipConciergeQuestion(state, replayedAt)
      if (!skipped.ok) return { valid: false, message: 'Une réponse facultative est invalide.' }
      state = skipped.state
      continue
    }

    const timestamp = stepTimestamp(step.id, request, replayedAt)
    let recorded = recordConciergeAnswer(state, answer as ConciergeAnswer, timestamp)
    if (!recorded.ok) return { valid: false, message: 'Une réponse ne respecte pas le parcours.' }
    consumed.add(step.id)

    const supplementalId = `${step.id}.__other`
    const supplemental = suppliedAnswers[supplementalId]
    if (typeof supplemental === 'string' && supplemental.trim()) {
      recorded = recordConciergeSupplementalAnswer(
        recorded.state,
        step.id,
        supplemental,
        timestamp,
      )
      if (!recorded.ok) return { valid: false, message: 'Une précision est invalide.' }
      consumed.add(supplementalId)
    }

    const advanced = advanceConcierge(recorded.state, timestamp)
    if (!advanced.ok) return { valid: false, message: 'Le parcours ne peut pas progresser.' }
    state = advanced.state
  }

  const qualification = state.session.qualificationResult
  if (
    state.session.status !== 'ready_to_submit' ||
    !state.session.summary ||
    !state.session.contact ||
    !state.session.consent ||
    !qualification ||
    qualification.readiness !== 'ready_for_contact' ||
    state.session.missingRequiredFields.length > 0
  ) {
    return { valid: false, message: 'La demande n’est pas prête à être transmise.' }
  }

  const contact: ConciergeContact = {
    ...state.session.contact,
    professionalEmail: request.contact.email,
  }
  const inaccessibleAnswerIds = Object.keys(request.answers).filter(
    (answerId) => !consumed.has(answerId),
  )

  return {
    valid: true,
    submission: {
      submissionId: request.submissionId,
      receivedAt: now.toISOString(),
      sourcePage: request.sourcePage,
      attribution: request.attribution,
      activePath: request.activePath,
      answers: state.session.answers,
      contact,
      consent: request.consent,
      session: {
        ...state.session,
        contact,
        consent: request.consent,
      },
      ...(request.assistedSummary
        ? { assistedSummary: request.assistedSummary }
        : {}),
      inaccessibleAnswerIds,
      clientServerConsistent: inaccessibleAnswerIds.length === 0,
    },
  }
}
