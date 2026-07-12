import type { Metadata } from 'next'
import { LegalPageLayout } from '@/components/legal/legal-page-layout'

export const metadata: Metadata = {
  title: 'Politique de confidentialité | Novekia',
  description:
    'Politique de confidentialité de Novekia concernant les données transmises par le formulaire de contact et la mesure d’audience du site.',
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Protection des données"
      title="Politique de confidentialité"
      introduction="Cette politique explique comment Novekia traite les données personnelles transmises lorsque vous utilisez le formulaire de contact et consultez le site."
    >
      <section aria-labelledby="controller">
        <h2 id="controller">Responsable du traitement</h2>
        <p>
          Le responsable du traitement est Andy Legrand, entrepreneur
          individuel — EI, exerçant sous le nom commercial Novekia.
        </p>
        <address className="text-muted-foreground">
          <p>Andy Legrand — Novekia</p>
          <p>41 rue du Trève</p>
          <p>01480 Villeneuve</p>
          <p>France</p>
          <p>
            E-mail&nbsp;:{' '}
            <a href="mailto:contact@novekia.fr">contact@novekia.fr</a>
          </p>
          <p>Téléphone&nbsp;: <a href="tel:+33767842757">07 67 84 27 57</a></p>
        </address>
      </section>

      <section aria-labelledby="collected-data">
        <h2 id="collected-data">Données collectées</h2>
        <p>Le formulaire permet de transmettre les données suivantes&nbsp;:</p>
        <ul className="text-muted-foreground">
          <li>nom et prénom&nbsp;;</li>
          <li>entreprise, facultative&nbsp;;</li>
          <li>adresse e-mail professionnelle&nbsp;;</li>
          <li>téléphone, facultatif&nbsp;;</li>
          <li>type de besoin&nbsp;;</li>
          <li>budget indicatif, facultatif&nbsp;;</li>
          <li>description du projet&nbsp;;</li>
          <li>confirmation de prise de connaissance de la présente politique.</li>
        </ul>
        <p className="text-muted-foreground">
          Des données techniques strictement nécessaires à la sécurité et au
          fonctionnement du service peuvent également être générées par
          l’infrastructure.
        </p>
      </section>

      <section aria-labelledby="purposes">
        <h2 id="purposes">Finalités</h2>
        <p>Les données sont traitées afin de&nbsp;:</p>
        <ul className="text-muted-foreground">
          <li>recevoir et traiter les demandes&nbsp;;</li>
          <li>répondre au demandeur&nbsp;;</li>
          <li>qualifier un besoin technique ou commercial&nbsp;;</li>
          <li>préparer une éventuelle proposition&nbsp;;</li>
          <li>assurer la sécurité du formulaire&nbsp;;</li>
          <li>détecter les soumissions automatisées ou abusives.</li>
        </ul>
      </section>

      <section aria-labelledby="legal-bases">
        <h2 id="legal-bases">Bases légales</h2>
        <p className="text-muted-foreground">
          Les demandes concernant un projet ou une prestation sont traitées sur
          le fondement des mesures précontractuelles prises à la demande de la
          personne. Les demandes générales, la sécurisation du formulaire et la
          prévention des abus reposent sur l’intérêt légitime de Novekia à
          répondre aux sollicitations et à protéger son service.
        </p>
      </section>

      <section aria-labelledby="required-fields">
        <h2 id="required-fields">Champs obligatoires et facultatifs</h2>
        <p>
          Les champs obligatoires sont le nom et prénom, l’adresse e-mail, le
          type de besoin, la description du projet et la confirmation de prise
          de connaissance de cette politique.
        </p>
        <p className="text-muted-foreground">
          L’entreprise, le téléphone et le budget sont facultatifs. L’absence
          d’une donnée obligatoire empêche l’envoi ou le traitement de la
          demande.
        </p>
      </section>

      <section aria-labelledby="recipients">
        <h2 id="recipients">Destinataires et sous-traitants</h2>
        <p>Les données sont accessibles uniquement&nbsp;:</p>
        <ul className="text-muted-foreground">
          <li>à Andy Legrand / Novekia&nbsp;;</li>
          <li>à Vercel, pour l’hébergement et l’exécution technique du site&nbsp;;</li>
          <li>à Resend, pour l’acheminement du message&nbsp;;</li>
          <li>aux prestataires strictement nécessaires au fonctionnement et à la sécurité du service.</li>
        </ul>
        <p className="text-muted-foreground">
          Les données ne sont ni vendues ni louées.
        </p>
      </section>

      <section aria-labelledby="retention">
        <h2 id="retention">Durées de conservation</h2>
        <p className="text-muted-foreground">
          Les demandes sans relation contractuelle sont conservées pendant 12
          mois à compter du dernier échange. En cas de relation contractuelle,
          les informations nécessaires à l’exécution du contrat, à la
          facturation, à la comptabilité ou à la défense des droits sont
          conservées pendant les durées légales applicables. Les journaux
          techniques éventuels sont conservés pendant la durée nécessaire à la
          sécurité et selon les durées appliquées par les prestataires concernés.
        </p>
      </section>

      <section aria-labelledby="transfers">
        <h2 id="transfers">Transferts hors Espace économique européen</h2>
        <p className="text-muted-foreground">
          Vercel et Resend sont des prestataires établis aux États-Unis.
          Certaines données peuvent donc être traitées hors de l’Espace
          économique européen. Lorsque cela est nécessaire, ces transferts sont
          encadrés par les garanties contractuelles applicables, notamment les
          clauses contractuelles types et les accords de traitement des données
          des prestataires.
        </p>
      </section>

      <section aria-labelledby="security">
        <h2 id="security">Sécurité</h2>
        <p className="text-muted-foreground">
          Novekia met en œuvre une validation côté serveur, une transmission via
          HTTPS, un contrôle anti-spam par honeypot et une limitation de l’accès
          aux données. Les demandes ne sont pas publiées et aucune clé API n’est
          exposée dans le navigateur.
        </p>
      </section>

      <section aria-labelledby="rights">
        <h2 id="rights">Droits des personnes</h2>
        <p className="text-muted-foreground">
          Selon les conditions prévues par la réglementation, vous disposez de
          droits d’accès, de rectification, d’effacement, de limitation,
          d’opposition et de portabilité lorsque ce dernier droit est
          applicable. Vous pouvez retirer votre consentement lorsqu’un
          traitement repose effectivement sur celui-ci.
        </p>
        <p>
          Pour exercer vos droits, écrivez à{' '}
          <a href="mailto:contact@novekia.fr">contact@novekia.fr</a> ou par
          courrier à&nbsp;:
        </p>
        <address className="text-muted-foreground">
          <p>Novekia — Andy Legrand</p>
          <p>41 rue du Trève</p>
          <p>01480 Villeneuve</p>
          <p>France</p>
        </address>
        <p className="text-muted-foreground">
          Une preuve d’identité peut être demandée uniquement en cas de doute
          raisonnable sur l’identité du demandeur.
        </p>
      </section>

      <section aria-labelledby="complaint">
        <h2 id="complaint">Réclamation auprès de la CNIL</h2>
        <p className="text-muted-foreground">
          Vous pouvez adresser une réclamation à la Commission nationale de
          l’informatique et des libertés — CNIL sur son site officiel&nbsp;:{' '}
          <a href="https://www.cnil.fr">cnil.fr</a>.
        </p>
      </section>

      <section aria-labelledby="analytics">
        <h2 id="analytics">Cookies, traceurs et mesure d’audience</h2>
        <p className="text-muted-foreground">
          Le site utilise Vercel Web Analytics en production afin d’obtenir des
          statistiques de fréquentation agrégées. D’après la documentation de
          Vercel, ce service ne dépose pas de cookies pour suivre les visiteurs
          et génère un identifiant temporaire anonymisé qui ne permet pas de
          suivre une personne entre différents sites ou différentes journées.
          Aucune donnée issue du formulaire n’est utilisée à des fins de mesure
          d’audience.
        </p>
      </section>

      <section aria-labelledby="updates">
        <h2 id="updates">Mise à jour de la politique</h2>
        <p className="text-muted-foreground">
          Cette politique peut être mise à jour pour tenir compte des évolutions
          du site, de ses traitements, de ses prestataires ou de la
          réglementation. La date affichée en haut de la page identifie la
          version en vigueur.
        </p>
      </section>

      <section aria-labelledby="contact">
        <h2 id="contact">Contact</h2>
        <p className="text-muted-foreground">
          Pour toute question relative à cette politique ou au traitement de
          vos données, contactez Novekia à{' '}
          <a href="mailto:contact@novekia.fr">contact@novekia.fr</a> ou au{' '}
          <a href="tel:+33767842757">07 67 84 27 57</a>.
        </p>
      </section>
    </LegalPageLayout>
  )
}
