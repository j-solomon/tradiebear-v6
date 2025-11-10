"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react"

interface ServiceArea {
  id: string
  state_code: string
  zip_code: string
  created_at: string
  sub_service?: {
    id: string
    name: string
    slug: string
    description?: string
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
}

interface AreasTabProps {
  initialAreas: ServiceArea[]
}

export default function AreasTab({ initialAreas }: AreasTabProps) {
  const [areas, setAreas] = useState<ServiceArea[]>(initialAreas)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 100
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
      area.sub_service?.slug?.toLowerCase().includes(searchLower) ||
      area.sub_service?.description?.toLowerCase().includes(searchLower) ||
      area.sub_service?.service?.name?.toLowerCase().includes(searchLower)
    )
  })

  // Reset to page 1 when search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  // Pagination calculations
  const totalPages = Math.ceil(filteredAreas.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAreas = filteredAreas.slice(startIndex, endIndex)

  // Group areas by sub-service for summary
  const subServiceSummary = areas.reduce((acc, area) => {
    const subServiceName = area.sub_service?.description || area.sub_service?.name || 'Unknown'
    acc[subServiceName] = (acc[subServiceName] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Get unique sub-services count
  const uniqueSubServices = new Set(areas.map(a => a.sub_service?.id)).size

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Service Areas</CardTitle>
            <CardDescription>
              {areas.length} total coverage areas across {uniqueSubServices} sub-services
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by sub-service, state, county, city, ZIP..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {filteredAreas.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? "No service areas match your search." : "No service areas defined yet."}
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sub-Service</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>County</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>ZIP</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentAreas.map((area) => (
                    <TableRow key={area.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">
                            {area.sub_service?.description || area.sub_service?.name || '—'}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {area.sub_service?.slug}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {area.sub_service?.service?.name || '—'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{area.state?.name || area.state_code}</div>
                          <div className="text-xs text-muted-foreground">{area.state_code}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{area.county?.name || <span className="text-muted-foreground">—</span>}</TableCell>
                      <TableCell className="text-sm">{area.city?.name || <span className="text-muted-foreground">—</span>}</TableCell>
                      <TableCell className="font-mono text-sm">{area.zip_code}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
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
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredAreas.length)} of {filteredAreas.length} results
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <div className="text-sm font-medium px-2">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
