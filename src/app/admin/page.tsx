"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Lock, FileText, Activity } from "lucide-react";
import ReactMarkdown from "react-markdown";

const MarkdownRenderer = ({ content }: { content: string }) => (
  <ReactMarkdown
    components={{
      strong: ({node, ...props}) => <span className="font-semibold text-primary-midnight" {...props} />,
      ol: ({node, ...props}) => <ol className="list-decimal pl-5 space-y-2 mb-4" {...props} />,
      ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 mb-4" {...props} />,
      li: ({node, ...props}) => <li className="text-primary-charcoal" {...props} />,
      p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
      h1: ({node, ...props}) => <h1 className="text-2xl font-serif text-primary-midnight mb-4 mt-6" {...props} />,
      h2: ({node, ...props}) => <h2 className="text-xl font-serif text-primary-midnight mb-3 mt-5" {...props} />,
      h3: ({node, ...props}) => <h3 className="text-lg font-serif text-primary-midnight mb-2 mt-4" {...props} />,
    }}
  >
    {content}
  </ReactMarkdown>
);

const safeParseText = (text: string, lang: 'fr'|'en') => {
  if (!text) return "";
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === 'object' && ('fr' in parsed || 'en' in parsed)) {
      return parsed[lang] || parsed.fr || parsed.en || "";
    }
    return text;
  } catch {
    return text;
  }
};

