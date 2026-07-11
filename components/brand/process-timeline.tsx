import { cn } from '@/lib/utils'

export type ProcessStep = {
  id: string
  title: string
  description: string
}

type ProcessTimelineProps = {
  steps: ProcessStep[]
  className?: string
}

/**
 * Frise de méthode : étapes numérotées reliées par une ligne technique.
 */
export function ProcessTimeline({ steps, className }: ProcessTimelineProps) {
  return (
    <ol className={cn('relative flex flex-col gap-0', className)}>
      {steps.map((step, i) => (
        <li key={step.id} className="relative flex gap-5 pb-10 last:pb-0">
          {/* Connecteur vertical */}
          {i < steps.length - 1 ? (
            <span
              aria-hidden="true"
              className="absolute left-[19px] top-11 bottom-0 w-px bg-border"
            />
          ) : null}
          <span
            aria-hidden="true"
            className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-card font-mono text-sm font-medium text-primary"
          >
            {String(i + 1).padStart(2, '0')}
          </span>
          <div className="pt-1.5">
            <h3 className="text-base font-semibold text-foreground">
              {step.title}
            </h3>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}
