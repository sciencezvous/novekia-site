import Link from 'next/link'
import { ArrowUpRight, Check, ChevronDown } from 'lucide-react'
import { Breadcrumbs } from '@/components/brand/breadcrumbs'
import { JsonLd } from '@/components/brand/json-ld'
import { PrimaryButton } from '@/components/brand/primary-button'
import { SecondaryButton } from '@/components/brand/secondary-button'
import { TechnicalLabel } from '@/components/brand/technical-label'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import {
  servicePages,
  type ServicePageData,
} from '@/lib/service-pages'
import { siteConfig } from '@/lib/site-config'

type ServiceLandingPageProps = {
  service: ServicePageData
}

export function ServiceLandingPage({ service }: ServiceLandingPageProps) {
  const url = `${siteConfig.url}/${service.slug}`
  const relatedServices = servicePages.filter(
    (candidate) => candidate.slug !== service.slug,
  )

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: service.metaTitle,
    serviceType: service.serviceType,
    description: service.metaDescription,
    url,
    provider: {
      '@id': `${siteConfig.url}/#organization`,
    },
    areaServed: {
      '@type': 'Country',
      name: 'France',
    },
    audience: {
      '@type': 'BusinessAudience',
      audienceType: 'Entreprises et organisations',
    },
  }

  const breadcrumbJsonLd = {
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
        name: 'Expertises et solutions',
        item: `${siteConfig.url}/offres`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: service.metaTitle,
        item: url,
      },
    ],
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />
      <SiteHeader />
      <main id="contenu">
        <section className="relative overflow-hidden border-b border-border px-5 py-16 sm:px-6 sm:py-24 md:px-8 lg:py-28">
          <div
            aria-hidden="true"
            className="technical-grid-pattern absolute inset-0 opacity-25"
          />
          <div
            aria-hidden="true"
            className="novekia-glow -right-48 -top-32"
          />

          <div className="relative mx-auto max-w-7xl">
            <Breadcrumbs
              items={[
                { label: 'Accueil', href: '/' },
                { label: 'Expertises', href: '/offres' },
                { label: service.metaTitle },
              ]}
            />

            <div className="mt-12 grid items-end gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)] lg:gap-20">
              <div>
                <TechnicalLabel index="01">{service.eyebrow}</TechnicalLabel>
                <h1 className="mt-6 max-w-5xl text-balance text-5xl font-semibold leading-[0.96] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                  {service.title}
                </h1>
                <p className="mt-7 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                  {service.intro}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <PrimaryButton href="/#contact" withArrow>
                    Parler de votre projet
                  </PrimaryButton>
                  <SecondaryButton href="/offres">
                    Voir toutes les expertises
                  </SecondaryButton>
                </div>
              </div>

              <aside className="novekia-surface relative border-l-2 border-l-primary p-6 sm:p-8">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
                  Réponse directe
                </p>
                <p className="mt-5 text-base leading-7 text-foreground/90">
                  {service.directAnswer}
                </p>
              </aside>
            </div>
          </div>
        </section>

        <section className="border-b border-border px-5 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <TechnicalLabel index="02">Problèmes traités</TechnicalLabel>
              <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                Partir du problème réel.
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
                Le choix technique vient après la compréhension des usages, des
                contraintes et du niveau de contrôle attendu.
              </p>
            </div>

            <div className="grid gap-px bg-border sm:grid-cols-3">
              {service.problems.map((problem) => (
                <article
                  key={problem.title}
                  className="min-h-56 bg-background p-6"
                >
                  <h3 className="text-lg font-semibold tracking-tight">
                    {problem.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {problem.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border px-5 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="mx-auto max-w-7xl">
            <TechnicalLabel index="03">Livrables</TechnicalLabel>
            <div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                Une intervention concrète et transmissible.
              </h2>
              <p className="max-w-xl leading-relaxed text-muted-foreground">
                Le périmètre exact est défini pendant le cadrage. Chaque choix
                important est documenté pour rester compréhensible et
                exploitable.
              </p>
            </div>

            <div className="mt-10 grid gap-px bg-border md:grid-cols-2">
              {service.deliverables.map((deliverable) => (
                <article
                  key={deliverable.title}
                  className="group bg-background p-6 transition-colors hover:bg-accent/30 sm:p-8"
                >
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center border border-primary/40 bg-primary/10 text-primary">
                      <Check aria-hidden="true" className="size-4" />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight">
                        {deliverable.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {deliverable.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-border px-5 py-16 sm:px-6 md:px-8 md:py-24">
          <div
            aria-hidden="true"
            className="technical-grid-pattern absolute inset-0 opacity-15"
          />
          <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <TechnicalLabel index="04">Cas d’usage</TechnicalLabel>
              <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                Des usages identifiables, pas une promesse abstraite.
              </h2>
              <ul className="mt-8 divide-y divide-border border-y border-border">
                {service.useCases.map((useCase) => (
                  <li
                    key={useCase}
                    className="flex gap-4 py-4 text-sm leading-relaxed text-foreground/90"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1.5 shrink-0 bg-primary"
                    />
                    {useCase}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <TechnicalLabel index="05">Méthode</TechnicalLabel>
              <ol className="mt-8 grid gap-px bg-border sm:grid-cols-2">
                {service.process.map((step, index) => (
                  <li key={step.title} className="bg-background p-6">
                    <span className="font-mono text-xs text-primary">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-4 text-lg font-semibold tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="border-b border-border px-5 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <TechnicalLabel index="06">Questions fréquentes</TechnicalLabel>
              <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                L’essentiel, sans détour.
              </h2>
            </div>

            <div className="divide-y divide-border border-y border-border">
              {service.faq.map((item) => (
                <details key={item.question} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-base font-semibold outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring">
                    {item.question}
                    <ChevronDown
                      aria-hidden="true"
                      className="size-5 shrink-0 text-primary transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <p className="max-w-3xl pb-6 pr-8 text-sm leading-7 text-muted-foreground">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="mx-auto max-w-7xl">
            <TechnicalLabel index="07">Expertises associées</TechnicalLabel>
            <div className="mt-8 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
              {relatedServices.map((relatedService) => (
                <Link
                  key={relatedService.slug}
                  href={`/${relatedService.slug}`}
                  className="group flex min-h-44 flex-col justify-between bg-background p-6 transition-colors hover:bg-accent/35 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                >
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
                    {relatedService.eyebrow}
                  </span>
                  <span className="mt-8 flex items-end justify-between gap-4 text-base font-semibold tracking-tight">
                    {relatedService.metaTitle}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 shrink-0 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              ))}
            </div>

            <div className="novekia-surface relative mt-16 overflow-hidden p-8 sm:p-10 lg:flex lg:items-end lg:justify-between lg:gap-12">
              <div
                aria-hidden="true"
                className="novekia-glow -bottom-72 -right-40"
              />
              <div className="relative">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
                  Prochaine étape
                </p>
                <h2 className="mt-4 max-w-2xl text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                  Clarifions votre besoin avant de choisir la solution.
                </h2>
              </div>
              <PrimaryButton
                href="/#contact"
                withArrow
                className="relative mt-7 shrink-0 lg:mt-0"
              >
                Demander un premier échange
              </PrimaryButton>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
