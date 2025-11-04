import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboard from './admin-dashboard'

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

  if (profile?.role !== 'admin') {
    redirect('/login')
  }

  // Fetch initial data
  const [
    { data: leads },
    { data: services },
    { data: areas },
    { data: commissions },
    { data: supportTickets },
  ] = await Promise.all([
    supabase
      .from('leads')
      .select(`
        *,
        service:services(name),
        referral_link:referral_links(
          slug,
          profiles:user_id(full_name, company_name)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(100),
    supabase
      .from('services')
      .select('*')
      .order('name'),
    supabase
      .from('service_areas')
      .select('*')
      .order('state, county, city'),
    supabase
      .from('commission_tiers')
      .select('*')
      .order('min_amount'),
    supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50),
  ])

  return (
    <AdminDashboard
      initialLeads={leads || []}
      initialServices={services || []}
      initialAreas={areas || []}
      initialCommissions={commissions || []}
      initialTickets={supportTickets || []}
      userEmail={user.email || ''}
    />
  )
}

