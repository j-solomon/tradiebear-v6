import { CheckCircle2, Star, Clock } from 'lucide-react'

export function TrustBar() {
  const stats = [
    {
      icon: CheckCircle2,
      text: 'Trusted by 200+ Verified Contractors'
    },
    {
      icon: Star,
      text: '4.8 Average Rating'
    },
    {
      icon: Clock,
      text: '3.5 hr Avg Response Time'
    }
  ]

  return (
    <div className="bg-white border-y border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-brand-orange flex-shrink-0" aria-hidden="true" />
                <span className="text-sm md:text-base text-brand-text-dark font-medium">
                  {stat.text}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

