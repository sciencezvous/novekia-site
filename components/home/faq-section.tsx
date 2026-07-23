import { SectionHeader } from '@/components/brand/section-header'
import { Section } from '@/components/layout/section'

export const homeFaq = [
  {
    question: 'Que fait Novekia ?',
    answer:
      'Novekia est un studio français d’ingénierie technologique. Nous concevons des logiciels métiers, des systèmes d’intelligence artificielle locale, des infrastructures de calcul et des applications web pour les organisations qui veulent garder la maîtrise de leurs données et de leurs outils.',
  },
  {
    question: 'Quelle différence entre IA locale, IA privée et IA souveraine ?',
    answer:
      'Une IA locale s’exécute sur une infrastructure contrôlée par l’organisation. Une IA privée insiste sur la confidentialité des accès et des données. La souveraineté ajoute la maîtrise des dépendances, de l’hébergement, des modèles et des conditions d’exploitation. Le bon niveau dépend du cas d’usage.',
  },
  {
    question: 'Comment Novekia améliore-t-elle le SEO et le GEO ?',
    answer:
      'Nous travaillons la structure technique, les performances, les métadonnées, les données structurées et surtout la clarté du contenu. Le GEO complète le SEO en rendant les offres, les preuves et les réponses suffisamment explicites pour être comprises et citées par les moteurs génératifs.',
  },
  {
    question: 'Novekia intervient-elle uniquement sur des projets d’IA ?',
    answer:
      'Non. Nous intervenons aussi sur les logiciels métiers, les architectures web, les réseaux, les stations de calcul, les serveurs GPU et l’intégration de systèmes. L’IA n’est retenue que lorsqu’elle apporte une valeur mesurable.',
  },
  {
    question: 'Comment démarre une mission ?',
    answer:
      'La première étape est un échange de qualification. Nous clarifions le besoin, les utilisateurs, les contraintes, les données disponibles et le résultat attendu. Selon le contexte, la suite prend la forme d’un audit, d’un atelier d’architecture ou d’un prototype.',
  },
] as const

export function FaqSection() {
  return (
    <Section id="questions" tone="muted" aria-labelledby="questions-title">
      <SectionHeader
        index="07"
        eyebrow="Questions fréquentes"
        title={<span id="questions-title">Comprendre avant de décider.</span>}
        description="Des réponses directes sur notre métier, notre approche de l’IA privée et notre travail SEO/GEO."
      />

      <div className="mt-12 divide-y divide-border border-y border-border">
        {homeFaq.map((item, index) => (
          <details key={item.question} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span className="flex items-start gap-4">
                <span className="mt-1 font-mono text-xs text-primary">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-lg font-semibold tracking-tight text-foreground">
                  {item.question}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="text-2xl font-light text-primary transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="max-w-3xl pb-7 pl-10 text-sm leading-7 text-muted-foreground sm:text-base">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </Section>
  )
}
