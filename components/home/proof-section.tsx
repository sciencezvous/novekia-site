import Link from 'next/link'
import {
  ArrowUpRight,
  Calculator,
  FileCheck2,
  ShieldCheck,
} from 'lucide-react'
import { SectionHeader } from '@/components/brand/section-header'
import { Section } from '@/components/layout/section'

const evidence = [
  {
    eyebrow: 'Lead Engine Studio',
    title: 'Un dispositif commercial explicite',
    description:
      'Ciblage, critères de qualification, recherche des décideurs et livrables sont présentés avant le démarrage.',
    href: '/lead-engine-studio#livrables',
    cta: 'Voir les livrables',
    icon: ShieldCheck,
  },
  {
    eyebrow: 'Novekia Solutions',
    title: 'Un démonstrateur RAG reproductible',
    description:
      'Le scénario, l’architecture, le calcul mémoire et le protocole de recette peuvent être examinés et contestés.',
    href: '/ressources/demonstrateur-rag-local',
    cta: 'Examiner le démonstrateur',
    icon: Calculator,
  },
  {
    eyebrow: 'Décision technique',
    title: 'Des guides sourcés et actionnables',
    description:
      'IA locale, RAG et dimensionnement GPU sont traités avec critères de décision, limites et sources vérifiables.',
    href: '/ressources',
    cta: 'Consulter les ressources',
    icon: FileCheck2,
  },
] as const

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
          index="02"
          eyebrow="Preuves vérifiables"
          title={
            <span id="proof-title">
              Vérifiez notre méthode
              <br />
              <span className="text-primary">avant de nous confier un projet.</span>
            </span>
          }
          description="Novekia montre ses périmètres, ses livrables et une partie de sa méthode avant le premier échange. Aucun résultat commercial ou technique dépendant d’un tiers n’est garanti artificiellement."
        />

        <div className="mt-12 grid gap-px bg-border lg:grid-cols-3">
          {evidence.map((item) => {
            const Icon = item.icon

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group flex min-h-80 flex-col bg-background p-6 outline-none transition-colors hover:bg-accent/30 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:p-8"
              >
                <div className="flex items-start justify-between gap-6">
                  <Icon
                    aria-hidden="true"
                    className="size-7 text-primary"
                    strokeWidth={1.4}
                  />
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-5 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>
                <p className="mt-7 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-primary">
                  {item.eyebrow}
                </p>
                <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {item.description}
                </p>
                <span className="mt-auto pt-8 font-mono text-xs uppercase tracking-[0.14em] text-primary">
                  {item.cta}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
