import { Section } from '@/components/layout/section'
import { SectionHeader } from '@/components/brand/section-header'

type SectionPlaceholderProps = {
  id: string
  index: string
  eyebrow: string
  title: React.ReactNode
  description?: string
  tone?: 'light' | 'muted' | 'dark'
}

/**
 * Emplacement de section de la page d'accueil, encore vide à cette étape des
 * fondations. Le contenu définitif sera intégré lors des étapes suivantes.
 */
export function SectionPlaceholder({
  id,
  index,
  eyebrow,
  title,
  description,
  tone = 'light',
}: SectionPlaceholderProps) {
  return (
    <Section id={id} tone={tone} aria-labelledby={`${id}-title`}>
      <SectionHeader
        index={index}
        eyebrow={eyebrow}
        title={<span id={`${id}-title`}>{title}</span>}
        description={description}
      />
      <div className="mt-10 flex min-h-52 items-center justify-center rounded-md border border-dashed border-border bg-card/40">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Contenu à venir
        </p>
      </div>
    </Section>
  )
}
