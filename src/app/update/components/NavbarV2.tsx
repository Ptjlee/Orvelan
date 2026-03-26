"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { contentV2 } from "@/data/contentV2";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function NavbarV2({
  lang,
  setLang,
}: {
  lang: "fr" | "en";
  setLang: (l: "fr" | "en") => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = contentV2[lang].nav;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    // Run immediately so the navbar has the right state on first paint
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    // Also run after a short delay to catch anchor-scroll which happens
    // asynchronously after the component mounts
    const timer = setTimeout(handleScroll, 150);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const links = [
    { name: t.besoins, href: `/update?lang=${lang}#besoins` },
    { name: t.solutions, href: `/update?lang=${lang}#solutions` },
    { name: lang === "fr" ? "Qui sommes-nous" : "Who we are", href: `/update?lang=${lang}#about` },
    { name: t.contact, href: `/update?lang=${lang}#contact` },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm py-4"
          : "bg-transparent py-7"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <a
          href={`/update?lang=${lang}`}
          className="font-serif text-2xl tracking-tighter text-primary-midnight leading-none"
        >
          Orvelan.
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-7">
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

          <div className="flex items-center gap-5 pl-8 border-l border-primary-silver/30">
            {/* Lang toggle */}
            <div className="flex gap-2.5 text-sm font-medium">
              <button
                onClick={() => setLang("fr")}
                className={`transition-colors ${
                  lang === "fr"
                    ? "text-primary-midnight underline underline-offset-4 decoration-primary-copper"
                    : "text-primary-silver hover:text-primary-charcoal"
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setLang("en")}
                className={`transition-colors ${
                  lang === "en"
                    ? "text-primary-midnight underline underline-offset-4 decoration-primary-copper"
                    : "text-primary-silver hover:text-primary-charcoal"
                }`}
              >
                EN
              </button>
            </div>

            {/* CTA */}
            <a
              href={`/update/auto-diagnostic?lang=${lang}`}
              className="bg-primary-copper text-white px-5 py-2.5 text-sm font-medium hover:bg-primary-midnight transition-colors rounded-sm whitespace-nowrap"
            >
              {t.diagnostic}
            </a>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-primary-midnight"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
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
              <button
                onClick={() => { setLang("fr"); setIsOpen(false); }}
                className={`text-base font-serif ${lang === "fr" ? "text-primary-copper" : "text-primary-silver"}`}
              >
                Français
              </button>
              <button
                onClick={() => { setLang("en"); setIsOpen(false); }}
                className={`text-base font-serif ${lang === "en" ? "text-primary-copper" : "text-primary-silver"}`}
              >
                English
              </button>
            </div>
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-xl font-serif text-primary-midnight"
              >
                {link.name}
              </a>
            ))}
            <a
              href={`/update/auto-diagnostic?lang=${lang}`}
              onClick={() => setIsOpen(false)}
              className="bg-primary-copper text-white w-full py-4 text-center mt-2 rounded-sm text-sm font-medium"
            >
              {t.diagnostic}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
