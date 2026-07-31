import type {
  ConciergeAIProvider,
  ConciergeAIRequest,
  ConciergeAIResponse,
} from '../ai-contract'
import { buildMistralMessages, getTaskTemperature } from '../ai-prompts'
import {
  getMistralJsonSchema,
  getTaskConfidence,
  validateConciergeAITaskOutput,
} from '../ai-schemas'
import type { ConciergeAIGatewayConfig } from '../server/gateway-config'

type FetchImplementation = typeof fetch

const MAX_PROVIDER_RESPONSE_BYTES = 128 * 1024
const MAX_MODEL_CONTENT_CHARACTERS = 20_000

export type MistralDiagnosticCode =
  | 'mistral_http_error'
  | 'mistral_timeout'
  | 'mistral_invalid_envelope'
  | 'mistral_invalid_json'
  | 'mistral_schema_rejected'
  | 'mistral_truncated'
  | 'mistral_low_confidence'

type MistralFinishReason = 'stop' | 'length' | 'unexpected'

export type MistralEnvelopeShape = {
  choiceKeys: string[]
  hasMessage: boolean
  hasMessages: boolean
  messageKeys: string[]
  contentKind: 'string' | 'array' | 'null' | 'missing' | 'other'
  contentBlockTypes: string[]
  toolCallsKind: 'missing' | 'null' | 'empty_array' | 'non_empty_array' | 'other'
  finishReason: MistralFinishReason | null
}

function diagnosticWarnings(
  diagnostic: MistralDiagnosticCode,
  upstreamStatus: number | null,
  finishReason: MistralFinishReason | null,
  envelopeShape?: MistralEnvelopeShape,
): string[] {
  const warnings = [
    diagnostic,
    ...responseMetadataWarnings(upstreamStatus, finishReason),
  ]
  if (diagnostic === 'mistral_invalid_envelope' && envelopeShape) {
    warnings.push(`mistral_envelope_shape:${encodeURIComponent(JSON.stringify(envelopeShape))}`)
  }
  return warnings
}

function responseMetadataWarnings(
  upstreamStatus: number | null,
  finishReason: MistralFinishReason | null,
): string[] {
  return [
    `mistral_upstream_status:${upstreamStatus ?? 'none'}`,
    `mistral_finish_reason:${finishReason ?? 'none'}`,
  ]
}

