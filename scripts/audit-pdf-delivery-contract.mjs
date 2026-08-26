import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const server = await readFile(new URL('../lib/audit-server.ts', import.meta.url), 'utf8')
const route = await readFile(new URL('../app/api/audit/report/route.ts', import.meta.url), 'utf8')
const experience = await readFile(new URL('../app/audit/audit-experience.tsx', import.meta.url), 'utf8')

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

assert.doesNotMatch(
  experience,
  /Télécharger le PDF/,
  'The completion UI must not expose a second direct PDF download when the report is delivered by email'
)
assert.doesNotMatch(
  experience,
  /\/api\/audit\/report\/\$\{encodeURIComponent\(result\.audit_id\)\}/,
  'The completion UI must not build a direct PDF download URL'
)
assert.match(
  experience,
  /Le PDF est joint au/,
  'The completion UI must explicitly tell the visitor that the PDF is attached to the email'
)

console.log('Audit premium PDF delivery contract: PASS')
