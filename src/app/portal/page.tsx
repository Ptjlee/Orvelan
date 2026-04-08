import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Lock, FileText, CheckCircle, Clock } from 'lucide-react';
import ChatUI from './ChatUI';
import { signout } from '@/app/(auth)/actions';
import PrintButton from '@/components/PrintButton';

export const dynamic = 'force-dynamic';

const t = {
  fr: {
    logout: 'Déconnexion',
    headerTitle: 'Votre Diagnostic Stratégique',
    headerSubtitle: "Basé sur votre auto-diagnostic et l'expertise d'Orvelan.",
    emptyTitle: 'Aucun diagnostic trouvé',
    emptyDesc: "Vous n'avez pas encore complété l'auto-diagnostic initial. Pour recevoir votre stratégie personnalisée, veuillez démarrer le diagnostic.",
    startBtn: 'Démarrer le Diagnostic',
    analyzingTitle: 'Analyse en cours',
    analyzingDesc: "David est actuellement en train d'analyser vos réponses. Un plan stratégique sur-mesure est en cours de création.",
    confidential: 'Analyse Confidentielle',
    readyTitle: 'Rapport Finalisé',
    readyDesc: 'Votre rapport stratégique complet est prêt.',
    downloadBtn: 'Télécharger en PDF',
    clientRole: 'Client'
  },
  en: {
    logout: 'Log out',
    headerTitle: 'Your Strategic Diagnostic',
    headerSubtitle: "Based on your self-assessment and Orvelan's expertise.",
    emptyTitle: 'No diagnostic found',
    emptyDesc: "You haven't completed the initial self-assessment yet. To receive your personalized strategy, please start the diagnostic.",
    startBtn: 'Start Diagnostic',
    analyzingTitle: 'Analysis in progress',
    analyzingDesc: "David is currently analyzing your responses. A custom strategic plan is being created.",
    confidential: 'Confidential Analysis',
    readyTitle: 'Report Finalized',
    readyDesc: 'Your complete strategic report is ready.',
    downloadBtn: 'Download PDF',
    clientRole: 'Client'
  }
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

import ProfileSettings from './ProfileSettings';

export default async function PortalPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const lang = searchParams?.lang === 'en' ? 'en' : 'fr';
  const current = t[lang];

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check for the user's diagnostic report
  const { data: report } = await supabase
    .from('diagnostic_reports')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // Fetch their message history
  const { data: messages } = await supabase
    .from('portal_messages')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true }) || { data: [] };

  const isPublished = report?.status === 'published';

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-primary-silver/20 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href={`/?lang=${lang}`} className="font-serif text-2xl text-primary-midnight tracking-widest uppercase hover:opacity-80 transition-opacity">Orvelan</a>
          <ProfileSettings user={user} lang={lang as 'fr'|'en'} signoutAction={signout} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Result / Status */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-3xl font-serif text-primary-midnight mb-2">{current.headerTitle}</h2>
            <p className="text-primary-charcoal/70 font-light text-lg">
              {current.headerSubtitle}
            </p>
          </div>

          {!report ? (
            <div className="bg-white border border-primary-silver/20 rounded-sm p-12 shadow-sm flex flex-col items-center justify-center text-center mt-8">
              <div className="w-20 h-20 bg-[#FAFAFA] border border-primary-silver/30 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-primary-midnight" strokeWidth={1} />
              </div>
              <h3 className="text-2xl font-serif text-primary-midnight mb-4">{current.emptyTitle}</h3>
              <p className="text-primary-charcoal/70 font-light max-w-md leading-relaxed mb-8">
                {current.emptyDesc}
              </p>
              <a 
                href={`/portal/diagnostic?lang=${lang}`} 
                className="bg-primary-midnight text-white px-8 py-4 text-sm tracking-widest uppercase font-medium hover:bg-primary-copper transition-colors"
              >
                {current.startBtn}
              </a>
            </div>
          ) : !isPublished ? (
            <div className="bg-white border border-primary-silver/20 rounded-sm p-12 shadow-sm flex flex-col items-center justify-center text-center mt-8">
              <div className="w-20 h-20 bg-[#FAFAFA] border border-primary-silver/30 rounded-full flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-primary-copper animate-pulse" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-serif text-primary-midnight mb-4">{current.analyzingTitle}</h3>
              <p className="text-primary-charcoal/70 font-light max-w-md leading-relaxed">
                {current.analyzingDesc}
              </p>
              <div className="mt-8 bg-primary-midnight/5 text-primary-midnight px-6 py-3 text-sm font-medium tracking-widest uppercase rounded-full flex items-center gap-2">
                <Lock className="w-4 h-4" /> {current.confidential}
              </div>
            </div>
          ) : (
            <div id="report-container" className="bg-white border border-primary-silver/20 rounded-sm p-10 shadow-sm print:shadow-none print:border-none print:p-0">
              <div className="flex items-center gap-3 mb-8 pb-8 border-b border-primary-silver/20">
                <CheckCircle className="w-6 h-6 text-emerald-600 print:hidden" />
                <h3 className="text-xl font-medium text-emerald-900 tracking-wide uppercase text-sm print:hidden">{current.readyTitle}</h3>
                
                {/* Print Title Header visible only in PDF/Print */}
                <div className="hidden print:block w-full">
                  <h1 className="text-3xl font-serif text-primary-midnight border-b pb-4 mb-4">Orvelan - Diagnostic Stratégique</h1>
                </div>
              </div>
              
              <div className="prose prose-stone max-w-none text-primary-charcoal font-light leading-relaxed">
                {report.admin_notes ? (
                  <div dangerouslySetInnerHTML={{ __html: report.admin_notes.replace(/\\n/g, '<br/>') }} />
                ) : (
                  <p>{current.readyDesc}</p>
                )}
              </div>
              
              <div className="mt-12 pt-8 border-t border-primary-silver/20 flex justify-end print:hidden">
                <PrintButton label={current.downloadBtn} />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Communication */}
        <div className="lg:col-span-1">
          <ChatUI initialMessages={messages || []} lang={lang} />
        </div>

      </main>
    </div>
  );
}
