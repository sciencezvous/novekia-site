import type { ConciergePath } from './types'

export const conciergeAnalyticsEventNames = [
  'concierge_impression',
  'concierge_opened',
  'concierge_started',
  'concierge_path_selected',
  'concierge_step_viewed',
  'concierge_step_completed',
  'concierge_step_validation_failed',
  'concierge_summary_viewed',
  'concierge_contact_started',
  'concierge_consent_granted',
  'concierge_submission_ready',
  'concierge_submitted',
  'concierge_abandoned',
  'concierge_ai_requested',
  'concierge_ai_fallback',
  'concierge_error',
  'concierge_human_handoff',
] as const

export type ConciergeAnalyticsEventName =
  (typeof conciergeAnalyticsEventNames)[number]

export type ConciergeAnalyticsMetadataValue =
  | string
  | number
  | boolean
  | null

export type ConciergeAnalyticsEvent = {
  eventName: ConciergeAnalyticsEventName
  pseudonymousSessionId: string
  path: ConciergePath
  stepId: string | null
  sourcePage: string
  timestamp: string
  metadata: Readonly<Record<string, ConciergeAnalyticsMetadataValue>>
}

export const forbiddenConciergeAnalyticsFields = [
  'freeText',
  'email',
  'phone',
  'fullName',
  'companyConfidentialData',
  'secret',
  'apiKey',
] as const

export function isAnalyticsMetadataSafe(
  metadata: Readonly<Record<string, ConciergeAnalyticsMetadataValue>>,
): boolean {
  const forbidden = new Set<string>(forbiddenConciergeAnalyticsFields)
  return Object.keys(metadata).every((key) => !forbidden.has(key))
}
