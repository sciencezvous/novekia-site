'use client'

import { track } from '@vercel/analytics'
import { PrimaryButton } from '@/components/brand/primary-button'
import { CONCIERGE_OPEN_REQUEST_EVENT } from '@/lib/concierge/config'

type ConciergeTriggerProps = {
  source:
    | 'hero'
    | 'header'
    | 'mobile_navigation'
    | 'diagnostic_section'
    | 'news_article'
    | 'sizing_tool'
  children: React.ReactNode
  className?: string
  withArrow?: boolean
  onTrigger?: () => void
}

export function ConciergeTrigger({
  source,
  children,
  className,
  withArrow = true,
  onTrigger,
}: ConciergeTriggerProps) {
  function openConcierge() {
    onTrigger?.()

    try {
      track('concierge_entry_clicked', { source })
    } catch {
      // Measurement must never interrupt access to the qualification funnel.
    }

    window.dispatchEvent(new Event(CONCIERGE_OPEN_REQUEST_EVENT))
  }

  return (
    <PrimaryButton
      type="button"
      onClick={openConcierge}
      withArrow={withArrow}
      className={className}
    >
      {children}
    </PrimaryButton>
  )
}
