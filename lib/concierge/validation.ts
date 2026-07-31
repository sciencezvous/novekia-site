import {
  conciergeDefinition,
  getAllStepsForFlow,
  getFlowByPath,
  getStepById,
} from './flows'
import type {
  AnswerValidationResult,
  ConciergeAnswer,
  ConciergeAnswers,
  ConciergeCondition,
  ConciergeDefinition,
  ConciergeFlowDefinition,
  ConciergeNextStep,
  ConciergePath,
  ConciergeQuestion,
  ConciergeStep,
  FlowValidationIssue,
} from './types'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[+()\d\s.-]{6,40}$/

export function isAnswerPresent(answer: ConciergeAnswer | undefined): boolean {
  if (answer === undefined || answer === null) return false
  if (typeof answer === 'string') return answer.trim().length > 0
  if (Array.isArray(answer)) return answer.length > 0
  return true
}

export function evaluateCondition(
  condition: ConciergeCondition,
  answers: ConciergeAnswers,
): boolean {
  const answer = answers[condition.questionId]

  switch (condition.operator) {
    case 'exists':
      return isAnswerPresent(answer)
    case 'not_exists':
      return !isAnswerPresent(answer)
    case 'equals':
      return answer === condition.value
    case 'not_equals':
      return answer !== condition.value
    case 'includes':
      return Array.isArray(answer) && typeof condition.value === 'string'
        ? answer.includes(condition.value)
        : false
    case 'one_of':
      return Array.isArray(condition.value)
        ? condition.value.includes(String(answer ?? ''))
        : false
  }
}

export function shouldDisplayQuestion(
  question: ConciergeQuestion,
  answers: ConciergeAnswers,
): boolean {
  return question.condition
    ? evaluateCondition(question.condition, answers)
    : true
}

export function validateAnswer(
  question: ConciergeQuestion,
  answer: ConciergeAnswer | undefined,
): AnswerValidationResult {
  const errors: string[] = []

  if (!isAnswerPresent(answer)) {
    return question.required
      ? { valid: false, errors: ['Une réponse est requise.'] }
      : { valid: true, errors }
  }

  const validation = question.validation
  const stringValue = typeof answer === 'string' ? answer.trim() : null
  const numericValue = typeof answer === 'number' ? answer : null

  if (question.answerType === 'multiple_choice' && !Array.isArray(answer)) {
    errors.push('La réponse doit contenir une liste de choix.')
  }

  if (
    ['short_text', 'long_text', 'email', 'phone', 'url'].includes(
      question.answerType,
    ) &&
    stringValue === null
  ) {
    errors.push('La réponse doit être du texte.')
  }

  if (
    ['number', 'range'].includes(question.answerType) &&
    numericValue === null
  ) {
    errors.push('La réponse doit être un nombre.')
  }

  if (
    ['boolean', 'consent'].includes(question.answerType) &&
    typeof answer !== 'boolean'
  ) {
    errors.push('La réponse doit être une valeur booléenne explicite.')
  }

  if (stringValue !== null) {
    if (validation?.minLength && stringValue.length < validation.minLength) {
      errors.push(`La réponse doit contenir au moins ${validation.minLength} caractères.`)
    }
    if (validation?.maxLength && stringValue.length > validation.maxLength) {
      errors.push(`La réponse ne doit pas dépasser ${validation.maxLength} caractères.`)
    }
  }

  if (numericValue !== null) {
    if (validation?.min !== undefined && numericValue < validation.min) {
      errors.push(`La valeur minimale est ${validation.min}.`)
    }
    if (validation?.max !== undefined && numericValue > validation.max) {
      errors.push(`La valeur maximale est ${validation.max}.`)
    }
    if (validation?.format === 'integer' && !Number.isInteger(numericValue)) {
      errors.push('La valeur doit être un nombre entier.')
    }
    if (validation?.format === 'positive_number' && numericValue < 0) {
      errors.push('La valeur doit être positive.')
    }
  }

  if (
    validation?.format === 'email' &&
    stringValue !== null &&
    !EMAIL_PATTERN.test(stringValue)
  ) {
    errors.push('L’adresse e-mail n’est pas valide.')
  }

  if (
    validation?.format === 'phone' &&
    stringValue !== null &&
    !PHONE_PATTERN.test(stringValue)
  ) {
    errors.push('Le numéro de téléphone n’est pas valide.')
  }

  if (validation?.format === 'url' && stringValue !== null) {
    try {
      const url = new URL(stringValue)
      if (!['http:', 'https:'].includes(url.protocol)) {
        errors.push('L’URL doit utiliser HTTP ou HTTPS.')
      }
    } catch {
      errors.push('L’URL n’est pas valide.')
    }
  }

  if (validation?.allowedValues) {
    const selectedValues = Array.isArray(answer) ? answer : [String(answer)]
    if (
      selectedValues.some(
        (selectedValue) => !validation.allowedValues?.includes(selectedValue),
      )
    ) {
      errors.push('La réponse ne fait pas partie des valeurs autorisées.')
    }
  }

  if (
    validation?.customRule === 'explicit_consent_required' &&
    answer !== true
  ) {
    errors.push('Le consentement doit être accordé explicitement.')
  }

  return { valid: errors.length === 0, errors }
}

