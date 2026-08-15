'use client'

import { track } from '@vercel/analytics'
import { Download } from 'lucide-react'
import { cn } from '@/lib/utils'

type ChecklistDownloadProps = {
  className?: string
}

export function ChecklistDownload({ className }: ChecklistDownloadProps) {
  function trackDownload() {
    try {
      track('resource_downloaded', {
        resource: 'checklist_cadrage_ia_locale',
      })
    } catch {
      // The file download remains available if analytics is unavailable.
    }
  }

  return (
    <a
      href="/ressources/checklist-cadrage-ia-locale.pdf"
      download
      onClick={trackDownload}
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-action px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-action/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
    >
      <Download aria-hidden="true" className="size-4" />
      Télécharger le PDF
    </a>
  )
}
