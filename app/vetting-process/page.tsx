import { createClient } from '@/lib/supabase/server'
import { Navigation } from '@/components/landing/navigation'
import { Footer } from '@/components/landing/footer'
import { VettingHero } from '@/components/vetting-process/vetting-hero'
import { NetworkPerformance } from '@/components/vetting-process/network-performance'
import { VerificationStandard } from '@/components/vetting-process/verification-standard'
import { PromiseToReferrers } from '@/components/vetting-process/promise-to-referrers'
import { ReputationSection } from '@/components/vetting-process/reputation-section'
import { VettingCTA } from '@/components/vetting-process/vetting-cta'

export const metadata = {
  title: "Vetting Process - TradieBear",
  description: "Every contractor is vetted, verified, and monitored. Learn about our 7-point verification standard and commitment to quality.",
  openGraph: {
    title: "Vetting Process - TradieBear",
    description: "Refer with confidence. Every contractor meets our industry-leading verification standards.",
    type: "website",
    url: "https://tradiebear.com/vetting-process",
  }
}

export default async function VettingProcessPage() {
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

  return (
    <div className="min-h-screen">
      <Navigation isLoggedIn={!!user} userRole={userRole} />
      <VettingHero />
      <NetworkPerformance />
      <VerificationStandard />
      <PromiseToReferrers />
      <ReputationSection />
      <VettingCTA />
      <Footer />
    </div>
  )
}

