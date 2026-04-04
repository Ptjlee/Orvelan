'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const lang = formData.get('lang') as string || 'fr'

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect(`/portal?lang=${lang}`) // Redirect to the client portal after login with lang preserved
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const lang = formData.get('lang') as string || 'fr'

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  // Look up the URL origin to safely route the magic link callback in dev and prod
  const originUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3040'

  // Passing the name in user_metadata allows us to store user info seamlessly
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName
      },
      emailRedirectTo: `${originUrl}/auth/callback?next=/portal%3Flang%3D${lang}`
    }
  })

  if (error) {
    return { error: error.message }
  }

  // Redirect to a check-your-email message
  redirect(`/verify?lang=${lang}`)
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const lang = formData.get('lang') as string || 'fr';
  
  if (!email) {
    return { error: 'Email is required' };
  }

  const originUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3040';
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${originUrl}/auth/callback?next=/update-password%3Flang%3D${lang}`,
  });

  if (error) {
    return { error: error.message };
  }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get('password') as string;
  const lang = formData.get('lang') as string || 'fr';
  
  if (!password) {
    return { error: 'Password is required' };
  }
  
  const { error } = await supabase.auth.updateUser({
    password: password
  });

  if (error) {
    return { error: error.message };
  }

  redirect(`/portal?lang=${lang}`);
}
