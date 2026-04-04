import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { password, userId, adminNotes, status } = await req.json();

    if (password !== (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Orvelan2026')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (userId.startsWith('sanity_')) {
      return NextResponse.json({ success: false, error: 'Cannot publish legacy Sanity entries' }, { status: 400 });
    }

    const supabaseOptions = { auth: { persistSession: false } };
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      supabaseOptions
    );

    const { error } = await supabase.rpc('admin_update_report', {
      admin_pass: password,
      q_user_id: userId,
      p_admin_notes: adminNotes,
      p_status: status
    });

    if (error) throw error;
    return NextResponse.json({ success: true });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
