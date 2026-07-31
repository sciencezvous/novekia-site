import { NextRequest, NextResponse } from 'next/server'
import {
  MAX_AI_REQUEST_BYTES,
  inspectAIRequestPayload,
  stripUrlQueryStrings,
} from '@/lib/concierge/ai-sanitization'
import {
  getTaskConfidence,
  parseConciergeAIRouteRequest,
  toInternalAIRequest,
  validateConciergeAITaskOutput,
  type ConciergeAIErrorCode,
  type ConciergeAIErrorEnvelope,
  type ConciergeAIRouteEnvelope,
  type ConciergeAITaskResult,
} from '@/lib/concierge/ai-schemas'
import {
  acquireConciergeAIRateLimit,
  getEphemeralClientAddress,
} from '@/lib/concierge/ai-rate-limit'
import { executeConciergeAI } from '@/lib/concierge/server/gateway'
import { getConciergeAIGatewayConfig } from '@/lib/concierge/server/gateway-config'
import type { ConciergeAIError, ConciergeAITask } from '@/lib/concierge/ai-contract'

const RESPONSE_HEADERS = {
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
} as const

const MISTRAL_DIAGNOSTICS = [
  'mistral_http_error',
  'mistral_timeout',
  'mistral_invalid_envelope',
  'mistral_invalid_json',
  'mistral_schema_rejected',
  'mistral_truncated',
  'mistral_low_confidence',
] as const

type MistralDiagnostic = typeof MISTRAL_DIAGNOSTICS[number]

type MistralEnvelopeShape = {
  choiceKeys: string[]
  hasMessage: boolean
  hasMessages: boolean
  messageKeys: string[]
  contentKind: 'string' | 'array' | 'null' | 'missing' | 'other'
  contentBlockTypes: string[]
  toolCallsKind: 'missing' | 'null' | 'empty_array' | 'non_empty_array' | 'other'
  finishReason: 'stop' | 'length' | 'unexpected' | null
}

function warningValue(warnings: readonly string[], prefix: string): string | null {
  const warning = warnings.find((value) => value.startsWith(prefix))
  return warning ? warning.slice(prefix.length) : null
}

function safeMistralDiagnostic(warnings: readonly string[]): MistralDiagnostic | null {
  return MISTRAL_DIAGNOSTICS.find((diagnostic) => warnings.includes(diagnostic)) ?? null
}

function safeShapeStrings(value: unknown): value is string[] {
  return Array.isArray(value) && value.length <= 32 && value.every((item) =>
    typeof item === 'string' && /^[a-z0-9_-]{1,64}$/i.test(item))
}

function readEnvelopeShape(warnings: readonly string[]): MistralEnvelopeShape | null {
  const encoded = warningValue(warnings, 'mistral_envelope_shape:')
  if (!encoded) return null
  try {
    const value = JSON.parse(decodeURIComponent(encoded)) as Record<string, unknown>
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null
    if (!safeShapeStrings(value.choiceKeys) || !safeShapeStrings(value.messageKeys) ||
      !safeShapeStrings(value.contentBlockTypes)) return null
    if (typeof value.hasMessage !== 'boolean' || typeof value.hasMessages !== 'boolean') return null
    if (!['string', 'array', 'null', 'missing', 'other'].includes(String(value.contentKind))) return null
    if (!['missing', 'null', 'empty_array', 'non_empty_array', 'other'].includes(String(value.toolCallsKind))) return null
    if (!(value.finishReason === null || value.finishReason === 'stop' ||
      value.finishReason === 'length' || value.finishReason === 'unexpected')) return null
    return value as MistralEnvelopeShape
  } catch {
    return null
  }
}

