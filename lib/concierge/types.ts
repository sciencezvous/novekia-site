export const CONCIERGE_SCHEMA_VERSION = '1.0.0' as const

export type ConciergeStatus =
  | 'idle'
  | 'started'
  | 'choosing_path'
  | 'qualifying'
  | 'reviewing_summary'
  | 'collecting_contact'
  | 'awaiting_consent'
  | 'ready_to_submit'
  | 'submitted'
  | 'abandoned'
  | 'error'

export type ConciergePath =
  | 'lead_engine'
  | 'solutions'
  | 'information'
  | 'direct_contact'
  | 'unknown'

export type ConciergeQuestionPath = ConciergePath | 'shared'

export type ConciergeAnswerType =
  | 'single_choice'
  | 'multiple_choice'
  | 'short_text'
  | 'long_text'
  | 'email'
  | 'phone'
  | 'url'
  | 'number'
  | 'range'
  | 'boolean'
  | 'consent'

export type ConciergeAnswer =
  | string
  | number
  | boolean
  | readonly string[]
  | null

export type ConciergeAnswers = Record<string, ConciergeAnswer | undefined>

export type ConciergeConditionOperator =
  | 'equals'
  | 'not_equals'
  | 'includes'
  | 'one_of'
  | 'exists'
  | 'not_exists'

export type ConciergeCondition = {
  questionId: string
  operator: ConciergeConditionOperator
  value?: string | number | boolean | readonly string[]
}

export type ConciergeQuestionOption = {
  value: string
  label: string
  helpText?: string
}

export type ConciergeAnswerValidation = {
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  format?: 'email' | 'phone' | 'url' | 'integer' | 'positive_number'
  allowedValues?: readonly string[]
  customRule?:
    | 'written_authorization_required'
    | 'professional_email_preferred'
    | 'explicit_consent_required'
}

export type ConciergeNextStep =
  | string
  | {
      branches: readonly {
        condition: ConciergeCondition
        stepId: string
      }[]
      defaultStepId: string
    }
  | null

export type HumanReviewTrigger = {
  reason: string
  severity: 'review' | 'blocking'
  condition?: ConciergeCondition
}

export type ConciergeQuestion = {
  kind: 'question'
  id: string
  path: ConciergeQuestionPath
  section: string
  label: string
  prompt: string
  helpText?: string
  answerType: ConciergeAnswerType
  required: boolean
  options?: readonly ConciergeQuestionOption[]
  validation?: ConciergeAnswerValidation
  condition?: ConciergeCondition
  nextStep: ConciergeNextStep
  allowsFreeText: boolean
  sensitiveData: boolean
  sensitiveDataJustification?: string
  humanReviewTrigger?: HumanReviewTrigger
}

export type ConciergeSystemStepKind =
  | 'summary'
  | 'ready_to_submit'
  | 'complete'

export type ConciergeSystemStep = {
  kind: 'system'
  id: string
  path: ConciergeQuestionPath
  section: string
  stepType: ConciergeSystemStepKind
  nextStep: ConciergeNextStep
}

export type ConciergeStep = ConciergeQuestion | ConciergeSystemStep

export type ConciergeFlowDefinition = {
  id: string
  path: Exclude<ConciergePath, 'unknown'>
  label: string
  description: string
  startStepId: string
  exitStepId: string
  steps: readonly ConciergeStep[]
}

export type ConciergeInitialChoice = {
  id: string
  label: string
  path: Exclude<ConciergePath, 'unknown'>
  startStepId: string
}

export type ConciergeDefinition = {
  assistantName: 'Nova'
  schemaVersion: typeof CONCIERGE_SCHEMA_VERSION
  openingMessage: string
  initialChoices: readonly ConciergeInitialChoice[]
  sharedSteps: readonly ConciergeStep[]
  flows: readonly ConciergeFlowDefinition[]
}

export type ConciergeAttribution = {
  landingPath: string
  currentPath: string
  referrer: string
  referrerHost: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
  utmContent: string
  utmTerm: string
}

export type ConciergeContact = {
  fullName: string
  company: string
  role?: string
  professionalEmail: string
  phone?: string
  preferredContact?: 'email' | 'phone' | 'either'
}

