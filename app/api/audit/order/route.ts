import { randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import {
  AuditFacadeError,
  clientAddress,
  enforceRateLimit,
  enforceSameOrigin,
  normalizeAuditTarget,
} from '@/lib/audit-server'
import {
  PAID_AUDIT_OFFERS,
  isPaidAuditOfferId,
  type PaidAuditOfferId,
} from '@/lib/audit-paid-offers'
import { siteConfig } from '@/lib/site-config'

export const runtime = 'nodejs'
export const maxDuration = 30

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function text(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
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

function checkoutUrlFor(offerId: PaidAuditOfferId) {
  const keyByOffer: Record<PaidAuditOfferId, string> = {
    optimisation: 'NOVEKIA_AUDIT_CHECKOUT_OPTIMISATION_URL',
    visibility: 'NOVEKIA_AUDIT_CHECKOUT_VISIBILITY_URL',
    authority: 'NOVEKIA_AUDIT_CHECKOUT_AUTHORITY_URL',
  }
  const raw = process.env[keyByOffer[offerId]]?.trim()
  if (!raw) return null

  try {
    const parsed = new URL(raw)
    if (parsed.protocol !== 'https:' || parsed.username || parsed.password) return null
    return parsed.toString()
  } catch {
    return null
  }
}

function jsonError(status: number, message: string) {
  return NextResponse.json(
    { ok: false, message },
    {
      status,
      headers: {
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    }
  )
}

export async function POST(request: NextRequest) {
  try {
    enforceSameOrigin(request)
    enforceRateLimit(`audit:order:${clientAddress(request)}`, 3)

    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      throw new AuditFacadeError(400, 'Données de commande invalides.')
    }

    if (JSON.stringify(body).length > 8_000) {
      throw new AuditFacadeError(413, 'Données de commande trop volumineuses.')
    }

    const offerId = body.offerId
    if (!isPaidAuditOfferId(offerId)) {
      throw new AuditFacadeError(400, 'Offre d’audit invalide.')
    }

    const name = text(body.name, 120)
    const company = text(body.company, 160)
    const email = text(body.email, 254).toLowerCase()
    const phone = text(body.phone, 40)
    const auditId = text(body.auditId, 80)
    const websiteUrl = normalizeAuditTarget(body.websiteUrl)
    const consent = body.consent === true

    if (name.length < 2 || company.length < 2) {
      throw new AuditFacadeError(400, 'Nom et entreprise sont requis.')
    }
    if (!EMAIL_RE.test(email)) {
      throw new AuditFacadeError(400, 'Adresse email invalide.')
    }
    if (auditId && !UUID_RE.test(auditId)) {
      throw new AuditFacadeError(400, 'Référence de pré-audit invalide.')
    }
    if (!consent) {
      throw new AuditFacadeError(
        400,
        'Confirmez votre demande avant d’envoyer la commande.'
      )
    }

    const apiKey = process.env.RESEND_API_KEY?.trim()
    const from = (
      process.env.RESEND_FROM ||
      process.env.AUDIT_REPORT_FROM ||
      process.env.CONTACT_FROM
    )?.trim()
    const leadTo = (
      process.env.AUDIT_LEAD_TO ||
      process.env.CONTACT_TO ||
      siteConfig.contact.email
    ).trim()
    if (!apiKey || !from || !leadTo) {
      throw new AuditFacadeError(
        503,
        'La prise de commande est momentanément indisponible.'
      )
    }

    const offer = PAID_AUDIT_OFFERS[offerId]
    const orderId = randomUUID()
    const checkoutUrl = checkoutUrlFor(offerId)
    const resend = new Resend(apiKey)

    const internalResult = await resend.emails.send({
      from,
      to: [leadTo],
      replyTo: email,
      subject: `[Visibility] Nouvelle commande ${offer.label} — ${company}`,
      text: [
        'NOUVELLE DEMANDE D’AUDIT VISIBILITY',
        `Commande : ${orderId}`,
        `Offre : ${offer.label} — ${offer.priceLabel}`,
        `Client : ${name}`,
        `Entreprise : ${company}`,
        `Email : ${email}`,
        `Téléphone : ${phone || 'non renseigné'}`,
        `Site : ${websiteUrl}`,
        `Pré-audit : ${auditId || 'non renseigné'}`,
        `Paiement : pending_payment`,
        `Checkout configuré : ${checkoutUrl ? 'oui' : 'non'}`,
        '',
        'Ne pas démarrer l’audit complet avant validation du paiement.',
      ].join('\n'),
      html: `
        <h1>Nouvelle demande d’audit Visibility</h1>
        <p><strong>Commande :</strong> ${escapeHtml(orderId)}</p>
        <p><strong>Offre :</strong> ${escapeHtml(offer.label)} — ${escapeHtml(offer.priceLabel)}</p>
        <p><strong>Client :</strong> ${escapeHtml(name)} — ${escapeHtml(company)}</p>
        <p><strong>Email :</strong> ${escapeHtml(email)}</p>
        <p><strong>Téléphone :</strong> ${escapeHtml(phone || 'non renseigné')}</p>
        <p><strong>Site :</strong> ${escapeHtml(websiteUrl)}</p>
        <p><strong>Pré-audit :</strong> ${escapeHtml(auditId || 'non renseigné')}</p>
        <p><strong>Statut :</strong> pending_payment</p>
        <p><strong>Important :</strong> ne pas démarrer l’audit complet avant validation du paiement.</p>
      `,
    })

    if (internalResult.error) {
      console.error('[visibility-order] internal_email_failed', internalResult.error)
      throw new AuditFacadeError(
        502,
        'La demande n’a pas pu être enregistrée. Réessayez dans quelques instants.'
      )
    }

    let confirmationEmailSent = true
    const confirmation = await resend.emails.send({
      from,
      to: [email],
      replyTo: leadTo,
      subject: `Votre demande d’audit Novekia — ${offer.label}`,
      text: [
        `Bonjour ${name},`,
        '',
        `Votre demande ${offer.label} (${offer.priceLabel}) est enregistrée sous la référence ${orderId}.`,
        `Site : ${websiteUrl}`,
        '',
        'Statut : en attente de validation du paiement.',
        'L’audit complet ne démarre qu’après validation du paiement.',
        checkoutUrl ? `Paiement : ${checkoutUrl}` : 'Novekia vous transmettra les modalités de paiement.',
        '',
        `Novekia — ${siteConfig.url}`,
      ].join('\n'),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#111827">
          <p style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#2563eb">NOVEKIA · Visibility</p>
          <h1>Votre demande est enregistrée</h1>
          <p>Bonjour ${escapeHtml(name)},</p>
          <p>Nous avons enregistré votre demande <strong>${escapeHtml(offer.label)}</strong> au tarif public de <strong>${escapeHtml(offer.priceLabel)}</strong>.</p>
          <p><strong>Référence :</strong> ${escapeHtml(orderId)}<br><strong>Site :</strong> ${escapeHtml(websiteUrl)}</p>
          <div style="margin:24px 0;padding:18px;background:#eff6ff;border-left:4px solid #2563eb">
            <strong>Statut : en attente de validation du paiement.</strong>
            <p style="margin:8px 0 0">L’audit complet ne démarre qu’après validation du paiement.</p>
          </div>
          ${checkoutUrl ? `<p><a href="${escapeHtml(checkoutUrl)}" style="display:inline-block;background:#2563eb;color:white;text-decoration:none;padding:12px 16px;font-weight:700">Passer au paiement</a></p>` : '<p>Novekia vous transmettra les modalités de paiement pour finaliser la commande.</p>'}
          <p style="margin-top:28px;font-size:12px;color:#6b7280">Cette confirmation n’est pas une preuve de paiement. L’exécution de l’audit et la remise du rapport premium sont déclenchées uniquement après validation.</p>
        </div>
      `,
    })

    if (confirmation.error) {
      confirmationEmailSent = false
      console.error('[visibility-order] confirmation_email_failed', confirmation.error)
    }

    console.info(
      '[novekia-audit-funnel]',
      JSON.stringify({
        event: 'paid_audit_order_created',
        orderId,
        offerId,
        hasAuditId: Boolean(auditId),
        checkoutConfigured: Boolean(checkoutUrl),
        confirmationEmailSent,
      })
    )

    return NextResponse.json(
      {
        ok: true,
        order_id: orderId,
        status: 'pending_payment',
        offer: {
          id: offer.id,
          label: offer.label,
          price_label: offer.priceLabel,
        },
        checkout_url: checkoutUrl,
        confirmation_email_sent: confirmationEmailSent,
        message: checkoutUrl
          ? 'Demande enregistrée. Le paiement doit être validé avant le démarrage de l’audit complet.'
          : 'Demande enregistrée. Novekia vous transmettra les modalités de paiement avant le démarrage de l’audit complet.',
      },
      {
        status: 201,
        headers: {
          'Cache-Control': 'no-store',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      }
    )
  } catch (error) {
    if (error instanceof AuditFacadeError) {
      return jsonError(error.status, error.publicMessage)
    }

    console.error('[visibility-order] unexpected_error', error)
    return jsonError(500, 'La prise de commande est momentanément indisponible.')
  }
}
