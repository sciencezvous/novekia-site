import Link from 'next/link'
import {
  ArrowUpRight,
  BrainCircuit,
  Cpu,
  Network,
  Wifi,
} from 'lucide-react'
import { SectionHeader } from '@/components/brand/section-header'
import { Section } from '@/components/layout/section'
import { offerList } from '@/lib/offers'

const offerIcons = {
  wifi: Wifi,
  network: Network,
  workshop: BrainCircuit,
  ai: Cpu,
}

export function OffersSection() {
  return (
    <Section id="offres" tone="muted" aria-labelledby="offres-title">
      <SectionHeader
        index="04"
        eyebrow="Offres"
        title={<span id="offres-title">Des missions concrètes, des livrables clairs.</span>}
        description="Quatre points d’entrée pour sécuriser une décision, concevoir une architecture ou déployer une solution privée."
      />

      <div className="mt-12 grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {offerList.map((offer, index) => {
          const Icon = offerIcons[offer.diagram]

          return (
            <Link
              key={offer.slug}
              href={`/offres/${offer.slug}`}
              className="scan-sweep group relative flex min-h-64 flex-col gap-4 bg-background p-6 outline-none transition-colors hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >
              <div className="flex items-start justify-between gap-4">
                <Icon
                  aria-hidden="true"
                  className="size-5 text-primary opacity-80 transition-opacity group-hover:opacity-100"
                  strokeWidth={1.25}
                />
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
                  {offer.eyebrow}
                </p>
                <h3 className="mt-3 text-base font-semibold tracking-tight text-foreground">
                  {offer.title}
                </h3>
              </div>

              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                {offer.summary}
              </p>

              <div className="border-t border-border pt-4">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted-foreground">
                  {offer.duration}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.1em] text-primary opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100">
                  Explorer l&apos;offre
                  <ArrowUpRight aria-hidden="true" className="size-3" />
                </span>
              </div>
            </Link>
          )
        })}

        <article className="relative flex min-h-64 flex-col justify-between overflow-hidden bg-background p-6 sm:col-span-2">
          <div aria-hidden="true" className="technical-grid-pattern absolute inset-0 opacity-20" />
          <div aria-hidden="true" className="novekia-glow -right-64 -top-64" />
          <div className="relative">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
              Mission sur mesure
            </p>
            <h3 className="mt-4 max-w-xl text-balance text-2xl font-semibold tracking-tight text-foreground">
              Votre besoin ne rentre pas dans une case&nbsp;?
            </h3>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Le studio peut cadrer une intervention dédiée à partir de vos
              contraintes, de vos systèmes existants et du résultat attendu.
            </p>
          </div>
          <Link
            href="/#contact"
            className="relative mt-8 inline-flex w-fit items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-primary outline-none transition-colors hover:text-lumineux focus-visible:ring-2 focus-visible:ring-ring"
          >
            Parler de votre projet
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </article>
      </div>
    </Section>
  )
}
