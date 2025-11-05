import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const isPublicRoute = 
    pathname.startsWith('/r/') || 
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/reset-password' ||
    pathname.startsWith('/auth/') ||
    pathname === '/' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api')

  // Update Supabase session
  const response = await updateSession(request)

  // If not a public route, check authentication
  if (!isPublicRoute) {
    const supabase = await import('@/lib/supabase/server').then(m => m.createClient())
    const client = await supabase
    const { data: { user } } = await client.auth.getUser()

    if (!user) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Check if user has admin role for admin routes
    if (pathname.startsWith('/admin')) {
      const { data: profile } = await client
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

