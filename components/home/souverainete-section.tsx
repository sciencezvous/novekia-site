import { SectionHeader } from '@/components/brand/section-header'
import { Section } from '@/components/layout/section'

const layers = [
  {
    index: '01',
    title: 'Données privées',
    description:
      'Documents, bases métier, procédures internes et informations sensibles.',
  },
  {
    index: '02',
    title: 'Modèles IA',
    description:
      'Modèles spécialisés, modèles open weight et systèmes adaptés au cas d’usage.',
  },
  {
    index: '03',
    title: 'Orchestration',
    description:
      'Recherche documentaire, outils métier, agents contrôlés, règles et validation humaine.',
  },
  {
    index: '04',
    title: 'Infrastructure',
    description:
      'Stations GPU, serveurs locaux, stockage, réseau et supervision.',
  },
]

const benefits = [
  {
    title: 'Contrôle des données',
    description:
      'Les informations sensibles peuvent rester dans l’environnement technique défini par l’entreprise.',
    icon: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>,
  },
  {
    title: 'Maîtrise des coûts d’usage',
    description:
      'L’architecture est dimensionnée selon les volumes, les modèles et la fréquence réelle d’utilisation.',
    icon: <><path d="M4 19V9M10 19V5M16 19v-7M22 19H2" /><path d="m4 6 6-3 6 5 5-4" /></>,
  },
  {
    title: 'Fonctionnement local',
    description:
      'Certains services peuvent rester disponibles sans dépendre systématiquement d’une API externe.',
    icon: <><rect x="3" y="4" width="18" height="6" rx="1" /><rect x="3" y="14" width="18" height="6" rx="1" /><path d="M7 7h.01M7 17h.01M11 7h6M11 17h6" /></>,
  },
  {
    title: 'Architecture évolutive',
    description:
      'Les composants peuvent être ajustés lorsque les besoins, les modèles ou les charges de calcul évoluent.',
    icon: <><path d="M12 3v6M12 15v6M3 12h6M15 12h6" /><rect x="9" y="9" width="6" height="6" /><circle cx="12" cy="3" r="1" /><circle cx="21" cy="12" r="1" /><circle cx="12" cy="21" r="1" /><circle cx="3" cy="12" r="1" /></>,
  },
]

export function SouveraineteSection() {
  return (
    <Section id="souverainete" tone="dark" aria-labelledby="souverainete-title">
      <SectionHeader
        index="04"
        eyebrow="Souveraineté"
        title={
          <span id="souverainete-title">
            Intelligence souveraine,<br />sur votre infrastructure.
          </span>
        }
        description="Des modèles et des données maîtrisés localement, sans dépendance externe."
      />

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div aria-label="Architecture en quatre couches" className="relative">
          <div aria-hidden="true" className="absolute bottom-7 left-5 top-7 w-px bg-primary/40" />
          <ol className="flex flex-col gap-3">
            {layers.map((layer) => (
              <li key={layer.index} className="relative grid grid-cols-[2.5rem_1fr] gap-4">
                <span className="relative flex size-10 items-center justify-center border border-primary/50 bg-background font-mono text-xs text-primary">
                  {layer.index}
                </span>
                <div className="min-w-0 border border-border bg-card/65 p-4 transition-colors duration-200 hover:border-primary/50 hover:bg-card sm:p-5">
                  <h3 className="text-base font-semibold text-foreground">{layer.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{layer.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-1">
          {benefits.map((benefit) => (
            <article key={benefit.title} className="group flex gap-4 bg-background p-5 transition-colors duration-200 hover:bg-card">
              <span className="flex size-10 shrink-0 items-center justify-center border border-border text-primary transition-colors group-hover:border-primary/50">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
                  {benefit.icon}
                </svg>
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <p className="mt-12 border-l-2 border-primary/60 bg-card/60 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
        « Le choix entre infrastructure locale, cloud privé et architecture hybride dépend du besoin, du niveau de confidentialité et du coût total d’exploitation. »
      </p>
    </Section>
  )
}
