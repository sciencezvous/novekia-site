import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import {
  AuditFacadeError,
  callAuditIngress,
  clientAddress,
  enforceRateLimit,
  enforceSameOrigin,
} from '@/lib/audit-server'
import type { PublicAuditResult } from '@/lib/audit-contract'
import { sanitizeAttribution } from '@/lib/lead-attribution'
import { siteConfig } from '@/lib/site-config'

export const runtime = 'nodejs'
export const maxDuration = 60

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const SCORE_CATEGORY_LABELS: Record<string, string> = {
  accessibility_indexability: 'Accessibilité & indexabilité',
  on_page_seo: 'SEO on-page',
  structured_data_entity: 'Données structurées & entité',
  technical_integrity: 'Intégrité technique',
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

function scoreCategoryLabel(value: string) {
  return SCORE_CATEGORY_LABELS[value] ?? value.replaceAll('_', ' ')
}

function priorityFindingCount(result: PublicAuditResult) {
  const nonConclusive = new Set([
    'needs_review',
    'unverified',
    'not_verified',
    'not_measured',
    'inconclusive',
  ])

  return result.findings.filter((finding) => {
    const verification = finding.verification_status.toLowerCase()
    const severity = finding.severity.toLowerCase()
    return (
      !nonConclusive.has(verification) &&
      (severity === 'critical' || severity === 'high')
    )
  }).length
}

function recommendedOffer(result: PublicAuditResult): 'optimisation' | 'visibility' | null {
  if (result.result_state === 'partial' || result.total_findings === 0) return null

  const priorityFindings = priorityFindingCount(result)
  if (
    priorityFindings >= 2 ||
    result.total_findings >= 4 ||
    result.public_audit_score < 65
  ) {
    return 'visibility'
  }
  return 'optimisation'
}

function paidAuditUrl(result: PublicAuditResult) {
  const offer = recommendedOffer(result)
  if (!offer) return `${siteConfig.url}/audit-approfondi#tarifs`

  const params = new URLSearchParams({
    offer,
    auditId: result.audit_id,
    url: result.target_url,
  })
  return `${siteConfig.url}/audit/commande?${params.toString()}`
}

function scoreVerdict(result: PublicAuditResult) {
  const score = result.public_audit_score
  if (score >= 90) return 'Très bon niveau observé sur le périmètre contrôlé.'
  if (score >= 75) return 'Bon niveau observé — quelques corrections restent utiles.'
  if (score >= 55) return 'Base exploitable — plusieurs améliorations peuvent renforcer les signaux mesurés.'
  return 'Le périmètre contrôlé présente plusieurs points à renforcer en priorité.'
}

function previewHtml(result: PublicAuditResult) {
  const categoryCards = Object.entries(result.category_scores)
    .map(
      ([category, score]) => `
        <div style="padding:12px 14px;border:1px solid #e5e7eb;border-radius:8px">
          <div style="font-size:12px;color:#6b7280">${escapeHtml(scoreCategoryLabel(category))}</div>
          <strong style="font-size:20px">${score}/100</strong>
        </div>`
    )
    .join('')

  const positives = result.positive_observations
    .slice(0, 3)
    .map((item) => `<li style="margin:6px 0">${escapeHtml(item)}</li>`)
    .join('')

  const findings = result.findings
    .slice(0, 3)
    .map(
      (finding) => `
        <div style="padding:16px 0;border-top:1px solid #e5e7eb">
          <strong>${escapeHtml(finding.title)}</strong>
          <p style="margin:7px 0 0;line-height:1.6;color:#4b5563">${escapeHtml(finding.finding)}</p>
        </div>`
    )
    .join('')

  const ctaUrl = paidAuditUrl(result)

  return `<!doctype html>
<html lang="fr"><body style="margin:0;background:#f5f5f4;font-family:Arial,sans-serif;color:#111827">
  <div style="max-width:680px;margin:0 auto;padding:24px 12px">
    <div style="background:#111827;color:white;padding:28px;border-radius:10px 10px 0 0">
      <p style="margin:0 0 8px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#93c5fd">NOVEKIA · Pré-audit public</p>
      <h1 style="margin:0;font-size:26px">Pré-audit de ${escapeHtml(result.target_domain)}</h1>
      <p style="margin:12px 0 0;color:#dbeafe">Voici votre aperçu gratuit. Le rapport premium complet n’est pas inclus dans le pré-audit.</p>
    </div>
    <div style="background:white;padding:28px;border-radius:0 0 10px 10px">
      <div style="padding:20px;background:#eff6ff;border-left:4px solid #2563eb">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#1d4ed8">Score du pré-audit public</div>
        <div style="margin-top:6px;font-size:42px;font-weight:800;color:#1d4ed8">${result.public_audit_score}/100</div>
        <p style="margin:9px 0 0;line-height:1.6;color:#475569">${escapeHtml(scoreVerdict(result))}</p>
      </div>

      <p style="margin:22px 0 0;font-size:13px;line-height:1.6;color:#57534e"><strong>Couverture :</strong> ${result.coverage}/100 · <strong>Pages :</strong> ${result.pages_collected}/${result.pages_planned} · <strong>Méthode :</strong> ${escapeHtml(result.score_version)}</p>

      <h2 style="margin:28px 0 12px;font-size:20px">Sous-scores observés</h2>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px">${categoryCards}</div>

      ${positives ? `<h2 style="margin:28px 0 10px;font-size:20px">Points favorables observés</h2><ul style="padding-left:20px;line-height:1.55">${positives}</ul>` : ''}

      <h2 style="margin:28px 0 8px;font-size:20px">Aperçu des constats</h2>
      ${findings || '<p style="line-height:1.6;color:#4b5563">Aucun écart prioritaire n’a été retenu sur les contrôles couverts.</p>'}

      <div style="margin-top:30px;padding:22px;background:#111827;color:white;border-radius:10px">
        <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#93c5fd">Audit Visibility complet</p>
        <h2 style="margin:8px 0 0;font-size:21px">Approfondir avec preuves, priorisation et rapport premium</h2>
        <p style="margin:10px 0 0;line-height:1.65;color:#dbeafe">L’offre payante ajoute l’analyse approfondie, la validation humaine selon le périmètre, la remédiation priorisée, les contrôles externes prévus par l’offre et le rapport premium. Elle ne démarre qu’après validation du paiement.</p>
        <p style="margin:18px 0 0"><a href="${escapeHtml(ctaUrl)}" style="display:inline-block;background:#2563eb;color:white;text-decoration:none;padding:12px 16px;border-radius:6px;font-weight:700">Voir la prochaine étape</a></p>
      </div>

      <p style="margin:24px 0 0;font-size:11px;line-height:1.55;color:#78716c">Pré-audit public volontairement borné. Il ne constitue ni un audit exhaustif, ni une certification, ni une garantie de positionnement. Audit ID : ${escapeHtml(result.audit_id)} · <a href="${siteConfig.url}/politique-de-confidentialite" style="color:#57534e">Politique de confidentialité</a></p>
    </div>
  </div>
</body></html>`
}

function previewText(result: PublicAuditResult) {
  const lines = [
    'NOVEKIA — PRÉ-AUDIT PUBLIC',
    `Site : ${result.target_domain}`,
    `Score : ${result.public_audit_score}/100`,
    `Couverture : ${result.coverage}/100`,
    scoreVerdict(result),
    '',
    'SOUS-SCORES OBSERVÉS',
    ...Object.entries(result.category_scores).map(
      ([category, score]) => `${scoreCategoryLabel(category)} : ${score}/100`
    ),
    '',
    'APERÇU DES CONSTATS',
    ...(result.findings.length
      ? result.findings.slice(0, 3).map((finding) => `- ${finding.title}: ${finding.finding}`)
      : ['- Aucun écart prioritaire retenu sur les contrôles couverts.']),
    '',
    'Le pré-audit gratuit est volontairement borné. Il ne contient pas le rapport premium complet, les recommandations détaillées ni l’analyse exhaustive.',
    'L’audit complet ne démarre qu’après validation du paiement.',
    `Prochaine étape : ${paidAuditUrl(result)}`,
  ]
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
      throw new AuditFacadeError(400, 'Votre accord est requis pour recevoir le pré-audit.')
    }

    const resendKey = process.env.RESEND_API_KEY?.trim()
    const from = (process.env.AUDIT_REPORT_FROM || process.env.CONTACT_FROM)?.trim()
    if (!resendKey || !from) {
      throw new AuditFacadeError(503, 'L’envoi du pré-audit est momentanément indisponible.')
    }

    const report = await callAuditIngress({
      method: 'GET',
      path: `/${auditId}/report`,
    })

    const resend = new Resend(resendKey)
    const visitorSend = await resend.emails.send({
      from,
      to: email,
      replyTo: siteConfig.contact.email,
      subject: `Votre pré-audit Novekia : ${report.public_audit_score}/100 — ${report.target_domain}`,
      html: previewHtml(report),
      text: previewText(report),
    })
    if (visitorSend.error) {
      throw new AuditFacadeError(502, 'Le pré-audit n’a pas pu être envoyé. Réessayez.')
    }

    const internalTo = process.env.CONTACT_TO?.trim()
    if (internalTo) {
      const attributionLines = [
        attribution.utmSource && `UTM source: ${attribution.utmSource}`,
        attribution.utmMedium && `UTM medium: ${attribution.utmMedium}`,
        attribution.utmCampaign && `UTM campaign: ${attribution.utmCampaign}`,
        attribution.referrer && `Referrer: ${attribution.referrer}`,
      ].filter(Boolean)

      await resend.emails.send({
        from,
        to: internalTo,
        replyTo: email,
        subject: `Lead pré-audit — ${report.target_domain}`,
        text: [
          'Nouveau pré-audit envoyé.',
          `Email: ${email}`,
          `Domaine: ${report.target_domain}`,
          `Audit ID: ${report.audit_id}`,
          `Score public: ${report.public_audit_score}/100`,
          `Couverture publique: ${report.coverage}/100`,
          `Méthode: ${report.score_version}`,
          `Constats publics: ${report.total_findings}`,
          `Offre recommandée: ${recommendedOffer(report) || 'revue manuelle / aucune'}`,
          ...attributionLines,
        ]
          .filter(Boolean)
          .join('\n'),
      })
    }

    return NextResponse.json(
      { success: true },
      {
        headers: {
          'Cache-Control': 'no-store',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      }
    )
  } catch (error) {
    if (error instanceof AuditFacadeError) {
      return NextResponse.json(
        { error: error.publicMessage },
        { status: error.status, headers: { 'Cache-Control': 'no-store' } }
      )
    }

    console.error('[visibility-preaudit-email] unexpected_error', error)
    return NextResponse.json(
      { error: 'L’envoi du pré-audit est momentanément indisponible.' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
