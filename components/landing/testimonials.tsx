import { Quote } from 'lucide-react'

export function Testimonials() {
  const testimonials = [
    {
      quote: "TradieBear has become my go-to referral system. I used to lose track of who I sent clients to, but now everything is tracked, transparent, and my clients love the contractors. The commissions are a real bonus.",
      author: "Sarah M.",
      role: "Real Estate Agent",
      location: "Portland, OR"
    },
    {
      quote: "As a contractor, the quality of leads is insanely good. TradieBear only sends clients who actually want the work done. Payments are predictable and the vetting process keeps the network high level.",
      author: "Lucas R.",
      role: "Roofing Contractor",
      location: "Vancouver, WA"
    },
    {
      quote: "I was shocked at how simple the referral process is. I send a link, the client picks a contractor, and I get paid when the job closes. No follow-up or scheduling needed.",
      author: "Rebecca T.",
      role: "Loan Officer",
      location: "Beaverton, OR"
    },
    {
      quote: "Every contractor I've been connected to was professional, licensed, and extremely helpful. The communication and tracking made the whole process stress-free.",
      author: "Justin K.",
      role: "Homeowner",
      location: "Salem, OR"
    }
  ]

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-text-dark mb-3">
            Trusted by Professionals & Homeowners
          </h2>
          <p className="text-base text-brand-text-muted max-w-2xl mx-auto">
            Real feedback from agents, contractors, and homeowners in our network
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-brand-orange/30 mb-4" aria-hidden="true" />

              {/* Quote Text */}
              <p className="text-brand-text-dark mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="border-t border-gray-100 pt-4">
                <p className="font-semibold text-brand-text-dark">
                  {testimonial.author}
                </p>
                <p className="text-sm text-brand-text-muted">
                  {testimonial.role} • {testimonial.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

