import Image from 'next/image'
import { Quote } from 'lucide-react'
import { Section } from '@/components/layout/section'
import { TechnicalLabel } from '@/components/brand/technical-label'
import { PrimaryButton } from '@/components/brand/primary-button'
import { SecondaryButton } from '@/components/brand/secondary-button'

const signals = [
  { value: 'LOCAL', label: 'Données sous contrôle' },
  { value: 'MODULAIRE', label: 'Architecture évolutive' },
  { value: 'SUR MESURE', label: 'Conçu pour vos usages' },
  { value: 'MESURABLE', label: 'Du cadrage à la production' },
]

export function HomeHero() {
  return (
    <Section
      tone="dark"
      spacing="loose"
      contained={false}
      aria-labelledby="hero-title"
      className="min-h-[calc(100svh-4.5rem)] overflow-hidden border-t-0 lg:min-h-[calc(100svh-4rem)]"
    >
      <div
        aria-hidden="true"
        className="technical-grid-pattern pointer-events-none absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent_90%)]"
      />
      <div aria-hidden="true" className="novekia-glow -left-48 top-12" />

      <div className="absolute inset-y-0 right-0 hidden w-[53%] lg:block">
        <Image
          src="/hero-infrastructure.jpg"
          alt="Détail d’une infrastructure de calcul éclairée en bleu"
          fill
          priority
          sizes="53vw"
          className="object-cover object-center opacity-80 saturate-75"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#020817_0%,rgba(2,8,23,0.55)_32%,rgba(2,8,23,0.08)_75%),linear-gradient(180deg,rgba(2,8,23,0.1),#020817_100%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100svh-11rem)] w-full max-w-7xl flex-col justify-center px-5 sm:px-6 md:px-8">
        <div className="max-w-4xl py-10 lg:max-w-[57%] lg:py-16">
          <TechnicalLabel index="00">Studio d&apos;ingénierie technologique</TechnicalLabel>
          <h1
            id="hero-title"
            className="mt-6 text-balance text-[clamp(3.3rem,11vw,6.7rem)] font-semibold leading-[0.88] tracking-[-0.065em]"
          >
            Infrastructure
            <br />
            locale.
            <br />
            <span className="bg-gradient-to-r from-[#77c8ff] via-[#319bff] to-[#087cff] bg-clip-text text-transparent">
              Intelligence
              <br />
              souveraine.
            </span>
          </h1>
          <p className="mt-7 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Novekia conçoit en France des systèmes numériques privés et performants :
            intelligence artificielle locale, logiciels métiers, infrastructures de calcul
            et architectures web pensées pour durer.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row [&>*]:w-full sm:[&>*]:w-auto">
            <PrimaryButton href="#expertises" withArrow>
              Découvrir nos solutions
            </PrimaryButton>
            <SecondaryButton href="#contact">Demander un audit</SecondaryButton>
          </div>
        </div>

        <aside
          id="vision"
          aria-labelledby="vision-title"
          className="novekia-surface relative z-10 mb-8 mt-2 w-full overflow-visible border-primary/30 bg-[#030c1c]/90 p-6 shadow-[0_20px_70px_rgba(0,72,180,0.22)] backdrop-blur-xl sm:p-8 lg:absolute lg:bottom-[23rem] lg:right-0 lg:mb-0 lg:mt-0 lg:w-[min(46vw,42rem)] lg:p-10 xl:-right-8 2xl:-right-32"
        >
          <span
            aria-hidden="true"
            className="absolute -right-2 top-12 hidden size-4 rotate-45 border-r border-t border-primary/30 bg-[#061126] lg:block"
          />
          <div className="flex items-center gap-5">
            <div className="relative size-20 shrink-0 overflow-hidden border border-primary/40 bg-[#071224] shadow-[0_0_30px_rgba(8,124,255,0.25)] sm:size-24 lg:size-36">
              <Image
                src="/andy-legrand-novekia-v3.png"
                alt="Andy Legrand, fondateur du studio d’ingénierie Novekia"
                fill
                sizes="(min-width: 1024px) 144px, (min-width: 640px) 96px, 80px"
                className="object-cover object-[center_18%]"
              />
            </div>
            <div>
              <p
                id="vision-title"
                className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-primary"
              >
                La vision du studio
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                Andy Legrand · Fondateur
              </p>
            </div>
            <Quote
              aria-hidden="true"
              className="ml-auto size-8 shrink-0 text-primary/70 lg:size-10"
              strokeWidth={1.4}
            />
          </div>
          <blockquote className="mt-6 border-t border-border/80 pt-6">
            <p className="text-pretty text-lg font-medium leading-relaxed text-foreground sm:text-xl lg:text-[1.375rem]">
              « Pas une agence. Un studio d’ingénierie qui conçoit et déploie vos
              logiciels métiers, votre IA locale et vos infrastructures de calcul —
              robustes, mesurables et sous votre contrôle. »
            </p>
          </blockquote>
        </aside>

        <dl className="novekia-surface relative z-10 mt-auto grid grid-cols-2 lg:grid-cols-4">
          {signals.map((signal) => (
            <div
              key={signal.value}
              className="border-border/80 p-4 even:border-l sm:p-5 lg:border-l lg:first:border-l-0"
            >
              <dt className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                {signal.label}
              </dt>
              <dd className="mt-2 text-sm font-semibold tracking-tight text-foreground sm:text-base">
                {signal.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  )
}
