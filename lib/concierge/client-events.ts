'use client'

import {
  isAnalyticsMetadataSafe,
  type ConciergeAnalyticsEvent,
  type ConciergeAnalyticsEventName,
  type ConciergeAnalyticsMetadataValue,
} from './analytics'
import { CONCIERGE_EVENT_NAME } from './config'
import type { ConciergePath } from './types'
import { trackConciergeFunnelEvent } from './analytics-client'

type EmitConciergeEventInput = {
  eventName: ConciergeAnalyticsEventName
  pseudonymousSessionId: string
  path: ConciergePath
  stepId: string | null
  sourcePage: string
  metadata?: Readonly<Record<string, ConciergeAnalyticsMetadataValue>>
}

export function createClientSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const values = new Uint32Array(4)
    crypto.getRandomValues(values)
    return Array.from(values, (value) => value.toString(16).padStart(8, '0')).join('-')
  }

  return `concierge-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`
}

export function emitConciergeEvent(input: EmitConciergeEventInput): boolean {
  if (typeof window === 'undefined') return false

  const metadata = input.metadata ?? {}
  if (!isAnalyticsMetadataSafe(metadata)) return false

  const event: ConciergeAnalyticsEvent = {
    eventName: input.eventName,
    pseudonymousSessionId: input.pseudonymousSessionId,
    path: input.path,
    stepId: input.stepId,
    sourcePage: input.sourcePage,
    timestamp: new Date().toISOString(),
    metadata,
  }

  window.dispatchEvent(
    new CustomEvent<ConciergeAnalyticsEvent>(CONCIERGE_EVENT_NAME, {
      detail: event,
    }),
  )
  trackConciergeFunnelEvent(event)
  return true
}
