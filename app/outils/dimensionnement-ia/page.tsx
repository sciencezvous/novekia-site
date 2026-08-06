import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Calculator, CheckCircle2, ShieldAlert } from 'lucide-react'
import { Breadcrumbs } from '@/components/brand/breadcrumbs'
import { JsonLd } from '@/components/brand/json-ld'
import { TechnicalLabel } from '@/components/brand/technical-label'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { AiSizingCalculator } from '@/components/tools/ai-sizing-calculator'
import { siteConfig } from '@/lib/site-config'

const pagePath = '/outils/dimensionnement-ia'
const pageUrl = `${siteConfig.url}${pagePath}`

export const metadata: Metadata = {
  title: 'Calculateur de dimensionnement IA local',
  description:
    'Estimez la VRAM, la RAM, le stockage et le type d’architecture nécessaires pour exécuter un modèle d’IA local en entreprise.',
  alternates: { canonical: pagePath },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: pageUrl,
    title: 'Calculateur de dimensionnement IA local — Novekia',
    description:
      'Une première estimation transparente pour cadrer un modèle, sa quantification, son contexte et sa charge simultanée.',
    images: ['/og.png'],
  },
}

const faq = [
  {
    question: 'Cette estimation suffit-elle pour acheter un serveur IA ?',
    answer:
      'Non. Elle fournit une enveloppe de cadrage pour l’inférence. Le choix final dépend du modèle exact, du moteur d’inférence, de la latence attendue, du débit, de la sécurité, du réseau, de l’alimentation et des tests réalisés sur les données du projet.',
  },
  {
    question: 'Pourquoi afficher une fourchette de VRAM ?',
    answer:
      'Les poids du modèle ne constituent qu’une partie de la mémoire utilisée. Le runtime, le cache KV, la longueur du contexte et les sessions simultanées ajoutent une charge qui varie selon l’architecture et le moteur d’inférence.',
  },
  {
    question: 'La quantification 4 bits conserve-t-elle toujours la qualité ?',
    answer:
      'Non. Elle réduit fortement l’empreinte mémoire, mais son effet doit être évalué sur les tâches, documents et critères de qualité réels de l’entreprise.',
  },
] as const

