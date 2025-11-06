import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify admin role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      )
    }

    // Get user_id from request body
    const { user_id } = await request.json()

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      )
    }

    // Get the target user's profile data for slug generation
    const { data: targetProfile, error: targetError } = await supabase
      .from('profiles')
      .select('name, business_name, email')
      .eq('id', user_id)
      .single()

    if (targetError || !targetProfile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Generate new slug using Postgres function with human-friendly parameters
    const { data: slugData, error: slugError } = await supabase
      .rpc('gen_referral_slug', { 
        full_name: targetProfile.name,
        business_name: targetProfile.business_name,
        email: targetProfile.email
      })

    if (slugError) {
      console.error('Error generating slug:', slugError)
      return NextResponse.json(
        { error: 'Failed to generate slug' },
        { status: 500 }
      )
    }

    const newSlug = slugData as string

    // Check if user already has a referral link
    const { data: existingLink } = await supabase
      .from('referral_links')
      .select('id')
      .eq('user_id', user_id)
      .single()

    let result

    if (existingLink) {
      // Update existing link with new slug
      const { data, error } = await supabase
        .from('referral_links')
        .update({
          slug: newSlug,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user_id)
        .select(`
          *,
          profiles:user_id (
            name,
            handle,
            email
          )
        `)
        .single()

      if (error) {
        console.error('Error updating referral link:', error)
        return NextResponse.json(
          { error: 'Failed to update referral link' },
          { status: 500 }
        )
      }

      result = data
    } else {
      // Create new referral link
      const { data, error } = await supabase
        .from('referral_links')
        .insert({
          user_id,
          slug: newSlug,
          clicks: 0,
          is_active: true
        })
        .select(`
          *,
          profiles:user_id (
            name,
            handle,
            email
          )
        `)
        .single()

      if (error) {
        console.error('Error creating referral link:', error)
        return NextResponse.json(
          { error: 'Failed to create referral link' },
          { status: 500 }
        )
      }

      result = data
    }

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('Error in generate referral link API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

