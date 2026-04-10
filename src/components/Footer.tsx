"use client";

import { content } from "@/data/content";

export function Footer({ lang }: { lang: "fr" | "en" }) {
  const t = content[lang].footer;
  const nav = content[lang].nav;

  return (
    <footer className="bg-white py-24 border-t border-primary-silver/20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between pb-24 border-b border-primary-silver/20 mb-8">
        <div className="max-w-md">
          <h2 className="font-serif text-[4rem] text-primary-midnight mb-6 leading-none">
            Orvelan.
          </h2>
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary-copper mb-8">
            {lang === "fr"
              ? "Lisibilité — Maîtrise — Sérénité"
              : "Clarity — Control — Confidence"}
          </p>
          <p className="text-primary-charcoal/70 font-light text-lg">{t.tagline}</p>
        </div>

        <div className="flex gap-20 mt-16 md:mt-0">
          <div className="flex flex-col gap-4 font-light text-primary-charcoal">
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-primary-midnight mb-2 border-b border-primary-silver/20 pb-2">
              Menu
            </span>
            <a href="#besoins" className="hover:text-primary-copper transition-colors">
              {nav.besoins}
            </a>
            <a href="#solutions" className="hover:text-primary-copper transition-colors">
              {nav.solutions}
            </a>
            <a href="#about" className="hover:text-primary-copper transition-colors">
              {lang === "fr" ? "Qui sommes-nous" : "Who we are"}
            </a>
            <a href="#contact" className="hover:text-primary-copper transition-colors">
              {nav.contact}
            </a>
          </div>

          {/* Email only — address and phone removed per David's request */}
          <div className="flex flex-col gap-4 font-light text-primary-charcoal">
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-primary-midnight mb-2 border-b border-primary-silver/20 pb-2">
              Contact
            </span>
            <a
              href={`mailto:${t.email}`}
              className="hover:text-primary-copper transition-colors"
            >
              {t.email}
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between text-xs text-primary-silver/80 uppercase tracking-widest font-medium">
        <p>© {new Date().getFullYear()} SASU Orvelan</p>
        <div className="flex gap-4 md:gap-6 mt-4 md:mt-0 flex-wrap">
          <a href="/legal/politique-confidentialite" className="hover:text-primary-copper transition-colors">
            {t.legal1}
          </a>
          <a href="/legal/mentions-legales" className="hover:text-primary-copper transition-colors">
            {t.legal2}
          </a>
          <a href="/legal/cgu" className="hover:text-primary-copper transition-colors">
            {lang === 'fr' ? "CGU" : "Terms"}
          </a>
        </div>
      </div>
    </footer>
  );
}
