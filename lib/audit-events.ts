'use client'

type AuditEventName =
  | 'AuditStarted'
  | 'AuditCompleted'
  | 'EmailSubmitted'
  | 'AuditFailed'

type AuditEventPayload = Record<string, string | number | boolean>

type TrackingWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>
  fbq?: (...args: unknown[]) => void
}

export function trackAuditEvent(
  name: AuditEventName,
  payload: AuditEventPayload = {}
) {
  if (typeof window === 'undefined') return

  const trackingWindow = window as TrackingWindow
  trackingWindow.dataLayer?.push({ event: name, ...payload })

  // Meta-ready without installing or exposing a Pixel ID here. If a consented
  // Meta Pixel is configured later, the detailed funnel remains available as
  // custom events and the final email conversion is also emitted as Lead.
  if (typeof trackingWindow.fbq === 'function') {
    trackingWindow.fbq('trackCustom', name, payload)

    if (name === 'EmailSubmitted') {
      trackingWindow.fbq('track', 'Lead', payload)
    }
  }
}
