import { Shield, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Verification() {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-cream border border-brand-orange/20 rounded-2xl p-8 md:p-12 text-center">
          {/* Icons */}
          <div className="flex justify-center items-center gap-3 mb-6">
            <Shield className="h-8 w-8 text-brand-orange" />
            <ShieldCheck className="h-8 w-8 text-green-600" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-brand-text-dark mb-4">
            Refer with confidence. Every contractor is vetted, verified, and monitored.
          </h2>

          {/* Description */}
          <p className="text-lg text-brand-text-muted mb-8 max-w-2xl mx-auto">
            Modeled after industry-leading verification standards—so your reputation stays protected.
          </p>

          {/* CTA */}
          <Link href="#faq">
            <Button className="bg-brand-orange hover:bg-brand-orange-light text-white px-8">
              See Our 7-Point Standard →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

