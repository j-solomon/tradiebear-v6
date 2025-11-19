import Link from 'next/link'
import { UserPlus, Share2, Calendar, DollarSign, ArrowRight } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      number: 1,
      icon: UserPlus,
      title: "Create your referral link",
      description: "Create your free account and receive your unique referral link instantly"
    },
    {
      number: 2,
      icon: Share2,
      title: "Share with clients",
      description: "Send your link to homeowners who need contractors"
    },
    {
      number: 3,
      icon: Calendar,
      title: "We match & schedule",
      description: "They fill out the request form and schedule their free estimate"
    },
    {
      number: 4,
      icon: DollarSign,
      title: "You get paid after job completion",
      description: "Track progress in your dashboard and receive commission when the job closes"
    }
  ]

  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-text-dark mb-6">
            How It Works
          </h2>
          <p className="text-xl md:text-2xl text-brand-text-muted leading-relaxed">
            Four simple steps from sign-up to payout
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting Line - Desktop Only */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-brand-orange/20" aria-hidden="true" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.number} className="relative">
                  {/* Timeline Dot - Desktop Only */}
                  <div className="hidden lg:block absolute top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-brand-orange border-4 border-white shadow-lg z-10" aria-hidden="true" />
                  
                  {/* Content */}
                  <div className="text-center space-y-4">
                    {/* Icon Circle */}
                    <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-brand-orange text-white shadow-lg">
                      <Icon className="w-10 h-10 md:w-12 md:h-12" aria-hidden="true" />
                    </div>
                    
                    {/* Step Label */}
                    <div className="inline-block px-4 py-1 rounded-full bg-brand-orange/10 text-brand-orange text-sm font-semibold">
                      Step {step.number}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-bold text-brand-text-dark px-2">
                      {step.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-brand-text-muted leading-relaxed px-2">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow - Mobile Only */}
                  {index < steps.length - 1 && (
                    <div className="flex justify-center my-8 lg:hidden" aria-hidden="true">
                      <ArrowRight className="w-6 h-6 text-brand-orange" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA Link */}
        <div className="text-center mt-16">
          <Link 
            href="/how-it-works" 
            className="inline-flex items-center gap-2 text-lg font-semibold text-brand-orange hover:text-brand-orange-light transition-colors"
          >
            View Detailed Process
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}

