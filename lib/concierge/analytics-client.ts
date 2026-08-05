'use client'

import { track } from '@vercel/analytics'
import { getStoredAttribution } from '@/lib/lead-attribution'
import type {
  ConciergeAnalyticsEvent,
  ConciergeAnalyticsEventName,
} from './analytics'

const trackedFunnelEvents = new Set<ConciergeAnalyticsEventName>([
  'concierge_opened',
  'concierge_started',
  'concierge_path_selected',
  'concierge_summary_viewed',
  'concierge_contact_started',
  'concierge_submission_ready',
  'concierge_submitted',
])

export function trackConciergeFunnelEvent(event: ConciergeAnalyticsEvent) {
  if (!trackedFunnelEvents.has(event.eventName)) return

  try {
    const attribution = getStoredAttribution()
    const source =
      attribution.utmSource || attribution.referrerHost || 'direct'

    track(event.eventName, {
      path: event.path,
      source_page: event.sourcePage || 'unknown',
      step_id: event.stepId || 'none',
      source,
      landing_path: attribution.landingPath || 'unknown',
      campaign: attribution.utmCampaign || 'none',
    })
  } catch {
    // Measurement must never interrupt the qualification flow.
  }
}
