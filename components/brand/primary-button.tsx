import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type PrimaryButtonProps = {
  href?: string
  className?: string
  children: React.ReactNode
  /** Affiche une flèche à droite */
  withArrow?: boolean
} & Omit<React.ComponentProps<typeof Button>, 'variant' | 'children'>

/**
 * Bouton d'action principal Novekia (bleu électrique, angles droits).
 */
export function PrimaryButton({
  href,
  className,
  children,
  withArrow = false,
  ...props
}: PrimaryButtonProps) {
  const classes = cn('h-11 rounded-md px-5 text-sm font-medium', className)
  const inner = (
    <>
      {children}
      {withArrow ? <ArrowRight aria-hidden="true" /> : null}
    </>
  )

  if (href) {
    return (
      <Button
        className={classes}
        nativeButton={false}
        render={<Link href={href} />}
        {...props}
      >
        {inner}
      </Button>
    )
  }

  return (
    <Button className={classes} {...props}>
      {inner}
    </Button>
  )
}
