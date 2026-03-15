import type { Metadata } from "next";
import { EB_Garamond, Inter } from "next/font/google";
import "./globals.css";
import React from "react";

const garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Orvelan | Conseil Stratégique pour Dirigeants",
  description: "Orvelan aide les dirigeants de PME et ETI à voir clairement leur entreprise.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${garamond.variable} ${inter.variable}`}>
      <body className="antialiased bg-white text-primary-midnight selection:bg-primary-copper selection:text-white">
        {children}
      </body>
    </html>
  );
}
