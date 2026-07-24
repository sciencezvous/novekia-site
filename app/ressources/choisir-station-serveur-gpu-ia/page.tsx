import type { Metadata } from 'next'
import { Check } from 'lucide-react'
import { ArticleLayout } from '@/components/resources/article-layout'
import { GpuMemoryCalculator } from '@/components/resources/gpu-memory-calculator'
import { SourceList } from '@/components/resources/source-list'
import { getResourceArticle } from '@/lib/resources'
import { siteConfig } from '@/lib/site-config'

const article = getResourceArticle('choisir-station-serveur-gpu-ia')!

export const metadata: Metadata = {
  title: article.title,
  description: article.description,
  alternates: { canonical: `/ressources/${article.slug}` },
  openGraph: {
    type: 'article',
    locale: 'fr_FR',
    url: `${siteConfig.url}/ressources/${article.slug}`,
    title: article.title,
    description: article.description,
    publishedTime: article.publishedAt,
    modifiedTime: article.modifiedAt,
    authors: ['Andy Legrand'],
    images: ['/og.png'],
  },
}

const tableOfContents = [
  { id: 'charge', label: 'Définir la charge de travail' },
  { id: 'calculateur', label: 'Estimer la mémoire' },
  { id: 'formats', label: 'Station, serveur ou cluster' },
  { id: 'criteres', label: 'Critères hors GPU' },
  { id: 'validation', label: 'Protocole de validation' },
  { id: 'sources', label: 'Sources' },
]

export default function GpuSizingPage() {
  return (
    <ArticleLayout article={article} tableOfContents={tableOfContents}>
      <section id="charge" className="scroll-mt-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          Point de départ
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
          Écrire le profil de charge avant la configuration.
        </h2>
        <p className="mt-5 leading-7 text-muted-foreground">
          « Faire tourner un LLM » n’est pas un besoin dimensionnable. Un profil
          exploitable nomme le modèle ou la famille évaluée, la précision, le
          contexte, le nombre de sessions, la latence cible et la disponibilité
          attendue.
        </p>
        <div className="mt-7 grid gap-px bg-border sm:grid-cols-2">
          {[
            {
              title: 'Modèle et précision',
              text: 'Nombre de paramètres, quantification autorisée et qualité mesurée sur le cas d’usage.',
            },
            {
              title: 'Contexte',
              text: 'Longueur réellement utilisée, taille des documents et mémoire du cache par session.',
            },
            {
              title: 'Concurrence',
              text: 'Utilisateurs simultanés, files d’attente acceptables et pics prévisibles.',
            },
            {
              title: 'Niveau de service',
              text: 'Latence, débit, horaires, indisponibilité acceptable et reprise.',
            },
          ].map((item) => (
            <article key={item.title} className="bg-background p-6">
              <h3 className="font-semibold text-primary">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <GpuMemoryCalculator />

      <section id="formats" className="scroll-mt-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          Format d’infrastructure
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
          Station, serveur ou plusieurs nœuds.
        </h2>
        <div className="mt-7 divide-y divide-border border-y border-border">
          {[
            {
              title: 'Station de travail',
              bestFor:
                'Prototypage, ingénierie, faible concurrence et usage proche de l’utilisateur.',
              watch:
                'Disponibilité, bruit, chaleur, accès distant, sauvegarde et remplacement de la machine.',
            },
            {
              title: 'Serveur mutualisé',
              bestFor:
                'API interne, plusieurs applications, contrôle d’accès centralisé et exploitation continue.',
              watch:
                'Châssis, alimentation, refroidissement, réseau, supervision, maintenance et redondance.',
            },
            {
              title: 'Plusieurs accélérateurs ou nœuds',
              bestFor:
                'Modèle trop grand pour une mémoire unique, débit élevé ou séparation de plusieurs charges.',
              watch:
                'Topologie d’interconnexion, parallélisme du moteur, complexité logicielle et coût d’exploitation.',
            },
          ].map((format) => (
            <article
              key={format.title}
              className="grid gap-5 py-6 lg:grid-cols-[12rem_1fr_1fr]"
            >
              <h3 className="text-lg font-semibold">{format.title}</h3>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
                  Pertinent pour
                </p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {format.bestFor}
                </p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
                  À contrôler
                </p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {format.watch}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="criteres" className="scroll-mt-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          Système complet
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
          La mémoire GPU n’est que le premier filtre.
        </h2>
        <ul className="mt-7 grid gap-4 sm:grid-cols-2">
          {[
            'Débit CPU et mémoire système pour l’ingestion et le prétraitement',
            'Stockage des modèles, index, données et sauvegardes',
            'Réseau entre utilisateurs, stockage et nœuds de calcul',
            'Puissance électrique, refroidissement et implantation',
            'Compatibilité des pilotes, runtimes et outils d’inférence',
            'Supervision, journaux, mises à jour et retour arrière',
            'Disponibilité des pièces et procédure de maintenance',
            'Capacité d’évolution sans remplacer toute la plateforme',
          ].map((criterion) => (
            <li
              key={criterion}
              className="flex items-start gap-3 border border-border bg-card p-4 text-sm leading-6"
            >
              <Check
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-primary"
              />
              {criterion}
            </li>
          ))}
        </ul>
      </section>

      <section id="validation" className="scroll-mt-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          Preuve avant achat
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
          Un protocole simple et reproductible.
        </h2>
        <ol className="mt-7 grid gap-px bg-border md:grid-cols-2">
          {[
            {
              title: 'Figer le candidat',
              text: 'Version du modèle, quantification, moteur d’inférence, paramètres et longueur de contexte.',
            },
            {
              title: 'Rejouer la charge',
              text: 'Questions, documents et concurrence représentatifs, pas seulement une invite courte.',
            },
            {
              title: 'Mesurer',
              text: 'Mémoire maximale, temps avant le premier jeton, débit, latence par percentile et erreurs.',
            },
            {
              title: 'Tester l’exploitation',
              text: 'Démarrage, mise à jour, journalisation, panne, reprise et comportement sous saturation.',
            },
          ].map((step, index) => (
            <li key={step.title} className="bg-background p-6">
              <span className="font-mono text-xs text-primary">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 font-semibold">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-6 border-l-2 border-primary pl-5 text-sm leading-7 text-muted-foreground">
          Le calculateur de cette page n’est pas un benchmark. Il rend une
          hypothèse de mémoire visible ; seul un test avec le modèle, le backend
          et la charge retenus peut valider une configuration.
        </p>
      </section>

      <SourceList
        sources={[
          {
            publisher: 'Hugging Face',
            label: 'Documentation Transformers — bitsandbytes',
            href: 'https://huggingface.co/docs/transformers/v4.57.0/en/quantization/bitsandbytes',
            note: 'Principes et compromis de quantification 8 bits et 4 bits.',
          },
          {
            publisher: 'Hugging Face',
            label: 'Documentation Transformers — quantification',
            href: 'https://huggingface.co/docs/transformers/main_classes/quantization',
          },
          {
            publisher: 'vLLM',
            label: 'Configuration du moteur d’inférence',
            href: 'https://docs.vllm.ai/en/latest/api/vllm/config/index.html',
            note: 'Paramètres de cache, mémoire et parallélisme du moteur.',
          },
          {
            publisher: 'ANSSI',
            label:
              'Recommandations de sécurité pour un système d’IA générative',
            href: 'https://messervices.cyber.gouv.fr/guides/recommandations-de-securite-pour-un-systeme-dia-generative',
          },
        ]}
      />
    </ArticleLayout>
  )
}
