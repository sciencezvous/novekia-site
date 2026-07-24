import type { Metadata } from 'next'
import { Check, X } from 'lucide-react'
import { ArticleLayout } from '@/components/resources/article-layout'
import { SourceList } from '@/components/resources/source-list'
import { getResourceArticle } from '@/lib/resources'
import { siteConfig } from '@/lib/site-config'

const article = getResourceArticle('ia-locale-vs-api-cloud')!

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
  { id: 'comparaison', label: 'Comparer les trois options' },
  { id: 'cout-complet', label: 'Calculer le coût complet' },
  { id: 'confidentialite', label: 'Confidentialité et sécurité' },
  { id: 'exploitation', label: 'Exploitation au quotidien' },
  { id: 'decision', label: 'Grille de décision' },
  { id: 'sources', label: 'Sources' },
]

const comparisonRows = [
  {
    criterion: 'Mise en route',
    local: 'Cadrage et infrastructure à préparer',
    cloud: 'Accès rapide après intégration',
    hybrid: 'Deux périmètres à orchestrer',
  },
  {
    criterion: 'Données sensibles',
    local: 'Flux maintenus dans le périmètre défini',
    cloud: 'Dépend des conditions du fournisseur et du contrat',
    hybrid: 'Routage selon la classification des données',
  },
  {
    criterion: 'Charge variable',
    local: 'Capacité réservée à dimensionner',
    cloud: 'Élasticité et facturation à l’usage',
    hybrid: 'Base locale avec capacité externe contrôlée',
  },
  {
    criterion: 'Exploitation',
    local: 'Responsabilité interne ou infogérée',
    cloud: 'Infrastructure opérée par le fournisseur',
    hybrid: 'Supervision des deux environnements',
  },
  {
    criterion: 'Réversibilité',
    local: 'Dépend des formats, licences et outils retenus',
    cloud: 'Dépend des API et services propriétaires',
    hybrid: 'Exige des interfaces et règles de repli explicites',
  },
]

const decisionChecks = [
  'Les données ont été classées et les flux autorisés sont connus.',
  'Le cas d’usage possède un jeu d’évaluation représentatif.',
  'La charge, la latence et la concurrence ont été estimées.',
  'Le coût inclut l’intégration, la sécurité et l’exploitation.',
  'Une personne ou une équipe est responsable du service.',
  'Une solution de repli et des conditions de réversibilité sont documentées.',
]

