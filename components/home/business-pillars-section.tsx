import Link from 'next/link'
import { ArrowUpRight, Check } from 'lucide-react'
import { SectionHeader } from '@/components/brand/section-header'
import { Section } from '@/components/layout/section'

const pillars = [
  {
    index: '01',
    kind: 'Produit',
    title: 'Lead Engine by Novekia',
    description:
      'Le produit de prospection B2B développé par Novekia. Il identifie les entreprises pertinentes, analyse les signaux publics et documente la qualification avant activation.',
    points: [
      'Ciblage d’entreprises',
      'Qualification des opportunités',
      'Preuves et niveau de confiance',
      'Préparation des approches',
    ],
    cta: 'Découvrir Lead Engine',
    href: '/lead-engine-studio',
  },
  {
    index: '02',
    kind: 'Produit',
    title: 'NovekiAct by Novekia',
    description:
      'Un produit en développement pour aider les PME à inventorier leurs usages IA, clarifier les responsabilités et piloter un plan de gouvernance documenté.',
    points: [
      'Cartographie des usages IA',
      'Responsabilités explicites',
      'Risques et actions documentés',
      'Preuves conservées',
    ],
    cta: 'Découvrir NovekiAct',
    href: '/novekiact',
  },
  {
    index: '03',
    kind: 'Services',
    title: 'Novekia Solutions',
    description:
      'Un pôle de conception et d’intégration qui transforme les besoins identifiés en solutions numériques concrètes, adaptées aux usages, aux contraintes et au niveau de maturité du client.',
    points: [
      'Sites web SEO, GEO et AEO',
      'Logiciels métiers et automatisations',
      'Intelligence artificielle locale',
      'Infrastructures techniques sur mesure',
    ],
    cta: 'Explorer les solutions',
    href: '/solutions',
  },
] as const

export function BusinessPillarsSection() {
  return (
    <Section
      id="poles"
      tone="light"
      containerSize="wide"
      aria-labelledby="poles-title"
    >
      <SectionHeader
        index="01"
        eyebrow="Architecture Novekia"
        title={
          <span id="poles-title">
            Des produits et des expertises.
            <br />
            <span className="text-primary">Une seule entité&nbsp;: Novekia.</span>
          </span>
        }
        description="Lead Engine et NovekiAct sont des produits développés par Novekia. Novekia Solutions regroupe les prestations d’ingénierie de l’entreprise. Chaque activité conserve un périmètre clair et la même méthode Evidence-First."
      />

      <div className="mt-12 grid gap-px bg-border lg:grid-cols-3">
        {pillars.map((pillar) => (
          <article
            key={pillar.title}
            className="group flex min-h-[34rem] flex-col bg-background p-6 sm:p-8 lg:p-9"
          >
            <div className="flex items-start justify-between gap-6">
              <span className="font-mono text-xs tracking-[0.18em] text-primary">
                {pillar.kind.toUpperCase()} {pillar.index}
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-5 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </div>

            <h3 className="mt-8 max-w-xl text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              {pillar.title}
            </h3>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground">
              {pillar.description}
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {pillar.points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-sm leading-6 text-foreground"
                >
                  <Check
                    aria-hidden="true"
                    className="mt-1 size-4 shrink-0 text-primary"
                  />
                  {point}
                </li>
              ))}
            </ul>

            <Link
              href={pillar.href}
              className="mt-auto inline-flex min-h-12 w-fit items-center gap-2 border-b border-primary pt-10 font-mono text-xs uppercase tracking-[0.14em] text-primary outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              {pillar.cta}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </article>
        ))}
      </div>
    </Section>
  )
}
