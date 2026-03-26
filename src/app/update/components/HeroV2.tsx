"use client";

import { contentV2 } from "@/data/contentV2";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function HeroV2({ lang }: { lang: "fr" | "en" }) {
  const t = contentV2[lang].hero;

  return (
    <section className="min-h-screen bg-[#FAFAFA] flex items-end pb-24 relative overflow-hidden">
      {/* Ambient geometric detail */}
      <div className="absolute top-0 right-0 w-1/3 h-screen bg-primary-ivory/20 -z-10" />
      {/* Subtle copper accent line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-primary-silver/20" />

      <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 mt-32 md:mt-0 flex flex-col md:flex-row justify-between items-end gap-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[1px] bg-primary-copper" />
            <span className="text-primary-copper font-medium tracking-[0.2em] uppercase text-xs">
              {t.subtitle}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-serif text-primary-midnight leading-[1.05] tracking-tight mb-12">
            {t.title}
            <br />
            <span className="italic text-primary-charcoal">{t.titleItalic}</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-md md:pb-4 border-l border-primary-silver/30 pl-8"
        >
          <p className="text-lg text-primary-charcoal mb-10 font-light leading-relaxed">
            {contentV2[lang].mission.intro}
          </p>
          <a
            href="#mission"
            className="group inline-flex items-center gap-4 text-primary-midnight font-medium hover:text-primary-copper transition-colors"
          >
            {t.cta}
            <span className="w-10 h-10 rounded-full border border-primary-silver/40 flex items-center justify-center group-hover:border-primary-copper group-hover:-translate-y-1 group-hover:translate-x-1 transition-all">
              <ArrowRight className="w-4 h-4" />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
