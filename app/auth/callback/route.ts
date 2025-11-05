import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next')
  
  // Check if this is a password recovery flow
  const type = requestUrl.searchParams.get('type')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      // Redirect to login with error
      return NextResponse.redirect(new URL('/login?error=auth_callback_error', requestUrl.origin))
    }
  }

  // If this is a password recovery, redirect to reset password page
  if (type === 'recovery') {
    return NextResponse.redirect(new URL('/reset-password', requestUrl.origin))
  }

  // Otherwise redirect to the requested page or admin dashboard
  const redirectTo = next || '/admin'
  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
}

