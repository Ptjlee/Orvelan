'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const phone = formData.get('phone') as string;
  const password = formData.get('password') as string;
  const email = formData.get('email') as string;
  const firstName = formData.get('first_name') as string;
  const lastName = formData.get('last_name') as string;

  const updates: any = {};
  const dataUpdates: any = {};

  if (email) updates.email = email;
  if (password) updates.password = password;
  
  if (phone) dataUpdates.phone = phone;
  if (firstName) dataUpdates.first_name = firstName;
  if (lastName) dataUpdates.last_name = lastName;

  if (Object.keys(dataUpdates).length > 0) {
    updates.data = dataUpdates;
  }

  if (Object.keys(updates).length > 0) {
    const { error } = await supabase.auth.updateUser(updates);
    if (error) {
      return { error: error.message };
    }
  }

  revalidatePath('/portal', 'page');
  return { success: true };
}
