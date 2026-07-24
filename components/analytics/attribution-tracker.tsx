'use client'

import { useEffect } from 'react'
import {
  ATTRIBUTION_STORAGE_KEY,
  sanitizeAttribution,
} from '@/lib/lead-attribution'

function getSafeReferrer() {
  if (!document.referrer) {
    return { referrer: '', referrerHost: '' }
  }

  try {
    const url = new URL(document.referrer)
    return {
      referrer: `${url.origin}${url.pathname}`.slice(0, 200),
      referrerHost: url.hostname.slice(0, 120),
    }
  } catch {
    return { referrer: '', referrerHost: '' }
  }
}

export function AttributionTracker() {
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY)) return

      const searchParams = new URLSearchParams(window.location.search)
      const { referrer, referrerHost } = getSafeReferrer()
      const attribution = sanitizeAttribution({
        landingPath: window.location.pathname,
        currentPath: `${window.location.pathname}${window.location.hash}`,
        referrer,
        referrerHost,
        utmSource: searchParams.get('utm_source'),
        utmMedium: searchParams.get('utm_medium'),
        utmCampaign: searchParams.get('utm_campaign'),
        utmContent: searchParams.get('utm_content'),
        utmTerm: searchParams.get('utm_term'),
      })

      window.sessionStorage.setItem(
        ATTRIBUTION_STORAGE_KEY,
        JSON.stringify(attribution),
      )
    } catch {
      // Attribution is informative only and must never block navigation.
    }
  }, [])

  return null
}
