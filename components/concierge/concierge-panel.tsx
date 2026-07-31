'use client'

import { useEffect, useRef } from 'react'
import { ConciergeHeader } from './concierge-header'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

type ConciergePanelProps = {
  children: React.ReactNode
  onClose: () => void
  onRestart: () => void
  hasAnswers: boolean
}

export function ConciergePanel({
  children,
  onClose,
  onRestart,
  hasAnswers,
}: ConciergePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const previousOverflow = document.body.style.overflow
    const mobileQuery = window.matchMedia('(max-width: 639px)')
    if (mobileQuery.matches) document.body.style.overflow = 'hidden'

    const focusable = Array.from(
      panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    )
    focusable[0]?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const available = Array.from(
        panel!.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => !element.hasAttribute('hidden'))
      if (available.length === 0) return
      const first = available[0]
      const last = available[available.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <>
      <button
        type="button"
        aria-label="Fermer l’Assistant Novekia"
        onClick={onClose}
        className="fixed inset-0 z-[70] bg-black/55 backdrop-blur-[2px] sm:hidden"
      />
      <div
        id="novekia-concierge-panel"
        ref={panelRef}
        role="dialog"
        aria-labelledby="novekia-concierge-title"
        aria-describedby="novekia-concierge-description"
        aria-modal="false"
        className="section-dark fixed inset-x-0 bottom-0 z-[90] flex h-[min(90dvh,48rem)] min-h-0 flex-col overflow-hidden rounded-t-xl border border-border bg-[#020817]/98 text-foreground shadow-[0_30px_100px_rgba(0,0,0,0.62)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[min(46rem,calc(100dvh-7rem))] sm:w-[min(27.5rem,calc(100vw-3rem))] sm:rounded-xl"
      >
        <p id="novekia-concierge-description" className="sr-only">
          Assistant de qualification déterministe. Les réponses restent uniquement dans cette page et ne sont pas transmises.
        </p>
        <ConciergeHeader
          onClose={onClose}
          onRestart={onRestart}
          hasAnswers={hasAnswers}
        />
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-5 sm:px-5 sm:pb-5">
          {children}
        </div>
      </div>
    </>
  )
}
