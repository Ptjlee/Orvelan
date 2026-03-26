"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { contentV2 } from "@/data/contentV2";
import { NavbarV2 } from "../components/NavbarV2";
import { FooterV2 } from "../components/FooterV2";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, CheckCircle2 } from "lucide-react";

function AutoDiagnosticContent() {
  const searchParams = useSearchParams();
  const urlLang = searchParams.get("lang");
  const [lang, setLang] = useState<"fr" | "en">(
    urlLang === "en" ? "en" : "fr"
  );

  // Sync if param changes
  useEffect(() => {
    if (urlLang === "en" || urlLang === "fr") setLang(urlLang);
  }, [urlLang]);
  const t = contentV2[lang].diagnostic;

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Simulated registration — backend to be built later
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-white">
      <NavbarV2 lang={lang} setLang={setLang} alwaysCompact />
      <div className="h-20" />

      {/* Page header */}
      <section className="bg-[#FAFAFA] pt-24 pb-20 border-b border-primary-silver/20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[1px] bg-primary-copper" />
            <span className="text-primary-copper font-medium tracking-[0.2em] uppercase text-xs">
              {t.label}
            </span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl text-primary-midnight leading-none tracking-tight mb-6">
            {t.title}
          </h1>
          <p className="text-primary-charcoal/60 font-light text-lg">{t.subtitle}</p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-24">
          {/* Left — explanation */}
          <div className="lg:w-5/12">
            <p className="text-primary-charcoal font-light leading-relaxed text-lg mb-10">
              {t.intro}
            </p>

            {/* Detail bullet */}
            <div className="border-l-2 border-primary-copper pl-6 mb-12">
              <p className="text-primary-charcoal/70 font-light italic leading-relaxed">
                {t.detail}
              </p>
            </div>

            {/* Trust signals */}
            <div className="space-y-5">
              {[
                { icon: ShieldCheck, text: lang === "fr" ? "Confidentiel et sécurisé" : "Confidential & secure" },
                { icon: Lock, text: lang === "fr" ? "Vos données ne sont jamais partagées" : "Your data is never shared" },
                { icon: CheckCircle2, text: lang === "fr" ? "Résultats disponibles après validation par Orvelan" : "Results available after Orvelan review" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-4 text-primary-charcoal/70 font-light">
                  <Icon className="w-4 h-4 text-primary-copper flex-shrink-0" />
                  <span className="text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — registration form */}
          <div className="lg:w-7/12">
            {!submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-serif text-4xl text-primary-midnight mb-2">
                  {t.registerTitle}
                </h2>
                <p className="text-primary-charcoal/60 font-light mb-12">
                  {t.registerDesc}
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-9">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder={t.namePlaceholder}
                    className="w-full bg-transparent border-b border-primary-silver/40 py-4 text-xl font-light text-primary-midnight focus:border-primary-midnight outline-none transition-colors placeholder:text-primary-silver/60"
                  />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder={t.emailPlaceholder}
                    className="w-full bg-transparent border-b border-primary-silver/40 py-4 text-xl font-light text-primary-midnight focus:border-primary-midnight outline-none transition-colors placeholder:text-primary-silver/60"
                  />
                  <div className="flex flex-col md:flex-row gap-8">
                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      required
                      placeholder={t.companyPlaceholder}
                      className="w-full bg-transparent border-b border-primary-silver/40 py-4 text-xl font-light text-primary-midnight focus:border-primary-midnight outline-none transition-colors placeholder:text-primary-silver/60"
                    />
                    <input
                      type="text"
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      required
                      placeholder={t.rolePlaceholder}
                      className="w-full bg-transparent border-b border-primary-silver/40 py-4 text-xl font-light text-primary-midnight focus:border-primary-midnight outline-none transition-colors placeholder:text-primary-silver/60"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`bg-primary-copper text-white px-8 py-4 text-sm font-medium hover:bg-primary-midnight transition-colors rounded-sm min-w-[200px] ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      {loading
                        ? (lang === "fr" ? "Création…" : "Creating…")
                        : t.btnRegister}
                    </button>
                    <p className="text-sm text-primary-charcoal/50 font-light">
                      {t.loginPrompt}{" "}
                      <a
                        href="#"
                        className="text-primary-midnight hover:text-primary-copper underline underline-offset-4 decoration-primary-copper/40 transition-colors"
                      >
                        {t.loginLink}
                      </a>
                    </p>
                  </div>

                  <p className="text-xs text-primary-silver/70 font-light mt-2">
                    {t.privacy}
                  </p>
                </form>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col justify-center border-l-2 border-primary-copper pl-10 py-6"
              >
                <CheckCircle2 className="w-10 h-10 text-primary-copper mb-8" />
                <h3 className="text-5xl font-serif text-primary-midnight mb-6">
                  {lang === "fr" ? "Merci." : "Thank you."}
                </h3>
                <p className="text-xl font-light text-primary-charcoal/80 leading-relaxed max-w-md">
                  {lang === "fr"
                    ? "Votre accès est en cours de création. Vous recevrez un email de confirmation sous peu pour vérifier votre adresse et accéder à votre auto-diagnostic."
                    : "Your access is being created. You will receive a confirmation email shortly to verify your address and access your self-assessment."}
                </p>
                <a
                  href="/update"
                  className="mt-10 inline-flex items-center gap-3 text-sm tracking-widest uppercase font-medium text-primary-midnight hover:text-primary-copper transition-colors"
                >
                  ← {lang === "fr" ? "Retour à l'accueil" : "Back to home"}
                </a>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <FooterV2 lang={lang} />
    </main>
  );
}

export default function AutoDiagnosticPage() {
  return (
    <Suspense fallback={null}>
      <AutoDiagnosticContent />
    </Suspense>
  );
}
