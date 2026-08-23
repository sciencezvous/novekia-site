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

const FINDING_CATEGORY_LABELS: Record<string, string> = {
  technical_seo: 'SEO technique',
  on_page_seo: 'SEO on-page',
  geo_readiness: 'GEO / réponses IA',
  trust_authority: 'Confiance & autorité',
  conversion: 'Conversion',
  performance_observation: 'Performance observée',
  local_visibility: 'Visibilité locale',
  public_hygiene: 'Hygiène publique',
  accessibility_observation: 'Accessibilité observée',
}

const SCORE_CATEGORY_LABELS: Record<string, string> = {
  accessibility_indexability: 'Accessibilité & indexabilité',
  on_page_seo: 'SEO on-page',
  structured_data_entity: 'Données structurées & entité',
  technical_integrity: 'Intégrité technique',
}

const CATEGORY_IMPACTS: Record<string, string> = {
  technical_seo:
    'Ce type de point peut limiter l’exploration, l’indexation ou l’interprétation technique du site par les moteurs.',
  on_page_seo:
    'Ce type de point peut réduire la clarté de la page pour les moteurs de recherche comme pour les visiteurs.',
  geo_readiness:
    'Ce type de point peut réduire la capacité des moteurs génératifs à comprendre, reprendre et citer correctement vos contenus.',
  trust_authority:
    'Ce type de point peut fragiliser les signaux publics de confiance, d’identité ou de vérifiabilité de votre organisation.',
  conversion:
    'Ce type de point peut réduire la capacité du site à transformer une visite qualifiée en prise de contact ou en demande.',
  performance_observation:
    'Ce signal mérite une mesure dédiée avant de conclure sur son impact réel sur l’expérience.',
  local_visibility:
    'Ce point peut limiter la compréhension locale de l’activité ou de sa zone de service.',
  public_hygiene:
    'Ce type de point peut affaiblir la robustesse technique observable publiquement et mérite une correction vérifiable.',
  accessibility_observation:
    'Ce type de point peut créer des obstacles d’usage et dégrader la qualité d’expérience pour une partie des visiteurs.',
}