function failedResponse(
  startedAt: number,
  code: NonNullable<ConciergeAIResponse['error']>['code'],
  message: string,
  retryable: boolean,
  diagnostic?: MistralDiagnosticCode,
  upstreamStatus: number | null = null,
  finishReason: MistralFinishReason | null = null,
  envelopeShape?: MistralEnvelopeShape,
): ConciergeAIResponse {
  return {
    success: false,
    provider: 'mistral',
    model: null,
    output: null,
    structuredOutput: null,
    confidence: null,
    warnings: diagnostic ? diagnosticWarnings(diagnostic, upstreamStatus, finishReason, envelopeShape) : [],
    latencyMs: Date.now() - startedAt,
    inputTokens: null,
    outputTokens: null,
    fallbackUsed: false,
    error: { code, message, retryable },
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function readUsage(value: unknown): { inputTokens: number | null; outputTokens: number | null } {
  if (!isRecord(value)) return { inputTokens: null, outputTokens: null }
  const prompt = value.prompt_tokens
  const completion = value.completion_tokens
  return {
    inputTokens: typeof prompt === 'number' && Number.isFinite(prompt) ? prompt : null,
    outputTokens: typeof completion === 'number' && Number.isFinite(completion) ? completion : null,
  }
}

function hasInvalidToolCalls(message: Record<string, unknown>): boolean {
  const toolCalls = message.tool_calls
  return toolCalls !== undefined &&
    toolCalls !== null &&
    (!Array.isArray(toolCalls) || toolCalls.length > 0)
}

function selectModelMessage(choice: Record<string, unknown>): Record<string, unknown> | null {
  if (choice.message !== undefined) {
    return isRecord(choice.message) && !hasInvalidToolCalls(choice.message)
      ? choice.message
      : null
  }
  if (!Array.isArray(choice.messages) || choice.messages.length === 0) return null

  const assistantMessages: Record<string, unknown>[] = []
  for (const candidate of choice.messages) {
    if (!isRecord(candidate) || hasInvalidToolCalls(candidate)) return null
    if (candidate.role === 'tool') return null
    if (candidate.role === 'assistant') assistantMessages.push(candidate)
  }
  return assistantMessages.length === 1 ? assistantMessages[0] : null
}

function readMessageContent(message: Record<string, unknown>): string | null {
  const content = message.content
  if (typeof content === 'string') {
    return content.trim().length > 0 && content.length <= MAX_MODEL_CONTENT_CHARACTERS
      ? content
      : null
  }
  if (!Array.isArray(content) || content.length === 0) return null

  let combined = ''
  for (const block of content) {
    if (!isRecord(block)) return null
    if (block.type === 'thinking') continue
    if (block.type !== 'text' || typeof block.text !== 'string') return null
    if (block.text.length === 0) return null
    combined += block.text
    if (combined.length > MAX_MODEL_CONTENT_CHARACTERS) return null
  }
  return combined.trim().length > 0 ? combined : null
}

export function readModelContent(value: unknown): string | null {
  if (!isRecord(value) || !Array.isArray(value.choices) || value.choices.length === 0) return null
  const first = value.choices[0]
  if (!isRecord(first)) return null
  const message = selectModelMessage(first)
  return message ? readMessageContent(message) : null
}

export function readFinishReason(value: unknown): MistralFinishReason | null {
  if (!isRecord(value) || !Array.isArray(value.choices) || value.choices.length === 0) return null
  const first = value.choices[0]
  if (!isRecord(first)) return null
  if (first.finish_reason === 'stop' || first.finish_reason === 'length') return first.finish_reason
  return 'unexpected'
}

function safeKeyNames(value: Record<string, unknown> | null): string[] {
  if (!value) return []
  return [...new Set(Object.keys(value).slice(0, 32).map((key) =>
    /^[a-z0-9_]{1,64}$/i.test(key) ? key : 'other'))].sort()
}

function shapeMessage(choice: Record<string, unknown>): Record<string, unknown> | null {
  if (isRecord(choice.message)) return choice.message
  if (!Array.isArray(choice.messages)) return null
  const assistants = choice.messages.filter((candidate) =>
    isRecord(candidate) && candidate.role === 'assistant')
  return assistants.length === 1 && isRecord(assistants[0]) ? assistants[0] : null
}

export function describeMistralEnvelope(value: unknown): MistralEnvelopeShape {
  const first = isRecord(value) && Array.isArray(value.choices) && isRecord(value.choices[0])
    ? value.choices[0]
    : null
  const message = first ? shapeMessage(first) : null
  const content = message?.content
  const contentKind = message === null || !Object.hasOwn(message, 'content')
    ? 'missing'
    : content === null
      ? 'null'
      : typeof content === 'string'
        ? 'string'
        : Array.isArray(content)
          ? 'array'
          : 'other'
  const contentBlockTypes = Array.isArray(content)
    ? [...new Set(content.slice(0, 32).map((block) =>
        isRecord(block) && typeof block.type === 'string' && /^[a-z0-9_-]{1,64}$/i.test(block.type)
          ? block.type
          : 'other'))]
    : []
  const toolCalls = message?.tool_calls
  const toolCallsKind = message === null || toolCalls === undefined
    ? 'missing'
    : toolCalls === null
      ? 'null'
      : Array.isArray(toolCalls)
        ? toolCalls.length === 0 ? 'empty_array' : 'non_empty_array'
        : 'other'

  return {
    choiceKeys: safeKeyNames(first),
    hasMessage: Boolean(first && Object.hasOwn(first, 'message')),
    hasMessages: Boolean(first && Object.hasOwn(first, 'messages')),
    messageKeys: safeKeyNames(message),
    contentKind,
    contentBlockTypes,
    toolCallsKind,
    finishReason: readFinishReason(value),
  }
}

async function readResponseTextLimited(response: Response): Promise<string | null> {
  const declaredLength = Number(response.headers.get('content-length') ?? 0)
  if (declaredLength > MAX_PROVIDER_RESPONSE_BYTES) return null
  if (!response.body) {
    const text = await response.text()
    return new TextEncoder().encode(text).byteLength <= MAX_PROVIDER_RESPONSE_BYTES ? text : null
  }

  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    total += value.byteLength
    if (total > MAX_PROVIDER_RESPONSE_BYTES) {
      await reader.cancel()
      return null
    }
    chunks.push(value)
  }
  const merged = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    merged.set(chunk, offset)
    offset += chunk.byteLength
  }
  return new TextDecoder().decode(merged)
}

