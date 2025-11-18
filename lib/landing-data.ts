import {
  Home,
  Hammer,
  Square,
  DoorOpen,
  Wrench,
  Zap,
  PaintBucket,
  Fence,
  Warehouse,
  DollarSign,
  TrendingUp,
  Briefcase,
  type LucideIcon,
} from 'lucide-react'

// FAQ Data
export const faqData = [
  {
    question: "What if the job doesn't happen?",
    answer: "You only earn commission when the job is completed. If the homeowner doesn't move forward or the contractor doesn't close the deal, there's no commission. However, all your referrals are tracked so you can see exactly what happens with each lead."
  },
  {
    question: "Do I need to follow up with contractors or clients?",
    answer: "No! We handle all communication between homeowners and contractors. You simply share your referral link, and we take care of the rest—from initial contact to scheduling to payment processing."
  },
  {
    question: "How are commissions calculated?",
    answer: "Commissions vary by service type and project size. Typically, you'll earn 3-5% of the total project value. You can view specific commission rates for each service type in your dashboard."
  },
  {
    question: "When do I get paid?",
    answer: "Payments are processed within 30 days of job completion and final payment to the contractor. You'll receive notifications at every stage and can track all earnings in real-time through your dashboard."
  },
  {
    question: "Is there a limit to how many referrals I can make?",
    answer: "No limits! You can refer as many projects as you want. The more quality referrals you send, the more you earn. We encourage you to share your link with your entire network."
  },
  {
    question: "What types of projects qualify?",
    answer: "We accept all home improvement and repair projects including roofing, remodeling, plumbing, electrical, windows, doors, decks, and more. Both residential and light commercial projects qualify."
  },
  {
    question: "Do clients know I'm earning a commission?",
    answer: "Yes, we believe in full transparency. Homeowners are informed that you've referred them through our platform. This builds trust and doesn't affect their pricing—contractors pay the referral fee, not homeowners."
  },
  {
    question: "How do I know contractors are qualified?",
    answer: "Every contractor in our network goes through our rigorous 7-point verification process, including license verification, insurance checks, background screening, and quality work reviews."
  },
  {
    question: "Can I customize my referral link?",
    answer: "Yes! You can create a custom vanity URL and even set up multiple links for tracking different marketing channels or client sources."
  },
  {
    question: "Is there a cost to join TradieBear?",
    answer: "No! Joining TradieBear is completely free with no monthly fees or hidden costs. You only earn money—there's never a charge to participate in our referral program."
  }
]

// Comparison Data
export const traditionalWayPoints = [
  "Leads blasted to multiple contractors",
  "Contractors ghost your referrals",
  "You chase updates manually",
  "Zero visibility after handoff",
  "No payout if job doesn't close",
  "Your reputation at risk"
]

export const tradiebearWayPoints = [
  "Direct intake tied to your unique link",
  "Vetted pros matched to each project",
  "Automated updates at every stage",
  "Full transparency in your dashboard",
  "Commission paid on job completion",
  "You're the hero, we handle the rest"
]

// How It Works Steps
export const howItWorksSteps = [
  {
    number: 1,
    title: "Sign Up & Get Your Link",
    description: "Create your free account and receive your unique referral link instantly"
  },
  {
    number: 2,
    title: "Share with Clients",
    description: "Send your link to homeowners who need contractors"
  },
  {
    number: 3,
    title: "Client Submits & Schedules",
    description: "They fill out the request form and schedule their free estimate"
  },
  {
    number: 4,
    title: "Job Completed, You Get Paid",
    description: "Track progress in your dashboard and receive commission when the job closes"
  }
]

// Persona Data
export const personaData = [
  {
    title: "Real Estate Agents",
    icon: Home,
    points: [
      "Add value for clients post-closing",
      "Build deeper relationships",
      "Earn passive income from your network",
      "Become the go-to resource"
    ]
  },
  {
    title: "Loan Officers",
    icon: DollarSign,
    points: [
      "Help homeowners maximize their investment",
      "Stay top-of-mind after closing",
      "Generate referral revenue",
      "Strengthen your referral network"
    ]
  },
  {
    title: "Contractors",
    icon: Wrench,
    points: [
      "Refer jobs outside your specialty",
      "Build strategic partnerships",
      "Monetize leads you can't take",
      "Expand your service offering"
    ]
  },
  {
    title: "Side-Income Seekers",
    icon: TrendingUp,
    points: [
      "Zero upfront investment",
      "Work on your own schedule",
      "Leverage your existing connections",
      "Scale earnings with your network"
    ]
  }
]

// Service Icon Mapping
export const serviceIconMap: Record<string, LucideIcon> = {
  'roofing': Home,
  'roof repair': Home,
  'roof replacement': Home,
  'new roof': Home,
  'siding': Square,
  'exterior siding': Square,
  'vinyl siding': Square,
  'windows': Square,
  'window installation': Square,
  'window replacement': Square,
  'doors': DoorOpen,
  'door installation': DoorOpen,
  'entry doors': DoorOpen,
  'garage doors': Warehouse,
  'garage door': Warehouse,
  'garage door opener': Warehouse,
  'remodels': PaintBucket,
  'remodel': PaintBucket,
  'kitchen remodel': PaintBucket,
  'bathroom remodel': PaintBucket,
  'adus': Home,
  'adu': Home,
  'accessory dwelling': Home,
  'granny flat': Home,
  'plumbing': Wrench,
  'plumber': Wrench,
  'pipe repair': Wrench,
  'electrical': Zap,
  'electrician': Zap,
  'wiring': Zap,
  'decks': Fence,
  'deck': Fence,
  'deck building': Fence,
  'fences': Fence,
  'fence': Fence,
  'fence installation': Fence,
  'pole barns': Warehouse,
  'pole barn': Warehouse,
  'barn': Warehouse,
}

// Get icon for service (with fallback)
export function getServiceIcon(serviceName: string): LucideIcon {
  const normalized = serviceName.toLowerCase().trim()
  return serviceIconMap[normalized] || Hammer // Default fallback icon
}

// Why TradieBear Features
export const whyTradiebearFeatures = [
  {
    title: "Full Transparency",
    description: "See every referral, every status update, every commission in real-time.",
    iconName: "Clock"
  },
  {
    title: "Vetted Contractors",
    description: "We pre-screen all contractors for licensing, insurance, and quality work.",
    iconName: "Users"
  },
  {
    title: "Automated Everything",
    description: "From intake to payout, we handle the heavy lifting so you can focus on relationships.",
    iconName: "Zap"
  }
]

