export function isAllowedConciergeOrigin(origin: string | null): boolean {
  if (!origin) return true

  try {
    const parsed = new URL(origin)
    if (parsed.username || parsed.password) return false

    if (
      parsed.protocol === 'https:' &&
      (parsed.hostname === 'novekia.fr' || parsed.hostname === 'www.novekia.fr')
    ) {
      return true
    }

    if (
      parsed.protocol === 'http:' &&
      (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1')
    ) {
      return true
    }

    return (
      parsed.protocol === 'https:' &&
      parsed.hostname.endsWith('.vercel.app') &&
      /^(?:novekia|novekia-site)(?:-[a-z0-9]+)*\.vercel\.app$/.test(
        parsed.hostname,
      )
    )
  } catch {
    return false
  }
}
