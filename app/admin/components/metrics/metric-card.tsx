"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUp, ArrowDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  loading?: boolean
}

export default function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  loading = false
}: MetricCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {title}
          </CardTitle>
          {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
        </CardHeader>
        <CardContent>
          <div className="h-7 bg-muted animate-pulse rounded mb-2"></div>
          <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
        </CardContent>
      </Card>
    )
  }

  const getTrendIndicator = () => {
    if (change === undefined || change === null || change === 0) {
      return (
        <div className="flex items-center text-xs text-muted-foreground">
          <Minus className="mr-1 h-3 w-3" />
          <span>No change</span>
        </div>
      )
    }

    if (change > 0) {
      return (
        <div className="flex items-center text-xs text-green-600 dark:text-green-400">
          <ArrowUp className="mr-1 h-3 w-3" />
          <span>{Math.abs(change)}%</span>
        </div>
      )
    }

    return (
      <div className="flex items-center text-xs text-red-600 dark:text-red-400">
        <ArrowDown className="mr-1 h-3 w-3" />
        <span>{Math.abs(change)}%</span>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between mt-1">
          {getTrendIndicator()}
          {changeLabel && (
            <p className="text-xs text-muted-foreground">
              {changeLabel}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

