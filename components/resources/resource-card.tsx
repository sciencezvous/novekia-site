import Link from 'next/link'
import { ArrowUpRight, Clock3 } from 'lucide-react'
import type { ResourceArticle } from '@/lib/resources'

type ResourceCardProps = {
  article: ResourceArticle
}

export function ResourceCard({ article }: ResourceCardProps) {
  return (
    <article className="group relative flex min-h-80 flex-col justify-between bg-background p-6 transition-colors hover:bg-accent/30 sm:p-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
          {article.eyebrow}
        </p>
        <h2 className="mt-5 text-balance text-2xl font-semibold tracking-[-0.03em]">
          <Link
            href={`/ressources/${article.slug}`}
            className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:ring-2 focus-visible:ring-ring"
          >
            {article.title}
          </Link>
        </h2>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          {article.description}
        </p>
      </div>
      <div className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-5">
        <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <Clock3 aria-hidden="true" className="size-3.5" />
          {article.readingTime}
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className="size-5 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </div>
    </article>
  )
}
