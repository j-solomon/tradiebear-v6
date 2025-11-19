import { whyChooseData } from '@/lib/how-it-works-data'

export function WhyChoose() {
  return (
    <section className="py-20 md:py-32 bg-brand-gray-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-text-dark mb-4">
            Why Choose TradieBear?
          </h2>
          <p className="text-lg md:text-xl text-brand-text-muted max-w-3xl mx-auto">
            We handle the complexity so you can focus on relationships
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {whyChooseData.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="bg-white p-8 text-center hover:shadow-lg transition-shadow rounded-lg border border-gray-200"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-orange/10 mb-6">
                  <Icon className="h-8 w-8 text-brand-orange" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-brand-text-dark mb-4">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-brand-text-muted">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