function logMistralFailure(
  requestId: string,
  task: ConciergeAITask,
  warnings: readonly string[],
  model: string,
  diagnosticOverride?: MistralDiagnostic,
) {
  const diagnostic = diagnosticOverride ?? safeMistralDiagnostic(warnings)
  if (!diagnostic) return

  const rawStatus = warningValue(warnings, 'mistral_upstream_status:')
  const parsedStatus = rawStatus === null || rawStatus === 'none' ? null : Number(rawStatus)
  const upstreamStatus = parsedStatus !== null && Number.isInteger(parsedStatus) && parsedStatus >= 100 && parsedStatus <= 599
    ? parsedStatus
    : null
  const rawFinishReason = warningValue(warnings, 'mistral_finish_reason:')
  const finishReason = rawFinishReason === 'stop' || rawFinishReason === 'length' || rawFinishReason === 'unexpected'
    ? rawFinishReason
    : null

  if (diagnostic === 'mistral_invalid_envelope') {
    console.warn('[concierge-ai] mistral_invalid_envelope', readEnvelopeShape(warnings) ?? {
      choiceKeys: [],
      hasMessage: false,
      hasMessages: false,
      messageKeys: [],
      contentKind: 'missing',
      contentBlockTypes: [],
      toolCallsKind: 'missing',
      finishReason,
    })
    return
  }

  console.warn('[concierge-ai]', {
    requestId,
    task,
    provider: 'mistral',
    diagnostic,
    upstreamStatus,
    finishReason,
    model,
  })
}

function publicWarnings(warnings: readonly string[]): readonly string[] {
  return warnings.filter((warning) => !warning.startsWith('mistral_'))
}

function jsonResponse(body: ConciergeAIRouteEnvelope, status: number) {
  return NextResponse.json(body, { status, headers: RESPONSE_HEADERS })
}

function errorResponse(
  requestId: string,
  task: ConciergeAITask | null,
  code: ConciergeAIErrorCode,
  message: string,
  status: number,
  retryable = false,
) {
  const body: ConciergeAIErrorEnvelope = {
    success: false,
    requestId,
    task,
    error: { code, message, retryable },
    fallbackUsed: false,
  }
  return jsonResponse(body, status)
}

