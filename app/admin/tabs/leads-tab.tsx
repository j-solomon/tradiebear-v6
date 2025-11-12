"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Eye, Search, Loader2 } from "lucide-react"
import LeadSearchFilters, { LeadFilters } from "../components/leads/lead-search-filters"
import { applyLeadFilters } from "../components/leads/lead-filters"

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

interface Service {
  id: string
  name: string
  slug: string
}

interface LeadsTabProps {
  initialLeads: Lead[]
  services: Service[]
}

const STAGE_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "quoted", label: "Quoted" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
]

const STAGE_COLORS: Record<string, string> = {
  new: "bg-blue-500",
  contacted: "bg-purple-500",
  qualified: "bg-yellow-500",
  quoted: "bg-orange-500",
  won: "bg-green-500",
  lost: "bg-gray-500",
}

export default function LeadsTab({ initialLeads, services }: LeadsTabProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [filters, setFilters] = useState<LeadFilters>({
    searchTerm: "",
    stage: "all",
    serviceId: "all",
    referrerId: "all",
    dateRange: "all"
  })
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const { toast } = useToast()

  // Wrap setFilters in useCallback to prevent unnecessary re-renders
  const handleFiltersChange = useCallback((newFilters: LeadFilters) => {
    setFilters(newFilters)
  }, [])

  // Helper function to get service name by ID
  const getServiceNameById = (serviceId: string | null | undefined): string | null => {
    if (!serviceId) return null
    const service = services.find(s => s.id === serviceId)
    return service?.name || null
  }

  // Function to get signed URL for images
  const getImageUrl = async (filename: string): Promise<string | null> => {
    const supabase = createClient()
    const { data, error } = await supabase.storage
      .from('lead-attachments')
      .createSignedUrl(filename, 3600) // 1 hour expiry
    
    if (error) {
      console.error('Error generating signed URL:', error)
      return null
    }
    return data.signedUrl
  }

  // Load images when a lead is selected
  useEffect(() => {
    if (selectedLead?.extra_details?.attachments) {
      const loadImages = async () => {
        const urls: Record<string, string> = {}
        for (const filename of selectedLead.extra_details.attachments) {
          const url = await getImageUrl(filename)
          if (url) urls[filename] = url
        }
        setImageUrls(urls)
      }
      loadImages()
    } else {
      setImageUrls({})
    }
  }, [selectedLead])

  // Apply filters using the new filtering system
  const filteredLeads = applyLeadFilters(leads, filters)
  
  // Prepare referrers list for filter dropdown
  const referrers = Array.from(
    new Set(
      leads
        .filter(lead => lead.referral_link?.profiles?.name)
        .map(lead => ({
          id: lead.referral_link?.slug || '',
          name: lead.referral_link?.profiles?.name || ''
        }))
        .map(r => JSON.stringify(r))
    )
  ).map(str => JSON.parse(str))

  const updateLeadStage = async (leadId: string, newStage: string) => {
    const supabase = createClient()
    
    // Prepare update object with stage and appropriate timestamp
    const updateData: any = { stage: newStage }
    const now = new Date().toISOString()
    
    // Set timestamp based on stage change
    switch (newStage) {
      case 'contacted':
        updateData.contacted_at = now
        break
      case 'qualified':
        updateData.qualified_at = now
        break
      case 'quoted':
        updateData.quoted_at = now
        break
      case 'won':
      case 'lost':
        updateData.closed_at = now
        break
    }
    
    const { error } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', leadId)

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update lead stage.",
      })
      return
    }

    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, stage: newStage } : lead
    ))

    toast({
      title: "Success",
      description: "Lead stage updated.",
    })
  }

  if (leads.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Leads Yet</CardTitle>
          <CardDescription>
            Leads will appear here once homeowners submit estimate requests through referral links.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Lead Management</CardTitle>
          <CardDescription>
            View and manage all incoming lead requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <LeadSearchFilters
            services={services}
            referrers={referrers}
            onFiltersChange={handleFiltersChange}
          />

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Referred By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      No leads found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">
                        {lead.homeowner_first} {lead.homeowner_last}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{lead.homeowner_email}</div>
                          <div className="text-muted-foreground">{lead.homeowner_phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">
                            {lead.sub_service?.description || 
                             lead.sub_service?.name || 
                             getServiceNameById(lead.extra_details?.service_id) ||
                             'Not specified'}
                          </div>
                          {(lead.sub_service?.service?.name || getServiceNameById(lead.extra_details?.service_id)) && (
                            <div className="text-xs text-muted-foreground">
                              {lead.sub_service?.service?.name || 
                               (lead.extra_details?.service_id && getServiceNameById(lead.extra_details?.service_id))}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {lead.city}, {lead.state}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={lead.stage}
                          onValueChange={(value) => updateLeadStage(lead.id, value)}
                        >
                          <SelectTrigger className="w-[130px]">
                            <Badge className={STAGE_COLORS[lead.stage] || "bg-gray-500"}>
                              {STAGE_OPTIONS.find(s => s.value === lead.stage)?.label || lead.stage}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {STAGE_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {lead.referral_link?.profiles?.name || 
                         lead.referral_link?.profiles?.handle || 
                         'Direct'}
                      </TableCell>
                      <TableCell>
                        {new Date(lead.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedLead(lead)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Lead Details</DialogTitle>
                              <DialogDescription>
                                Complete information for {lead.homeowner_first} {lead.homeowner_last}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              {/* Referral Source - Prominent at top */}
                              <div className="bg-primary/5 rounded-lg p-4">
                                <Label>Referred By</Label>
                                <p className="text-lg font-semibold">
                                  {lead.referral_link?.profiles?.name || 
                                   lead.referral_link?.profiles?.handle || 
                                   'Direct'}
                                </p>
                                {lead.referral_link?.slug && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Link: /r/{lead.referral_link.slug}
                                  </p>
                                )}
                              </div>

                              {/* Contact Info */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Name</Label>
                                  <p className="text-sm">{lead.homeowner_first} {lead.homeowner_last}</p>
                                </div>
                                <div>
                                  <Label>Email</Label>
                                  <p className="text-sm">{lead.homeowner_email}</p>
                                </div>
                                <div>
                                  <Label>Phone</Label>
                                  <p className="text-sm">{lead.homeowner_phone}</p>
                                </div>
                                <div>
                                  <Label>Service Category</Label>
                                  <p className="text-sm">
                                    {lead.sub_service?.service?.name || 
                                     getServiceNameById(lead.extra_details?.service_id) || 
                                     'Not specified'}
                                  </p>
                                </div>
                                <div className="col-span-2">
                                  <Label>Specific Service</Label>
                                  <p className="text-sm font-medium">
                                    {lead.sub_service?.description || 
                                     lead.sub_service?.name || 
                                     'Not specified'}
                                  </p>
                                </div>
                              </div>

                              {/* Address */}
                              <div>
                                <Label>Address</Label>
                                <p className="text-sm">
                                  {lead.address_street}<br />
                                  {lead.city}, {lead.state} {lead.zip}
                                </p>
                              </div>

                              {/* Budget - Always shown */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Budget Range</Label>
                                  <p className="text-sm">
                                    {lead.extra_details?.budget_range || 'Not provided'}
                                  </p>
                                </div>
                                <div>
                                  <Label>Project Timeline</Label>
                                  <p className="text-sm">
                                    {lead.timeline || 'Not provided'}
                                  </p>
                                </div>
                              </div>

                              {/* Notes - Always shown */}
                              <div>
                                <Label>Additional Notes</Label>
                                <p className="text-sm whitespace-pre-wrap">
                                  {lead.notes || 'No additional notes provided'}
                                </p>
                              </div>

                              {/* Images with thumbnails */}
                              {lead.extra_details?.attachments && lead.extra_details.attachments.length > 0 && (
                                <div>
                                  <Label>Photos ({lead.extra_details.attachments.length})</Label>
                                  <div className="grid grid-cols-3 gap-2 mt-2">
                                    {lead.extra_details.attachments.map((filename: string, idx: number) => (
                                      <div
                                        key={idx}
                                        className="relative aspect-square rounded-lg overflow-hidden border cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={async () => {
                                          const url = await getImageUrl(filename)
                                          if (url) {
                                            setSelectedImage(url)
                                            setImageDialogOpen(true)
                                          }
                                        }}
                                      >
                                        {imageUrls[filename] ? (
                                          <img 
                                            src={imageUrls[filename]} 
                                            alt={`Attachment ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <div className="w-full h-full bg-muted flex items-center justify-center">
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Image Preview Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Full size preview" 
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

