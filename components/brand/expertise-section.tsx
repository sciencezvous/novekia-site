import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TechnicalGrid, TechnicalGridCell } from './technical-grid'
import { TechnicalLabel } from './technical-label'

export type ExpertiseItem = {
  id: string
  icon?: LucideIcon
  title: string
  description: string
}

type ExpertiseSectionProps = {
  items: ExpertiseItem[]
  columns?: 2 | 3 | 4
  className?: string
}

/**
 * Grille d'expertises : cellules techniques avec icône, titre et description.
 */
export function ExpertiseSection({
  items,
  columns = 3,
  className,
}: ExpertiseSectionProps) {
  return (
    <TechnicalGrid columns={columns} className={cn(className)}>
      {items.map((item, i) => {
        const Icon = item.icon
        return (
          <TechnicalGridCell key={item.id} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              {Icon ? (
                <span className="flex size-10 items-center justify-center rounded-md border border-border bg-secondary text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
              ) : null}
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          </TechnicalGridCell>
        )
      })}
    </TechnicalGrid>
  )
}

export { TechnicalLabel }
