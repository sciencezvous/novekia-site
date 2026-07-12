'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PrimaryButton } from '@/components/brand/primary-button'
import { mainNavigation } from '@/lib/site-config'
import { cn } from '@/lib/utils'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function MobileNavigation() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const panel = panelRef.current
    const focusableElements = panel
      ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      : []
    focusableElements[0]?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        return
      }

      if (event.key !== 'Tab' || focusableElements.length === 0) return
      const first = focusableElements[0]
      const last = focusableElements[focusableElements.length - 1]

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
      triggerRef.current?.focus()
    }
  }, [open])

  function closeMenu() {
    setOpen(false)
  }

  return (
    <div className="lg:hidden">
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon"
        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={open}
        aria-controls="mobile-navigation-panel"
        onClick={() => setOpen((current) => !current)}
        className="size-11"
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </Button>

      <div
        id="mobile-navigation-panel"
        ref={panelRef}
        className={cn(
          'fixed inset-x-0 top-[4.5rem] z-40 max-h-[calc(100dvh-4.5rem)] origin-top overflow-y-auto border-b border-border bg-background shadow-lg transition-[transform,opacity] duration-200 motion-reduce:transition-none',
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-2 opacity-0',
        )}
        hidden={!open}
      >
        <nav aria-label="Navigation principale mobile" className="px-5 py-5 sm:px-6">
          <ul className="flex flex-col divide-y divide-border">
            {mainNavigation.map((item) => (
              <li key={`${item.label}-${item.href}`} className="py-1">
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  className="flex min-h-11 items-center rounded-sm py-2 text-base font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {item.label}
                </Link>
                {item.children ? (
                  <ul className="mb-3 flex flex-col border-l border-border pl-4">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={closeMenu}
                          className="flex min-h-11 items-center rounded-sm py-2 text-sm text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
          <PrimaryButton href="#contact" className="mt-5 w-full" onClick={closeMenu}>
            Demander un audit
          </PrimaryButton>
        </nav>
      </div>
    </div>
  )
}
