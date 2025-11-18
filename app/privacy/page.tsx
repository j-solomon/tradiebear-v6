import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: "Privacy Policy - TradieBear",
  description: "TradieBear Privacy Policy"
}

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold text-brand-text-dark mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-brand-text-muted mb-6">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-brand-text-dark mb-4">Privacy Policy Coming Soon</h2>
            <p className="text-brand-text-muted mb-4">
              We are currently drafting our comprehensive privacy policy. This document will detail how we collect, 
              use, store, and protect your personal information.
            </p>
            <p className="text-brand-text-muted">
              In the meantime, please know that we take your privacy seriously and only collect information necessary 
              to provide our referral platform services. We do not sell your personal information to third parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-brand-text-dark mb-4">Contact Us</h2>
            <p className="text-brand-text-muted">
              If you have any questions about our privacy practices, please contact us at:
            </p>
            <p className="text-brand-text-muted mt-2">
              <strong>Email:</strong> privacy@tradiebear.com
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

