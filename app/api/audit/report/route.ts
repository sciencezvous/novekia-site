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
    'Ce signal mérite une mesure dédiée : il peut affecter l’expérience, mais le pré-audit public ne mesure pas les Core Web Vitals de façon exhaustive.',
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

function categoryLabel(value: string) {
  return CATEGORY_LABELS[value] ?? value.replaceAll('_', ' ')
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

function visibilityScore(result: Awaited<ReturnType<typeof callAuditIngress>>) {
  return Math.max(0, Math.min(100, 100 - result.opportunity_index))
}

function scoreVerdict(
  result: Awaited<ReturnType<typeof callAuditIngress>>
) {
  const score = visibilityScore(result)
  if (score >= 90) {
    return result.total_findings > 0
      ? 'Très bon niveau observé — quelques corrections ciblées peuvent encore améliorer votre visibilité.'
      : 'Très bon niveau observé sur l’échantillon analysé.'
  }
  if (score >= 75) {
    return 'Bon niveau observé — quelques corrections restent utiles.'
  }
  if (score >= 55) {
    return 'Base exploitable — plusieurs améliorations peuvent renforcer votre visibilité.'
  }
  return 'Votre site dispose d’une base à renforcer avec des corrections prioritaires.'
}

function reportHtml(result: Awaited<ReturnType<typeof callAuditIngress>>) {
  const hasFindings = result.findings.length > 0
  const score = visibilityScore(result)
  const verdict = scoreVerdict(result)
  const verdictDetail = hasFindings
    ? 'Les corrections ci-dessous sont les points les plus utiles retenus dans l’échantillon. Chacune est associée à une observation et, lorsqu’elle est disponible, à une preuve vérifiable.'
    : 'Aucun écart prioritaire n’a été retenu sur les pages contrôlées. Ce résultat est favorable, mais il ne constitue pas une validation exhaustive du site.'
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
        <p style="margin:0 0 7px;font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#2563eb">${String(index + 1).padStart(2, '0')} · ${escapeHtml(categoryLabel(finding.category))} · ${escapeHtml(severityLabel(finding.severity))}</p>
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

  const nextStepTitle = hasFindings
    ? 'Gagner des points en corrigeant les priorités détectées'
    : 'Confirmer ce bon résultat sur un périmètre plus large'
  const nextStepText = hasFindings
    ? 'L’audit complet Novekia étend la collecte, confirme les causes, priorise les corrections SEO/GEO/AEO, documente les preuves par page et permet de mesurer le résultat après remédiation.'
    : 'Le pré-audit ne couvre qu’un échantillon public. L’audit complet Novekia étend l’analyse SEO/GEO/AEO, vérifie les signaux d’autorité et de conversion et recherche des optimisations plus fines.'

  return `<!doctype html>
<html lang="fr"><body style="margin:0;background:#f5f5f4;font-family:Arial,sans-serif;color:#1c1917">
  <div style="max-width:720px;margin:0 auto;padding:24px 12px">
    <div style="background:#111827;color:white;padding:28px;border-radius:10px 10px 0 0">
      <p style="margin:0 0 8px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#93c5fd">NOVEKIA · Pré-audit public</p>
      <h1 style="margin:0;font-size:26px">Votre visibilité web & IA — ${escapeHtml(result.target_domain)}</h1>
    </div>
    <div style="background:white;padding:28px;border-radius:0 0 10px 10px">
      <div style="padding:20px;background:#eff6ff;border-left:4px solid #2563eb">
        <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#1d4ed8">Score de visibilité observée</p>
        <div style="margin-top:6px;font-size:42px;font-weight:800;color:#1d4ed8">${score}/100</div>
        <h2 style="margin:10px 0 0;font-size:22px;color:#111827">${escapeHtml(verdict)}</h2>
        <p style="margin:9px 0 0;line-height:1.65;color:#475569">${escapeHtml(verdictDetail)}</p>
      </div>

      <div style="display:flex;gap:10px;flex-wrap:wrap;margin:24px 0">
        <div style="padding:14px 16px;border:1px solid #e7e5e4;border-radius:8px"><div style="font-size:12px;color:#78716c">Couverture de l’échantillon</div><strong style="font-size:24px">${result.coverage_score}/100</strong></div>
        ${confidenceCard}
        <div style="padding:14px 16px;border:1px solid #e7e5e4;border-radius:8px"><div style="font-size:12px;color:#78716c">Pages analysées</div><strong style="font-size:24px">${result.pages_collected}/${result.pages_planned}</strong></div>
      </div>
      <p style="font-size:13px;line-height:1.55;color:#57534e"><strong>Comment lire le score :</strong> 100/100 signifie qu’aucun écart pondéré n’a été retenu dans l’échantillon analysé. Ce score n’est ni une certification ni une note exhaustive de l’ensemble du site.</p>

      ${positives}
      <h2 style="margin:30px 0 8px;font-size:21px">Pour gagner encore des points</h2>
      ${findings || '<div style="padding:16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px"><strong>Aucun écart prioritaire retenu.</strong><p style="margin:7px 0 0;line-height:1.6;color:#475569">C’est favorable sur les pages analysées. L’audit complet permet toutefois d’élargir la couverture et de rechercher des optimisations plus fines.</p></div>'}

      <div style="margin-top:30px;padding:22px;background:#111827;color:white;border-radius:10px">
        <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#93c5fd">Prochaine étape recommandée</p>
        <h2 style="margin:8px 0 0;font-size:21px">${escapeHtml(nextStepTitle)}</h2>
        <p style="margin:10px 0 0;line-height:1.65;color:#dbeafe">${escapeHtml(nextStepText)}</p>
        <p style="margin:18px 0 0"><a href="${siteConfig.url}/#contact" style="display:inline-block;background:#2563eb;color:white;text-decoration:none;padding:12px 16px;border-radius:6px;font-weight:700">Améliorer ma visibilité avec Novekia</a></p>
      </div>

      <p style="margin:24px 0 0;font-size:11px;line-height:1.55;color:#78716c">Pré-audit public borné fondé sur des informations accessibles publiquement. Il ne constitue ni une certification, ni un audit exhaustif, ni une garantie de positionnement. Audit ID : ${escapeHtml(result.audit_id)} · <a href="${siteConfig.url}/politique-de-confidentialite" style="color:#57534e">Politique de confidentialité</a></p>
    </div>
  </div>
</body></html>`
}

function reportText(result: Awaited<ReturnType<typeof callAuditIngress>>) {
  const hasFindings = result.findings.length > 0
  const score = visibilityScore(result)
  const lines = [
    'NOVEKIA — PRÉ-AUDIT PUBLIC',
    `Site : ${result.target_domain}`,
    '',
    `SCORE DE VISIBILITÉ OBSERVÉE : ${score}/100`,
    scoreVerdict(result),
    '',
    `Couverture de l'échantillon : ${result.coverage_score}/100`,
    hasFindings
      ? `Confiance des constats : ${result.confidence_score}/100`
      : 'Qualification : aucun constat à qualifier',
    `Pages analysées : ${result.pages_collected}/${result.pages_planned}`,
    '',
    "100/100 signifie qu'aucun écart pondéré n'a été retenu dans l'échantillon analysé. Ce score n'est pas une certification ni une note exhaustive de l'ensemble du site.",
    '',
  ]

  if (result.findings.length) {
    lines.push('POUR GAGNER ENCORE DES POINTS', '')
    result.findings.forEach((finding, index) => {
      lines.push(
        `${index + 1}. ${finding.title}`,
        `Domaine : ${categoryLabel(finding.category)} — ${severityLabel(finding.severity)}`,
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
      "C'est favorable sur les pages analysées. Le pré-audit reste volontairement borné et ne valide pas l'ensemble du site.",
      ''
    )
  }

  lines.push(
    'PROCHAINE ÉTAPE RECOMMANDÉE',
    hasFindings
      ? 'Améliorer ce score en corrigeant les priorités détectées avec un audit complet Novekia.'
      : "Confirmer ce bon résultat sur l'ensemble du site avec un audit complet Novekia.",
    "L'audit complet étend l'analyse SEO/GEO/AEO, confirme les causes, priorise les corrections, documente les preuves par page et permet de vérifier le résultat après remédiation.",
    `Contact : ${siteConfig.contact.email}`,
    '',
    'Pré-audit public borné : ce document ne constitue ni une certification, ni un audit exhaustif, ni une garantie de positionnement.'
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
    const score = visibilityScore(report)

    const resend = new Resend(resendKey)
    const visitorSend = await resend.emails.send({
      from,
      to: email,
      replyTo: siteConfig.contact.email,
      subject: `Votre score de visibilité Novekia : ${score}/100 — ${report.target_domain}`,
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
          `Score de visibilité observée: ${score}/100`,
          `Indice d'opportunité interne: ${report.opportunity_index}/100`,
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
