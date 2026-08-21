import {
  BookOpenCheck,
  Eye,
  FileSearch,
  Gauge,
  RefreshCcw,
  SlidersHorizontal,
} from 'lucide-react'
import { SectionHeader } from '@/components/brand/section-header'
import { Section } from '@/components/layout/section'

const principles = [
  {
    title: 'Supervision humaine',
    description:
      'Les décisions sensibles, les validations et les actions externes restent contrôlées par une personne.',
    icon: Eye,
  },
  {
    title: 'Sources traçables',
    description:
      'Les données utilisées, leurs limites et les raisons d’une recommandation restent explicites.',
    icon: FileSearch,
  },
  {
    title: 'Recommandations contextualisées',
    description:
      'Une analyse est reliée au marché, aux contraintes, aux usages et au niveau de maturité réel.',
    icon: SlidersHorizontal,
  },
  {
    title: 'Promesses mesurées',
    description:
      'Aucun résultat commercial, classement ou performance dépendant d’un tiers n’est garanti artificiellement.',
    icon: Gauge,
  },
  {
    title: 'Architecture adaptée',
    description:
      'Les outils et infrastructures sont dimensionnés à partir du besoin, pas d’une solution imposée.',
    icon: BookOpenCheck,
  },
  {
    title: 'Documentation et réversibilité',
    description:
      'Les décisions, livrables et conditions d’exploitation sont documentés pour préserver votre maîtrise.',
    icon: RefreshCcw,
  },
] as const

export function TrustSection() {
  return (
    <Section
      id="confiance"
      tone="muted"
      containerSize="wide"
      aria-labelledby="trust-title"
    >
      <SectionHeader
        index="06"
        eyebrow="Principes de confiance"
        title={
          <span id="trust-title">
            La précision avant
            <br />
            <span className="text-primary">la promesse.</span>
          </span>
        }
        description="Les produits et services Novekia reposent sur les mêmes exigences de contrôle, de clarté et de responsabilité."
      />

      <div className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {principles.map((principle) => {
          const Icon = principle.icon

          return (
            <article
              key={principle.title}
              className="min-h-64 bg-background p-6 sm:p-8"
            >
              <Icon
                aria-hidden="true"
                className="size-7 text-primary"
                strokeWidth={1.4}
              />
              <h3 className="mt-7 text-lg font-semibold">{principle.title}</h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {principle.description}
              </p>
            </article>
          )
        })}
      </div>
    </Section>
  )
}
