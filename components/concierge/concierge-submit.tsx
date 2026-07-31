'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ConciergeSubmissionUIState } from '@/lib/concierge/submission/client'
import { ConciergeSubmissionStatus } from './concierge-submission-status'

type ConciergeSubmitProps = {
  submission: ConciergeSubmissionUIState
  onSubmit: (honeypot: string) => Promise<void>
  onClose: () => void
}

export function ConciergeSubmit({ submission, onSubmit, onClose }: ConciergeSubmitProps) {
  const [websiteConfirm, setWebsiteConfirm] = useState('')
  const isSubmitting = submission.status === 'submitting'

  if (submission.status === 'submitted') {
    return (
      <section className="mt-6 border border-primary/35 bg-primary/8 p-4" aria-labelledby="concierge-submitted-title">
        <h4 id="concierge-submitted-title" className="text-lg font-semibold">
          Votre demande a bien été transmise.
        </h4>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Novekia vérifiera les informations fournies avant de vous recontacter. Cette confirmation ne constitue ni un devis, ni une acceptation de mission.
        </p>
        <ConciergeSubmissionStatus submission={submission} />
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Button type="button" variant="outline" size="lg" onClick={onClose} className="min-h-11 w-full">
            Fermer
          </Button>
          <Link
            href="/solutions"
            onClick={onClose}
            className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-center text-sm font-medium text-primary-foreground outline-none transition-colors hover:bg-primary/80 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Consulter les services Novekia
            <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="mt-6 border border-primary/35 bg-primary/8 p-4" aria-labelledby="concierge-submit-title">
      <h4 id="concierge-submit-title" className="text-sm font-semibold">
        Confirmer la transmission
      </h4>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        L’envoi est déclenché uniquement par votre action. Novekia contrôlera humainement la demande avant toute suite.
      </p>

      <div className="sr-only">
        <label htmlFor="website_confirm">Laissez ce champ vide</label>
        <input
          id="website_confirm"
          name="website_confirm"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={websiteConfirm}
          onChange={(event) => setWebsiteConfirm(event.target.value)}
        />
      </div>

      <ConciergeSubmissionStatus submission={submission} />
      <Button
        type="button"
        size="lg"
        disabled={isSubmitting || submission.status === 'disabled'}
        aria-busy={isSubmitting}
        onClick={() => void onSubmit(websiteConfirm)}
        className="mt-4 min-h-11 w-full whitespace-normal px-4 text-center"
      >
        <Send aria-hidden="true" />
        {isSubmitting ? 'Transmission en cours…' : 'Envoyer ma demande à Novekia'}
      </Button>
      {submission.status === 'disabled' ? (
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          Vous pouvez utiliser le formulaire de contact général en attendant la réactivation du service.
        </p>
      ) : null}
    </section>
  )
}
