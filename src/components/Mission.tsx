"use client";

import { content } from "@/data/content";
import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export function Mission({ lang }: { lang: "fr" | "en" }) {
  const t = content[lang].mission;
  const [openValue, setOpenValue] = useState<number | null>(null);

  return (
    <section id="mission" className="bg-white">
      {/* ── INTRO BLOCK ─────────────────────────────────────── */}
      <div className="py-32 max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row gap-16 mb-20 items-start">
          <div className="md:w-1/3 pt-2">
            <span className="text-primary-copper font-medium tracking-[0.2em] uppercase text-xs">
              {t.label}
            </span>
          </div>
          <div className="md:w-2/3 max-w-3xl">
            <p className="text-sm font-medium text-primary-midnight uppercase tracking-[0.15em] mb-6">
              {t.double}
            </p>
            <p className="text-primary-charcoal font-light leading-relaxed text-lg mb-6">
              {t.p1}
            </p>
            <p className="text-primary-charcoal font-light leading-relaxed text-lg">
              {t.p2}
            </p>
          </div>
        </div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="border-l-2 border-primary-copper pl-8 my-16 max-w-3xl mx-auto md:ml-[33.33%]"
        >
          <p className="text-2xl md:text-3xl font-serif text-primary-midnight leading-relaxed italic">
            "{t.quote}"
          </p>
        </motion.div>

        {/* Analogy */}
        <div className="max-w-3xl md:ml-[33.33%]">
          <p className="text-primary-charcoal font-light leading-relaxed text-lg">
            {t.analogy}
          </p>
        </div>
      </div>

      {/* ── 3 PILLARS ───────────────────────────────────────── */}
      <div className="bg-[#F5F1EB] py-24 relative overflow-hidden border-t border-primary-silver/20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <p className="text-primary-copper font-medium tracking-[0.2em] uppercase text-xs mb-16">
            {t.pillarsLabel}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            {t.pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="border-t border-primary-silver/30 pt-8"
              >
                <h3 className="font-serif text-3xl text-primary-midnight mb-4">
                  {pillar.title}
                </h3>
                <p className="text-primary-charcoal font-light leading-relaxed">
                  {pillar.desc}
                </p>
              </motion.div>
            ))}
          </div>
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary-copper/70">
            {t.pillarsCta}
          </p>
        </div>
      </div>

      {/* ── SOLIDITÉ + CTAs ──────────────────────────────────── */}
      <div className="py-24 max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-2xl md:text-3xl font-serif text-primary-midnight leading-relaxed max-w-3xl mb-14"
        >
          {t.solidite}
        </motion.p>
        <div className="flex flex-wrap gap-4">
          <a
            href="#contact"
            className="bg-primary-midnight text-white px-7 py-3.5 text-sm font-medium hover:bg-primary-copper transition-colors rounded-sm"
          >
            {t.ctaContact}
          </a>
          <a
            href="#solutions"
            className="border border-primary-midnight text-primary-midnight px-7 py-3.5 text-sm font-medium hover:border-primary-copper hover:text-primary-copper transition-colors rounded-sm"
          >
            {t.ctaSolutions}
          </a>
        </div>
      </div>

      {/* ── VALUES (dropdowns) ───────────────────────────────── */}
      <div className="py-24 bg-[#FAFAFA] border-t border-primary-silver/20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <p className="text-primary-copper font-medium tracking-[0.2em] uppercase text-xs mb-16">
            {t.valuesLabel}
          </p>
          <div className="divide-y divide-primary-silver/20">
            {t.values.map((val, i) => (
              <div key={i} className="py-8">
                <button
                  onClick={() => setOpenValue(openValue === i ? null : i)}
                  className="w-full flex justify-between items-center text-left group"
                >
                  <h3 className="text-xl md:text-2xl font-serif text-primary-midnight group-hover:text-primary-copper transition-colors pr-8">
                    {val.title}
                  </h3>
                  <span className="flex-shrink-0 w-8 h-8 rounded-full border border-primary-silver/40 flex items-center justify-center group-hover:border-primary-copper transition-colors">
                    {openValue === i ? (
                      <Minus className="w-4 h-4 text-primary-copper" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openValue === i ? "auto" : 0, opacity: openValue === i ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="pt-6 text-primary-charcoal font-light leading-relaxed max-w-2xl">
                    {val.desc}
                  </p>
                </motion.div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 mt-16">
            <a
              href="#contact"
              className="bg-primary-midnight text-white px-7 py-3.5 text-sm font-medium hover:bg-primary-copper transition-colors rounded-sm"
            >
              {t.ctaContact}
            </a>
            <a
              href="#solutions"
              className="border border-primary-midnight text-primary-midnight px-7 py-3.5 text-sm font-medium hover:border-primary-copper hover:text-primary-copper transition-colors rounded-sm"
            >
              {t.ctaSolutions}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
