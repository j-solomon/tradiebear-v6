import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PartnerDashboard from './partner-dashboard'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/signup')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'partner') {
    // If admin, redirect to admin dashboard
    if (profile?.role === 'admin') {
      redirect('/admin')
    }
    redirect('/signup')
  }

  // Fetch partner's referral link
  const { data: referralLink } = await supabase
    .from('referral_links')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Fetch partner's leads (leads that came through their referral link)
  let leads: any[] = []
  if (referralLink) {
    const { data: partnerLeads } = await supabase
      .from('leads')
      .select(`
        *,
        service:services(name)
      `)
      .eq('referral_id', referralLink.id)
      .order('created_at', { ascending: false })
      .limit(100)

    leads = partnerLeads || []
  }

  return (
    <PartnerDashboard
      profile={profile}
      referralLink={referralLink}
      initialLeads={leads}
    />
  )
}

