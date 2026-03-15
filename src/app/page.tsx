"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Offers } from "@/components/Offers";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  const [lang, setLang] = useState<"fr" | "en">("fr");

  return (
    <main className="min-h-screen bg-white">
      <Navbar lang={lang} setLang={setLang} />
      
      {/* Spacer for fixed navbar */}
      <div className="h-20" />
      
      <Hero lang={lang} />
      <Offers lang={lang} />
      <About lang={lang} />
      <Contact lang={lang} />
      <Footer lang={lang} />
    </main>
  );
}
