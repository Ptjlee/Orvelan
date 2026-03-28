"use client";

import { contentV2 } from "@/data/contentV2";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

export function ContactV2({ lang }: { lang: "fr" | "en" }) {
  const t = contentV2[lang].contact;
  const [submitted, setSubmitted] = useState(false);
  const [mountTime] = useState(Date.now());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Anti-bot: Time-to-fill check (if submitted too fast)
    if (Date.now() - mountTime < 4000) {
      setSubmitted(true);
      return;
    }

    const formData = new FormData(e.currentTarget);
    
    // Anti-bot: Honeypot field check
    if (formData.get("bot-field")) {
      setSubmitted(true);
      return;
    }

    try {
      await fetch(
        "https://docs.google.com/forms/d/e/1FAIpQLSfnk2OJXsarwjjo-ajAtz3JK2Q964aRe6bkW_25nr9VuauTFw/formResponse",
        { method: "POST", mode: "no-cors", body: formData }
      );
      setSubmitted(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section id="contact" className="py-40 bg-[#FAFAFA] border-t border-primary-silver/20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col xl:flex-row gap-24">
        {/* Left */}
        <div className="xl:w-5/12">
          <span className="text-primary-copper font-medium tracking-[0.2em] uppercase text-xs mb-8 block">
            {t.label}
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-primary-midnight mb-12 leading-[1.05] tracking-tight">
            {t.title}
          </h2>

          <div className="border-t border-primary-silver/30 py-8 space-y-4 text-primary-charcoal font-light">
            {t.reassurance.map((item, idx) => (
              <p key={idx} className="flex gap-4">
                <span className="text-primary-copper/50">—</span> {item}
              </p>
            ))}
          </div>

          <div className="border-t border-primary-silver/30 py-8">
            <p className="text-sm uppercase tracking-widest font-medium mb-2">
              {t.directTitle}
            </p>
            <p className="text-sm text-primary-charcoal/60 font-light mb-3">
              {t.directDesc}
            </p>
            <a
              href={`mailto:${t.directEmail}`}
              className="text-base font-serif text-primary-midnight hover:text-primary-copper transition-colors"
            >
              {t.directEmail}
            </a>
          </div>
        </div>

        {/* Right — form (same Google Forms endpoint as current) */}
        <div className="xl:w-7/12">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
              {/* Anti-spam Honeypot Field */}
              <div className="absolute left-[-9999px] top-[-9999px]" aria-hidden="true">
                <label htmlFor="bot-field">Ne pas remplir ce champ / Do not fill this field</label>
                <input type="text" name="bot-field" id="bot-field" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                <input
                  type="text"
                  name="entry.54022395"
                  required
                  placeholder={lang === "fr" ? "Nom complet *" : "Full name *"}
                  className="w-full bg-transparent border-b border-primary-silver/40 py-4 text-base font-light text-primary-midnight focus:border-primary-midnight outline-none transition-colors placeholder:text-primary-silver/60"
                />
                <input
                  type="text"
                  name="entry.2020444487"
                  required
                  placeholder={lang === "fr" ? "Société *" : "Company *"}
                  className="w-full bg-transparent border-b border-primary-silver/40 py-4 text-base font-light text-primary-midnight focus:border-primary-midnight outline-none transition-colors placeholder:text-primary-silver/60"
                />
              </div>

              <input
                type="text"
                name="entry.2147398256"
                required
                placeholder={lang === "fr" ? "Email / Téléphone *" : "Email / Phone *"}
                className="w-full bg-transparent border-b border-primary-silver/40 py-4 text-base font-light text-primary-midnight focus:border-primary-midnight outline-none transition-colors placeholder:text-primary-silver/60"
              />

              <div className="flex flex-col md:flex-row gap-8">
                <select
                  name="entry.1280987535"
                  className="w-full bg-transparent border-b border-primary-silver/40 py-4 text-base font-light text-primary-silver/80 focus:text-primary-midnight focus:border-primary-midnight outline-none transition-colors cursor-pointer appearance-none"
                >
                  <option value="" disabled>
                    {lang === "fr" ? "Taille de la société" : "Company size"}
                  </option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-250">51-250</option>
                  <option value="250+">250+</option>
                </select>
                <select
                  name="entry.1629878505"
                  className="w-full bg-transparent border-b border-primary-silver/40 py-4 text-base font-light text-primary-silver/80 focus:text-primary-midnight focus:border-primary-midnight outline-none transition-colors cursor-pointer appearance-none"
                >
                  <option value="" disabled>
                    {lang === "fr" ? "Urgence" : "Urgency"}
                  </option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <textarea
                name="entry.1831768157"
                rows={1}
                placeholder={
                  lang === "fr"
                    ? "En une phrase, qu'est ce qui vous amène ?"
                    : "In a phrase, what brings you here?"
                }
                className="w-full bg-transparent border-b border-primary-silver/40 py-4 text-base font-light text-primary-midnight focus:border-primary-midnight outline-none transition-colors placeholder:text-primary-silver/60 resize-none overflow-hidden"
              />

              <div className="flex justify-start mt-6">
                <button
                  type="submit"
                  className="group inline-flex items-center gap-4 font-serif text-xl text-primary-midnight hover:text-primary-copper transition-colors"
                >
                  {lang === "fr" ? "Envoyer" : "Submit"}
                  <div className="w-10 h-10 rounded-full border border-primary-silver/40 flex items-center justify-center group-hover:border-primary-copper transition-colors">
                    <ArrowUpRight className="w-5 h-5 font-light" />
                  </div>
                </button>
              </div>
            </form>
          ) : (
            <div className="h-full flex flex-col justify-center border-l border-primary-copper/30 pl-16">
              <h3 className="text-5xl font-serif text-primary-midnight mb-6">
                {lang === "fr" ? "Merci." : "Thank you."}
              </h3>
              <p className="text-2xl font-light text-primary-charcoal mb-12">
                {lang === "fr"
                  ? "Je vous recontacte sous 24 heures."
                  : "I will get back to you within 24 hours."}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
