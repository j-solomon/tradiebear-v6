"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LogOut } from "lucide-react"
import LeadsTab from "./tabs/leads-tab"
import ServicesTab from "./tabs/services-tab"
import AreasTab from "./tabs/areas-tab"
import CommissionsTab from "./tabs/commissions-tab"
import SupportTab from "./tabs/support-tab"

interface AdminDashboardProps {
  initialLeads: any[]
  initialServices: any[]
  initialAreas: any[]
  initialCommissions: any[]
  initialTickets: any[]
  userEmail: string
}

export default function AdminDashboard({
  initialLeads,
  initialServices,
  initialAreas,
  initialCommissions,
  initialTickets,
  userEmail,
}: AdminDashboardProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("leads")

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">TradieBear Admin</h1>
              <p className="text-sm text-muted-foreground">{userEmail}</p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-3xl grid-cols-5">
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="areas">Areas</TabsTrigger>
            <TabsTrigger value="commissions">Commissions</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="mt-6">
            <LeadsTab initialLeads={initialLeads} />
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            <ServicesTab initialServices={initialServices} />
          </TabsContent>

          <TabsContent value="areas" className="mt-6">
            <AreasTab initialAreas={initialAreas} />
          </TabsContent>

          <TabsContent value="commissions" className="mt-6">
            <CommissionsTab initialCommissions={initialCommissions} />
          </TabsContent>

          <TabsContent value="support" className="mt-6">
            <SupportTab initialTickets={initialTickets} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