function resolveNextStep(
  nextStep: ConciergeNextStep,
  answers: ConciergeAnswers,
): string | null {
  if (typeof nextStep === 'string' || nextStep === null) return nextStep

  return (
    nextStep.branches.find((branch) =>
      evaluateCondition(branch.condition, answers),
    )?.stepId ?? nextStep.defaultStepId
  )
}

export function getNextStepId(
  flow: ConciergeFlowDefinition,
  currentStepId: string,
  answers: ConciergeAnswers,
  definition: ConciergeDefinition = conciergeDefinition,
): string | null {
  const step = getStepById(flow, currentStepId, definition)
  return step ? resolveNextStep(step.nextStep, answers) : null
}

export function getMissingRequiredFields(
  path: ConciergePath,
  answers: ConciergeAnswers,
  options: {
    includeSharedSteps?: boolean
    definition?: ConciergeDefinition
  } = {},
): readonly string[] {
  const definition = options.definition ?? conciergeDefinition
  const flow = getFlowByPath(path, definition)
  if (!flow) return []

  const steps = options.includeSharedSteps
    ? getAllStepsForFlow(flow, definition)
    : flow.steps

  return steps
    .filter((step): step is ConciergeQuestion => step.kind === 'question')
    .filter((question) => shouldDisplayQuestion(question, answers))
    .filter((question) => question.required)
    .filter((question) => !validateAnswer(question, answers[question.id]).valid)
    .map((question) => question.id)
}

function getNextTargets(nextStep: ConciergeNextStep): readonly string[] {
  if (typeof nextStep === 'string') return [nextStep]
  if (nextStep === null) return []
  return [
    ...nextStep.branches.map((branch) => branch.stepId),
    nextStep.defaultStepId,
  ]
}

function validateStepReferences(
  flow: ConciergeFlowDefinition,
  steps: readonly ConciergeStep[],
): FlowValidationIssue[] {
  const issues: FlowValidationIssue[] = []
  const ids = new Set(steps.map((step) => step.id))

  for (const step of steps) {
    for (const target of getNextTargets(step.nextStep)) {
      if (!ids.has(target)) {
        issues.push({
          code: 'missing_step_reference',
          message: `L’étape ${step.id} pointe vers l’étape absente ${target}.`,
          flowId: flow.id,
          stepId: step.id,
        })
      }
    }
  }

  if (!ids.has(flow.startStepId)) {
    issues.push({
      code: 'missing_step_reference',
      message: `Le point d’entrée ${flow.startStepId} est absent.`,
      flowId: flow.id,
    })
  }

  if (!ids.has(flow.exitStepId)) {
    issues.push({
      code: 'missing_step_reference',
      message: `La sortie ${flow.exitStepId} est absente.`,
      flowId: flow.id,
    })
  }

  return issues
}

