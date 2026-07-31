import {
  conciergeDefinition,
  getFlowByPath,
} from './flows'
import {
  evaluateCondition,
  getMissingRequiredFields,
  isAnswerPresent,
  shouldDisplayQuestion,
} from './validation'
import type {
  ConciergeAnswers,
  ConciergeDefinition,
  ConciergePath,
  ConciergeQuestion,
  ConciergeSession,
  QualificationLevel,
  QualificationReadiness,
  QualificationResult,
} from './types'

const SAFETY_REVIEW_PATTERN =
  /(?:sans autorisation|ill[ée]gal|pirater|attaque active|contourner|malware|ran[çc]ongiciel|ransomware|voler des donn[ée]es|exfiltrer)/i

function getQualificationQuestions(
  path: ConciergePath,
  answers: ConciergeAnswers,
  definition: ConciergeDefinition,
): readonly ConciergeQuestion[] {
  const flow = getFlowByPath(path, definition)
  if (!flow) return []

  return flow.steps
    .filter((step): step is ConciergeQuestion => step.kind === 'question')
    .filter((question) => shouldDisplayQuestion(question, answers))
}

export function calculateCompletenessScore(
  path: ConciergePath,
  answers: ConciergeAnswers,
  definition: ConciergeDefinition = conciergeDefinition,
): number {
  const questions = getQualificationQuestions(path, answers, definition)
  if (questions.length === 0) return 0

  const totalWeight = questions.reduce(
    (total, question) => total + (question.required ? 2 : 1),
    0,
  )
  const answeredWeight = questions.reduce(
    (total, question) =>
      total +
      (isAnswerPresent(answers[question.id]) ? (question.required ? 2 : 1) : 0),
    0,
  )

  return Math.round((answeredWeight / totalWeight) * 100)
}

function getMainNeedQuestionIds(path: ConciergePath): readonly string[] {
  switch (path) {
    case 'lead_engine':
      return ['lead.offer', 'lead.target_customer', 'lead.main_objective']
    case 'solutions':
      return [
        'solutions.need_category',
        'solutions.project_description',
        'solutions.current_state',
      ]
    case 'information':
      return ['information.topic']
    case 'direct_contact':
      return ['direct_contact.reason']
    case 'unknown':
      return []
  }
}

function hasDeclaredMainNeed(
  path: ConciergePath,
  answers: ConciergeAnswers,
): boolean {
  const ids = getMainNeedQuestionIds(path)
  return ids.length > 0 && ids.every((id) => isAnswerPresent(answers[id]))
}

function detectSafetyReview(answers: ConciergeAnswers): boolean {
  return Object.values(answers).some((answer) => {
    if (typeof answer === 'string') return SAFETY_REVIEW_PATTERN.test(answer)
    if (Array.isArray(answer)) return answer.some((item) => SAFETY_REVIEW_PATTERN.test(item))
    return false
  })
}

function hasValidCyberAuthorization(answers: ConciergeAnswers): boolean {
  if (
    answers['solutions.need_category'] !==
    'cybersecurity_authorized_audit'
  ) {
    return true
  }

  return (
    answers['solutions.cybersecurity_authorized_audit.authorization'] ===
    'written_authorization_available'
  )
}

function collectHumanReviewReasons(
  path: ConciergePath,
  answers: ConciergeAnswers,
  definition: ConciergeDefinition,
): readonly string[] {
  const questions = getQualificationQuestions(path, answers, definition)

  return questions.flatMap((question) => {
    const trigger = question.humanReviewTrigger
    if (!trigger || !isAnswerPresent(answers[question.id])) return []
    if (trigger.condition && !evaluateCondition(trigger.condition, answers)) {
      return []
    }
    return [trigger.reason]
  })
}

function determineQualificationLevel(
  completenessScore: number,
  mainNeedDeclared: boolean,
  blockingRisk: boolean,
): QualificationLevel {
  if (!mainNeedDeclared || completenessScore < 35) return 'insufficient'
  if (completenessScore < 60 || blockingRisk) return 'exploratory'
  if (completenessScore < 85) return 'relevant'
  return 'strong'
}

