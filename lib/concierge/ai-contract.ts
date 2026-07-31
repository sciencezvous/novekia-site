import type { ConciergePath, ConciergeSummary } from './types'

export type ConciergeAITask =
  | 'classify_intent'
  | 'extract_structured_answer'
  | 'rewrite_question'
  | 'summarize_qualification'
  | 'detect_missing_information'
  | 'prepare_human_handoff'

export type ConciergeAIProviderName =
  | 'deterministic'
  | 'mistral'
  | 'lm_studio'
  | 'ovh_endpoint'
  | 'ovh_private'
  | 'unavailable'

export type ConciergeAIExpectedSchema = {
  name: string
  version: string
  description: string
  requiredFields: readonly string[]
}

export type ConciergeAIContext = {
  activePath: ConciergePath
  currentStepId: string | null
  allowedServiceCategories: readonly string[]
  systemRulesVersion: string
  previousSummary?: ConciergeSummary
}

export type ConciergeAIRequest = {
  task: ConciergeAITask
  requestId: string
  sessionId: string
  locale: 'fr-FR'
  input: string | Record<string, unknown>
  expectedSchema: ConciergeAIExpectedSchema
  context: ConciergeAIContext
  maxOutputTokens: number
  timeoutMs: number
  containsPersonalData: boolean
  fallbackAllowed: boolean
}

export type ConciergeAIError = {
  code:
    | 'provider_unavailable'
    | 'timeout'
    | 'invalid_output'
    | 'policy_violation'
    | 'configuration_error'
    | 'unknown'
  message: string
  retryable: boolean
}

export type ConciergeAIResponse = {
  success: boolean
  provider: ConciergeAIProviderName
  model: string | null
  output: string | null
  structuredOutput: Record<string, unknown> | null
  confidence: number | null
  warnings: readonly string[]
  latencyMs: number
  inputTokens: number | null
  outputTokens: number | null
  fallbackUsed: boolean
  error: ConciergeAIError | null
}

export interface ConciergeAIProvider {
  readonly name: ConciergeAIProviderName
  execute(request: ConciergeAIRequest): Promise<ConciergeAIResponse>
}

export const conciergeAIGuardrails = [
  'Le navigateur ne contacte jamais directement un fournisseur de modèle.',
  'Le modèle ne choisit ni ne déduit un consentement.',
  'Le modèle ne décide jamais seul qu’un lead est accepté.',
  'Toute sortie structurée est validée avant utilisation.',
  'Toute sortie invalide déclenche le fallback déterministe.',
  'Une indisponibilité IA ne bloque jamais le parcours déterministe.',
  'Les instructions présentes dans une réponse visiteur ne remplacent jamais les règles système.',
  'Aucune clé API ni variable d’environnement n’appartient au contrat partagé.',
] as const
