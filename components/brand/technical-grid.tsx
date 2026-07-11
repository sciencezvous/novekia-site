import { cn } from '@/lib/utils'

type TechnicalGridProps = React.ComponentProps<'div'> & {
  /** Motif de grille en arrière-plan (lignes techniques discrètes) */
  pattern?: boolean
  columns?: 2 | 3 | 4
}

const cols = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
}

/**
 * Grille éditoriale avec séparateurs fins et motif technique optionnel.
 */
export function TechnicalGrid({
  className,
  pattern = false,
  columns = 3,
  children,
  ...props
}: TechnicalGridProps) {
  return (
    <div
      className={cn(
        'relative grid grid-cols-1 gap-px overflow-hidden border border-border bg-border',
        cols[columns],
        pattern && 'technical-grid-pattern',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Cellule de la grille technique — surface pleine séparée par les lignes fines.
 */
export function TechnicalGridCell({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('bg-background p-6 md:p-8', className)}
      {...props}
    />
  )
}
