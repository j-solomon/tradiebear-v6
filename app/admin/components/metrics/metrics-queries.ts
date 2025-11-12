import { SupabaseClient } from '@supabase/supabase-js'

// ============================================================
// Utility Functions for Date Calculations
// ============================================================

function getStartOfDay(daysAgo: number = 0): string {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  date.setHours(0, 0, 0, 0)
  return date.toISOString()
}

function getEndOfDay(daysAgo: number = 0): string {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  date.setHours(23, 59, 59, 999)
  return date.toISOString()
}

function getStartOfWeek(weeksAgo: number = 0): string {
  const date = new Date()
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Monday as start of week
  date.setDate(diff - (weeksAgo * 7))
  date.setHours(0, 0, 0, 0)
  return date.toISOString()
}

function getStartOfMonth(monthsAgo: number = 0): string {
  const date = new Date()
  date.setMonth(date.getMonth() - monthsAgo, 1)
  date.setHours(0, 0, 0, 0)
  return date.toISOString()
}

function getEndOfMonth(monthsAgo: number = 0): string {
  const date = new Date()
  date.setMonth(date.getMonth() - monthsAgo + 1, 0)
  date.setHours(23, 59, 59, 999)
  return date.toISOString()
}

// ============================================================
// Metric Calculation Functions
// ============================================================

/**
 * Daily Active Users (DAU)
 * Counts unique form submissions + unique referral link visits in last 24 hours
 */
export async function getDailyActiveUsers(supabase: SupabaseClient, days: number = 1) {
  const startDate = getStartOfDay(days)
  const endDate = getEndOfDay(0)

  try {
    // Count new leads (form submissions) in the period
    const { count: newLeadsCount } = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', startDate)
      .lte('created_at', endDate)

    // Count page views in the period
    const { count: pageViewsCount } = await supabase
      .from('page_views')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', startDate)
      .lte('created_at', endDate)

    // Get previous period for comparison
    const prevStartDate = getStartOfDay(days * 2)
    const prevEndDate = getEndOfDay(days)

    const { count: prevLeadsCount } = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', prevStartDate)
      .lt('created_at', prevEndDate)

    const { count: prevPageViewsCount } = await supabase
      .from('page_views')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', prevStartDate)
      .lt('created_at', prevEndDate)

    const currentTotal = (newLeadsCount || 0) + (pageViewsCount || 0)
    const previousTotal = (prevLeadsCount || 0) + (prevPageViewsCount || 0)

    const change = previousTotal > 0 
      ? ((currentTotal - previousTotal) / previousTotal) * 100 
      : currentTotal > 0 ? 100 : 0

    return {
      value: currentTotal,
      change: Math.round(change),
      changeLabel: days === 1 ? 'vs yesterday' : `vs previous ${days} days`
    }
  } catch (error) {
    console.error('Error fetching DAU:', error)
    return { value: 0, change: 0, changeLabel: 'vs yesterday' }
  }
}

/**
 * Pending Leads Count
 * Counts leads that are not yet closed (won/lost)
 */
export async function getPendingLeadsCount(supabase: SupabaseClient) {
  try {
    const { count: currentCount } = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .in('stage', ['submitted', 'new', 'contacted', 'qualified', 'quoted'])

    // Get count from last week for comparison
    const lastWeekStart = getStartOfWeek(1)
    const lastWeekEnd = getStartOfWeek(0)

    const { count: lastWeekCount } = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .in('stage', ['submitted', 'new', 'contacted', 'qualified', 'quoted'])
      .gte('created_at', lastWeekStart)
      .lt('created_at', lastWeekEnd)

    const change = lastWeekCount && lastWeekCount > 0
      ? (((currentCount || 0) - lastWeekCount) / lastWeekCount) * 100
      : (currentCount || 0) > 0 ? 100 : 0

    return {
      value: currentCount || 0,
      change: Math.round(change),
      changeLabel: 'vs last week'
    }
  } catch (error) {
    console.error('Error fetching pending leads:', error)
    return { value: 0, change: 0, changeLabel: 'vs last week' }
  }
}

/**
 * Leads Closed This Month
 * Counts leads with stage 'won' closed in current month
 */
export async function getLeadsClosedThisMonth(supabase: SupabaseClient) {
  try {
    const currentMonthStart = getStartOfMonth(0)
    
    const { count: currentCount } = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('stage', 'won')
      .gte('closed_at', currentMonthStart)

    // Get previous month for comparison
    const prevMonthStart = getStartOfMonth(1)
    const prevMonthEnd = getEndOfMonth(1)

    const { count: prevCount } = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('stage', 'won')
      .gte('closed_at', prevMonthStart)
      .lte('closed_at', prevMonthEnd)

    const change = prevCount && prevCount > 0
      ? (((currentCount || 0) - prevCount) / prevCount) * 100
      : (currentCount || 0) > 0 ? 100 : 0

    return {
      value: currentCount || 0,
      change: Math.round(change),
      changeLabel: 'vs last month'
    }
  } catch (error) {
    console.error('Error fetching closed leads:', error)
    return { value: 0, change: 0, changeLabel: 'vs last month' }
  }
}

