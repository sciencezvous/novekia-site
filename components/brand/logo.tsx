import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/lib/site-config'

type LogoProps = {
  className?: string
  /** Affiche le nom + la baseline à côté de l'icône */
  showWordmark?: boolean
  /** Masque la baseline "Synergies Intelligentes" */
  showTagline?: boolean
  href?: string | null
  iconSize?: number
  taglineClassName?: string
}

export function Logo({
  className,
  showWordmark = true,
  showTagline = true,
  href = '/',
  iconSize = 48,
  taglineClassName,
}: LogoProps) {
  const content = (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <Image
        src="/novekia-icon.svg"
        alt=""
        width={iconSize}
        height={iconSize}
        priority
        className="shrink-0"
      />
      {showWordmark ? (
        <span className="flex flex-col leading-none">
          <span className="text-xl font-semibold tracking-tight text-foreground">
            {siteConfig.name}
          </span>
          {showTagline ? (
            <span className={cn('mt-1 text-[0.7rem] font-medium tracking-wide text-muted-foreground', taglineClassName)}>
              {siteConfig.tagline}
            </span>
          ) : null}
        </span>
      ) : (
        <span className="sr-only">{siteConfig.name}</span>
      )}
    </span>
  )

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {content}
      </Link>
    )
  }

  return content
}
