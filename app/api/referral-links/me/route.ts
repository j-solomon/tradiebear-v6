import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch user's referral link
    const { data: referralLink, error: linkError } = await supabase
      .from('referral_links')
      .select(`
        *,
        profiles:user_id (
          name,
          handle,
          email
        )
      `)
      .eq('user_id', user.id)
      .single()

    if (linkError) {
      // If no link exists, return null (will be created by trigger on next profile update)
      if (linkError.code === 'PGRST116') {
        return NextResponse.json({
          success: true,
          data: null,
          message: 'No referral link found. Contact admin to generate one.'
        })
      }

      console.error('Error fetching referral link:', linkError)
      return NextResponse.json(
        { error: 'Failed to fetch referral link' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: referralLink
    })

  } catch (error) {
    console.error('Error in me referral link API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

