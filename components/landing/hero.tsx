import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Shield, Network, CheckCircle2 } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-brand-cream via-brand-cream to-brand-cream/80 py-20 md:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, #FF6B35 1px, transparent 0)',
        backgroundSize: '48px 48px'
      }} aria-hidden="true" />
      
      {/* Supporting Icons */}
      <div className="absolute top-20 right-10 opacity-10 hidden lg:block" aria-hidden="true">
        <Shield className="w-32 h-32 text-brand-orange" />
      </div>
      <div className="absolute bottom-20 left-10 opacity-10 hidden lg:block" aria-hidden="true">
        <Network className="w-24 h-24 text-brand-orange" />
      </div>
      <div className="absolute top-1/2 right-20 opacity-10 hidden lg:block" aria-hidden="true">
        <CheckCircle2 className="w-20 h-20 text-brand-orange" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-text-dark leading-tight">
            Earn Commissions for Connecting Homeowners with{' '}
            <span className="text-brand-orange">Trusted Contractors</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-brand-text-dark font-medium">
            No lead roulette. You share a link—we handle matching, scheduling, and payouts.
          </p>

          {/* Description */}
          <p className="text-lg text-brand-text-muted max-w-3xl mx-auto leading-relaxed">
            Stop losing referrals in the shuffle. TradieBear tracks every lead from submission to 
            commission across all home services—roofing, remodeling, plumbing, electrical, and more.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Link href="/signup">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-brand-orange hover:bg-brand-orange-light text-white px-10 py-7 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start Earning Today
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white px-10 py-7 text-lg font-semibold transition-all duration-300"
              >
                See How It Works
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

