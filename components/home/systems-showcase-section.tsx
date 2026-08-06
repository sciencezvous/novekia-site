import Link from 'next/link'
import {
  ArrowRight,
  BrainCircuit,
  DatabaseZap,
  Radar,
  ServerCog,
  ShieldCheck,
} from 'lucide-react'
import { TechnicalLabel } from '@/components/brand/technical-label'
import { Section } from '@/components/layout/section'

const systemSteps = [
  {
    index: '01',
    label: 'Signal',
    title: 'Observer',
    description: 'Marché, données et irritants métier',
    icon: Radar,
  },
  {
    index: '02',
    label: 'Décision',
    title: 'Qualifier',
    description: 'Contexte, priorité et supervision humaine',
    icon: BrainCircuit,
  },
  {
    index: '03',
    label: 'Système',
    title: 'Construire',
    description: 'Logiciel, IA et automatisation sur mesure',
    icon: DatabaseZap,
  },
  {
    index: '04',
    label: 'Contrôle',
    title: 'Déployer',
    description: 'Infrastructure, mesure et amélioration',
    icon: ServerCog,
  },
] as const

const guarantees = [
  ['Données', 'Maîtrisées'],
  ['Architecture', 'Modulaire'],
  ['Livrables', 'Exploitables'],
  ['Pilotage', 'Mesurable'],
] as const

export function SystemsShowcaseSection() {
  return (
    <Section
      id="systeme-novekia"
      tone="dark"
      contained={false}
      className="overflow-hidden !py-0"
      aria-labelledby="system-showcase-title"
    >
      <div aria-hidden="true" className="technical-grid-pattern absolute inset-0 opacity-15" />
      <div aria-hidden="true" className="novekia-glow -right-64 top-0" />

      <div className="relative mx-auto grid max-w-7xl border-x border-border/70 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="flex flex-col justify-between border-b border-border/70 p-6 sm:p-10 lg:min-h-[46rem] lg:border-b-0 lg:border-r lg:p-12">
          <div>
            <TechnicalLabel index="NX-01">Système Novekia</TechnicalLabel>
            <h2
              id="system-showcase-title"
              className="mt-8 max-w-xl text-balance text-4xl font-semibold leading-[0.94] tracking-[-0.055em] sm:text-5xl lg:text-6xl"
            >
              Du signal au système
              <span className="block text-primary">en production.</span>
            </h2>
            <p className="mt-7 max-w-lg text-base leading-8 text-muted-foreground">
              Novekia relie prospection, ingénierie logicielle et infrastructure
              dans une chaîne lisible. Chaque étape produit une décision, un
              livrable et un niveau de contrôle explicites.
            </p>
          </div>

          <div className="mt-10 border-t border-border/70 pt-7 lg:mt-16">
            <div className="flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
              <ShieldCheck aria-hidden="true" className="size-4 text-primary" />
              Architecture documentée
            </div>
            <Link
              href="/ressources/demonstrateur-rag-local"
              className="group mt-5 inline-flex min-h-11 items-center gap-3 border-b border-primary pb-2 font-mono text-xs uppercase tracking-[0.14em] text-primary outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              Examiner un démonstrateur
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        <div className="relative flex min-h-[42rem] flex-col justify-center overflow-hidden bg-[#020712]/70 p-6 sm:p-10 lg:p-12">
          <div aria-hidden="true" className="architecture-radar absolute -right-48 -top-48 size-[38rem] rounded-full" />

          <div className="relative">
            <div className="mb-8 flex items-center justify-between gap-4 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
              <span>Flux d’exécution</span>
              <span className="flex items-center gap-2 text-primary">
                <span className="system-status-dot size-1.5 rounded-full bg-primary" />
                Orchestré
              </span>
            </div>

            <ol className="architecture-flow relative grid gap-3 md:grid-cols-2 xl:grid-cols-4 xl:gap-0">
              {systemSteps.map((step) => {
                const Icon = step.icon

                return (
                  <li
                    key={step.index}
                    className="architecture-node group relative min-h-56 border border-border/80 bg-[#051126]/94 p-5 transition-colors hover:border-primary/60 hover:bg-[#071833] focus-within:border-primary/60"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-primary">
                        {step.index} / {step.label}
                      </span>
                      <Icon aria-hidden="true" className="size-5 text-primary" strokeWidth={1.4} />
                    </div>
                    <h3 className="mt-12 text-xl font-semibold tracking-[-0.03em]">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {step.description}
                    </p>
                    <span
                      aria-hidden="true"
                      className="architecture-node-light absolute bottom-0 left-0 h-px w-full origin-left bg-primary"
                    />
                  </li>
                )
              })}
            </ol>

            <dl className="mt-3 grid gap-px bg-border/80 sm:grid-cols-2 xl:grid-cols-4">
              {guarantees.map(([term, value]) => (
                <div key={term} className="bg-[#030b19] px-5 py-5">
                  <dt className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-muted-foreground">
                    {term}
                  </dt>
                  <dd className="mt-2 text-sm font-semibold uppercase tracking-[-0.01em] text-foreground">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </Section>
  )
}
