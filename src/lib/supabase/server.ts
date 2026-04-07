import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables!");
    // Return a dummy client so the application renders a visual error rather than a 500 crash page.
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: new Error('Missing DB Credentials') }),
        signOut: async () => ({ error: null }),
        signInWithPassword: async () => ({ data: null, error: new Error('Missing Env Vars') }),
        signUp: async () => ({ data: null, error: new Error('Missing Env Vars') }),
        resetPasswordForEmail: async () => ({ data: null, error: new Error('Missing Env Vars') }),
        updateUser: async () => ({ data: null, error: new Error('Missing Env Vars') }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: new Error('Missing Env Vars') }),
            order: async () => ({ data: null, error: new Error('Missing Env Vars') })
          })
        })
      })
    } as any;
  }

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