function hasRequiredConsent(session: ConciergeSession): boolean {
  return Boolean(
    session.consent?.contact.consentGranted &&
      session.consent.contact.consentedAt &&
      session.consent.privacy.consentGranted &&
      session.consent.privacy.consentedAt,
  )
}

function determineReadiness(
  session: ConciergeSession,
  level: QualificationLevel,
  blockingRisk: boolean,
  missingInformation: readonly string[],
): QualificationReadiness {
  if (level === 'insufficient' || blockingRisk) return 'not_ready'
  if (missingInformation.length > 0 || level === 'exploratory') {
    return 'needs_clarification'
  }
  if (session.summary && session.contact && hasRequiredConsent(session)) {
    return 'ready_for_contact'
  }
  return 'ready_for_human_review'
}

export function qualifyConciergeSession(
  session: ConciergeSession,
  definition: ConciergeDefinition = conciergeDefinition,
): QualificationResult {
  const completenessScore = calculateCompletenessScore(
    session.activePath,
    session.answers,
    definition,
  )
  const missingInformation = getMissingRequiredFields(
    session.activePath,
    session.answers,
    { includeSharedSteps: false, definition },
  )
  const mainNeedDeclared = hasDeclaredMainNeed(
    session.activePath,
    session.answers,
  )
  const safetyReview = detectSafetyReview(session.answers)
  const cyberAuthorizationValid = hasValidCyberAuthorization(session.answers)
  const blockingRisk = safetyReview || !cyberAuthorizationValid
  const humanReviewReasons = collectHumanReviewReasons(
    session.activePath,
    session.answers,
    definition,
  )
  const qualificationLevel = determineQualificationLevel(
    completenessScore,
    mainNeedDeclared,
    blockingRisk,
  )
  const readiness = determineReadiness(
    session,
    qualificationLevel,
    blockingRisk,
    missingInformation,
  )

  const positiveSignals = [
    mainNeedDeclared ? 'Le besoin principal est déclaré.' : null,
    isAnswerPresent(session.answers['lead.timeframe']) ||
    isAnswerPresent(session.answers['solutions.timeframe'])
      ? 'Un horizon de réalisation est indiqué.'
      : null,
    isAnswerPresent(session.answers['lead.target_customer'])
      ? 'La cible commerciale est décrite.'
      : null,
    isAnswerPresent(session.answers['solutions.current_state'])
      ? 'La situation actuelle est documentée.'
      : null,
  ].filter((signal): signal is string => Boolean(signal))

  const risks = [
    safetyReview
      ? 'Le contenu déclaré contient un signal de risque, d’illégalité ou d’action non autorisée.'
      : null,
    !cyberAuthorizationValid
      ? 'Une demande d’audit de cybersécurité ne dispose pas encore d’une autorisation écrite vérifiable.'
      : null,
    ...humanReviewReasons,
  ].filter((risk): risk is string => Boolean(risk))

  const reasons = [
    `Complétude du cadrage : ${completenessScore}/100.`,
    mainNeedDeclared
      ? 'Le besoin minimal nécessaire à l’orientation est présent.'
      : 'Le besoin reste trop peu défini pour être orienté.',
    missingInformation.length > 0
      ? `${missingInformation.length} information(s) requise(s) restent manquantes.`
      : 'Toutes les informations requises du parcours sont présentes.',
    'Le niveau indique la pertinence d’un échange humain, jamais une vente garantie.',
  ]

  const recommendedNextAction =
    readiness === 'not_ready'
      ? 'Suspendre toute transmission et demander une clarification ou une validation humaine.'
      : readiness === 'needs_clarification'
        ? 'Compléter les informations manquantes avant la synthèse finale.'
        : readiness === 'ready_for_human_review'
          ? 'Préparer la synthèse pour revue par Novekia avant toute décision.'
          : 'Transmettre la demande à Novekia après vérification finale des consentements.'

  return {
    path: session.activePath,
    completenessScore,
    qualificationLevel,
    readiness,
    positiveSignals,
    missingInformation,
    risks,
    recommendedNextAction,
    humanReviewRequired:
      session.humanReviewRequired ||
      risks.length > 0 ||
      readiness === 'ready_for_human_review',
    reasons,
  }
}
