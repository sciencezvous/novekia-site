'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PrimaryButton } from '@/components/brand/primary-button'
import { mainNavigation } from '@/lib/site-config'
import { cn } from '@/lib/utils'

export function MobileNavigation() {
  const [open, setOpen] = useState(false)

  // Verrouille le défilement du corps quand le menu est ouvert.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X /> : <Menu />}
      </Button>

      <div
        className={cn(
          'fixed inset-x-0 top-16 z-40 origin-top border-b border-border bg-background transition-all duration-200',
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-2 opacity-0',
        )}
        hidden={!open}
      >
        <nav aria-label="Navigation principale" className="px-6 py-6">
          <ul className="flex flex-col divide-y divide-border">
            {mainNavigation.map((item) => (
              <li key={item.href} className="py-1">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base font-medium text-foreground"
                >
                  {item.label}
                </Link>
                {item.children ? (
                  <ul className="mb-3 ml-1 flex flex-col gap-1 border-l border-border pl-4">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="block py-1.5 text-sm text-muted-foreground"
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
          <PrimaryButton
            href="/contact?type=audit"
            className="mt-6 w-full"
            onClick={() => setOpen(false)}
          >
            Demander un audit
          </PrimaryButton>
        </nav>
      </div>
    </div>
  )
}
