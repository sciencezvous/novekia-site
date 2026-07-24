import { ArrowUpRight } from 'lucide-react'

export type ArticleSource = {
  label: string
  publisher: string
  href: string
  note?: string
}

export function SourceList({ sources }: { sources: ArticleSource[] }) {
  return (
    <section id="sources" className="scroll-mt-24">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
        Sources
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em]">
        Références utilisées.
      </h2>
      <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
        Les affirmations techniques s’appuient en priorité sur des organismes
        publics, des publications de recherche et la documentation des outils.
      </p>
      <ul className="mt-7 divide-y divide-border border-y border-border">
        {sources.map((source) => (
          <li key={source.href}>
            <a
              href={source.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-start justify-between gap-5 py-5 outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span>
                <span className="block font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {source.publisher}
                </span>
                <span className="mt-2 block font-semibold">{source.label}</span>
                {source.note ? (
                  <span className="mt-2 block text-sm leading-6 text-muted-foreground">
                    {source.note}
                  </span>
                ) : null}
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="mt-1 size-4 shrink-0 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
