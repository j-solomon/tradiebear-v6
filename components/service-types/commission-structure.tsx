import { commissionTiers } from '@/lib/service-types-data'

export function CommissionStructure() {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-text-dark mb-4">
            Commission Structure by Service Type
          </h2>
          <p className="text-lg text-brand-text-muted max-w-3xl mx-auto">
            Different service types offer varying commission rates based on project
            complexity and value
          </p>
        </div>

        {/* Commission Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {commissionTiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-lg border-2 overflow-hidden ${
                tier.color === 'green'
                  ? 'border-green-200 bg-green-50'
                  : 'border-blue-200 bg-blue-50'
              }`}
            >
              {/* Header */}
              <div
                className={`p-6 ${
                  tier.color === 'green' ? 'bg-green-100' : 'bg-blue-100'
                }`}
              >
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    tier.color === 'green' ? 'text-green-800' : 'text-blue-800'
                  }`}
                >
                  {tier.name}
                </h3>
                <p
                  className={`text-lg font-semibold ${
                    tier.color === 'green' ? 'text-green-700' : 'text-blue-700'
                  }`}
                >
                  {tier.rate}
                </p>
              </div>

              {/* Projects List */}
              <div className="p-6">
                <ul className="space-y-3">
                  {tier.projects.map((project, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-brand-text-dark"
                    >
                      <span className="text-brand-orange mt-1">•</span>
                      <span>{project}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

