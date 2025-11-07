"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"

interface Service {
  id: string
  name: string
  description?: string
  active: boolean
  created_at: string
}

interface ServicesTabProps {
  initialServices: Service[]
}

export default function ServicesTab({ initialServices }: ServicesTabProps) {
  const [services, setServices] = useState<Service[]>(initialServices)
  const { toast } = useToast()

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

  if (services.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Services</CardTitle>
          <CardDescription>
            No services have been added to the system yet.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Management</CardTitle>
        <CardDescription>
          Manage available services that can be requested through referral forms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell className="max-w-md">
                    {service.description || <span className="text-muted-foreground">No description</span>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={service.active ? "default" : "secondary"}>
                      {service.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(service.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm text-muted-foreground">
                        {service.active ? "Active" : "Inactive"}
                      </span>
                      <Switch
                        checked={service.active}
                        onCheckedChange={() => toggleServiceActive(service.id, service.active)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

