import Link from 'next/link'
import { ArrowUpRight, Check } from 'lucide-react'
import { SectionHeader } from '@/components/brand/section-header'
import { Section } from '@/components/layout/section'

const pillars = [
  {
    index: '01',
    title: 'Novekia Lead Engine Studio',
    description:
      'Un dispositif de prospection B2B qui identifie les entreprises pertinentes, analyse les signaux publics, qualifie les opportunités et prépare des approches commerciales personnalisées sous supervision humaine.',
    points: [
      'Ciblage d’entreprises',
      'Qualification des opportunités',
      'Recherche des décideurs',
      'Personnalisation des approches',
      'Préparation des rendez-vous',
    ],
    cta: 'Découvrir Lead Engine Studio',
    href: '/lead-engine-studio',
  },
  {
    index: '02',
    title: 'Novekia Solutions',
    description:
      'Un pôle de conception et d’intégration qui transforme les besoins identifiés en solutions numériques concrètes, adaptées aux usages, aux contraintes et au niveau de maturité du client.',
    points: [
      'Sites web premium SEO et GEO',
      'Logiciels métiers et automatisations',
      'Intelligence artificielle locale',
      'Applications web et intégrations',
      'Stations et serveurs IA',
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
            Deux moteurs.
            <br />
            <span className="text-primary">Une même exigence de résultat.</span>
          </span>
        }
        description="Chaque pôle possède un métier clair. Ils partagent la même méthode : comprendre le contexte, vérifier les informations et construire un dispositif réellement exploitable."
      />

      <div className="mt-12 grid gap-px bg-border lg:grid-cols-2">
        {pillars.map((pillar) => (
          <article
            key={pillar.title}
            className="group flex min-h-[36rem] flex-col bg-background p-6 sm:p-8 lg:p-10"
          >
            <div className="flex items-start justify-between gap-6">
              <span className="font-mono text-xs tracking-[0.18em] text-primary">
                PÔLE {pillar.index}
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
