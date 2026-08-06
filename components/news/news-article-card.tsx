import Link from 'next/link'
import { ArrowUpRight, CalendarDays, Clock3 } from 'lucide-react'
import type { AiNewsArticle } from '@/lib/ai-news'

type NewsArticleCardProps = {
  article: AiNewsArticle
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}

export function NewsArticleCard({ article }: NewsArticleCardProps) {
  return (
    <article className="group relative flex min-h-[28rem] flex-col justify-between bg-background p-6 transition-colors hover:bg-accent/30 sm:p-8 lg:p-10">
      <div>
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.14em]">
          <span className="text-primary">{article.category}</span>
          <span aria-hidden="true" className="text-border">
            /
          </span>
          <span className="text-muted-foreground">Analyse Novekia</span>
        </div>
        <h2 className="mt-7 max-w-4xl text-balance text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
          <Link
            href={`/actualites-ia/${article.slug}`}
            className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:ring-2 focus-visible:ring-ring"
          >
            {article.title}
          </Link>
        </h2>
        <p className="mt-5 max-w-3xl leading-8 text-muted-foreground">
          {article.description}
        </p>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-5 border-t border-border pt-6">
        <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <CalendarDays aria-hidden="true" className="size-3.5" />
            {formatDate(article.publishedAt)}
          </span>
          <span className="flex items-center gap-2">
            <Clock3 aria-hidden="true" className="size-3.5" />
            {article.readingTime}
          </span>
        </div>
        <ArrowUpRight
          aria-hidden="true"
          className="size-6 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </div>
    </article>
  )
}
