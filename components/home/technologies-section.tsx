import { SectionHeader } from '@/components/brand/section-header'
import { Section } from '@/components/layout/section'

const technologies = [
  {
    index: '01',
    title: 'Interfaces',
    description:
      'Applications web modernes, interfaces métier et expériences utilisateurs responsives.',
    badges: ['React', 'Next.js', 'TypeScript'],
    icon: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M7 6.5h.01M10 6.5h.01" /></>,
  },
  {
    index: '02',
    title: 'Backend et API',
    description:
      'Services applicatifs, API structurées, traitements asynchrones et automatisations.',
    badges: ['Python', 'FastAPI', 'Node.js', 'API'],
    icon: <><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" /></>,
  },
  {
    index: '03',
    title: 'Données',
    description:
      'Bases relationnelles, bases documentaires, recherche vectorielle et synchronisation.',
    badges: ['PostgreSQL', 'SQL', 'Vector Search'],
    icon: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7" /></>,
  },
  {
    index: '04',
    title: 'Intelligence artificielle',
    description:
      'Modèles locaux, RAG, traitement documentaire, classification et automatisation assistée.',
    badges: ['Local AI', 'RAG', 'Inference'],
    icon: <><rect x="7" y="7" width="10" height="10" rx="1" /><path d="M9 2v5M15 2v5M9 17v5M15 17v5M2 9h5M17 9h5M2 15h5M17 15h5M10 10h4v4h-4z" /></>,
  },
  {
    index: '05',
    title: 'Infrastructure',
    description:
      'Systèmes Linux, conteneurs, GPU, stockage, réseau et déploiement sur site ou dans le cloud.',
    badges: ['Linux', 'Docker', 'CUDA', 'GPU'],
    icon: <><rect x="3" y="4" width="18" height="6" rx="1" /><rect x="3" y="14" width="18" height="6" rx="1" /><path d="M7 7h.01M7 17h.01M11 7h6M11 17h6" /></>,
  },
  {
    index: '06',
    title: 'Sécurité',
    description:
      'Gestion des accès, séparation des environnements, protection des secrets et sauvegardes.',
    badges: ['IAM', 'Secrets', 'Logs', 'Backups'],
    icon: <><path d="M12 3 4 6v6c0 5 3.4 8 8 9 4.6-1 8-4 8-9V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></>,
  },
]

export function TechnologiesSection() {
  return (
    <Section id="technologies" tone="light" aria-labelledby="technologies-title">
      <SectionHeader
        index="07"
        eyebrow="Technologies"
        title={<span id="technologies-title">Une pile technologique éprouvée.</span>}
        description="Architectures modulaires, calcul haute performance et sécurité par conception."
      />

      <div className="mt-12 grid grid-cols-1 gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
        {technologies.map((technology) => (
          <article
            key={technology.index}
            className="group flex min-h-0 flex-col bg-background p-5 transition-colors duration-200 hover:bg-secondary/50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-ring sm:min-h-56 sm:p-6 lg:min-h-64"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="flex size-10 items-center justify-center border border-border text-primary transition-colors group-hover:border-primary/50">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
                  {technology.icon}
                </svg>
              </span>
              <span className="font-mono text-xs tracking-[0.16em] text-muted-foreground">{technology.index}</span>
            </div>
            <h3 className="mt-5 text-base font-semibold text-foreground">{technology.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{technology.description}</p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Technologies : ${technology.title}`}>
              {technology.badges.map((badge) => (
                <li key={badge} className="border border-border bg-secondary/60 px-2.5 py-1 font-mono text-xs text-secondary-foreground">
                  {badge}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  )
}
