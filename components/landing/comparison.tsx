import { X, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { traditionalWayPoints, tradiebearWayPoints } from '@/lib/landing-data'

export function Comparison() {
  return (
    <section className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-text-dark mb-4">
            Traditional Referrals vs. TradieBear
          </h2>
          <p className="text-lg md:text-xl text-brand-text-muted max-w-3xl mx-auto">
            Stop losing leads in the shuffle. TradieBear ensures every referral is tracked, managed, and rewarded.
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Traditional Way */}
          <Card className="bg-brand-red-bg border-red-200 p-8">
            <div className="flex items-center gap-2 mb-6">
              <X className="h-6 w-6 text-red-600" />
              <h3 className="text-2xl font-bold text-red-900">Traditional Way</h3>
            </div>
            <ul className="space-y-4">
              {traditionalWayPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-red-900">{point}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* TradieBear Way */}
          <Card className="bg-brand-green-bg border-green-200 p-8">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <h3 className="text-2xl font-bold text-green-900">TradieBear Way</h3>
            </div>
            <ul className="space-y-4">
              {tradiebearWayPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-green-900">{point}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </section>
  )
}

