"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { content } from "@/data/content";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function DavidContent() {
  const searchParams = useSearchParams();
  const urlLang = searchParams.get("lang");
  const [lang, setLang] = useState<"fr" | "en">(
    urlLang === "en" ? "en" : "fr"
  );

  // Sync when URL param changes
  useEffect(() => {
    if (urlLang === "en" || urlLang === "fr") setLang(urlLang);
  }, [urlLang]);

  const t = content[lang].david;

  return (
    <main className="min-h-screen bg-[#F5F1EB] flex flex-col">
      <Navbar lang={lang} setLang={setLang} alwaysCompact={true} />

      {/* Spacer */}
      <div className="h-24 md:h-32" />

      <section className="flex-1 py-12 md:py-20 relative">
        <div className="max-w-[1000px] mx-auto px-6 md:px-12">
          <Link
            href={`/?lang=${lang}`}
            className="inline-flex items-center gap-2 text-primary-silver hover:text-primary-copper transition-colors font-medium text-sm mb-12"
          >
            <ArrowLeft size={16} />
            {lang === "fr" ? "Retour à l'accueil" : "Back to home"}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary-copper uppercase tracking-[0.2em] font-medium text-sm block mb-4">
              {t.label}
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-primary-midnight mb-4">
              {t.name}
            </h1>
            <p className="text-xl md:text-2xl font-light text-primary-charcoal mb-12">
              {t.role}
            </p>

            <div className="space-y-6 text-lg text-primary-charcoal font-light leading-relaxed max-w-3xl mb-16">
              {t.bio.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="border-t border-primary-silver/20 pt-8 mt-12 mb-16">
              <p className="text-primary-charcoal font-medium">
                {t.diploma}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href={`/?lang=${lang}#contact`}
                className="bg-primary-copper text-white px-7 py-3.5 text-sm font-medium hover:bg-primary-midnight transition-colors rounded-sm"
              >
                {t.ctaContact}
              </Link>
              <Link
                href={`/?lang=${lang}#solutions`}
                className="border border-primary-midnight text-primary-midnight px-7 py-3.5 text-sm font-medium hover:border-primary-copper hover:text-primary-copper transition-colors rounded-sm"
              >
                {t.ctaSolutions}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer lang={lang} />
    </main>
  );
}

export default function DavidPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F1EB]" />}>
      <DavidContent />
    </Suspense>
  );
}
