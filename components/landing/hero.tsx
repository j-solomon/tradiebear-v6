import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="bg-brand-cream py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-text-dark leading-tight">
            Earn Commissions for Connecting Homeowners with{' '}
            <span className="text-brand-orange">Trusted Contractors</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-brand-text-muted">
            No lead roulette. You share a link—we handle matching, scheduling, and payouts.
          </p>

          {/* Description */}
          <p className="text-lg text-brand-text-muted max-w-3xl mx-auto">
            Stop losing referrals in the shuffle. TradieBear tracks every lead from submission to 
            commission across all home services—roofing, remodeling, plumbing, electrical, and more.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/signup">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-brand-orange hover:bg-brand-orange-light text-white px-8 py-6 text-lg"
              >
                Start Earning Today
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white px-8 py-6 text-lg"
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

