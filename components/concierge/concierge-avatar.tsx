'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

type ConciergeAvatarProps = {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  media?: React.ReactNode
}

const sizes = {
  sm: 'size-9',
  md: 'size-11',
  lg: 'size-14',
}

export function ConciergeAvatar({
  className,
  size = 'md',
  media,
}: ConciergeAvatarProps) {
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-full border border-primary/55 bg-[#03112a] shadow-[0_0_0_3px_rgba(8,124,255,0.08),0_0_24px_rgba(8,124,255,0.24)] motion-safe:animate-[pulse_3.5s_ease-in-out_infinite]',
        sizes[size],
        className,
      )}
      aria-hidden="true"
    >
      {media ?? (
        <Image
          src="/novekia-icon.svg"
          alt=""
          width={40}
          height={40}
          className="h-[66%] w-[66%] object-contain"
        />
      )}
      <span className="absolute bottom-0.5 right-0.5 size-2 rounded-full border-2 border-[#03112a] bg-primary" />
    </span>
  )
}
