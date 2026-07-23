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
      <Heading className="max-w-4xl text-balance text-[clamp(2.35rem,7vw,5rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
        {title}
      </Heading>
      {description ? (
        <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  )
}
