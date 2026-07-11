import { cn } from '@/lib/utils'
import { TechnicalLabel } from './technical-label'

export type ArchitectureLayer = {
  id: string
  label: string
  title: string
  nodes: string[]
}

type ArchitectureDiagramProps = {
  layers: ArchitectureLayer[]
  className?: string
  caption?: string
}

/**
 * Schéma d'architecture technique en couches empilées, reliées par des
 * connecteurs verticaux. Représente une pile d'infrastructure de manière sobre.
 */
export function ArchitectureDiagram({
  layers,
  className,
  caption,
}: ArchitectureDiagramProps) {
  return (
    <figure className={cn('flex flex-col', className)}>
      <div className="flex flex-col">
        {layers.map((layer, i) => (
          <div key={layer.id} className="flex flex-col">
            <div className="rounded-md border border-border bg-card p-5 md:p-6">
              <TechnicalLabel index={String(i + 1).padStart(2, '0')}>
                {layer.label}
              </TechnicalLabel>
              <h3 className="mt-3 text-base font-semibold text-card-foreground">
                {layer.title}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {layer.nodes.map((node) => (
                  <span
                    key={node}
                    className="rounded-sm border border-border bg-secondary px-2.5 py-1 font-mono text-xs text-secondary-foreground"
                  >
                    {node}
                  </span>
                ))}
              </div>
            </div>
            {i < layers.length - 1 ? (
              <div
                aria-hidden="true"
                className="mx-auto h-6 w-px bg-border"
              />
            ) : null}
          </div>
        ))}
      </div>
      {caption ? (
        <figcaption className="mt-4 font-mono text-xs text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
