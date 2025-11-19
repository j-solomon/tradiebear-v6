import { createClient } from '@/lib/supabase/server'
import { Navigation } from '@/components/landing/navigation'
import { HeroSection } from '@/components/how-it-works/hero-section'
import { ProcessSteps } from '@/components/how-it-works/process-steps'
import { WhyChoose } from '@/components/how-it-works/why-choose'
import { FinalCTA } from '@/components/landing/final-cta'
import { Footer } from '@/components/landing/footer'

export const metadata = {
  title: "How It Works - TradieBear",
  description: "Learn how TradieBear's simple 4-step process turns your professional network into a reliable revenue stream. From sign-up to commission payout.",
  openGraph: {
    title: "How It Works - TradieBear",
    description: "Four simple steps from sign-up to payout. Turn your professional network into a reliable revenue stream.",
    type: "website",
    url: "https://tradiebear.com/how-it-works",
  }
}

export default async function HowItWorksPage() {
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
      <HeroSection />
      <ProcessSteps />
      <WhyChoose />
      <FinalCTA />
      <Footer />
    </div>
  )
}

