import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'

type FounderVisionBubbleProps = {
  className?: string
}

export function FounderVisionBubble({
  className,
}: FounderVisionBubbleProps) {
  return (
    <aside
      id="vision-technologique"
      aria-labelledby="vision-technologique-title"
      className={cn(
        'novekia-surface relative overflow-visible border-primary/30 bg-[#030c1c]/92 p-5 shadow-[0_20px_70px_rgba(0,72,180,0.2)] backdrop-blur-xl sm:p-7 lg:p-8',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute -left-2 top-12 hidden size-4 rotate-45 border-b border-l border-primary/30 bg-[#061126] lg:block"
      />

      <div className="flex items-center gap-4 sm:gap-5">
        <div className="relative size-24 shrink-0 overflow-hidden border border-primary/40 bg-[#071224] shadow-[0_0_30px_rgba(8,124,255,0.22)] sm:size-28">
          <Image
            src="/andy-legrand-novekia-v3.png"
            alt="Andy Legrand, fondateur de Novekia"
            fill
            sizes="(min-width: 640px) 112px, 96px"
            className="object-cover object-[center_18%]"
          />
        </div>

        <div className="min-w-0">
          <h2
            id="vision-technologique-title"
            className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-primary"
          >
            La vision technologique
          </h2>
          <p className="mt-2 text-sm font-semibold text-foreground">
            Andy Legrand · Fondateur
          </p>
        </div>

        <Quote
          aria-hidden="true"
          className="ml-auto size-8 shrink-0 text-primary/70"
          strokeWidth={1.4}
        />
      </div>

      <blockquote className="mt-6 border-t border-border/80 pt-6">
        <p className="text-pretty text-base font-medium leading-relaxed text-foreground sm:text-lg">
          « Un studio d’ingénierie où l’on comprend, conçoit, prototype et
          déploie des systèmes solides — au plus près de vos métiers et sous
          votre contrôle. »
        </p>
      </blockquote>

      <Link
        href="/a-propos#vision"
        className="mt-6 inline-flex min-h-11 items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-primary outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        Découvrir la vision du fondateur
        <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    </aside>
  )
}
