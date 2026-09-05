'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react'
import { PAID_AUDIT_OFFERS, type PaidAuditOfferId } from '@/lib/audit-paid-offers'

type Props = {
  initialAuditId?: string
  initialWebsiteUrl?: string
}

type SuccessPayload = {
  ok: true
  order_id: string
  status: 'pending_payment'
  offer: {
    id: PaidAuditOfferId
    label: string
    price_label: string
  }
  checkout_url: string | null
  confirmation_email_sent: boolean
  message: string
}

export function AuditOrderForm({
  initialAuditId = '',
  initialWebsiteUrl = '',
}: Props) {
  const offer = PAID_AUDIT_OFFERS.full
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState(initialWebsiteUrl)
  const [consent, setConsent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<SuccessPayload | null>(null)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/audit/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerId: 'full',
          name,
          company,
          email,
          phone,
          websiteUrl,
          auditId: initialAuditId,
          consent,
        }),
      })

      const payload = (await response.json()) as
        | SuccessPayload
        | { ok: false; message?: string }

      if (!response.ok || !payload.ok) {
        throw new Error(
          'message' in payload && payload.message
            ? payload.message
            : 'La demande n’a pas pu être enregistrée.'
        )
      }

      setSuccess(payload)
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'La demande n’a pas pu être enregistrée.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="border border-emerald-500/30 bg-emerald-500/[0.055] p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <CheckCircle2 aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-emerald-500" />
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-emerald-500">
              Demande enregistrée
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
              {success.offer.label}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Référence <span className="font-mono text-foreground">{success.order_id}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 border border-border bg-background p-4 text-sm leading-6">
          <strong>Statut : en attente de validation du paiement.</strong>
          <p className="mt-1 text-muted-foreground">
            L’audit Full démarre après validation du paiement. Il comprend le rapport premium et le plan de remédiation, mais pas l’exécution des corrections par Novekia.
          </p>
        </div>

        {success.checkout_url ? (
          <a
            href={success.checkout_url}
            rel="noreferrer"
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 bg-primary px-5 font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Passer au paiement
            <ArrowRight aria-hidden="true" className="size-4" />
          </a>
        ) : (
          <p className="mt-6 text-sm leading-6 text-muted-foreground">
            Novekia vous transmettra les modalités de paiement avant le démarrage de l’audit.
          </p>
        )}

        {!success.confirmation_email_sent && (
          <p className="mt-4 text-xs leading-5 text-amber-600">
            La demande est bien enregistrée côté Novekia, mais l’email de confirmation n’a pas pu être envoyé.
          </p>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      <div className="border border-primary/30 bg-primary/[0.035] p-4">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-primary">
          {offer.label} · {offer.priceLabel}
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{offer.description}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="audit-name" className="text-sm font-semibold">Nom et prénom</label>
          <input id="audit-name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" maxLength={120} required className="mt-2 min-h-12 w-full border border-border bg-background px-3 text-sm outline-none transition focus:border-primary" />
        </div>
        <div>
          <label htmlFor="audit-company" className="text-sm font-semibold">Entreprise</label>
          <input id="audit-company" value={company} onChange={(event) => setCompany(event.target.value)} autoComplete="organization" maxLength={160} required className="mt-2 min-h-12 w-full border border-border bg-background px-3 text-sm outline-none transition focus:border-primary" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="audit-email" className="text-sm font-semibold">Email professionnel</label>
          <input id="audit-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" maxLength={254} required className="mt-2 min-h-12 w-full border border-border bg-background px-3 text-sm outline-none transition focus:border-primary" />
        </div>
        <div>
          <label htmlFor="audit-phone" className="text-sm font-semibold">Téléphone <span className="font-normal text-muted-foreground">(optionnel)</span></label>
          <input id="audit-phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" maxLength={40} className="mt-2 min-h-12 w-full border border-border bg-background px-3 text-sm outline-none transition focus:border-primary" />
        </div>
      </div>

      <div>
        <label htmlFor="audit-website" className="text-sm font-semibold">Site à auditer</label>
        <input id="audit-website" type="text" inputMode="url" value={websiteUrl} onChange={(event) => setWebsiteUrl(event.target.value)} placeholder="https://exemple.fr" maxLength={1000} required className="mt-2 min-h-12 w-full border border-border bg-background px-3 text-sm outline-none transition focus:border-primary" />
      </div>

      {initialAuditId && (
        <div className="border border-border bg-muted/20 px-4 py-3 text-xs leading-5 text-muted-foreground">
          Pré-audit rattaché : <span className="font-mono text-foreground">{initialAuditId}</span>
        </div>
      )}

      <label className="flex cursor-pointer items-start gap-3 border border-border bg-muted/15 p-4 text-sm leading-6">
        <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required className="mt-1 size-4 accent-current" />
        <span>
          Je demande à Novekia de préparer cette commande et j’accepte d’être recontacté pour le paiement et l’exécution de l’audit. Cette demande ne vaut pas paiement.{' '}
          <Link href="/politique-de-confidentialite" className="underline underline-offset-2">Politique de confidentialité</Link>.
        </span>
      </label>

      {error && (
        <div role="alert" className="border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>
      )}

      <button type="submit" disabled={submitting} className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-primary px-5 font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
        {submitting ? (
          <><Loader2 aria-hidden="true" className="size-4 animate-spin" />Enregistrement…</>
        ) : (
          <>Commander l’Audit Full — 99 € HT<ArrowRight aria-hidden="true" className="size-4" /></>
        )}
      </button>

      <div className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
        <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>Le plan de remédiation est inclus dans l’audit. Toute mise en œuvre des corrections par Novekia fera l’objet d’une proposition séparée après analyse des preuves.</p>
      </div>
    </form>
  )
}
