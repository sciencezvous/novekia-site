'use client'

import { emitConciergeEvent } from './client-events'
import {
  conciergeSolutionCategories,
  isConciergeAIRouteEnvelope,
  type ConciergeAIRouteEnvelope,
  type ConciergeAIErrorCode,
  type ConciergeAISuccessEnvelope,
} from './ai-schemas'
import type { ConciergeAIContext, ConciergeAITask } from './ai-contract'
import type { ConciergePath } from './types'

type ConciergeAIClientInput = {
  task: ConciergeAITask
  input: string | Record<string, unknown>
  context: ConciergeAIContext
  sessionId: string
  path: ConciergePath
  stepId: string | null
  sourcePage: string
  fallbackAllowed?: boolean
  signal?: AbortSignal
}

const CLIENT_TIMEOUT_MS = 21_500
const MAX_CACHE_ENTRIES = 12
const responseCache = new Map<string, ConciergeAISuccessEnvelope>()

function stableSerialize(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableSerialize).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableSerialize(item)}`)
      .join(',')}}`
  }
  return JSON.stringify(value)
}

function fingerprint(value: unknown): string {
  const input = stableSerialize(value)
  let hash = 2166136261
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(36)
}

function clientRequestId(): string {
  return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `ai-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

function emitClientEvent(
  input: ConciergeAIClientInput,
  eventName: 'concierge_ai_requested' | 'concierge_ai_fallback' | 'concierge_error',
  metadata: Readonly<Record<string, string | number | boolean | null>>,
) {
  emitConciergeEvent({
    eventName,
    pseudonymousSessionId: input.sessionId,
    path: input.path,
    stepId: input.stepId,
    sourcePage: input.sourcePage,
    metadata,
  })
}

function genericError(
  task: ConciergeAITask,
  code: ConciergeAIErrorCode = 'PROVIDER_UNAVAILABLE',
): ConciergeAIRouteEnvelope {
  return {
    success: false,
    requestId: clientRequestId(),
    task,
    error: {
      code,
      message: 'L’assistance avancée n’est pas disponible pour le moment. Le parcours reste utilisable.',
      retryable: code !== 'INVALID_REQUEST',
    },
    fallbackUsed: false,
  }
}

export async function requestConciergeAI(
  input: ConciergeAIClientInput,
): Promise<ConciergeAIRouteEnvelope> {
  const key = fingerprint({ task: input.task, input: input.input, context: input.context })
  const cached = responseCache.get(key)
  if (cached) return cached

  emitClientEvent(input, 'concierge_ai_requested', { task: input.task })
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS)
  const abortFromCaller = () => controller.abort()
  input.signal?.addEventListener('abort', abortFromCaller, { once: true })

  try {
    const response = await fetch('/api/concierge/ai', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      signal: controller.signal,
      body: JSON.stringify({
        task: input.task,
        requestId: clientRequestId(),
        sessionId: input.sessionId,
        locale: 'fr-FR',
        input: input.input,
        context: {
          ...input.context,
          allowedServiceCategories: conciergeSolutionCategories,
        },
        fallbackAllowed: input.fallbackAllowed ?? true,
      }),
    })
    let payload: unknown
    try {
      payload = await response.json()
    } catch {
      payload = null
    }
    if (!isConciergeAIRouteEnvelope(payload)) {
      emitClientEvent(input, 'concierge_error', { task: input.task, status: response.status })
      return genericError(input.task)
    }
    if (!payload.success) {
      emitClientEvent(input, 'concierge_error', { task: input.task, status: response.status })
      return payload
    }
    if (payload.fallbackUsed) {
      emitClientEvent(input, 'concierge_ai_fallback', { task: input.task, fallbackUsed: true })
    }
    if (responseCache.size >= MAX_CACHE_ENTRIES) {
      const oldestKey = responseCache.keys().next().value
      if (typeof oldestKey === 'string') responseCache.delete(oldestKey)
    }
    responseCache.set(key, payload)
    return payload
  } catch {
    const cancelled = controller.signal.aborted
    emitClientEvent(input, 'concierge_error', { task: input.task, cancelled })
    return genericError(input.task, cancelled ? 'TIMEOUT' : 'PROVIDER_UNAVAILABLE')
  } finally {
    window.clearTimeout(timeout)
    input.signal?.removeEventListener('abort', abortFromCaller)
  }
}

export function clearConciergeAICache(): void {
  responseCache.clear()
}
