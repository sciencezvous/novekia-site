import { Section } from '@/components/layout/section'
import { TechnicalLabel } from '@/components/brand/technical-label'
import { PrimaryButton } from '@/components/brand/primary-button'
import { SecondaryButton } from '@/components/brand/secondary-button'
import { InfrastructureDiagram } from '@/components/home/infrastructure-diagram'

export function HomeHero() {
  return (
    <Section
      tone="dark"
      spacing="loose"
      contained={false}
      aria-labelledby="hero-title"
      className="overflow-hidden"
    >
      {/* Motif technique discret en arrière-plan */}
      <div
        aria-hidden="true"
        className="technical-grid-pattern pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 items-center gap-7 sm:gap-10 lg:grid-cols-[1fr_0.78fr] lg:gap-16">

          {/* Colonne gauche — texte */}
          <div className="flex-1 lg:max-w-[54%]">
            <TechnicalLabel index="00">Studio d&apos;ingénierie technologique</TechnicalLabel>
            <h1
              id="hero-title"
              className="mt-5 text-balance text-[clamp(2.25rem,11vw,3.75rem)] font-semibold leading-[1.02] tracking-tight sm:mt-6 md:text-6xl"
            >
              Infrastructure locale.{' '}
              <span className="text-primary">Intelligence souveraine.</span>
            </h1>
            <div className="mx-auto mt-4 w-full max-w-[17.5rem] lg:hidden">
              <InfrastructureDiagram className="aspect-square w-full" />
            </div>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">
              Novekia conçoit des infrastructures modulaires, sécurisées et
              évolutives — IA locale, logiciels métiers et stations de calcul haute
              performance — pour accélérer vos performances.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row [&>*]:w-full sm:[&>*]:w-auto">
              <PrimaryButton href="#expertises" withArrow>
                Découvrir nos solutions
              </PrimaryButton>
              <SecondaryButton href="#contact">
                Demander un audit
              </SecondaryButton>
            </div>
          </div>

          {/* Colonne droite — diagramme */}
          <div className="hidden w-full max-w-sm flex-shrink-0 lg:block lg:w-full lg:max-w-none">
            <InfrastructureDiagram className="aspect-square w-full" />
          </div>

        </div>
      </div>
    </Section>
  )
}
