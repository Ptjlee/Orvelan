"use client";

import { content } from "@/data/content";
import { motion } from "framer-motion";

export function About({ lang }: { lang: "fr" | "en" }) {
  const t = content[lang].about;
  const detailsHref = `${t.detailsHref}?lang=${lang}`;

  return (
    <section id="about" className="py-32 bg-[#F5F1EB] relative overflow-hidden border-t border-primary-silver/20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-20">
        <div className="md:w-1/3 border-t border-primary-silver/30 pt-8">
          <span className="text-primary-copper uppercase tracking-[0.2em] font-medium text-sm">
            {t.label}
          </span>
        </div>

        <div className="md:w-2/3 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif text-primary-midnight mb-8 leading-[1.1]">
              {t.title}
            </h2>
            <p className="text-primary-charcoal font-light leading-relaxed text-lg mb-12">
              {t.teaser}
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={detailsHref}
                className="border border-primary-midnight text-primary-midnight px-7 py-3.5 text-sm font-medium hover:border-primary-copper hover:text-primary-copper transition-colors rounded-sm"
              >
                {t.ctaDetails}
              </a>
              <a
                href="#contact"
                className="bg-primary-copper text-white px-7 py-3.5 text-sm font-medium hover:bg-primary-midnight transition-colors rounded-sm"
              >
                {t.ctaContact}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
