import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password, action, userId, content } = body;

    if (password !== (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Orvelan2026')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseOptions = { auth: { persistSession: false } };
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      supabaseOptions
    );

    if (action === 'fetch') {
      const { data: messages, error } = await supabase.rpc('admin_fetch_messages', {
        admin_pass: password,
        q_user_id: userId
      });

      if (error) throw error;
      return NextResponse.json({ success: true, data: messages });
    } 
    else if (action === 'send') {
      const { error } = await supabase.rpc('admin_send_message', {
        admin_pass: password,
        q_user_id: userId,
        p_content: content
      });

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
