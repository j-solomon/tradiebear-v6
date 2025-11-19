import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboard from './admin-dashboard'
import { getAllMetrics } from './components/metrics/metrics-queries'

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

  // Fetch initial data including metrics
  const [
    metricsData,
    { data: leads },
    { data: services },
    { data: supportTickets },
    { data: referralLinks },
  ] = await Promise.all([
    getAllMetrics(supabase),
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
      .select(`
        *,
        service_commissions!service_id(
          id,
          percentage,
          created_at
        ),
        sub_services(
          *,
          service_commissions!sub_service_id(
            id,
            percentage,
            created_at
          )
        )
      `)
      .order('display_order', { ascending: true }),
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
      metricsData={metricsData}
      initialLeads={leads || []}
      initialServices={services || []}
      initialTickets={supportTickets || []}
      initialReferralLinks={referralLinks || []}
      userEmail={user.email || ''}
      userRole={userRole}
    />
  )
}

