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

  // Meta-ready without installing or exposing a Pixel ID here. If a Pixel is
  // configured later, the same funnel events become available automatically.
  if (typeof trackingWindow.fbq === 'function') {
    trackingWindow.fbq('trackCustom', name, payload)
  }
}
