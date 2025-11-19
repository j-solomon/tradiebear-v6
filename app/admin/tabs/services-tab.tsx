'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { Star, Save, AlertCircle } from 'lucide-react'
import { updateServiceFeatured, updateServiceDisplayOrder } from '../actions/update-service-featured'

interface Service {
  id: string
  name: string
  description: string | null
  featured?: boolean
  display_order?: number
}

interface ServicesTabProps {
  initialServices: Service[]
}

export default function ServicesTab({ initialServices }: ServicesTabProps) {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

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

  const featuredServices = services.filter(s => s.featured).sort((a, b) => 
    (a.display_order || 999) - (b.display_order || 999)
  )
  const unfeaturedServices = services.filter(s => !s.featured)

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

      <Card>
        <CardHeader>
          <CardTitle>How This Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Check a service to feature it on the homepage</p>
          <p>• Up to 12 services can be featured at once</p>
          <p>• Use the &quot;Order&quot; field to control the display sequence (1-12)</p>
          <p>• Services are displayed in a 4-column grid (3 rows of 4 services)</p>
          <p>• Changes are applied immediately to the live homepage</p>
        </CardContent>
      </Card>
    </div>
  )
}

