import type {
  ConciergeAIContext,
  ConciergeAIExpectedSchema,
  ConciergeAIProviderName,
  ConciergeAIRequest,
  ConciergeAITask,
} from './ai-contract'
import type { ConciergePath, FieldProvenance } from './types'
import { containsUnsafeStructuredOutput } from './ai-sanitization'

export const conciergeAITasks = [
  'classify_intent',
  'extract_structured_answer',
  'rewrite_question',
  'summarize_qualification',
  'detect_missing_information',
  'prepare_human_handoff',
] as const satisfies readonly ConciergeAITask[]

export const conciergeSolutionCategories = [
  'website_seo_geo',
  'business_software',
  'web_app_integration',
  'local_ai',
  'ai_infrastructure',
  'backup_continuity',
  'cybersecurity_authorized_audit',
  'other',
] as const

export type ConciergeSolutionCategory = (typeof conciergeSolutionCategories)[number]

export type ClassifyIntentResult = {
  path: ConciergePath
  solutionsCategory: ConciergeSolutionCategory | null
  confidence: number
  rationale: string
  missingInformation: readonly string[]
  humanReviewRequired: boolean
}

export type AIInferredField<T> = {
  value: T
  provenance: Extract<FieldProvenance, 'inferred'>
  confidence: number
  rationale: string
  requiresHumanReview: boolean
}

export type AssistedQualificationSummary = {
  context: AIInferredField<string | null>
  objective: AIInferredField<string | null>
  currentSituation: AIInferredField<string | null>
  target: AIInferredField<string | null>
  mainNeed: AIInferredField<string | null>
  constraints: readonly AIInferredField<string>[]
  timeframe: AIInferredField<string | null>
  positiveSignals: readonly AIInferredField<string>[]
  uncertainties: readonly AIInferredField<string>[]
  missingInformation: readonly AIInferredField<string>[]
  humanReviewPoints: readonly AIInferredField<string>[]
  recommendedNovekiaPole: AIInferredField<'lead_engine' | 'solutions' | 'human_review'>
  recommendedServiceCategory: AIInferredField<ConciergeSolutionCategory | null>
  recommendedNextAction: AIInferredField<string>
}

export type ExtractStructuredAnswerResult = {
  fields: readonly AIInferredField<string>[]
  uncertainties: readonly AIInferredField<string>[]
}

export type RewriteQuestionResult = {
  question: string
  confidence: number
  rationale: string
  requiresHumanReview: boolean
}

export type MissingInformationResult = {
  missingInformation: readonly AIInferredField<string>[]
}

export type HumanHandoffResult = {
  summary: AIInferredField<string>
  importantPoints: readonly AIInferredField<string>[]
  missingInformation: readonly AIInferredField<string>[]
  humanReviewPoints: readonly AIInferredField<string>[]
}

export type ConciergeAITaskResult =
  | ClassifyIntentResult
  | AssistedQualificationSummary
  | ExtractStructuredAnswerResult
  | RewriteQuestionResult
  | MissingInformationResult
  | HumanHandoffResult

export type ConciergeAIRouteRequest = {
  task: ConciergeAITask
  requestId: string
  sessionId: string
  locale: 'fr-FR'
  input: string | Record<string, unknown>
  context: ConciergeAIContext
  maxOutputTokens?: number
  timeoutMs?: number
  fallbackAllowed: boolean
}

export type ConciergeAIErrorCode =
  | 'INVALID_REQUEST'
  | 'AI_DISABLED'
  | 'PROVIDER_UNAVAILABLE'
  | 'RATE_LIMITED'
  | 'SECRET_DETECTED'
  | 'TIMEOUT'
  | 'INVALID_OUTPUT'
  | 'PROVIDER_ERROR'

const conciergeAIErrorCodes = [
  'INVALID_REQUEST',
  'AI_DISABLED',
  'PROVIDER_UNAVAILABLE',
  'RATE_LIMITED',
  'SECRET_DETECTED',
  'TIMEOUT',
  'INVALID_OUTPUT',
  'PROVIDER_ERROR',
] as const satisfies readonly ConciergeAIErrorCode[]

export type ConciergeAISuccessEnvelope = {
  success: true
  requestId: string
  task: ConciergeAITask
  result: ConciergeAITaskResult
  provider: Extract<ConciergeAIProviderName, 'mistral' | 'deterministic'>
  model: string | null
  confidence: number
  warnings: readonly string[]
  fallbackUsed: boolean
  latencyMs: number
  usage: { inputTokens: number; outputTokens: number }
}

