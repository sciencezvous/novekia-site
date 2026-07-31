import { conciergePathLabels } from '../config'
import type { RecomputedConciergeSubmission } from './contracts'
import {
  buildConfirmationIdempotencyKey,
  buildInternalIdempotencyKey,
} from './idempotency'
import { escapeEmailHtml, normalizeSubmissionText } from './sanitization'

export type ConciergeEmailMessage = {
  from: string
  to: string
  replyTo?: string
  subject: string
  html: string
  text: string
  idempotencyKey: string
}

type EmailAddresses = {
  from: string
  internalTo: string
}

function textValue(value: { value: string } | null | undefined): string {
  return value?.value ?? 'Non renseigné'
}

function listValue(values: readonly { value: string }[]): string {
  return values.map((item) => item.value).join(' · ') || 'Aucun signal particulier'
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Europe/Paris',
  }).format(new Date(value))
}

function safeSubjectPart(value: string, maximum = 90): string {
  return normalizeSubmissionText(value, maximum).replace(/[\r\n]/g, ' ')
}

function renderHtmlRows(rows: readonly [string, string][]): string {
  return rows
    .map(
      ([label, value]) => `<tr style="border-bottom:1px solid #e5e7eb">
<th scope="row" style="padding:10px 12px 10px 0;text-align:left;vertical-align:top;color:#374151;width:190px">${escapeEmailHtml(label)}</th>
<td style="padding:10px 0;color:#111827;white-space:pre-wrap">${escapeEmailHtml(value).replace(/\n/g, '<br>')}</td>
</tr>`,
    )
    .join('')
}

function renderTextRows(rows: readonly [string, string][]): string {
  return rows.map(([label, value]) => `${label}: ${value}`).join('\n')
}

function isCyberSubmission(submission: RecomputedConciergeSubmission): boolean {
  return submission.answers['solutions.need_category'] ===
    'cybersecurity_authorized_audit'
}

function assistedText(submission: RecomputedConciergeSubmission): string | null {
  if (isCyberSubmission(submission)) return null
  const assisted = submission.assistedSummary
  if (!assisted) return null
  return [
    assisted.context.value,
    assisted.objective.value,
    assisted.mainNeed.value,
    assisted.recommendedNextAction.value,
  ]
    .filter((value): value is string => Boolean(value))
    .join(' · ')
    .slice(0, 1_800)
}

export function buildInternalConciergeEmail(
  submission: RecomputedConciergeSubmission,
  addresses: EmailAddresses,
): ConciergeEmailMessage {
  const summary = submission.session.summary!
  const qualification = submission.session.qualificationResult!
  const isCyber = isCyberSubmission(submission)
  const pole = conciergePathLabels[submission.activePath]
  const serviceCategory = summary.recommendedServiceCategory?.value ?? 'À confirmer'
  const technicalNeed = isCyber
    ? 'Détails techniques volontairement exclus de l’e-mail ; contrôle humain du périmètre requis.'
    : textValue(summary.mainNeed)
  const cyberRedacted = isCyber ? technicalNeed : null
  const rows: [string, string][] = [
    ['Identifiant de soumission', submission.submissionId],
    ['Reçu le', formatDate(submission.receivedAt)],
    ['Page source', submission.sourcePage],
    ['Pôle', pole],
    ['Catégorie de service', serviceCategory],
    ['Nom', submission.contact.fullName],
    ['Entreprise', submission.contact.company],
    ['Fonction', submission.contact.role ?? 'Non renseignée'],
    ['E-mail', submission.contact.professionalEmail],
    ['Téléphone', submission.contact.phone ?? 'Non renseigné'],
    ['Préférence de contact', submission.contact.preferredContact ?? 'Non renseignée'],
    ['Contexte', cyberRedacted ?? textValue(summary.context)],
    ['Objectif', cyberRedacted ?? textValue(summary.objective)],
    ['Situation actuelle', cyberRedacted ?? textValue(summary.currentSituation)],
    ['Cible ou besoin principal', cyberRedacted ?? textValue(summary.target)],
    ['Besoin technique', technicalNeed],
    ['Contraintes', cyberRedacted ?? listValue(summary.constraints)],
    ['Délai', textValue(summary.timeframe)],
    ['Budget indicatif déclaré', textValue(summary.indicativeBudget)],
    ['Informations manquantes', listValue(summary.missingInformation)],
    ['Points de vigilance', listValue(summary.humanReviewPoints)],
    ['Revue humaine requise', submission.session.humanReviewRequired ? 'Oui' : 'Non'],
    ['Qualification interne', qualification.qualificationLevel],
    ['Complétude interne', `${qualification.completenessScore}/100`],
    ['Cohérence client / serveur', submission.clientServerConsistent ? 'Conforme' : 'Écart détecté — état serveur retenu'],
    ['Consentement contact', `${submission.consent.contact.consentTextVersion} — ${submission.consent.contact.consentedAt}`],
    ['Politique de confidentialité', `${submission.consent.privacy.privacyPolicyVersion} — ${submission.consent.privacy.consentedAt}`],
  ]
  if (isCyber) {
    rows.push([
      'Avertissement cybersécurité',
      'La preuve de maîtrise, l’autorisation écrite et le périmètre doivent être contrôlés humainement avant toute intervention.',
    ])
  }

  const assisted = assistedText(submission)
  const assistedHtml = assisted
    ? `<h2 style="font-size:17px;margin:28px 0 10px">Synthèse assistée — non validée humainement</h2><p style="color:#374151;line-height:1.6">${escapeEmailHtml(assisted)}</p>`
    : ''
  const assistedPlain = assisted
    ? `\n\nSYNTHÈSE ASSISTÉE — NON VALIDÉE HUMAINEMENT\n${assisted}`
    : ''
  const subject = `[Nouveau lead concierge] ${safeSubjectPart(pole, 45)} — ${safeSubjectPart(submission.contact.company, 80)}`.slice(0, 180)

  return {
    from: addresses.from,
    to: addresses.internalTo,
    replyTo: submission.contact.professionalEmail,
    subject,
    html: `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;background:#f3f4f6;font-family:Arial,sans-serif"><main style="max-width:720px;margin:0 auto;padding:24px"><section style="background:#fff;padding:28px;border-radius:8px"><h1 style="font-size:22px;margin:0 0 18px">Nouvelle demande qualifiée — Assistant Novekia</h1><table style="width:100%;border-collapse:collapse"><tbody>${renderHtmlRows(rows)}</tbody></table>${assistedHtml}<p style="margin-top:28px;font-size:12px;color:#6b7280">La qualification et la synthèse doivent être contrôlées humainement. Cet e-mail ne vaut ni acceptation de mission ni devis.</p></section></main></body></html>`,
    text: `NOUVELLE DEMANDE QUALIFIÉE — ASSISTANT NOVEKIA\n\n${renderTextRows(rows)}${assistedPlain}\n\nLa qualification et la synthèse doivent être contrôlées humainement. Cet e-mail ne vaut ni acceptation de mission ni devis.`,
    idempotencyKey: buildInternalIdempotencyKey(submission.submissionId),
  }
}

