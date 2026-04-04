import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (password !== (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Orvelan2026')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseOptions = { auth: { persistSession: false } };
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      supabaseOptions
    );

    const { data: clients, error } = await supabase.rpc('admin_fetch_clients', {
      admin_pass: password
    });

    if (error) {
      console.error("RPC Error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const { sanityClient } = await import('@/lib/sanity');
    const sanityData = await sanityClient.fetch(
      `*[_type == "diagnostic"] | order(created_at desc) {
        _id, created_at, company_name, email, raw_data, ai_summary, ai_key_findings, ai_action_plan
      }`
    );

    const mergedSanity = sanityData.map((s: any) => {
      let analysis = { summary_fr: '', key_findings_fr: '', action_plan_fr: '' };
      try {
        const sum = JSON.parse(s.ai_summary || '{}');
        const kf = JSON.parse(s.ai_key_findings || '{}');
        const ap = JSON.parse(s.ai_action_plan || '{}');
        analysis = { summary_fr: sum.fr, key_findings_fr: kf.fr, action_plan_fr: ap.fr };
      } catch (e) {}

      let rawObj = {};
      try { rawObj = typeof s.raw_data === 'string' ? JSON.parse(s.raw_data) : s.raw_data; } catch (e) {}

      return {
        user_id: `sanity_${s._id}`,
        email: s.email,
        first_name: 'Test',
        last_name: '(Legacy)',
        form_company_name: s.company_name,
        report_status: 'pending',
        ai_analysis: analysis,
        admin_notes: '',
        form_raw_data: rawObj,
        created_at: s.created_at,
        unread_count: 0,
        is_sanity: true
      };
    });

    const finalData = [...(clients || []), ...mergedSanity];

    return NextResponse.json({ success: true, data: finalData });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
