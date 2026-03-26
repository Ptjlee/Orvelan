"use client";

import { contentV2 } from "@/data/contentV2";
import { motion } from "framer-motion";

export function SolutionsV2({ lang }: { lang: "fr" | "en" }) {
  const t = contentV2[lang].solutions;

  return (
    <section id="solutions" className="py-32 bg-[#FAFAFA] border-t border-primary-silver/20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-6 border-b border-primary-silver/20 pb-10">
          <p className="text-primary-copper font-medium tracking-[0.2em] uppercase text-xs mb-5">
            {t.label}
          </p>
          <h2 className="text-5xl md:text-6xl font-serif text-primary-midnight leading-none tracking-tight mb-6">
            {t.title}
          </h2>
          <p className="max-w-xl text-primary-charcoal font-light leading-relaxed text-sm">
            {t.intro}
          </p>
        </div>

        {/* 6 cards — compact grid, all visible on one screen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {t.items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative flex flex-col bg-white border border-primary-silver/20 p-7 hover:border-primary-copper/40 transition-colors rounded-sm"
            >
              {/* Number */}
              <span className="text-[2.5rem] font-serif text-primary-ivory/60 leading-none mb-3 group-hover:text-primary-copper/30 transition-colors">
                0{index + 1}
              </span>

              <h3 className="text-xl font-serif text-primary-midnight mb-3 border-l-2 border-transparent group-hover:border-primary-copper group-hover:pl-3 transition-all duration-300">
                {item.title}
              </h3>

              {/* Situation quote if exists */}
              {item.situation && (
                <p className="text-primary-charcoal/60 italic text-sm mb-3 font-light">
                  {item.situation}
                </p>
              )}

              <p className="text-primary-copper text-xs uppercase tracking-widest font-medium mb-1.5">
                {lang === "fr" ? "Quand :" : "When:"}
              </p>
              <p className="text-primary-charcoal font-light text-sm leading-relaxed mb-4">
                {item.when}
              </p>

              <p className="text-primary-copper text-xs uppercase tracking-widest font-medium mb-1.5">
                {lang === "fr" ? "Ce que vous obtenez :" : "What you get:"}
              </p>
              <p className="text-primary-charcoal font-light text-sm leading-relaxed mb-6 flex-grow">
                {item.what}
              </p>

              <a
                href="#contact"
                className="mt-auto inline-flex items-center gap-2 text-xs tracking-widest uppercase font-medium text-primary-midnight hover:text-primary-copper transition-colors"
              >
                <span className="w-6 h-6 rounded-full border border-primary-silver flex items-center justify-center group-hover:border-primary-copper transition-colors text-xs">
                  +
                </span>
                {item.cta}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Diagnostic intro callout — below the cards */}
        <div className="border-l-2 border-primary-copper pl-6 mt-16 max-w-2xl">
          <p className="text-primary-charcoal font-light leading-relaxed italic">
            {t.diagIntro}
          </p>
        </div>

        {/* Principle note */}
        <div className="mt-10 border-t border-primary-silver/20 pt-10 max-w-2xl">
          <p className="text-primary-charcoal/70 font-light text-sm leading-relaxed italic">
            {t.principle}
          </p>
        </div>
      </div>
    </section>
  );
}
