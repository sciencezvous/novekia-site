import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const server = await readFile(new URL('../lib/audit-server.ts', import.meta.url), 'utf8')
const freeEmailRoute = await readFile(
  new URL('../app/api/audit/report/route.ts', import.meta.url),
  'utf8'
)
const publicPdfRoute = await readFile(
  new URL('../app/api/audit/report/[auditId]/route.ts', import.meta.url),
  'utf8'
)
const orderRoute = await readFile(
  new URL('../app/api/audit/order/route.ts', import.meta.url),
  'utf8'
)
const experience = await readFile(
  new URL('../app/audit/audit-experience.tsx', import.meta.url),
  'utf8'
)

// The legacy server helper may still validate PDF bytes for an authenticated
// server-to-server use, but the free funnel must never invoke it.
assert.match(server, /contentType\.includes\('application\/pdf'\)/)
assert.match(server, /toString\('ascii'\) !== '%PDF-'/)
assert.match(server, /MAX_PDF_BYTES/)
assert.doesNotMatch(server, /NextResponse/)

assert.doesNotMatch(
  freeEmailRoute,
  /callAuditPdfIngress/,
  'Free pre-audit email must not fetch the premium PDF'
)
assert.doesNotMatch(
  freeEmailRoute,
  /attachments:\s*\[/,
  'Free pre-audit email must not attach a premium PDF'
)
assert.match(
  freeEmailRoute,
  /rapport premium complet n’est pas inclus/,
  'Free email must state the premium boundary explicitly'
)

assert.match(publicPdfRoute, /PAID_AUDIT_REQUIRED/)
assert.doesNotMatch(
  publicPdfRoute,
  /callAuditPdfIngress/,
  'Public browser route must not proxy the premium PDF'
)

assert.match(orderRoute, /status: 'pending_payment'/)
assert.match(orderRoute, /ne pas démarrer l’audit complet avant validation du paiement/i)
assert.doesNotMatch(
  orderRoute,
  /callAuditIngress|callAuditPdfIngress/,
  'Creating an order must never execute an audit or fetch its premium report'
)

assert.match(experience, /SYNTHÈSE DE PRÉ-AUDIT/)
assert.doesNotMatch(
  experience,
  /Le PDF est joint au|Le PDF détaille/,
  'Free completion UI must not promise the premium PDF or its detailed remediation'
)
assert.doesNotMatch(
  experience,
  /Télécharger le PDF/,
  'Free completion UI must not expose a direct premium PDF download'
)
assert.doesNotMatch(
  experience,
  /\/api\/audit\/report\/\$\{encodeURIComponent\(result\.audit_id\)\}/,
  'Free completion UI must not build a direct premium PDF URL'
)

console.log('Audit paid/free delivery boundary contract: PASS')
