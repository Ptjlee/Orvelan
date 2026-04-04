'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function sendMessage(formData: FormData) {
  const content = formData.get('message') as string;
  if (!content || !content.trim()) return { error: 'Message cannot be empty' };

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('portal_messages')
    .insert({
      user_id: userData.user.id,
      sender_role: 'client',
      content: content.trim()
    });

  if (error) {
    return { error: error.message };
  }

  // Send an email notification to the admin
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    const clientName = userData.user.user_metadata?.first_name 
      ? `${userData.user.user_metadata.first_name} ${userData.user.user_metadata.last_name || ''}`
      : userData.user.email;

    await resend.emails.send({
      from: 'Orvelan Portal <hello@send.orvelan.fr>',
      to: 'dmartinez@orvelan.fr',
      subject: `Nouveau message - Hub Client (${clientName})`,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
          <h2 style="color: #2F323A;">Nouveau message de ${clientName}</h2>
          <p style="color: #4A4A4A; font-size: 16px; margin-bottom: 24px;">Un client vient de vous envoyer un message depuis son Espace Client Orvelan.</p>
          <div style="background-color: #FAFAFA; padding: 20px; border-left: 4px solid #B08D57; color: #333; margin-bottom: 30px;">
            <p style="margin: 0; font-style: italic;">"${content.trim()}"</p>
          </div>
          <a href="https://orvelan.fr/admin" style="background-color: #2F323A; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; text-transform: uppercase; font-size: 14px; letter-spacing: 1px;">Répondre au client</a>
        </div>
      `
    });
  } catch (err) {
    console.error("Failed to send admin email notification", err);
    // Silent fail so we don't break the user's chat experience if email fails
  }

  revalidatePath('/portal');
  return { success: true };
}
