import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const [route, server] = await Promise.all([
  readFile(new URL('../app/api/audit/start/route.ts', import.meta.url), 'utf8'),
  readFile(new URL('../lib/audit-server.ts', import.meta.url), 'utf8'),
])

const bodyParse = route.indexOf('body = await request.json()')
const targetValidation = route.indexOf('const targetUrl = normalizeAuditTarget(body.url)')
const quotaReservation = route.indexOf('enforceRateLimit(scanQuotaKey, 5)')
const engineCall = route.indexOf('runAuditWithSameDomainHostFallback(targetUrl)')

assert.ok(bodyParse >= 0, 'request body parsing must remain explicit')
assert.ok(targetValidation > bodyParse, 'target must be validated after parsing')
assert.ok(quotaReservation > targetValidation, 'scan quota must be reserved only after local validation')
assert.ok(engineCall > quotaReservation, 'scan quota must be reserved before the engine call')

assert.match(route, /new Set\(\[429, 502, 503, 504\]\)/)
assert.match(route, /isTransientAuditFailure\(error\)[\s\S]*releaseRateLimit\(scanQuotaKey\)/)
assert.match(route, /if \(scanQuotaReserved && scanQuotaKey\)[\s\S]*releaseRateLimit\(scanQuotaKey\)/)
assert.match(route, /quotaRefunded/)

assert.match(server, /export function releaseRateLimit\(key: string, now = Date\.now\(\)\)/)
assert.match(server, /current\.resetAt <= now \|\| current\.count <= 1/)
assert.match(server, /current\.count -= 1/)

console.log('audit start reliability contract: OK')
