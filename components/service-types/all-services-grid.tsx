'use client'

import { useState } from 'react'
import { getServiceIcon } from '@/lib/service-types-data'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface SubService {
  id: string
  name: string
  description?: string
}

interface Service {
  id: string
  name: string
  description?: string
  sub_services?: SubService[]
}

interface AllServicesGridProps {
  services: Service[]
}

export function AllServicesGrid({ services }: AllServicesGridProps) {
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set())

  const toggleExpanded = (serviceId: string) => {
    setExpandedServices(prev => {
      const newSet = new Set(prev)
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId)
      } else {
        newSet.add(serviceId)
      }
      return newSet
    })
  }

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-text-dark mb-4">
            All Service Types We Cover
          </h2>
          <p className="text-lg md:text-xl text-brand-text-muted max-w-3xl mx-auto">
            Earn commissions on every home improvement project with our comprehensive
            service coverage
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = getServiceIcon(service.name)
            const subServices = service.sub_services || []
            const isExpanded = expandedServices.has(service.id)
            const visibleSubServices = isExpanded ? subServices : subServices.slice(0, 4)
            const hasMore = subServices.length > 4

            return (
              <div
                key={service.id}
                className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-orange/10 mb-4">
                  <Icon className="h-6 w-6 text-brand-orange" />
                </div>

                {/* Service Name */}
                <h3 className="text-xl font-bold text-brand-text-dark mb-2">
                  {service.name}
                </h3>

                {/* Service Description */}
                <p className="text-sm text-brand-text-muted mb-4">
                  {service.description || `Professional ${service.name.toLowerCase()} services`}
                </p>

                {/* Sub-Services List */}
                {subServices.length > 0 && (
                  <ul className="space-y-2 mb-3">
                    {visibleSubServices.map((subService) => (
                      <li key={subService.id} className="flex items-start gap-2 text-sm text-brand-text-dark">
                        <span className="text-brand-orange mt-1">•</span>
                        <span>{subService.name}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Show More/Less Button */}
                {hasMore && (
                  <button
                    onClick={() => toggleExpanded(service.id)}
                    className="flex items-center gap-1 text-sm font-semibold text-brand-orange hover:text-brand-orange-light transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        <span>Show less</span>
                        <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <span>+{subServices.length - 4} more services</span>
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

