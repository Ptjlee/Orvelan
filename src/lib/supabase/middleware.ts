import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Refresh session if expired - required for Server Components
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Rescue Supabase edge-cases where email links drop to root domain without /auth/callback path
    if (request.nextUrl.pathname === '/' && request.nextUrl.searchParams.has('code')) {
      const authUrl = request.nextUrl.clone()
      authUrl.pathname = '/auth/callback'
      // It keeps the search params (like code) intact automatically because it clones nextUrl
      return NextResponse.redirect(authUrl)
    }

    // Protect the diagnostic and portal routes
    if (!user) {
      if (request.nextUrl.pathname.startsWith('/diagnostic')) {
        const url = request.nextUrl.clone()
        url.pathname = '/register'
        return NextResponse.redirect(url)
      }
      if (request.nextUrl.pathname.startsWith('/portal')) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
      }
    }
  } catch (error) {
    console.error('Middleware Supabase Error:', error);
    // If there's an error (like missing env vars), allow the request to proceed so the app doesn't crash completely
    return NextResponse.next({ request });
  }

  return supabaseResponse
}
