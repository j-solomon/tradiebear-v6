import { Home, Wrench } from 'lucide-react'
import { popularServices } from '@/lib/service-types-data'

export function PopularServices() {
  return (
    <section className="py-20 md:py-32 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Icons */}
        <div className="flex justify-center gap-3 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-orange/10">
            <Home className="h-6 w-6 text-brand-orange" />
          </div>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-orange/10">
            <Wrench className="h-6 w-6 text-brand-orange" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-text-dark mb-4">
            Most Popular: Roofing & Exterior Services
          </h2>
          <p className="text-lg text-brand-text-muted max-w-3xl mx-auto">
            Over 60% of our referrals are for roofing, siding, and exterior home improvements.
            These high-value projects offer the best commission opportunities for referrers.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {popularServices.map((service) => (
            <div
              key={service.name}
              className="bg-white p-6 rounded-lg border border-gray-200 text-center"
            >
              <h3 className="text-xl font-bold text-brand-orange mb-2">
                {service.name}
              </h3>
              <p className="text-sm text-brand-text-muted">
                Average project: {service.averageProject}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

