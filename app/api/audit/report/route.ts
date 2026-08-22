import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import {
  AuditFacadeError,
  callAuditIngress,
  clientAddress,
  enforceRateLimit,
  enforceSameOrigin,
} from '@/lib/audit-server'
import { sanitizeAttribution } from '@/lib/lead-attribution'
import { siteConfig } from '@/lib/site-config'

export const runtime = 'nodejs'
export const maxDuration = 60

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const CATEGORY_LABELS: Record<string, string> = {
  technical_seo: 'SEO technique',
  on_page_seo: 'SEO on-page',
  geo_readiness: 'GEO / réponses IA',
  trust_authority: 'Confiance & autorité',
  conversion: 'Conversion',
  performance_observation: 'Performance observée',
  public_hygiene: 'Hygiène publique',
  accessibility_observation: 'Accessibilité observée',
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }
    return entities[char]
  })
}

function categoryLabel(value: string) {
  return CATEGORY_LABELS[value] ?? value.replaceAll('_', ' ')
}

function reportHtml(result: Awaited<ReturnType<typeof callAuditIngress>>) {
  const findings = result.findings
    .map((finding, index) => {
      const proof = finding.evidence_excerpt
        ? `<div style="margin-top:12px;padding:12px 14px;background:#f5f5f4;border-left:3px solid #2563eb;font-size:13px;line-height:1.55;color:#44403c"><strong>Preuve observée :</strong> ${escapeHtml(finding.evidence_excerpt)}</div>`
        : ''
      const source = finding.evidence_source_url
        ? `<p style="margin:8px 0 0;font-size:12px;color:#78716c;word-break:break-all">Source : ${escapeHtml(finding.evidence_source_url)}</p>`
        : ''
      const recommendation = finding.recommendation
        ? `<p style="margin:12px 0 0;line-height:1.6"><strong>Action recommandée :</strong> ${escapeHtml(finding.recommendation)}</p>`
        : ''

      return `<div style="padding:20px 0;border-top:1px solid #e7e5e4">
        <p style="margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#2563eb">${String(index + 1).padStart(2, '0')} · ${escapeHtml(categoryLabel(finding.category))} · ${escapeHtml(finding.severity)}</p>
        <h3 style="margin:0;font-size:18px;color:#111827">${escapeHtml(finding.title)}</h3>
        <p style="margin:10px 0 0;line-height:1.65;color:#374151">${escapeHtml(finding.finding)}</p>
        ${recommendation}${proof}${source}
      </div>`
    })
    .join('')

  const positives = result.positive_observations.length
    ? `<div style="padding:16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin:24px 0"><strong>Points positifs observés</strong><ul style="margin:10px 0 0;padding-left:20px">${result.positive_observations.map((item) => `<li style="margin:6px 0">${escapeHtml(item)}</li>`).join('')}</ul></div>`
    : ''

  return `<!doctype html>
<html lang="fr"><body style="margin:0;background:#f5f5f4;font-family:Arial,sans-serif;color:#1c1917">
  <div style="max-width:720px;margin:0 auto;padding:24px 12px">
    <div style="background:#111827;color:white;padding:28px;border-radius:10px 10px 0 0">
      <p style="margin:0 0 8px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#93c5fd">NOVEKIA · Pré-audit public</p>
      <h1 style="margin:0;font-size:26px">Votre visibilité web & IA — ${escapeHtml(result.target_domain)}</h1>
    </div>
    <div style="background:white;padding:28px;border-radius:0 0 10px 10px">
      <p style="margin:0;line-height:1.7;color:#44403c">Ce rapport repose sur un échantillon public borné de votre site. Il ne constitue ni une certification, ni un audit exhaustif, ni une garantie de positionnement.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin:24px 0">
        <div style="padding:14px 16px;border:1px solid #e7e5e4;border-radius:8px"><div style="font-size:12px;color:#78716c">Indice d’opportunité</div><strong style="font-size:24px">${result.opportunity_index}/100</strong></div>
        <div style="padding:14px 16px;border:1px solid #e7e5e4;border-radius:8px"><div style="font-size:12px;color:#78716c">Couverture</div><strong style="font-size:24px">${result.coverage_score}/100</strong></div>
        <div style="padding:14px 16px;border:1px solid #e7e5e4;border-radius:8px"><div style="font-size:12px;color:#78716c">Confiance</div><strong style="font-size:24px">${result.confidence_score}/100</strong></div>
      </div>
      <p style="font-size:13px;color:#57534e"><strong>Lecture :</strong> plus l’indice d’opportunité est élevé, plus le moteur a détecté de marge d’amélioration dans l’échantillon analysé.</p>
      <p style="font-size:13px;color:#57534e">Pages collectées : ${result.pages_collected}/${result.pages_planned} · Constats exploitables : ${result.total_findings}</p>
      ${positives}
      <h2 style="margin:30px 0 8px;font-size:21px">Constats et recommandations</h2>
      ${findings || '<p>Aucun constat exploitable n’a été retenu dans cet échantillon.</p>'}
      <div style="margin-top:28px;padding:20px;background:#eff6ff;border-radius:8px">
        <strong>Besoin d’aller plus loin ?</strong>
        <p style="margin:8px 0 0;line-height:1.6">L’audit complet Novekia approfondit le SEO, le GEO, les signaux utiles à l’AEO, les preuves par page et le plan de correction priorisé.</p>
        <p style="margin:12px 0 0"><a href="${siteConfig.url}/#contact" style="color:#1d4ed8">Échanger avec Novekia</a></p>
      </div>
      <p style="margin:28px 0 0;font-size:11px;line-height:1.55;color:#78716c">Audit ID : ${escapeHtml(result.audit_id)} · <a href="${siteConfig.url}/politique-de-confidentialite" style="color:#57534e">Politique de confidentialité</a></p>
    </div>
  </div>
</body></html>`
}

