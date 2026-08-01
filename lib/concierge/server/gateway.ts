import type {
  ConciergeAIRequest,
  ConciergeAIResponse,
} from '../ai-contract'
import {
  DeterministicConciergeAIProvider,
  MistralConciergeAIProvider,
} from '../providers'
import { classifyConciergeIntent } from '../providers/deterministic-provider'
import type { ClassifyIntentResult } from '../ai-schemas'
import type { ConciergeAIGatewayConfig } from './gateway-config'
import { getConciergeAIGatewayConfig } from './gateway-config'
import { validateProviderResponse } from './response-validation'
import { conciergeAITaskPolicies } from './task-policy'

type FetchImplementation = typeof fetch
const SEMANTIC_OVERRIDE_CONFIDENCE = 0.7

function unavailableResponse(
  config: ConciergeAIGatewayConfig,
  message: string,
): ConciergeAIResponse {
  return {
    success: false,
    provider: 'unavailable',
    model: null,
    output: null,
    structuredOutput: null,
    confidence: null,
    warnings: [],
    latencyMs: 0,
    inputTokens: null,
    outputTokens: null,
    fallbackUsed: false,
    error: {
      code: config.explicitlyDisabled ? 'configuration_error' : 'provider_unavailable',
      message,
      retryable: !config.explicitlyDisabled,
    },
  }
}

async function executeFallback(
  request: ConciergeAIRequest,
  warnings: readonly string[] = [],
): Promise<ConciergeAIResponse> {
  const response = await new DeterministicConciergeAIProvider().execute(request)
  return warnings.length > 0
    ? { ...response, warnings: [...response.warnings, ...warnings] }
    : response
}

function semanticDisagreementResponse(
  request: ConciergeAIRequest,
  deterministic: ClassifyIntentResult,
  mistral: ConciergeAIResponse,
): ConciergeAIResponse {
  const mistralIntent = mistral.structuredOutput as unknown as ClassifyIntentResult
  console.warn('[concierge-ai] mistral_semantic_disagreement', {
    requestId: request.requestId,
    task: request.task,
    deterministicPath: deterministic.path,
    mistralPath: mistralIntent.path,
    deterministicConfidence: deterministic.confidence,
    mistralConfidence: mistral.confidence,
    model: mistral.model,
  })
  return {
    success: true,
    provider: 'deterministic',
    model: null,
    output: null,
    structuredOutput: deterministic as unknown as Record<string, unknown>,
    confidence: deterministic.confidence,
    warnings: ['mistral_semantic_disagreement'],
    latencyMs: mistral.latencyMs,
    inputTokens: null,
    outputTokens: null,
    fallbackUsed: true,
    error: null,
  }
}

export async function executeConciergeAI(
  request: ConciergeAIRequest,
  options: {
    config?: ConciergeAIGatewayConfig
    fetchImpl?: FetchImplementation
  } = {},
): Promise<ConciergeAIResponse> {
  const config = options.config ?? getConciergeAIGatewayConfig()
  const policy = conciergeAITaskPolicies[request.task]
  const deterministicIntent = request.task === 'classify_intent'
    ? classifyConciergeIntent(request)
    : null

  if (!config.mistralEnabled) {
    if (request.fallbackAllowed && policy.fallbackSupported) {
      return executeFallback(
        request,
        [config.explicitlyDisabled
          ? 'L’assistance externe est désactivée côté serveur.'
          : 'Aucune clé fournisseur n’est configurée.'],
      )
    }
    return unavailableResponse(
      config,
      config.explicitlyDisabled
        ? 'L’assistance IA est désactivée.'
        : 'Aucun fournisseur IA n’est disponible.',
    )
  }

  const provider = new MistralConciergeAIProvider(config, options.fetchImpl)
  const initial = validateProviderResponse(request.task, await provider.execute(request))
  if (
    deterministicIntent &&
    deterministicIntent.path !== 'unknown' &&
    deterministicIntent.confidence >= SEMANTIC_OVERRIDE_CONFIDENCE &&
    initial.success &&
    initial.structuredOutput
  ) {
    const mistralIntent = initial.structuredOutput as unknown as ClassifyIntentResult
    if (mistralIntent.path !== deterministicIntent.path) {
      return semanticDisagreementResponse(request, deterministicIntent, initial)
    }
  }
  const lowConfidence = initial.success &&
    (initial.confidence ?? 0) < policy.minimumConfidence

  if (initial.success && !lowConfidence) return initial
  if (!request.fallbackAllowed || !policy.fallbackSupported) {
    return lowConfidence
      ? {
          ...initial,
          success: false,
          structuredOutput: null,
          confidence: null,
          warnings: ['mistral_low_confidence', ...initial.warnings],
          error: {
            code: 'invalid_output',
            message: 'La confiance de la réponse est insuffisante.',
            retryable: false,
          },
        }
      : initial
  }

  const warnings = lowConfidence
    ? ['mistral_low_confidence', ...initial.warnings]
    : initial.warnings.filter((warning) => warning.startsWith('mistral_'))
  return executeFallback(request, warnings)
}
