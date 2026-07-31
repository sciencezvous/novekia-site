'use client'

import type { ConciergeProgress as Progress } from '@/lib/concierge/runtime'

export function ConciergeProgress({ progress }: { progress: Progress }) {
  return (
    <div className="mb-5" aria-label={`${progress.sectionLabel}, étape ${progress.current} sur ${progress.total}`}>
      <div className="flex items-center justify-between gap-4 font-mono text-[0.65rem] uppercase tracking-[0.14em]">
        <span className="text-primary">{progress.sectionLabel}</span>
        <span className="text-muted-foreground">
          Étape {progress.current} sur {progress.total}
        </span>
      </div>
      <div className="mt-2 h-px overflow-hidden bg-border">
        <div
          className="h-full bg-primary transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
    </div>
  )
}
