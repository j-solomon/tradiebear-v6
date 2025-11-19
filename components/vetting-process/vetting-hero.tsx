'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function VettingHero() {
  const scrollToStandard = (e: React.MouseEvent) => {
    e.preventDefault()
    const element = document.getElementById('verification-standard')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="bg-brand-cream py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white border border-brand-orange/20 rounded-full px-4 py-2 mb-6">
          <span className="w-2 h-2 bg-brand-orange rounded-full"></span>
          <span className="text-sm font-medium text-brand-text-dark">Industry-Leading Standards</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-bold text-brand-text-dark mb-6 leading-tight">
          Refer with confidence. Every contractor{' '}
          <span className="text-brand-orange">is vetted, verified, and monitored.</span>
        </h1>

        {/* Subtext */}
        <p className="text-lg text-brand-text-muted mb-8 max-w-3xl mx-auto">
          Modeled after industry-leading verification standards—so your reputation stays protected.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/signup">
            <Button 
              size="lg" 
              className="bg-brand-orange hover:bg-brand-orange-light text-white px-8"
            >
              Start Referring Today
            </Button>
          </Link>
          <button
            onClick={scrollToStandard}
            className="text-brand-text-dark font-semibold hover:text-brand-orange transition-colors flex items-center gap-2"
          >
            See Our 7-Point Standard
            <span className="text-brand-orange">↓</span>
          </button>
        </div>
      </div>
    </section>
  )
}

