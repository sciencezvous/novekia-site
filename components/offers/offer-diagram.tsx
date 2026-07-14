import type { OfferData } from '@/lib/offers'

const diagramCopy = {
  wifi: {
    title: 'Chaîne de diagnostic radio',
    labels: ['Usages', 'Mesures sur site', 'Analyse radio', 'Plan d’action'],
  },
  network: {
    title: 'Architecture d’interconnexion',
    labels: ['Sites', 'Accès sécurisés', 'Routage privé', 'Services partagés'],
  },
  workshop: {
    title: 'Décisions d’architecture IA',
    labels: ['Cas d’usage', 'Données', 'Modèles & sécurité', 'Prototype cible'],
  },
  ai: {
    title: 'Chaîne d’inférence privée',
    labels: ['Applications', 'API privée', 'Runtime IA', 'GPU & données'],
  },
} satisfies Record<OfferData['diagram'], { title: string; labels: string[] }>

export function OfferDiagram({ type }: { type: OfferData['diagram'] }) {
  const diagram = diagramCopy[type]

  return (
    <figure className="border border-border bg-card/70 p-5 sm:p-7" aria-labelledby={`diagram-${type}-title`}>
      <figcaption id={`diagram-${type}-title`} className="mb-6 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
        {diagram.title}
      </figcaption>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
        {diagram.labels.map((label, index) => (
          <div key={label} className="contents">
            <div className="flex min-h-24 flex-1 flex-col justify-between border border-border bg-background p-4">
              <span className="font-mono text-xs text-primary">0{index + 1}</span>
              <span className="text-sm font-semibold leading-snug text-foreground">{label}</span>
            </div>
            {index < diagram.labels.length - 1 ? (
              <span className="flex size-6 shrink-0 rotate-90 items-center justify-center self-center text-primary lg:rotate-0" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-5">
                  <path d="M5 12h14M15 8l4 4-4 4" />
                </svg>
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </figure>
  )
}
