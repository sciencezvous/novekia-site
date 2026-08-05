import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import {
  sanitizeAttribution,
  type LeadAttribution,
} from '@/lib/lead-attribution'
import { isContactNeed } from '@/lib/contact-needs'

// Allowed budgets matching the form options
const ALLOWED_BUDGETS = [
  'Non défini',
  'Moins de 5 000 €',
  'De 5 000 € à 15 000 €',
  'De 15 000 € à 50 000 €',
  'Plus de 50 000 €',
]

// Email regex pattern for validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type ContactRequestBody = Record<string, unknown>

// Escapes HTML special characters to prevent XSS
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (char) => map[char])
}

// Formats date to French locale
function formatDateFr(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Europe/Paris',
  }).format(date)
}

// Generates HTML email body
function generateEmailHtml(data: {
  name: string
  company: string
  email: string
  phone: string
  need: string
  budget: string
  description: string
  attribution: LeadAttribution
}): string {
  const date = formatDateFr(new Date())

  const rows = [
    { label: 'Nom', value: data.name },
    data.company ? { label: 'Entreprise', value: data.company } : null,
    { label: 'Email', value: data.email },
    data.phone ? { label: 'Téléphone', value: data.phone } : null,
    { label: 'Besoin', value: data.need },
    { label: 'Budget', value: data.budget },
    { label: 'Description', value: data.description },
    data.attribution.landingPath
      ? { label: 'Page d’entrée', value: data.attribution.landingPath }
      : null,
    data.attribution.currentPath
      ? { label: 'Page de conversion', value: data.attribution.currentPath }
      : null,
    data.attribution.referrer
      ? { label: 'Référent', value: data.attribution.referrer }
      : null,
    data.attribution.utmSource
      ? { label: 'UTM source', value: data.attribution.utmSource }
      : null,
    data.attribution.utmMedium
      ? { label: 'UTM medium', value: data.attribution.utmMedium }
      : null,
    data.attribution.utmCampaign
      ? { label: 'UTM campagne', value: data.attribution.utmCampaign }
      : null,
    data.attribution.utmContent
      ? { label: 'UTM contenu', value: data.attribution.utmContent }
      : null,
    data.attribution.utmTerm
      ? { label: 'UTM terme', value: data.attribution.utmTerm }
      : null,
    { label: 'Reçu le', value: date },
  ].filter(Boolean)

  const rowsHtml = rows
    .map(
      (row) =>
        `<tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 12px 0; font-weight: 600; color: #374151; width: 150px;">${escapeHtml(row!.label)}</td>
      <td style="padding: 12px 0; color: #1f2937;">${escapeHtml(row!.value).replace(/\n/g, '<br>')}</td>
    </tr>`
    )
    .join('')

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 32px;">
      <h1 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 700; color: #1f2937;">Nouvelle demande Novekia</h1>

      <p style="margin: 0 0 24px 0; color: #4b5563; line-height: 1.6;">
        Vous avez reçu une nouvelle demande de la part de <strong>${escapeHtml(data.name)}</strong> concernant <strong>${escapeHtml(data.need)}</strong>.
      </p>

      <table style="width: 100%; border-collapse: collapse; margin: 0 0 32px 0;">
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div style="background-color: #f3f4f6; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px; margin: 0 0 24px 0;">
        <p style="margin: 0; color: #6b7280; font-size: 14px;">
          Vous pouvez répondre directement à cette personne via son adresse email indiquée ci-dessus.
        </p>
      </div>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

      <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
        Cet email a été généré automatiquement par le formulaire de contact Novekia.
      </p>
    </div>
  </div>
</body>
</html>`
}

// Generates plain text email body
function generateEmailText(data: {
  name: string
  company: string
  email: string
  phone: string
  need: string
  budget: string
  description: string
  attribution: LeadAttribution
}): string {
  const date = new Date().toLocaleString('fr-FR', {
    timeZone: 'Europe/Paris',
  })

  let text = `NOUVELLE DEMANDE NOVEKIA\n`
  text += `${'='.repeat(40)}\n\n`
  text += `Nom: ${data.name}\n`
  if (data.company) text += `Entreprise: ${data.company}\n`
  text += `Email: ${data.email}\n`
  if (data.phone) text += `Téléphone: ${data.phone}\n`
  text += `Besoin: ${data.need}\n`
  text += `Budget: ${data.budget}\n`
  text += `\nDescription:\n${data.description}\n`
  if (data.attribution.landingPath) {
    text += `\nPage d’entrée: ${data.attribution.landingPath}\n`
  }
  if (data.attribution.currentPath) {
    text += `Page de conversion: ${data.attribution.currentPath}\n`
  }
  if (data.attribution.referrer) {
    text += `Référent: ${data.attribution.referrer}\n`
  }
  if (data.attribution.utmSource) {
    text += `UTM source: ${data.attribution.utmSource}\n`
  }
  if (data.attribution.utmMedium) {
    text += `UTM medium: ${data.attribution.utmMedium}\n`
  }
  if (data.attribution.utmCampaign) {
    text += `UTM campagne: ${data.attribution.utmCampaign}\n`
  }
  if (data.attribution.utmContent) {
    text += `UTM contenu: ${data.attribution.utmContent}\n`
  }
  if (data.attribution.utmTerm) {
    text += `UTM terme: ${data.attribution.utmTerm}\n`
  }
  text += `\nReçu le: ${date}\n`

  return text
}

export async function POST(request: NextRequest) {
  // Only accept POST requests
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
  }

  // Check environment variables
  const resendKey = process.env.RESEND_API_KEY
  const contactTo = process.env.CONTACT_TO
  const contactFrom = process.env.CONTACT_FROM

  if (!resendKey || !contactTo || !contactFrom) {
    return NextResponse.json(
      { error: 'Configuration serveur incomplète' },
      { status: 503 }
    )
  }

  try {
    // Parse request body
    let formData: ContactRequestBody
    try {
      const data = await request.json()
      formData = data
    } catch {
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      )
    }

    // Validate request size (prevent large payloads)
    const requestSize = JSON.stringify(formData).length
    if (requestSize > 50000) {
      return NextResponse.json(
        { error: 'Données trop volumineuses' },
        { status: 413 }
      )
    }

    // Extract and validate fields
    const name = String(formData.name ?? '').trim()
    const company = String(formData.company ?? '').trim()
    const email = String(formData.email ?? '').trim()
    const phone = String(formData.phone ?? '').trim()
    const need = String(formData.need ?? '').trim()
    const budget = String(formData.budget ?? '').trim()
    const description = String(formData.description ?? '').trim()
    const consent = formData.consent === 'on' || formData.consent === true
    const website = String(formData.website ?? '').trim() // honeypot
    const attribution = sanitizeAttribution(formData.attribution)

    // Honeypot check: if website field is filled, return success without sending
    if (website) {
      return NextResponse.json({ success: true })
    }

    // Validate name
    if (!name || name.length < 2 || name.length > 80) {
      return NextResponse.json(
        { error: 'Nom invalide (2 à 80 caractères)' },
        { status: 400 }
      )
    }

    // Validate company
    if (company && company.length > 120) {
      return NextResponse.json(
        { error: 'Entreprise trop longue (max 120 caractères)' },
        { status: 400 }
      )
    }

    // Validate email
    if (!email || !EMAIL_REGEX.test(email) || email.length > 254) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      )
    }

    // Validate phone
    if (phone && phone.length > 40) {
      return NextResponse.json(
        { error: 'Téléphone trop long (max 40 caractères)' },
        { status: 400 }
      )
    }

    // Validate need
    if (!need || !isContactNeed(need)) {
      return NextResponse.json(
        { error: 'Besoin invalide' },
        { status: 400 }
      )
    }

    // Validate budget
    if (budget && !ALLOWED_BUDGETS.includes(budget)) {
      return NextResponse.json(
        { error: 'Budget invalide' },
        { status: 400 }
      )
    }

    // Validate description
    if (!description || description.length < 20 || description.length > 4000) {
      return NextResponse.json(
        { error: 'Description invalide (20 à 4000 caractères)' },
        { status: 400 }
      )
    }

    // Validate consent
    if (!consent) {
      return NextResponse.json(
        { error: 'Consentement requis' },
        { status: 400 }
      )
    }

    // Initialize Resend client
    const resend = new Resend(resendKey)

    // Prepare email data
    const emailData = {
      name,
      company,
      email,
      phone,
      need,
      budget,
      description,
      attribution,
    }

    // Determine email subject (use company if available, otherwise name)
    const subject = `Nouvelle demande Novekia — ${need} — ${company || name}`

    // Send email via Resend
    const result = await resend.emails.send({
      from: contactFrom,
      to: contactTo,
      replyTo: email,
      subject,
      html: generateEmailHtml(emailData),
      text: generateEmailText(emailData),
    })

    // Check if send was successful
    if (result.error) {
      return NextResponse.json(
        { error: 'Échec de l\'envoi' },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 502 }
    )
  }
}
