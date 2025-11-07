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
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, ChevronDown, ChevronRight } from "lucide-react"

interface SubService {
  id: string
  service_id: string
  name: string
  slug: string
  description?: string
  active: boolean
  created_at: string
}

interface Service {
  id: string
  name: string
  description?: string
  active: boolean
  sort_order?: number
  created_at: string
  sub_services?: SubService[]
}

interface ServicesTabProps {
  initialServices: Service[]
}

export default function ServicesTab({ initialServices }: ServicesTabProps) {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set())
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [editingSubService, setEditingSubService] = useState<SubService | null>(null)
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false)
  const [isSubServiceDialogOpen, setIsSubServiceDialogOpen] = useState(false)
  const [selectedServiceForSub, setSelectedServiceForSub] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
  })

  const [subServiceForm, setSubServiceForm] = useState({
    name: "",
    slug: "",
    description: "",
  })

  // Fetch sub-services for a service
  const fetchSubServices = async (serviceId: string) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('sub_services')
      .select('*')
      .eq('service_id', serviceId)
      .order('name')

    if (!error && data) {
      setServices(services.map(s => 
        s.id === serviceId ? { ...s, sub_services: data } : s
      ))
    }
  }

  const toggleServiceExpanded = async (serviceId: string) => {
    const newExpanded = new Set(expandedServices)
    if (newExpanded.has(serviceId)) {
      newExpanded.delete(serviceId)
    } else {
      newExpanded.add(serviceId)
      // Fetch sub-services if not already loaded
      const service = services.find(s => s.id === serviceId)
      if (!service?.sub_services) {
        await fetchSubServices(serviceId)
      }
    }
    setExpandedServices(newExpanded)
  }

  const openServiceDialog = (service?: Service) => {
    if (service) {
      setEditingService(service)
      setServiceForm({
        name: service.name,
        description: service.description || "",
      })
    } else {
      setEditingService(null)
      setServiceForm({ name: "", description: "" })
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
      setSubServiceForm({ name: "", slug: "", description: "" })
    }
    setIsSubServiceDialogOpen(true)
  }

  const saveService = async () => {
    setLoading(true)
    const supabase = createClient()

    if (editingService) {
      // Update existing service
      const { error } = await supabase
        .from('services')
        .update({
          name: serviceForm.name,
          description: serviceForm.description || null,
        })
        .eq('id', editingService.id)

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update service.",
        })
        setLoading(false)
        return
      }

      setServices(services.map(s =>
        s.id === editingService.id
          ? { ...s, name: serviceForm.name, description: serviceForm.description }
          : s
      ))

      toast({
        title: "Success",
        description: "Service updated successfully.",
      })
    } else {
      // Create new service
      const { data, error } = await supabase
        .from('services')
        .insert({
          name: serviceForm.name,
          description: serviceForm.description || null,
          active: true,
        })
        .select()
        .single()

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create service.",
        })
        setLoading(false)
        return
      }

      setServices([...services, data])

      toast({
        title: "Success",
        description: "Service created successfully.",
      })
    }

    setLoading(false)
    setIsServiceDialogOpen(false)
    setServiceForm({ name: "", description: "" })
    setEditingService(null)
  }

  const saveSubService = async () => {
    if (!selectedServiceForSub) return

    setLoading(true)
    const supabase = createClient()

    if (editingSubService) {
      // Update existing sub-service
      const { error } = await supabase
        .from('sub_services')
        .update({
          name: subServiceForm.name,
          slug: subServiceForm.slug,
          description: subServiceForm.description || null,
        })
        .eq('id', editingSubService.id)

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update sub-service.",
        })
        setLoading(false)
        return
      }

      // Refresh sub-services
      await fetchSubServices(selectedServiceForSub)

      toast({
        title: "Success",
        description: "Sub-service updated successfully.",
      })
    } else {
      // Create new sub-service
      const { error } = await supabase
        .from('sub_services')
        .insert({
          service_id: selectedServiceForSub,
          name: subServiceForm.name,
          slug: subServiceForm.slug,
          description: subServiceForm.description || null,
          active: true,
        })

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create sub-service.",
        })
        setLoading(false)
        return
      }

      // Refresh sub-services
      await fetchSubServices(selectedServiceForSub)

      toast({
        title: "Success",
        description: "Sub-service created successfully.",
      })
    }

    setLoading(false)
    setIsSubServiceDialogOpen(false)
    setSubServiceForm({ name: "", slug: "", description: "" })
    setEditingSubService(null)
    setSelectedServiceForSub(null)
  }

  const deleteService = async (serviceId: string) => {
    if (!confirm("Are you sure? This will also delete all sub-services.")) return

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

  const deleteSubService = async (subServiceId: string, serviceId: string) => {
    if (!confirm("Are you sure you want to delete this sub-service?")) return

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

    // Refresh sub-services
    await fetchSubServices(serviceId)

    toast({
      title: "Success",
      description: "Sub-service deleted successfully.",
    })
  }

  const toggleServiceActive = async (serviceId: string, currentState: boolean) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('services')
      .update({ active: !currentState })
      .eq('id', serviceId)

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update service status.",
      })
      return
    }

    setServices(services.map(service =>
      service.id === serviceId ? { ...service, active: !currentState } : service
    ))

    toast({
      title: "Success",
      description: `Service ${!currentState ? 'activated' : 'deactivated'}.`,
    })
  }

  const toggleSubServiceActive = async (subServiceId: string, serviceId: string, currentState: boolean) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('sub_services')
      .update({ active: !currentState })
      .eq('id', subServiceId)

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update sub-service status.",
      })
      return
    }

    // Refresh sub-services
    await fetchSubServices(serviceId)

    toast({
      title: "Success",
      description: `Sub-service ${!currentState ? 'activated' : 'deactivated'}.`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Service Management</CardTitle>
            <CardDescription>
              Manage service categories and sub-services
            </CardDescription>
          </div>
          <Button onClick={() => openServiceDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Service Category
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No service categories yet.</p>
            <Button onClick={() => openServiceDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Service Category
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {services.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleServiceExpanded(service.id)}
                      >
                        {expandedServices.has(service.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                      <div>
                        <h3 className="font-semibold">{service.name}</h3>
                        {service.description && (
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={service.active ? "default" : "secondary"}>
                        {service.active ? "Active" : "Inactive"}
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
                        onClick={() => deleteService(service.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {expandedServices.has(service.id) && (
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Sub-Services</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openSubServiceDialog(service.id)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Sub-Service
                        </Button>
                      </div>
                      {service.sub_services && service.sub_services.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Slug</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {service.sub_services.map((subService) => (
                              <TableRow key={subService.id}>
                                <TableCell className="font-medium">{subService.name}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{subService.slug}</TableCell>
                                <TableCell className="text-sm">{subService.description || 'N/A'}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={subService.active ? "default" : "secondary"} className="text-xs">
                                      {subService.active ? "Active" : "Inactive"}
                                    </Badge>
                                    <Switch
                                      checked={subService.active}
                                      onCheckedChange={() => toggleSubServiceActive(subService.id, service.id, subService.active)}
                                    />
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-2">
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
                                      onClick={() => deleteSubService(subService.id, service.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No sub-services yet. Click &quot;Add Sub-Service&quot; to create one.
                        </p>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Service Dialog */}
        <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Edit Service Category" : "Add Service Category"}
              </DialogTitle>
              <DialogDescription>
                {editingService 
                  ? "Update the service category details"
                  : "Create a new service category that will contain sub-services"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="service-name">Category Name *</Label>
                <Input
                  id="service-name"
                  placeholder="e.g., Roofing, Foundation, Plumbing"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service-description">Description</Label>
                <Textarea
                  id="service-description"
                  placeholder="Brief description of this service category"
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  disabled={loading}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsServiceDialogOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={saveService} disabled={loading || !serviceForm.name}>
                {loading ? "Saving..." : editingService ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Sub-Service Dialog */}
        <Dialog open={isSubServiceDialogOpen} onOpenChange={setIsSubServiceDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSubService ? "Edit Sub-Service" : "Add Sub-Service"}
              </DialogTitle>
              <DialogDescription>
                {editingSubService 
                  ? "Update the sub-service details"
                  : "Add a specific service offering under this category"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sub-service-name">Sub-Service Name *</Label>
                <Input
                  id="sub-service-name"
                  placeholder="e.g., Roof Inspection, Foundation Repair"
                  value={subServiceForm.name}
                  onChange={(e) => setSubServiceForm({ ...subServiceForm, name: e.target.value })}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sub-service-slug">Slug *</Label>
                <Input
                  id="sub-service-slug"
                  placeholder="e.g., roof-inspection, foundation-repair"
                  value={subServiceForm.slug}
                  onChange={(e) => setSubServiceForm({ ...subServiceForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">URL-friendly identifier (lowercase, hyphens)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sub-service-description">Description</Label>
                <Textarea
                  id="sub-service-description"
                  placeholder="Brief description shown in the form dropdown"
                  value={subServiceForm.description}
                  onChange={(e) => setSubServiceForm({ ...subServiceForm, description: e.target.value })}
                  disabled={loading}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSubServiceDialogOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={saveSubService} disabled={loading || !subServiceForm.name || !subServiceForm.slug}>
                {loading ? "Saving..." : editingSubService ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
