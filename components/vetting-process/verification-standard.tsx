export function VerificationStandard() {
  const steps = [
    {
      number: 1,
      title: 'License & Insurance Verification',
      description: 'We check state boards and require active coverage.'
    },
    {
      number: 2,
      title: 'Service Focus & Territory Fit',
      description: 'Match by trade, job size, and geographic coverage.'
    },
    {
      number: 3,
      title: 'Verified Client References',
      description: 'We independently confirm past jobs.'
    },
    {
      number: 4,
      title: 'Authentic Post-Job Reviews',
      description: 'Only verified homeowners can review.'
    },
    {
      number: 5,
      title: 'Performance & Responsiveness',
      description: 'Track response time, conversions, completion.'
    },
    {
      number: 6,
      title: 'Tiered Ranking (Internal)',
      description: 'Elite / Verified / Registered based on data.'
    },
    {
      number: 7,
      title: 'Continuous Monitoring',
      description: 'Monthly checks; auto-pauses on issues.'
    }
  ]

  return (
    <section id="verification-standard" className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-text-dark mb-3">
            Our 7-Point Verification Standard
          </h2>
          <p className="text-base text-brand-text-muted max-w-3xl mx-auto">
            Every contractor must meet these requirements before receiving referrals—and maintain them monthly.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              {/* Step Badge */}
              <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/20 rounded-full px-3 py-1 mb-4">
                <span className="w-1.5 h-1.5 bg-brand-orange rounded-full"></span>
                <span className="text-xs font-semibold text-brand-orange">Step {step.number}</span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-brand-text-dark mb-2">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-brand-text-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

