"use client";

import { contentV2 } from "@/data/contentV2";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export function BesoinsV2({ lang }: { lang: "fr" | "en" }) {
  const t = contentV2[lang].besoins;
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="besoins" className="py-32 bg-white border-t border-primary-silver/20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-16 mb-20 items-end justify-between border-b border-primary-silver/20 pb-12">
          <div>
            <p className="text-primary-copper font-medium tracking-[0.2em] uppercase text-xs mb-6">
              {t.label}
            </p>
            <h2 className="text-5xl md:text-7xl font-serif text-primary-midnight leading-none tracking-tight">
              {t.title}
              <br />
              <span className="italic text-primary-charcoal">{t.titleItalic}</span>
            </h2>
          </div>
        </div>

        {/* Accordion items */}
        <div className="divide-y divide-primary-silver/20 mb-20">
          {t.items.map((item, i) => (
            <div key={i} className="py-10">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex justify-between items-center text-left group"
              >
                <h3 className="text-2xl md:text-3xl font-serif text-primary-midnight group-hover:text-primary-copper transition-colors pr-8">
                  {item.title}
                </h3>
                <span className="flex-shrink-0 w-10 h-10 rounded-full border border-primary-silver/40 flex items-center justify-center group-hover:border-primary-copper transition-colors">
                  {open === i ? (
                    <Minus className="w-4 h-4 text-primary-copper" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pt-8 pb-4 max-w-3xl">
                      {item.desc.split("\n\n").map((para, idx) => (
                        <p
                          key={idx}
                          className="text-primary-charcoal font-light leading-relaxed mb-4 last:mb-0"
                        >
                          {para}
                        </p>
                      ))}
                      <div className="mt-8">
                        <a
                          href={item.ctaHref}
                          className="inline-flex items-center gap-3 text-sm tracking-widest uppercase font-medium text-primary-midnight hover:text-primary-copper transition-colors"
                        >
                          <span className="w-8 h-8 rounded-full border border-primary-silver flex items-center justify-center hover:border-primary-copper transition-colors">
                            +
                          </span>
                          {item.cta}
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Footer CTA — always visible */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-t border-primary-silver/20 pt-12">
          <p className="text-primary-charcoal font-light max-w-lg">
            {t.subtitle}
          </p>
          <a
            href="#solutions"
            className="bg-primary-midnight text-white px-7 py-3.5 text-sm font-medium hover:bg-primary-copper transition-colors rounded-sm whitespace-nowrap"
          >
            {t.ctaSolutions}
          </a>
        </div>
      </div>
    </section>
  );
}
