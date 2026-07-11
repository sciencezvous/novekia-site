import { Section } from '@/components/layout/section'
import { TechnicalLabel } from '@/components/brand/technical-label'
import { PrimaryButton } from '@/components/brand/primary-button'
import { SecondaryButton } from '@/components/brand/secondary-button'

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
      <div className="relative mx-auto w-full max-w-6xl px-6 md:px-8">
        <div className="max-w-3xl">
          <TechnicalLabel index="00">Studio d&apos;ingénierie technologique</TechnicalLabel>
          <h1
            id="hero-title"
            className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl"
          >
            Infrastructure locale.{' '}
            <span className="text-primary">Intelligence souveraine.</span>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Novekia conçoit des infrastructures modulaires, sécurisées et
            évolutives — IA locale, logiciels métiers et stations de calcul haute
            performance — pour accélérer vos performances.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <PrimaryButton href="/solutions" withArrow>
              Découvrir nos solutions
            </PrimaryButton>
            <SecondaryButton href="/contact?type=audit">
              Demander un audit
            </SecondaryButton>
          </div>
        </div>
      </div>
    </Section>
  )
}
