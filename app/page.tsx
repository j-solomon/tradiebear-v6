import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Navigation } from '@/components/landing/navigation'
import { Hero } from '@/components/landing/hero'
import { Comparison } from '@/components/landing/comparison'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Personas } from '@/components/landing/personas'
import { Services } from '@/components/landing/services'
import { WhyTradieBear } from '@/components/landing/why-tradiebear'
import { Verification } from '@/components/landing/verification'
import { FAQ } from '@/components/landing/faq'
import { FinalCTA } from '@/components/landing/final-cta'
import { Footer } from '@/components/landing/footer'

export const metadata = {
  title: "TradieBear - Earn Commissions by Connecting Homeowners with Trusted Contractors",
  description: "No lead roulette. TradieBear tracks every referral from submission to commission across all home services—roofing, remodeling, plumbing, electrical, and more.",
  openGraph: {
    title: "TradieBear - Contractor Referral Platform",
    description: "Earn commissions by referring quality contractors for home improvement projects",
    type: "website",
    url: "https://tradiebear.com",
  }
}

export default async function Home() {
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

  // Fetch featured services from database (for homepage display)
  const { data: services, error } = await supabase
    .from('services')
    .select('id, name, description')
    .eq('featured', true)
    .order('display_order', { ascending: true })
    .limit(12)

  // Fallback services if fetch fails
  const fallbackServices = [
    { id: '1', name: 'Roofing', description: 'New roofs, repairs, replacements' },
    { id: '2', name: 'Remodels', description: 'Kitchen & bathroom renovations' },
    { id: '3', name: 'Windows & Doors', description: 'Window & doors installation & replacement' },
    { id: '4', name: 'ADUs', description: 'Accessory dwelling unit construction' },
    { id: '5', name: 'Garage Doors', description: 'Garage door installation and repair' },
    { id: '6', name: 'Carpet Cleaning', description: 'Professional carpet cleaning services' },
    { id: '7', name: 'Decks & Fences', description: 'Deck, pergola, and fencing builds' },
    { id: '8', name: 'Flooring', description: 'LVP, hardwood, tile, and carpet installs' },
    { id: '9', name: 'Plumbing & Electrical', description: 'Repairs, installations, upgrades' },
    { id: '10', name: 'Siding', description: 'Exterior siding installation' },
    { id: '11', name: 'Barns', description: 'Agricultural & storage buildings' },
    { id: '12', name: '& More', description: 'Additional home improvement services' }
  ]

  const displayServices = services || fallbackServices

  return (
    <div className="min-h-screen">
      <Navigation isLoggedIn={!!user} userRole={userRole} />
      <Hero />
      <Comparison />
      <HowItWorks />
      <Personas />
      <Services services={displayServices} />
      <WhyTradieBear />
      <Verification />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  )
}
