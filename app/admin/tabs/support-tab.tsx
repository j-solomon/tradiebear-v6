"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"

interface SupportTicket {
  id: string
  user_id: string
  subject: string
  message: string
  status: string
  created_at: string
}

interface SupportTabProps {
  initialTickets: SupportTicket[]
}

const STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
]

const STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-500",
  in_progress: "bg-yellow-500",
  resolved: "bg-green-500",
  closed: "bg-gray-500",
}

export default function SupportTab({ initialTickets }: SupportTabProps) {
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets)
  const { toast } = useToast()

  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('support_tickets')
      .update({ status: newStatus })
      .eq('id', ticketId)

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update ticket status.",
      })
      return
    }

    setTickets(tickets.map(ticket =>
      ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
    ))

    toast({
      title: "Success",
      description: "Ticket status updated.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Support Tickets</CardTitle>
        <CardDescription>
          View and manage support requests from partners
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tickets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No support tickets yet.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.subject}</TableCell>
                    <TableCell className="max-w-md truncate">{ticket.message}</TableCell>
                    <TableCell>
                      <Select
                        value={ticket.status}
                        onValueChange={(value) => updateTicketStatus(ticket.id, value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <Badge className={STATUS_COLORS[ticket.status] || "bg-gray-500"}>
                            {STATUS_OPTIONS.find(s => s.value === ticket.status)?.label || ticket.status}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
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

