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
    // Validate required fields are not empty
    if (!data.name || data.name.trim().length === 0) {
      return {
        error: 'Full name is required'
      }
    }

    if (!data.email || data.email.trim().length === 0) {
      return {
        error: 'Email is required'
      }
    }

    if (!data.password || data.password.length === 0) {
      return {
        error: 'Password is required'
      }
    }

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
    // Trim all string fields to prevent whitespace-only values
    const trimmedName = data.name.trim()
    const trimmedBusinessName = data.business_name?.trim() || null
    const trimmedPhone = data.phone?.trim() || null
    
    const supabaseAdmin = createServiceClient()
    
    // First check if profile already exists (from auth trigger)
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', authData.user.id)
      .single()

    if (existingProfile) {
      // Profile already exists (created by trigger), just update it
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({
          email: data.email.trim().toLowerCase(),
          name: trimmedName,
          business_name: trimmedBusinessName,
          handle: trimmedName.toLowerCase().replace(/\s+/g, '-'),
          phone: trimmedPhone,
          role: 'partner',
        })
        .eq('id', authData.user.id)

      if (updateError) {
        console.error('Profile update error:', updateError)
        return {
          error: 'Account created but profile setup failed. Please contact support.'
        }
      }

      // Since UPDATE doesn't trigger AFTER INSERT, manually create referral link if missing
      const { data: existingLink } = await supabaseAdmin
        .from('referral_links')
        .select('id')
        .eq('user_id', authData.user.id)
        .single()

      if (!existingLink) {
        // Generate and insert referral link
        const { data: slugData, error: slugError } = await supabaseAdmin
          .rpc('gen_referral_slug', {
            full_name: trimmedName,
            business_name: trimmedBusinessName,
            email: data.email.trim().toLowerCase()
          })

        if (!slugError && slugData) {
          await supabaseAdmin
            .from('referral_links')
            .insert({
              user_id: authData.user.id,
              slug: slugData as string,
              click_count: 0,
              is_active: true
            })
        }
      }
    } else {
      // Profile doesn't exist, insert it
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: data.email.trim().toLowerCase(),
          name: trimmedName,
          business_name: trimmedBusinessName,
          handle: trimmedName.toLowerCase().replace(/\s+/g, '-'),
          phone: trimmedPhone,
          role: 'partner',
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        return {
          error: 'Account created but profile setup failed. Please contact support.'
        }
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

