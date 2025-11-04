"use client"

import { useState } from "react"
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
import { Eye, Search } from "lucide-react"

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  street: string
  city: string
  state: string
  zip: string
  stage: string
  created_at: string
  service?: { name: string }
  referral_link?: {
    slug: string
    profiles?: {
      full_name: string
      company_name: string
    }
  }
  budget?: number
  timeline?: string
  notes?: string
  attachments?: string[]
}

interface LeadsTabProps {
  initialLeads: Lead[]
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

export default function LeadsTab({ initialLeads }: LeadsTabProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [stageFilter, setStageFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const { toast } = useToast()

  const filteredLeads = leads.filter((lead) => {
    const matchesStage = stageFilter === "all" || lead.stage === stageFilter
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm)
    return matchesStage && matchesSearch
  })

  const updateLeadStage = async (leadId: string, newStage: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('leads')
      .update({ stage: newStage })
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
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {STAGE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{lead.email}</div>
                          <div className="text-muted-foreground">{lead.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>{lead.service?.name || 'N/A'}</TableCell>
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
                        {lead.referral_link?.profiles?.company_name || 
                         lead.referral_link?.profiles?.full_name || 
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
                                Complete information for {lead.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Name</Label>
                                  <p className="text-sm">{lead.name}</p>
                                </div>
                                <div>
                                  <Label>Email</Label>
                                  <p className="text-sm">{lead.email}</p>
                                </div>
                                <div>
                                  <Label>Phone</Label>
                                  <p className="text-sm">{lead.phone}</p>
                                </div>
                                <div>
                                  <Label>Service</Label>
                                  <p className="text-sm">{lead.service?.name}</p>
                                </div>
                              </div>
                              <div>
                                <Label>Address</Label>
                                <p className="text-sm">
                                  {lead.street}<br />
                                  {lead.city}, {lead.state} {lead.zip}
                                </p>
                              </div>
                              {lead.budget && (
                                <div>
                                  <Label>Budget</Label>
                                  <p className="text-sm">${lead.budget.toLocaleString()}</p>
                                </div>
                              )}
                              {lead.timeline && (
                                <div>
                                  <Label>Timeline</Label>
                                  <p className="text-sm">{lead.timeline}</p>
                                </div>
                              )}
                              {lead.notes && (
                                <div>
                                  <Label>Notes</Label>
                                  <p className="text-sm whitespace-pre-wrap">{lead.notes}</p>
                                </div>
                              )}
                              {lead.attachments && lead.attachments.length > 0 && (
                                <div>
                                  <Label>Attachments</Label>
                                  <div className="grid grid-cols-2 gap-2 mt-2">
                                    {lead.attachments.map((url, idx) => (
                                      <a
                                        key={idx}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-primary hover:underline"
                                      >
                                        Image {idx + 1}
                                      </a>
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
    </div>
  )
}

