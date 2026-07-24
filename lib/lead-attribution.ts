export const ATTRIBUTION_STORAGE_KEY = 'novekia:first-touch'

export type LeadAttribution = {
  landingPath: string
  currentPath: string
  referrer: string
  referrerHost: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
  utmContent: string
  utmTerm: string
}

const MAX_VALUE_LENGTH = 200

function cleanValue(value: unknown, maxLength = MAX_VALUE_LENGTH) {
  return String(value ?? '').trim().slice(0, maxLength)
}

function cleanPath(value: unknown) {
  const path = cleanValue(value)
  return path.startsWith('/') ? path : ''
}

export function sanitizeAttribution(value: unknown): LeadAttribution {
  const data =
    value && typeof value === 'object'
      ? (value as Record<string, unknown>)
      : {}

  return {
    landingPath: cleanPath(data.landingPath),
    currentPath: cleanPath(data.currentPath),
    referrer: cleanValue(data.referrer),
    referrerHost: cleanValue(data.referrerHost, 120),
    utmSource: cleanValue(data.utmSource, 120),
    utmMedium: cleanValue(data.utmMedium, 120),
    utmCampaign: cleanValue(data.utmCampaign, 120),
    utmContent: cleanValue(data.utmContent, 120),
    utmTerm: cleanValue(data.utmTerm, 120),
  }
}

export function getStoredAttribution(): LeadAttribution {
  const emptyAttribution = sanitizeAttribution({
    currentPath:
      typeof window === 'undefined'
        ? ''
        : `${window.location.pathname}${window.location.hash}`,
  })

  if (typeof window === 'undefined') return emptyAttribution

  try {
    const stored = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY)
    if (!stored) return emptyAttribution

    return sanitizeAttribution({
      ...JSON.parse(stored),
      currentPath: `${window.location.pathname}${window.location.hash}`,
    })
  } catch {
    return emptyAttribution
  }
}
