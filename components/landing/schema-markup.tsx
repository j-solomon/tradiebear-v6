export function SchemaMarkup() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TradieBear",
    "url": "https://tradiebear.com",
    "logo": "https://tradiebear.com/logo.png",
    "description": "Professional contractor referral platform for real estate agents, loan officers, and home service providers",
    "sameAs": [
      "https://www.facebook.com/tradiebear",
      "https://www.linkedin.com/company/tradiebear"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "support@tradiebear.com"
    }
  }

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "TradieBear",
    "image": "https://tradiebear.com/logo.png",
    "description": "Earn commissions by connecting homeowners with trusted, vetted contractors",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Portland",
      "addressRegion": "OR",
      "addressCountry": "US"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "200",
      "bestRating": "5",
      "worstRating": "1"
    }
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Contractor Referral Platform",
    "provider": {
      "@type": "Organization",
      "name": "TradieBear"
    },
    "areaServed": {
      "@type": "State",
      "name": "Oregon"
    },
    "description": "Professional referral platform connecting homeowners with verified contractors for home improvement projects"
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does TradieBear work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Create your unique referral link, share it with clients who need contractors, we match them with pre-vetted professionals, and you earn commission when the job completes. Everything is tracked in your dashboard."
        }
      },
      {
        "@type": "Question",
        "name": "How much commission do I earn?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Commission rates vary by project type and size, ranging from 2-8% of the total project value. High-value projects like roofing and ADUs typically earn 2-4%, while services like flooring and painting earn 5-8%."
        }
      },
      {
        "@type": "Question",
        "name": "How are contractors vetted?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Every contractor passes our 7-point verification: license and insurance verification, service focus assessment, verified client references, authentic reviews, performance tracking, tiered ranking system, and continuous monthly monitoring."
        }
      },
      {
        "@type": "Question",
        "name": "When do I get paid?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Commission is released 7-10 business days after the contractor confirms job completion. Payments are automatic and trackable through your dashboard."
        }
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}

