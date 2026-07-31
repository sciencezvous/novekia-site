import type { Metadata } from 'next'
import {
  ClipboardCheck,
  Eye,
  FileSearch,
  Gauge,
  Search,
  ShieldCheck,
  Target,
  UserCheck,
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
  title: 'Lead Engine Studio — prospection B2B qualifiée',
  description:
    'Novekia Lead Engine Studio construit et opère des dispositifs de prospection B2B personnalisés : ciblage, recherche, qualification et préparation des approches sous supervision humaine.',
  alternates: { canonical: '/lead-engine-studio' },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: `${siteConfig.url}/lead-engine-studio`,
    title: 'Novekia Lead Engine Studio — prospection B2B qualifiée',
    description:
      'Transformez votre marché en opportunités commerciales documentées, priorisées et prêtes à être activées sous supervision humaine.',
    images: ['/og.png'],
  },
}

const capabilities = [
  'Définition de la cible',
  'Recherche d’entreprises',
  'Analyse de signaux publics',
  'Qualification des opportunités',
  'Recherche des bons interlocuteurs',
  'Préparation d’approches personnalisées',
  'Suivi et reporting',
] as const

const deliverables = [
  {
    title: 'Une cible définie',
    description:
      'Les critères de marché, de taille, de contexte et de pertinence sont explicités.',
  },
  {
    title: 'Des entreprises documentées',
    description:
      'Chaque organisation retenue est reliée aux informations publiques utiles à la décision.',
  },
  {
    title: 'Des opportunités classées',
    description:
      'Les comptes sont priorisés selon un cadre de qualification partagé.',
  },
  {
    title: 'Les raisons de la qualification',
    description:
      'Les signaux favorables, les réserves et le niveau de confiance restent visibles.',
  },
  {
    title: 'Des angles de prise de contact',
    description:
      'Les approches proposées sont adaptées au contexte et au positionnement du client.',
  },
  {
    title: 'Les validations nécessaires',
    description:
      'Les points sensibles ou incomplets sont identifiés avant toute activation.',
  },
] as const

const method = [
  {
    title: 'Cadrage',
    description: 'Définir le marché, la cible, l’offre et les critères utiles.',
  },
  {
    title: 'Recherche',
    description: 'Identifier les entreprises et collecter les signaux publics.',
  },
  {
    title: 'Qualification',
    description: 'Évaluer la pertinence et documenter les raisons du classement.',
  },
  {
    title: 'Validation',
    description: 'Faire contrôler les données, priorités et points sensibles.',
  },
  {
    title: 'Activation',
    description: 'Préparer les approches selon le canal et le cadre convenus.',
  },
  {
    title: 'Amélioration',
    description: 'Mesurer les retours et ajuster les critères du dispositif.',
  },
] as const

const safeguards = [
  'Pas d’envoi massif non contrôlé',
  'Pas de données inventées',
  'Pas de garantie artificielle de rendez-vous',
  'Validation humaine pour les actions sensibles',
  'Respect des règles applicables à la prospection',
] as const

const audiences = [
  'PME B2B',
  'Entreprises avec un cycle de vente complexe',
  'Prestataires techniques',
  'Cabinets et studios spécialisés',
  'Structures souhaitant professionnaliser leur prospection',
] as const

