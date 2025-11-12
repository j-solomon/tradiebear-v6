"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import { Copy, LogOut, ExternalLink, TrendingUp, Users, Clock, CheckCircle } from "lucide-react"
import { Profile, ReferralLink } from "@/types/database"

interface PartnerDashboardProps {
  profile: Profile
  referralLink: ReferralLink | null
  initialLeads: any[]
}

export default function PartnerDashboard({ profile, referralLink, initialLeads }: PartnerDashboardProps) {
  const [leads] = useState(initialLeads)
  const [origin, setOrigin] = useState<string>('')
  const router = useRouter()
  const { toast } = useToast()

  // Set origin only on client-side to avoid "window is not defined" error
  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const copyReferralLink = () => {
    if (!referralLink || !origin) return
    
    const url = `${origin}/r/${referralLink.slug}`
    navigator.clipboard.writeText(url)
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard.",
    })
  }

  // Calculate stats
  const totalLeads = leads.length
  const pendingLeads = leads.filter(l => l.stage === 'submitted').length
  const completedLeads = leads.filter(l => l.stage === 'completed' || l.stage === 'paid').length
  const totalClicks = referralLink?.click_count || 0

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'submitted': return 'default'
      case 'est_scheduled': return 'secondary'
      case 'completed': return 'default'
      case 'paid': return 'default'
      default: return 'secondary'
    }
  }

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case 'submitted': return 'New'
      case 'est_scheduled': return 'Scheduled'
      case 'completed': return 'Completed'
      case 'paid': return 'Paid'
      default: return stage
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-start sm:items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold truncate">Partner Dashboard</h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                Welcome back, {profile.name}
              </p>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <ThemeToggle />
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                size="sm"
                className="h-9 sm:h-10"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Referral Link Card */}
        {referralLink ? (
          <Card>
            <CardHeader>
              <CardTitle>Your Referral Link</CardTitle>
              <CardDescription>
                Share this link to track leads and earn commissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {/* Link Display */}
                <div className="p-4 bg-muted rounded-lg">
                  <code className="block text-sm sm:text-base font-mono break-all">
                    {origin ? `${origin}/r/${referralLink.slug}` : 'Loading...'}
                  </code>
                </div>
                
                {/* Action Buttons - Stacked on mobile, horizontal on desktop */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                  <Button
                    onClick={copyReferralLink}
                    disabled={!origin}
                    className="w-full sm:flex-1 h-12 sm:h-10 text-base sm:text-sm font-semibold"
                  >
                    <Copy className="h-5 w-5 sm:h-4 sm:w-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => origin && window.open(`/r/${referralLink.slug}`, '_blank')}
                    disabled={!origin}
                    className="w-full sm:flex-1 h-12 sm:h-10 text-base sm:text-sm"
                  >
                    <ExternalLink className="h-5 w-5 sm:h-4 sm:w-4 mr-2" />
                    Open Link
                  </Button>
                </div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">How to use your link:</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Share it on your website, social media, business cards or directly with homeowners</li>
                  <li>When homeowners click and submit the form, they&apos;re automatically attributed to you</li>
                  <li>Track all your referrals and commissions right here in your dashboard</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                Your referral link is being generated. Please refresh in a moment.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClicks}</div>
              <p className="text-xs text-muted-foreground">
                Link visits
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLeads}</div>
              <p className="text-xs text-muted-foreground">
                From your referrals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingLeads}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting action
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedLeads}</div>
              <p className="text-xs text-muted-foreground">
                Jobs finished
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Leads</CardTitle>
            <CardDescription>
              All leads generated from your referral link
            </CardDescription>
          </CardHeader>
          <CardContent>
            {leads.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No leads yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start sharing your referral link to generate leads and earn commissions!
                </p>
                {referralLink && (
                  <Button onClick={copyReferralLink}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Your Link
                  </Button>
                )}
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{lead.homeowner_first} {lead.homeowner_last}</div>
                            <div className="text-sm text-muted-foreground">
                              {lead.homeowner_email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{lead.sub_service?.name || 'N/A'}</div>
                            {lead.sub_service?.service?.name && (
                              <div className="text-xs text-muted-foreground">{lead.sub_service.service.name}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{lead.address_street}</div>
                            <div className="text-muted-foreground">{lead.city}, {lead.state} {lead.zip}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStageColor(lead.stage)}>
                            {getStageLabel(lead.stage)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(lead.created_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

