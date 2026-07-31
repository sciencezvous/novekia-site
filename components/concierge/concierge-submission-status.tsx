import { AlertCircle, CheckCircle2, Clock3, LoaderCircle, ShieldOff } from 'lucide-react'
import type { ConciergeSubmissionUIState } from '@/lib/concierge/submission/client'

type ConciergeSubmissionStatusProps = {
  submission: ConciergeSubmissionUIState
}

export function ConciergeSubmissionStatus({ submission }: ConciergeSubmissionStatusProps) {
  if (submission.status === 'idle') return null

  const Icon = submission.status === 'submitted'
    ? CheckCircle2
    : submission.status === 'submitting'
      ? LoaderCircle
      : submission.status === 'rate_limited'
        ? Clock3
        : submission.status === 'disabled'
          ? ShieldOff
          : AlertCircle

  return (
    <div
      role={submission.status === 'error' ? 'alert' : 'status'}
      aria-live={submission.status === 'error' ? 'assertive' : 'polite'}
      className="mt-4 flex gap-3 border border-border bg-background/55 p-4"
    >
      <Icon
        aria-hidden="true"
        className={`mt-0.5 size-4 shrink-0 text-primary ${submission.status === 'submitting' ? 'animate-spin motion-reduce:animate-none' : ''}`}
      />
      <div>
        <p className="text-sm leading-6">{submission.message}</p>
        {submission.warnings.map((warning) => (
          <p key={warning} className="mt-1 text-xs leading-5 text-muted-foreground">
            {warning}
          </p>
        ))}
      </div>
    </div>
  )
}
