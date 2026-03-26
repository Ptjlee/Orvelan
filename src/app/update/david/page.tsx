"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { contentV2 } from "@/data/contentV2";
import { NavbarV2 } from "../components/NavbarV2";
import { FooterV2 } from "../components/FooterV2";
import { motion } from "framer-motion";

function DavidContent() {
  const searchParams = useSearchParams();
  const urlLang = searchParams.get("lang");
  const [lang, setLang] = useState<"fr" | "en">(
    urlLang === "en" ? "en" : "fr"
  );

  useEffect(() => {
    if (urlLang === "en" || urlLang === "fr") setLang(urlLang);
  }, [urlLang]);

  const t = contentV2[lang].david;

  return (
    <main className="min-h-screen bg-white">
      <NavbarV2 lang={lang} setLang={setLang} alwaysCompact />
      <div className="h-20" />

      {/* Hero strip */}
      <section className="bg-[#FAFAFA] pt-24 pb-16 border-b border-primary-silver/20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <p className="text-primary-copper font-medium tracking-[0.2em] uppercase text-xs mb-4">
            {t.label}
          </p>
          <h1 className="font-serif text-5xl md:text-7xl text-primary-midnight leading-none tracking-tight">
            {t.name}
          </h1>
          <p className="text-primary-charcoal/60 font-light mt-3 text-lg">{t.role}</p>
        </div>
      </section>

      {/* Bio content */}
      <section className="py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-20">
          {/* Sticky sidebar */}
          <div className="md:w-1/3 md:sticky md:top-32 md:self-start">
            <div className="border-l-2 border-primary-copper pl-6">
              <p className="text-primary-charcoal font-light leading-relaxed italic text-lg">
                {contentV2[lang].about.teaser}
              </p>
            </div>
          </div>

          {/* Main bio paragraphs */}
          <div className="md:w-2/3 space-y-8">
            {t.bio.map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="text-primary-charcoal font-light leading-relaxed text-lg"
              >
                {para}
              </motion.p>
            ))}

            {/* Diploma */}
            <div className="border-t border-primary-silver/20 pt-8 mt-12">
              <p className="text-sm text-primary-charcoal/60 font-light italic">
                {t.diploma}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-6">
              <a
                href="/update#contact"
                className="bg-primary-midnight text-white px-7 py-3.5 text-sm font-medium hover:bg-primary-copper transition-colors rounded-sm"
              >
                {t.ctaContact}
              </a>
              <a
                href="/update#solutions"
                className="border border-primary-midnight text-primary-midnight px-7 py-3.5 text-sm font-medium hover:border-primary-copper hover:text-primary-copper transition-colors rounded-sm"
              >
                {t.ctaSolutions}
              </a>
            </div>
          </div>
        </div>
      </section>

      <FooterV2 lang={lang} />
    </main>
  );
}

export default function DavidPage() {
  return (
    <Suspense fallback={null}>
      <DavidContent />
    </Suspense>
  );
}