/**
 * New Leads This Week
 * Counts leads created in the current week
 */
export async function getNewLeadsThisWeek(supabase: SupabaseClient) {
  try {
    const currentWeekStart = getStartOfWeek(0)

    const { count: currentCount } = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', currentWeekStart)

    // Get previous week for comparison
    const prevWeekStart = getStartOfWeek(1)
    const prevWeekEnd = getStartOfWeek(0)

    const { count: prevCount } = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', prevWeekStart)
      .lt('created_at', prevWeekEnd)

    const change = prevCount && prevCount > 0
      ? (((currentCount || 0) - prevCount) / prevCount) * 100
      : (currentCount || 0) > 0 ? 100 : 0

    return {
      value: currentCount || 0,
      change: Math.round(change),
      changeLabel: 'vs last week'
    }
  } catch (error) {
    console.error('Error fetching new leads:', error)
    return { value: 0, change: 0, changeLabel: 'vs last week' }
  }
}

/**
 * Conversion Rate
 * Calculates (won leads / total leads) * 100 for current month
 */
export async function getConversionRate(supabase: SupabaseClient, period: 'month' | 'week' = 'month') {
  try {
    const startDate = period === 'month' ? getStartOfMonth(0) : getStartOfWeek(0)

    // Get total leads in period
    const { count: totalCount } = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', startDate)

    // Get won leads in period
    const { count: wonCount } = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('stage', 'won')
      .gte('created_at', startDate)

    const currentRate = totalCount && totalCount > 0
      ? ((wonCount || 0) / totalCount) * 100
      : 0

    // Get previous period for comparison
    const prevStartDate = period === 'month' ? getStartOfMonth(1) : getStartOfWeek(1)
    const prevEndDate = period === 'month' ? getEndOfMonth(1) : getStartOfWeek(0)

    const { count: prevTotalCount } = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', prevStartDate)
      .lte('created_at', prevEndDate)

    const { count: prevWonCount } = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('stage', 'won')
      .gte('created_at', prevStartDate)
      .lte('created_at', prevEndDate)

    const prevRate = prevTotalCount && prevTotalCount > 0
      ? ((prevWonCount || 0) / prevTotalCount) * 100
      : 0

    const change = prevRate > 0
      ? ((currentRate - prevRate) / prevRate) * 100
      : currentRate > 0 ? 100 : 0

    return {
      value: currentRate.toFixed(1) + '%',
      change: Math.round(change),
      changeLabel: period === 'month' ? 'vs last month' : 'vs last week'
    }
  } catch (error) {
    console.error('Error fetching conversion rate:', error)
    return { value: '0%', change: 0, changeLabel: 'vs last month' }
  }
}

/**
 * Total Revenue (Stub)
 * Placeholder for future revenue tracking implementation
 */
export async function getTotalRevenue(supabase: SupabaseClient) {
  // TODO: Implement when revenue tracking is added
  // Future implementation could:
  // 1. Sum lead.revenue field (to be added)
  // 2. Calculate from commission_tiers and won leads
  // 3. Integrate with payment processor
  
  return {
    value: '$0',
    change: 0,
    changeLabel: 'Coming soon'
  }
}

/**
 * Get all metrics at once
 * Optimized with Promise.all for parallel queries
 */
export async function getAllMetrics(supabase: SupabaseClient) {
  try {
    const [
      dau,
      pendingLeads,
      closedLeads,
      newLeads,
      conversionRate,
      revenue
    ] = await Promise.all([
      getDailyActiveUsers(supabase, 1),
      getPendingLeadsCount(supabase),
      getLeadsClosedThisMonth(supabase),
      getNewLeadsThisWeek(supabase),
      getConversionRate(supabase, 'month'),
      getTotalRevenue(supabase)
    ])

    return {
      dau,
      pendingLeads,
      closedLeads,
      newLeads,
      conversionRate,
      revenue
    }
  } catch (error) {
    console.error('Error fetching all metrics:', error)
    return {
      dau: { value: 0, change: 0, changeLabel: 'vs yesterday' },
      pendingLeads: { value: 0, change: 0, changeLabel: 'vs last week' },
      closedLeads: { value: 0, change: 0, changeLabel: 'vs last month' },
      newLeads: { value: 0, change: 0, changeLabel: 'vs last week' },
      conversionRate: { value: '0%', change: 0, changeLabel: 'vs last month' },
      revenue: { value: '$0', change: 0, changeLabel: 'Coming soon' }
    }
  }
}

