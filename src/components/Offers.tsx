"use client";

import { content } from "@/data/content";
import { motion } from "framer-motion";

export function Offers({ lang }: { lang: "fr" | "en" }) {
  const t = content[lang].services;

  return (
    <section id="services" className="py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row gap-16 mb-24 items-end justify-between border-b border-primary-silver/20 pb-10">
          <h2 className="text-5xl md:text-7xl font-serif text-primary-midnight leading-none tracking-tight">
            {t.title}
          </h2>
          <p className="max-w-md text-primary-charcoal font-light leading-relaxed">
            {lang === 'fr' 
              ? 'Des interventions ciblées pour rétablir la lisibilité et l\'efficacité organisationnelle.' 
              : 'Targeted interventions to restore clarity and organizational effectiveness.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {t.items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative flex flex-col"
            >
              <div className="text-[5rem] font-serif text-primary-ivory/50 leading-none mb-4 group-hover:text-primary-copper transition-colors delay-75 duration-500">
                0{index + 1}
              </div>
              <h3 className="text-3xl font-serif text-primary-midnight mb-6 border-l-2 border-transparent group-hover:border-primary-copper pl-0 group-hover:pl-4 transition-all duration-300">
                {item.title}
              </h3>
              <p className="text-primary-copper text-sm uppercase tracking-widest font-medium mb-4">
                {lang === 'fr' ? 'Quand :' : 'When:'}
              </p>
              <p className="text-primary-charcoal italic leading-relaxed mb-6 font-light">
                {item.when}
              </p>
              <p className="text-primary-copper text-sm uppercase tracking-widest font-medium mb-4">
                {lang === 'fr' ? 'Ce que vous obtenez :' : 'What you get:'}
              </p>
              <p className="text-primary-charcoal leading-relaxed mb-10 font-light flex-grow">
                {item.what}
              </p>
              
              <a href="#contact" className="mt-auto inline-flex items-center gap-3 text-sm tracking-widest uppercase font-medium text-primary-midnight hover:text-primary-copper transition-colors">
                <span className="w-8 h-8 rounded-full border border-primary-silver flex items-center justify-center group-hover:border-primary-copper transition-colors">
                  +
                </span>
                {item.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
