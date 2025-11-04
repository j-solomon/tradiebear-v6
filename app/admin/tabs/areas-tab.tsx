"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Trash2 } from "lucide-react"

interface ServiceArea {
  id: string
  state?: string
  county?: string
  city?: string
  zip?: string
  created_at: string
}

interface AreasTabProps {
  initialAreas: ServiceArea[]
}

export default function AreasTab({ initialAreas }: AreasTabProps) {
  const [areas, setAreas] = useState<ServiceArea[]>(initialAreas)
  const [open, setOpen] = useState(false)
  const [newArea, setNewArea] = useState({
    state: "",
    county: "",
    city: "",
    zip: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleAddArea = async () => {
    if (!newArea.state && !newArea.zip) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide at least a state or ZIP code.",
      })
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { data, error } = await supabase
      .from('service_areas')
      .insert({
        state: newArea.state || null,
        county: newArea.county || null,
        city: newArea.city || null,
        zip: newArea.zip || null,
      })
      .select()
      .single()

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add service area.",
      })
      setLoading(false)
      return
    }

    setAreas([data, ...areas])
    setNewArea({ state: "", county: "", city: "", zip: "" })
    setOpen(false)
    setLoading(false)

    toast({
      title: "Success",
      description: "Service area added successfully.",
    })
  }

  const handleDeleteArea = async (areaId: string) => {
    const supabase = createClient()

    const { error } = await supabase
      .from('service_areas')
      .delete()
      .eq('id', areaId)

    if (error) {
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Service Areas</CardTitle>
            <CardDescription>
              Define geographic areas where services are available
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Area
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Service Area</DialogTitle>
                <DialogDescription>
                  Add a new geographic service area. Fill in as many fields as needed for specificity.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="CA"
                    maxLength={2}
                    value={newArea.state}
                    onChange={(e) => setNewArea({ ...newArea, state: e.target.value.toUpperCase() })}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="county">County</Label>
                  <Input
                    id="county"
                    placeholder="Los Angeles"
                    value={newArea.county}
                    onChange={(e) => setNewArea({ ...newArea, county: e.target.value })}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="San Francisco"
                    value={newArea.city}
                    onChange={(e) => setNewArea({ ...newArea, city: e.target.value })}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    placeholder="94102"
                    maxLength={5}
                    value={newArea.zip}
                    onChange={(e) => setNewArea({ ...newArea, zip: e.target.value })}
                    disabled={loading}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button onClick={handleAddArea} disabled={loading}>
                  {loading ? "Adding..." : "Add Area"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {areas.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No service areas defined yet. Add your first area above.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>State</TableHead>
                  <TableHead>County</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>ZIP</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {areas.map((area) => (
                  <TableRow key={area.id}>
                    <TableCell>{area.state || <span className="text-muted-foreground">—</span>}</TableCell>
                    <TableCell>{area.county || <span className="text-muted-foreground">—</span>}</TableCell>
                    <TableCell>{area.city || <span className="text-muted-foreground">—</span>}</TableCell>
                    <TableCell>{area.zip || <span className="text-muted-foreground">—</span>}</TableCell>
                    <TableCell>{new Date(area.created_at).toLocaleDateString()}</TableCell>
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
        )}
      </CardContent>
    </Card>
  )
}

