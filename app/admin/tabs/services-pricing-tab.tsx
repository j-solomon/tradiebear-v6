"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, ChevronDown, ChevronRight, MapPin, Loader2 } from "lucide-react"

interface ServiceCommission {
  id: string
  percentage: number
  created_at: string
}

interface SubService {
  id: string
  service_id: string
  name: string
  slug: string
  description?: string
  active: boolean
  created_at: string
  service_commissions?: ServiceCommission[]
}

interface Service {
  id: string
  name: string
  description?: string
  active: boolean
  sort_order?: number
  created_at: string
  service_commissions?: ServiceCommission[]
  sub_services?: SubService[]
}

interface ServicesPricingTabProps {
  initialServices: Service[]
}

export default function ServicesPricingTab({ initialServices }: ServicesPricingTabProps) {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set())
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [editingSubService, setEditingSubService] = useState<SubService | null>(null)
  const [editingCommission, setEditingCommission] = useState<{id: string, type: 'service' | 'sub_service', value: string} | null>(null)
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false)
  const [isSubServiceDialogOpen, setIsSubServiceDialogOpen] = useState(false)
  const [selectedServiceForSub, setSelectedServiceForSub] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    commission: "10",
  })

  const [subServiceForm, setSubServiceForm] = useState({
    name: "",
    slug: "",
    description: "",
  })

  const toggleServiceExpanded = (serviceId: string) => {
    const newExpanded = new Set(expandedServices)
    if (newExpanded.has(serviceId)) {
      newExpanded.delete(serviceId)
    } else {
      newExpanded.add(serviceId)
    }
    setExpandedServices(newExpanded)
  }

  const openServiceDialog = (service?: Service) => {
    if (service) {
      setEditingService(service)
      const commission = service.service_commissions?.[0]?.percentage || 10
      setServiceForm({
        name: service.name,
        description: service.description || "",
        commission: commission.toString(),
      })
    } else {
      setEditingService(null)
      setServiceForm({
        name: "",
        description: "",
        commission: "10",
      })
    }
    setIsServiceDialogOpen(true)
  }

  const openSubServiceDialog = (serviceId: string, subService?: SubService) => {
    setSelectedServiceForSub(serviceId)
    if (subService) {
      setEditingSubService(subService)
      setSubServiceForm({
        name: subService.name,
        slug: subService.slug,
        description: subService.description || "",
      })
    } else {
      setEditingSubService(null)
      setSubServiceForm({
        name: "",
        slug: "",
        description: "",
      })
    }
    setIsSubServiceDialogOpen(true)
  }

  const handleSaveService = async () => {
    if (!serviceForm.name.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Service name is required.",
      })
      return
    }

    const commission = parseFloat(serviceForm.commission)
    if (isNaN(commission) || commission < 0 || commission > 100) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Commission must be between 0 and 100.",
      })
      return
    }

    setLoading(true)
    const supabase = createClient()

    try {
      if (editingService) {
        // Update existing service
        const { error: serviceError } = await supabase
          .from('services')
          .update({
            name: serviceForm.name,
            description: serviceForm.description || null,
          })
          .eq('id', editingService.id)

        if (serviceError) throw serviceError

        // Update commission
        if (editingService.service_commissions?.[0]) {
          const { error: commError } = await supabase
            .from('service_commissions')
            .update({ percentage: commission })
            .eq('id', editingService.service_commissions[0].id)

          if (commError) throw commError
        } else {
          const { error: commError } = await supabase
            .from('service_commissions')
            .insert({
              service_id: editingService.id,
              percentage: commission,
            })

          if (commError) throw commError
        }

        // Update local state
        setServices(services.map(s => 
          s.id === editingService.id 
            ? {
                ...s,
                name: serviceForm.name,
                description: serviceForm.description || null,
                service_commissions: [{
                  ...s.service_commissions?.[0],
                  id: s.service_commissions?.[0]?.id || '',
                  percentage: commission,
                  created_at: s.service_commissions?.[0]?.created_at || new Date().toISOString(),
                }]
              }
            : s
        ))
      } else {
        // Create new service
        const { data: newService, error: serviceError } = await supabase
          .from('services')
          .insert({
            name: serviceForm.name,
            description: serviceForm.description || null,
            active: true,
          })
          .select()
          .single()

        if (serviceError) throw serviceError

        // Create commission for new service
        const { data: newCommission, error: commError } = await supabase
          .from('service_commissions')
          .insert({
            service_id: newService.id,
            percentage: commission,
          })
          .select()
          .single()

        if (commError) throw commError

        setServices([...services, {
          ...newService,
          service_commissions: [newCommission],
          sub_services: []
        }])
      }

      toast({
        title: "Success",
        description: editingService ? "Service updated successfully." : "Service created successfully.",
      })

      setIsServiceDialogOpen(false)
    } catch (error) {
      console.error('Save service error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save service.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSubService = async () => {
    if (!subServiceForm.name.trim() || !selectedServiceForSub) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Sub-service name is required.",
      })
      return
    }

    setLoading(true)
    const supabase = createClient()

    try {
      if (editingSubService) {
        // Update existing sub-service
        const { error } = await supabase
          .from('sub_services')
          .update({
            name: subServiceForm.name,
            slug: subServiceForm.slug || subServiceForm.name.toLowerCase().replace(/\s+/g, '-'),
            description: subServiceForm.description || null,
          })
          .eq('id', editingSubService.id)

        if (error) throw error

        // Update local state
        setServices(services.map(s => 
          s.id === selectedServiceForSub
            ? {
                ...s,
                sub_services: s.sub_services?.map(ss =>
                  ss.id === editingSubService.id
                    ? {
                        ...ss,
                        name: subServiceForm.name,
                        slug: subServiceForm.slug || subServiceForm.name.toLowerCase().replace(/\s+/g, '-'),
                        description: subServiceForm.description || null,
                      }
                    : ss
                )
              }
            : s
        ))
      } else {
        // Create new sub-service
        const { data: newSubService, error } = await supabase
          .from('sub_services')
          .insert({
            service_id: selectedServiceForSub,
            name: subServiceForm.name,
            slug: subServiceForm.slug || subServiceForm.name.toLowerCase().replace(/\s+/g, '-'),
            description: subServiceForm.description || null,
            active: true,
          })
          .select()
          .single()

        if (error) throw error

        // Update local state
        setServices(services.map(s =>
          s.id === selectedServiceForSub
            ? {
                ...s,
                sub_services: [...(s.sub_services || []), newSubService]
              }
            : s
        ))
      }

      toast({
        title: "Success",
        description: editingSubService ? "Sub-service updated successfully." : "Sub-service created successfully.",
      })

      setIsSubServiceDialogOpen(false)
    } catch (error) {
      console.error('Save sub-service error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save sub-service.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Are you sure? This will also delete all sub-services and their data.")) return

    const supabase = createClient()
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId)

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete service.",
      })
      return
    }

    setServices(services.filter(s => s.id !== serviceId))
    toast({
      title: "Success",
      description: "Service deleted successfully.",
    })
  }

  const handleDeleteSubService = async (subServiceId: string, serviceId: string) => {
    if (!confirm("Are you sure? This will also delete all associated data.")) return

    const supabase = createClient()
    const { error } = await supabase
      .from('sub_services')
      .delete()
      .eq('id', subServiceId)

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete sub-service.",
      })
      return
    }

    setServices(services.map(s =>
      s.id === serviceId
        ? { ...s, sub_services: s.sub_services?.filter(ss => ss.id !== subServiceId) }
        : s
    ))
    toast({
      title: "Success",
      description: "Sub-service deleted successfully.",
    })
  }

  const handleInlineCommissionEdit = (id: string, type: 'service' | 'sub_service', currentValue: number) => {
    setEditingCommission({ id, type, value: currentValue.toString() })
  }

  const handleSaveInlineCommission = async () => {
    if (!editingCommission) return

    const value = parseFloat(editingCommission.value)
    if (isNaN(value) || value < 0 || value > 100) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Commission must be between 0 and 100.",
      })
      return
    }

    const supabase = createClient()

    try {
      // Check if commission exists
      const { data: existing } = await supabase
        .from('service_commissions')
        .select('id')
        .eq(editingCommission.type === 'service' ? 'service_id' : 'sub_service_id', editingCommission.id)
        .single()

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('service_commissions')
          .update({ percentage: value })
          .eq('id', existing.id)

        if (error) throw error
      } else {
        // Create new
        const { error } = await supabase
          .from('service_commissions')
          .insert({
            [editingCommission.type === 'service' ? 'service_id' : 'sub_service_id']: editingCommission.id,
            percentage: value,
          })

        if (error) throw error
      }

      // Update local state
      if (editingCommission.type === 'service') {
        setServices(services.map(s =>
          s.id === editingCommission.id
            ? {
                ...s,
                service_commissions: [{
                  id: existing?.id || '',
                  percentage: value,
                  created_at: new Date().toISOString(),
                }]
              }
            : s
        ))
      } else {
        setServices(services.map(s => ({
          ...s,
          sub_services: s.sub_services?.map(ss =>
            ss.id === editingCommission.id
              ? {
                  ...ss,
                  service_commissions: [{
                    id: existing?.id || '',
                    percentage: value,
                    created_at: new Date().toISOString(),
                  }]
                }
              : ss
          )
        })))
      }

      toast({
        title: "Success",
        description: "Commission updated successfully.",
      })

      setEditingCommission(null)
    } catch (error) {
      console.error('Save commission error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update commission.",
      })
    }
  }

  const getServiceCommission = (service: Service): number => {
    return service.service_commissions?.[0]?.percentage || 10
  }

  const getSubServiceCommission = (subService: SubService, service: Service): { value: number, inherited: boolean } => {
    if (subService.service_commissions && subService.service_commissions.length > 0) {
      return { value: subService.service_commissions[0].percentage, inherited: false }
    }
    return { value: getServiceCommission(service), inherited: true }
  }

  const toggleServiceActive = async (serviceId: string, currentActive: boolean) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('services')
      .update({ active: !currentActive })
      .eq('id', serviceId)

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update service status.",
      })
      return
    }

    setServices(services.map(s =>
      s.id === serviceId ? { ...s, active: !currentActive } : s
    ))

    toast({
      title: "Success",
      description: `Service ${!currentActive ? 'activated' : 'deactivated'}.`,
    })
  }

  const toggleSubServiceActive = async (subServiceId: string, serviceId: string, currentActive: boolean) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('sub_services')
      .update({ active: !currentActive })
      .eq('id', subServiceId)

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update sub-service status.",
      })
      return
    }

    setServices(services.map(s =>
      s.id === serviceId
        ? {
            ...s,
            sub_services: s.sub_services?.map(ss =>
              ss.id === subServiceId ? { ...ss, active: !currentActive } : ss
            )
          }
        : s
    ))

    toast({
      title: "Success",
      description: `Sub-service ${!currentActive ? 'activated' : 'deactivated'}.`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Services & Pricing</CardTitle>
            <CardDescription>
              Manage services, sub-services, commissions, and service areas
            </CardDescription>
          </div>
          <Button onClick={() => openServiceDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {services.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No services yet. Click "Add Service" to get started.
          </div>
        ) : (
          services.map((service) => (
            <Collapsible
              key={service.id}
              open={expandedServices.has(service.id)}
              onOpenChange={() => toggleServiceExpanded(service.id)}
            >
              <div className="border rounded-lg">
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-4 hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      {expandedServices.has(service.id) ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                      <div className="text-left">
                        <div className="font-semibold text-lg">{service.name}</div>
                        {service.description && (
                          <div className="text-sm text-muted-foreground">{service.description}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Default Commission: </span>
                        {editingCommission?.id === service.id && editingCommission.type === 'service' ? (
                          <div className="inline-flex items-center gap-1">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              value={editingCommission.value}
                              onChange={(e) => setEditingCommission({ ...editingCommission, value: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveInlineCommission()
                                if (e.key === 'Escape') setEditingCommission(null)
                              }}
                              className="w-20 h-7"
                              autoFocus
                            />
                            <span>%</span>
                            <Button size="sm" variant="ghost" onClick={handleSaveInlineCommission}>Save</Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingCommission(null)}>Cancel</Button>
                          </div>
                        ) : (
                          <span
                            className="font-semibold text-green-600 cursor-pointer hover:underline"
                            onClick={() => handleInlineCommissionEdit(service.id, 'service', getServiceCommission(service))}
                          >
                            {getServiceCommission(service)}%
                          </span>
                        )}
                      </div>
                      <Badge variant={service.active ? "default" : "secondary"}>
                        {service.active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Switch
                        checked={service.active}
                        onCheckedChange={() => toggleServiceActive(service.id, service.active)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openServiceDialog(service)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="border-t p-4 bg-muted/30">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">Sub-Services</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openSubServiceDialog(service.id)}
                      >
                        <Plus className="mr-2 h-3 w-3" />
                        Add Sub-Service
                      </Button>
                    </div>
                    {!service.sub_services || service.sub_services.length === 0 ? (
                      <div className="text-sm text-muted-foreground text-center py-4">
                        No sub-services yet. Click "Add Sub-Service" to create one.
                      </div>
                    ) : (
                      <div className="rounded-md border bg-background">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Commission</TableHead>
                              <TableHead>Areas</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {service.sub_services.map((subService) => {
                              const commission = getSubServiceCommission(subService, service)
                              return (
                                <TableRow key={subService.id}>
                                  <TableCell className="font-medium">{subService.name}</TableCell>
                                  <TableCell className="text-sm text-muted-foreground">
                                    {subService.description || '—'}
                                  </TableCell>
                                  <TableCell>
                                    {editingCommission?.id === subService.id && editingCommission.type === 'sub_service' ? (
                                      <div className="flex items-center gap-1">
                                        <Input
                                          type="number"
                                          min="0"
                                          max="100"
                                          step="0.1"
                                          value={editingCommission.value}
                                          onChange={(e) => setEditingCommission({ ...editingCommission, value: e.target.value })}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSaveInlineCommission()
                                            if (e.key === 'Escape') setEditingCommission(null)
                                          }}
                                          className="w-20 h-7"
                                          autoFocus
                                        />
                                        <span>%</span>
                                      </div>
                                    ) : (
                                      <div
                                        className="cursor-pointer hover:underline"
                                        onClick={() => handleInlineCommissionEdit(subService.id, 'sub_service', commission.value)}
                                      >
                                        <span className="font-semibold text-green-600">{commission.value}%</span>
                                        {commission.inherited && (
                                          <span className="text-xs text-muted-foreground ml-1">(inherited)</span>
                                        )}
                                      </div>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Button variant="outline" size="sm" disabled>
                                      <MapPin className="mr-1 h-3 w-3" />
                                      Manage
                                    </Button>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Badge variant={subService.active ? "default" : "secondary"}>
                                        {subService.active ? 'Active' : 'Inactive'}
                                      </Badge>
                                      <Switch
                                        checked={subService.active}
                                        onCheckedChange={() => toggleSubServiceActive(subService.id, service.id, subService.active)}
                                      />
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openSubServiceDialog(service.id, subService)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteSubService(subService.id, service.id)}
                                      >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))
        )}

        {/* Service Dialog */}
        <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingService ? 'Edit Service' : 'Add Service'}</DialogTitle>
              <DialogDescription>
                {editingService ? 'Update service details and default commission.' : 'Create a new service category with commission rate.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="service-name">Service Name</Label>
                <Input
                  id="service-name"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  placeholder="e.g., Roofing, Plumbing, HVAC"
                />
              </div>
              <div>
                <Label htmlFor="service-description">Description (Optional)</Label>
                <Textarea
                  id="service-description"
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  placeholder="Brief description of this service category"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="service-commission">Default Commission (%)</Label>
                <Input
                  id="service-commission"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={serviceForm.commission}
                  onChange={(e) => setServiceForm({ ...serviceForm, commission: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This will apply to all sub-services unless overridden
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsServiceDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveService} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingService ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Sub-Service Dialog */}
        <Dialog open={isSubServiceDialogOpen} onOpenChange={setIsSubServiceDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSubService ? 'Edit Sub-Service' : 'Add Sub-Service'}</DialogTitle>
              <DialogDescription>
                {editingSubService ? 'Update sub-service details.' : 'Create a new sub-service.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="sub-service-name">Sub-Service Name</Label>
                <Input
                  id="sub-service-name"
                  value={subServiceForm.name}
                  onChange={(e) => setSubServiceForm({ ...subServiceForm, name: e.target.value })}
                  placeholder="e.g., Roof Repair, Pipe Replacement"
                />
              </div>
              <div>
                <Label htmlFor="sub-service-slug">Slug (URL-friendly)</Label>
                <Input
                  id="sub-service-slug"
                  value={subServiceForm.slug}
                  onChange={(e) => setSubServiceForm({ ...subServiceForm, slug: e.target.value })}
                  placeholder="Auto-generated from name if left empty"
                />
              </div>
              <div>
                <Label htmlFor="sub-service-description">Description (Optional)</Label>
                <Textarea
                  id="sub-service-description"
                  value={subServiceForm.description}
                  onChange={(e) => setSubServiceForm({ ...subServiceForm, description: e.target.value })}
                  placeholder="Brief description of this specific service"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSubServiceDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSubService} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingSubService ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

