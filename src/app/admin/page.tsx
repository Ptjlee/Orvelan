"use client";

import { useState, useEffect, useRef } from "react";
import { Lock, FileText, Activity, MessageSquare, Send, CheckCircle, BarChart3, Users, X, MessageCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

const MarkdownRenderer = ({ content }: { content: string }) => (
  <ReactMarkdown
    components={{
      strong: ({node, ...props}) => <span className="font-semibold text-primary-midnight" {...props} />,
      ol: ({node, ...props}) => <ol className="list-decimal pl-5 space-y-2 mb-4" {...props} />,
      ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 mb-4" {...props} />,
      li: ({node, ...props}) => <li className="text-primary-charcoal marker:text-primary-copper" {...props} />,
      p: ({node, ...props}) => <p className="mb-4 last:mb-0 whitespace-pre-wrap" {...props} />,
      h1: ({node, ...props}) => <h1 className="text-2xl font-serif text-primary-midnight mb-4 mt-6" {...props} />,
      h2: ({node, ...props}) => <h2 className="text-xl font-serif text-primary-midnight mb-3 mt-5" {...props} />,
      h3: ({node, ...props}) => <h3 className="text-lg font-serif text-primary-midnight mb-2 mt-4" {...props} />,
    }}
  >
    {content}
  </ReactMarkdown>
);

const safeParseText = (text: any, lang: 'fr'|'en') => {
  if (!text) return "";
  if (typeof text === 'object') {
    return text[lang] || text.fr || text.en || "";
  }
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
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [activeMenu, setActiveMenu] = useState<"clients" | "dashboard">("clients");
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
  
  // Chat state
  const [messages, setMessages] = useState<any[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Publish state
  interface ReportData {
    summary: string;
    findings: string;
    actionPlan: string;
    customBlocks: { id: string; title: string; content: string }[];
  }
  const [reportData, setReportData] = useState<ReportData>({ summary: "", findings: "", actionPlan: "", customBlocks: [] });
  const [publishing, setPublishing] = useState(false);

  const setAuthStorage = (pwd: string) => {
    localStorage.setItem("orvelan_admin_pwd", pwd);
  };

  useEffect(() => {
    const saved = localStorage.getItem("orvelan_admin_pwd");
    if (saved) {
      setPassword(saved);
      setIsAuthenticated(true);
      fetchClients(saved);
    }
  }, []);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [selectedEntry]);

  useEffect(() => {
    if (chatScrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatScrollRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
      if (isNearBottom) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
    }
  }, [messages]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
    setAuthStorage(password);
    fetchClients(password);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    localStorage.removeItem("orvelan_admin_pwd");
  };

  const fetchClients = async (pwd: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd })
      });
      const result = await response.json();
      
      if (result.success) {
        const sorted = (result.data || []).sort((a: any, b: any) => {
          if (a.unread_count > 0 && b.unread_count === 0) return -1;
          if (b.unread_count > 0 && a.unread_count === 0) return 1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        setClients(sorted);
      } else {
        handleLogout();
        alert(lang === 'fr' ? "Erreur de connexion" : "Connection error");
      }
    } catch (err) {
      console.error("Error fetching clients:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (userId: string, isPolling = false) => {
    if (userId.startsWith('sanity_')) return; // No chat natively for old legacy backups
    if (!isPolling) setChatLoading(true);
    try {
      const response = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, action: 'fetch', userId })
      });
      const result = await response.json();
      if (result.success) {
        setMessages(prev => {
          const newData = result.data || [];
          if (newData.length !== prev.length) return newData;
          return prev;
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!isPolling) setChatLoading(false);
    }
  };

  const parseExistingNotes = (notes: string) => {
    if (!notes) return { summary: "", findings: "", actionPlan: "", customBlocks: [] };
    const hasStructure = notes.includes("### Résumé Exécutif") || notes.includes("### Executive Summary");
    if (!hasStructure) return { summary: notes, findings: "", actionPlan: "", customBlocks: [] };

    const blocksRaw = notes.split("### ").filter(b => b.trim() !== "");
    let summary = "";
    let findings = "";
    let actionPlan = "";
    const customBlocks: {id: string; title: string; content: string}[] = [];

    blocksRaw.forEach(block => {
       const newlineIdx = block.indexOf("\n");
       if (newlineIdx === -1) {
         // Fallback if there's no newline
         customBlocks.push({ id: Math.random().toString(), title: block.trim(), content: "" });
         return;
       }
       const title = block.substring(0, newlineIdx).trim();
       const content = block.substring(newlineIdx + 1).trim();

       if (title === "Résumé Exécutif" || title === "Executive Summary") {
         summary = content;
       } else if (title === "Constats Clés" || title === "Key Findings") {
         findings = content;
       } else if (title === "Plan d'Action" || title === "Action Plan") {
         actionPlan = content;
       } else {
         customBlocks.push({ id: Math.random().toString(), title, content });
       }
    });

    return { summary, findings, actionPlan, customBlocks };
  };

  const handleSelectClient = (client: any) => {
    setSelectedEntry({ ...client, unread_count: 0 });
    
    if (client.admin_notes) {
      setReportData(parseExistingNotes(client.admin_notes));
    } else if (client.ai_analysis && !client.is_sanity) {
      setReportData({
        summary: safeParseText(client.ai_analysis.summary_fr || client.ai_analysis.summary, lang),
        findings: safeParseText(client.ai_analysis.key_findings_fr || client.ai_analysis.key_findings, lang),
        actionPlan: safeParseText(client.ai_analysis.action_plan_fr || client.ai_analysis.action_plan, lang),
        customBlocks: []
      });
    } else {
      setReportData({ summary: "", findings: "", actionPlan: "", customBlocks: [] });
    }

    setMessages([]);
    loadMessages(client.user_id);
    
    setClients(prev => prev.map(c => c.user_id === client.user_id ? { ...c, unread_count: 0 } : c));
  };

  // Poll Chat Messages every 5 seconds for the active client
  useEffect(() => {
    if (!selectedEntry || selectedEntry.is_sanity) return;
    const interval = setInterval(() => {
      loadMessages(selectedEntry.user_id, true);
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedEntry, password]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedEntry || selectedEntry.is_sanity) return;

    const contentToSend = newMessage.trim();
    setNewMessage("");

    setMessages(prev => [...prev, {
      id: Math.random().toString(),
      sender_role: 'admin',
      content: contentToSend,
      created_at: new Date().toISOString(),
      is_read: true
    }]);

    try {
      await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          password, 
          action: 'send', 
          userId: selectedEntry.user_id,
          content: contentToSend
        })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublish = async () => {
    if (!selectedEntry || selectedEntry.is_sanity) return;
    setPublishing(true);
    try {
      let compiledMarkdown = `### ${lang === 'fr' ? 'Résumé Exécutif' : 'Executive Summary'}\n${reportData.summary}\n\n### ${lang === 'fr' ? 'Constats Clés' : 'Key Findings'}\n${reportData.findings}\n\n### ${lang === 'fr' ? 'Plan d\'Action' : 'Action Plan'}\n${reportData.actionPlan}`;
      
      reportData.customBlocks.forEach(block => {
        if (block.title.trim() || block.content.trim()) {
          compiledMarkdown += `\n\n### ${block.title.trim() || 'Additional Notes'}\n${block.content}`;
        }
      });

      const response = await fetch("/api/admin/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          userId: selectedEntry.user_id,
          adminNotes: compiledMarkdown,
          status: 'published'
        })
      });
      const data = await response.json();
      if (data.success) {
        alert(lang === 'fr' ? "Rapport publié avec succès dans l'espace client!" : "Report successfully published to client portal!");
        // Update local state
        setSelectedEntry({ ...selectedEntry, status: 'published', admin_notes: compiledMarkdown, report_status: 'published' });
        setClients(prev => prev.map(c => c.user_id === selectedEntry.user_id ? { ...c, report_status: 'published', admin_notes: compiledMarkdown } : c));
      } else {
        alert(data.error || "Failed to publish");
      }
    } catch (err) {
      console.error(err);
      alert("Error publishing report");
    } finally {
      setPublishing(false);
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

  // Analytics Computation
  const clientsWithUnread = clients.filter(c => c.unread_count > 0).length;
  const publishedCount = clients.filter(c => c.report_status === 'published').length;
  const pendingCount = clients.length - publishedCount;

  return (
    <main className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-primary-charcoal">
      
      {/* Custom Admin Navbar */}
      <header className="bg-primary-midnight text-white shadow-sm sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="font-serif text-xl tracking-widest uppercase">Orvelan Admin</h1>
            <nav className="flex items-center gap-6 text-sm font-medium uppercase tracking-wider text-white/70">
              <button 
                onClick={() => setActiveMenu('clients')}
                className={`hover:text-white transition-colors py-5 border-b-2 ${activeMenu === 'clients' ? 'border-primary-copper text-white' : 'border-transparent'}`}
              >
                {lang === 'fr' ? 'Diagnostic Clients' : 'Diagnostic Clients'}
                {clientsWithUnread > 0 && <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{clientsWithUnread}</span>}
              </button>
              <button 
                onClick={() => setActiveMenu('dashboard')}
                className={`hover:text-white transition-colors py-5 border-b-2 ${activeMenu === 'dashboard' ? 'border-primary-copper text-white' : 'border-transparent'}`}
              >
                {lang === 'fr' ? 'Dashboard' : 'Dashboard'}
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} className="text-sm font-bold text-white/50 hover:text-white">
               {lang === 'fr' ? 'EN' : 'FR'}
             </button>
             <button onClick={handleLogout} className="text-xs uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-2 transition-colors">
               Logout
             </button>
          </div>
        </div>
      </header>
      
      <div className="flex-grow max-w-[1400px] w-full mx-auto px-6 pt-10 pb-24">
        
        {activeMenu === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-serif text-primary-midnight">Vue d'ensemble</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <div className="bg-white p-6 border border-primary-silver/20 shadow-sm flex flex-col justify-center items-center">
                 <Users className="w-8 h-8 text-primary-copper mb-3" />
                 <p className="text-4xl font-serif text-primary-midnight">{clients.length}</p>
                 <p className="text-xs uppercase tracking-widest text-primary-silver mt-1">Total Diagnostics</p>
               </div>
               <div className="bg-white p-6 border border-primary-silver/20 shadow-sm flex flex-col justify-center items-center">
                 <Activity className="w-8 h-8 text-yellow-500 mb-3" />
                 <p className="text-4xl font-serif text-primary-midnight">{pendingCount}</p>
                 <p className="text-xs uppercase tracking-widest text-primary-silver mt-1">Non Publiés (Pending)</p>
               </div>
               <div className="bg-white p-6 border border-primary-silver/20 shadow-sm flex flex-col justify-center items-center">
                 <CheckCircle className="w-8 h-8 text-emerald-500 mb-3" />
                 <p className="text-4xl font-serif text-primary-midnight">{publishedCount}</p>
                 <p className="text-xs uppercase tracking-widest text-primary-silver mt-1">Rapports Publiés</p>
               </div>
               <div className="bg-white p-6 border border-primary-silver/20 shadow-sm flex flex-col justify-center items-center">
                 <MessageSquare className="w-8 h-8 text-blue-500 mb-3" />
                 <p className="text-4xl font-serif text-primary-midnight">{clientsWithUnread}</p>
                 <p className="text-xs uppercase tracking-widest text-primary-silver mt-1">Messages Non Lus</p>
               </div>
            </div>
          </div>
        )}

        {activeMenu === 'clients' && (
          <div className="flex flex-col xl:flex-row gap-8 h-[calc(100vh-160px)]">
            
            {/* Sidebar - List of clients */}
            <div className="xl:w-[350px] flex-shrink-0 bg-white border border-primary-silver/20 shadow-sm flex flex-col h-full overflow-hidden">
              <div className="p-4 border-b border-primary-silver/20 flex justify-between items-center bg-[#FAFAFA]">
                <h2 className="font-serif text-primary-midnight flex items-center gap-2">
                  <FileText size={18} className="text-primary-copper" /> Clients
                </h2>
                <button 
                  onClick={() => fetchClients(password)}
                  disabled={loading}
                  className="text-[10px] uppercase tracking-widest text-primary-charcoal hover:text-primary-copper transition-colors"
                >
                  Actualiser
                </button>
              </div>
              
              <div className="overflow-y-auto flex-grow flex flex-col">
                {loading ? (
                   <p className="text-primary-silver py-8 text-center text-sm">Chargement...</p>
                ) : clients.length === 0 ? (
                   <p className="text-primary-silver py-8 text-center text-sm">Aucun diagnostic.</p>
                ) : (
                  clients.map(client => (
                    <button 
                      key={client.user_id} 
                      onClick={() => handleSelectClient(client)}
                      className={`text-left relative p-4 border-b transition-colors flex flex-col ${selectedEntry?.user_id === client.user_id ? 'bg-primary-copper/5 border-l-2 border-l-primary-copper' : 'border-primary-silver/20 hover:bg-[#FAFAFA] border-l-2 border-l-transparent'}`}
                    >
                      {client.unread_count > 0 && (
                        <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-sm" />
                      )}
                      
                      <div className="flex items-center gap-2 mb-1">
                        {client.report_status === 'published' ? (
                          <CheckCircle className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Activity className="w-3 h-3 text-yellow-500" />
                        )}
                        <p className="font-medium text-primary-midnight truncate pr-6 text-sm">{client.form_company_name || client.company_name || "Entreprise"}</p>
                      </div>
                      
                      <p className="text-xs text-primary-charcoal/70 truncate">{client.first_name || ''} {client.last_name || ''}</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[9px] uppercase tracking-widest text-primary-silver font-medium">
                          {new Date(client.created_at).toLocaleDateString()}
                        </span>
                        {client.is_sanity && <span className="text-[9px] bg-primary-silver/10 px-1 py-0.5">Legacy</span>}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Main Content Pane */}
            <div className="flex-grow bg-white border border-primary-silver/20 shadow-sm flex flex-col h-full overflow-hidden relative">
              {selectedEntry ? (
                <div className="flex-grow flex relative overflow-hidden">
                  
                  {/* Left content panel (AI Results & Publishing) */}
                  <div className="flex-grow p-8 overflow-y-auto h-full relative">
                     <div className="pb-6 border-b border-primary-silver/20 mb-8 flex justify-between items-end">
                       <div>
                         <div className="flex items-center gap-3 mb-2">
                            <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 ${selectedEntry.report_status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {selectedEntry.report_status === 'published' ? 'PUBLIÉ' : 'BROUILLON / EN COURS'}
                            </span>
                         </div>
                         <h1 className="text-3xl font-serif text-primary-midnight">{selectedEntry.form_company_name || selectedEntry.company_name}</h1>
                         <p className="text-primary-charcoal mt-1 text-sm">{selectedEntry.email}</p>
                       </div>
                       <div className="flex items-center gap-4">
                         {!selectedEntry.is_sanity && (
                           <button
                             onClick={() => setIsChatOpen(!isChatOpen)}
                             className="bg-white border border-primary-silver/40 text-primary-midnight px-6 py-3 text-xs tracking-widest uppercase hover:border-primary-copper transition-colors font-medium flex items-center gap-2 relative shadow-sm"
                           >
                             <MessageCircle size={14} /> Messagerie
                             {selectedEntry.unread_count > 0 && (
                               <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-red-500 rounded-full animate-bounce shadow-sm" />
                             )}
                           </button>
                         )}
                         {!selectedEntry.is_sanity ? (
                           <button 
                             onClick={handlePublish}
                             disabled={publishing}
                             className="bg-primary-midnight text-white px-6 py-3 text-xs tracking-widest uppercase hover:bg-primary-copper transition-colors font-medium flex items-center gap-2 shadow-sm"
                           >
                             {publishing ? 'Publication...' : (selectedEntry.report_status === 'published' ? 'Mettre à jour' : 'Sauvegarder & Publier')}
                           </button>
                         ) : (
                           <button 
                             disabled
                             className="bg-primary-silver/20 text-primary-silver px-6 py-3 text-xs tracking-widest uppercase font-medium cursor-not-allowed"
                           >
                             Non Publiable (Legacy)
                           </button>
                         )}
                       </div>
                     </div>

                     {/* Detailed Editable Report Sections */}
                     {!selectedEntry.is_sanity ? (
                       <div className="flex flex-col gap-8 opacity-100 pb-12">
                         <div className="flex justify-between items-center border-b border-primary-silver/20 pb-4 mb-2">
                           <div>
                             <h3 className="text-sm uppercase tracking-widest font-medium text-primary-midnight mb-1 flex items-center gap-2">
                               <FileText className="w-4 h-4 text-primary-copper" />
                               Rapport Client (Éditable)
                             </h3>
                             <p className="text-xs text-primary-charcoal/60 tracking-wide">
                               Ce qui suit sera publié dans l'espace du client. Modifiez directement le brouillon.
                             </p>
                           </div>
                           
                           {selectedEntry.ai_analysis && (
                             <button
                               onClick={() => {
                                 if (window.confirm(lang === 'fr' ? "Êtes-vous sûr de vouloir remplacer le contenu par le brouillon IA ?" : "Are you sure you want to replace contents with the AI draft?")) {
                                   setReportData({
                                     summary: safeParseText(selectedEntry.ai_analysis.summary_fr || selectedEntry.ai_analysis.summary, lang),
                                     findings: safeParseText(selectedEntry.ai_analysis.key_findings_fr || selectedEntry.ai_analysis.key_findings, lang),
                                     actionPlan: safeParseText(selectedEntry.ai_analysis.action_plan_fr || selectedEntry.ai_analysis.action_plan, lang),
                                     customBlocks: []
                                   });
                                 }
                               }}
                               className="text-[10px] uppercase font-bold tracking-widest border border-primary-copper/30 text-primary-copper px-4 py-2 hover:bg-primary-copper hover:text-white transition-colors bg-white/50 shadow-sm"
                             >
                               {lang === 'fr' ? 'Recharger Brouillon IA' : 'Reload AI Draft'}
                             </button>
                           )}
                         </div>
                         
                         <div>
                           <div className="flex justify-between items-center mb-3">
                             <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-primary-midnight">
                               {lang === 'fr' ? 'Résumé Exécutif' : 'Executive Summary'}
                             </h4>
                           </div>
                           <textarea
                             className="w-full bg-[#FAFAFA] border border-primary-silver/30 p-5 min-h-[150px] text-sm focus:outline-none focus:border-primary-copper font-light transition-colors resize-y shadow-inner leading-relaxed focus:bg-white"
                             value={reportData.summary}
                             onChange={e => setReportData({...reportData, summary: e.target.value})}
                           />
                        </div>
                        {/* Constats */}
                        <div>
                           <div className="flex justify-between items-center mb-3">
                             <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-primary-midnight">
                               {lang === 'fr' ? 'Constats Clés' : 'Key Findings'}
                             </h4>
                           </div>
                           <textarea
                             className="w-full bg-[#FAFAFA] border border-primary-silver/30 p-5 min-h-[250px] text-sm focus:outline-none focus:border-primary-copper font-light transition-colors resize-y shadow-inner leading-relaxed focus:bg-white"
                             value={reportData.findings}
                             onChange={e => setReportData({...reportData, findings: e.target.value})}
                           />
                        </div>
                        {/* Plan d'action */}
                        <div>
                           <div className="flex justify-between items-center mb-3">
                             <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-primary-midnight">
                               {lang === 'fr' ? 'Plan d\'Action' : 'Action Plan'}
                             </h4>
                           </div>
                           <textarea
                             className="w-full bg-[#FAFAFA] border border-primary-silver/30 p-5 min-h-[250px] text-sm focus:outline-none focus:border-primary-copper font-light transition-colors resize-y shadow-inner leading-relaxed focus:bg-white"
                             value={reportData.actionPlan}
                             onChange={e => setReportData({...reportData, actionPlan: e.target.value})}
                           />
                        </div>

                        {/* Custom Blocks */}
                        {reportData.customBlocks.map((block, index) => (
                          <div key={block.id} className="relative group animate-in slide-in-from-top-2 fade-in duration-300">
                             <div className="flex justify-between items-center mb-3">
                               <input 
                                 type="text"
                                 className="text-xs uppercase tracking-[0.2em] font-bold text-primary-midnight bg-transparent border-b border-transparent hover:border-primary-silver/40 focus:border-primary-copper focus:outline-none px-1 py-0.5 w-[300px]"
                                 value={block.title}
                                 onChange={(e) => {
                                   const next = [...reportData.customBlocks];
                                   next[index].title = e.target.value;
                                   setReportData({ ...reportData, customBlocks: next });
                                 }}
                                 placeholder={lang === 'fr' ? 'TITRE DE LA SECTION...' : 'SECTION TITLE...'}
                               />
                               <button 
                                 onClick={() => {
                                   if(window.confirm(lang === 'fr' ? "Supprimer cette section ?" : "Delete this section?")) {
                                     const next = [...reportData.customBlocks];
                                     next.splice(index, 1);
                                     setReportData({ ...reportData, customBlocks: next });
                                   }
                                 }}
                                 className="text-[10px] text-red-500 hover:text-red-700 uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                               >
                                 {lang === 'fr' ? 'Supprimer' : 'Delete'}
                               </button>
                             </div>
                             <textarea
                               className="w-full bg-[#FAFAFA] border border-primary-silver/30 p-5 min-h-[150px] text-sm focus:outline-none focus:border-primary-copper font-light transition-colors resize-y shadow-inner leading-relaxed focus:bg-white"
                               value={block.content}
                               onChange={(e) => {
                                 const next = [...reportData.customBlocks];
                                 next[index].content = e.target.value;
                                 setReportData({ ...reportData, customBlocks: next });
                               }}
                               placeholder={lang === 'fr' ? 'Contenu additionnel...' : 'Additional content...'}
                             />
                          </div>
                        ))}

                        <div className="pt-4 flex justify-center border-t border-primary-silver/20 mt-4 mx-8">
                          <button 
                            onClick={() => setReportData({
                              ...reportData, 
                              customBlocks: [...reportData.customBlocks, { id: Math.random().toString(), title: lang === 'fr' ? "Nouveau Titre" : "New Title", content: "" }]
                            })}
                            className="text-xs uppercase tracking-widest text-primary-charcoal border border-primary-silver/40 px-6 py-2.5 hover:bg-primary-midnight hover:text-white hover:border-primary-midnight transition-colors flex items-center gap-2 mt-4"
                          >
                            + {lang === 'fr' ? 'Ajouter un bloc de texte' : 'Add text block'}
                          </button>
                        </div>
                       </div>
                     ) : (
                       <div className="mb-12 bg-[#FAFAFA] p-6 border border-primary-silver/20 opacity-60">
                         <h3 className="text-sm uppercase tracking-widest font-medium text-primary-midnight mb-2">Commentaires / Rapport Final</h3>
                         <p className="text-xs text-red-500 mb-4 tracking-wide font-medium">⚠️ Ce dossier est un test "Legacy" (généré avant l'ajout des comptes utilisateurs). Vous ne pouvez pas ajouter de rapport ni interagir directement avec ce dossier.</p>
                         <textarea 
                           disabled
                           className="w-full bg-primary-silver/5 border border-primary-silver/20 p-4 min-h-[100px] text-sm cursor-not-allowed"
                           value="Non disponible pour les anciens tests. Testez en soumettant un nouveau diagnostic avec un compte."
                         />
                       </div>
                     )}
                  </div>

                  {/* Right Panel: Chat Interface (Absolute Slide Overlay) */}
                  {!selectedEntry.is_sanity && (
                    <div className={`absolute top-0 right-0 bottom-0 w-[400px] max-w-full z-20 flex flex-col bg-[#FAFAFA] border-l border-primary-silver/30 tracking-wide transition-transform duration-300 ease-in-out shadow-[rgba(0,0,0,0.1)_0px_4px_24px] ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                      <div className="p-4 border-b border-primary-silver/20 bg-white flex items-center justify-between">
                        <h3 className="text-xs font-bold tracking-widest uppercase text-primary-midnight flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-primary-copper" /> 
                          Messagerie Client
                        </h3>
                        <button onClick={() => setIsChatOpen(false)} className="text-primary-silver hover:text-primary-copper transition-colors p-1">
                          <X size={16} />
                        </button>
                      </div>
                      
                      <div ref={chatScrollRef} className="flex-grow p-4 overflow-y-auto space-y-4">
                         {chatLoading ? (
                           <div className="h-full flex items-center justify-center text-xs text-primary-silver">Chargement...</div>
                         ) : messages.length === 0 ? (
                           <div className="h-full flex flex-col items-center justify-center text-primary-silver/60">
                             <p className="text-xs font-light text-center">Aucun message</p>
                           </div>
                         ) : (
                           messages.map((msg: any) => {
                             const isAdmin = msg.sender_role === 'admin';
                             return (
                               <div key={msg.id} className={`flex flex-col max-w-[90%] ${isAdmin ? 'ml-auto' : 'mr-auto'}`}>
                                  <div className={`p-3 text-xs leading-relaxed rounded-sm ${
                                    isAdmin 
                                    ? 'bg-primary-midnight text-white' 
                                    : 'bg-white border border-primary-silver/30 text-primary-charcoal'
                                  }`}>
                                    {msg.content}
                                  </div>
                               </div>
                             );
                           })
                         )}
                      </div>

                      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-primary-silver/20">
                          <div className="flex gap-2 relative">
                            <input
                              type="text"
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              placeholder="Message..."
                              className="w-full bg-[#FAFAFA] border border-primary-silver/30 pl-3 pr-10 py-3 text-xs focus:outline-none focus:border-primary-midnight focus:bg-white transition-colors"
                            />
                            <button
                              type="submit"
                              disabled={!newMessage.trim() || chatLoading}
                              className="absolute right-0 top-0 bottom-0 text-primary-midnight hover:text-primary-copper transition-colors px-3 disabled:opacity-30"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                      </form>
                    </div>
                  )}

                  {/* Optional Backdrop to capture clicks outside chat */}
                  {isChatOpen && (
                     <div 
                       className="absolute inset-0 bg-primary-midnight/5 z-10 transition-opacity duration-300" 
                       onClick={() => setIsChatOpen(false)} 
                     />
                  )}

                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-primary-silver/50">
                   <Activity size={48} className="mb-4 opacity-30" strokeWidth={1} />
                   <p className="text-lg font-light tracking-wide">{lang === 'fr' ? 'Sélectionnez un dossier client' : 'Select a client file'}</p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
