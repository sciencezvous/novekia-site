'use client'

import { useEffect } from 'react'
import {
  AUDIT_CLIENT_EVENT,
  type AuditClientEventDetail,
} from '@/lib/audit-events'

const MAX_OPEN_ATTEMPTS = 8
const RETRY_DELAY_MS = 140

export function AuditAutoReport() {
  useEffect(() => {
    let timer: number | undefined

    function openReport(attempt = 0) {
      if (document.querySelector('.audit-modal-backdrop')) return

      const reportButton = document.querySelector<HTMLButtonElement>(
        '.audit-conversion-actions button:first-child'
      )

      if (reportButton) {
        reportButton.click()
        return
      }

      if (attempt < MAX_OPEN_ATTEMPTS) {
        timer = window.setTimeout(() => openReport(attempt + 1), RETRY_DELAY_MS)
      }
    }

    function onAuditEvent(event: Event) {
      const detail = (event as CustomEvent<AuditClientEventDetail>).detail
      if (detail?.name !== 'AuditCompleted') return

      window.clearTimeout(timer)
      timer = window.setTimeout(() => openReport(), 520)
    }

    window.addEventListener(AUDIT_CLIENT_EVENT, onAuditEvent)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener(AUDIT_CLIENT_EVENT, onAuditEvent)
    }
  }, [])

  return null
}
