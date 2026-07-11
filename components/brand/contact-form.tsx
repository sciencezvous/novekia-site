'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { PrimaryButton } from './primary-button'
import { cn } from '@/lib/utils'

type ContactFormProps = {
  className?: string
}

/**
 * Formulaire de contact. À cette étape des fondations, la soumission est
 * volontairement inerte (aucun backend branché) — prêt à être connecté ensuite.
 */
export function ContactForm({ className }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // Placeholder : le traitement réel sera branché à une étape ultérieure.
    setSubmitted(true)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex flex-col gap-5', className)}
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-name">Nom</Label>
          <Input id="contact-name" name="name" autoComplete="name" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-company">Organisation</Label>
          <Input
            id="contact-company"
            name="company"
            autoComplete="organization"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-email">Email professionnel</Label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-message">Votre besoin</Label>
        <Textarea
          id="contact-message"
          name="message"
          rows={5}
          placeholder="Décrivez votre projet, votre contexte technique ou votre problématique."
          required
        />
      </div>
      <div className="flex flex-col gap-3">
        <PrimaryButton type="submit" withArrow>
          Envoyer la demande
        </PrimaryButton>
        {submitted ? (
          <p
            role="status"
            className="font-mono text-xs text-muted-foreground"
          >
            Merci — votre demande a bien été enregistrée. Nous reviendrons vers
            vous rapidement.
          </p>
        ) : null}
      </div>
    </form>
  )
}
