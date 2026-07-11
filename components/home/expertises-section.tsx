import { Section } from '@/components/layout/section'
import { SectionHeader } from '@/components/brand/section-header'
import { cn } from '@/lib/utils'

const expertises = [
  {
    id: 'logiciels-metiers',
    title: 'Logiciels métiers sur mesure',
    description:
      'Applications internes, plateformes professionnelles, automatisations et outils adaptés aux processus de l\'entreprise.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
        <path d="M7 8h.01M10 8h5" />
        <path d="M7 11h.01M10 11h3" />
      </svg>
    ),
  },
  {
    id: 'ia-locale',
    title: 'Intelligence artificielle locale',
    description:
      'Déploiement de modèles IA sur infrastructure privée, sans transfert systématique des données vers un fournisseur externe.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
        <path d="M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
      </svg>
    ),
  },
  {
    id: 'stations-serveurs',
    title: 'Stations et serveurs IA',
    description:
      'Conception de configurations GPU sur mesure selon les modèles utilisés, les volumes de données, les performances attendues et le budget.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5">
        <rect x="2" y="4" width="20" height="6" rx="1" />
        <rect x="2" y="14" width="20" height="6" rx="1" />
        <path d="M6 7h.01M6 17h.01M10 7h.01M10 17h.01" />
      </svg>
    ),
  },
  {
    id: 'infrastructures-calcul',
    title: 'Infrastructures de calcul',
    description:
      'Architecture, intégration et optimisation de stations haute performance, serveurs GPU, stockage et réseaux internes.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5">
        <path d="M5 12H2M22 12h-3M12 5V2M12 22v-3" />
        <rect x="7" y="7" width="10" height="10" rx="1" />
        <path d="M9 9h6v6H9z" />
      </svg>
    ),
  },
  {
    id: 'applications-web',
    title: 'Applications web et intégrations',
    description:
      'Interfaces professionnelles, API, outils collaboratifs, automatisations et connexions avec les systèmes existants.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    id: 'seo-geo',
    title: 'SEO et GEO',
    description:
      'Sites structurés pour les moteurs de recherche et les systèmes de recherche, synthèse et réponse assistés par intelligence artificielle.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
        <path d="M11 8v6M8 11h6" />
      </svg>
    ),
  },
]

export function ExpertisesSection() {
  return (
    <Section id="expertises" tone="muted" aria-labelledby="expertises-title">
      <SectionHeader
        index="02"
        eyebrow="Expertises"
        title={<span id="expertises-title">Nos domaines d&apos;intervention.</span>}
        description="Logiciels métiers, intelligence artificielle souveraine, stations de calcul et serveurs IA."
      />

      <div className="mt-12 grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {expertises.map((expertise) => (
          <article
            key={expertise.id}
            className={cn(
              'group relative flex flex-col gap-4 bg-background p-6 transition-colors duration-200',
              'hover:bg-accent/40',
              'focus-within:ring-2 focus-within:ring-inset focus-within:ring-ring',
            )}
          >
            {/* Icône */}
            <span className="text-primary opacity-80 transition-opacity duration-200 group-hover:opacity-100">
              {expertise.icon}
            </span>

            {/* Titre */}
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              {expertise.title}
            </h3>

            {/* Description */}
            <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
              {expertise.description}
            </p>

            {/* Lien discret */}
            <div className="mt-auto">
              <a
                href={`#${expertise.id}`}
                className={cn(
                  'inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.1em] text-primary',
                  'opacity-0 transition-opacity duration-200 group-hover:opacity-100',
                  'focus:opacity-100 focus:outline-none',
                  // couverture de l'ensemble de la carte pour la zone de clic
                  'after:absolute after:inset-0',
                )}
                aria-label={`Explorer l'expertise : ${expertise.title}`}
              >
                Explorer
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-3" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </a>
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}
