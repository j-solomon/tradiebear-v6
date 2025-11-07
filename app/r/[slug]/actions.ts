'use server'

import { createServiceClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

interface TrackClickParams {
  slug: string
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function trackReferralClick({ slug, searchParams }: TrackClickParams) {
  try {
    // Use service role client to bypass RLS for click tracking
    const supabase = createServiceClient()
    const headersList = await headers()
    
    // Extract IP address (try various headers)
    const forwardedFor = headersList.get('x-forwarded-for')
    const realIp = headersList.get('x-real-ip')
    const ip = forwardedFor?.split(',')[0] || realIp || 'unknown'
    
    // Get User-Agent for bot detection
    const userAgent = headersList.get('user-agent') || ''
    
    // Basic bot detection: require User-Agent
    if (!userAgent) {
      return { success: false, reason: 'No User-Agent' }
    }

    // Get referral link data
    const { data: referralLink, error: linkError } = await supabase
      .from('referral_links')
      .select('id, user_id, click_count, is_active')
      .eq('slug', slug)
      .single()

    if (linkError || !referralLink) {
      return { success: false, reason: 'Link not found' }
    }

    if (!referralLink.is_active) {
      return { success: false, reason: 'Link inactive' }
    }

    // Check rate limit: look for recent clicks from same IP+slug in last 60 seconds
    const sixtySecondsAgo = new Date(Date.now() - 60 * 1000).toISOString()
    
    const { data: recentClicks } = await supabase
      .from('lead_events')
      .select('id')
      .eq('event', 'referral_click')
      .gte('created_at', sixtySecondsAgo)
      .filter('after_snapshot->ip', 'eq', ip)
      .filter('after_snapshot->slug', 'eq', slug)
      .limit(1)

    if (recentClicks && recentClicks.length > 0) {
      // Still return referral_id for cookie, but don't increment
      return { 
        success: true, 
        referral_id: referralLink.id,
        tracked: false,
        reason: 'Rate limited'
      }
    }

    // Extract UTM parameters
    const utmParams = {
      utm_source: searchParams.utm_source as string || null,
      utm_medium: searchParams.utm_medium as string || null,
      utm_campaign: searchParams.utm_campaign as string || null,
      utm_content: searchParams.utm_content as string || null,
      utm_term: searchParams.utm_term as string || null,
    }

    const referer = headersList.get('referer') || null

    // Prepare click event data
    const clickData = {
      ip,
      user_agent: userAgent,
      referer,
      slug,
      referral_link_id: referralLink.id,
      ...utmParams,
      timestamp: new Date().toISOString()
    }

    // Insert click event into lead_events
    await supabase
      .from('lead_events')
      .insert({
        lead_id: null, // No lead yet, just a click
        actor_id: referralLink.user_id,
        event: 'referral_click',
        after_snapshot: clickData
      })

    // Increment click counter and update last_click_at
    await supabase
      .from('referral_links')
      .update({
        click_count: referralLink.click_count + 1,
        last_click_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', referralLink.id)

    return { 
      success: true, 
      referral_id: referralLink.id,
      tracked: true
    }

  } catch {
    return { success: false, reason: 'Server error' }
  }
}

