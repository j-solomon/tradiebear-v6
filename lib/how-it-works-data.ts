import { UserPlus, Share2, Calendar, DollarSign, Users, CheckCircle2, Zap, LucideIcon } from 'lucide-react'

export interface ProcessStep {
  number: number
  label: string
  title: string
  description: string
  checkpoints: string[]
  visualType: 'link-card' | 'share-card' | 'details-card' | 'commission-card'
  visualPosition: 'left' | 'right'
}

export interface WhyChooseItem {
  icon: LucideIcon
  title: string
  description: string
}

export const processSteps: ProcessStep[] = [
  {
    number: 1,
    label: 'Step 1',
    title: 'Sign Up & Get Your Link',
    description: 'Create your free account in under 2 minutes. Complete your profile with your company information, and we\'ll instantly generate your unique referral link.',
    checkpoints: [
      'No setup fees or monthly costs',
      'Instant link generation',
      'Professional branded experience'
    ],
    visualType: 'link-card',
    visualPosition: 'right'
  },
  {
    number: 2,
    label: 'Step 2',
    title: 'Share with Clients',
    description: 'Send your link to homeowners who need contractors. Share via email, text, social media, or embed it on your website. Every click is tracked to your account.',
    checkpoints: [
      'Multiple sharing options',
      'Real-time click tracking',
      'Professional presentation'
    ],
    visualType: 'share-card',
    visualPosition: 'left'
  },
  {
    number: 3,
    label: 'Step 3',
    title: 'Client Submits & Schedules',
    description: 'Your client fills out our comprehensive project form with all the details contractors need. They can upload photos and schedule their free estimate - all tracked to your referral.',
    checkpoints: [
      'Detailed project information collected',
      'Photo uploads for better estimates',
      'Automatic notifications to you'
    ],
    visualType: 'details-card',
    visualPosition: 'right'
  },
  {
    number: 4,
    label: 'Step 4',
    title: 'Job Completed, You Get Paid',
    description: 'We match your client with verified contractors, manage the entire process, and track progress in your dashboard. When the job is completed, you receive your commission automatically.',
    checkpoints: [
      'Full project visibility in dashboard',
      'Automatic commission calculation',
      'Fast, reliable payouts'
    ],
    visualType: 'commission-card',
    visualPosition: 'left'
  }
]

export const whyChooseData: WhyChooseItem[] = [
  {
    icon: Users,
    title: 'Vetted Contractors',
    description: 'Every contractor is pre-screened for licensing, insurance, and quality work'
  },
  {
    icon: CheckCircle2,
    title: 'Full Transparency',
    description: 'Track every referral from submission to completion in your dashboard'
  },
  {
    icon: Zap,
    title: 'Reliable Payouts',
    description: 'Automatic commission calculation and fast payment processing'
  }
]

export const projectDetailsCollected = [
  'Contact information',
  'Property address',
  'Services needed',
  'Budget range',
  'Timeline preferences',
  'Project photos'
]

