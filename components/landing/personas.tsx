import { Home, DollarSign, Wrench, TrendingUp, CheckCircle2 } from 'lucide-react'

export function Personas() {
  const personas = [
    {
      title: "Real Estate Agents",
      icon: Home,
      points: [
        "Add value for clients post-closing",
        "Build deeper relationships",
        "Earn passive income from your network",
        "Become the go-to resource"
      ]
    },
    {
      title: "Loan Officers",
      icon: DollarSign,
      points: [
        "Help homeowners maximize their investment",
        "Stay top-of-mind after closing",
        "Generate referral revenue",
        "Strengthen your referral network"
      ]
    },
    {
      title: "Contractors & Side-Income Earners",
      icon: Wrench,
      subtitle: "Perfect for professionals and entrepreneurs",
      points: [
        "Refer jobs outside your specialty",
        "Zero upfront investment",
        "Work on your own schedule",
        "Monetize leads you can't take",
        "Leverage your existing connections",
        "Scale earnings with your network"
      ]
    }
  ]

  return (
    <section className="py-20 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-text-dark mb-6">
            Built For Your Success
          </h2>
          <p className="text-xl md:text-2xl text-brand-text-muted max-w-3xl mx-auto leading-relaxed">
            Whether you&apos;re growing your business or building a side income, TradieBear fits your goals.
          </p>
        </div>

        {/* Persona Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {personas.map((persona) => {
            const Icon = persona.icon
            return (
              <div
                key={persona.title}
                className="bg-white p-8 md:p-10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-xl border-2 border-gray-200 flex flex-col h-full group"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-brand-orange/10 mb-6 group-hover:bg-brand-orange group-hover:scale-110 transition-all duration-300">
                  <Icon className="h-8 w-8 text-brand-orange group-hover:text-white transition-colors duration-300" aria-hidden="true" />
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-brand-text-dark mb-2 group-hover:text-brand-orange transition-colors">
                  {persona.title}
                </h3>

                {/* Subtitle if exists */}
                {persona.subtitle && (
                  <p className="text-sm text-brand-text-muted mb-4 italic">
                    {persona.subtitle}
                  </p>
                )}

                {/* Points */}
                <ul className="space-y-3 mt-4 flex-grow">
                  {persona.points.map((point, index) => (
                    <li key={index} className="flex items-start gap-3 text-base text-brand-text-muted">
                      <CheckCircle2 className="h-5 w-5 text-brand-orange flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

