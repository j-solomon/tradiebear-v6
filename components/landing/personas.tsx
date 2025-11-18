import { Card } from '@/components/ui/card'
import { personaData } from '@/lib/landing-data'

export function Personas() {
  return (
    <section className="py-20 md:py-32 bg-brand-gray-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-text-dark mb-4">
            Built For Your Success
          </h2>
          <p className="text-lg md:text-xl text-brand-text-muted max-w-3xl mx-auto">
            Whether you&apos;re growing your business or building a side income, TradieBear fits your goals.
          </p>
        </div>

        {/* Persona Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {personaData.map((persona) => {
            const Icon = persona.icon
            return (
              <div 
                key={persona.title} 
                className="bg-brand-charcoal p-6 hover:shadow-lg transition-shadow rounded-lg border border-gray-800"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-orange/20 mb-4">
                  <Icon className="h-6 w-6 text-brand-orange" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white mb-4">
                  {persona.title}
                </h3>

                {/* Points */}
                <ul className="space-y-2">
                  {persona.points.map((point, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-brand-orange mt-0.5">•</span>
                      <span>{point}</span>
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

