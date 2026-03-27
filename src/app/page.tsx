"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { NavbarV2 } from "./update/components/NavbarV2";
import { HeroV2 } from "./update/components/HeroV2";
import { MissionV2 } from "./update/components/MissionV2";
import { BesoinsV2 } from "./update/components/BesoinsV2";
import { SolutionsV2 } from "./update/components/SolutionsV2";
import { AboutV2 } from "./update/components/AboutV2";
import { ContactV2 } from "./update/components/ContactV2";
import { FooterV2 } from "./update/components/FooterV2";

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
      <NavbarV2 lang={lang} setLang={setLang} />

      {/* Spacer for fixed navbar */}
      <div className="h-20" />

      <HeroV2 lang={lang} />
      <MissionV2 lang={lang} />
      <BesoinsV2 lang={lang} />
      <SolutionsV2 lang={lang} />
      <AboutV2 lang={lang} />
      <ContactV2 lang={lang} />
      <FooterV2 lang={lang} />
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