export default function AdminPage() {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [diagnostics, setDiagnostics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);

  // Hardcoded for beta MVP. Replace with NextAuth/Supabase Auth later.
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "orvelan2026";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchDiagnostics();
    } else {
      alert(lang === 'fr' ? "Mot de passe incorrect" : "Incorrect password");
    }
  };

  const fetchDiagnostics = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/diagnostics");
      const result = await response.json();
      
      if (result.success) {
        const formattedData = result.data.map((d: any) => ({
          ...d,
          id: d._id,
          raw_data: d.raw_data ? JSON.parse(d.raw_data) : {}
        }));
        setDiagnostics(formattedData || []);
      } else {
        console.error("Failed API fetch", result.error);
        alert(lang === 'fr' ? "Erreur de connexion Sanity" : "Sanity connection error");
      }
    } catch (err) {
      console.error("Error fetching diagnostics:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!selectedEntry) return;
    setRegenerating(true);
    try {
      const response = await fetch("/api/admin/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedEntry.id })
      });
      const result = await response.json();
      
      if (result.success) {
        alert(lang === 'fr' ? "Rapport d'analyse regénéré avec succès!" : "Analysis report successfully regenerated!");
        fetchDiagnostics(); // refresh list
      } else {
        alert((lang === 'fr' ? "Erreur: " : "Error: ") + result.error);
      }
    } catch (err) {
      console.error(err);
      alert(lang === 'fr' ? "Erreur lors de la regénération." : "Error during regeneration.");
    } finally {
      setRegenerating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="bg-white p-12 rounded-sm shadow-sm border border-primary-silver/20 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-primary-midnight text-white flex items-center justify-center rounded-full mx-auto mb-8">
            <Lock size={24} />
          </div>
          <h1 className="text-3xl font-serif text-primary-midnight mb-8">Admin Orvelan</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={lang === 'fr' ? "Mot de passe" : "Password"}
              className="w-full bg-transparent border-b border-primary-silver/40 py-3 text-lg font-light text-primary-midnight focus:border-primary-midnight outline-none transition-colors text-center"
            />
            <button className="bg-primary-midnight text-white py-4 font-medium uppercase tracking-widest hover:bg-primary-copper transition-colors">
              {lang === 'fr' ? "Accéder" : "Login"}
            </button>
          </form>

          <div className="mt-8 flex justify-center gap-4 text-sm font-medium">
             <button onClick={() => setLang('fr')} className={lang === 'fr' ? 'text-primary-copper underline underline-offset-4' : 'text-primary-silver'}>FR</button>
             <button onClick={() => setLang('en')} className={lang === 'en' ? 'text-primary-copper underline underline-offset-4' : 'text-primary-silver'}>EN</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Navbar lang={lang} setLang={setLang} />
      
      <div className="flex-grow max-w-[1400px] w-full mx-auto px-6 md:px-12 pt-32 pb-24 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar - List of submissions */}
        <div className="md:w-1/3 bg-white p-6 border border-primary-silver/20 shadow-sm overflow-y-auto max-h-[80vh] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif text-primary-midnight flex items-center gap-3">
              <Activity size={20} className="text-primary-copper" />
              {lang === 'fr' ? 'Diagnostics (IA)' : 'Diagnostics (AI)'}
            </h2>
            <button 
              onClick={fetchDiagnostics}
              disabled={loading}
              className="text-xs uppercase tracking-widest text-primary-charcoal hover:text-primary-copper transition-colors"
            >
              {lang === 'fr' ? 'Actualiser' : 'Refresh'}
            </button>
          </div>
          
          {loading ? (
             <p className="text-primary-silver py-4 text-center">{lang === 'fr' ? 'Chargement des données...' : 'Loading data...'}</p>
          ) : diagnostics.length === 0 ? (
             <p className="text-primary-silver py-4 text-center">{lang === 'fr' ? 'Aucun diagnostic trouvé.' : 'No diagnostics found.'}</p>
          ) : (
            <div className="flex flex-col gap-4">
              {diagnostics.map(diag => (
                <button 
                  key={diag.id} 
                  onClick={() => setSelectedEntry(diag)}
                  className={`text-left p-4 border transition-colors ${selectedEntry?.id === diag.id ? 'border-primary-copper bg-primary-copper/5' : 'border-primary-silver/20 hover:border-primary-silver/50'}`}
                >
                  <p className="font-medium text-primary-midnight">{diag.company_name}</p>
                  <p className="text-xs text-primary-charcoal/70 mb-2">{diag.email}</p>
                  <p className="text-[10px] uppercase tracking-widest text-primary-silver font-medium">
                    {new Date(diag.created_at).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content - AI Analysis */}
        <div className="md:w-2/3 bg-white p-10 border border-primary-silver/20 shadow-sm overflow-y-auto max-h-[80vh]">
          {selectedEntry ? (
            <div className="flex flex-col gap-10">
              <div className="border-b border-primary-silver/20 pb-8">
                <h1 className="text-4xl font-serif text-primary-midnight">{selectedEntry.company_name}</h1>
                <p className="text-primary-charcoal">{selectedEntry.email}</p>
                <div className="flex flex-wrap gap-4 mt-6 items-center">
                  <a href={selectedEntry.email?.includes("@") ? `mailto:${selectedEntry.email}` : `tel:${selectedEntry.email}`} className="bg-primary-midnight text-white px-5 py-2.5 text-sm font-medium hover:bg-primary-copper transition-colors uppercase tracking-widest">
                    {lang === 'fr' ? 'Contacter' : 'Contact'}
                  </a>
                  <button 
                    onClick={handleRegenerate}
                    disabled={regenerating}
                    className="border border-primary-midnight text-primary-midnight px-5 py-2.5 text-sm font-medium hover:bg-primary-copper/5 transition-colors disabled:opacity-50 uppercase tracking-widest"
                  >
                    {regenerating ? (lang === 'fr' ? 'Analyse en cours...' : 'Analyzing...') : (lang === 'fr' ? 'Regénérer (IA)' : 'Regenerate (AI)')}
                  </button>
                </div>
              </div>

               <div>
                 <h3 className="text-xs uppercase tracking-[0.2em] font-medium text-primary-copper mb-4">
                   {lang === 'fr' ? 'Résumé Exécutif (IA)' : 'Executive Summary (AI)'}
                 </h3>
                 <div className="text-lg text-primary-charcoal leading-relaxed font-light">
                   <MarkdownRenderer content={safeParseText(selectedEntry.ai_summary, lang)} />
                 </div>
              </div>

              {selectedEntry.ai_key_findings && (
              <div className="bg-primary-copper/5 p-8 border border-primary-copper/20">
                 <h3 className="text-xs uppercase tracking-[0.2em] font-medium text-primary-copper mb-4">
                   {lang === 'fr' ? 'Constats Clés (IA)' : 'Key Findings (AI)'}
                 </h3>
                 <div className="text-lg text-primary-charcoal leading-relaxed font-light">
                   <MarkdownRenderer content={safeParseText(selectedEntry.ai_key_findings, lang)} />
                 </div>
              </div>
              )}

              <div className="bg-primary-copper/5 p-8 border border-primary-copper/20">
                 <h3 className="text-xs uppercase tracking-[0.2em] font-medium text-primary-copper mb-6">
                   {lang === 'fr' ? 'Plan d\'Action (IA)' : 'Action Plan (AI)'}
                 </h3>
                 <div className="text-lg text-primary-charcoal leading-relaxed font-light">
                   <MarkdownRenderer content={safeParseText(selectedEntry.ai_action_plan, lang)} />
                 </div>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] font-medium text-primary-copper mb-4 border-b border-primary-silver/20 pb-2">
                  {lang === 'fr' ? 'Données Brutes' : 'Raw Data'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm mt-4">
                  {selectedEntry.raw_data && Object.keys(selectedEntry.raw_data).map((question, idx) => (
                    <div key={idx} className="mb-4">
                      <p className="font-medium text-primary-midnight mb-1">{question}</p>
                      <p className="text-primary-charcoal/80 font-light">{selectedEntry.raw_data[question]}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-primary-silver/50 min-h-[400px]">
               <FileText size={64} className="mb-4 opacity-50" />
               <p className="text-xl font-light">{lang === 'fr' ? 'Sélectionnez un diagnostic' : 'Select a diagnostic entry'}</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
