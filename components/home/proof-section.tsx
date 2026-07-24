import Link from 'next/link'
import { ArrowRight, Calculator, FileCheck2, ShieldCheck } from 'lucide-react'
import { SectionHeader } from '@/components/brand/section-header'
import { Section } from '@/components/layout/section'

const evidence = [
  {
    title: 'Calcul reproductible',
    description:
      'Chaque hypothèse et chaque formule restent visibles. Le résultat peut être recalculé ou contesté.',
    icon: Calculator,
  },
  {
    title: 'Architecture explicite',
    description:
      'Identité, permissions, sources, recherche, inférence et contrôle sont traités comme un seul système.',
    icon: ShieldCheck,
  },
  {
    title: 'Recette téléchargeable',
    description:
      'Un modèle CSV structure les tests de recherche, de fidélité, de refus et de contrôle d’accès.',
    icon: FileCheck2,
  },
]

export function ProofSection() {
  return (
    <Section
      id="preuves"
      tone="dark"
      className="scroll-mt-20 overflow-hidden"
      aria-labelledby="proof-title"
    >
      <div aria-hidden="true" className="technical-grid-pattern absolute inset-0 opacity-15" />
      <div className="relative">
        <SectionHeader
          index="07"
          eyebrow="Preuve technique"
          title={
            <span id="proof-title">
              Des preuves avant
              <br />
              <span className="text-primary">les promesses.</span>
            </span>
          }
          description="Novekia publie une première démonstration de méthode : un scénario RAG local avec hypothèses, architecture, calcul mémoire et protocole de recette."
        />

        <div className="mt-12 grid gap-px bg-border lg:grid-cols-3">
          {evidence.map((item) => {
            const Icon = item.icon

            return (
              <article key={item.title} className="bg-background p-6 sm:p-8">
                <Icon
                  aria-hidden="true"
                  className="size-7 text-primary"
                  strokeWidth={1.4}
                />
                <h3 className="mt-6 text-xl font-semibold">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {item.description}
                </p>
              </article>
            )
          })}
        </div>

        <Link
          href="/ressources/demonstrateur-rag-local"
          className="mt-8 flex min-h-14 items-center justify-between gap-6 border-y border-border py-4 text-lg font-semibold transition-colors hover:text-primary"
        >
          Examiner le démonstrateur RAG local
          <ArrowRight aria-hidden="true" className="size-5 shrink-0" />
        </Link>

      </div>
    </Section>
  )
}
