import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const server = await readFile(new URL('../lib/audit-server.ts', import.meta.url), 'utf8')
const route = await readFile(new URL('../app/api/audit/report/route.ts', import.meta.url), 'utf8')

assert.match(server, /Accept: 'application\/pdf'/)
assert.match(server, /'X-Novekia-Audit-Key': token/)
assert.match(server, /contentType\.includes\('application\/pdf'\)/)
assert.match(server, /toString\('ascii'\) !== '%PDF-'/)
assert.match(server, /MAX_PDF_BYTES/)
assert.doesNotMatch(server, /NextResponse/)

assert.match(route, /callAuditPdfIngress\(auditId\)/)
assert.match(route, /attachments:\s*\[/)
assert.match(route, /filename: pdfFilename/)
assert.match(route, /content: pdf\.bytes/)
assert.ok(
  route.indexOf('callAuditPdfIngress(auditId)') < route.indexOf('resend.emails.send'),
  'PDF must be validated before the visitor email is sent'
)

console.log('Audit premium PDF delivery contract: PASS')