const SEVERITY_LABELS: Record<string, string> = {
  critical: 'Critique',
  high: 'Priorité haute',
  medium: 'Priorité moyenne',
  low: 'Priorité faible',
  info: 'À surveiller',
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

function findingCategoryLabel(value: string) {
  return FINDING_CATEGORY_LABELS[value] ?? value.replaceAll('_', ' ')
}

function scoreCategoryLabel(value: string) {
  return SCORE_CATEGORY_LABELS[value] ?? value.replaceAll('_', ' ')
}

function categoryImpact(value: string) {
  return (
    CATEGORY_IMPACTS[value] ??
    'Ce point mérite d’être vérifié et priorisé dans le contexte global du site avant correction.'
  )
}

function severityLabel(value: string) {
  return SEVERITY_LABELS[value] ?? value
}

function scoreVerdict(result: Awaited<ReturnType<typeof callAuditIngress>>) {
  const score = result.public_audit_score
  if (score >= 90) {
    return result.total_findings > 0
      ? 'Très bon niveau observé — quelques corrections ciblées restent utiles.'
      : 'Très bon niveau observé sur le périmètre contrôlé.'
  }
  if (score >= 75) {
    return 'Bon niveau observé — quelques corrections restent utiles.'
  }
  if (score >= 55) {
    return 'Base exploitable — plusieurs améliorations peuvent renforcer les signaux mesurés.'
  }
  return 'Le périmètre contrôlé présente plusieurs points à renforcer en priorité.'
}

function reportHtml(result: Awaited<ReturnType<typeof callAuditIngress>>) {
  const hasFindings = result.findings.length > 0
  const score = result.public_audit_score
  const verdict = scoreVerdict(result)
  const verdictDetail = hasFindings
    ? 'Les corrections ci-dessous sont les points les plus utiles retenus dans l’échantillon. Chacune est associée à une observation et, lorsqu’elle est disponible, à une preuve vérifiable.'
    : 'Aucun écart prioritaire n’a été retenu sur les contrôles couverts. Ce résultat est favorable, mais il ne constitue pas une validation exhaustive du site.'

  const categoryCards = Object.entries(result.category_scores)
    .map(([category, categoryScore]) => {
      const categoryCoverage = result.category_coverage[category] ?? 0
      return `<div style="padding:14px 16px;border:1px solid #e7e5e4;border-radius:8px;min-width:180px;flex:1">
        <div style="font-size:12px;color:#78716c">${escapeHtml(scoreCategoryLabel(category))}</div>
        <strong style="font-size:24px">${categoryScore}/100</strong>
        <div style="margin-top:4px;font-size:11px;color:#78716c">Couverture ${categoryCoverage}/100</div>
      </div>`
    })
    .join('')

  const confidenceCard = hasFindings
    ? `<div style="padding:14px 16px;border:1px solid #e7e5e4;border-radius:8px"><div style="font-size:12px;color:#78716c">Confiance des constats</div><strong style="font-size:24px">${result.confidence_score}/100</strong></div>`
    : `<div style="padding:14px 16px;border:1px solid #e7e5e4;border-radius:8px"><div style="font-size:12px;color:#78716c">Qualification</div><strong style="font-size:17px">Aucun constat à qualifier</strong></div>`

  const findings = result.findings
    .map((finding, index) => {
      const proof = finding.evidence_excerpt
        ? `<div style="margin-top:14px;padding:12px 14px;background:#f5f5f4;border-left:3px solid #2563eb;font-size:13px;line-height:1.55;color:#44403c"><strong>Preuve observée</strong><br>${escapeHtml(finding.evidence_excerpt)}</div>`
        : ''
      const source = finding.evidence_source_url
        ? `<p style="margin:8px 0 0;font-size:12px;color:#78716c;word-break:break-all">Source contrôlée : ${escapeHtml(finding.evidence_source_url)}</p>`
        : ''
      const recommendation = finding.recommendation
        ? `<div style="margin-top:14px;padding:14px 16px;background:#eff6ff;border-radius:8px"><strong>Ce que vous pouvez faire maintenant</strong><p style="margin:7px 0 0;line-height:1.6">${escapeHtml(finding.recommendation)}</p></div>`
        : ''

      return `<div style="padding:24px 0;border-top:1px solid #e7e5e4">
        <p style="margin:0 0 7px;font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#2563eb">${String(index + 1).padStart(2, '0')} · ${escapeHtml(findingCategoryLabel(finding.category))} · ${escapeHtml(severityLabel(finding.severity))}</p>
        <h3 style="margin:0;font-size:19px;color:#111827">${escapeHtml(finding.title)}</h3>
        <p style="margin:12px 0 0;line-height:1.65;color:#374151"><strong>Ce que nous avons observé :</strong> ${escapeHtml(finding.finding)}</p>
        <p style="margin:12px 0 0;line-height:1.65;color:#374151"><strong>Pourquoi corriger ce point :</strong> ${escapeHtml(categoryImpact(finding.category))}</p>
        ${recommendation}${proof}${source}
      </div>`
    })
    .join('')

  const positives = result.positive_observations.length
    ? `<div style="padding:16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin:24px 0"><strong>Ce qui est déjà bien observé</strong><ul style="margin:10px 0 0;padding-left:20px">${result.positive_observations.map((item) => `<li style="margin:6px 0">${escapeHtml(item)}</li>`).join('')}</ul></div>`
    : ''

  return `<!doctype html>
<html lang="fr"><body style="margin:0;background:#f5f5f4;font-family:Arial,sans-serif;color:#1c1917">
  <div style="max-width:720px;margin:0 auto;padding:24px 12px">
    <div style="background:#111827;color:white;padding:28px;border-radius:10px 10px 0 0">
      <p style="margin:0 0 8px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#93c5fd">NOVEKIA · Pré-audit public</p>
      <h1 style="margin:0;font-size:26px">Pré-audit de ${escapeHtml(result.target_domain)}</h1>
    </div>
    <div style="background:white;padding:28px;border-radius:0 0 10px 10px">
      <div style="padding:20px;background:#eff6ff;border-left:4px solid #2563eb">
        <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#1d4ed8">Score du pré-audit public</p>
        <div style="margin-top:6px;font-size:42px;font-weight:800;color:#1d4ed8">${score}/100</div>
        <h2 style="margin:10px 0 0;font-size:22px;color:#111827">${escapeHtml(verdict)}</h2>
        <p style="margin:9px 0 0;line-height:1.65;color:#475569">${escapeHtml(verdictDetail)}</p>
      </div>

      <div style="display:flex;gap:10px;flex-wrap:wrap;margin:24px 0">
        <div style="padding:14px 16px;border:1px solid #e7e5e4;border-radius:8px"><div style="font-size:12px;color:#78716c">Couverture du référentiel V1</div><strong style="font-size:24px">${result.coverage}/100</strong></div>
        ${confidenceCard}
        <div style="padding:14px 16px;border:1px solid #e7e5e4;border-radius:8px"><div style="font-size:12px;color:#78716c">Pages collectées</div><strong style="font-size:24px">${result.pages_collected}/${result.pages_planned}</strong></div>
      </div>

      <p style="font-size:13px;line-height:1.55;color:#57534e"><strong>Comment lire le score :</strong> il est calculé uniquement sur les contrôles réellement évalués. Un contrôle non mesuré ou à revoir réduit la couverture sans devenir un zéro. Méthode : ${escapeHtml(result.score_version)}.</p>

      <h2 style="margin:30px 0 12px;font-size:21px">Sous-scores mesurés</h2>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:24px">${categoryCards}</div>

      ${positives}
      <h2 style="margin:30px 0 8px;font-size:21px">Corrections prioritaires</h2>
      ${findings || '<div style="padding:16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px"><strong>Aucun écart prioritaire retenu.</strong><p style="margin:7px 0 0;line-height:1.6;color:#475569">C’est favorable sur les contrôles couverts. Le pré-audit reste néanmoins borné.</p></div>'}

      <div style="margin-top:30px;padding:22px;background:#111827;color:white;border-radius:10px">
        <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#93c5fd">Prochaine étape</p>
        <h2 style="margin:8px 0 0;font-size:21px">Élargir le périmètre et confirmer les priorités</h2>
        <p style="margin:10px 0 0;line-height:1.65;color:#dbeafe">Novekia peut approfondir l’analyse SEO, les signaux utiles au GEO/AEO, les preuves par page et la remédiation, puis vérifier les résultats après correction.</p>
        <p style="margin:18px 0 0"><a href="${siteConfig.url}/#contact" style="display:inline-block;background:#2563eb;color:white;text-decoration:none;padding:12px 16px;border-radius:6px;font-weight:700">Parler de mon audit avec Novekia</a></p>
      </div>

      <p style="margin:24px 0 0;font-size:11px;line-height:1.55;color:#78716c">Pré-audit public borné fondé sur des informations accessibles publiquement. Il ne constitue ni un score Google, ni une certification, ni un audit exhaustif, ni un score GEO/AEO officiel, ni une garantie de positionnement. Audit ID : ${escapeHtml(result.audit_id)} · <a href="${siteConfig.url}/politique-de-confidentialite" style="color:#57534e">Politique de confidentialité</a></p>
    </div>
  </div>
</body></html>`
}

function reportText(result: Awaited<ReturnType<typeof callAuditIngress>>) {
  const hasFindings = result.findings.length > 0
  const lines = [
    'NOVEKIA — PRÉ-AUDIT PUBLIC',
    `Site : ${result.target_domain}`,
    '',
    `SCORE DU PRÉ-AUDIT : ${result.public_audit_score}/100`,
    scoreVerdict(result),
    `Couverture du référentiel V1 : ${result.coverage}/100`,
    `Méthode : ${result.score_version}`,
    hasFindings
      ? `Confiance des constats : ${result.confidence_score}/100`
      : 'Qualification : aucun constat à qualifier',
    `Pages collectées : ${result.pages_collected}/${result.pages_planned}`,
    '',
    'SOUS-SCORES MESURÉS',
    ...Object.entries(result.category_scores).map(
      ([category, score]) =>
        `${scoreCategoryLabel(category)} : ${score}/100 — couverture ${result.category_coverage[category] ?? 0}/100`
    ),
    '',
    "Le score est calculé uniquement sur les contrôles réellement évalués. Un contrôle non mesuré ou à revoir réduit la couverture sans devenir un zéro.",
    '',
  ]

  if (result.findings.length) {
    lines.push('CORRECTIONS PRIORITAIRES', '')
    result.findings.forEach((finding, index) => {
      lines.push(
        `${index + 1}. ${finding.title}`,
        `Domaine : ${findingCategoryLabel(finding.category)} — ${severityLabel(finding.severity)}`,
        `Observation : ${finding.finding}`,
        `Pourquoi corriger ce point : ${categoryImpact(finding.category)}`
      )
      if (finding.recommendation) {
        lines.push(`Ce que vous pouvez faire maintenant : ${finding.recommendation}`)
      }
      if (finding.evidence_excerpt) lines.push(`Preuve observée : ${finding.evidence_excerpt}`)
      if (finding.evidence_source_url) lines.push(`Source contrôlée : ${finding.evidence_source_url}`)
      lines.push('')
    })
  } else {
    lines.push(
      'AUCUN ÉCART PRIORITAIRE RETENU',
      'C’est favorable sur les contrôles couverts. Le pré-audit reste volontairement borné.',
      ''
    )
  }

  lines.push(
    'PROCHAINE ÉTAPE',
    "Novekia peut élargir le périmètre, approfondir le SEO et les signaux utiles au GEO/AEO, confirmer les causes, prioriser les corrections et vérifier le résultat après remédiation.",
    `Contact : ${siteConfig.contact.email}`,
    '',
    'Pré-audit public borné : ce document ne constitue ni un score Google, ni une certification, ni un audit exhaustif, ni un score GEO/AEO officiel, ni une garantie de positionnement.'
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
          `Score public: ${report.public_audit_score}/100`,
          `Couverture publique: ${report.coverage}/100`,
          `Méthode: ${report.score_version}`,
          `Constats exploitables: ${report.total_findings}`,
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
