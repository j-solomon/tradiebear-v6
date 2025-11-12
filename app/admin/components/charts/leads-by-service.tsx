"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Leads by Service Chart Component (Placeholder)
 * 
 * TODO: Implement chart visualization using Recharts
 * - Install Recharts: npm install recharts
 * - Fetch lead data grouped by service/sub-service
 * - Display as pie chart or donut chart
 * - Show conversion rates per service
 * - Add filters for date range and stage
 * 
 * Example implementation:
 * import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
 */

interface LeadsByServiceProps {
  data?: Array<{ 
    service: string
    count: number
    conversionRate?: number
  }>
}

export default function LeadsByService({ data = [] }: LeadsByServiceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads by Service</CardTitle>
        <CardDescription>
          Distribution of leads across different service types
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-[300px] text-muted-foreground">
          <div className="text-center">
            <p className="text-lg font-medium mb-2">Coming Soon</p>
            <p className="text-sm">
              This chart will show lead distribution by service category
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Future Implementation Notes:
 * 
 * 1. Data Structure:
 *    - Query leads grouped by service and sub_service
 *    - Calculate count and conversion rate per service
 *    - Include revenue data if available
 * 
 * 2. Visualization Options:
 *    - Pie/Donut chart for service distribution
 *    - Bar chart with conversion rates
 *    - Stacked bar chart showing stages per service
 *    - Treemap for service hierarchy
 * 
 * 3. Metrics to Display:
 *    - Total leads per service
 *    - Conversion rate (won / total)
 *    - Average time to close
 *    - Revenue per service (future)
 * 
 * 4. Interactivity:
 *    - Click service to filter leads table
 *    - Drill down from service to sub-service
 *    - Compare different time periods
 *    - Toggle between count and revenue view
 * 
 * 5. Performance:
 *    - Server-side aggregation
 *    - Cache frequently accessed data
 *    - Lazy load detailed breakdowns
 */

