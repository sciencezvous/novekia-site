'use client'

import { useState } from 'react'
import { track } from '@vercel/analytics'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { PrimaryButton } from './primary-button'
import { cn } from '@/lib/utils'
import {
  getStoredAttribution,
  type LeadAttribution,
} from '@/lib/lead-attribution'

type ContactFormProps = {
  className?: string
}

type FieldName = 'name' | 'company' | 'email' | 'phone' | 'need' | 'budget' | 'message' | 'consent'
type FormErrors = Partial<Record<FieldName, string>>
type SubmissionStatus = 'idle' | 'loading' | 'success' | 'error'

const needOptions = [
  'Logiciel sur mesure',
  'Intelligence artificielle locale',
  'Station ou serveur IA',
  'Infrastructure de calcul',
  'Application web',
  'SEO et GEO',
  'Audit technique',
  'Autre',
]

const budgetOptions = [
  'Non défini',
  'Moins de 5 000 €',
  'De 5 000 € à 15 000 €',
  'De 15 000 € à 50 000 €',
  'Plus de 50 000 €',
]

function validateContactForm(formData: FormData): FormErrors {
  const errors: FormErrors = {}
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const need = String(formData.get('need') ?? '')
  const message = String(formData.get('message') ?? '').trim()

  if (!name || name.length < 2) errors.name = 'Indiquez votre nom et prénom.'
  if (!email) {
    errors.email = 'Indiquez votre adresse e-mail professionnelle.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Saisissez une adresse e-mail valide.'
  }
  if (!need) errors.need = 'Sélectionnez un type de besoin.'
  if (!message || message.length < 20) errors.message = 'Décrivez votre projet et son contexte (minimum 20 caractères).'
  if (formData.get('consent') !== 'on') {
    errors.consent = 'Votre consentement est nécessaire pour traiter la demande.'
  }

  return errors
}

async function submitContactRequest(
  formData: FormData,
  attribution: LeadAttribution,
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.get('name'),
        company: formData.get('company'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        need: formData.get('need'),
        budget: formData.get('budget'),
        description: formData.get('message'),
        consent: formData.get('consent'),
        website: formData.get('website'),
        attribution,
      }),
    })

    if (!response.ok) {
      if (response.status >= 500) {
        return { success: false, error: 'Erreur serveur. Réessayez dans quelques instants.' }
      }
      const data = await response.json().catch(() => ({}))
      return { success: false, error: data.error || 'Erreur lors de l\'envoi.' }
    }

    const data = await response.json()
    return { success: data.success || false }
  } catch {
    return { success: false, error: 'La demande n\'a pas pu être envoyée. Réessayez dans quelques instants ou écrivez à contact@novekia.fr.' }
  }
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} className="text-sm text-destructive" role="alert">
      {message}
    </p>
  ) : null
}

function trackSuccessfulSubmission(
  attribution: LeadAttribution,
  need: string,
) {
  try {
    track('contact_form_submitted', {
      source: attribution.utmSource || attribution.referrerHost || 'direct',
      landing_path: attribution.landingPath || 'unknown',
      need,
    })
  } catch {
    // Analytics must never block the confirmation shown to the visitor.
  }
}

