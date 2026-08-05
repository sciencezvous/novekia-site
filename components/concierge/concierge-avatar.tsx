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
        'concierge-avatar relative isolate inline-flex shrink-0 items-center justify-center rounded-full',
        sizes[size],
        className,
      )}
      aria-hidden="true"
    >
      <span className="concierge-avatar__halo absolute -inset-1 rounded-full" />
      <span className="concierge-avatar__orbit absolute -inset-0.5 rounded-full border border-transparent border-r-primary/35 border-t-primary" />
      <span className="concierge-avatar__core absolute inset-0 rounded-full border border-primary/55 bg-[#03112a] shadow-[inset_0_0_18px_rgba(8,124,255,0.16),0_0_0_3px_rgba(8,124,255,0.08),0_0_24px_rgba(8,124,255,0.26)]" />
      <span className="concierge-avatar__scan absolute inset-[2px] overflow-hidden rounded-full">
        <span className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
      </span>
      <span className="concierge-avatar__media relative z-10 inline-flex h-full w-full items-center justify-center">
        {media ?? (
          <Image
            src="/novekia-icon.svg"
            alt=""
            width={40}
            height={40}
            className="h-[66%] w-[66%] object-contain drop-shadow-[0_0_7px_rgba(82,184,255,0.6)]"
          />
        )}
      </span>
      <span className="concierge-avatar__status absolute bottom-0 right-0 z-20 size-2.5 rounded-full border-2 border-[#03112a] bg-primary shadow-[0_0_8px_rgba(8,124,255,0.9)]" />
    </span>
  )
}
