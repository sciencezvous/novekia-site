import Image from 'next/image'
import { ConciergeTrigger } from '@/components/concierge/concierge-trigger'
import { SecondaryButton } from '@/components/brand/secondary-button'
import { TechnicalLabel } from '@/components/brand/technical-label'
import { Section } from '@/components/layout/section'
import { FounderVisionBubble } from './founder-vision-bubble'

export function InstitutionalHero() {
  return (
    <Section
      tone="dark"
      spacing="compact"
      contained={false}
      aria-labelledby="hero-title"
      className="min-h-[calc(100svh-4.5rem)] overflow-hidden border-t-0 !py-0 lg:min-h-[calc(100svh-4rem)]"
    >
      <div
        aria-hidden="true"
        className="technical-grid-pattern pointer-events-none absolute inset-0 opacity-25 [mask-image:linear-gradient(to_bottom,black,transparent_92%)]"
      />
      <div aria-hidden="true" className="novekia-glow -left-48 top-16" />
      <div aria-hidden="true" className="hero-photon-field absolute inset-0" />

      <div className="absolute inset-y-0 right-0 hidden w-[52%] lg:block">
        <Image
          src="/hero-infrastructure.jpg"
          alt="Infrastructure technologique Novekia éclairée en bleu"
          fill
          priority
          sizes="52vw"
          className="object-cover object-center opacity-80 saturate-[0.82] contrast-110"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#020817_0%,rgba(2,8,23,0.74)_30%,rgba(2,8,23,0.08)_78%),linear-gradient(180deg,rgba(2,8,23,0.06),#020817_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_38%,rgba(8,124,255,0.22),transparent_30%)]" />

        <div className="absolute right-8 top-8 z-10 flex items-center gap-3 border border-white/10 bg-[#020817]/70 px-4 py-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#b7c8e4] backdrop-blur-md xl:right-12 xl:top-12">
          <span className="system-status-dot size-1.5 rounded-full bg-primary" />
          Systèmes sous contrôle
          <span className="text-primary">SYS.ACTIF</span>
        </div>
      </div>

      <div className="relative mx-auto grid min-h-[calc(100svh-4.5rem)] w-full max-w-7xl items-center gap-10 px-5 py-10 sm:px-6 sm:py-12 md:px-8 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[minmax(0,1.16fr)_minmax(23rem,0.84fr)] lg:gap-8 lg:py-10">
        <div className="relative z-10 max-w-4xl">
          <TechnicalLabel index="00">
            Novekia — studio commercial et technologique
          </TechnicalLabel>

          <h1
            id="hero-title"
            className="mt-6 text-balance text-[clamp(3rem,6.4vw,5.4rem)] font-semibold leading-[0.88] tracking-[-0.065em]"
          >
            Détecter les
            <br />
            <span className="text-primary">opportunités.</span>
            <br />
            Construire les
            <br />
            <span className="text-primary">solutions.</span>
          </h1>

          <p className="mt-7 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Novekia réunit deux expertises complémentaires&nbsp;: Lead Engine
            Studio pour identifier et qualifier les opportunités commerciales,
            et Novekia Solutions pour concevoir les outils numériques, les
            systèmes d’IA et les infrastructures adaptés aux besoins détectés.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ConciergeTrigger
              source="hero"
              className="w-full sm:w-auto"
            >
              Qualifier mon besoin
            </ConciergeTrigger>
            <SecondaryButton href="#poles" className="w-full sm:w-auto">
              Voir les deux expertises
            </SecondaryButton>
          </div>

          <p className="mt-4 font-mono text-xs tracking-wide text-muted-foreground">
            Réponse sous 48 h ouvrées <span aria-hidden="true">•</span>{' '}
            Supervision humaine <span aria-hidden="true">•</span> Sans
            engagement
          </p>
        </div>

        <FounderVisionBubble className="relative z-20 lg:translate-x-3 lg:translate-y-6" />
      </div>
    </Section>
  )
}
