import { SupabaseClient } from '@supabase/supabase-js'

export interface LeadFilters {
  searchTerm: string
  stage: string
  serviceId: string
  referrerId: string
  dateRange: string
}

interface Lead {
  id: string
  homeowner_first?: string
  homeowner_last?: string
  homeowner_email?: string
  homeowner_phone?: string
  notes?: string
  stage: string
  created_at: string
  sub_service?: {
    id: string
    service?: { id: string }
  }
  referral_link?: {
    id: string
  }
}

/**
 * Apply filters to an array of leads (client-side filtering)
 */
export function applyLeadFilters(leads: Lead[], filters: LeadFilters): Lead[] {
  let filtered = [...leads]

  // Search filter
  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase()
    filtered = filtered.filter(lead => {
      const firstName = (lead.homeowner_first || '').toLowerCase()
      const lastName = (lead.homeowner_last || '').toLowerCase()
      const email = (lead.homeowner_email || '').toLowerCase()
      const phone = (lead.homeowner_phone || '').toLowerCase()
      const notes = (lead.notes || '').toLowerCase()

      return (
        firstName.includes(searchLower) ||
        lastName.includes(searchLower) ||
        email.includes(searchLower) ||
        phone.includes(searchLower) ||
        notes.includes(searchLower)
      )
    })
  }

  // Stage filter
  if (filters.stage && filters.stage !== 'all') {
    filtered = filtered.filter(lead => lead.stage === filters.stage)
  }

  // Service filter
  if (filters.serviceId && filters.serviceId !== 'all') {
    filtered = filtered.filter(lead => {
      if (!lead.sub_service) return false
      return lead.sub_service.service?.id === filters.serviceId
    })
  }

  // Referrer filter
  if (filters.referrerId && filters.referrerId !== 'all') {
    filtered = filtered.filter(lead => {
      return lead.referral_link?.id === filters.referrerId
    })
  }

  // Date range filter
  if (filters.dateRange && filters.dateRange !== 'all') {
    const now = new Date()
    let startDate: Date

    switch (filters.dateRange) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0))
        break
      case 'week':
        startDate = new Date()
        startDate.setDate(startDate.getDate() - 7)
        break
      case 'month':
        startDate = new Date()
        startDate.setMonth(startDate.getMonth() - 1)
        break
      case 'last30':
        startDate = new Date()
        startDate.setDate(startDate.getDate() - 30)
        break
      default:
        startDate = new Date(0) // Beginning of time
    }

    filtered = filtered.filter(lead => {
      const leadDate = new Date(lead.created_at)
      return leadDate >= startDate
    })
  }

  return filtered
}

/**
 * Build a Supabase query with filters (server-side filtering)
 * For better performance with large datasets
 */
export function buildSupabaseQuery(
  supabase: SupabaseClient,
  filters: LeadFilters
) {
  let query = supabase
    .from('leads')
    .select(`
      *,
      sub_service:sub_services!sub_service_id(
        id,
        name,
        description,
        service:services(id, name)
      ),
      referral_link:referral_links!referral_id(
        id,
        slug,
        profiles:user_id(name, handle, email)
      )
    `)

  // Stage filter
  if (filters.stage && filters.stage !== 'all') {
    query = query.eq('stage', filters.stage)
  }

  // Date range filter
  if (filters.dateRange && filters.dateRange !== 'all') {
    const now = new Date()
    let startDate: string

    switch (filters.dateRange) {
      case 'today':
        const today = new Date(now.setHours(0, 0, 0, 0))
        startDate = today.toISOString()
        break
      case 'week':
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        startDate = weekAgo.toISOString()
        break
      case 'month':
        const monthAgo = new Date()
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        startDate = monthAgo.toISOString()
        break
      case 'last30':
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        startDate = thirtyDaysAgo.toISOString()
        break
      default:
        startDate = new Date(0).toISOString()
    }

    query = query.gte('created_at', startDate)
  }

  // Referrer filter
  if (filters.referrerId && filters.referrerId !== 'all') {
    query = query.eq('referral_id', filters.referrerId)
  }

  // Search filter using ILIKE (fuzzy matching)
  // Note: For better performance with large datasets, use the GIN index with to_tsvector
  if (filters.searchTerm) {
    const searchPattern = `%${filters.searchTerm}%`
    query = query.or(
      `homeowner_first.ilike.${searchPattern},` +
      `homeowner_last.ilike.${searchPattern},` +
      `homeowner_email.ilike.${searchPattern},` +
      `homeowner_phone.ilike.${searchPattern},` +
      `notes.ilike.${searchPattern}`
    )
  }

  return query.order('created_at', { ascending: false })
}

/**
 * Full-text search using Postgres GIN index (for large datasets)
 * Requires the idx_leads_search index to be created
 */
export async function searchLeadsFullText(
  supabase: SupabaseClient,
  searchTerm: string,
  additionalFilters?: Partial<LeadFilters>
) {
  if (!searchTerm) {
    return buildSupabaseQuery(supabase, {
      searchTerm: '',
      stage: additionalFilters?.stage || 'all',
      serviceId: additionalFilters?.serviceId || 'all',
      referrerId: additionalFilters?.referrerId || 'all',
      dateRange: additionalFilters?.dateRange || 'all'
    })
  }

  // Use Postgres full-text search with the GIN index
  const { data, error } = await supabase
    .rpc('search_leads', { search_query: searchTerm })
    .select(`
      *,
      sub_service:sub_services!sub_service_id(
        id,
        name,
        description,
        service:services(id, name)
      ),
      referral_link:referral_links!referral_id(
        id,
        slug,
        profiles:user_id(name, handle, email)
      )
    `)

  return { data, error }
}

