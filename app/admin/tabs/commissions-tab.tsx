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
import { Edit } from "lucide-react"

interface CommissionTier {
  id: string
  min_amount: number
  max_amount?: number
  percentage: number
  created_at: string
}

interface CommissionsTabProps {
  initialCommissions: CommissionTier[]
}

export default function CommissionsTab({ initialCommissions }: CommissionsTabProps) {
  const [commissions, setCommissions] = useState<CommissionTier[]>(initialCommissions)
  const [editingTier, setEditingTier] = useState<CommissionTier | null>(null)
  const [open, setOpen] = useState(false)
  const [percentage, setPercentage] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleEdit = (tier: CommissionTier) => {
    setEditingTier(tier)
    setPercentage(tier.percentage.toString())
    setOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingTier) return

    const newPercentage = parseFloat(percentage)
    if (isNaN(newPercentage) || newPercentage < 0 || newPercentage > 100) {
      toast({
        variant: "destructive",
        title: "Invalid Percentage",
        description: "Please enter a valid percentage between 0 and 100.",
      })
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('commission_tiers')
      .update({ percentage: newPercentage })
      .eq('id', editingTier.id)

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update commission tier.",
      })
      setLoading(false)
      return
    }

    setCommissions(commissions.map(tier =>
      tier.id === editingTier.id ? { ...tier, percentage: newPercentage } : tier
    ))

    setOpen(false)
    setLoading(false)
    setEditingTier(null)

    toast({
      title: "Success",
      description: "Commission tier updated successfully.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission Tiers</CardTitle>
        <CardDescription>
          View and manage commission percentage tiers based on project value
        </CardDescription>
      </CardHeader>
      <CardContent>
        {commissions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No commission tiers configured yet.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Min Amount</TableHead>
                  <TableHead>Max Amount</TableHead>
                  <TableHead>Commission %</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commissions.map((tier) => (
                  <TableRow key={tier.id}>
                    <TableCell className="font-medium">
                      ${tier.min_amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {tier.max_amount 
                        ? `$${tier.max_amount.toLocaleString()}`
                        : <span className="text-muted-foreground">No limit</span>
                      }
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">{tier.percentage}%</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(tier)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Commission Tier</DialogTitle>
              <DialogDescription>
                Update the commission percentage for this tier
              </DialogDescription>
            </DialogHeader>
            {editingTier && (
              <div className="space-y-4">
                <div>
                  <Label>Tier Range</Label>
                  <p className="text-sm text-muted-foreground">
                    ${editingTier.min_amount.toLocaleString()} 
                    {editingTier.max_amount && ` - $${editingTier.max_amount.toLocaleString()}`}
                    {!editingTier.max_amount && '+'}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="percentage">Commission Percentage</Label>
                  <Input
                    id="percentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={loading}>
                {loading ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

