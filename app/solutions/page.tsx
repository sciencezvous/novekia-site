import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowUpRight,
  Bot,
  Braces,
  Cpu,
  Layers3,
  MonitorCog,
  SearchCheck,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/brand/breadcrumbs'
import { JsonLd } from '@/components/brand/json-ld'
import { PrimaryButton } from '@/components/brand/primary-button'
import { SectionHeader } from '@/components/brand/section-header'
import { TechnicalLabel } from '@/components/brand/technical-label'
import { Section } from '@/components/layout/section'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Solutions numériques — conception et intégration',
  description:
    'Sites web, logiciels métiers, automatisations, IA locale et infrastructures de calcul conçus selon vos usages et contraintes réels.',
  alternates: { canonical: '/solutions' },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: `${siteConfig.url}/solutions`,
    title: 'Novekia Solutions — conception et intégration numérique',
    description:
      'Un point d’entrée clair vers les prestations techniques Novekia, des sites web aux infrastructures IA.',
    images: ['/og.png'],
  },
}

const solutions = [
  {
    title: 'Sites web premium, SEO et GEO',
    description:
      'Des expériences web rapides, structurées et conçues pour rendre votre expertise compréhensible par vos visiteurs et les moteurs.',
    href: '/creation-site-web-seo-geo',
    icon: SearchCheck,
  },
  {
    title: 'Logiciels métiers sur mesure',
    description:
      'Des outils adaptés à vos processus, vos règles de gestion et vos équipes, sans imposer un fonctionnement générique.',
    href: '/logiciels-metiers-sur-mesure',
    icon: MonitorCog,
  },
  {
    title: 'Applications, intégrations et automatisations',
    description:
      'Des interfaces, API et flux qui relient vos systèmes existants et réduisent les tâches manuelles à faible valeur.',
    href: '/applications-web-integrations',
    icon: Braces,
  },
  {
    title: 'Intelligence artificielle locale',
    description:
      'Des systèmes d’IA exécutés dans un environnement maîtrisé, avec des critères explicites de qualité et d’exploitation.',
    href: '/intelligence-artificielle-locale',
    icon: Bot,
  },
  {
    title: 'Stations et serveurs IA',
    description:
      'Des configurations de calcul dimensionnées selon les modèles, les volumes, la concurrence et les contraintes d’usage.',
    href: '/infrastructures-serveurs-ia',
    icon: Cpu,
  },
  {
    title: 'Vue d’ensemble des offres',
    description:
      'Les domaines d’intervention Novekia réunis dans une vue synthétique pour orienter un premier échange.',
    href: '/offres',
    icon: Layers3,
  },
] as const

