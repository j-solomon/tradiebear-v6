import { createClient } from '@/lib/supabase/server'
import { Navigation } from '@/components/landing/navigation'
import { HeroSection } from '@/components/service-types/hero-section'
import { AllServicesGrid } from '@/components/service-types/all-services-grid'
import { PopularServices } from '@/components/service-types/popular-services'
import { CommissionStructure } from '@/components/service-types/commission-structure'
import { FinalCTA } from '@/components/landing/final-cta'
import { Footer } from '@/components/landing/footer'

export const metadata = {
  title: "Service Types - TradieBear",
  description: "Comprehensive home improvement service coverage. From roofing to landscaping, earn commissions on every type of home improvement project through TradieBear's network.",
  openGraph: {
    title: "Service Types - TradieBear",
    description: "Earn commissions on every home improvement project with our comprehensive service coverage",
    type: "website",
    url: "https://tradiebear.com/service-types",
  }
}

export default async function ServiceTypesPage() {
  const supabase = await createClient()
  
  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  
  let userRole: 'admin' | 'partner' | null = null
  
  if (user) {
    // Get user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    userRole = profile?.role as 'admin' | 'partner' | null
  }

  // Fetch all services with sub-services
  const { data: services, error } = await supabase
    .from('services')
    .select(`
      id,
      name,
      description,
      sub_services (
        id,
        name,
        description
      )
    `)
    .eq('active', true)
    .order('name', { ascending: true })

  // Fallback services if fetch fails
  const fallbackServices = [
    {
      id: '1',
      name: 'Roofing',
      description: 'Complete roofing solutions from replacement to repair',
      sub_services: []
    }
  ]

  const displayServices = services && services.length > 0 ? services : fallbackServices

  return (
    <div className="min-h-screen">
      <Navigation isLoggedIn={!!user} userRole={userRole} />
      <HeroSection />
      <AllServicesGrid services={displayServices} />
      <PopularServices />
      <CommissionStructure />
      <FinalCTA />
      <Footer />
    </div>
  )
}

