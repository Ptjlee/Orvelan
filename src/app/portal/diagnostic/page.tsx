import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DiagnosticSurvey from './DiagnosticSurvey';
import ProfileSettings from '../ProfileSettings';
import { signout } from '@/app/(auth)/actions';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function PortalDiagnosticPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const lang = searchParams?.lang === 'en' ? 'en' : 'fr';

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if they already submitted one that is pending or published
  const { data: report } = await supabase
    .from('diagnostic_reports')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (report) {
    // Already did the survey, go back to portal
    redirect(`/portal?lang=${lang}`);
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-20">
      {/* Header matching the Portal layout */}
      <header className="bg-white border-b border-primary-silver/20 shadow-sm sticky top-0 z-10 w-full">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href={`/?lang=${lang}`} className="font-serif text-2xl text-primary-midnight tracking-widest uppercase hover:opacity-80 transition-opacity">Orvelan</a>
          <ProfileSettings user={user} lang={lang as 'fr'|'en'} signoutAction={signout} />
        </div>
      </header>

      {/* Survey Component */}
      <DiagnosticSurvey lang={lang as 'fr'|'en'} />
    </div>
  );
}
