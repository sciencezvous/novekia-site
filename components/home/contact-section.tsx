import { ContactForm } from '@/components/brand/contact-form'
import { SectionHeader } from '@/components/brand/section-header'
import { Section } from '@/components/layout/section'

const contactSteps = [
  {
    index: '01',
    title: 'Qualification initiale',
    description:
      'Une première analyse permet de préciser le besoin, les contraintes et le périmètre pertinent.',
  },
  {
    index: '02',
    title: 'Confidentialité des échanges',
    description:
      'Les informations transmises sont utilisées uniquement pour comprendre la demande et préparer les échanges.',
  },
  {
    index: '03',
    title: 'Proposition adaptée',
    description:
      'La méthode, l’architecture et le découpage du projet sont définis selon le contexte réel.',
  },
]

export function ContactSection() {
  return (
    <Section
      id="contact"
      tone="dark"
      className="scroll-mt-20 overflow-hidden"
      aria-labelledby="contact-title"
    >
      <div aria-hidden="true" className="technical-grid-pattern pointer-events-none absolute inset-0 opacity-20 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <div className="relative">
        <SectionHeader
          index="08"
          eyebrow="Contact"
          title={<span id="contact-title">Parlons de votre objectif.</span>}
          description="Développer votre prospection, gouverner vos usages IA ou réaliser une solution numérique : décrivez votre contexte et Novekia vous orientera vers le produit ou l’expertise appropriée."
        />

        <div className="mt-10 grid grid-cols-1 gap-10 sm:mt-12 sm:gap-12 lg:grid-cols-2 lg:gap-16">
          <ContactForm />

          <aside className="border-t border-border pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0" aria-labelledby="contact-info-title">
            <h3 id="contact-info-title" className="text-xl font-semibold text-foreground">Un premier échange pour vous orienter</h3>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Présentez votre marché, votre besoin ou votre environnement
              technique. Nous clarifierons ensemble si le sujet relève de Lead
              Engine Studio, de Novekia Solutions ou des deux.
            </p>

            <div className="mt-7 flex flex-col gap-2 font-mono text-sm">
              <a href="mailto:contact@novekia.fr" className="w-fit text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                contact@novekia.fr
              </a>
              <span className="text-foreground">France</span>
              <span className="text-muted-foreground">Projets à distance ou sur site selon le contexte</span>
            </div>

            <ol className="mt-10 flex flex-col gap-px bg-border">
              {contactSteps.map((step) => (
                <li key={step.index} className="bg-background/80 p-5">
                  <div className="flex gap-4">
                    <span className="font-mono text-xs tracking-[0.16em] text-primary">{step.index}</span>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{step.title}</h4>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </div>
    </Section>
  )
}
