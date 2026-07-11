import Link from 'next/link'
import { Logo } from '@/components/brand/logo'
import { Container } from './container'
import { footerNavigation, siteConfig } from '@/lib/site-config'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="section-dark border-t border-border bg-background text-foreground">
      <Container size="wide" className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="flex flex-col gap-5">
            <Logo href="/" />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Technologies au service de la performance. Infrastructures
              modulaires, intelligence artificielle locale et R&D appliquée.
            </p>
            <dl className="mt-2 flex flex-col gap-1 font-mono text-xs text-muted-foreground">
              <div className="flex gap-2">
                <dt className="sr-only">Email</dt>
                <dd>{siteConfig.contact.email}</dd>
              </div>
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerNavigation.map((group) => (
              <div key={group.title}>
                <h2 className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-foreground">
                  {group.title}
                </h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 font-mono text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 Novekia — Andy Legrand, Entrepreneur individuel.
          </p>
          <p className="tracking-[0.18em] uppercase">
            Future Tech • Intelligence • Confiance
          </p>
        </div>
      </Container>
    </footer>
  )
}
