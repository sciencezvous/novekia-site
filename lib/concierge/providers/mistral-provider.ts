import type {
  ConciergeAIProvider,
  ConciergeAIRequest,
  ConciergeAIResponse,
} from '../ai-contract'
import { buildMistralMessages, getTaskTemperature } from '../ai-prompts'
import {
  getTaskConfidence,
  validateConciergeAITaskOutput,
} from '../ai-schemas'
import type { ConciergeAIGatewayConfig } from '../server/gateway-config'

type FetchImplementation = typeof fetch

const MAX_PROVIDER_RESPONSE_BYTES = 128 * 1024
const MAX_MODEL_CONTENT_CHARACTERS = 20_000

function failedResponse(
  startedAt: number,
  code: NonNullable<ConciergeAIResponse['error']>['code'],
  message: string,
  retryable: boolean,
): ConciergeAIResponse {
  return {
    success: false,
    provider: 'mistral',
    model: null,
    output: null,
    structuredOutput: null,
    confidence: null,
    warnings: [],
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

function readModelContent(value: unknown): string | null {
  if (!isRecord(value) || !Array.isArray(value.choices) || value.choices.length === 0) return null
  const first = value.choices[0]
  if (!isRecord(first) || !isRecord(first.message)) return null
  return typeof first.message.content === 'string' ? first.message.content : null
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
          response_format: { type: 'json_object' },
        }),
        cache: 'no-store',
        signal: controller.signal,
      })

      if (!response.ok) {
        const retryable = response.status === 429 || response.status >= 500
        const code = response.status === 429 ? 'rate_limited' : 'provider_error'
        return failedResponse(startedAt, code, 'Le fournisseur n’a pas pu traiter la demande.', retryable)
      }

      const rawBody = await readResponseTextLimited(response)
      if (rawBody === null) {
        return failedResponse(startedAt, 'invalid_output', 'La réponse du fournisseur est trop volumineuse.', false)
      }

      let payload: unknown
      try {
        payload = JSON.parse(rawBody)
      } catch {
        return failedResponse(startedAt, 'invalid_output', 'La réponse du fournisseur est invalide.', false)
      }
      const content = readModelContent(payload)
      if (!content || content.length > MAX_MODEL_CONTENT_CHARACTERS) {
        return failedResponse(startedAt, 'invalid_output', 'Le contenu retourné est absent ou trop long.', false)
      }

      let structured: unknown
      try {
        structured = JSON.parse(content)
      } catch {
        return failedResponse(startedAt, 'invalid_output', 'Le contenu retourné n’est pas un objet JSON valide.', false)
      }
      const validated = validateConciergeAITaskOutput(request.task, structured)
      if (!validated) {
        return failedResponse(startedAt, 'invalid_output', 'Le contenu retourné ne respecte pas le schéma.', false)
      }
      const usage = readUsage(isRecord(payload) ? payload.usage : null)
      return {
        success: true,
        provider: 'mistral',
        model: this.config.mistralModel,
        output: null,
        structuredOutput: validated as unknown as Record<string, unknown>,
        confidence: getTaskConfidence(request.task, validated),
        warnings: [],
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
      )
    } finally {
      clearTimeout(timeout)
    }
  }
}
