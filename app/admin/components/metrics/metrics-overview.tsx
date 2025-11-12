"use client"

import MetricCard from "./metric-card"
import { Users, Clock, CheckCircle, TrendingUp, Percent, DollarSign } from "lucide-react"

interface MetricData {
  value: string | number
  change: number
  changeLabel: string
}

interface MetricsOverviewProps {
  metrics: {
    dau: MetricData
    pendingLeads: MetricData
    closedLeads: MetricData
    newLeads: MetricData
    conversionRate: MetricData
    revenue: MetricData
  }
  loading?: boolean
}

export default function MetricsOverview({ metrics, loading = false }: MetricsOverviewProps) {
  return (
    <div className="space-y-4 mb-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Daily Active Users"
          value={metrics.dau.value}
          change={metrics.dau.change}
          changeLabel={metrics.dau.changeLabel}
          icon={<Users className="h-4 w-4" />}
          loading={loading}
        />
        <MetricCard
          title="Pending Leads"
          value={metrics.pendingLeads.value}
          change={metrics.pendingLeads.change}
          changeLabel={metrics.pendingLeads.changeLabel}
          icon={<Clock className="h-4 w-4" />}
          loading={loading}
        />
        <MetricCard
          title="Leads Closed This Month"
          value={metrics.closedLeads.value}
          change={metrics.closedLeads.change}
          changeLabel={metrics.closedLeads.changeLabel}
          icon={<CheckCircle className="h-4 w-4" />}
          loading={loading}
        />
        <MetricCard
          title="New Leads This Week"
          value={metrics.newLeads.value}
          change={metrics.newLeads.change}
          changeLabel={metrics.newLeads.changeLabel}
          icon={<TrendingUp className="h-4 w-4" />}
          loading={loading}
        />
        <MetricCard
          title="Conversion Rate"
          value={metrics.conversionRate.value}
          change={metrics.conversionRate.change}
          changeLabel={metrics.conversionRate.changeLabel}
          icon={<Percent className="h-4 w-4" />}
          loading={loading}
        />
        <MetricCard
          title="Total Revenue"
          value={metrics.revenue.value}
          change={metrics.revenue.change}
          changeLabel={metrics.revenue.changeLabel}
          icon={<DollarSign className="h-4 w-4" />}
          loading={loading}
        />
      </div>
    </div>
  )
}

