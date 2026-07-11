import { cn } from '@/lib/utils'

type TechnicalLabelProps = React.ComponentProps<'span'> & {
  /** Numéro ou index technique optionnel, ex. "01" */
  index?: string
}

/**
 * Surtitre / label technique en monospace.
 * Utilisé pour les numéros de section, labels et surtitres.
 */
export function TechnicalLabel({
  className,
  index,
  children,
  ...props
}: TechnicalLabelProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-mono text-xs font-medium tracking-[0.18em] text-primary uppercase',
        className,
      )}
      {...props}
    >
      {index ? (
        <span className="text-muted-foreground tabular-nums" aria-hidden="true">
          {index}
        </span>
      ) : null}
      <span aria-hidden="true" className="h-px w-6 bg-current opacity-40" />
      {children}
    </span>
  )
}
