import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function FinalCTA() {
  return (
    <section className="relative py-24 md:py-36 bg-gradient-to-br from-brand-orange via-brand-orange to-orange-700 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
        backgroundSize: '32px 32px'
      }} aria-hidden="true" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8">
          Ready to Start Earning?
        </h2>

        {/* Description */}
        <p className="text-xl md:text-2xl text-white/95 mb-10 max-w-3xl mx-auto leading-relaxed">
          Join TradieBear today and turn your professional network into a reliable revenue stream
        </p>

        {/* CTA Button */}
        <Link href="/signup">
          <Button 
            size="lg" 
            className="bg-white text-brand-orange hover:bg-gray-50 px-12 py-8 text-xl font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
          >
            Create Free Account
          </Button>
        </Link>

        {/* Trust Note */}
        <p className="text-white/90 text-base md:text-lg mt-8 font-medium">
          No spam. No cold calling. Simple referral earnings.
        </p>

        {/* Fine Print */}
        <p className="text-white/75 text-sm mt-4">
          No credit card required • Start earning immediately
        </p>
      </div>
    </section>
  )
}

