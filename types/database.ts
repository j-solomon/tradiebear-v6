// Database type definitions for Supabase tables

export interface Profile {
  id: string
  email: string
  full_name?: string
  company_name?: string
  role: 'admin' | 'partner' | 'user'
  created_at: string
  updated_at: string
}

export interface ReferralLink {
  id: string
  user_id: string
  slug: string
  is_active: boolean
  created_at: string
  profiles?: Profile
}

export interface Service {
  id: string
  name: string
  description?: string
  is_active: boolean
  created_at: string
}

export interface Lead {
  id: string
  referral_link_id: string
  service_id: string
  name: string
  email: string
  phone: string
  street: string
  city: string
  state: string
  zip: string
  budget?: number
  timeline?: string
  notes?: string
  attachments?: string[]
  consent_email: boolean
  consent_sms: boolean
  consent_call: boolean
  stage: 'new' | 'contacted' | 'qualified' | 'quoted' | 'won' | 'lost'
  created_at: string
  updated_at: string
}

export interface ServiceArea {
  id: string
  state?: string
  county?: string
  city?: string
  zip?: string
  created_at: string
}

export interface CommissionTier {
  id: string
  min_amount: number
  max_amount?: number
  percentage: number
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

