import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPageLayout } from '@/components/legal/legal-page-layout'

export const metadata: Metadata = {
  title: 'Mentions légales | Novekia',
  description:
    'Informations légales relatives à l’éditeur du site Novekia, à son hébergement et à ses prestataires techniques.',
}

export default function LegalNoticesPage() {
  return (
    <LegalPageLayout
      eyebrow="Informations légales"
      title="Mentions légales"
      introduction="Les présentes mentions légales précisent l’identité de l’éditeur du site Novekia, ses coordonnées et les informations relatives à ses prestataires techniques."
    >
      <section aria-labelledby="editor">
        <h2 id="editor">Éditeur du site</h2>
        <p>
          Le site Novekia est édité par Andy Legrand, entrepreneur individuel —
          EI, exerçant sous le nom commercial Novekia.
        </p>
        <address className="text-muted-foreground">
          <p>Andy Legrand — Entrepreneur individuel — EI</p>
          <p>Nom commercial&nbsp;: Novekia</p>
          <p>41 rue du Trève</p>
          <p>01480 Villeneuve</p>
          <p>France</p>
        </address>
      </section>

      <section aria-labelledby="identification">
        <h2 id="identification">Identification de l’entreprise</h2>
        <ul className="text-muted-foreground">
          <li>SIREN&nbsp;: 106 923 758</li>
          <li>SIRET&nbsp;: 106 923 758 00010</li>
          <li>Immatriculation&nbsp;: Registre national des entreprises — RNE</li>
          <li>Date d’immatriculation au RNE&nbsp;: 30 juin 2026</li>
          <li>Date de début d’activité&nbsp;: 27 juin 2026</li>
          <li>Code APE&nbsp;: 6201Z — Programmation informatique</li>
        </ul>
      </section>

      <section aria-labelledby="activity">
        <h2 id="activity">Activité</h2>
        <p className="text-muted-foreground">
          Conception, recherche, développement et prototypage d’architectures
          matérielles, de processeurs et de circuits intégrés.
        </p>
        <p className="text-muted-foreground">
          Création, édition, programmation et maintenance de sites internet, de
          logiciels, d’applications mobiles et de systèmes d’intelligence
          artificielle.
        </p>
        <p className="text-muted-foreground">
          Prestations de conseil en technologies, ingénierie informatique et
          sécurité des données.
        </p>
      </section>

      <section aria-labelledby="publication">
        <h2 id="publication">Directeur de la publication</h2>
        <p className="text-muted-foreground">
          Le directeur de la publication est Andy Legrand.
        </p>
      </section>

      <section aria-labelledby="contact">
        <h2 id="contact">Contact</h2>
        <address className="text-muted-foreground">
          <p>Téléphone&nbsp;: <a href="tel:+33767842757">07 67 84 27 57</a></p>
          <p>
            E-mail&nbsp;:{' '}
            <a href="mailto:contact@novekia.fr">contact@novekia.fr</a>
          </p>
        </address>
      </section>

      <section aria-labelledby="tax">
        <h2 id="tax">TVA</h2>
        <p className="text-muted-foreground">
          TVA non applicable — article 293 B du Code général des impôts.
        </p>
      </section>

      <section aria-labelledby="hosting">
        <h2 id="hosting">Hébergement</h2>
        <p>
          Le site et la route serveur du formulaire sont hébergés et exécutés
          par Vercel Inc.
        </p>
        <address className="text-muted-foreground">
          <p>Vercel Inc.</p>
          <p>440 N Barranca Ave #4133</p>
          <p>Covina, CA 91723</p>
          <p>États-Unis</p>
        </address>
        <p className="text-muted-foreground">
          Site&nbsp;: <a href="https://vercel.com">vercel.com</a>
          <br />
          Support&nbsp;: <a href="https://vercel.com/help">vercel.com/help</a>
        </p>
      </section>

      <section aria-labelledby="domain-services">
        <h2 id="domain-services">Nom de domaine, DNS et messagerie</h2>
        <p className="text-muted-foreground">
          OVHcloud fournit l’enregistrement du domaine novekia.fr, la gestion de
          sa zone DNS et la messagerie professionnelle OVH/Zimbra.
        </p>
        <p className="text-muted-foreground">
          Resend — Plus Five Five, Inc. assure la transmission technique des
          demandes du formulaire, envoyées depuis le domaine mail.novekia.fr et
          reçues dans la boîte contact@novekia.fr.
        </p>
      </section>

      <section aria-labelledby="intellectual-property">
        <h2 id="intellectual-property">Propriété intellectuelle</h2>
        <p className="text-muted-foreground">
          Sauf mention contraire, les contenus, textes, éléments graphiques,
          logo, interfaces et travaux publiés sur ce site sont protégés et ne
          peuvent être reproduits, représentés, adaptés ou exploités sans
          autorisation préalable. Les éléments appartenant à des tiers restent
          la propriété de leurs titulaires respectifs.
        </p>
      </section>

      <section aria-labelledby="liability">
        <h2 id="liability">Responsabilité</h2>
        <p className="text-muted-foreground">
          Novekia s’efforce de fournir des informations exactes et actualisées.
          Les informations publiées sur le site ne constituent toutefois ni une
          garantie de résultat ni un engagement contractuel. Les prestations
          sont définies dans une proposition ou un contrat spécifique. Les
          présentes mentions n’excluent aucune responsabilité légalement
          obligatoire.
        </p>
      </section>

      <section aria-labelledby="personal-data">
        <h2 id="personal-data">Données personnelles</h2>
        <p className="text-muted-foreground">
          Les modalités de traitement des données personnelles transmises via
          le site sont détaillées dans la{' '}
          <Link href="/politique-de-confidentialite">
            politique de confidentialité
          </Link>.
        </p>
      </section>

      <section aria-labelledby="applicable-law">
        <h2 id="applicable-law">Droit applicable</h2>
        <p className="text-muted-foreground">
          Le site et les présentes mentions légales sont soumis au droit
          français, sous réserve des règles impératives applicables.
        </p>
      </section>
    </LegalPageLayout>
  )
}
