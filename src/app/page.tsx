"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Mission } from "../components/Mission";
import { Besoins } from "../components/Besoins";
import { Solutions } from "../components/Solutions";
import { About } from "../components/About";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";

function HomeContent() {
  const searchParams = useSearchParams();
  const urlLang = searchParams.get("lang");
  const [lang, setLang] = useState<"fr" | "en">(
    urlLang === "en" ? "en" : "fr"
  );

  // Sync when URL param changes (e.g. back-navigation)
  useEffect(() => {
    if (urlLang === "en" || urlLang === "fr") setLang(urlLang);
  }, [urlLang]);

  return (
    <main className="min-h-screen bg-white">
      <Navbar lang={lang} setLang={setLang} />

      {/* Spacer for fixed navbar */}
      <div className="h-20" />

      <Hero lang={lang} />
      <Mission lang={lang} />
      <Besoins lang={lang} />
      <Solutions lang={lang} />
      <About lang={lang} />
      <Contact lang={lang} />
      <Footer lang={lang} />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
