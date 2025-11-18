import { Clock, Users, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'

const features = [
  {
    icon: Clock,
    title: "Full Transparency",
    description: "See every referral, every status update, every commission in real-time."
  },
  {
    icon: Users,
    title: "Vetted Contractors",
    description: "We pre-screen all contractors for licensing, insurance, and quality work."
  },
  {
    icon: Zap,
    title: "Automated Everything",
    description: "From intake to payout, we handle the heavy lifting so you can focus on relationships."
  }
]

export function WhyTradieBear() {
  return (
    <section className="py-20 md:py-32 bg-brand-gray-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-text-dark mb-4">
            Why TradieBear?
          </h2>
          <p className="text-lg md:text-xl text-brand-text-muted">
            Built by pros who understand the frustration of lost referrals
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div 
                key={feature.title} 
                className="bg-brand-charcoal p-8 text-center hover:shadow-lg transition-shadow rounded-lg border border-gray-800"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-orange/20 mb-6">
                  <Icon className="h-8 w-8 text-brand-orange" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

