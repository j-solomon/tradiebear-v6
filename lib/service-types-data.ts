import { 
  Hammer, 
  Wrench, 
  Home, 
  Building2, 
  DoorOpen, 
  Sparkles, 
  TreePine, 
  Layers, 
  Zap, 
  PaintBucket, 
  Wind, 
  Droplet, 
  Flame,
  Warehouse,
  Lightbulb,
  ChefHat,
  ShieldCheck,
  LucideIcon 
} from 'lucide-react'

// Popular services with average project costs
export interface PopularService {
  name: string
  averageProject: string
  icon: LucideIcon
}

export const popularServices: PopularService[] = [
  {
    name: 'Roofing',
    averageProject: '$15,000-$40,000',
    icon: Home
  },
  {
    name: 'Siding',
    averageProject: '$12,000-$30,000',
    icon: Layers
  },
  {
    name: 'Windows',
    averageProject: '$8,000-$20,000',
    icon: DoorOpen
  }
]

// Commission structure tiers
export interface CommissionTier {
  name: string
  rate: string
  color: 'green' | 'blue'
  projects: string[]
}

export const commissionTiers: CommissionTier[] = [
  {
    name: 'High-Value Projects',
    rate: '2-4% Commission Rate',
    color: 'green',
    projects: [
      'Roofing & Exterior Work',
      'ADU Construction',
      'Kitchen & Bathroom Remodels',
      'Solar Panel Installation',
      'Foundation Repair'
    ]
  },
  {
    name: 'Standard Projects',
    rate: '5-8% Commission Rate',
    color: 'blue',
    projects: [
      'Flooring Installation',
      'Painting Services',
      'HVAC Work',
      'Electrical & Plumbing',
      'Landscaping Projects'
    ]
  }
]

// Comprehensive icon mapping for all service types
export function getServiceIcon(serviceName: string): LucideIcon {
  const name = serviceName.toLowerCase()
  
  // Exact matches first (most specific)
  if (name === 'roofing') return Home
  if (name === 'siding') return Layers
  if (name === 'kitchen remodels') return Home
  if (name === 'bathroom remodels') return Droplet
  if (name === 'adus') return Building2
  if (name === 'pole barns' || name === 'barns') return Warehouse
  if (name === 'decks & fences') return TreePine
  if (name === 'flooring') return Layers
  if (name === 'garage doors') return DoorOpen
  if (name === 'windows & doors') return DoorOpen
  if (name === 'cabinets') return Building2
  if (name === 'basement finishing') return Home
  if (name === 'theater rooms') return Home
  if (name === 'golf simulators') return Building2
  if (name === 'solar panel install') return Zap
  if (name === 'interior & exterior painting') return PaintBucket
  if (name === 'gutters') return Droplet
  if (name === 'mold remediation') return ShieldCheck
  if (name === 'hvac / air conditioning') return Wind
  if (name === 'water & fire damage') return Flame
  if (name === 'foundation repair') return Building2
  if (name === 'countertops') return Home
  if (name === 'lawn & garden / landscaping') return TreePine
  if (name === 'custom lighting') return Lightbulb
  if (name === 'pergola / gazebo') return TreePine
  if (name === 'outdoor kitchen') return ChefHat
  if (name === 'insulation') return Home
  if (name === 'carpet cleaning') return Sparkles
  if (name === 'plumbing & electrical') return Wrench
  if (name === 'remodels') return Home
  if (name === '& more') return Hammer
  
  // Partial matches (fallback)
  if (name.includes('roof')) return Home
  if (name.includes('siding')) return Layers
  if (name.includes('kitchen') || name.includes('bathroom') || name.includes('remodel')) return Home
  if (name.includes('adu') || name.includes('dwelling')) return Building2
  if (name.includes('barn') || name.includes('pole')) return Warehouse
  if (name.includes('deck') || name.includes('fence')) return TreePine
  if (name.includes('floor')) return Layers
  if (name.includes('garage')) return DoorOpen
  if (name.includes('window') || name.includes('door')) return DoorOpen
  if (name.includes('cabinet')) return Building2
  if (name.includes('basement')) return Home
  if (name.includes('theater')) return Home
  if (name.includes('golf')) return Building2
  if (name.includes('solar')) return Zap
  if (name.includes('paint')) return PaintBucket
  if (name.includes('gutter')) return Droplet
  if (name.includes('mold')) return ShieldCheck
  if (name.includes('hvac') || name.includes('air')) return Wind
  if (name.includes('water') || name.includes('fire')) return Flame
  if (name.includes('foundation')) return Building2
  if (name.includes('counter')) return Home
  if (name.includes('lawn') || name.includes('garden') || name.includes('landscape')) return TreePine
  if (name.includes('light')) return Lightbulb
  if (name.includes('pergola') || name.includes('gazebo')) return TreePine
  if (name.includes('outdoor kitchen')) return ChefHat
  if (name.includes('insulation')) return Home
  if (name.includes('clean')) return Sparkles
  if (name.includes('plumb') || name.includes('electric')) return Wrench
  
  // Default icon
  return Hammer
}