export default function LeadEngineStudioPage() {
  const pageUrl = `${siteConfig.url}/lead-engine-studio`

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: 'Novekia Lead Engine Studio',
          description: metadata.description,
          inLanguage: 'fr-FR',
          isPartOf: { '@id': `${siteConfig.url}/#website` },
          about: { '@id': `${pageUrl}#service` },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          '@id': `${pageUrl}#service`,
          name: 'Novekia Lead Engine Studio',
          serviceType:
            'Prospection et qualification commerciale B2B sous supervision humaine',
          url: pageUrl,
          provider: { '@id': `${siteConfig.url}/#organization` },
          areaServed: { '@type': 'Country', name: 'France' },
          description: metadata.description,
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
              name: 'Lead Engine Studio',
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
          <div aria-hidden="true" className="novekia-glow -left-44 top-0" />

          <div className="relative mx-auto max-w-7xl">
            <Breadcrumbs
              items={[
                { label: 'Accueil', href: '/' },
                { label: 'Lead Engine Studio' },
              ]}
            />
            <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20">
              <div>
                <TechnicalLabel index="01">
                  Novekia Lead Engine Studio
                </TechnicalLabel>
                <h1 className="mt-6 max-w-5xl text-balance text-5xl font-semibold leading-[0.94] tracking-[-0.055em] sm:text-7xl">
                  Transformez votre marché en{' '}
                  <span className="text-primary">
                    opportunités commerciales qualifiées.
                  </span>
                </h1>
              </div>

              <div>
                <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                  Nous identifions les entreprises pertinentes, analysons les
                  signaux disponibles, qualifions les opportunités et préparons
                  des approches commerciales adaptées à votre positionnement.
                </p>
                <PrimaryButton href="/#contact" withArrow className="mt-8">
                  Parler de ma prospection
                </PrimaryButton>
                <p className="mt-4 font-mono text-xs tracking-wide text-muted-foreground">
                  Dispositif personnalisé · Supervision humaine · Sources
                  traçables
                </p>
              </div>
            </div>
          </div>
        </section>

        <Section
          id="capacites"
          tone="light"
          containerSize="wide"
          aria-labelledby="capacites-title"
        >
          <SectionHeader
            index="02"
            eyebrow="Périmètre"
            title={
              <span id="capacites-title">
                Ce que fait
                <br />
                <span className="text-primary">Lead Engine Studio.</span>
              </span>
            }
            description="Un dispositif concentré sur la prospection et la qualification commerciale, du cadrage de la cible à la préparation de l’activation."
          />

          <div className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((capability, index) => (
              <article
                key={capability}
                className="min-h-44 bg-background p-6 sm:p-7"
              >
                <span className="font-mono text-xs text-primary">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-6 text-lg font-semibold tracking-tight">
                  {capability}
                </h3>
              </article>
            ))}
            <article className="flex min-h-44 items-end bg-secondary p-6 sm:p-7 lg:col-span-1">
              <p className="text-sm leading-7 text-muted-foreground">
                Le périmètre exact est défini à partir de votre marché, de votre
                cycle de vente et de vos capacités d’activation.
              </p>
            </article>
          </div>
        </Section>

        <Section
          id="livrables"
          tone="muted"
          containerSize="wide"
          aria-labelledby="livrables-title"
        >
          <SectionHeader
            index="03"
            eyebrow="Livrables"
            title={
              <span id="livrables-title">
                Ce que le client
                <br />
                <span className="text-primary">reçoit réellement.</span>
              </span>
            }
            description="Des éléments exploitables et documentés, pas une liste opaque de contacts."
          />

          <div className="mt-12 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
            {deliverables.map((deliverable) => (
              <article
                key={deliverable.title}
                className="min-h-64 bg-background p-6 sm:p-8"
              >
                <ClipboardCheck
                  aria-hidden="true"
                  className="size-7 text-primary"
                  strokeWidth={1.4}
                />
                <h3 className="mt-7 text-lg font-semibold">
                  {deliverable.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {deliverable.description}
                </p>
              </article>
            ))}
          </div>
        </Section>

        <Section
          id="methode"
          tone="light"
          containerSize="wide"
          aria-labelledby="lead-method-title"
        >
          <SectionHeader
            index="04"
            eyebrow="Méthode"
            title={
              <span id="lead-method-title">
                De la cible à
                <br />
                <span className="text-primary">l’amélioration continue.</span>
              </span>
            }
            description="Six étapes reliées par des validations explicites et un reporting compréhensible."
          />

          <ol className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {method.map((step, index) => (
              <li
                key={step.title}
                className="min-h-56 bg-background p-6 sm:p-8"
              >
                <span className="font-mono text-xs tracking-[0.15em] text-primary">
                  ÉTAPE {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-7 text-xl font-semibold">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </Section>

        <Section
          id="supervision"
          tone="dark"
          contained={false}
          aria-labelledby="supervision-title"
          className="overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="technical-grid-pattern absolute inset-0 opacity-20"
          />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 md:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div>
              <TechnicalLabel index="05">
                Supervision et responsabilité
              </TechnicalLabel>
              <h2
                id="supervision-title"
                className="mt-6 text-balance text-4xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl"
              >
                L’automatisation ne remplace pas{' '}
                <span className="text-primary">le contrôle.</span>
              </h2>
              <p className="mt-6 max-w-xl leading-7 text-muted-foreground">
                La qualité d’un dispositif de prospection dépend de la
                pertinence des critères, de la fiabilité des informations et de
                la responsabilité appliquée aux actions externes.
              </p>
            </div>

            <ul className="grid gap-px bg-border">
              {safeguards.map((safeguard) => (
                <li
                  key={safeguard}
                  className="flex min-h-20 items-center gap-4 bg-background px-5 py-4 sm:px-7"
                >
                  <ShieldCheck
                    aria-hidden="true"
                    className="size-5 shrink-0 text-primary"
                  />
                  <span className="font-medium">{safeguard}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section
          id="pour-qui"
          tone="light"
          containerSize="wide"
          aria-labelledby="audiences-title"
        >
          <SectionHeader
            index="06"
            eyebrow="Pour qui"
            title={
              <span id="audiences-title">
                Un cadre utile lorsque la vente
                <br />
                <span className="text-primary">demande du contexte.</span>
              </span>
            }
          />

          <div className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-5">
            {audiences.map((audience, index) => {
              const Icon = [Target, Search, Gauge, UserCheck, FileSearch][index]

              return (
                <article
                  key={audience}
                  className="min-h-56 bg-background p-6"
                >
                  <Icon
                    aria-hidden="true"
                    className="size-6 text-primary"
                    strokeWidth={1.4}
                  />
                  <h3 className="mt-7 text-base font-semibold leading-6">
                    {audience}
                  </h3>
                </article>
              )
            })}
          </div>
        </Section>

        <section className="border-t border-border px-5 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="novekia-surface relative mx-auto max-w-7xl overflow-hidden p-8 sm:p-10 lg:flex lg:items-end lg:justify-between lg:gap-12">
            <div aria-hidden="true" className="novekia-glow -bottom-72 -right-40" />
            <div className="relative">
              <div className="flex items-center gap-3 text-primary">
                <Eye aria-hidden="true" className="size-6" />
                <span className="font-mono text-xs uppercase tracking-[0.18em]">
                  Premier échange
                </span>
              </div>
              <h2 className="mt-5 max-w-3xl text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                Clarifions votre cible avant de construire le dispositif.
              </h2>
            </div>
            <PrimaryButton
              href="/#contact"
              withArrow
              className="relative mt-8 shrink-0 lg:mt-0"
            >
              Parler de ma prospection
            </PrimaryButton>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
