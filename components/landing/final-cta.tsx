import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function FinalCTA() {
  return (
    <section className="py-20 md:py-32 bg-brand-orange">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          Ready to Start Earning?
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join TradieBear today and turn your professional network into a reliable revenue stream
        </p>

        {/* CTA Button */}
        <Link href="/signup">
          <Button 
            size="lg" 
            className="bg-white text-brand-orange hover:bg-gray-100 px-8 py-6 text-lg font-semibold"
          >
            Create Free Account
          </Button>
        </Link>

        {/* Fine Print */}
        <p className="text-white/80 text-sm mt-6">
          No credit card required • Start earning immediately
        </p>
      </div>
    </section>
  )
}

