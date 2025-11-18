import Link from 'next/link'
import { howItWorksSteps } from '@/lib/landing-data'

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-text-dark mb-4">
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-brand-text-muted">
            Four simple steps from sign-up to payout
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {howItWorksSteps.map((step) => (
            <div key={step.number} className="text-center">
              {/* Number Circle */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-orange/10 text-brand-orange text-2xl font-bold mb-4">
                {step.number}
              </div>
              
              {/* Step Content */}
              <h3 className="text-xl font-semibold text-brand-text-dark mb-2">
                {step.title}
              </h3>
              <p className="text-brand-text-muted">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Link */}
        <div className="text-center">
          <Link 
            href="#faq" 
            className="inline-block text-brand-orange hover:text-brand-orange-light font-semibold transition-colors"
          >
            View Detailed Process →
          </Link>
        </div>
      </div>
    </section>
  )
}

