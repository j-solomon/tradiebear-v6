'use server'

import { createClient, createServiceClient } from '@/lib/supabase/server'

interface SignupData {
  name: string
  email: string
  business_name?: string
  phone?: string
  password: string
  marketing_consent: boolean
}

export async function signupPartner(data: SignupData) {
  try {
    const supabase = await createClient()

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/
    if (!passwordRegex.test(data.password)) {
      return {
        error: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
      }
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', data.email)
      .single()

    if (existingUser) {
      return {
        error: 'An account with this email already exists'
      }
    }

    // Create auth user with email verification
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?type=signup`,
        data: {
          full_name: data.name,
          business_name: data.business_name || null,
          phone: data.phone || null,
          marketing_consent: data.marketing_consent,
        }
      }
    })

    if (signUpError) {
      console.error('Signup error:', signUpError)
      return {
        error: signUpError.message
      }
    }

    if (!authData.user) {
      return {
        error: 'Failed to create account'
      }
    }

    // Insert profile with role='partner' using service role to bypass RLS
    // Note: The user won't be able to login until they verify their email
    const supabaseAdmin = createServiceClient()
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: data.email,
        name: data.name,
        business_name: data.business_name || null,
        handle: data.name.toLowerCase().replace(/\s+/g, '-'),
        phone: data.phone || null,
        role: 'partner',
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      return {
        error: 'Account created but profile setup failed. Please contact support.'
      }
    }

    // The Postgres trigger will automatically create a referral_link
    // when the profile is inserted

    return {
      success: true,
      message: 'Verification email sent. Please check your inbox.'
    }

  } catch (error: any) {
    console.error('Signup error:', error)
    return {
      error: error.message || 'An unexpected error occurred'
    }
  }
}

