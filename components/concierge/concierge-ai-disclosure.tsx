'use client'

import { ShieldCheck } from 'lucide-react'

export function ConciergeAIDisclosure() {
  return (
    <div className="border border-primary/25 bg-primary/5 p-4 text-xs leading-5 text-muted-foreground">
      <div className="flex gap-3">
        <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>
          L’assistance IA peut structurer certaines réponses. Elle reste facultative et le parcours fonctionne sans elle. Ne partagez aucun secret ni donnée sensible.
        </p>
      </div>
    </div>
  )
}
