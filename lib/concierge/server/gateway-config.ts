export type ConciergeAIGatewayConfig = {
  explicitlyDisabled: boolean
  mistralEnabled: boolean
  mistralApiKey: string | null
  mistralApiBaseUrl: string
  mistralModel: string
  timeoutMs: number
  maxOutputTokens: number
}

function boundedInteger(
  raw: string | undefined,
  fallback: number,
  minimum: number,
  maximum: number,
): number {
  const value = raw ? Number.parseInt(raw, 10) : Number.NaN
  return Number.isFinite(value) ? Math.min(maximum, Math.max(minimum, value)) : fallback
}

function normalizeBaseUrl(value: string | undefined): string {
  const fallback = 'https://api.eu.mistral.ai'
  if (!value) return fallback
  try {
    const parsed = new URL(value)
    if (parsed.protocol !== 'https:') return fallback
    parsed.pathname = parsed.pathname.replace(/\/+$/, '')
    parsed.search = ''
    parsed.hash = ''
    return parsed.toString().replace(/\/$/, '')
  } catch {
    return fallback
  }
}

export function getConciergeAIGatewayConfig(): ConciergeAIGatewayConfig {
  const apiKey = process.env.MISTRAL_API_KEY?.trim() || null
  const explicitlyDisabled = process.env.CONCIERGE_AI_ENABLED === 'false'
  return {
    explicitlyDisabled,
    mistralEnabled: !explicitlyDisabled && Boolean(apiKey),
    mistralApiKey: apiKey,
    mistralApiBaseUrl: normalizeBaseUrl(process.env.MISTRAL_API_BASE_URL),
    mistralModel: process.env.MISTRAL_CONCIERGE_MODEL?.trim() || 'mistral-small-2603',
    timeoutMs: boundedInteger(process.env.CONCIERGE_AI_TIMEOUT_MS, 12_000, 2_000, 20_000),
    maxOutputTokens: boundedInteger(process.env.CONCIERGE_AI_MAX_OUTPUT_TOKENS, 700, 100, 1_000),
  }
}
