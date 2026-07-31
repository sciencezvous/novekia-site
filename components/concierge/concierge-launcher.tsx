'use client'

import { ConciergeAvatar } from './concierge-avatar'
import { cn } from '@/lib/utils'

type ConciergeLauncherProps = {
  open: boolean
  onClick: () => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

export function ConciergeLauncher({
  open,
  onClick,
  triggerRef,
}: ConciergeLauncherProps) {
  return (
    <button
      ref={triggerRef}
      type="button"
      aria-label={open ? 'Réduire l’Assistant Novekia' : 'Ouvrir l’Assistant Novekia'}
      aria-expanded={open}
      aria-controls="novekia-concierge-panel"
      onClick={onClick}
      className={cn(
        'fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[80] inline-flex min-h-12 items-center gap-3 rounded-full border border-primary/35 bg-[#061225]/95 p-1.5 pr-1.5 text-sm font-semibold text-foreground shadow-[0_18px_55px_rgba(0,0,0,0.42)] backdrop-blur-xl outline-none transition-[transform,opacity,border-color] duration-200 hover:border-primary/70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none sm:bottom-6 sm:right-6 sm:pr-5',
        open && 'pointer-events-none translate-y-2 opacity-0',
      )}
    >
      <ConciergeAvatar size="sm" />
      <span className="hidden sm:inline">Assistant Novekia</span>
    </button>
  )
}
