import type { Metadata } from 'next'
import Image from 'next/image'
import { Check, Quote } from 'lucide-react'
import { Breadcrumbs } from '@/components/brand/breadcrumbs'
import { JsonLd } from '@/components/brand/json-ld'
import { PrimaryButton } from '@/components/brand/primary-button'
import { SecondaryButton } from '@/components/brand/secondary-button'
import { TechnicalLabel } from '@/components/brand/technical-label'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'À propos du studio',
  description:
    'Découvrez Novekia, studio français d’ingénierie technologique fondé par Andy Legrand : logiciels métiers, IA locale, infrastructures de calcul et architectures web.',
  alternates: { canonical: '/a-propos' },
  openGraph: {
    type: 'profile',
    locale: 'fr_FR',
    url: `${siteConfig.url}/a-propos`,
    title: 'À propos du studio — Novekia',
    description:
      'Un studio d’ingénierie technologique qui comprend, conçoit, prototype et déploie des systèmes solides.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Novekia — Synergies Intelligentes',
      },
    ],
  },
}

const principles = [
  {
    title: 'Comprendre avant de prescrire',
    description:
      'Les utilisateurs, les données, les dépendances et les risques sont clarifiés avant le choix d’une solution.',
  },
  {
    title: 'Prototyper ce qui est incertain',
    description:
      'Les hypothèses les plus risquées sont testées tôt, sur des cas représentatifs et avec des critères explicites.',
  },
  {
    title: 'Construire pour l’exploitation',
    description:
      'Architecture, sécurité, documentation, maintenance et transfert font partie du système, pas d’une étape tardive.',
  },
  {
    title: 'Préserver votre maîtrise',
    description:
      'Nous privilégions des solutions compréhensibles, portables et adaptées au niveau de souveraineté attendu.',
  },
]

export default function AboutPage() {
  const aboutUrl = `${siteConfig.url}/a-propos`

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          '@id': `${aboutUrl}#webpage`,
          url: aboutUrl,
          name: 'À propos du studio Novekia',
          description: metadata.description,
          inLanguage: 'fr-FR',
          isPartOf: { '@id': `${siteConfig.url}/#website` },
          mainEntity: { '@id': `${siteConfig.url}/#andy-legrand` },
          about: { '@id': `${siteConfig.url}/#organization` },
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
              name: 'À propos',
              item: aboutUrl,
            },
          ],
        }}
      />
      <SiteHeader />
      <main id="contenu">
        <section className="relative overflow-hidden border-b border-border px-5 py-16 sm:px-6 sm:py-24 md:px-8 lg:py-28">
          <div
            aria-hidden="true"
            className="technical-grid-pattern absolute inset-0 opacity-25"
          />
          <div aria-hidden="true" className="novekia-glow -left-48 top-0" />

          <div className="relative mx-auto max-w-7xl">
            <Breadcrumbs
              items={[
                { label: 'Accueil', href: '/' },
                { label: 'À propos' },
              ]}
            />

            <div className="mt-12 grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
              <div>
                <TechnicalLabel index="01">
                  Studio d’ingénierie technologique
                </TechnicalLabel>
                <h1 className="mt-6 max-w-4xl text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-7xl">
                  Un studio.
                  <br />
                  <span className="text-primary">Pas une agence.</span>
                </h1>
                <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  Novekia réunit la compréhension du métier, l’ingénierie
                  logicielle, l’intelligence artificielle locale et
                  l’infrastructure. L’objectif n’est pas de livrer une
                  apparence&nbsp;: il est de construire un système utile,
                  exploitable et durable.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <PrimaryButton href="/#contact" withArrow>
                    Échanger avec le studio
                  </PrimaryButton>
                  <SecondaryButton href="/offres">
                    Découvrir nos expertises
                  </SecondaryButton>
                </div>
              </div>

              <div className="novekia-surface relative mx-auto w-full max-w-lg p-4 sm:p-6">
                <div className="relative aspect-[4/5] overflow-hidden border border-border bg-[#071224]">
                  <Image
                    src="/andy-legrand-novekia-v3.png"
                    alt="Andy Legrand, fondateur du studio d’ingénierie Novekia"
                    fill
                    priority
                    sizes="(min-width: 1024px) 40vw, 90vw"
                    className="object-cover object-[center_18%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020817]/90 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
                      Fondateur
                    </p>
                    <p className="mt-2 text-xl font-semibold">Andy Legrand</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="vision"
          className="border-b border-border px-5 py-16 sm:px-6 md:px-8 md:py-24"
        >
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
            <div>
              <TechnicalLabel index="02">La vision</TechnicalLabel>
              <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                Relier les disciplines autour d’un résultat.
              </h2>
            </div>

            <blockquote className="relative border-l-2 border-l-primary pl-7 sm:pl-10">
              <Quote
                aria-hidden="true"
                className="size-9 text-primary/60"
                strokeWidth={1.3}
              />
              <p className="mt-6 text-balance text-2xl font-medium leading-relaxed tracking-[-0.025em] sm:text-3xl">
                «&nbsp;Un studio d’ingénierie où l’on comprend, conçoit,
                prototype et déploie des systèmes solides — au plus près de vos
                métiers et sous votre contrôle.&nbsp;»
              </p>
              <footer className="mt-7 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Andy Legrand · Fondateur de Novekia
              </footer>
            </blockquote>
          </div>
        </section>

        <section className="border-b border-border px-5 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="mx-auto max-w-7xl">
            <TechnicalLabel index="03">Principes de travail</TechnicalLabel>
            <h2 className="mt-5 max-w-3xl text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              De la clarté dans les décisions, de la rigueur dans l’exécution.
            </h2>

            <div className="mt-10 grid gap-px bg-border md:grid-cols-2">
              {principles.map((principle) => (
                <article
                  key={principle.title}
                  className="bg-background p-6 sm:p-8"
                >
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center border border-primary/40 bg-primary/10 text-primary">
                      <Check aria-hidden="true" className="size-4" />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight">
                        {principle.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="novekia-surface relative mx-auto max-w-7xl overflow-hidden p-8 sm:p-10 lg:flex lg:items-end lg:justify-between lg:gap-12">
            <div
              aria-hidden="true"
              className="novekia-glow -bottom-72 -right-40"
            />
            <div className="relative">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
                Travailler avec Novekia
              </p>
              <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                Un premier échange suffit pour clarifier la prochaine étape.
              </h2>
            </div>
            <PrimaryButton
              href="/#contact"
              withArrow
              className="relative mt-7 shrink-0 lg:mt-0"
            >
              Présenter votre contexte
            </PrimaryButton>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
