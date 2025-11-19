import { CheckCircle2 } from 'lucide-react'

export function ReputationSection() {
  const checkpoints = [
    'We verify credentials so you don\'t have to.',
    'We measure quality, communication, and completion.',
    'We pause any contractor who falls below our standard.'
  ]

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Checkpoints */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-text-dark mb-6">
              Your reputation is built on who you recommend.
            </h2>

            <div className="space-y-4">
              {checkpoints.map((checkpoint, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-base text-brand-text-dark">
                    {checkpoint}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Protected Standards Box */}
          <div className="bg-brand-cream border border-brand-orange/20 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center">
                <span className="text-brand-orange text-xl">🛡️</span>
              </div>
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>

            <h3 className="text-xl font-bold text-brand-text-dark mb-3">
              Protected Standards
            </h3>

            <p className="text-sm text-brand-text-muted leading-relaxed">
              Every contractor is continuously monitored to maintain quality standards
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

