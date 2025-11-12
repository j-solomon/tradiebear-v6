import { useState, useMemo } from 'react'
import { applyLeadFilters, LeadFilters } from './lead-filters'

interface Lead {
  id: string
  homeowner_first?: string
  homeowner_last?: string
  homeowner_email?: string
  homeowner_phone?: string
  address_street?: string
  city: string
  state: string
  zip: string
  stage: string
  created_at: string
  sub_service?: { 
    name: string
    description?: string
    service?: { name: string }
  }
  referral_link?: {
    slug: string
    profiles?: {
      name: string
      handle: string
    }
  }
  budget_estimate?: number
  timeline?: string
  notes?: string
  extra_details?: any
}

/**
 * Custom hook for managing lead filters
 * Provides filtered leads and filter state management
 */
export function useLeadFilters(initialLeads: Lead[]) {
  const [filters, setFilters] = useState<LeadFilters>({
    searchTerm: "",
    stage: "all",
    serviceId: "all",
    referrerId: "all",
    dateRange: "all"
  })

  const filteredLeads = useMemo(() => {
    return applyLeadFilters(initialLeads, filters)
  }, [initialLeads, filters])

  const resetFilters = () => {
    setFilters({
      searchTerm: "",
      stage: "all",
      serviceId: "all",
      referrerId: "all",
      dateRange: "all"
    })
  }

  return {
    filters,
    setFilters,
    filteredLeads,
    resetFilters,
    hasActiveFilters: 
      filters.searchTerm !== "" || 
      filters.stage !== "all" || 
      filters.serviceId !== "all" || 
      filters.referrerId !== "all" || 
      filters.dateRange !== "all"
  }
}

/**
 * Custom hook for lead search functionality
 * Filters leads based on search term across multiple fields
 */
export function useLeadSearch(leads: Lead[], searchTerm: string) {
  const searchedLeads = useMemo(() => {
    if (!searchTerm) return leads

    const searchLower = searchTerm.toLowerCase()
    return leads.filter(lead => {
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
  }, [leads, searchTerm])

  return searchedLeads
}

/**
 * Custom hook for lead pagination
 * Provides paginated leads and pagination controls
 */
export function useLeadPagination(leads: Lead[], pageSize: number = 10) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(leads.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize

  const paginatedLeads = useMemo(() => {
    return leads.slice(startIndex, endIndex)
  }, [leads, startIndex, endIndex])

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const nextPage = () => goToPage(currentPage + 1)
  const prevPage = () => goToPage(currentPage - 1)
  const goToFirstPage = () => goToPage(1)
  const goToLastPage = () => goToPage(totalPages)

  return {
    paginatedLeads,
    currentPage,
    totalPages,
    pageSize,
    totalItems: leads.length,
    startIndex: startIndex + 1,
    endIndex: Math.min(endIndex, leads.length),
    goToPage,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  }
}

