import { Eye, ShieldCheck, Zap, BadgeCheck } from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    icon: Eye,
    title: "Fully Transparent",
    description: "See every referral, every status update, every commission in real-time through your personal dashboard."
  },
  {
    icon: ShieldCheck,
    title: "Vetted Contractors",
    description: "Every contractor passes our rigorous 7-point verification before receiving referrals."
  },
  {
    icon: Zap,
    title: "Automated Everything",
    description: "From intake to payout, we handle the heavy lifting so you can focus on relationships."
  }
]

export function WhyTradieBear() {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badge Ribbon */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-3 bg-green-50 border-2 border-green-200 rounded-full px-6 py-3 shadow-sm">
            <BadgeCheck className="w-6 h-6 text-green-600" aria-hidden="true" />
            <span className="font-bold text-green-900">
              Vetted, Verified & Monitored Contractors
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-text-dark mb-6">
            Why TradieBear?
          </h2>
          <p className="text-xl md:text-2xl text-brand-text-muted leading-relaxed max-w-3xl mx-auto">
            Built by pros who understand the frustration of lost referrals
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="bg-gray-50 border-2 border-gray-200 p-8 md:p-10 text-center hover:shadow-xl hover:border-brand-orange hover:-translate-y-1 transition-all duration-300 rounded-xl group"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-brand-orange/10 mb-6 group-hover:bg-brand-orange group-hover:scale-110 transition-all duration-300">
                  <Icon className="h-10 w-10 text-brand-orange group-hover:text-white transition-colors duration-300" aria-hidden="true" />
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-brand-text-dark mb-4 group-hover:text-brand-orange transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-brand-text-muted text-base md:text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Learn More Link */}
        <div className="text-center">
          <Link 
            href="/vetting-process"
            className="inline-flex items-center gap-2 text-lg font-semibold text-brand-orange hover:text-brand-orange-light transition-colors"
          >
            Learn About Our Vetting Process
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

