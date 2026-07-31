'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, Building2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ConciergeInformationProps = {
  onChooseQualification: () => void
  onBack: () => void
  onNavigate: () => void
}

export function ConciergeInformation({
  onChooseQualification,
  onBack,
  onNavigate,
}: ConciergeInformationProps) {
  return (
    <div>
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-primary">Les deux pôles</p>
      <h3 className="mt-3 text-balance text-2xl font-semibold">Un point d’entrée selon votre objectif.</h3>
      <div className="mt-6 grid gap-3">
        <article className="border border-border bg-background/40 p-4">
          <Search aria-hidden="true" className="size-5 text-primary" />
          <h4 className="mt-3 font-semibold">Lead Engine Studio</h4>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Prospection et qualification commerciale B2B, avec sources traçables et supervision humaine.</p>
          <Link href="/lead-engine-studio" onClick={onNavigate} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Découvrir le pôle <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </article>
        <article className="border border-border bg-background/40 p-4">
          <Building2 aria-hidden="true" className="size-5 text-primary" />
          <h4 className="mt-3 font-semibold">Novekia Solutions</h4>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Conception de solutions numériques, d’IA locale et d’infrastructures adaptées aux usages.</p>
          <Link href="/solutions" onClick={onNavigate} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Explorer les solutions <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </article>
      </div>
      <div className="mt-5 grid gap-2">
        <Button type="button" size="lg" onClick={onChooseQualification} className="min-h-11 w-full">Commencer une qualification</Button>
        <Link href="/#contact" onClick={onNavigate} className="inline-flex min-h-11 items-center justify-center rounded-md border border-border px-4 text-sm font-medium outline-none hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring">Contacter Novekia</Link>
        <Button type="button" variant="ghost" size="lg" onClick={onBack} className="min-h-11 w-full"><ArrowLeft aria-hidden="true" />Retour</Button>
      </div>
    </div>
  )
}
