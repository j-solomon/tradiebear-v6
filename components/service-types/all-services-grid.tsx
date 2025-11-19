'use client'

import { useState } from 'react'
import { getServiceIcon } from '@/lib/service-types-data'

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

const VISIBLE_SUB_SERVICES = 4

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
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-text-dark mb-3">
            All Service Types We Cover
          </h2>
          <p className="text-base text-brand-text-muted max-w-3xl mx-auto">
            Earn commissions on every home improvement project with our comprehensive
            service coverage
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => {
            const Icon = getServiceIcon(service.name)
            const subServices = Array.isArray(service.sub_services) ? service.sub_services : []
            const isExpanded = expandedServices.has(service.id)
            const hasMore = subServices.length > VISIBLE_SUB_SERVICES
            const visibleSubServices = hasMore && !isExpanded 
              ? subServices.slice(0, VISIBLE_SUB_SERVICES) 
              : subServices

            return (
              <div
                key={service.id}
                className="bg-white p-5 rounded-md border border-gray-200"
              >
                {/* Icon and Service Name Row */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-md bg-brand-orange/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-brand-orange" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-brand-text-dark">
                      {service.name}
                    </h3>
                  </div>
                </div>

                {/* Service Description */}
                <p className="text-sm text-brand-text-muted mb-4 leading-relaxed">
                  {service.description || `Professional ${service.name.toLowerCase()} services`}
                </p>

                {/* Sub-Services List */}
                {subServices.length > 0 && (
                  <>
                    <ul className="space-y-1.5 mb-3">
                      {visibleSubServices.map((subService) => (
                        <li key={subService.id} className="flex items-start gap-2 text-sm text-brand-text-dark">
                          <span className="text-brand-orange flex-shrink-0 mt-0.5">•</span>
                          <span className="leading-tight">{subService.name}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Show More/Less Link */}
                    {hasMore && (
                      <button
                        onClick={() => toggleExpanded(service.id)}
                        className="text-sm font-semibold text-brand-orange hover:underline transition-all"
                        type="button"
                      >
                        {isExpanded 
                          ? 'Show less' 
                          : `+${subServices.length - VISIBLE_SUB_SERVICES} more services`}
                      </button>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

