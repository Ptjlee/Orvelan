"use client";

import { useState, useEffect } from "react";
import { content } from "@/data/content";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar({ lang, setLang }: { lang: "fr" | "en", setLang: (l: "fr" | "en") => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = content[lang].nav;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: t.approach, href: "/#about" },
    { name: t.offers, href: "/#services" },
    { name: t.contact, href: "/#contact" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm py-4' : 'bg-transparent py-8'}`}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
        <a href="/" className="font-serif text-2xl tracking-tighter text-primary-midnight leading-none">
          Orvelan.
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex gap-8">
            {links.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-primary-charcoal hover:text-primary-copper transition-colors text-sm font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>
          
          <div className="flex items-center gap-6 pl-10 border-l border-primary-silver/30">
            <div className="flex gap-3 text-sm font-medium">
              <button 
                onClick={() => setLang('fr')} 
                className={`transition-colors ${lang === 'fr' ? 'text-primary-midnight underline underline-offset-4 decoration-primary-copper' : 'text-primary-silver hover:text-primary-charcoal'}`}
              >
                FR
              </button>
              <button 
                onClick={() => setLang('en')} 
                className={`transition-colors ${lang === 'en' ? 'text-primary-midnight underline underline-offset-4 decoration-primary-copper' : 'text-primary-silver hover:text-primary-charcoal'}`}
              >
                EN
              </button>
            </div>
            <a href="/diagnostic" className="bg-primary-midnight text-white px-5 py-2.5 text-sm font-medium hover:bg-primary-copper transition-colors rounded-sm">
              {t.diagnostic}
            </a>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-primary-midnight" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl flex flex-col p-6 gap-6 md:hidden border-t border-primary-silver/10"
          >
            <div className="flex gap-4 border-b border-primary-silver/20 pb-4">
              <button onClick={() => { setLang('fr'); setIsOpen(false); }} className={`text-lg font-serif ${lang === 'fr' ? 'text-primary-copper' : 'text-primary-silver'}`}>Français</button>
              <button onClick={() => { setLang('en'); setIsOpen(false); }} className={`text-lg font-serif ${lang === 'en' ? 'text-primary-copper' : 'text-primary-silver'}`}>English</button>
            </div>
            {links.map((link) => (
              <a key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-2xl font-serif text-primary-midnight">
                {link.name}
              </a>
            ))}
            <a href="/diagnostic" onClick={() => setIsOpen(false)} className="bg-primary-midnight text-white w-full py-4 text-center mt-4 rounded-sm">
              {t.diagnostic}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
