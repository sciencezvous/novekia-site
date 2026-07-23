import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { expertises, type ExpertiseIcon } from '@/lib/expertises'
import { cn } from '@/lib/utils'

const iconPaths: Record<ExpertiseIcon, ReactNode> = {
  software: (
    <>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
      <path d="M7 8h.01M10 8h5" />
      <path d="M7 11h.01M10 11h3" />
    </>
  ),
  ai: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      <path d="M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </>
  ),
  infrastructure: (
    <>
      <rect x="2" y="4" width="20" height="6" rx="1" />
      <rect x="2" y="14" width="20" height="6" rx="1" />
      <path d="M6 7h.01M6 17h.01M10 7h.01M10 17h.01" />
    </>
  ),
  web: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
      <path d="M11 8v6M8 11h6" />
    </>
  ),
}

type ExpertiseGridProps = {
  contactHref?: string
  className?: string
}

export function ExpertiseGrid({
  contactHref = '/#contact',
  className,
}: ExpertiseGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3',
        className,
      )}
    >
      {expertises.map((expertise) => (
        <article
          id={expertise.id}
          key={expertise.id}
          className="group relative flex min-h-64 flex-col gap-4 bg-background p-6 transition-colors duration-200 hover:bg-accent/40"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="size-5 text-primary opacity-80 transition-opacity duration-200 group-hover:opacity-100"
          >
            {iconPaths[expertise.icon]}
          </svg>

          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            {expertise.title}
          </h3>

          <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
            {expertise.description}
          </p>
        </article>
      ))}

      <article className="scan-sweep group relative flex min-h-64 flex-col overflow-hidden bg-background p-6 transition-colors duration-200 hover:bg-accent/40">
        <div
          aria-hidden="true"
          className="technical-grid-pattern absolute inset-0 opacity-20"
        />
        <div aria-hidden="true" className="novekia-glow -right-64 -top-64" />

        <div className="relative flex flex-1 flex-col">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
            Point de départ
          </span>
          <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
            Votre projet croise plusieurs expertises&nbsp;?
          </h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
            Commençons par clarifier le besoin, les contraintes et le résultat
            attendu avant de choisir la solution.
          </p>
          <Link
            href={contactHref}
            className="mt-6 inline-flex w-fit items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-primary outline-none transition-colors hover:text-lumineux focus-visible:ring-2 focus-visible:ring-ring"
          >
            Échanger avec le studio
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </article>
    </div>
  )
}
