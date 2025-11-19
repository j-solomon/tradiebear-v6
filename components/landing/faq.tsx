import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  AlertCircle, 
  MessageSquare, 
  DollarSign, 
  Clock, 
  Infinity, 
  Home, 
  Eye, 
  ShieldCheck, 
  Link as LinkIcon, 
  CreditCard 
} from 'lucide-react'

export function FAQ() {
  const faqs = [
    {
      question: "What if the job doesn't happen?",
      answer: "You only earn commission when the job is completed. If the homeowner doesn't move forward or the contractor doesn't close the deal, there's no commission. However, all your referrals are tracked so you can see exactly what happens with each lead.",
      icon: AlertCircle
    },
    {
      question: "Do I need to follow up with contractors or clients?",
      answer: "No! We handle all communication between homeowners and contractors. You simply share your referral link, and we take care of the rest—from initial contact to scheduling to payment processing.",
      icon: MessageSquare
    },
    {
      question: "How are commissions calculated?",
      answer: "Commissions vary by service type and project size. Typically, you'll earn 3-5% of the total project value. You can view specific commission rates for each service type in your dashboard.",
      icon: DollarSign
    },
    {
      question: "When do I get paid?",
      answer: "Payments are processed within 30 days of job completion and final payment to the contractor. You'll receive notifications at every stage and can track all earnings in real-time through your dashboard.",
      icon: Clock
    },
    {
      question: "Is there a limit to how many referrals I can make?",
      answer: "No limits! You can refer as many projects as you want. The more quality referrals you send, the more you earn. We encourage you to share your link with your entire network.",
      icon: Infinity
    },
    {
      question: "What types of projects qualify?",
      answer: "We accept all home improvement and repair projects including roofing, remodeling, plumbing, electrical, windows, doors, decks, and more. Both residential and light commercial projects qualify.",
      icon: Home
    },
    {
      question: "Do clients know I'm earning a commission?",
      answer: "Yes, we believe in full transparency. Homeowners are informed that you've referred them through our platform. This builds trust and doesn't affect their pricing—contractors pay the referral fee, not homeowners.",
      icon: Eye
    },
    {
      question: "How do I know contractors are qualified?",
      answer: "Every contractor in our network goes through our rigorous 7-point verification process, including license verification, insurance checks, background screening, and quality work reviews.",
      icon: ShieldCheck
    },
    {
      question: "Can I customize my referral link?",
      answer: "Yes! You can create a custom vanity URL and even set up multiple links for tracking different marketing channels or client sources.",
      icon: LinkIcon
    },
    {
      question: "Is there a cost to join TradieBear?",
      answer: "No! Joining TradieBear is completely free with no monthly fees or hidden costs. You only earn money—there's never a charge to participate in our referral program.",
      icon: CreditCard
    }
  ]

  return (
    <section id="faq" className="py-20 md:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-text-dark mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl md:text-2xl text-brand-text-muted leading-relaxed">
            Everything you need to know about earning with TradieBear
          </p>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="w-full space-y-6">
          {faqs.map((faq, index) => {
            const Icon = faq.icon
            return (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-gray-50 border-2 border-gray-200 rounded-xl px-6 md:px-8 hover:border-brand-orange transition-colors"
              >
                <AccordionTrigger className="text-left text-brand-text-dark hover:text-brand-orange py-6 hover:no-underline group">
                  <div className="flex items-center gap-4 pr-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-orange/10 flex items-center justify-center group-hover:bg-brand-orange transition-colors">
                      <Icon className="w-5 h-5 text-brand-orange group-hover:text-white transition-colors" aria-hidden="true" />
                    </div>
                    <span className="text-lg md:text-xl font-bold">
                      {faq.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-brand-text-muted text-base md:text-lg leading-relaxed pt-2 pb-6 pl-14">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </section>
  )
}

