import { Section } from '@/components/layout/section'
import { SectionHeader } from '@/components/brand/section-header'
import { cn } from '@/lib/utils'

const pillars = [
  {
    index: '01',
    title: 'Ingénierie sur mesure',
    description:
      'Des systèmes conçus autour de vos contraintes métier, techniques, budgétaires et opérationnelles.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5">
        <path d="M12 3L3 8.5v7L12 21l9-5.5v-7L12 3Z" />
        <path d="M12 12L3 8.5M12 12l9-3.5M12 12v9" />
      </svg>
    ),
  },
  {
    index: '02',
    title: 'Maîtrise locale',
    description:
      'Des architectures permettant de conserver le contrôle des données, des modèles et des ressources de calcul.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        <circle cx="12" cy="16" r="1.5" />
      </svg>
    ),
  },
  {
    index: '03',
    title: 'Mise en production',
    description:
      'Une approche orientée vers des solutions exploitables, documentées, maintenables et mesurables.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
]

export function PositionnementSection() {
  return (
    <Section id="positionnement" tone="light" aria-labelledby="positionnement-title">
      <SectionHeader
        index="01"
        eyebrow="Positionnement"
        title={<span id="positionnement-title">Un studio d&apos;ingénierie, pas une agence.</span>}
        description="Novekia traite des problématiques techniques complexes : ingénierie logicielle, IA locale, infrastructures de calcul et R&D appliquée."
      />

      {/* Trois piliers */}
      <div className="mt-12 grid grid-cols-1 gap-0 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {pillars.map((pillar, i) => (
          <article
            key={pillar.index}
            className={cn(
              'group flex flex-col gap-4 px-0 py-6 transition-colors duration-200 sm:py-8',
              'sm:px-8 sm:py-0',
              i === 0 && 'sm:pl-0',
              i === pillars.length - 1 && 'sm:pr-0',
              'hover:bg-secondary/60',
            )}
          >
            {/* En-tête pilier */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  className="font-mono text-xs tabular-nums text-muted-foreground"
                  aria-hidden="true"
                >
                  {pillar.index}
                </span>
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  {pillar.title}
                </h3>
              </div>
              <span className="mt-0.5 shrink-0 text-primary opacity-70 transition-opacity group-hover:opacity-100">
                {pillar.icon}
              </span>
            </div>

            {/* Séparateur fin */}
            <div className="h-px w-8 bg-primary opacity-30" aria-hidden="true" />

            {/* Description */}
            <p className="text-sm leading-relaxed text-muted-foreground">
              {pillar.description}
            </p>
          </article>
        ))}
      </div>

      {/* Citation de synthèse */}
      <p className="mt-10 text-pretty text-sm italic text-muted-foreground border-l-2 border-primary/30 pl-4">
        De l&apos;étude initiale au déploiement, chaque décision est justifiée par une contrainte réelle.
      </p>
    </Section>
  )
}
