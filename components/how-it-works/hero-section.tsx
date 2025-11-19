import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="py-20 md:py-32 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-text-dark mb-6">
            How TradieBear Works
          </h1>
          <p className="text-lg md:text-xl text-brand-text-muted mb-8">
            Four simple steps from sign-up to payout. Turn your professional network into a reliable revenue stream.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-brand-orange hover:bg-brand-orange-light text-white px-8">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

