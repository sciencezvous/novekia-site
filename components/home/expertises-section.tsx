import { ExpertiseGrid } from '@/components/brand/expertise-grid'
import { SectionHeader } from '@/components/brand/section-header'
import { Section } from '@/components/layout/section'

export function ExpertisesSection() {
  return (
    <Section id="expertises" tone="muted" aria-labelledby="expertises-title">
      <SectionHeader
        index="02"
        eyebrow="Expertises"
        title={<span id="expertises-title">Nos domaines d&apos;intervention.</span>}
        description="Logiciels métiers, intelligence artificielle souveraine, stations de calcul et serveurs IA."
      />

      <ExpertiseGrid className="mt-12" />
    </Section>
  )
}