export type ConsentRecord = {
  consentGranted: boolean
  consentTextVersion: string
  consentedAt: string | null
  privacyPolicyVersion: string
}

export type ConciergeConsent = {
  contact: ConsentRecord
  privacy: ConsentRecord
}

export type QualificationLevel =
  | 'insufficient'
  | 'exploratory'
  | 'relevant'
  | 'strong'

export type QualificationReadiness =
  | 'not_ready'
  | 'needs_clarification'
  | 'ready_for_human_review'
  | 'ready_for_contact'

export type QualificationResult = {
  path: ConciergePath
  completenessScore: number
  qualificationLevel: QualificationLevel
  readiness: QualificationReadiness
  positiveSignals: readonly string[]
  missingInformation: readonly string[]
  risks: readonly string[]
  recommendedNextAction: string
  humanReviewRequired: boolean
  reasons: readonly string[]
}

export type FieldProvenance =
  | 'declared'
  | 'inferred'
  | 'system_generated'

export type ProvenancedField<T> = {
  value: T
  provenance: FieldProvenance
  confidence?: number
  rationale?: string
  requiresHumanReview?: boolean
}

export type ConciergeSummary = {
  selectedPath: ProvenancedField<ConciergePath>
  company: ProvenancedField<string> | null
  contactRole: ProvenancedField<string> | null
  context: ProvenancedField<string> | null
  objective: ProvenancedField<string> | null
  currentSituation: ProvenancedField<string> | null
  target: ProvenancedField<string> | null
  mainNeed: ProvenancedField<string> | null
  constraints: readonly ProvenancedField<string>[]
  timeframe: ProvenancedField<string> | null
  indicativeBudget: ProvenancedField<string> | null
  positiveSignals: readonly ProvenancedField<string>[]
  uncertainties: readonly ProvenancedField<string>[]
  missingInformation: readonly ProvenancedField<string>[]
  humanReviewPoints: readonly ProvenancedField<string>[]
  recommendedNovekiaPole: ProvenancedField<
    'Lead Engine Studio' | 'Novekia Solutions' | 'À déterminer'
  >
  recommendedServiceCategory: ProvenancedField<string> | null
  recommendedNextAction: ProvenancedField<string>
}

export type ConciergeSessionError = {
  code: string
  message: string
  stepId?: string
  occurredAt: string
  recoverable: boolean
}

export type ConciergeAIAssistanceStatus =
  | 'idle'
  | 'requesting'
  | 'available'
  | 'fallback'
  | 'unavailable'
  | 'error'

export type ConciergeAIAssistanceState = {
  enabled: boolean
  disclosureAcknowledged: boolean
  status: ConciergeAIAssistanceStatus
  lastTask: import('./ai-contract').ConciergeAITask | null
  lastRequestId: string | null
  lastProvider: import('./ai-contract').ConciergeAIProviderName | null
  warnings: readonly string[]
}

export type ConciergeSession = {
  sessionId: string
  schemaVersion: typeof CONCIERGE_SCHEMA_VERSION
  status: ConciergeStatus
  activePath: ConciergePath
  currentStepId: string | null
  startedAt: string | null
  updatedAt: string
  completedAt: string | null
  sourcePage: string
  referrer: string
  attribution: ConciergeAttribution
  answers: ConciergeAnswers
  missingRequiredFields: readonly string[]
  completionScore: number
  qualificationResult: QualificationResult | null
  summary: ConciergeSummary | null
  contact: ConciergeContact | null
  consent: ConciergeConsent | null
  humanReviewRequired: boolean
  errors: readonly ConciergeSessionError[]
  aiAssistance: ConciergeAIAssistanceState
}

export type AnswerValidationResult = {
  valid: boolean
  errors: readonly string[]
}

export type FlowValidationIssue = {
  code:
    | 'duplicate_id'
    | 'missing_step_reference'
    | 'unreachable_exit'
    | 'cycle_detected'
    | 'consent_before_summary'
    | 'unjustified_sensitive_requirement'
    | 'missing_flow'
  message: string
  flowId?: string
  stepId?: string
}
