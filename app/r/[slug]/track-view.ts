'use server'

import { createServiceClient } from '@/lib/supabase/server'

interface TrackPageViewData {
  referralLinkId: string
  pageType: string
  userAgent?: string
}

/**
 * Track a page view in the page_views table
 * Used for DAU metrics and analytics
 */
export async function trackPageView(data: TrackPageViewData) {
  const supabase = createServiceClient() // Use service role to bypass RLS
  
  try {
    const { error } = await supabase
      .from('page_views')
      .insert({
        referral_link_id: data.referralLinkId,
        page_type: data.pageType,
        user_agent: data.userAgent || null,
        created_at: new Date().toISOString()
      })

    if (error) {
      console.error('Failed to track page view:', error)
      // Don't throw error - tracking failures shouldn't break the user experience
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error in trackPageView:', error)
    return { success: false, error: error.message }
  }
}

