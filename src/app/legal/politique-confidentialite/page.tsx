"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PolitiqueConfidentialite() {
  const [lang, setLang] = useState<"fr" | "en">("fr");

  return (
    <div className="min-h-screen bg-[#FAFAFA] selection:bg-primary-copper/30 font-sans text-primary-charcoal">
      <Navbar lang={lang} setLang={setLang} alwaysCompact={true} />
      
      <main className="max-w-4xl mx-auto px-6 py-32 md:py-48">
        <h1 className="font-serif text-4xl md:text-5xl text-primary-midnight mb-4">
          Politique de Confidentialité
        </h1>
        <p className="text-sm uppercase tracking-widest text-primary-copper font-medium mb-16">
          Charte RGPD — www.orvelan.fr — Dernière mise à jour : avril 2025
        </p>

        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-primary-midnight prose-p:font-light prose-a:text-primary-copper hover:prose-a:text-primary-midnight prose-strong:font-medium">
          
          <h2 className="text-2xl mt-12 mb-6 border-b border-primary-silver/20 pb-4">1. Responsable du traitement</h2>
          <p>
            <strong>Orvelan SAS</strong>, <a href="mailto:contact@orvelan.fr">contact@orvelan.fr</a>
          </p>
          <p>
            En tant que SAS de taille non soumise à l'obligation de désigner un DPO externe, le dirigeant d'Orvelan assume directement la fonction de responsable du traitement des données personnelles.
          </p>

          <h2 className="text-2xl mt-12 mb-6 border-b border-primary-silver/20 pb-4">2. Données collectées et finalités</h2>
          
          <h3 className="text-xl font-medium mt-8 mb-4">2.1 Données collectées</h3>
          <p>Dans le cadre de l'utilisation du site et de l'espace personnel, Orvelan est susceptible de collecter :</p>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li>Nom, prénom, adresse email, numéro de téléphone (formulaire de contact) ;</li>
            <li>Identifiant et mot de passe (choisis librement par l'utilisateur) ;</li>
            <li>Réponses à l'autodiagnostic et résultats associés ;</li>
            <li>Documents échangés via l'espace privé ;</li>
            <li>Données de connexion et de navigation (cookies techniques).</li>
          </ul>

          <h3 className="text-xl font-medium mt-8 mb-4">2.2 Finalités du traitement</h3>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li>Création et gestion de l'espace personnel sécurisé ;</li>
            <li>Fourniture de l'autodiagnostic gratuit et restitution des résultats ;</li>
            <li>Communication et échange de documents entre Orvelan et l'utilisateur ;</li>
            <li>Amélioration du site et des services (statistiques anonymisées) ;</li>
            <li>Respect des obligations légales applicables.</li>
          </ul>

          <h3 className="text-xl font-medium mt-8 mb-4">2.3 Base légale</h3>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li>Consentement de l'utilisateur (création de compte, autodiagnostic, analytics) ;</li>
            <li>Intérêt légitime d'Orvelan (amélioration des services, sécurité) ;</li>
            <li>Obligation légale le cas échéant.</li>
          </ul>

          <h2 className="text-2xl mt-12 mb-6 border-b border-primary-silver/20 pb-4">3. Hébergement et transfert de données</h2>
          <p>
            Les données sont hébergées sur des serveurs situés en Allemagne, au sein de l'Union européenne. Aucun transfert vers un pays tiers n'est effectué. Orvelan s'engage à ne sélectionner que des sous-traitants techniques présentant des garanties suffisantes au regard du RGPD.
          </p>

          <h2 className="text-2xl mt-12 mb-6 border-b border-primary-silver/20 pb-4">4. Durée de conservation</h2>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li><strong>Données de compte :</strong> conservées pendant la durée d'activité du compte, puis supprimées dans un délai de 3 ans après la dernière connexion ;</li>
            <li><strong>Résultats d'autodiagnostic :</strong> conservés pendant la durée de la relation avec l'utilisateur ;</li>
            <li><strong>Documents échangés :</strong> conservés jusqu'à clôture du dossier + 5 ans (obligations légales) ;</li>
            <li><strong>Données de navigation :</strong> 13 mois maximum.</li>
          </ul>

          <h2 className="text-2xl mt-12 mb-6 border-b border-primary-silver/20 pb-4">5. Sécurité</h2>
          <p>
            Orvelan met en œuvre des mesures techniques adaptées : chiffrement des mots de passe, connexions sécurisées (HTTPS), accès restreint aux données, pare-feu. En cas de violation de données, les utilisateurs concernés seront informés dans les délais réglementaires (72h pour la CNIL).
          </p>

          <h2 className="text-2xl mt-12 mb-6 border-b border-primary-silver/20 pb-4">6. Cookies</h2>
          <p>
            Le site utilise des cookies techniques nécessaires au fonctionnement de l'espace personnel (session, authentification). Aucun cookie d'analyse ou de mesure d'audience n'est utilisé sans consentement explicite préalable via notre bannière de cookies.
          </p>

          <h2 className="text-2xl mt-12 mb-6 border-b border-primary-silver/20 pb-4">7. Vos droits</h2>
          <p>Conformément au RGPD (articles 15 à 22), vous disposez des droits suivants :</p>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li>Accès, rectification et effacement de vos données ;</li>
            <li>Opposition et limitation du traitement ;</li>
            <li>Portabilité de vos données ;</li>
            <li>Retrait du consentement à tout moment.</li>
          </ul>
          <p>
            Pour exercer ces droits : <a href="mailto:contact@orvelan.fr">contact@orvelan.fr</a> (joindre une copie d'un justificatif d'identité).
          </p>
          <p>
            Vous pouvez également déposer une réclamation auprès de la CNIL : <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">www.cnil.fr/fr/plaintes</a>
          </p>

          <h2 className="text-2xl mt-12 mb-6 border-b border-primary-silver/20 pb-4">8. Non-commercialisation des données</h2>
          <p>
            Orvelan ne vend, ne loue et ne cède aucune donnée personnelle à des tiers à des fins commerciales. Les données ne sont partagées qu'avec les prestataires techniques strictement nécessaires à la fourniture du service, dans le cadre de contrats conformes au RGPD.
          </p>

        </div>
      </main>

      <Footer lang="fr" />
    </div>
  );
}
