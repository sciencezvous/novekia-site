import type { Metadata } from 'next'
import { LegalPageLayout } from '@/components/legal/legal-page-layout'

export const metadata: Metadata = {
  title: 'Mentions légales | Novekia',
  description:
    'Informations légales relatives à l’éditeur du site Novekia et à son hébergement.',
}

export default function LegalNoticesPage() {
  return (
    <LegalPageLayout
      eyebrow="Informations légales"
      title="Mentions légales"
      introduction="Les présentes mentions légales précisent l’identité de l’éditeur du site Novekia, ses coordonnées et les informations relatives à son hébergement."
      updatedAt="12 juillet 2026"
    >
      <section aria-labelledby="editor">
        <h2 id="editor">Éditeur du site</h2>
        <p>
          Le site Novekia est édité par Andy Legrand, entrepreneur individuel,
          exerçant sous le nom commercial Novekia.
        </p>
        <address className="text-muted-foreground">
          <p>Andy Legrand — Entrepreneur individuel</p>
          <p>Nom commercial&nbsp;: Novekia</p>
          <p>Adresse&nbsp;: 118 rue de Verdun, 92800 Puteaux, France</p>
          <p>
            E-mail&nbsp;:{' '}
            <a href="mailto:contact@novekia.fr">contact@novekia.fr</a>
          </p>
        </address>
      </section>

      <section aria-labelledby="registration">
        <h2 id="registration">Immatriculation</h2>
        <ul className="text-muted-foreground">
          <li>SIREN&nbsp;: 911 551 554</li>
          <li>SIRET du siège&nbsp;: 911 551 554 00026</li>
          <li>Immatriculation au Registre national des entreprises (RNE)</li>
          <li>Date de création de l’entreprise&nbsp;: 4 avril 2022</li>
          <li>Date de création de l’établissement&nbsp;: 19 mai 2025</li>
          <li>Code APE&nbsp;: 62.01Z — Programmation informatique</li>
        </ul>
      </section>

      <section aria-labelledby="activity">
        <h2 id="activity">Activité</h2>
        <p className="text-muted-foreground">
          Programmation informatique, conseil en systèmes et logiciels
          informatiques, conception et développement de logiciels, sites web,
          applications, outils numériques, exploitation de plateformes,
          traitement de données, hébergement et activités connexes.
        </p>
      </section>

      <section aria-labelledby="publication">
        <h2 id="publication">Direction de la publication</h2>
        <p className="text-muted-foreground">
          Le directeur de la publication est Andy Legrand.
        </p>
      </section>

      <section aria-labelledby="tax">
        <h2 id="tax">Taxe sur la valeur ajoutée</h2>
        <p className="text-muted-foreground">
          TVA non applicable, article 293 B du Code général des impôts.
        </p>
      </section>

      <section aria-labelledby="hosting">
        <h2 id="hosting">Hébergement</h2>
        <p>
          Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133,
          Covina, CA 91723, États-Unis.
        </p>
        <p className="text-muted-foreground">
          Site web&nbsp;:{' '}
          <a href="https://vercel.com" rel="noreferrer" target="_blank">
            vercel.com
          </a>
        </p>
      </section>
    </LegalPageLayout>
  )
}
