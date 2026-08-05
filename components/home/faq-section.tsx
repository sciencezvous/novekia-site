import { SectionHeader } from '@/components/brand/section-header'
import { Section } from '@/components/layout/section'

export const homeFaq = [
  {
    question: 'Que fait Novekia ?',
    answer:
      'Novekia est un studio français structuré autour de deux pôles complémentaires. Lead Engine Studio construit des dispositifs de prospection et de qualification commerciale B2B. Novekia Solutions conçoit des sites web, logiciels métiers, automatisations, systèmes d’intelligence artificielle locale et infrastructures de calcul.',
  },
  {
    question:
      'Quelle différence entre Lead Engine Studio et Novekia Solutions ?',
    answer:
      'Lead Engine Studio intervient sur l’identification des entreprises, la qualification des opportunités et la préparation des approches commerciales. Novekia Solutions intervient sur la conception et l’intégration des solutions numériques. Chaque pôle possède son périmètre, ses livrables et ses critères de validation.',
  },
  {
    question:
      'Lead Engine Studio envoie-t-il automatiquement des messages en masse ?',
    answer:
      'Non. Le dispositif privilégie la pertinence, la traçabilité des informations et la supervision humaine. Les actions sensibles et les prises de contact sont préparées selon le cadre défini avec le client, puis validées avant activation.',
  },
  {
    question: 'Les deux pôles peuvent-ils intervenir sur un même besoin ?',
    answer:
      'Oui, lorsque le contexte le justifie. Lead Engine Studio peut clarifier un marché et les signaux commerciaux, tandis que Novekia Solutions peut construire l’outil, l’automatisation ou l’infrastructure nécessaire. Les deux interventions restent toutefois clairement séparées et documentées.',
  },
  {
    question: 'Comment démarre une mission ?',
    answer:
      'La première étape est un échange de qualification. Nous clarifions votre objectif, le contexte, les contraintes, les données disponibles et le résultat attendu. Novekia vous oriente ensuite vers le bon pôle et propose une prochaine étape proportionnée au besoin.',
  },
] as const

export function FaqSection() {
  return (
    <Section id="questions" tone="muted" aria-labelledby="questions-title">
      <SectionHeader
        index="06"
        eyebrow="Questions fréquentes"
        title={<span id="questions-title">Comprendre avant de décider.</span>}
        description="Des réponses directes sur l’organisation de Novekia, le rôle de chaque pôle et notre cadre d’intervention."
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
