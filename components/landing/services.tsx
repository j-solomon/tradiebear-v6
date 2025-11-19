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
    <section id="services" className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-text-dark mb-4">
            Services We Cover
          </h2>
          <p className="text-lg md:text-xl text-brand-text-muted max-w-3xl mx-auto">
            From roofing to remodels, earn commissions on every home improvement project
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayServices.map((service) => {
            const Icon = getServiceIcon(service.name)
            return (
              <div 
                key={service.id} 
                className="bg-white p-6 hover:shadow-lg transition-shadow rounded-lg border border-gray-200 text-center"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-orange/10 mb-4">
                  <Icon className="h-6 w-6 text-brand-orange" />
                </div>

                {/* Service Name */}
                <h3 className="text-lg font-semibold text-brand-text-dark mb-2">
                  {service.name}
                </h3>

                {/* Service Description */}
                {service.description && (
                  <p className="text-sm text-brand-text-muted line-clamp-2">
                    {service.description}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

