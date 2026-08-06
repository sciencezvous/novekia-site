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

      <div className="absolute inset-0">
        <Image
          src="/hero-novekia-system-v2.png"
          alt="Système de calcul et réseau de données Novekia éclairés en bleu"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[66%_center] opacity-65 saturate-[0.88] contrast-110 sm:object-[62%_center] lg:opacity-90"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#020817_0%,rgba(2,8,23,0.98)_22%,rgba(2,8,23,0.78)_48%,rgba(2,8,23,0.12)_82%),linear-gradient(180deg,rgba(2,8,23,0.16)_0%,rgba(2,8,23,0.04)_58%,#020817_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,rgba(8,124,255,0.16),transparent_34%)]" />

        <div className="absolute right-8 top-8 z-10 hidden items-center gap-3 border border-white/10 bg-[#020817]/70 px-4 py-3 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#b7c8e4] backdrop-blur-md lg:flex xl:right-12 xl:top-12">
          <span className="system-status-dot size-1.5 rounded-full bg-primary" />
          Systèmes sous contrôle
          <span className="text-primary">SYS.ACTIF</span>
        </div>
      </div>

      <div className="relative mx-auto grid min-h-[calc(100svh-4.5rem)] w-full max-w-7xl items-center gap-10 px-5 py-12 sm:px-6 sm:py-16 md:px-8 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[minmax(0,1.08fr)_minmax(25rem,0.92fr)] lg:gap-12 lg:pb-32 lg:pt-20">
        <div className="relative z-10 max-w-4xl">
          <TechnicalLabel index="00">
            Novekia — studio commercial et technologique
          </TechnicalLabel>

          <h1
            id="hero-title"
            className="mt-7 text-balance text-[clamp(3.2rem,7.2vw,6.25rem)] font-semibold leading-[0.86] tracking-[-0.07em] [text-shadow:0_14px_55px_rgba(0,0,0,0.46)]"
          >
            Détecter les
            <br />
            <span className="text-primary">opportunités.</span>
            <br />
            Construire les
            <br />
            <span className="text-primary">solutions.</span>
          </h1>

          <p className="mt-8 max-w-2xl text-pretty text-base leading-relaxed text-[#b7c8e4] sm:text-lg">
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

        <FounderVisionBubble className="relative z-20 lg:self-end lg:translate-x-3 lg:-translate-y-2" />
      </div>

      <dl className="absolute inset-x-0 bottom-0 z-20 mx-auto hidden w-full max-w-7xl grid-cols-3 border-x border-t border-white/10 bg-[#020817]/78 backdrop-blur-xl lg:grid">
        <div className="px-7 py-5">
          <dt className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-muted-foreground">
            Architecture
          </dt>
          <dd className="mt-2 text-sm font-semibold uppercase">Deux pôles intégrés</dd>
        </div>
        <div className="border-x border-white/10 px-7 py-5">
          <dt className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-muted-foreground">
            Décision
          </dt>
          <dd className="mt-2 text-sm font-semibold uppercase">Supervision humaine</dd>
        </div>
        <div className="px-7 py-5">
          <dt className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-muted-foreground">
            Déploiement
          </dt>
          <dd className="mt-2 text-sm font-semibold uppercase">Sous votre contrôle</dd>
        </div>
      </dl>
    </Section>
  )
}
