import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function VettingCTA() {
  return (
    <section className="py-20 md:py-24 bg-brand-orange">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Headline */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Start Referring with Confidence
        </h2>

        {/* Subtext */}
        <p className="text-lg text-white/90 mb-8">
          Join TradieBear and connect homeowners with verified, monitored contractors
        </p>

        {/* CTA Button */}
        <Link href="/signup">
          <Button 
            size="lg" 
            className="bg-white text-brand-orange hover:bg-gray-100 px-8 font-semibold"
          >
            Create Free Account
          </Button>
        </Link>
      </div>
    </section>
  )
}