function validateGraph(
  flow: ConciergeFlowDefinition,
  steps: readonly ConciergeStep[],
): FlowValidationIssue[] {
  const issues: FlowValidationIssue[] = []
  const stepMap = new Map(steps.map((step) => [step.id, step]))
  const visiting = new Set<string>()
  const visited = new Set<string>()
  let exitReachable = false

  function visit(stepId: string, summarySeen: boolean) {
    if (stepId === flow.exitStepId) exitReachable = true
    if (visiting.has(stepId)) {
      issues.push({
        code: 'cycle_detected',
        message: `Une boucle potentielle inclut l’étape ${stepId}.`,
        flowId: flow.id,
        stepId,
      })
      return
    }
    if (visited.has(`${stepId}:${summarySeen}`)) return

    const step = stepMap.get(stepId)
    if (!step) return

    const nextSummarySeen =
      summarySeen || (step.kind === 'system' && step.stepType === 'summary')

    if (step.kind === 'question' && step.section === 'consent' && !nextSummarySeen) {
      issues.push({
        code: 'consent_before_summary',
        message: `Le consentement ${step.id} est accessible avant la synthèse.`,
        flowId: flow.id,
        stepId: step.id,
      })
    }

    visiting.add(stepId)
    for (const target of getNextTargets(step.nextStep)) {
      visit(target, nextSummarySeen)
    }
    visiting.delete(stepId)
    visited.add(`${stepId}:${summarySeen}`)
  }

  visit(flow.startStepId, false)

  if (!exitReachable) {
    issues.push({
      code: 'unreachable_exit',
      message: `La sortie ${flow.exitStepId} n’est pas atteignable depuis ${flow.startStepId}.`,
      flowId: flow.id,
    })
  }

  return issues
}

export function validateConciergeDefinition(
  definition: ConciergeDefinition = conciergeDefinition,
): readonly FlowValidationIssue[] {
  const issues: FlowValidationIssue[] = []
  const expectedPaths: readonly Exclude<ConciergePath, 'unknown'>[] = [
    'lead_engine',
    'solutions',
    'information',
    'direct_contact',
  ]

  for (const path of expectedPaths) {
    if (!definition.flows.some((flow) => flow.path === path)) {
      issues.push({
        code: 'missing_flow',
        message: `Le parcours ${path} est absent.`,
      })
    }
  }

  const allSteps = [
    ...definition.sharedSteps,
    ...definition.flows.flatMap((flow) => flow.steps),
  ]
  const seenIds = new Set<string>()

  for (const step of allSteps) {
    if (seenIds.has(step.id)) {
      issues.push({
        code: 'duplicate_id',
        message: `L’identifiant ${step.id} est déclaré plusieurs fois.`,
        stepId: step.id,
      })
    }
    seenIds.add(step.id)

    if (
      step.kind === 'question' &&
      step.required &&
      step.sensitiveData &&
      !step.sensitiveDataJustification
    ) {
      issues.push({
        code: 'unjustified_sensitive_requirement',
        message: `La question sensible requise ${step.id} n’est pas justifiée.`,
        stepId: step.id,
      })
    }
  }

  for (const flow of definition.flows) {
    const flowSteps = getAllStepsForFlow(flow, definition)
    issues.push(...validateStepReferences(flow, flowSteps))
    issues.push(...validateGraph(flow, flowSteps))
  }

  return issues
}

export function assertConciergeDefinitionIsValid(
  definition: ConciergeDefinition = conciergeDefinition,
): void {
  const issues = validateConciergeDefinition(definition)
  if (issues.length > 0) {
    throw new Error(
      `Contrat du concierge incohérent : ${issues
        .map((issue) => issue.message)
        .join(' | ')}`,
    )
  }
}
