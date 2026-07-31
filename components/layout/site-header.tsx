'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { PrimaryButton } from '@/components/brand/primary-button'
import { MobileNavigation } from './mobile-navigation'
import { Container } from './container'
import { mainNavigation } from '@/lib/site-config'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <Container size="wide">
        <div className="flex h-[4.5rem] items-center justify-between gap-4 lg:h-16 lg:gap-6">
          <Logo taglineClassName="hidden lg:block" />

          <nav
            aria-label="Navigation principale"
            className="hidden lg:block"
            onMouseLeave={() => setOpenMenu(null)}
          >
            <ul className="flex items-center gap-1">
              {mainNavigation.map((item) => {
                const hasChildren = Boolean(item.children?.length)
                return (
                  <li
                    key={`${item.label}-${item.href}`}
                    className="relative"
                    onMouseEnter={() =>
                      hasChildren ? setOpenMenu(item.href) : setOpenMenu(null)
                    }
                  >
                    <Link
                      href={item.href.startsWith('#') ? `/${item.href}` : item.href}
                      className="inline-flex items-center gap-1 rounded-sm px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                      aria-expanded={hasChildren ? openMenu === item.href : undefined}
                    >
                      {item.label}
                      {hasChildren ? (
                        <ChevronDown
                          className={cn(
                            'size-3.5 transition-transform',
                            openMenu === item.href && 'rotate-180',
                          )}
                          aria-hidden="true"
                        />
                      ) : null}
                    </Link>

                    {hasChildren && openMenu === item.href ? (
                      <div className="absolute left-0 top-full w-80 pt-2">
                        <ul className="rounded-md border border-border bg-popover p-2 shadow-lg">
                          {item.children!.map((child) => (
                            <li key={`${child.label}-${child.href}`}>
                              <Link
                                href={child.href.startsWith('#') ? `/${child.href}` : child.href}
                                className="block rounded-sm px-3 py-2 transition-colors hover:bg-secondary"
                              >
                                <span className="block text-sm font-medium text-popover-foreground">
                                  {child.label}
                                </span>
                                {child.description ? (
                                  <span className="mt-0.5 block text-xs text-muted-foreground">
                                    {child.description}
                                  </span>
                                ) : null}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <PrimaryButton href="/#contact" className="hidden lg:inline-flex">
              Parler de votre projet
            </PrimaryButton>
            <MobileNavigation />
          </div>
        </div>
      </Container>
    </header>
  )
}
