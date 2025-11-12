import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboard from './admin-dashboard'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin' && profile?.role !== 'partner') {
    redirect('/login')
  }

  const userRole = profile?.role || 'partner'

  // Fetch initial data
  const [
    { data: leads },
    { data: services },
    { data: areas },
    { data: commissions },
    { data: supportTickets },
    { data: referralLinks },
  ] = await Promise.all([
    supabase
      .from('leads')
      .select(`
        *,
        sub_service:sub_services!sub_service_id(
          id,
          name,
          description,
          service:services(id, name)
        ),
        referral_link:referral_links!referral_id(
          slug,
          profiles:user_id(name, handle, email)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(100),
    supabase
      .from('services')
      .select('*')
      .order('name', { ascending: true }),
    supabase
      .from('service_area_map')
      .select(`
        id,
        state_code,
        zip_code,
        created_at,
        sub_service:sub_services!sub_service_id(
          id,
          name,
          slug,
          description,
          service:services(name)
        ),
        state:geo_states!state_code(
          code,
          name
        ),
        county:geo_counties!county_id(
          id,
          name
        ),
        city:geo_cities!city_id(
          id,
          name
        )
      `)
      .order('sub_service_id', { ascending: true })
      .order('zip_code', { ascending: true }),
    supabase
      .from('commission_tiers')
      .select('*')
      .order('min_amount'),
    supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50),
    // Fetch referral links - admins see all, partners see only their own
    userRole === 'admin'
      ? supabase
          .from('referral_links')
          .select(`
            *,
            profiles:user_id (
              name,
              handle,
              email
            )
          `)
          .order('created_at', { ascending: false })
      : supabase
          .from('referral_links')
          .select(`
            *,
            profiles:user_id (
              name,
              handle,
              email
            )
          `)
          .eq('user_id', user.id),
  ])

  return (
    <AdminDashboard
      initialLeads={leads || []}
      initialServices={services || []}
      initialAreas={areas || []}
      initialCommissions={commissions || []}
      initialTickets={supportTickets || []}
      initialReferralLinks={referralLinks || []}
      userEmail={user.email || ''}
      userRole={userRole}
    />
  )
}

