"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Trash2, Search } from "lucide-react"

interface ServiceArea {
  id: string
  state_code: string
  zip_code: string
  created_at: string
  sub_service?: {
    id: string
    name: string
    service?: {
      name: string
    }
  }
  state?: {
    code: string
    name: string
  }
  county?: {
    id: string
    name: string
  }
  city?: {
    id: string
    name: string
  }
  zip?: {
    code: string
  }
}

interface AreasTabProps {
  initialAreas: ServiceArea[]
}

export default function AreasTab({ initialAreas }: AreasTabProps) {
  const [areas, setAreas] = useState<ServiceArea[]>(initialAreas)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const handleDeleteArea = async (areaId: string) => {
    const confirmed = confirm("Are you sure you want to delete this service area?")
    if (!confirmed) return

    const supabase = createClient()

    const { error } = await supabase
      .from('service_area_map')
      .delete()
      .eq('id', areaId)

    if (error) {
      console.error('Delete error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete service area.",
      })
      return
    }

    setAreas(areas.filter(area => area.id !== areaId))

    toast({
      title: "Success",
      description: "Service area deleted.",
    })
  }

  // Filter areas based on search
  const filteredAreas = areas.filter((area) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      area.state?.name?.toLowerCase().includes(searchLower) ||
      area.state_code?.toLowerCase().includes(searchLower) ||
      area.county?.name?.toLowerCase().includes(searchLower) ||
      area.city?.name?.toLowerCase().includes(searchLower) ||
      area.zip_code?.includes(searchTerm) ||
      area.sub_service?.name?.toLowerCase().includes(searchLower) ||
      area.sub_service?.service?.name?.toLowerCase().includes(searchLower)
    )
  })

  // Group areas by state for summary
  const stateSummary = areas.reduce((acc, area) => {
    const stateName = area.state?.name || area.state_code
    acc[stateName] = (acc[stateName] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Service Areas</CardTitle>
            <CardDescription>
              Geographic coverage for all services ({areas.length} total areas)
            </CardDescription>
          </div>
        </div>
        
        {/* Summary badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          {Object.entries(stateSummary).map(([state, count]) => (
            <Badge key={state} variant="secondary">
              {state}: {count} areas
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by state, county, city, ZIP, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {filteredAreas.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? "No service areas match your search." : "No service areas defined yet."}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sub-Service</TableHead>
                  <TableHead>Service Category</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>County</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>ZIP</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAreas.slice(0, 100).map((area) => (
                  <TableRow key={area.id}>
                    <TableCell className="font-medium">
                      {area.sub_service?.name || <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell>
                      {area.sub_service?.service?.name || <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{area.state?.name || area.state_code}</div>
                        <div className="text-xs text-muted-foreground">{area.state_code}</div>
                      </div>
                    </TableCell>
                    <TableCell>{area.county?.name || <span className="text-muted-foreground">—</span>}</TableCell>
                    <TableCell>{area.city?.name || <span className="text-muted-foreground">—</span>}</TableCell>
                    <TableCell className="font-mono">{area.zip_code}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(area.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteArea(area.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredAreas.length > 100 && (
              <div className="p-4 text-center text-sm text-muted-foreground border-t">
                Showing first 100 of {filteredAreas.length} results. Use search to narrow down.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
