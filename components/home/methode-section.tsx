import { SectionHeader } from '@/components/brand/section-header'
import { Section } from '@/components/layout/section'

const steps = [
  {
    id: 'methode-comprendre',
    index: '01',
    title: 'Comprendre',
    description:
      'Définir le besoin, le marché, les contraintes et les objectifs avant de recommander une action.',
  },
  {
    id: 'methode-analyser',
    index: '02',
    title: 'Analyser',
    description:
      'Collecter, croiser et vérifier les informations réellement utiles à la décision.',
  },
  {
    id: 'methode-construire',
    index: '03',
    title: 'Construire',
    description:
      'Préparer la stratégie commerciale ou concevoir la solution technique adaptée au contexte.',
  },
  {
    id: 'methode-piloter',
    index: '04',
    title: 'Piloter',
    description:
      'Mesurer les résultats, documenter les décisions et améliorer le dispositif dans la durée.',
  },
]

function StepIcon({ index }: { index: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden="true"
    >
      {index === '01' ? <><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></> : null}
      {index === '02' ? <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4M8 11h6M11 8v6" /></> : null}
      {index === '03' ? <><path d="M4 18V8l8-4 8 4v10l-8 3-8-3Z" /><path d="m4 8 8 4 8-4M12 12v9" /></> : null}
      {index === '04' ? <><path d="M5 19h14M7 16l3-3 3 2 4-6" /><circle cx="17" cy="9" r="2" /></> : null}
    </svg>
  )
}

export function MethodeSection() {
  return (
    <Section id="methode" tone="light" aria-labelledby="methode-title">
      <SectionHeader
        index="02"
        eyebrow="Méthode commune"
        title={<span id="methode-title">Une méthode pour décider et exécuter.</span>}
        description="Le même cadre de travail relie la prospection, la qualification commerciale et la conception de solutions techniques."
      />

      <ol className="relative mt-12 grid grid-cols-1 gap-0 md:grid-cols-4">
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-5 top-0 w-px bg-border md:bottom-auto md:left-0 md:right-0 md:top-5 md:h-px md:w-auto"
        />
        {steps.map((step) => (
          <li
            id={step.id}
            key={step.index}
            className="group relative grid grid-cols-[2.5rem_1fr] gap-5 pb-10 last:pb-0 md:flex md:flex-col md:gap-5 md:pb-0 md:pr-7 md:last:pr-0"
          >
            <span className="relative flex size-10 items-center justify-center border border-border bg-background text-primary transition-colors duration-200 group-hover:border-primary group-focus-within:border-primary">
              <StepIcon index={step.index} />
            </span>
            <div className="pt-1 md:pt-0">
              <span className="font-mono text-xs tracking-[0.16em] text-primary">
                {step.index}
              </span>
              <h3 className="mt-2 text-base font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-12 border-l-2 border-primary/40 bg-secondary/50 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
        Chaque étape produit des éléments vérifiables avant de passer à la
        suivante&nbsp;: hypothèses, sources, décisions, livrables et critères de
        validation.
      </p>
    </Section>
  )
}
