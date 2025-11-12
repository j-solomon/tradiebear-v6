"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

export interface LeadFilters {
  searchTerm: string
  stage: string
  serviceId: string
  referrerId: string
  dateRange: string
}

interface Service {
  id: string
  name: string
}

interface Referrer {
  id: string
  name: string
}

interface LeadSearchFiltersProps {
  services: Service[]
  referrers: Referrer[]
  onFiltersChange: (filters: LeadFilters) => void
}

const STAGE_OPTIONS = [
  { value: "all", label: "All Stages" },
  { value: "submitted", label: "Submitted" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "quoted", label: "Quoted" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
]

const DATE_RANGE_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "last30", label: "Last 30 Days" },
]

export default function LeadSearchFilters({ 
  services, 
  referrers, 
  onFiltersChange 
}: LeadSearchFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [stage, setStage] = useState("all")
  const [serviceId, setServiceId] = useState("all")
  const [referrerId, setReferrerId] = useState("all")
  const [dateRange, setDateRange] = useState("all")

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({
        searchTerm,
        stage,
        serviceId,
        referrerId,
        dateRange
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, stage, serviceId, referrerId, dateRange, onFiltersChange])

  const handleClearFilters = () => {
    setSearchTerm("")
    setStage("all")
    setServiceId("all")
    setReferrerId("all")
    setDateRange("all")
    onFiltersChange({
      searchTerm: "",
      stage: "all",
      serviceId: "all",
      referrerId: "all",
      dateRange: "all"
    })
  }

  const hasActiveFilters = searchTerm || stage !== "all" || serviceId !== "all" || referrerId !== "all" || dateRange !== "all"

  return (
    <div className="space-y-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, phone, notes, referrer, or service..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 items-center">
        <Select value={stage} onValueChange={setStage}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select stage" />
          </SelectTrigger>
          <SelectContent>
            {STAGE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={serviceId} onValueChange={setServiceId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={referrerId} onValueChange={setReferrerId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select referrer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Referrers</SelectItem>
            {referrers.map((referrer) => (
              <SelectItem key={referrer.id} value={referrer.id}>
                {referrer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            {DATE_RANGE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleClearFilters}
            className="ml-auto"
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  )
}

