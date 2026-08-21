import { SectionHeader } from '@/components/brand/section-header'
import { Section } from '@/components/layout/section'

export const homeFaq = [
  {
    question: 'Que fait Novekia ?',
    answer:
      'Novekia est une entreprise technologique française basée à Villeneuve, dans l’Ain. Elle développe Lead Engine pour la prospection B2B et NovekiAct pour la gouvernance des usages IA en PME. Elle fournit aussi des services d’ingénierie logicielle, d’IA locale et d’infrastructure numérique.',
  },
  {
    question:
      'Quelle relation existe entre Novekia, Lead Engine et NovekiAct ?',
    answer:
      'Novekia est l’entreprise et la marque technologique mère. Lead Engine et NovekiAct sont deux produits développés par Novekia : le premier est consacré à la prospection B2B fondée sur les signaux, le second à la gouvernance des usages d’intelligence artificielle dans les PME.',
  },
  {
    question:
      'Lead Engine envoie-t-il automatiquement des messages en masse ?',
    answer:
      'Non. Le dispositif privilégie la pertinence, la traçabilité des informations et la supervision humaine. Les actions sensibles et les prises de contact sont préparées selon le cadre défini avec le client, puis validées avant activation.',
  },
  {
    question: 'Quel est le statut de NovekiAct ?',
    answer:
      'NovekiAct est un produit en développement par Novekia. Sa page présente son objectif et son périmètre actuel sans promettre une conformité garantie, une certification ou des fonctionnalités non encore disponibles.',
  },
  {
    question: 'Comment démarre une mission ?',
    answer:
      'La première étape est un échange de qualification. Nous clarifions votre objectif, le contexte, les contraintes, les données disponibles et le résultat attendu. Novekia vous oriente ensuite vers le produit ou l’expertise appropriée et propose une prochaine étape proportionnée au besoin.',
  },
] as const

export function FaqSection() {
  return (
    <Section id="questions" tone="muted" aria-labelledby="questions-title">
      <SectionHeader
        index="07"
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