function originAllowed(origin: string | null): boolean {
  if (!origin) return true
  try {
    const parsed = new URL(origin)
    if (parsed.username || parsed.password) return false
    if (parsed.protocol === 'https:' && (parsed.hostname === 'novekia.fr' || parsed.hostname === 'www.novekia.fr')) return true
    if (parsed.protocol === 'http:' && (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1')) return true
    return parsed.protocol === 'https:' &&
      parsed.hostname.endsWith('.vercel.app') &&
      /^(?:novekia|novekia-site)(?:-[a-z0-9]+)*\.vercel\.app$/.test(parsed.hostname)
  } catch {
    return false
  }
}

function mapProviderError(error: ConciergeAIError | null, explicitlyDisabled: boolean): {
  code: ConciergeAIErrorCode
  status: number
  retryable: boolean
} {
  if (explicitlyDisabled) return { code: 'AI_DISABLED', status: 503, retryable: false }
  switch (error?.code) {
    case 'timeout': return { code: 'TIMEOUT', status: 503, retryable: true }
    case 'invalid_output': return { code: 'INVALID_OUTPUT', status: 502, retryable: false }
    case 'rate_limited': return { code: 'RATE_LIMITED', status: 429, retryable: true }
    case 'provider_unavailable': return { code: 'PROVIDER_UNAVAILABLE', status: 503, retryable: true }
    default: return { code: 'PROVIDER_ERROR', status: 502, retryable: Boolean(error?.retryable) }
  }
}

export async function POST(request: NextRequest) {
  const serverRequestId = crypto.randomUUID()
  if (!originAllowed(request.headers.get('origin'))) {
    return errorResponse(serverRequestId, null, 'INVALID_REQUEST', 'L’origine de la requête n’est pas autorisée.', 403)
  }

  const contentType = request.headers.get('content-type')?.toLowerCase() ?? ''
  if (!contentType.startsWith('application/json')) {
    return errorResponse(serverRequestId, null, 'INVALID_REQUEST', 'Le contenu doit être envoyé en JSON.', 415)
  }

  const declaredLength = Number(request.headers.get('content-length') ?? 0)
  if (Number.isFinite(declaredLength) && declaredLength > MAX_AI_REQUEST_BYTES) {
    return errorResponse(serverRequestId, null, 'INVALID_REQUEST', 'La requête est trop volumineuse.', 413)
  }

  const lease = acquireConciergeAIRateLimit(getEphemeralClientAddress(request.headers))
  if (!lease.allowed) {
    return errorResponse(serverRequestId, null, 'RATE_LIMITED', 'Trop de demandes ont été effectuées. Réessayez plus tard.', 429, true)
  }

  try {
    let rawBody: string
    try {
      rawBody = await request.text()
    } catch {
      return errorResponse(serverRequestId, null, 'INVALID_REQUEST', 'Le corps de la requête est illisible.', 400)
    }
    if (new TextEncoder().encode(rawBody).byteLength > MAX_AI_REQUEST_BYTES) {
      return errorResponse(serverRequestId, null, 'INVALID_REQUEST', 'La requête est trop volumineuse.', 413)
    }

    let payload: unknown
    try {
      payload = JSON.parse(rawBody)
    } catch {
      return errorResponse(serverRequestId, null, 'INVALID_REQUEST', 'Le JSON transmis est invalide.', 400)
    }

    const inspection = inspectAIRequestPayload(payload)
    if (!inspection.valid) {
      const code = inspection.code === 'SECRET_DETECTED' ? 'SECRET_DETECTED' : 'INVALID_REQUEST'
      return errorResponse(serverRequestId, null, code, inspection.message, 400)
    }
    const parsed = parseConciergeAIRouteRequest(payload)
    if (!parsed.valid) {
      return errorResponse(serverRequestId, null, 'INVALID_REQUEST', parsed.message, 400)
    }

    const config = getConciergeAIGatewayConfig()
    const internalRequest = toInternalAIRequest(
      {
        ...parsed.request,
        requestId: serverRequestId,
        input: stripUrlQueryStrings(parsed.request.input),
        context: stripUrlQueryStrings(parsed.request.context),
      },
      config,
    )
    const response = await executeConciergeAI(internalRequest, { config })
    if (!response.success || !response.structuredOutput) {
      logMistralFailure(
        serverRequestId,
        internalRequest.task,
        response.warnings,
        config.mistralModel,
      )
      const mapped = mapProviderError(response.error, config.explicitlyDisabled)
      return errorResponse(
        serverRequestId,
        internalRequest.task,
        mapped.code,
        mapped.code === 'AI_DISABLED'
          ? 'L’assistance IA est désactivée. Le parcours reste disponible sans elle.'
          : 'L’assistance avancée n’est pas disponible pour le moment. Le cadrage déterministe reste utilisable.',
        mapped.status,
        mapped.retryable,
      )
    }

    const result = validateConciergeAITaskOutput(internalRequest.task, response.structuredOutput)
    if (!result) {
      if (response.provider === 'mistral') {
        logMistralFailure(
          serverRequestId,
          internalRequest.task,
          response.warnings,
          config.mistralModel,
          'mistral_schema_rejected',
        )
      }
      return errorResponse(serverRequestId, internalRequest.task, 'INVALID_OUTPUT', 'La réponse assistée n’a pas pu être validée.', 502)
    }
    const provider = response.provider === 'mistral' ? 'mistral' : 'deterministic'
    return jsonResponse({
      success: true,
      requestId: serverRequestId,
      task: internalRequest.task,
      result: result as ConciergeAITaskResult,
      provider,
      model: response.model,
      confidence: response.confidence ?? getTaskConfidence(internalRequest.task, result),
      warnings: publicWarnings(response.warnings),
      fallbackUsed: response.fallbackUsed,
      latencyMs: response.latencyMs,
      usage: {
        inputTokens: response.inputTokens ?? 0,
        outputTokens: response.outputTokens ?? 0,
      },
    }, 200)
  } finally {
    lease.release()
  }
}

function methodNotAllowed() {
  return errorResponse(crypto.randomUUID(), null, 'INVALID_REQUEST', 'Méthode non autorisée.', 405)
}

export const GET = methodNotAllowed
export const PUT = methodNotAllowed
export const PATCH = methodNotAllowed
export const DELETE = methodNotAllowed
export const OPTIONS = methodNotAllowed
