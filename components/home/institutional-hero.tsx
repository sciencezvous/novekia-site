import Image from 'next/image'
import { PrimaryButton } from '@/components/brand/primary-button'
import { SecondaryButton } from '@/components/brand/secondary-button'
import { TechnicalLabel } from '@/components/brand/technical-label'
import { Section } from '@/components/layout/section'

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
        className="technical-grid-pattern pointer-events-none absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent_92%)]"
      />
      <div aria-hidden="true" className="novekia-glow -left-48 top-16" />

      <div className="absolute inset-y-0 right-0 hidden w-[49%] lg:block">
        <Image
          src="/hero-infrastructure.jpg"
          alt="Infrastructure technologique Novekia éclairée en bleu"
          fill
          priority
          sizes="49vw"
          className="object-cover object-center opacity-70 saturate-75"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#020817_0%,rgba(2,8,23,0.72)_28%,rgba(2,8,23,0.1)_76%),linear-gradient(180deg,rgba(2,8,23,0.08),#020817_100%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100svh-4.5rem)] w-full max-w-7xl items-center px-5 py-10 sm:px-6 sm:py-12 md:px-8 lg:min-h-[calc(100svh-4rem)] lg:py-10">
        <div className="max-w-4xl lg:max-w-[64%]">
          <TechnicalLabel index="00">
            Novekia — studio commercial et technologique
          </TechnicalLabel>

          <h1
            id="hero-title"
            className="mt-6 text-balance text-[clamp(3rem,6vw,4.75rem)] font-semibold leading-[0.9] tracking-[-0.06em]"
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
            <PrimaryButton
              href="/lead-engine-studio"
              withArrow
              className="w-full sm:w-auto"
            >
              Découvrir Lead Engine Studio
            </PrimaryButton>
            <SecondaryButton href="/solutions" className="w-full sm:w-auto">
              Explorer Novekia Solutions
            </SecondaryButton>
          </div>

          <p className="mt-4 font-mono text-xs tracking-wide text-muted-foreground">
            Approche sur mesure <span aria-hidden="true">•</span> Supervision
            humaine <span aria-hidden="true">•</span> Sans engagement
          </p>
        </div>
      </div>
    </Section>
  )
}
