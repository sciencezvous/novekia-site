import type { Metadata } from 'next'
import { LegalPageLayout } from '@/components/legal/legal-page-layout'

export const metadata: Metadata = {
  title: 'Politique de confidentialité | Novekia',
  description:
    'Politique de confidentialité de Novekia concernant les données transmises par le formulaire de contact.',
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Protection des données"
      title="Politique de confidentialité"
      introduction="Cette politique explique comment Novekia traite les données personnelles transmises lorsque vous utilisez le formulaire de contact du site."
      updatedAt="12 juillet 2026"
    >
      <section aria-labelledby="controller">
        <h2 id="controller">Responsable du traitement</h2>
        <p>
          Le responsable du traitement est Andy Legrand, entrepreneur
          individuel exerçant sous le nom commercial Novekia.
        </p>
        <address className="text-muted-foreground">
          <p>118 rue de Verdun, 92800 Puteaux, France</p>
          <p>
            E-mail&nbsp;:{' '}
            <a href="mailto:contact@novekia.fr">contact@novekia.fr</a>
          </p>
        </address>
      </section>

      <section aria-labelledby="collected-data">
        <h2 id="collected-data">Données collectées</h2>
        <p>
          Lorsque vous envoyez une demande depuis le formulaire de contact,
          Novekia peut collecter les données suivantes&nbsp;:
        </p>
        <ul className="text-muted-foreground">
          <li>nom et prénom&nbsp;;</li>
          <li>nom de l’entreprise, lorsque vous le renseignez&nbsp;;</li>
          <li>adresse e-mail professionnelle&nbsp;;</li>
          <li>numéro de téléphone, lorsque vous le renseignez&nbsp;;</li>
          <li>type de besoin et budget indicatif&nbsp;;</li>
          <li>description du projet et toute information incluse dans votre message.</li>
        </ul>
      </section>

      <section aria-labelledby="purposes">
        <h2 id="purposes">Finalités et base juridique</h2>
        <p className="text-muted-foreground">
          Ces données sont traitées afin de recevoir votre demande, d’en
          comprendre le contexte, de vous répondre et, le cas échéant, de
          préparer une proposition commerciale ou une relation contractuelle.
        </p>
        <p className="text-muted-foreground">
          Le traitement repose sur votre consentement lors de l’envoi du
          formulaire. Les échanges nécessaires à l’étude de votre demande et à
          la préparation de mesures précontractuelles peuvent également reposer
          sur l’exécution de mesures prises à votre demande.
        </p>
      </section>

      <section aria-labelledby="recipients">
        <h2 id="recipients">Destinataires et prestataires</h2>
        <p className="text-muted-foreground">
          Les données sont destinées à Novekia et ne sont accessibles qu’aux
          personnes qui en ont besoin pour traiter votre demande. Elles sont
          également traitées par les prestataires techniques strictement
          nécessaires au fonctionnement du site et à l’acheminement des
          messages&nbsp;: Vercel pour l’hébergement et Resend pour l’envoi
          d’e-mails.
        </p>
      </section>

      <section aria-labelledby="transfers">
        <h2 id="transfers">Transferts hors de l’Union européenne</h2>
        <p className="text-muted-foreground">
          Vercel et Resend sont des sociétés établies aux États-Unis. Dans le
          cadre de leurs services, certaines données peuvent donc être traitées
          depuis les États-Unis. Ces prestataires encadrent les transferts de
          données conformément aux mécanismes prévus par la réglementation
          applicable. Vous pouvez consulter leurs politiques de confidentialité
          pour obtenir davantage d’informations sur leurs engagements.
        </p>
      </section>

      <section aria-labelledby="retention">
        <h2 id="retention">Durée de conservation</h2>
        <p className="text-muted-foreground">
          Les données liées à une demande sans suite sont conservées pendant une
          durée maximale de 12 mois à compter du dernier échange. Lorsqu’une
          relation contractuelle est engagée, les données nécessaires à son
          suivi sont conservées pendant la durée de cette relation, puis
          archivées pendant les durées légales applicables aux obligations
          comptables, fiscales et à la défense des droits de Novekia.
        </p>
      </section>

      <section aria-labelledby="rights">
        <h2 id="rights">Vos droits</h2>
        <p>
          Selon la réglementation applicable, vous disposez notamment d’un droit
          d’accès, de rectification, d’effacement, de limitation, d’opposition et
          de portabilité de vos données. Vous pouvez retirer votre consentement à
          tout moment, sans remettre en cause la licéité du traitement réalisé
          avant ce retrait.
        </p>
        <p className="text-muted-foreground">
          Pour exercer vos droits, écrivez à{' '}
          <a href="mailto:contact@novekia.fr">contact@novekia.fr</a> ou à Andy
          Legrand — Novekia, 118 rue de Verdun, 92800 Puteaux, France. Une preuve
          d’identité pourra être demandée uniquement en cas de doute raisonnable
          sur votre identité.
        </p>
        <p className="text-muted-foreground">
          Vous pouvez également introduire une réclamation auprès de la
          Commission nationale de l’informatique et des libertés (CNIL).
        </p>
      </section>

      <section aria-labelledby="changes">
        <h2 id="changes">Évolution de la politique</h2>
        <p className="text-muted-foreground">
          Novekia peut mettre à jour cette politique pour tenir compte des
          évolutions du site, de ses traitements ou de la réglementation. La
          date de dernière mise à jour indiquée en haut de cette page permet
          d’identifier la version en vigueur.
        </p>
      </section>
    </LegalPageLayout>
  )
}
