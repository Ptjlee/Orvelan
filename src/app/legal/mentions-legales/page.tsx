"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function MentionsLegales() {
  const [lang, setLang] = useState<"fr" | "en">("fr");

  return (
    <div className="min-h-screen bg-[#FAFAFA] selection:bg-primary-copper/30 font-sans text-primary-charcoal">
      <Navbar lang={lang} setLang={setLang} alwaysCompact={true} />
      
      <main className="max-w-4xl mx-auto px-6 py-32 md:py-48">
        <h1 className="font-serif text-4xl md:text-5xl text-primary-midnight mb-4">
          Mentions Légales
        </h1>
        <p className="text-sm uppercase tracking-widest text-primary-copper font-medium mb-16">
          www.orvelan.fr — Dernière mise à jour : avril 2025
        </p>

        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-primary-midnight prose-p:font-light prose-a:text-primary-copper hover:prose-a:text-primary-midnight prose-strong:font-medium">
          
          <h2 className="text-2xl mt-12 mb-6 border-b border-primary-silver/20 pb-4">1. Éditeur du site</h2>
          <ul className="list-none pl-0 space-y-2 mb-8">
            <li><strong>Raison sociale :</strong> Orvelan SAS</li>
            <li><strong>Capital social :</strong> 5 000 €</li>
            <li><strong>Siège social :</strong> 965 chemin Pierre Pascalis, 13100 Aix-en-Provence</li>
            <li><strong>SIRET :</strong> en cours d'immatriculation</li>
            <li><strong>TVA intracommunautaire :</strong> en cours</li>
            <li><strong>Email de contact :</strong> contact@orvelan.fr</li>
            <li><strong>Directeur de la publication :</strong> contact@orvelan.fr</li>
          </ul>

          <h2 className="text-2xl mt-12 mb-6 border-b border-primary-silver/20 pb-4">2. Hébergeur</h2>
          <p>
            Le site www.orvelan.fr est hébergé sur des serveurs situés en Allemagne, au sein de l'Union européenne, conformément aux exigences du Règlement Général sur la Protection des Données (RGPD n° 2016/679).
          </p>
          <ul className="list-none pl-0 space-y-2 mb-8 mt-4">
            <li><strong>Hébergeur (Infrastructure) :</strong> Vercel Inc., 340 S Lemon Ave #4133 Walnut, CA 91789, États-Unis (Données routées via des serveurs européens).</li>
            <li><strong>Base de données et authentification :</strong> Supabase, plateforme d'hébergement s'appuyant sur l'infrastructure AWS (Amazon Web Services) située dans la région eu-central-1 (Francfort, Allemagne).</li>
          </ul>
          <p>
            L'hébergement en Allemagne garantit que vos données restent soumises au droit européen.
          </p>

          <h2 className="text-2xl mt-12 mb-6 border-b border-primary-silver/20 pb-4">3. Propriété intellectuelle</h2>
          <p>
            L'ensemble des contenus présents sur ce site (textes, images, logos, graphismes, vidéos, structure) sont la propriété exclusive d'Orvelan SAS ou de ses partenaires, et sont protégés par le Code de la Propriété Intellectuelle.
          </p>
          <p>
            Toute reproduction, représentation ou utilisation, totale ou partielle, sans autorisation écrite préalable d'Orvelan est interdite et constitue une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la Propriété Intellectuelle.
          </p>

          <h2 className="text-2xl mt-12 mb-6 border-b border-primary-silver/20 pb-4">4. Espace personnel et autodiagnostic</h2>
          <p>
            Le site offre aux utilisateurs la possibilité de créer un espace personnel sécurisé, accessible par un identifiant (email) et un mot de passe librement choisis lors de l'inscription.
          </p>
          <p>Cet espace privé permet notamment :</p>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li>de réaliser l'autodiagnostic gratuit proposé par Orvelan et d'en consulter les résultats ;</li>
            <li>de communiquer avec l'équipe Orvelan et d'échanger des documents de manière sécurisée.</li>
          </ul>
          <p>
            L'utilisateur est seul responsable de la confidentialité de ses identifiants. En cas de suspicion de compromission, il lui appartient d'en informer immédiatement Orvelan à l'adresse <a href="mailto:contact@orvelan.fr">contact@orvelan.fr</a>.
          </p>

          <h2 className="text-2xl mt-12 mb-6 border-b border-primary-silver/20 pb-4">5. Limitation de responsabilité</h2>
          <p>
            Orvelan s'efforce de maintenir le site accessible et les informations exactes, sans pouvoir le garantir en permanence. Les informations publiées ont valeur indicative et ne sauraient constituer un conseil juridique, fiscal ou financier.
          </p>
          <p>
            Orvelan ne saurait être tenu responsable de dommages directs ou indirects résultant de l'utilisation du site, d'une interruption de service ou d'une intrusion extérieure.
          </p>

          <h2 className="text-2xl mt-12 mb-6 border-b border-primary-silver/20 pb-4">6. Droit applicable</h2>
          <p>
            Les présentes mentions légales sont soumises au droit français. Tout litige relèvera de la compétence exclusive des tribunaux du ressort d'Aix-en-Provence.
          </p>

        </div>
      </main>

      <Footer lang="fr" />
    </div>
  );
}
