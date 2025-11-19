import Link from 'next/link'

export function WhatIsTradieBear() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-text-dark mb-6 text-center">
          What is TradieBear?
        </h2>
        
        <div className="prose prose-lg max-w-none text-brand-text-muted leading-relaxed space-y-4">
          <p>
            TradieBear is a professional referral platform designed specifically for real estate agents, loan officers, and home service providers who want to earn commission by connecting homeowners with quality contractors. Unlike traditional referral services, TradieBear provides complete transparency, tracking, and automated commission payments for every successful project.
          </p>

          <p>
            Our system works through a simple four-step process: you create your unique referral link, share it with clients who need home improvement services, we match them with{' '}
            <Link href="/vetting-process" className="text-brand-orange hover:underline">
              pre-vetted contractors
            </Link>
            , and you automatically receive your commission once the job is completed. Every referral is tracked in real-time through your personal dashboard.
          </p>

          <p>
            We maintain the highest quality standards by putting every contractor through our{' '}
            <Link href="/vetting-process" className="text-brand-orange hover:underline">
              comprehensive 7-point verification process
            </Link>
            . This includes license and insurance verification, client reference checks, performance monitoring, and continuous quality assessments. Only contractors who consistently meet our standards remain active in the network.
          </p>

          <p>
            Referrers earn more through our managed process because we handle all scheduling, coordination, and quality control. You focus on your professional relationships while we ensure your clients receive exceptional service. Our network covers{' '}
            <Link href="/service-types" className="text-brand-orange hover:underline">
              27+ service categories
            </Link>
            {' '}including roofing, remodeling, HVAC, plumbing, landscaping, and more—giving you one reliable solution for all home improvement referrals.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link 
              href="/how-it-works"
              className="text-brand-orange font-semibold hover:underline"
            >
              Learn How It Works →
            </Link>
            <Link 
              href="/service-types"
              className="text-brand-orange font-semibold hover:underline"
            >
              View All Services →
            </Link>
            <Link 
              href="/vetting-process"
              className="text-brand-orange font-semibold hover:underline"
            >
              Our Vetting Process →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

