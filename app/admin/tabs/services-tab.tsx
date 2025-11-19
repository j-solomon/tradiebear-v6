'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { 
  Star, 
  AlertCircle, 
  Plus, 
  Edit2, 
  Trash2, 
  Power, 
  PowerOff,
  Save,
  X
} from 'lucide-react'
import { updateServiceFeatured, updateServiceDisplayOrder } from '../actions/update-service-featured'
import { createService, updateService, deleteService, toggleServiceActive } from '../actions/manage-services'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'

interface Service {
  id: string
  name: string
  description: string | null
  featured?: boolean
  display_order?: number
  active?: boolean
}

interface ServicesTabProps {
  initialServices: Service[]
}

type EditDialogMode = 'create' | 'edit' | null

export default function ServicesTab({ initialServices }: ServicesTabProps) {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  // Dialog states
  const [dialogMode, setDialogMode] = useState<EditDialogMode>(null)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [deleteConfirmService, setDeleteConfirmService] = useState<Service | null>(null)
  
  // Form states
  const [formName, setFormName] = useState('')
  const [formDescription, setFormDescription] = useState('')

  const featuredCount = services.filter(s => s.featured).length

  const handleFeaturedToggle = async (serviceId: string, currentFeatured: boolean) => {
    const service = services.find(s => s.id === serviceId)
    if (!service) return

    startTransition(async () => {
      const result = await updateServiceFeatured({
        serviceId,
        featured: !currentFeatured,
        displayOrder: service.display_order
      })

      if (result.success) {
        setServices(prev => 
          prev.map(s => 
            s.id === serviceId 
              ? { ...s, featured: !currentFeatured }
              : s
          )
        )
        toast({
          title: 'Success',
          description: `Service ${!currentFeatured ? 'added to' : 'removed from'} homepage`,
        })
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to update service',
          variant: 'destructive',
        })
      }
    })
  }

  const handleDisplayOrderChange = async (serviceId: string, newOrder: number) => {
    if (newOrder < 1 || newOrder > 12) {
      toast({
        title: 'Invalid Order',
        description: 'Display order must be between 1 and 12',
        variant: 'destructive',
      })
      return
    }

    startTransition(async () => {
      const result = await updateServiceDisplayOrder(serviceId, newOrder)

      if (result.success) {
        setServices(prev => 
          prev.map(s => 
            s.id === serviceId 
              ? { ...s, display_order: newOrder }
              : s
          ).sort((a, b) => (a.display_order || 999) - (b.display_order || 999))
        )
        toast({
          title: 'Success',
          description: 'Display order updated',
        })
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to update display order',
          variant: 'destructive',
        })
      }
    })
  }

  const handleOpenCreateDialog = () => {
    setFormName('')
    setFormDescription('')
    setEditingService(null)
    setDialogMode('create')
  }

  const handleOpenEditDialog = (service: Service) => {
    setFormName(service.name)
    setFormDescription(service.description || '')
    setEditingService(service)
    setDialogMode('edit')
  }

  const handleCloseDialog = () => {
    setDialogMode(null)
    setEditingService(null)
    setFormName('')
    setFormDescription('')
  }

  const handleSaveService = async () => {
    if (!formName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Service name is required',
        variant: 'destructive',
      })
      return
    }

    startTransition(async () => {
      let result

      if (dialogMode === 'create') {
        result = await createService({
          name: formName.trim(),
          description: formDescription.trim() || null,
          active: true,
          featured: false,
        })

        if (result.success && result.data) {
          setServices(prev => [...prev, result.data])
          toast({
            title: 'Success',
            description: 'Service created successfully',
          })
        }
      } else if (dialogMode === 'edit' && editingService) {
        result = await updateService(editingService.id, {
          name: formName.trim(),
          description: formDescription.trim() || null,
        })

        if (result.success) {
          setServices(prev =>
            prev.map(s =>
              s.id === editingService.id
                ? { ...s, name: formName.trim(), description: formDescription.trim() || null }
                : s
            )
          )
          toast({
            title: 'Success',
            description: 'Service updated successfully',
          })
        }
      }

      if (result && !result.success) {
        toast({
          title: 'Error',
          description: result.error || 'Failed to save service',
          variant: 'destructive',
        })
      } else {
        handleCloseDialog()
      }
    })
  }

  const handleDeleteService = async () => {
    if (!deleteConfirmService) return

    startTransition(async () => {
      const result = await deleteService(deleteConfirmService.id)

      if (result.success) {
        setServices(prev => prev.filter(s => s.id !== deleteConfirmService.id))
        toast({
          title: 'Success',
          description: 'Service deleted successfully',
        })
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete service',
          variant: 'destructive',
        })
      }

      setDeleteConfirmService(null)
    })
  }

  const handleToggleActive = async (service: Service) => {
    startTransition(async () => {
      const result = await toggleServiceActive(service.id, !service.active)

      if (result.success) {
        setServices(prev =>
          prev.map(s =>
            s.id === service.id ? { ...s, active: !service.active } : s
          )
        )
        toast({
          title: 'Success',
          description: `Service ${!service.active ? 'activated' : 'deactivated'}`,
        })
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to toggle service status',
          variant: 'destructive',
        })
      }
    })
  }

  const featuredServices = services.filter(s => s.featured).sort((a, b) => 
    (a.display_order || 999) - (b.display_order || 999)
  )
  const unfeaturedServices = services.filter(s => !s.featured)
  const activeServices = services.filter(s => s.active !== false)
  const inactiveServices = services.filter(s => s.active === false)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Homepage Featured Services</CardTitle>
              <CardDescription>
                Select up to 12 services to display on the homepage. Drag to reorder.
              </CardDescription>
            </div>
            <Badge variant={featuredCount === 12 ? 'default' : 'secondary'}>
              {featuredCount}/12 Featured
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {featuredCount === 12 && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-3 text-sm text-yellow-800 dark:text-yellow-200">
              <AlertCircle className="h-4 w-4" />
              <span>Maximum featured services reached. Uncheck a service to add another.</span>
            </div>
          )}

          {/* Featured Services */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">Featured on Homepage</h3>
            {featuredServices.length === 0 ? (
              <p className="text-sm text-muted-foreground">No services featured yet</p>
            ) : (
              <div className="space-y-2">
                {featuredServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center gap-4 rounded-lg border p-3 bg-green-50 dark:bg-green-900/10"
                  >
                    <Checkbox
                      checked={service.featured}
                      onCheckedChange={() => handleFeaturedToggle(service.id, service.featured || false)}
                      disabled={isPending}
                    />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    
                    <div className="flex-1">
                      <p className="font-medium">{service.name}</p>
                      {service.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {service.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Label htmlFor={`order-${service.id}`} className="text-sm whitespace-nowrap">
                        Order:
                      </Label>
                      <Input
                        id={`order-${service.id}`}
                        type="number"
                        min="1"
                        max="12"
                        value={service.display_order || ''}
                        onChange={(e) => {
                          const val = parseInt(e.target.value)
                          if (!isNaN(val)) {
                            handleDisplayOrderChange(service.id, val)
                          }
                        }}
                        className="w-16"
                        disabled={isPending}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="my-6 border-t" />

          {/* Unfeatured Services */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground">Available Services</h3>
            {unfeaturedServices.length === 0 ? (
              <p className="text-sm text-muted-foreground">All services are featured</p>
            ) : (
              <div className="space-y-2">
                {unfeaturedServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center gap-4 rounded-lg border p-3"
                  >
                    <Checkbox
                      checked={service.featured}
                      onCheckedChange={() => handleFeaturedToggle(service.id, service.featured || false)}
                      disabled={isPending || featuredCount >= 12}
                    />
                    <Star className="h-4 w-4 text-gray-300" />
                    
                    <div className="flex-1">
                      <p className="font-medium">{service.name}</p>
                      {service.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {service.description}
                        </p>
                      )}
                    </div>

                    {!service.featured && featuredCount >= 12 && (
                      <Badge variant="secondary" className="text-xs">
                        Max reached
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* All Services Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Services</CardTitle>
              <CardDescription>
                Manage all services - add, edit, or remove services
              </CardDescription>
            </div>
            <Button onClick={handleOpenCreateDialog} disabled={isPending}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Service
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Active Services */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground">
                Active Services ({activeServices.length})
              </h3>
              {activeServices.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active services</p>
              ) : (
                <div className="space-y-2">
                  {activeServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center gap-4 rounded-lg border p-4 bg-white"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">{service.name}</p>
                          {service.featured && (
                            <Badge variant="secondary" className="text-xs">
                              <Star className="h-3 w-3 mr-1 text-yellow-500 fill-yellow-500" />
                              Featured
                            </Badge>
                          )}
                        </div>
                        {service.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {service.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditDialog(service)}
                          disabled={isPending}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(service)}
                          disabled={isPending}
                          title="Deactivate service"
                        >
                          <PowerOff className="h-4 w-4 text-orange-500" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteConfirmService(service)}
                          disabled={isPending}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Inactive Services */}
            {inactiveServices.length > 0 && (
              <>
                <div className="border-t pt-4" />
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    Inactive Services ({inactiveServices.length})
                  </h3>
                  <div className="space-y-2">
                    {inactiveServices.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center gap-4 rounded-lg border p-4 bg-gray-50 opacity-60"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold">{service.name}</p>
                            <Badge variant="secondary" className="text-xs">
                              Inactive
                            </Badge>
                          </div>
                          {service.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {service.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEditDialog(service)}
                            disabled={isPending}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleActive(service)}
                            disabled={isPending}
                            title="Activate service"
                          >
                            <Power className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteConfirmService(service)}
                            disabled={isPending}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How This Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• <strong>Featured Services:</strong> Check a service to feature it on the homepage (max 12)</p>
          <p>• <strong>Display Order:</strong> Use the &quot;Order&quot; field to control the sequence (1-12)</p>
          <p>• <strong>Edit Services:</strong> Click the edit icon to modify service name or description</p>
          <p>• <strong>Deactivate:</strong> Click the power icon to hide a service without deleting it</p>
          <p>• <strong>Delete:</strong> Remove services permanently (only if no sub-services or leads)</p>
          <p>• <strong>Add New:</strong> Click &quot;Add New Service&quot; to create additional service categories</p>
        </CardContent>
      </Card>

      {/* Edit/Create Dialog */}
      <Dialog open={dialogMode !== null} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'Add New Service' : 'Edit Service'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'create' 
                ? 'Create a new service category for your referral platform'
                : 'Update the service name and description'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="service-name">Service Name *</Label>
              <Input
                id="service-name"
                placeholder="e.g., Roofing, Plumbing, etc."
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                disabled={isPending}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="service-description">Description</Label>
              <Textarea
                id="service-description"
                placeholder="Brief description of the service..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                disabled={isPending}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              disabled={isPending}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSaveService}
              disabled={isPending || !formName.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              {dialogMode === 'create' ? 'Create Service' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmService !== null} onOpenChange={(open) => !open && setDeleteConfirmService(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the service &quot;{deleteConfirmService?.name}&quot;.
              This action cannot be undone.
              {deleteConfirmService && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
                  <p className="font-semibold mb-1">⚠️ Important:</p>
                  <p>This service can only be deleted if it has no sub-services or associated leads. 
                  Consider deactivating instead if you want to keep historical data.</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteService}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Service
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

