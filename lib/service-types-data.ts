import { Hammer, Wrench, Home, Building2, DoorOpen, Sparkles, TreePine, Layers, Zap, PaintBucket, Wind, Droplet, LucideIcon } from 'lucide-react'

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

// Simple icon mapping for service types
export function getServiceIcon(serviceName: string): LucideIcon {
  const name = serviceName.toLowerCase()
  
  if (name.includes('roof')) return Home
  if (name.includes('siding')) return Layers
  if (name.includes('kitchen') || name.includes('bathroom') || name.includes('remodel')) return Home
  if (name.includes('adu') || name.includes('dwelling')) return Building2
  if (name.includes('barn') || name.includes('pole')) return Building2
  if (name.includes('deck') || name.includes('fence')) return TreePine
  if (name.includes('floor')) return Layers
  if (name.includes('garage')) return DoorOpen
  if (name.includes('window') || name.includes('door')) return DoorOpen
  if (name.includes('cabinet')) return Building2
  if (name.includes('basement')) return Building2
  if (name.includes('theater')) return Building2
  if (name.includes('golf')) return Building2
  if (name.includes('solar')) return Zap
  if (name.includes('paint')) return PaintBucket
  if (name.includes('gutter')) return Droplet
  if (name.includes('mold')) return Wind
  if (name.includes('hvac') || name.includes('air')) return Wind
  if (name.includes('water') || name.includes('fire')) return Droplet
  if (name.includes('foundation')) return Building2
  if (name.includes('counter')) return Building2
  if (name.includes('lawn') || name.includes('garden') || name.includes('landscape')) return TreePine
  if (name.includes('light')) return Zap
  if (name.includes('pergola') || name.includes('gazebo')) return TreePine
  if (name.includes('kitchen') || name.includes('outdoor kitchen')) return Home
  if (name.includes('insulation')) return Home
  if (name.includes('clean')) return Sparkles
  if (name.includes('plumb') || name.includes('electric')) return Wrench
  
  // Default icon
  return Hammer
}

