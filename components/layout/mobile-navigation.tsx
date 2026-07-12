'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PrimaryButton } from '@/components/brand/primary-button'
import { mainNavigation } from '@/lib/site-config'
import { cn } from '@/lib/utils'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function MobileNavigation() {
  const [open, setOpen] = useState(false)
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)
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
        setExpandedGroup(null)
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
    setExpandedGroup(null)
  }

  function toggleGroup(label: string) {
    setExpandedGroup((current) => (current === label ? null : label))
  }

  function navigateAndClose() {
    closeMenu()
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
        onClick={() => (open ? closeMenu() : setOpen(true))}
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
            {mainNavigation.map((item) => {
              const hasChildren = Boolean(item.children?.length)
              const isExpanded = expandedGroup === item.label

              return (
                <li key={`${item.label}-${item.href}`} className="py-1">
                  {hasChildren ? (
                    <>
                      <button
                        onClick={() => toggleGroup(item.label)}
                        aria-expanded={isExpanded}
                        aria-controls={`submenu-${item.label}`}
                        className="flex w-full min-h-11 items-center justify-between rounded-sm py-2 text-base font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            'size-4 transition-transform duration-200',
                            isExpanded && 'rotate-180',
                          )}
                          aria-hidden="true"
                        />
                      </button>
                      {isExpanded && (
                        <ul
                          id={`submenu-${item.label}`}
                          className="mb-3 flex flex-col border-l border-border pl-4"
                        >
                          {item.children!.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={navigateAndClose}
                                className="flex min-h-11 items-center rounded-sm py-2 text-sm text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={navigateAndClose}
                      className="flex min-h-11 items-center rounded-sm py-2 text-base font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
          <PrimaryButton href="#contact" className="mt-5 w-full" onClick={navigateAndClose}>
            Demander un audit
          </PrimaryButton>
        </nav>
      </div>
    </div>
  )
}
