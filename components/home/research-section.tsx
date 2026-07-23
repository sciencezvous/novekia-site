import { SectionHeader } from '@/components/brand/section-header'
import { Section } from '@/components/layout/section'

const researchAxes = [
  {
    index: '01',
    title: 'Orchestration d’IA locale',
    description:
      'Étude de systèmes capables de combiner plusieurs modèles, outils, sources documentaires et mécanismes de vérification.',
    icon: <><circle cx="6" cy="12" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="18" cy="18" r="2" /><path d="m8 11 8-4M8 13l8 4" /></>,
  },
  {
    index: '02',
    title: 'Infrastructure de calcul spécialisée',
    description:
      'Exploration d’architectures adaptées à l’inférence locale, aux traitements intensifs et aux contraintes de performance, de coût et d’énergie.',
    icon: <><rect x="4" y="5" width="16" height="14" rx="1" /><path d="M8 9h8M8 13h5M8 17h8M2 9h2M20 9h2M2 15h2M20 15h2" /></>,
  },
  {
    index: '03',
    title: 'Fiabilité des systèmes intelligents',
    description:
      'Travail sur la traçabilité, l’évaluation, la sécurité, la qualité des réponses et le maintien d’un contrôle humain.',
    icon: <><path d="M12 3 5 6v5c0 4.6 2.9 8.1 7 10 4.1-1.9 7-5.4 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-5" /></>,
  },
]

export function ResearchSection() {
  return (
    <Section
      id="research"
      tone="muted"
      className="scroll-mt-20"
      aria-labelledby="research-title"
    >
      <SectionHeader
        index="07"
        eyebrow="Recherche & Développement"
        title={<span id="research-title">De la recherche appliquée aux produits.</span>}
        description="Un effort continu de R&D pour repousser les limites techniques."
      />

      <div className="mt-12 grid grid-cols-1 gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
        {researchAxes.map((axis) => (
          <article
            key={axis.index}
            className="group relative flex flex-col bg-secondary p-5 transition-colors duration-200 hover:bg-background sm:p-6 md:p-8"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-xs tracking-[0.18em] text-primary">
                AXE {axis.index}
              </span>
              <span className="border border-border bg-background px-2 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground">
                R&amp;D appliquée
              </span>
            </div>
            <span className="mt-8 flex size-10 items-center justify-center border border-border text-primary transition-colors group-hover:border-primary/50">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
                {axis.icon}
              </svg>
            </span>
            <h3 className="mt-6 text-lg font-semibold text-foreground">{axis.title}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{axis.description}</p>
            <span aria-hidden="true" className="mt-8 h-px w-12 bg-primary/50 transition-all duration-200 group-hover:w-20" />
          </article>
        ))}
      </div>

      <p className="mt-12 border-l-2 border-primary/40 bg-background/70 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
        Les travaux de recherche sont présentés comme des axes d’exploration et non comme des produits finalisés lorsqu’ils sont encore en développement.
      </p>
    </Section>
  )
}
