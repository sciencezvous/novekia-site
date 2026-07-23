import { cn } from '@/lib/utils'
import { Container } from './container'

type SectionProps = React.ComponentProps<'section'> & {
  /** Fond immersif bleu nuit (bascule les tokens en mode sombre) */
  tone?: 'light' | 'muted' | 'dark'
  /** Enveloppe le contenu dans un Container. Passez false pour gérer soi-même. */
  contained?: boolean
  containerSize?: 'default' | 'narrow' | 'wide'
  /** Espacement vertical */
  spacing?: 'default' | 'compact' | 'loose'
}

const tones = {
  light: 'bg-background/70 text-foreground',
  muted: 'bg-[color:var(--novekia-surface-sombre)] text-secondary-foreground',
  dark: 'section-dark bg-background text-foreground',
}

const spacings = {
  compact: 'py-12 sm:py-16 md:py-20',
  default: 'py-14 sm:py-20 md:py-28',
  loose: 'py-16 sm:py-24 md:py-36',
}

export function Section({
  className,
  tone = 'light',
  contained = true,
  containerSize = 'default',
  spacing = 'default',
  children,
  ...props
}: SectionProps) {
  return (
    <section
      data-reveal=""
      className={cn('relative border-t border-border/70', tones[tone], spacings[spacing], className)}
      {...props}
    >
      {contained ? (
        <Container size={containerSize}>{children}</Container>
      ) : (
        children
      )}
    </section>
  )
}
