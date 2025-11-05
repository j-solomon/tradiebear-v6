import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')
  const next = requestUrl.searchParams.get('next')
  const code = requestUrl.searchParams.get('code')

  if (token_hash && type) {
    const supabase = await createClient()
    
    // Exchange the token hash for a session
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type === 'recovery' ? 'recovery' : 'email',
    })

    if (error) {
      console.error('Error verifying token:', error)
      return NextResponse.redirect(new URL('/login?error=auth_callback_error', requestUrl.origin))
    }

    // If this is password recovery, go to reset password page
    if (type === 'recovery') {
      return NextResponse.redirect(new URL('/reset-password', requestUrl.origin))
    }
  }

  // Handle code-based auth (for other flows)
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(new URL('/login?error=auth_callback_error', requestUrl.origin))
    }
  }

  // Redirect to the requested page or admin dashboard
  const redirectTo = next || '/admin'
  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
}

