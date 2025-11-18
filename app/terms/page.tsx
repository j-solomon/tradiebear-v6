import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: "Terms of Service - TradieBear",
  description: "TradieBear Terms of Service"
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-brand-text-dark mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-brand-text-muted mb-6">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-brand-text-dark mb-4">Terms of Service Coming Soon</h2>
            <p className="text-brand-text-muted mb-4">
              We are currently drafting our comprehensive terms of service. This document will outline the rules, 
              responsibilities, and guidelines for using the TradieBear platform.
            </p>
            <p className="text-brand-text-muted">
              In the meantime, by using our platform, you agree to use it lawfully and in good faith. 
              We reserve the right to suspend accounts that violate our community standards or engage in fraudulent activity.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-brand-text-dark mb-4">Key Points</h2>
            <ul className="list-disc pl-6 text-brand-text-muted space-y-2">
              <li>Commissions are paid only on completed jobs</li>
              <li>You must provide accurate referral information</li>
              <li>Fraudulent activity will result in account termination</li>
              <li>We reserve the right to modify these terms at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-brand-text-dark mb-4">Contact Us</h2>
            <p className="text-brand-text-muted">
              If you have any questions about our terms of service, please contact us at:
            </p>
            <p className="text-brand-text-muted mt-2">
              <strong>Email:</strong> legal@tradiebear.com
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

