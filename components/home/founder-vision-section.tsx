import Image from 'next/image'
import { Quote } from 'lucide-react'
import { TechnicalLabel } from '@/components/brand/technical-label'
import { Section } from '@/components/layout/section'

export function FounderVisionSection() {
  return (
    <Section
      id="vision"
      tone="muted"
      containerSize="wide"
      aria-labelledby="vision-title"
      className="overflow-hidden"
    >
      <div aria-hidden="true" className="technical-grid-pattern absolute inset-0 opacity-15" />
      <div aria-hidden="true" className="novekia-glow -right-56 top-1/4" />

      <div className="relative grid items-center gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14">
        <figure className="novekia-surface scan-sweep relative mx-auto w-full max-w-xl overflow-hidden">
          <Image
            src="/andy-legrand-novekia.png"
            alt="Andy Legrand, fondateur du studio d’ingénierie Novekia"
            width={1088}
            height={1445}
            sizes="(min-width: 1024px) 42vw, (min-width: 640px) 70vw, 100vw"
            className="aspect-[4/5] w-full object-cover object-top"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#020817] via-[#020817]/80 to-transparent px-6 pb-6 pt-20">
            <p className="text-lg font-semibold text-white">Andy Legrand</p>
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.16em] text-[#9eb0ca]">
              Fondateur · Novekia
            </p>
          </figcaption>
        </figure>

        <div>
          <TechnicalLabel index="02">La vision du studio</TechnicalLabel>
          <h2
            id="vision-title"
            className="mt-6 max-w-3xl text-balance text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.94] tracking-[-0.055em]"
          >
            Un studio.
            <br />
            <span className="text-primary">Pas une agence.</span>
          </h2>

          <blockquote className="novekia-surface relative mt-9 p-6 sm:p-8 lg:p-10">
            <span
              aria-hidden="true"
              className="absolute -left-2 top-10 hidden size-4 rotate-45 border-b border-l border-white/10 bg-[#071224] lg:block"
            />
            <Quote aria-hidden="true" className="size-8 text-primary" strokeWidth={1.5} />
            <p className="mt-6 max-w-2xl text-pretty text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
              « Novekia n’est pas une agence qui applique une recette. C’est un
              studio d’ingénierie où l’on comprend, conçoit, prototype et déploie
              des systèmes solides, au plus près de vos métiers et sous votre
              contrôle. »
            </p>
            <footer className="mt-7 border-t border-border pt-5">
              <p className="font-semibold text-foreground">Andy Legrand</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Une approche directe, documentée et engagée du premier cadrage à
                la mise en production.
              </p>
            </footer>
          </blockquote>
        </div>
      </div>
    </Section>
  )
}