export function buildVisitorConfirmationEmail(
  submission: RecomputedConciergeSubmission,
  addresses: EmailAddresses,
): ConciergeEmailMessage {
  const isCyber = isCyberSubmission(submission)
  const pole = conciergePathLabels[submission.activePath]
  const declaredNeed = isCyber
    ? 'Votre demande de qualification en cybersécurité.'
    : (submission.session.summary?.objective?.value ?? 'Votre demande de cadrage.').slice(0, 300)
  const cyberNotice = isCyber
    ? ' La réception de cette demande ne vaut ni autorisation, ni acceptation de mission. Le périmètre et les justificatifs devront être vérifiés avant toute intervention.'
    : ''

  return {
    from: addresses.from,
    to: submission.contact.professionalEmail,
    replyTo: addresses.internalTo,
    subject: 'Nous avons bien reçu votre demande — Novekia',
    html: `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;background:#f3f4f6;font-family:Arial,sans-serif"><main style="max-width:620px;margin:0 auto;padding:24px"><section style="background:#fff;padding:28px;border-radius:8px"><h1 style="font-size:22px;margin:0 0 18px">Votre demande a bien été reçue.</h1><p style="line-height:1.6;color:#374151">Bonjour ${escapeEmailHtml(submission.contact.fullName)},</p><p style="line-height:1.6;color:#374151">Votre demande concerne le pôle <strong>${escapeEmailHtml(pole)}</strong>. Résumé déclaré : ${escapeEmailHtml(declaredNeed)}</p><p style="line-height:1.6;color:#374151">Novekia effectuera un contrôle humain des informations fournies avant de vous recontacter. Aucune prestation n’est acceptée automatiquement.${escapeEmailHtml(cyberNotice)}</p><p style="line-height:1.6;color:#374151">Pour corriger une information, répondez simplement à cet e-mail ou écrivez à <a href="mailto:contact@novekia.fr">contact@novekia.fr</a>.</p><p style="font-size:13px;color:#6b7280"><a href="https://novekia.fr/politique-de-confidentialite">Politique de confidentialité</a><br>Novekia — 41 rue du Trève, 01480 Villeneuve, France</p></section></main></body></html>`,
    text: `VOTRE DEMANDE A BIEN ÉTÉ REÇUE\n\nBonjour ${submission.contact.fullName},\n\nVotre demande concerne le pôle ${pole}. Résumé déclaré : ${declaredNeed}\n\nNovekia effectuera un contrôle humain des informations fournies avant de vous recontacter. Aucune prestation n’est acceptée automatiquement.${cyberNotice}\n\nPour corriger une information, répondez à cet e-mail ou écrivez à contact@novekia.fr.\n\nPolitique de confidentialité : https://novekia.fr/politique-de-confidentialite\nNovekia — 41 rue du Trève, 01480 Villeneuve, France`,
    idempotencyKey: buildConfirmationIdempotencyKey(submission.submissionId),
  }
}
