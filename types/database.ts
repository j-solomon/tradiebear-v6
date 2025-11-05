// Database type definitions for Supabase tables

export interface Profile {
  id: string
  email: string
  name?: string
  handle?: string
  phone?: string
  role: 'admin' | 'partner'
  created_at: string
  updated_at: string
}

export interface ReferralLink {
  id: string
  user_id: string
  slug: string
  clicks?: number
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Service {
  id: string
  name: string
  description?: string
  is_active: boolean
  sort_order?: number
  tags?: string[]
  created_at: string
  updated_at: string
}

export interface SubService {
  id: string
  service_id: string
  name: string
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  referral_id: string
  service_id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  budget?: number
  timeline?: string
  notes?: string
  files?: any
  stage: 'submitted' | 'est_scheduled' | 'completed' | 'paid'
  created_at: string
  updated_at: string
}

export interface ServiceAreaMap {
  id: string
  service_id: string
  state_code?: string
  county_id?: string
  city_id?: string
  zip_id?: string
  is_active: boolean
  created_at: string
}

export interface CommissionTier {
  id: string
  sub_service_id: string
  min_amount: number
  percent: number
  created_at: string
}

export interface SupportTicket {
  id: string
  user_id: string
  subject: string
  message: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  created_at: string
  updated_at: string
}