function reportText(result: Awaited<ReturnType<typeof callAuditIngress>>) {
  const lines = [
    `NOVEKIA — PRÉ-AUDIT PUBLIC`,
    `Site : ${result.target_domain}`,
    `Indice d'opportunité : ${result.opportunity_index}/100`,
    `Couverture : ${result.coverage_score}/100`,
    `Confiance : ${result.confidence_score}/100`,
    `Pages collectées : ${result.pages_collected}/${result.pages_planned}`,
    `Constats exploitables : ${result.total_findings}`,
    '',
    `Plus l'indice d'opportunité est élevé, plus le moteur a détecté de marge d'amélioration dans l'échantillon analysé.`,
    '',
  ]

  result.findings.forEach((finding, index) => {
    lines.push(`${index + 1}. ${finding.title} [${categoryLabel(finding.category)}]`)
    lines.push(finding.finding)
    if (finding.recommendation) lines.push(`Action : ${finding.recommendation}`)
    if (finding.evidence_excerpt) lines.push(`Preuve : ${finding.evidence_excerpt}`)
    if (finding.evidence_source_url) lines.push(`Source : ${finding.evidence_source_url}`)
    lines.push('')
  })

  lines.push(
    'Pré-audit public borné : ce document ne constitue ni une certification, ni un audit exhaustif, ni une garantie de positionnement.',
    `Contact : ${siteConfig.contact.email}`
  )
  return lines.join('\n')
}

export async function POST(request: NextRequest) {
  try {
    enforceSameOrigin(request)
    enforceRateLimit(`audit:report:${clientAddress(request)}`, 10)

    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      throw new AuditFacadeError(400, 'Données invalides.')
    }

    if (JSON.stringify(body).length > 12_000) {
      throw new AuditFacadeError(413, 'Données trop volumineuses.')
    }

    const auditId = String(body.auditId ?? '').trim()
    const email = String(body.email ?? '').trim().toLowerCase()
    const consent = body.consent === true
    const honeypot = String(body.website ?? '').trim()
    const attribution = sanitizeAttribution(body.attribution)

    if (honeypot) return NextResponse.json({ success: true })
    if (!UUID_RE.test(auditId)) {
      throw new AuditFacadeError(400, 'Identifiant de pré-audit invalide.')
    }
    if (!EMAIL_RE.test(email) || email.length > 254) {
      throw new AuditFacadeError(400, 'Adresse email invalide.')
    }
    if (!consent) {
      throw new AuditFacadeError(400, 'Votre accord est requis pour recevoir le rapport.')
    }

    const resendKey = process.env.RESEND_API_KEY?.trim()
    const from = (process.env.AUDIT_REPORT_FROM || process.env.CONTACT_FROM)?.trim()
    if (!resendKey || !from) {
      throw new AuditFacadeError(503, 'L’envoi du rapport est momentanément indisponible.')
    }

    // Canonical data is fetched again server-to-server. No finding, score or
    // recommendation supplied by the browser is trusted for email delivery.
    const report = await callAuditIngress({
      method: 'GET',
      path: `/${auditId}/report`,
    })

    const resend = new Resend(resendKey)
    const visitorSend = await resend.emails.send({
      from,
      to: email,
      replyTo: siteConfig.contact.email,
      subject: `Votre pré-audit Novekia — ${report.target_domain}`,
      html: reportHtml(report),
      text: reportText(report),
    })
    if (visitorSend.error) {
      throw new AuditFacadeError(502, 'Le rapport n’a pas pu être envoyé. Réessayez.')
    }

    const internalTo = process.env.CONTACT_TO?.trim()
    if (internalTo) {
      const attributionLines = [
        attribution.utmSource && `UTM source: ${attribution.utmSource}`,
        attribution.utmMedium && `UTM medium: ${attribution.utmMedium}`,
        attribution.utmCampaign && `UTM campaign: ${attribution.utmCampaign}`,
        attribution.referrer && `Referrer: ${attribution.referrer}`,
      ].filter(Boolean)

      // Best effort only: a notification failure must never invalidate a report
      // that was already delivered to the visitor.
      await resend.emails.send({
        from,
        to: internalTo,
        replyTo: email,
        subject: `Lead pré-audit — ${report.target_domain}`,
        text: [
          'Nouveau rapport de pré-audit demandé.',
          `Email: ${email}`,
          `Domaine: ${report.target_domain}`,
          `Audit ID: ${report.audit_id}`,
          `Indice d'opportunité: ${report.opportunity_index}/100`,
          ...attributionLines,
        ].join('\n'),
      })
    }

    return NextResponse.json(
      { success: true },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    if (error instanceof AuditFacadeError) {
      return NextResponse.json(
        { error: error.publicMessage },
        { status: error.status }
      )
    }

    return NextResponse.json(
      { error: 'L’envoi du rapport est momentanément indisponible.' },
      { status: 502 }
    )
  }
}
