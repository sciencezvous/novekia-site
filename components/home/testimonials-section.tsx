import { Quote } from 'lucide-react'
import { PrimaryButton } from '@/components/brand/primary-button'
import { SectionHeader } from '@/components/brand/section-header'
import { Section } from '@/components/layout/section'

const testimonials = [
  {
    quote:
      'Ils nous ont aidés à créer notre propre IA locale et à installer les bons serveurs. Tout est resté chez nous, c’est sécurisé et ça marche très bien. Une équipe compétente et à l’écoute.',
    name: 'Julien Carpentier',
    role: 'Responsable Innovation',
  },
  {
    quote: 'Solution sur mesure, sécurisée et performante.',
    name: 'Rodrigue',
    role: 'Responsable IT',
  },
] as const

export function TestimonialsSection() {
  return (
    <Section
      id="temoignages"
      tone="light"
      className="scroll-mt-20"
      aria-labelledby="testimonials-title"
    >
      <SectionHeader
        index="05"
        eyebrow="Retours clients"
        title={
          <span id="testimonials-title">
            La confiance se gagne
            <br />
            <span className="text-primary">sur le terrain.</span>
          </span>
        }
        description="Des retours directs sur l’accompagnement, la maîtrise locale et la qualité des solutions livrées."
      />

      <div className="mt-12 grid gap-px bg-border md:grid-cols-2">
        {testimonials.map((testimonial) => (
          <figure
            key={`${testimonial.name}-${testimonial.role}`}
            className="flex min-h-72 flex-col justify-between bg-background p-6 sm:p-8 lg:p-10"
          >
            <div>
              <Quote
                aria-hidden="true"
                className="size-8 text-primary"
                strokeWidth={1.4}
              />
              <blockquote className="mt-7 text-balance text-xl font-medium leading-8 tracking-[-0.02em] text-foreground sm:text-2xl sm:leading-9">
                « {testimonial.quote} »
              </blockquote>
            </div>
            <figcaption className="mt-10 border-t border-border pt-5">
              <p className="font-semibold text-foreground">{testimonial.name}</p>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {testimonial.role}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>

      <p className="mt-7 max-w-3xl text-sm leading-7 text-muted-foreground">
        Retours communiqués directement à Novekia et reproduits sans note
        chiffrée ni résultat commercial ajouté.
      </p>

      <div className="mt-8 flex flex-col items-start gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
        <PrimaryButton href="/#contact" withArrow>
          Parler de votre objectif
        </PrimaryButton>
        <p className="font-mono text-xs tracking-wide text-muted-foreground">
          Réponse sous 48 h ouvrées <span aria-hidden="true">•</span> Sans
          engagement
        </p>
      </div>
    </Section>
  )
}