export default function SolutionsPage() {
  const pageUrl = `${siteConfig.url}/solutions`

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: 'Novekia Solutions',
          description: metadata.description,
          inLanguage: 'fr-FR',
          isPartOf: { '@id': `${siteConfig.url}/#website` },
          about: { '@id': `${siteConfig.url}/#organization` },
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: solutions.map((solution, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: solution.title,
              url: `${siteConfig.url}${solution.href}`,
            })),
          },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Accueil',
              item: siteConfig.url,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Solutions',
              item: pageUrl,
            },
          ],
        }}
      />

      <SiteHeader />
      <main id="contenu">
        <section className="section-dark relative overflow-hidden border-b border-border px-5 py-16 text-foreground sm:px-6 sm:py-24 md:px-8 lg:py-28">
          <div
            aria-hidden="true"
            className="technical-grid-pattern absolute inset-0 opacity-25"
          />
          <div aria-hidden="true" className="novekia-glow -right-40 -top-40" />

          <div className="relative mx-auto max-w-7xl">
            <Breadcrumbs
              items={[
                { label: 'Accueil', href: '/' },
                { label: 'Solutions' },
              ]}
            />
            <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20">
              <div>
                <TechnicalLabel index="01">Novekia Solutions</TechnicalLabel>
                <h1 className="mt-6 max-w-5xl text-balance text-5xl font-semibold leading-[0.94] tracking-[-0.055em] sm:text-7xl">
                  Des solutions numériques conçues autour de{' '}
                  <span className="text-primary">vos usages réels.</span>
                </h1>
              </div>
              <div>
                <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                  Sites web, logiciels métiers, automatisations, intelligence
                  artificielle locale et infrastructures de calcul&nbsp;:
                  Novekia conçoit des systèmes cohérents, documentés et adaptés
                  à votre contexte.
                </p>
                <PrimaryButton href="/#contact" withArrow className="mt-8">
                  Parler de votre projet
                </PrimaryButton>
              </div>
            </div>
          </div>
        </section>

        <Section
          id="expertises"
          tone="light"
          containerSize="wide"
          aria-labelledby="solutions-title"
        >
          <SectionHeader
            index="02"
            eyebrow="Domaines d’intervention"
            title={
              <span id="solutions-title">
                Un point d’entrée.
                <br />
                <span className="text-primary">Six parcours spécialisés.</span>
              </span>
            }
            description="Chaque catégorie mène vers une page dédiée qui précise les usages, le périmètre et la méthode de la prestation."
          />

          <div className="mt-12 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
            {solutions.map((solution, index) => {
              const Icon = solution.icon

              return (
                <article
                  key={solution.href}
                  className="group flex min-h-[22rem] flex-col bg-background p-6 sm:p-8"
                >
                  <div className="flex items-start justify-between gap-5">
                    <Icon
                      aria-hidden="true"
                      className="size-7 text-primary"
                      strokeWidth={1.4}
                    />
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-8 text-balance text-2xl font-semibold tracking-[-0.03em]">
                    {solution.title}
                  </h3>
                  <p className="mt-5 text-sm leading-7 text-muted-foreground">
                    {solution.description}
                  </p>
                  <Link
                    href={solution.href}
                    className="mt-auto inline-flex min-h-11 w-fit items-center gap-2 pt-8 font-mono text-xs uppercase tracking-[0.14em] text-primary outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Découvrir : ${solution.title}`}
                  >
                    Découvrir
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>
                </article>
              )
            })}
          </div>
        </Section>

        <Section
          tone="muted"
          containerSize="wide"
          aria-labelledby="solutions-method-title"
        >
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
            <div>
              <TechnicalLabel index="03">Principe de conception</TechnicalLabel>
              <h2
                id="solutions-method-title"
                className="mt-6 text-balance text-4xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl"
              >
                La solution vient
                <br />
                <span className="text-primary">après le besoin.</span>
              </h2>
            </div>

            <div className="novekia-surface p-6 sm:p-8">
              <p className="text-lg leading-8 text-foreground">
                Novekia commence par clarifier les utilisateurs, les données,
                les contraintes et le résultat attendu. Le choix d’un outil,
                d’un modèle d’IA ou d’une infrastructure intervient seulement
                lorsque ces éléments sont suffisamment compris.
              </p>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  'Architecture adaptée',
                  'Critères de validation',
                  'Documentation exploitable',
                  'Réversibilité maîtrisée',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 border border-border bg-background/60 p-4 text-sm"
                  >
                    <span
                      aria-hidden="true"
                      className="size-1.5 shrink-0 bg-primary"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <section className="border-t border-border px-5 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="novekia-surface relative mx-auto max-w-7xl overflow-hidden p-8 sm:p-10 lg:flex lg:items-end lg:justify-between lg:gap-12">
            <div aria-hidden="true" className="novekia-glow -bottom-72 -right-40" />
            <div className="relative">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
                Point de départ
              </p>
              <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                Décrivez votre usage, nous clarifierons le bon parcours.
              </h2>
            </div>
            <PrimaryButton
              href="/#contact"
              withArrow
              className="relative mt-8 shrink-0 lg:mt-0"
            >
              Parler de votre projet
            </PrimaryButton>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
