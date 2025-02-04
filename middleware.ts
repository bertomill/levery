import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/register', '/auth/callback']

export async function middleware(request: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ 
      req: request, 
      res,
    })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const isPublicRoute = PUBLIC_ROUTES.includes(request.nextUrl.pathname)

    // Handle public routes
    if (isPublicRoute) {
      if (session) {
        return NextResponse.redirect(new URL('/', request.url))
      }
      return res
    }

    // If no session, redirect to login
    if (!session) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Check if user needs to complete onboarding
    if (request.nextUrl.pathname !== '/onboarding') {
      const { data: profile, error } = await supabase
        .from('users')
        .select('full_name, industry, goals')
        .eq('id', session.user.id)
        .single()

      if (error || !profile?.full_name || !profile?.industry || !profile?.goals) {
        return NextResponse.redirect(new URL('/onboarding', request.url))
      }
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth/callback (Supabase auth callback)
     * - logo.svg (logo file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth/callback|logo.svg).*)',
  ],
}