export default function AiSizingToolPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebApplication',
              '@id': `${pageUrl}#application`,
              name: 'Calculateur de dimensionnement IA local Novekia',
              url: pageUrl,
              description: metadata.description,
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
              inLanguage: 'fr-FR',
              isAccessibleForFree: true,
              provider: { '@id': `${siteConfig.url}/#organization` },
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'EUR',
              },
              featureList: [
                'Estimation de la mémoire VRAM',
                'Estimation de la mémoire système',
                'Estimation du stockage initial',
                'Orientation vers un type d’architecture',
              ],
            },
            {
              '@type': 'FAQPage',
              '@id': `${pageUrl}#faq`,
              mainEntity: faq.map((item) => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: item.answer,
                },
              })),
            },
          ],
        }}
      />
      <SiteHeader />
      <main id="contenu">
        <section className="relative overflow-hidden border-b border-border px-5 pb-16 pt-12 sm:px-6 sm:pb-24 md:px-8 lg:pb-28 lg:pt-16">
          <div aria-hidden="true" className="technical-grid-pattern absolute inset-0 opacity-20" />
          <div aria-hidden="true" className="novekia-glow -right-40 -top-44" />
          <div className="relative mx-auto max-w-7xl">
            <Breadcrumbs
              items={[
                { label: 'Accueil', href: '/' },
                { label: 'Ressources', href: '/ressources' },
                { label: 'Dimensionnement IA' },
              ]}
            />
            <div className="mt-12 grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-end lg:gap-20">
              <div>
                <TechnicalLabel index="LAB-01">Novekia Proof Lab</TechnicalLabel>
                <h1 className="mt-7 max-w-5xl text-balance text-5xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-7xl">
                  Dimensionnez votre
                  <span className="block text-primary">IA locale.</span>
                </h1>
              </div>
              <div>
                <Calculator aria-hidden="true" className="size-10 text-primary" strokeWidth={1.35} />
                <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                  Obtenez une première enveloppe de mémoire et d’infrastructure à
                  partir de cinq paramètres. Les hypothèses, réserves et limites
                  restent visibles : aucun matériel n’est recommandé aveuglément.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-border px-5 py-12 sm:px-6 md:px-8 md:py-20">
          <div className="mx-auto max-w-7xl">
            <AiSizingCalculator />
          </div>
        </section>

        <section className="border-b border-border px-5 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div>
              <TechnicalLabel index="02">Méthode transparente</TechnicalLabel>
              <h2 className="mt-7 text-balance text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Une enveloppe,
                <span className="block text-primary">pas un devis matériel.</span>
              </h2>
            </div>

            <div className="grid gap-px bg-border sm:grid-cols-2">
              <article className="min-h-64 bg-background p-6 sm:p-8">
                <CheckCircle2 aria-hidden="true" className="size-7 text-primary" strokeWidth={1.4} />
                <h3 className="mt-6 text-xl font-semibold">Ce que le calcul couvre</h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  Poids quantifiés, réserve runtime, estimation du cache de
                  contexte, concurrence active, mémoire système et stockage du
                  corpus avec marge de versionnement.
                </p>
              </article>
              <article className="min-h-64 bg-background p-6 sm:p-8">
                <ShieldAlert aria-hidden="true" className="size-7 text-primary" strokeWidth={1.4} />
                <h3 className="mt-6 text-xl font-semibold">Ce qui reste à tester</h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  Modèle exact, qualité de quantification, débit en tokens,
                  latence, moteur d’inférence, sécurité, réseau, refroidissement,
                  disponibilité et coût total d’exploitation.
                </p>
              </article>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-7xl border border-border bg-card/40 p-6 sm:p-8">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-primary">
              Formule de cadrage
            </p>
            <p className="mt-4 max-w-5xl text-sm leading-7 text-muted-foreground">
              L’outil part du nombre de paramètres et de la précision effective
              pour estimer les poids chargés. Il ajoute ensuite une réserve de
              runtime et une estimation du cache KV dépendant du contexte et des
              sessions actives, puis applique une marge haute de 25 %. Cette
              méthode volontairement prudente ne remplace pas une mesure avec le
              modèle et le moteur retenus.
            </p>
          </div>
        </section>

        <section className="border-b border-border px-5 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="mx-auto max-w-7xl">
            <TechnicalLabel index="03">Sources techniques</TechnicalLabel>
            <div className="mt-8 grid gap-px bg-border md:grid-cols-3">
              {[
                {
                  title: 'Quantification Transformers',
                  description:
                    'Hugging Face documente la réduction d’empreinte des poids en 8 et 4 bits ainsi que ses limites.',
                  href: 'https://huggingface.co/docs/transformers/main/quantization',
                },
                {
                  title: 'Cache KV quantifié',
                  description:
                    'vLLM explique l’effet du cache KV sur la mémoire et les options de quantification FP8.',
                  href: 'https://docs.vllm.ai/en/latest/features/quantization/quantized_kvcache/',
                },
                {
                  title: 'Déploiement Mistral',
                  description:
                    'Mistral documente l’auto-hébergement et recommande un moteur d’inférence optimisé tel que vLLM.',
                  href: 'https://docs.mistral.ai/models/deployment/local-deployment',
                },
              ].map((source) => (
                <a
                  key={source.href}
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group min-h-64 bg-background p-6 transition-colors hover:bg-accent/30 sm:p-8"
                >
                  <div className="flex items-start justify-between gap-5">
                    <h3 className="text-lg font-semibold">{source.title}</h3>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-5 shrink-0 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </div>
                  <p className="mt-5 text-sm leading-7 text-muted-foreground">
                    {source.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="mx-auto max-w-4xl">
            <TechnicalLabel index="04">Questions fréquentes</TechnicalLabel>
            <div className="mt-8 divide-y divide-border border-y border-border">
              {faq.map((item, index) => (
                <details key={item.question} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <span className="flex items-start gap-4">
                      <span className="mt-1 font-mono text-xs text-primary">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-lg font-semibold tracking-tight">
                        {item.question}
                      </span>
                    </span>
                    <span aria-hidden="true" className="text-2xl font-light text-primary transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="max-w-3xl pb-7 pl-10 text-sm leading-7 text-muted-foreground sm:text-base">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>

            <Link
              href="/ressources/choisir-station-serveur-gpu-ia"
              className="mt-10 flex items-center justify-between gap-5 border-y border-border py-6 text-lg font-semibold transition-colors hover:text-primary"
            >
              Lire le guide pour choisir une station ou un serveur GPU
              <ArrowUpRight aria-hidden="true" className="size-5 shrink-0" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
