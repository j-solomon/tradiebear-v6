import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { faqData } from '@/lib/landing-data'

export function FAQ() {
  return (
    <section id="faq" className="py-20 md:py-32 bg-brand-gray-light">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-text-dark mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg md:text-xl text-brand-text-muted">
            Everything you need to know about earning with TradieBear
          </p>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqData.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-white border border-gray-200 rounded-lg px-6"
            >
              <AccordionTrigger className="text-left text-brand-text-dark hover:text-brand-orange">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-brand-text-muted">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

