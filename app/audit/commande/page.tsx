import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, BadgeCheck, FileCheck2, ShieldCheck } from 'lucide-react'
import { AuditOrderForm } from './audit-order-form'
import { Breadcrumbs } from '@/components/brand/breadcrumbs'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import {
  PAID_AUDIT_OFFERS,
  isPaidAuditOfferId,
  type PaidAuditOfferId,
} from '@/lib/audit-paid-offers'

export const metadata: Metadata = {
  title: 'Commander un audit Visibility | Novekia',
  description:
    'Demande d’audit Novekia Visibility. L’audit complet démarre uniquement après validation du paiement.',
  robots: { index: false, follow: false },
}

type SearchParams = Promise<{
  offer?: string | string[]
  auditId?: string | string[]
  url?: string | string[]
}>

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}

export default async function AuditOrderPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const requestedOffer = first(params.offer)
  const offerId: PaidAuditOfferId = isPaidAuditOfferId(requestedOffer)
    ? requestedOffer
    : 'visibility'
  const offer = PAID_AUDIT_OFFERS[offerId]
  const auditId = first(params.auditId).slice(0, 80)
  const websiteUrl = first(params.url).slice(0, 1000)

  return (
    <>
      <SiteHeader />
      <main id="contenu">
        <section className="section-dark relative overflow-hidden border-b border-border px-5 py-14 text-foreground sm:px-6 sm:py-20 md:px-8">
          <div aria-hidden="true" className="technical-grid-pattern absolute inset-0 opacity-25" />
          <div aria-hidden="true" className="novekia-glow -right-40 -top-40" />
          <div className="relative mx-auto max-w-6xl">
            <Breadcrumbs
              items={[
                { label: 'Accueil', href: '/' },
                { label: 'Audit', href: '/audit' },
                { label: 'Audit approfondi', href: '/audit-approfondi' },
                { label: 'Commande' },
              ]}
            />
            <p className="mt-10 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Novekia Visibility · Commande
            </p>
            <h1 className="mt-5 max-w-4xl text-balance text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl">
              Passer du diagnostic à un audit complet.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
              Votre demande est enregistrée avant paiement. Novekia ne lance l’analyse approfondie
              et ne délivre le rapport premium qu’après validation du paiement.
            </p>
          </div>
        </section>

        <section className="px-5 py-14 sm:px-6 sm:py-20 md:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14">
            <aside>
              <div className="sticky top-24 border border-border bg-muted/15 p-6 sm:p-7">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                  Offre sélectionnée
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
                  {offer.label}
                </h2>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-primary">
                  {offer.priceLabel}
                </p>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {offer.description}
                </p>

                <div className="mt-6 space-y-3 border-t border-border pt-6 text-sm leading-6">
                  <div className="flex gap-3">
                    <BadgeCheck aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />
                    <span>Tarif et périmètre choisis côté serveur, jamais depuis le navigateur.</span>
                  </div>
                  <div className="flex gap-3">
                    <ShieldCheck aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />
                    <span>Statut initial : en attente de paiement.</span>
                  </div>
                  <div className="flex gap-3">
                    <FileCheck2 aria-hidden="true" className="mt-1 size-4 shrink-0 text-primary" />
                    <span>Rapport premium accessible uniquement après validation.</span>
                  </div>
                </div>

                <Link
                  href="/audit-approfondi#tarifs"
                  className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                >
                  <ArrowLeft aria-hidden="true" className="size-4" />
                  Comparer les offres
                </Link>
              </div>
            </aside>

            <div className="border border-border bg-background p-6 sm:p-8 lg:p-10">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                Vos informations
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                Préparer la commande
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Ces informations servent au cadrage, au paiement et à la réalisation de l’audit.
              </p>
              <div className="mt-8">
                <AuditOrderForm
                  initialOffer={offerId}
                  initialAuditId={auditId}
                  initialWebsiteUrl={websiteUrl}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
