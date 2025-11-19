export function NetworkPerformance() {
  const metrics = [
    {
      label: 'Active Verified Contractors',
      value: '200+',
      icon: '👷'
    },
    {
      label: 'Elite Partners',
      value: '60+',
      icon: '⭐'
    },
    {
      label: 'Avg. Response Time',
      value: '3.5 hrs',
      icon: '⏱️'
    },
    {
      label: 'Avg. Homeowner Rating',
      value: '4.8 / 5.0',
      icon: '📊'
    }
  ]

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-text-dark mb-3">
            Network Performance
          </h2>
          <p className="text-base text-brand-text-muted max-w-2xl mx-auto">
            Aggregate metrics that demonstrate our commitment to quality
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 text-center"
            >
              <div className="text-sm text-brand-text-muted mb-2 flex items-center justify-center gap-2">
                {metric.label}
              </div>
              <div className="text-3xl font-bold text-brand-orange">
                {metric.value}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-brand-text-muted">
          Stats updated monthly. Contractor identities remain private until an approved referral is made.
        </p>
      </div>
    </section>
  )
}