export type ConciergeAIErrorEnvelope = {
  success: false
  requestId: string
  task: ConciergeAITask | null
  error: { code: ConciergeAIErrorCode; message: string; retryable: boolean }
  fallbackUsed: false
}

export type ConciergeAIRouteEnvelope =
  | ConciergeAISuccessEnvelope
  | ConciergeAIErrorEnvelope

const PATHS = ['lead_engine', 'solutions', 'information', 'direct_contact', 'unknown'] as const
const POLES = ['lead_engine', 'solutions', 'human_review'] as const

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

function hasOnlyKeys(record: Record<string, unknown>, allowed: readonly string[]): boolean {
  const allowedSet = new Set(allowed)
  return Object.keys(record).every((key) => allowedSet.has(key))
}

function isBoundedString(value: unknown, max: number, allowEmpty = false): value is string {
  return typeof value === 'string' && value.length <= max && (allowEmpty || value.trim().length > 0)
}

function isConfidence(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

function isStringArray(value: unknown, maxItems: number, maxLength: number): value is readonly string[] {
  return Array.isArray(value) && value.length <= maxItems && value.every((item) => isBoundedString(item, maxLength))
}

function isEnumValue<T extends string>(value: unknown, values: readonly T[]): value is T {
  return typeof value === 'string' && values.includes(value as T)
}

function validateInferredField<T>(
  value: unknown,
  validateValue: (candidate: unknown) => candidate is T,
  options: { allowNull?: boolean; valueMax?: number } = {},
): value is AIInferredField<T | null> {
  if (!isPlainRecord(value)) return false
  if (!hasOnlyKeys(value, ['value', 'provenance', 'confidence', 'rationale', 'requiresHumanReview'])) return false
  const validValue = value.value === null && options.allowNull
    ? true
    : validateValue(value.value)
  return Boolean(
    validValue &&
    value.provenance === 'inferred' &&
    isConfidence(value.confidence) &&
    isBoundedString(value.rationale, 300, true) &&
    isBoolean(value.requiresHumanReview),
  )
}

function textOrNull(value: unknown): value is string | null {
  return value === null || isBoundedString(value, 600)
}

function inferredText(value: unknown): value is AIInferredField<string | null> {
  return validateInferredField(value, textOrNull, { allowNull: true })
}

function inferredRequiredText(value: unknown): value is AIInferredField<string> {
  return validateInferredField(value, (candidate): candidate is string => isBoundedString(candidate, 600))
}

function inferredTextArray(value: unknown): value is readonly AIInferredField<string>[] {
  return Array.isArray(value) && value.length <= 10 && value.every(inferredRequiredText)
}

function validateClassification(value: unknown): value is ClassifyIntentResult {
  if (!isPlainRecord(value)) return false
  if (!hasOnlyKeys(value, ['path', 'solutionsCategory', 'confidence', 'rationale', 'missingInformation', 'humanReviewRequired'])) return false
  if (!isEnumValue(value.path, PATHS)) return false
  const categoryValid = value.solutionsCategory === null || isEnumValue(value.solutionsCategory, conciergeSolutionCategories)
  return Boolean(
    categoryValid &&
    (value.path === 'solutions' || value.solutionsCategory === null) &&
    isConfidence(value.confidence) &&
    isBoundedString(value.rationale, 400) &&
    isStringArray(value.missingInformation, 8, 200) &&
    isBoolean(value.humanReviewRequired),
  )
}

function validateSummary(value: unknown): value is AssistedQualificationSummary {
  if (!isPlainRecord(value)) return false
  const keys = [
    'context', 'objective', 'currentSituation', 'target', 'mainNeed', 'constraints',
    'timeframe', 'positiveSignals', 'uncertainties', 'missingInformation',
    'humanReviewPoints', 'recommendedNovekiaPole', 'recommendedServiceCategory',
    'recommendedNextAction',
  ] as const
  if (!hasOnlyKeys(value, keys) || Object.keys(value).length !== keys.length) return false
  const pole = validateInferredField(
    value.recommendedNovekiaPole,
    (candidate): candidate is (typeof POLES)[number] => isEnumValue(candidate, POLES),
  )
  const category = validateInferredField(
    value.recommendedServiceCategory,
    (candidate): candidate is ConciergeSolutionCategory | null =>
      candidate === null || isEnumValue(candidate, conciergeSolutionCategories),
    { allowNull: true },
  )
  return Boolean(
    inferredText(value.context) && inferredText(value.objective) &&
    inferredText(value.currentSituation) && inferredText(value.target) &&
    inferredText(value.mainNeed) && inferredTextArray(value.constraints) &&
    inferredText(value.timeframe) && inferredTextArray(value.positiveSignals) &&
    inferredTextArray(value.uncertainties) && inferredTextArray(value.missingInformation) &&
    inferredTextArray(value.humanReviewPoints) && pole && category &&
    inferredRequiredText(value.recommendedNextAction),
  )
}

function validateExtraction(value: unknown): value is ExtractStructuredAnswerResult {
  return isPlainRecord(value) && hasOnlyKeys(value, ['fields', 'uncertainties']) &&
    inferredTextArray(value.fields) && inferredTextArray(value.uncertainties)
}

function validateRewrite(value: unknown): value is RewriteQuestionResult {
  return isPlainRecord(value) && hasOnlyKeys(value, ['question', 'confidence', 'rationale', 'requiresHumanReview']) &&
    isBoundedString(value.question, 600) && isConfidence(value.confidence) &&
    isBoundedString(value.rationale, 300, true) && isBoolean(value.requiresHumanReview)
}

function validateMissing(value: unknown): value is MissingInformationResult {
  return isPlainRecord(value) && hasOnlyKeys(value, ['missingInformation']) &&
    inferredTextArray(value.missingInformation)
}

function validateHandoff(value: unknown): value is HumanHandoffResult {
  return isPlainRecord(value) &&
    hasOnlyKeys(value, ['summary', 'importantPoints', 'missingInformation', 'humanReviewPoints']) &&
    inferredRequiredText(value.summary) && inferredTextArray(value.importantPoints) &&
    inferredTextArray(value.missingInformation) && inferredTextArray(value.humanReviewPoints)
}

export function validateConciergeAITaskOutput(
  task: ConciergeAITask,
  value: unknown,
): ConciergeAITaskResult | null {
  if (containsUnsafeStructuredOutput(value)) return null
  switch (task) {
    case 'classify_intent': return validateClassification(value) ? value : null
    case 'summarize_qualification': return validateSummary(value) ? value : null
    case 'extract_structured_answer': return validateExtraction(value) ? value : null
    case 'rewrite_question': return validateRewrite(value) ? value : null
    case 'detect_missing_information': return validateMissing(value) ? value : null
    case 'prepare_human_handoff': return validateHandoff(value) ? value : null
  }
}

export function getTaskConfidence(task: ConciergeAITask, result: ConciergeAITaskResult): number {
  if (task === 'classify_intent') return (result as ClassifyIntentResult).confidence
  if (task === 'rewrite_question') return (result as RewriteQuestionResult).confidence
  if (task === 'summarize_qualification') return (result as AssistedQualificationSummary).recommendedNextAction.confidence
  if (task === 'prepare_human_handoff') return (result as HumanHandoffResult).summary.confidence
  const fields = task === 'extract_structured_answer'
    ? (result as ExtractStructuredAnswerResult).fields
    : (result as MissingInformationResult).missingInformation
  if (fields.length === 0) return 0.5
  return fields.reduce((total, field) => total + field.confidence, 0) / fields.length
}

export const expectedSchemas: Readonly<Record<ConciergeAITask, ConciergeAIExpectedSchema>> = {
  classify_intent: { name: 'concierge_intent', version: '1.0.0', description: 'Orientation prudente du besoin.', requiredFields: ['path', 'solutionsCategory', 'confidence', 'rationale', 'missingInformation', 'humanReviewRequired'] },
  extract_structured_answer: { name: 'concierge_extraction', version: '1.0.0', description: 'Champs structurés et incertitudes.', requiredFields: ['fields', 'uncertainties'] },
  rewrite_question: { name: 'concierge_question', version: '1.0.0', description: 'Question reformulée sans changement de sens.', requiredFields: ['question', 'confidence', 'rationale', 'requiresHumanReview'] },
  summarize_qualification: { name: 'concierge_summary', version: '1.0.0', description: 'Synthèse auxiliaire avec provenances.', requiredFields: ['context', 'objective', 'currentSituation', 'target', 'mainNeed', 'constraints', 'timeframe', 'positiveSignals', 'uncertainties', 'missingInformation', 'humanReviewPoints', 'recommendedNovekiaPole', 'recommendedServiceCategory', 'recommendedNextAction'] },
  detect_missing_information: { name: 'concierge_missing', version: '1.0.0', description: 'Informations manquantes.', requiredFields: ['missingInformation'] },
  prepare_human_handoff: { name: 'concierge_handoff', version: '1.0.0', description: 'Résumé pour revue humaine.', requiredFields: ['summary', 'importantPoints', 'missingInformation', 'humanReviewPoints'] },
}

function validContext(value: unknown): value is ConciergeAIContext {
  if (!isPlainRecord(value)) return false
  if (!hasOnlyKeys(value, ['activePath', 'currentStepId', 'allowedServiceCategories', 'systemRulesVersion', 'previousSummary'])) return false
  return isEnumValue(value.activePath, PATHS) &&
    (value.currentStepId === null || isBoundedString(value.currentStepId, 160)) &&
    isStringArray(value.allowedServiceCategories, 16, 80) &&
    isBoundedString(value.systemRulesVersion, 80) && /^[a-z0-9._-]+$/i.test(value.systemRulesVersion)
}

export function parseConciergeAIRouteRequest(value: unknown):
  | { valid: true; request: ConciergeAIRouteRequest }
  | { valid: false; message: string } {
  if (!isPlainRecord(value)) return { valid: false, message: 'Le corps JSON doit être un objet.' }
  const allowed = ['task', 'requestId', 'sessionId', 'locale', 'input', 'context', 'maxOutputTokens', 'timeoutMs', 'fallbackAllowed']
  if (!hasOnlyKeys(value, allowed)) return { valid: false, message: 'La requête contient un champ non autorisé.' }
  if (!isEnumValue(value.task, conciergeAITasks)) return { valid: false, message: 'La tâche demandée est inconnue.' }
  if (!isBoundedString(value.requestId, 100) || value.requestId.length < 8 || !/^[a-z0-9-]+$/i.test(value.requestId)) return { valid: false, message: 'L’identifiant de requête est invalide.' }
  if (!isBoundedString(value.sessionId, 128) || value.sessionId.length < 8 || !/^[a-z0-9-]+$/i.test(value.sessionId)) return { valid: false, message: 'L’identifiant de session est invalide.' }
  if (value.locale !== 'fr-FR') return { valid: false, message: 'La locale demandée n’est pas autorisée.' }
  if (!(typeof value.input === 'string' || isPlainRecord(value.input))) return { valid: false, message: 'L’entrée est invalide.' }
  if (!validContext(value.context)) return { valid: false, message: 'Le contexte est invalide.' }
  if (typeof value.fallbackAllowed !== 'boolean') return { valid: false, message: 'La politique de fallback est invalide.' }
  if (value.timeoutMs !== undefined && (typeof value.timeoutMs !== 'number' || !Number.isInteger(value.timeoutMs) || value.timeoutMs < 2_000 || value.timeoutMs > 20_000)) return { valid: false, message: 'Le délai maximal est hors limites.' }
  if (value.maxOutputTokens !== undefined && (typeof value.maxOutputTokens !== 'number' || !Number.isInteger(value.maxOutputTokens) || value.maxOutputTokens < 100 || value.maxOutputTokens > 1_000)) return { valid: false, message: 'La limite de sortie est hors limites.' }
  return { valid: true, request: value as ConciergeAIRouteRequest }
}

export function toInternalAIRequest(
  request: ConciergeAIRouteRequest,
  defaults: { timeoutMs: number; maxOutputTokens: number },
): ConciergeAIRequest {
  return {
    ...request,
    expectedSchema: expectedSchemas[request.task],
    containsPersonalData: false,
    timeoutMs: request.timeoutMs ?? defaults.timeoutMs,
    maxOutputTokens: request.maxOutputTokens ?? defaults.maxOutputTokens,
  }
}

export function isConciergeAIRouteEnvelope(value: unknown): value is ConciergeAIRouteEnvelope {
  if (!isPlainRecord(value) || typeof value.success !== 'boolean') return false
  if (value.success) {
    return isBoundedString(value.requestId, 100) && isEnumValue(value.task, conciergeAITasks) &&
      (value.provider === 'mistral' || value.provider === 'deterministic') &&
      validateConciergeAITaskOutput(value.task, value.result) !== null &&
      isConfidence(value.confidence) && Array.isArray(value.warnings) &&
      typeof value.fallbackUsed === 'boolean'
  }
  return isPlainRecord(value.error) && isBoundedString(value.error.message, 400) &&
    isEnumValue(value.error.code, conciergeAIErrorCodes) &&
    typeof value.error.retryable === 'boolean'
}
