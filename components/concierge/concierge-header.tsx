'use client'

import { RotateCcw, X } from 'lucide-react'
import { ConciergeAvatar, type ConciergeAvatarState } from './concierge-avatar'

type ConciergeHeaderProps = {
  onClose: () => void
  onRestart: () => void
  hasAnswers: boolean
  avatarState?: ConciergeAvatarState
}

export function ConciergeHeader({
  onClose,
  onRestart,
  hasAnswers,
  avatarState = 'idle',
}: ConciergeHeaderProps) {
  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-border bg-[#061225]/95 px-4 py-3 sm:px-5">
      <ConciergeAvatar state={avatarState} />
      <div className="min-w-0 flex-1">
        <h2 id="novekia-concierge-title" className="truncate text-sm font-semibold">
          Nova
        </h2>
        <p className="mt-0.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
          Assistant
        </p>
      </div>
      {hasAnswers ? (
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex size-11 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Recommencer la qualification"
          title="Recommencer"
        >
          <RotateCcw aria-hidden="true" className="size-4" />
        </button>
      ) : null}
      <button
        type="button"
        onClick={onClose}
        className="inline-flex size-11 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Fermer Nova"
      >
        <X aria-hidden="true" className="size-5" />
      </button>
    </header>
  )
}
