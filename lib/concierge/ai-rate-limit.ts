import { createHash, randomBytes } from 'node:crypto'

type RateEntry = {
  count: number
  windowStartedAt: number
  concurrent: number
  lastSeenAt: number
}

type RateLimitLease = {
  allowed: boolean
  release: () => void
}

const WINDOW_MS = 10 * 60 * 1000
const MAX_REQUESTS_PER_WINDOW = 10
const MAX_CONCURRENT_PER_FINGERPRINT = 3
const MAX_GLOBAL_REQUESTS_PER_WINDOW = 120
const MAX_GLOBAL_CONCURRENT = 18
const CLEANUP_INTERVAL_MS = 60 * 1000
const fingerprintSalt = randomBytes(32)
const entries = new Map<string, RateEntry>()

let globalWindowStartedAt = Date.now()
let globalCount = 0
let globalConcurrent = 0
let lastCleanupAt = 0

function fingerprint(value: string): string {
  return createHash('sha256').update(fingerprintSalt).update(value).digest('hex')
}

function cleanup(now: number) {
  if (now - lastCleanupAt < CLEANUP_INTERVAL_MS) return
  lastCleanupAt = now
  for (const [key, entry] of entries) {
    if (entry.concurrent === 0 && now - entry.lastSeenAt > WINDOW_MS) entries.delete(key)
  }
}

function resetWindows(now: number, entry: RateEntry) {
  if (now - entry.windowStartedAt >= WINDOW_MS) {
    entry.count = 0
    entry.windowStartedAt = now
  }
  if (now - globalWindowStartedAt >= WINDOW_MS) {
    globalWindowStartedAt = now
    globalCount = 0
  }
}

export function getEphemeralClientAddress(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || headers.get('x-real-ip')?.trim() || headers.get('cf-connecting-ip')?.trim() || 'unknown'
}

export function acquireConciergeAIRateLimit(rawAddress: string): RateLimitLease {
  const now = Date.now()
  cleanup(now)
  const key = fingerprint(rawAddress)
  const entry = entries.get(key) ?? {
    count: 0,
    windowStartedAt: now,
    concurrent: 0,
    lastSeenAt: now,
  }
  resetWindows(now, entry)
  entry.lastSeenAt = now

  if (
    entry.count >= MAX_REQUESTS_PER_WINDOW ||
    entry.concurrent >= MAX_CONCURRENT_PER_FINGERPRINT ||
    globalCount >= MAX_GLOBAL_REQUESTS_PER_WINDOW ||
    globalConcurrent >= MAX_GLOBAL_CONCURRENT
  ) {
    entries.set(key, entry)
    return { allowed: false, release: () => undefined }
  }

  entry.count += 1
  entry.concurrent += 1
  globalCount += 1
  globalConcurrent += 1
  entries.set(key, entry)
  let released = false
  return {
    allowed: true,
    release: () => {
      if (released) return
      released = true
      entry.concurrent = Math.max(0, entry.concurrent - 1)
      globalConcurrent = Math.max(0, globalConcurrent - 1)
      entry.lastSeenAt = Date.now()
    },
  }
}
