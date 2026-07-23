import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SectionHeader } from '@/components/brand/section-header'
import { Section } from '@/components/layout/section'
import { offerList } from '@/lib/offers'

export function OffersSection() {
  return (
    <Section id="offres" tone="light" aria-labelledby="offres-title">
      <SectionHeader
        index="04"
        eyebrow="Offres"
        title={<span id="offres-title">Des missions concrètes, des livrables clairs.</span>}
        description="Quatre points d’entrée pour sécuriser une décision, concevoir une architecture ou déployer une solution privée."
      />

      <div className="mt-12 grid gap-px bg-border md:grid-cols-2">
        {offerList.map((offer, index) => (
          <Link
            key={offer.slug}
            href={`/offres/${offer.slug}`}
            className="scan-sweep group flex min-h-72 flex-col bg-card p-6 outline-none transition-colors hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:p-8"
          >
            <div className="flex items-start justify-between gap-6">
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
                Offre {String(index + 1).padStart(2, '0')}
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-5 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary"
              />
            </div>
            <p className="mt-8 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
              {offer.eyebrow}
            </p>
            <h3 className="mt-3 max-w-lg text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {offer.title}
            </h3>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {offer.summary}
            </p>
            <p className="mt-auto pt-8 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
              Durée indicative · {offer.duration}
            </p>
          </Link>
        ))}
      </div>
    </Section>
  )
}
