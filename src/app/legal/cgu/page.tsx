"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function CGU() {
  const [lang, setLang] = useState<"fr" | "en">("fr");

  return (
    <div className="min-h-screen bg-[#FAFAFA] selection:bg-primary-copper/30 font-sans text-primary-charcoal">
      <Navbar lang={lang} setLang={setLang} alwaysCompact={true} />
      
      <main className="max-w-4xl mx-auto px-6 py-32 md:py-48">
        <h1 className="font-serif text-4xl md:text-5xl text-primary-midnight mb-4">
          Conditions Générales d'Utilisation
        </h1>
        <p className="text-sm uppercase tracking-widest text-primary-copper font-medium mb-16">
          www.orvelan.fr — Dernière mise à jour : avril 2025
        </p>

        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-primary-midnight prose-p:font-light prose-a:text-primary-copper hover:prose-a:text-primary-midnight prose-strong:font-medium">
          
          <p className="text-lg italic mb-12">
            Le service d'autodiagnostic proposé par Orvelan étant gratuit, les présentes CGU régissent l'accès et l'utilisation du site et de l'espace personnel. Des conditions générales de vente spécifiques seront établies lors de la mise en place de prestations payantes.
          </p>

          <h2 className="text-2xl mt-12 mb-6 border-b border-primary-silver/20 pb-4">1. Objet</h2>
          <p>
            Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation du site www.orvelan.fr, notamment l'espace personnel et l'outil d'autodiagnostic gratuit proposés par Orvelan SAS (ci-après &ldquo;Orvelan&rdquo;).
          </p>
          <p>
            L'utilisation du site vaut acceptation pleine et entière des présentes CGU.
          </p>

          <h2 className="text-2xl mt-12 mb-6 border-b border-primary-silver/20 pb-4">2. Accès au site et à l'espace personnel</h2>
          
          <h3 className="text-xl font-medium mt-8 mb-4">2.1 Accès public</h3>
          <p>
            Le site www.orvelan.fr est librement accessible. Orvelan se réserve le droit d'en restreindre l'accès temporairement pour des raisons de maintenance, sans préavis.
          </p>

          <h3 className="text-xl font-medium mt-8 mb-4">2.2 Création de l'espace personnel</h3>
          <p>
            L'utilisateur peut créer un espace personnel en choisissant librement son identifiant (ID) et son mot de passe (PW). Il s'engage à :
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li>Fournir des informations exactes et à jour ;</li>
            <li>Conserver ses identifiants confidentiels ;</li>
            <li>Ne pas partager son accès avec des tiers ;</li>
            <li>Informer immédiatement Orvelan de toute compromission : <a href="mailto:contact@orvelan.fr">contact@orvelan.fr</a></li>
          </ul>
          <p>L'utilisateur est seul responsable de l'usage fait depuis son compte.</p>

          <h3 className="text-xl font-medium mt-8 mb-4">2.3 Fonctionnalités de l'espace personnel</h3>
          <p>L'espace personnel permet :</p>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li>De réaliser l'autodiagnostic gratuit Orvelan et d'accéder aux résultats ;</li>
            <li>De communiquer avec l'équipe Orvelan et d'échanger des documents.</li>
          </ul>

          <h2 className="text-2xl mt-12 mb-6 border-b border-primary-silver/20 pb-4">3. Autodiagnostic</h2>
          <p>
            L'autodiagnostic proposé par Orvelan est un outil d'aide à la réflexion à destination des dirigeants et professionnels. Les résultats fournis ont valeur indicative et ne constituent pas un conseil juridique, fiscal, social ou financier. Orvelan ne saurait être tenu responsable des décisions prises sur la base de ces résultats.
          </p>

          <h2 className="text-2xl mt-12 mb-6 border-b border-primary-silver/20 pb-4">4. Propriété intellectuelle</h2>
          <p>
            L'ensemble des contenus du site (textes, outils, questionnaires, logos, design) est la propriété exclusive d'Orvelan SAS, protégée par le droit de la propriété intellectuelle. Toute reproduction ou exploitation sans autorisation écrite est interdite.
          </p>

          <h2 className="text-2xl mt-12 mb-6 border-b border-primary-silver/20 pb-4">5. Utilisation acceptable</h2>
          <p>
            L'utilisateur s'engage à ne pas utiliser le site à des fins illicites, frauduleuses ou nuisibles, et notamment à ne pas :
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li>Tenter de contourner les mécanismes de sécurité ;</li>
            <li>Transmettre des contenus illicites ou offensants ;</li>
            <li>Collecter des données d'autres utilisateurs ;</li>
            <li>Perturber le fonctionnement du site.</li>
          </ul>

          <h2 className="text-2xl mt-12 mb-6 border-b border-primary-silver/20 pb-4">6. Limitation de responsabilité</h2>
          <p>
            Le site et ses services sont fournis &ldquo;en l'état&rdquo;. Orvelan ne garantit pas l'absence d'interruption ou d'erreur. Sa responsabilité ne saurait être engagée pour tout dommage direct ou indirect résultant de l'utilisation du site ou de l'indisponibilité temporaire du service.
          </p>

          <h2 className="text-2xl mt-12 mb-6 border-b border-primary-silver/20 pb-4">7. Données personnelles</h2>
          <p>
            Le traitement des données personnelles est régi par la Politique de Confidentialité disponible sur le site, conforme au RGPD (n° 2016/679).
          </p>

          <h2 className="text-2xl mt-12 mb-6 border-b border-primary-silver/20 pb-4">8. Modification des CGU</h2>
          <p>
            Orvelan se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification substantielle par email ou notification dans leur espace personnel. L'utilisation continue du service après modification vaut acceptation des nouvelles CGU.
          </p>

          <h2 className="text-2xl mt-12 mb-6 border-b border-primary-silver/20 pb-4">9. Droit applicable et juridiction</h2>
          <p>
            Les présentes CGU sont soumises au droit français. Tout litige relèvera de la compétence des tribunaux d'Aix-en-Provence, sauf disposition légale contraire.
          </p>

          <div className="mt-16 text-primary-midnight font-medium">
            Contact : <a href="mailto:contact@orvelan.fr">contact@orvelan.fr</a>
          </div>

        </div>
      </main>

      <Footer lang="fr" />
    </div>
  );
}
