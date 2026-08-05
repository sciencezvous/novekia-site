import { ClipboardCheck, Crosshair, Route, Send } from 'lucide-react'
import { ConciergeTrigger } from '@/components/concierge/concierge-trigger'
import { TechnicalLabel } from '@/components/brand/technical-label'

const funnelSteps = [
  {
    title: 'Votre objectif',
    description:
      'Choisissez entre développement commercial, projet numérique ou besoin encore à clarifier.',
    icon: Crosshair,
  },
  {
    title: 'Votre contexte',
    description:
      'Nova précise les utilisateurs, contraintes, données et priorités utiles à la décision.',
    icon: ClipboardCheck,
  },
  {
    title: 'Votre orientation',
    description:
      'Le parcours identifie le pôle Novekia pertinent et prépare une synthèse structurée.',
    icon: Route,
  },
  {
    title: 'L’échange humain',
    description:
      'Vous relisez la synthèse et décidez explicitement de la transmettre à Novekia.',
    icon: Send,
  },
] as const

export function ConversionFunnelSection() {
  return (
    <section
      id="diagnostic"
      aria-labelledby="diagnostic-title"
      className="scroll-mt-24 border-b border-border px-5 py-16 sm:px-6 md:px-8 md:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
          <div>
            <TechnicalLabel index="02">Funnel de qualification</TechnicalLabel>
            <h2
              id="diagnostic-title"
              className="mt-6 max-w-xl text-balance text-4xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl"
            >
              Du besoin flou à un{' '}
              <span className="text-primary">premier cadrage utile.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground">
              En quelques questions, Nova vous oriente sans imposer une solution.
              Le parcours reste sous votre contrôle et aucune coordonnée n’est
              transmise avant votre validation finale.
            </p>

            <ConciergeTrigger
              source="diagnostic_section"
              className="mt-8 w-full sm:w-auto"
            >
              Démarrer mon diagnostic
            </ConciergeTrigger>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
              Sans engagement · Synthèse relue avant envoi
            </p>
          </div>

          <ol className="grid gap-px bg-border sm:grid-cols-2">
            {funnelSteps.map((step, index) => {
              const Icon = step.icon

              return (
                <li
                  key={step.title}
                  className="group min-h-64 bg-background p-6 transition-colors hover:bg-accent/25 sm:p-8"
                >
                  <div className="flex items-start justify-between gap-5">
                    <Icon
                      aria-hidden="true"
                      className="size-6 text-primary"
                      strokeWidth={1.5}
                    />
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-8 text-xl font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {step.description}
                  </p>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
