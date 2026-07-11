import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type SecondaryButtonProps = {
  href?: string
  className?: string
  children: React.ReactNode
} & Omit<React.ComponentProps<typeof Button>, 'variant' | 'children'>

/**
 * Bouton secondaire Novekia (contour sobre, angles droits).
 */
export function SecondaryButton({
  href,
  className,
  children,
  ...props
}: SecondaryButtonProps) {
  const classes = cn('h-11 rounded-md px-5 text-sm font-medium', className)

  if (href) {
    return (
      <Button
        variant="outline"
        className={classes}
        nativeButton={false}
        render={<Link href={href} />}
        {...props}
      >
        {children}
      </Button>
    )
  }

  return (
    <Button variant="outline" className={classes} {...props}>
      {children}
    </Button>
  )
}
