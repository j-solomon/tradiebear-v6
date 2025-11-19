import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { getServiceIcon } from '@/lib/landing-data'

interface Service {
  id: string
  name: string
  description?: string
}

interface ServicesProps {
  services: Service[]
}

export function Services({ services }: ServicesProps) {
  // Limit to 12 services for display
  const displayServices = services.slice(0, 12)

  return (
    <section id="services" className="py-20 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-text-dark mb-6">
            Services We Cover
          </h2>
          <p className="text-xl md:text-2xl text-brand-text-muted max-w-3xl mx-auto leading-relaxed">
            From roofing to remodels, earn commissions on every home improvement project
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayServices.map((service) => {
            const Icon = getServiceIcon(service.name)
            const isMoreCard = service.name === '& More'
            
            const cardContent = (
              <>
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-brand-orange/10 mb-4 group-hover:bg-brand-orange group-hover:scale-110 transition-all duration-300">
                  <Icon className="h-8 w-8 text-brand-orange group-hover:text-white transition-colors duration-300" aria-hidden="true" />
                </div>

                {/* Service Name */}
                <h3 className="text-lg md:text-xl font-bold text-brand-text-dark mb-2 group-hover:text-brand-orange transition-colors">
                  {service.name}
                </h3>

                {/* Service Description */}
                {service.description && (
                  <p className="text-sm text-brand-text-muted line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                )}
              </>
            )
            
            return isMoreCard ? (
              <Link 
                key={service.id}
                href="/service-types"
                className="bg-white p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-lg border border-gray-200 text-center cursor-pointer group"
              >
                {cardContent}
                <p className="text-sm text-brand-orange font-bold mt-4 group-hover:underline flex items-center justify-center gap-1">
                  View all services 
                  <span aria-hidden="true">→</span>
                </p>
              </Link>
            ) : (
              <div 
                key={service.id} 
                className="bg-white p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-lg border border-gray-200 text-center group"
              >
                {cardContent}
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link 
            href="/service-types"
            className="inline-flex items-center gap-2 text-lg font-semibold text-brand-orange hover:text-brand-orange-light transition-colors"
          >
            View All 27 Service Categories
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

