import { Shield, BarChart3, Eye, ShieldCheck } from 'lucide-react'

export function PromiseToReferrers() {
  const promises = [
    {
      icon: ShieldCheck,
      title: 'Verified professionals only',
      description: 'Every contractor passes our 7-point verification before receiving referrals.'
    },
    {
      icon: BarChart3,
      title: 'Performance monitored monthly',
      description: 'We track response times, completion rates, and customer satisfaction continuously.'
    },
    {
      icon: Eye,
      title: 'Transparent status & payouts',
      description: 'Track every referral from submission to commission in your real-time dashboard.'
    },
    {
      icon: Shield,
      title: 'We protect your reputation',
      description: 'Any contractor who falls below standards is automatically paused from new referrals.'
    }
  ]

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-text-dark">
            Our Promise to Referrers
          </h2>
        </div>

        {/* Promise Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {promises.map((promise, index) => {
            const Icon = promise.icon
            return (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6 text-center"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-orange/10 mb-4">
                  <Icon className="w-7 h-7 text-brand-orange" />
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-brand-text-dark mb-3">
                  {promise.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-brand-text-muted leading-relaxed">
                  {promise.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

