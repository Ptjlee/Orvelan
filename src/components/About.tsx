"use client";

import { motion } from "framer-motion";

export function About({ lang }: { lang: "fr" | "en" }) {

  return (
    <section id="about" className="py-40 bg-primary-midnight text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
           
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-20">
        <div className="md:w-1/3 border-t border-primary-silver/20 pt-8">
          <span className="text-primary-copper uppercase tracking-[0.2em] font-medium text-sm">
             {lang === 'fr' ? 'L\'Approche' : 'The Approach'}
          </span>
        </div>
        
        <div className="md:w-2/3 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.1] mb-12 italic text-primary-ivory">
              {lang === 'fr' 
                ? "« Comme votre expert-comptable pour les chiffres et votre avocat pour les risques, Orvelan vous accompagne pour la clarté décisionnelle. »"
                : "« Just as your accountant covers the numbers and your lawyer covers legal risks, Orvelan accompanies you on decision-making clarity. »"}
            </h2>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
