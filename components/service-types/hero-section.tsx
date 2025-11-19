import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="py-20 md:py-32 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-text-dark mb-6">
            Comprehensive Home Improvement{' '}
            <span className="text-brand-orange">Service Types</span>
          </h1>
          <p className="text-lg md:text-xl text-brand-text-muted mb-8">
            From roofing to landscaping, connect homeowners with verified contractors for
            every type of home improvement project through TradieBear&apos;s network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-brand-orange hover:bg-brand-orange-light text-white px-8">
                Start Referring Today
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="px-8">
                View Our Process
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

