import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { Container } from '@/components/layout/container'
import { SiteFooter } from '@/components/layout/site-footer'

type LegalPageLayoutProps = {
  eyebrow: string
  title: string
  introduction: string
  updatedAt: string
  children: ReactNode
}

export function LegalPageLayout({
  eyebrow,
  title,
  introduction,
  updatedAt,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <Container
          size="wide"
          className="flex min-h-20 items-center justify-between gap-6"
        >
          <Logo href="/" />
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-sm font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Retour à l&apos;accueil
          </Link>
        </Container>
      </header>

      <main>
        <Container size="narrow" className="py-14 sm:py-20 lg:py-24">
          <article>
            <header className="border-b border-border pb-10 sm:pb-12">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">
                {eyebrow}
              </p>
              <h1 className="mt-4 max-w-3xl text-balance font-serif text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                {introduction}
              </p>
              <p className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Dernière mise à jour&nbsp;: {updatedAt}
              </p>
            </header>

            <div className="flex flex-col gap-12 pt-10 sm:pt-12 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-colors hover:[&_a]:text-foreground [&_address]:not-italic [&_h2]:text-balance [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight sm:[&_h2]:text-3xl [&_h3]:font-sans [&_h3]:text-base [&_h3]:font-semibold [&_li]:leading-relaxed [&_p]:leading-relaxed [&_section]:flex [&_section]:scroll-mt-24 [&_section]:flex-col [&_section]:gap-4 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5">
              {children}
            </div>
          </article>
        </Container>
      </main>

      <SiteFooter />
    </div>
  )
}