export function ContactForm({ className }: ContactFormProps) {
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<SubmissionStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formElement = event.currentTarget

    // Prevent double submissions
    if (status === 'loading') return

    const nextErrors = validateContactForm(new FormData(formElement))
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setStatus('idle')
      setErrorMessage('')
      setSuccessMessage('')
      const firstInvalidName = Object.keys(nextErrors)[0] as FieldName
      const firstInvalidField = formElement.elements.namedItem(firstInvalidName)
      if (firstInvalidField instanceof HTMLElement) firstInvalidField.focus()
      return
    }

    setStatus('loading')
    setErrorMessage('')
    setSuccessMessage('')

    const attribution = getStoredAttribution()
    const result = await submitContactRequest(
      new FormData(formElement),
      attribution,
    )

    if (result.success) {
      trackSuccessfulSubmission(
        attribution,
        String(new FormData(formElement).get('need') ?? 'unknown'),
      )
      setStatus('success')
      setSuccessMessage('Votre demande a bien été transmise à Novekia. Nous reviendrons vers vous dans les meilleurs délais.')
      formElement.reset()
      setErrors({})
      // Focus on success message
      const statusElement = document.getElementById('form-status-message')
      statusElement?.focus()
    } else {
      setStatus('error')
      setErrorMessage(result.error || 'La demande n\'a pas pu être envoyée. Réessayez dans quelques instants ou écrivez à contact@novekia.fr.')
      // Focus on error message
      const statusElement = document.getElementById('form-status-message')
      statusElement?.focus()
    }
  }

  const fieldClassName = 'flex flex-col gap-2'
  const controlClassName = 'h-11 rounded-md bg-background/40'
  const selectClassName = 'h-11 w-full rounded-md border border-input bg-background/40 px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20'

  return (
    <form onSubmit={handleSubmit} className={cn('flex flex-col gap-5', className)} noValidate>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Les champs marqués d’un astérisque sont obligatoires. Sans ces
        informations, la demande ne peut pas être transmise.
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className={fieldClassName}>
          <Label htmlFor="contact-name">Nom et prénom <span aria-hidden="true">*</span></Label>
          <Input id="contact-name" name="name" autoComplete="name" className={controlClassName} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'contact-name-error' : undefined} />
          <FieldError id="contact-name-error" message={errors.name} />
        </div>
        <div className={fieldClassName}>
          <Label htmlFor="contact-company">Entreprise</Label>
          <Input id="contact-company" name="company" autoComplete="organization" className={controlClassName} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className={fieldClassName}>
          <Label htmlFor="contact-email">Adresse e-mail professionnelle <span aria-hidden="true">*</span></Label>
          <Input id="contact-email" name="email" type="email" autoComplete="email" className={controlClassName} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'contact-email-error' : undefined} />
          <FieldError id="contact-email-error" message={errors.email} />
        </div>
        <div className={fieldClassName}>
          <Label htmlFor="contact-phone">Téléphone — facultatif</Label>
          <Input id="contact-phone" name="phone" type="tel" autoComplete="tel" className={controlClassName} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className={fieldClassName}>
          <Label htmlFor="contact-need">Type de besoin <span aria-hidden="true">*</span></Label>
          <select id="contact-need" name="need" defaultValue="" className={selectClassName} aria-invalid={Boolean(errors.need)} aria-describedby={errors.need ? 'contact-need-error' : undefined}>
            <option value="" disabled>Sélectionnez un besoin</option>
            {needOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          <FieldError id="contact-need-error" message={errors.need} />
        </div>
        <div className={fieldClassName}>
          <Label htmlFor="contact-budget">Budget indicatif</Label>
          <select id="contact-budget" name="budget" defaultValue="Non défini" className={selectClassName}>
            {budgetOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          <p className="text-xs leading-relaxed text-muted-foreground">Fourchette indicative pour qualifier le contexte, sans valeur de tarif officiel.</p>
        </div>
      </div>

      <div className={fieldClassName}>
        <Label htmlFor="contact-message">Description du projet <span aria-hidden="true">*</span></Label>
        <Textarea id="contact-message" name="message" rows={7} className="min-h-40 resize-y rounded-md bg-background/40" placeholder="Décrivez votre besoin, votre environnement actuel, vos principales contraintes et le résultat attendu." aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'contact-message-error' : undefined} />
        <FieldError id="contact-message-error" message={errors.message} />
      </div>

      {/* Honeypot field - hidden from users */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
        style={{ display: 'none' }}
      />

      <div className="flex flex-col gap-2">
        <div className="flex min-h-11 items-start gap-3">
          <input id="contact-consent" name="consent" type="checkbox" className="mt-0.5 size-5 shrink-0 rounded border-2 border-muted-foreground/40 bg-background/60 accent-primary transition-colors checked:border-primary checked:bg-primary hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background" aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? 'contact-consent-error' : undefined} />
          <Label htmlFor="contact-consent" className="text-sm font-normal leading-relaxed text-muted-foreground">
            J’ai pris connaissance de la{' '}
            <a
              href="/politique-de-confidentialite"
              className="rounded-sm text-primary underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              politique de confidentialité
            </a>. Les informations transmises sont utilisées par Novekia uniquement pour traiter ma demande.
          </Label>
        </div>
        <FieldError id="contact-consent-error" message={errors.consent} />
      </div>

      <div className="flex flex-col items-start gap-3">
        <PrimaryButton
          type="submit"
          withArrow
          disabled={status === 'loading'}
          className="w-full sm:w-auto"
        >
          {status === 'loading' ? 'Envoi en cours...' : 'Envoyer ma demande'}
        </PrimaryButton>
        <p className="text-sm text-muted-foreground">
          Vous pouvez également écrire directement à{' '}
          <a href="mailto:contact@novekia.fr" className="text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">contact@novekia.fr</a>
        </p>

        {/* Success message */}
        {status === 'success' && (
          <div
            id="form-status-message"
            role="status"
            tabIndex={-1}
            className="w-full border-l-2 border-green-500 bg-green-50 px-4 py-3 text-sm leading-relaxed text-green-900"
          >
            {successMessage}
          </div>
        )}

        {/* Error message */}
        {status === 'error' && (
          <div
            id="form-status-message"
            role="alert"
            tabIndex={-1}
            className="w-full border-l-2 border-destructive bg-destructive/10 px-4 py-3 text-sm leading-relaxed text-destructive"
          >
            {errorMessage}
          </div>
        )}
      </div>
    </form>
  )
}