export default function LocalVsCloudPage() {
  return (
    <ArticleLayout article={article} tableOfContents={tableOfContents}>
      <section id="comparaison" className="scroll-mt-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          Comparaison
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
          Trois options, pas deux camps.
        </h2>
        <p className="mt-5 leading-7 text-muted-foreground">
          « Local » et « cloud » décrivent un lieu d’exécution, pas un niveau de
          qualité automatique. Le bon choix dépend du traitement, des données,
          du niveau de service et de la capacité d’exploitation. Une même
          application peut combiner plusieurs chemins explicitement contrôlés.
        </p>

        <div className="mt-8 overflow-x-auto border border-border">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="bg-card">
              <tr>
                <th className="p-4 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  Critère
                </th>
                <th className="p-4 font-mono text-xs uppercase tracking-[0.12em] text-primary">
                  IA locale
                </th>
                <th className="p-4 font-mono text-xs uppercase tracking-[0.12em] text-primary">
                  API cloud
                </th>
                <th className="p-4 font-mono text-xs uppercase tracking-[0.12em] text-primary">
                  Hybride
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {comparisonRows.map((row) => (
                <tr key={row.criterion} className="align-top">
                  <th className="p-4 font-semibold">{row.criterion}</th>
                  <td className="p-4 leading-6 text-muted-foreground">
                    {row.local}
                  </td>
                  <td className="p-4 leading-6 text-muted-foreground">
                    {row.cloud}
                  </td>
                  <td className="p-4 leading-6 text-muted-foreground">
                    {row.hybrid}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="cout-complet" className="scroll-mt-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          Coût complet
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
          Comparer un TCO, pas un prix facial.
        </h2>
        <p className="mt-5 leading-7 text-muted-foreground">
          Le prix d’un GPU et le prix d’un million de jetons ne sont pas
          comparables seuls. Il faut ramener chaque option à une période, une
          charge et un niveau de service communs.
        </p>
        <div className="mt-7 grid gap-px bg-border md:grid-cols-2">
          <div className="bg-background p-6">
            <p className="font-semibold text-primary">TCO local</p>
            <p className="mt-4 font-mono text-sm leading-7 text-foreground/90">
              matériel amorti + énergie + hébergement + intégration + sécurité +
              exploitation + maintenance
            </p>
          </div>
          <div className="bg-background p-6">
            <p className="font-semibold text-primary">TCO API</p>
            <p className="mt-4 font-mono text-sm leading-7 text-foreground/90">
              requêtes et jetons + stockage + réseau + intégration + contrôles +
              évolution des tarifs et modèles
            </p>
          </div>
        </div>
        <p className="mt-6 border-l-2 border-primary pl-5 text-sm leading-7 text-muted-foreground">
          Une charge stable et élevée peut favoriser l’amortissement local. Une
          charge ponctuelle ou imprévisible peut favoriser la consommation à
          l’usage. Le résultat change avec le modèle, la précision, la
          concurrence et le temps réellement consacré à l’exploitation.
        </p>
      </section>

      <section id="confidentialite" className="scroll-mt-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          Données
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
          Le local réduit certains flux, pas tous les risques.
        </h2>
        <div className="mt-7 grid gap-6 md:grid-cols-2">
          <div className="border border-border bg-card p-6">
            <Check aria-hidden="true" className="size-5 text-primary" />
            <h3 className="mt-4 text-lg font-semibold">
              Ce que le local peut faciliter
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>Limiter l’envoi de documents vers un service tiers.</li>
              <li>Définir le réseau, les journaux et les droits d’accès.</li>
              <li>Maintenir un service dans un environnement déconnecté.</li>
            </ul>
          </div>
          <div className="border border-border bg-card p-6">
            <X aria-hidden="true" className="size-5 text-primary" />
            <h3 className="mt-4 text-lg font-semibold">
              Ce que le local ne garantit pas
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>La qualité ou la véracité des réponses.</li>
              <li>La sécurité du système, des modèles et des connecteurs.</li>
              <li>La conformité sans analyse du traitement et des données.</li>
            </ul>
          </div>
        </div>
        <p className="mt-6 leading-7 text-muted-foreground">
          La CNIL indique qu’un déploiement sur site peut être plus adapté quand
          des documents personnels ou sensibles sont traités, notamment pour un
          RAG. L’ANSSI recommande de traiter l’IA générative comme un système
          complet : données, modèles, composants, accès, administration et
          supervision.
        </p>
      </section>

      <section id="exploitation" className="scroll-mt-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          Opérations
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
          La vraie différence apparaît après le prototype.
        </h2>
        <div className="mt-7 divide-y divide-border border-y border-border">
          {[
            {
              title: 'Mises à jour',
              description:
                'Qui valide un nouveau modèle, une quantification, un pilote ou une dépendance ? Comment revenir à la version précédente ?',
            },
            {
              title: 'Qualité',
              description:
                'Quels jeux de tests détectent une régression ? Qui décide qu’une réponse est acceptable pour le métier ?',
            },
            {
              title: 'Sécurité',
              description:
                'Quels utilisateurs accèdent à quelles données ? Quels journaux sont conservés ? Comment les secrets et connecteurs sont-ils isolés ?',
            },
            {
              title: 'Continuité',
              description:
                'Que se passe-t-il si le service, un accélérateur, le réseau ou le fournisseur externe est indisponible ?',
            },
          ].map((item) => (
            <article key={item.title} className="grid gap-3 py-5 md:grid-cols-[10rem_1fr]">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm leading-7 text-muted-foreground">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="decision" className="scroll-mt-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
          Go / no-go
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
          Six réponses avant de choisir.
        </h2>
        <ul className="mt-7 grid gap-3 sm:grid-cols-2">
          {decisionChecks.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 border border-border bg-card p-4 text-sm leading-6"
            >
              <Check
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-primary"
              />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <SourceList
        sources={[
          {
            publisher: 'CNIL',
            label:
              'Questions-réponses sur l’utilisation d’un système d’IA générative',
            href: 'https://cnil.fr/fr/les-questions-reponses-de-la-cnil-sur-lutilisation-dun-systeme-dia-generative',
            note: 'Choix du mode de déploiement et traitement de documents personnels ou sensibles.',
          },
          {
            publisher: 'ANSSI',
            label:
              'Recommandations de sécurité pour un système d’IA générative',
            href: 'https://messervices.cyber.gouv.fr/guides/recommandations-de-securite-pour-un-systeme-dia-generative',
            note: 'Sécurisation de l’écosystème, des données, des accès et de l’exploitation.',
          },
          {
            publisher: 'CNIL',
            label: 'Comment se mettre en conformité pour un système d’IA',
            href: 'https://www.cnil.fr/fr/ia-comment-se-mettre-en-conformite',
          },
        ]}
      />
    </ArticleLayout>
  )
}
