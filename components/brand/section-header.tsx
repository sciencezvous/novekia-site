import { cn } from '@/lib/utils'
import { TechnicalLabel } from './technical-label'

type SectionHeaderProps = {
  /** Surtitre technique (label monospace) */
  eyebrow?: string
  /** Index numérique optionnel, ex. "02" */
  index?: string
  title: React.ReactNode
  description?: React.ReactNode
  align?: 'start' | 'center'
  as?: 'h2' | 'h3'
  className?: string
}

export function SectionHeader({
  eyebrow,
  index,
  title,
  description,
  align = 'start',
  as: Heading = 'h2',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start',
        className,
      )}
    >
      {eyebrow ? <TechnicalLabel index={index}>{eyebrow}</TechnicalLabel> : null}
      <Heading className="max-w-2xl text-balance text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </Heading>
      {description ? (
        <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}