export class MistralConciergeAIProvider implements ConciergeAIProvider {
  readonly name = 'mistral' as const

  constructor(
    private readonly config: ConciergeAIGatewayConfig,
    private readonly fetchImpl: FetchImplementation = fetch,
  ) {}

  async execute(request: ConciergeAIRequest): Promise<ConciergeAIResponse> {
    const startedAt = Date.now()
    if (!this.config.mistralEnabled || !this.config.mistralApiKey) {
      return failedResponse(startedAt, 'provider_unavailable', 'Le fournisseur est indisponible.', false)
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), request.timeoutMs)

    try {
      const response = await this.fetchImpl(`${this.config.mistralApiBaseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.config.mistralApiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          model: this.config.mistralModel,
          messages: buildMistralMessages(request),
          temperature: getTaskTemperature(request.task),
          max_tokens: request.maxOutputTokens,
          reasoning_effort: 'none',
          tool_choice: 'none',
          parallel_tool_calls: false,
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: request.expectedSchema.name,
              schema: getMistralJsonSchema(request.task),
              strict: true,
            },
          },
        }),
        cache: 'no-store',
        signal: controller.signal,
      })

      if (!response.ok) {
        const retryable = response.status === 429 || response.status >= 500
        const code = response.status === 429 ? 'rate_limited' : 'provider_error'
        return failedResponse(startedAt, code, 'Le fournisseur n’a pas pu traiter la demande.', retryable, 'mistral_http_error', response.status)
      }

      const rawBody = await readResponseTextLimited(response)
      if (rawBody === null) {
        return failedResponse(startedAt, 'invalid_output', 'La réponse du fournisseur est trop volumineuse.', false, 'mistral_invalid_envelope', response.status)
      }

      let payload: unknown
      try {
        payload = JSON.parse(rawBody)
      } catch {
        return failedResponse(startedAt, 'invalid_output', 'La réponse du fournisseur est invalide.', false, 'mistral_invalid_envelope', response.status)
      }
      const finishReason = readFinishReason(payload)
      if (finishReason === 'length') {
        return failedResponse(startedAt, 'invalid_output', 'La réponse du fournisseur est tronquée.', false, 'mistral_truncated', response.status, finishReason)
      }
      if (finishReason !== 'stop') {
        return failedResponse(startedAt, 'invalid_output', 'La fin de la réponse du fournisseur est invalide.', false, 'mistral_invalid_envelope', response.status, finishReason, describeMistralEnvelope(payload))
      }
      const content = readModelContent(payload)
      if (!content || content.length > MAX_MODEL_CONTENT_CHARACTERS) {
        return failedResponse(startedAt, 'invalid_output', 'Le contenu retourné est absent ou trop long.', false, 'mistral_invalid_envelope', response.status, finishReason, describeMistralEnvelope(payload))
      }

      let structured: unknown
      try {
        structured = JSON.parse(content)
      } catch {
        return failedResponse(startedAt, 'invalid_output', 'Le contenu retourné n’est pas un objet JSON valide.', false, 'mistral_invalid_json', response.status, finishReason)
      }
      const validated = validateConciergeAITaskOutput(request.task, structured)
      if (!validated) {
        return failedResponse(startedAt, 'invalid_output', 'Le contenu retourné ne respecte pas le schéma.', false, 'mistral_schema_rejected', response.status, finishReason)
      }
      const usage = readUsage(isRecord(payload) ? payload.usage : null)
      return {
        success: true,
        provider: 'mistral',
        model: this.config.mistralModel,
        output: null,
        structuredOutput: validated as unknown as Record<string, unknown>,
        confidence: getTaskConfidence(request.task, validated),
        warnings: responseMetadataWarnings(response.status, finishReason),
        latencyMs: Date.now() - startedAt,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        fallbackUsed: false,
        error: null,
      }
    } catch (error) {
      const timedOut = controller.signal.aborted || (error instanceof Error && error.name === 'AbortError')
      return failedResponse(
        startedAt,
        timedOut ? 'timeout' : 'provider_error',
        timedOut ? 'Le délai du fournisseur est dépassé.' : 'Le fournisseur est temporairement indisponible.',
        true,
        timedOut ? 'mistral_timeout' : 'mistral_http_error',
      )
    } finally {
      clearTimeout(timeout)
    }
  }
}
