import { Shield, ShieldCheck, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Verification() {
  return (
    <section className="py-20 md:py-32 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-brand-cream via-brand-cream to-orange-50 border-2 border-brand-orange/30 rounded-2xl p-10 md:p-16 text-center shadow-xl">
          {/* Icons */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-xl bg-brand-orange/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-brand-orange" aria-hidden="true" />
            </div>
            <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
              <ShieldCheck className="h-8 w-8 text-green-600" aria-hidden="true" />
            </div>
            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-blue-600" aria-hidden="true" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-text-dark mb-6 leading-tight">
            Refer with confidence. Every contractor is vetted, verified, and monitored.
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-brand-text-muted mb-10 max-w-3xl mx-auto leading-relaxed">
            Modeled after industry-leading verification standards—so your reputation stays protected and your clients receive exceptional service.
          </p>

          {/* CTA */}
          <Link href="/vetting-process">
            <Button 
              size="lg"
              className="bg-brand-orange hover:bg-brand-orange-light text-white px-10 py-7 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              See Our 7-Point Standard
              <span className="ml-2" aria-hidden="true">→</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

