import { X, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { traditionalWayPoints, tradiebearWayPoints } from '@/lib/landing-data'

export function Comparison() {
  return (
    <section className="py-20 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-text-dark mb-6">
            Traditional Referrals vs. TradieBear
          </h2>
          <p className="text-xl md:text-2xl text-brand-text-muted max-w-3xl mx-auto leading-relaxed">
            Stop losing leads in the shuffle. TradieBear ensures every referral is tracked, managed, and rewarded.
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Traditional Way */}
          <Card className="bg-red-50 border-2 border-red-200 p-8 md:p-10 shadow-md">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <X className="h-7 w-7 text-red-600" aria-hidden="true" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-red-900">Traditional Way</h3>
            </div>
            <ul className="space-y-5">
              {traditionalWayPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-4">
                  <X className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" aria-hidden="true" />
                  <span className="text-red-900 text-base md:text-lg leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* TradieBear Way */}
          <Card className="bg-green-50 border-2 border-green-300 p-8 md:p-10 shadow-lg ring-2 ring-green-200">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7 text-green-600" aria-hidden="true" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-green-900">TradieBear Way</h3>
            </div>
            <ul className="space-y-5">
              {tradiebearWayPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-4">
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" aria-hidden="true" />
                  <span className="text-green-900 font-medium text-base md:text-lg leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </section>
  )
}

