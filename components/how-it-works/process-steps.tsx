'use client'

import { CheckCircle2, Link as LinkIcon, Mail, MessageSquare, Share2 } from 'lucide-react'
import { processSteps, projectDetailsCollected } from '@/lib/how-it-works-data'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function ProcessSteps() {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-text-dark mb-4">
            Simple 4-Step Process
          </h2>
          <p className="text-lg md:text-xl text-brand-text-muted max-w-3xl mx-auto">
            From account creation to commission payout - we&apos;ve made it effortless
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-24">
          {processSteps.map((step) => (
            <div
              key={step.number}
              className={`grid md:grid-cols-2 gap-12 items-center ${
                step.visualPosition === 'left' ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Text Content */}
              <div className={step.visualPosition === 'left' ? 'md:order-2' : ''}>
                {/* Step Badge */}
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-orange/10 mb-4">
                  <span className="text-sm font-semibold text-brand-orange">{step.label}</span>
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-brand-text-dark mb-4">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-brand-text-muted mb-6">
                  {step.description}
                </p>

                {/* Checkpoints */}
                <ul className="space-y-3 mb-8">
                  {step.checkpoints.map((checkpoint, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-brand-text-dark">{checkpoint}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA for Step 4 */}
                {step.number === 4 && (
                  <Link href="/signup">
                    <Button size="lg" className="bg-brand-orange hover:bg-brand-orange-light text-white">
                      Start Referring Today
                    </Button>
                  </Link>
                )}
              </div>

              {/* Visual Card */}
              <div className={step.visualPosition === 'left' ? 'md:order-1' : ''}>
                {step.visualType === 'link-card' && <LinkCard />}
                {step.visualType === 'share-card' && <ShareCard />}
                {step.visualType === 'details-card' && <DetailsCard />}
                {step.visualType === 'commission-card' && <CommissionCard />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function LinkCard() {
  return (
    <Card className="p-8 bg-gradient-to-br from-gray-50 to-white border-gray-200">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-orange/10 mx-auto">
          <LinkIcon className="h-8 w-8 text-brand-orange" />
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-text-muted mb-2">Your Unique Link</p>
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
            <code className="text-sm text-brand-text-dark break-all">
              tradiebear.com/q/your-name-abc123
            </code>
          </div>
          <p className="text-xs text-brand-text-muted mt-2">Ready to share immediately</p>
        </div>
      </div>
    </Card>
  )
}

function ShareCard() {
  return (
    <Card className="p-8 bg-gradient-to-br from-gray-50 to-white border-gray-200">
      <div className="space-y-4">
        {/* Email Option */}
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Mail className="h-5 w-5 text-blue-600" />
          </div>
          <span className="text-brand-text-dark font-medium">Email to clients</span>
        </div>

        {/* Text Message Option */}
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-green-600" />
          </div>
          <span className="text-brand-text-dark font-medium">Text message</span>
        </div>

        {/* Social Media Option */}
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
            <Share2 className="h-5 w-5 text-purple-600" />
          </div>
          <span className="text-brand-text-dark font-medium">Social media</span>
        </div>
      </div>
    </Card>
  )
}

function DetailsCard() {
  return (
    <Card className="p-8 bg-gradient-to-br from-gray-50 to-white border-gray-200">
      <div className="space-y-6">
        <h4 className="text-lg font-semibold text-brand-text-dark text-center">
          Project Details Collected:
        </h4>
        <ul className="space-y-3">
          {projectDetailsCollected.map((detail, idx) => (
            <li key={idx} className="flex items-center gap-3 text-brand-text-dark">
              <span className="w-2 h-2 rounded-full bg-brand-orange"></span>
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}

function CommissionCard() {
  return (
    <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto">
          <span className="text-3xl text-green-700 font-bold">$</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-green-700 mb-2">Commission Earned</p>
          <p className="text-4xl font-bold text-green-700 mb-4">2-8%</p>
          <p className="text-sm text-green-700 mb-2">of completed project value</p>
        </div>
        <div className="bg-white rounded-lg px-6 py-3 inline-block">
          <p className="text-sm text-brand-text-dark">
            <span className="font-semibold">Paid within 7-10 business days</span>
          </p>
        </div>
      </div>
    </Card>
  )
}

