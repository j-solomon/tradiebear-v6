"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, ChevronDown, ChevronRight, MapPin, Loader2, Search, X } from "lucide-react"

interface ServiceCommission {
  id: string
  percentage: number
  created_at: string
}

interface SubService {
  id: string
  service_id: string
  name: string
  slug: string
  description?: string
  active: boolean
  created_at: string
  service_commissions?: ServiceCommission[]
}

interface Service {
  id: string
  name: string
  description?: string
  active: boolean
  sort_order?: number
  created_at: string
  service_commissions?: ServiceCommission[]
  sub_services?: SubService[]
}

interface ServicesPricingTabProps {
  initialServices: Service[]
}

export default function ServicesPricingTab({ initialServices }: ServicesPricingTabProps) {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set())
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [editingSubService, setEditingSubService] = useState<SubService | null>(null)
  const [editingCommission, setEditingCommission] = useState<{id: string, type: 'service' | 'sub_service', value: string} | null>(null)
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false)
  const [isSubServiceDialogOpen, setIsSubServiceDialogOpen] = useState(false)
  const [selectedServiceForSub, setSelectedServiceForSub] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Area management state
  const [manageAreasDialogOpen, setManageAreasDialogOpen] = useState(false)
  const [selectedSubServiceForAreas, setSelectedSubServiceForAreas] = useState<{
    subServiceId: string
    subServiceName: string
    serviceId: string
    serviceName: string
  } | null>(null)
  const [availableStates, setAvailableStates] = useState<Array<{id: string, name: string, code: string}>>([])
  const [availableCities, setAvailableCities] = useState<Array<{id: string, name: string, state_id: string}>>([])
  const [serviceAreas, setServiceAreas] = useState<Array<{
    id: string
    area_type: 'service_default' | 'sub_service_inclusion' | 'sub_service_exclusion'
    area_level: 'city' | 'county' | 'state'
    state_code?: string
    city_id?: string
    city_name?: string
    county_id?: string
    county_name?: string
    area_source: 'inherited' | 'added' | 'excluded' | 'service'
  }>>([])
  const [loadingAreas, setLoadingAreas] = useState(false)
  const [zipSearch, setZipSearch] = useState('')
  
  // New state for floating action button + inline form
  const [showAddForm, setShowAddForm] = useState(false)
  const [areaFilter, setAreaFilter] = useState('')
  const [addFormSearch, setAddFormSearch] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])

  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    commission: "10",
  })

  const [subServiceForm, setSubServiceForm] = useState({
    name: "",
    slug: "",
    description: "",
  })

  // Load geographic data on mount
  useEffect(() => {
    const loadGeographicData = async () => {
      const supabase = createClient()
      const { data: states } = await supabase.from('states').select('id, name, code').order('name')
      const { data: cities } = await supabase.from('cities').select('id, name, state_id').order('name')
      
      if (states) setAvailableStates(states)
      if (cities) setAvailableCities(cities)
    }
    loadGeographicData()
  }, [])

  // Keyboard shortcuts for area management
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC to close form
      if (e.key === 'Escape' && showAddForm) {
        setShowAddForm(false)
        setAddFormSearch('')
        setSearchResults([])
      }
      
      // Cmd/Ctrl + K to open add form (only when dialog is open)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k' && manageAreasDialogOpen) {
        e.preventDefault()
        setShowAddForm(true)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showAddForm, manageAreasDialogOpen])

  const toggleServiceExpanded = (serviceId: string) => {
    const newExpanded = new Set(expandedServices)
    if (newExpanded.has(serviceId)) {
      newExpanded.delete(serviceId)
    } else {
      newExpanded.add(serviceId)
    }
    setExpandedServices(newExpanded)
  }

  const openServiceDialog = (service?: Service) => {
    if (service) {
      setEditingService(service)
      const commission = service.service_commissions?.[0]?.percentage || 10
      setServiceForm({
        name: service.name,
        description: service.description || "",
        commission: commission.toString(),
      })
    } else {
      setEditingService(null)
      setServiceForm({
        name: "",
        description: "",
        commission: "10",
      })
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
      setSubServiceForm({
        name: "",
        slug: "",
        description: "",
      })
    }
    setIsSubServiceDialogOpen(true)
  }

  const handleSaveService = async () => {
    if (!serviceForm.name.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Service name is required.",
      })
      return
    }

    const commission = parseFloat(serviceForm.commission)
    if (isNaN(commission) || commission < 0 || commission > 100) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Commission must be between 0 and 100.",
      })
      return
    }

    setLoading(true)
    const supabase = createClient()

    try {
      if (editingService) {
        // Update existing service
        const { error: serviceError } = await supabase
          .from('services')
          .update({
            name: serviceForm.name,
            description: serviceForm.description || null,
          })
          .eq('id', editingService.id)

        if (serviceError) throw serviceError

        // Update commission
        if (editingService.service_commissions?.[0]) {
          const { error: commError } = await supabase
            .from('service_commissions')
            .update({ percentage: commission })
            .eq('id', editingService.service_commissions[0].id)

          if (commError) throw commError
        } else {
          const { error: commError } = await supabase
            .from('service_commissions')
            .insert({
              service_id: editingService.id,
              percentage: commission,
            })

          if (commError) throw commError
        }

        // Update local state
        setServices(services.map(s => 
          s.id === editingService.id 
            ? {
                ...s,
                name: serviceForm.name,
                description: serviceForm.description || undefined,
                service_commissions: [{
                  ...s.service_commissions?.[0],
                  id: s.service_commissions?.[0]?.id || '',
                  percentage: commission,
                  created_at: s.service_commissions?.[0]?.created_at || new Date().toISOString(),
                }]
              }
            : s
        ))
      } else {
        // Create new service
        const { data: newService, error: serviceError } = await supabase
          .from('services')
          .insert({
            name: serviceForm.name,
            description: serviceForm.description || null,
            active: true,
          })
          .select()
          .single()

        if (serviceError) throw serviceError

        // Create commission for new service
        const { data: newCommission, error: commError } = await supabase
          .from('service_commissions')
          .insert({
            service_id: newService.id,
            percentage: commission,
          })
          .select()
          .single()

        if (commError) throw commError

        setServices([...services, {
          ...newService,
          service_commissions: [newCommission],
          sub_services: []
        }])
      }

      toast({
        title: "Success",
        description: editingService ? "Service updated successfully." : "Service created successfully.",
      })

      setIsServiceDialogOpen(false)
    } catch (error) {
      console.error('Save service error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save service.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSubService = async () => {
    if (!subServiceForm.name.trim() || !selectedServiceForSub) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Sub-service name is required.",
      })
      return
    }

    setLoading(true)
    const supabase = createClient()

    try {
      if (editingSubService) {
        // Update existing sub-service
        const { error } = await supabase
          .from('sub_services')
          .update({
            name: subServiceForm.name,
            slug: subServiceForm.slug || subServiceForm.name.toLowerCase().replace(/\s+/g, '-'),
            description: subServiceForm.description || null,
          })
          .eq('id', editingSubService.id)

        if (error) throw error

        // Update local state
        setServices(services.map(s => 
          s.id === selectedServiceForSub
            ? {
                ...s,
                sub_services: s.sub_services?.map(ss =>
                  ss.id === editingSubService.id
                    ? {
                        ...ss,
                        name: subServiceForm.name,
                        slug: subServiceForm.slug || subServiceForm.name.toLowerCase().replace(/\s+/g, '-'),
                        description: subServiceForm.description || undefined,
                      }
                    : ss
                )
              }
            : s
        ))
      } else {
        // Create new sub-service
        const { data: newSubService, error } = await supabase
          .from('sub_services')
          .insert({
            service_id: selectedServiceForSub,
            name: subServiceForm.name,
            slug: subServiceForm.slug || subServiceForm.name.toLowerCase().replace(/\s+/g, '-'),
            description: subServiceForm.description || null,
            active: true,
          })
          .select()
          .single()

        if (error) throw error

        // Update local state
        setServices(services.map(s =>
          s.id === selectedServiceForSub
            ? {
                ...s,
                sub_services: [...(s.sub_services || []), newSubService]
              }
            : s
        ))
      }

      toast({
        title: "Success",
        description: editingSubService ? "Sub-service updated successfully." : "Sub-service created successfully.",
      })

      setIsSubServiceDialogOpen(false)
    } catch (error) {
      console.error('Save sub-service error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save sub-service.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Are you sure? This will also delete all sub-services and their data.")) return

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

  const handleDeleteSubService = async (subServiceId: string, serviceId: string) => {
    if (!confirm("Are you sure? This will also delete all associated data.")) return

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

    setServices(services.map(s =>
      s.id === serviceId
        ? { ...s, sub_services: s.sub_services?.filter(ss => ss.id !== subServiceId) }
        : s
    ))
    toast({
      title: "Success",
      description: "Sub-service deleted successfully.",
    })
  }

  const handleInlineCommissionEdit = (id: string, type: 'service' | 'sub_service', currentValue: number) => {
    setEditingCommission({ id, type, value: currentValue.toString() })
  }

  const handleSaveInlineCommission = async () => {
    if (!editingCommission) return

    const value = parseFloat(editingCommission.value)
    if (isNaN(value) || value < 0 || value > 100) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Commission must be between 0 and 100.",
      })
      return
    }

    const supabase = createClient()

    try {
      // Check if commission exists
      const { data: existing } = await supabase
        .from('service_commissions')
        .select('id')
        .eq(editingCommission.type === 'service' ? 'service_id' : 'sub_service_id', editingCommission.id)
        .single()

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('service_commissions')
          .update({ percentage: value })
          .eq('id', existing.id)

        if (error) throw error
      } else {
        // Create new
        const { error } = await supabase
          .from('service_commissions')
          .insert({
            [editingCommission.type === 'service' ? 'service_id' : 'sub_service_id']: editingCommission.id,
            percentage: value,
          })

        if (error) throw error
      }

      // Update local state
      if (editingCommission.type === 'service') {
        setServices(services.map(s =>
          s.id === editingCommission.id
            ? {
                ...s,
                service_commissions: [{
                  id: existing?.id || '',
                  percentage: value,
                  created_at: new Date().toISOString(),
                }]
              }
            : s
        ))
      } else {
        setServices(services.map(s => ({
          ...s,
          sub_services: s.sub_services?.map(ss =>
            ss.id === editingCommission.id
              ? {
                  ...ss,
                  service_commissions: [{
                    id: existing?.id || '',
                    percentage: value,
                    created_at: new Date().toISOString(),
                  }]
                }
              : ss
          )
        })))
      }

      toast({
        title: "Success",
        description: "Commission updated successfully.",
      })

      setEditingCommission(null)
    } catch (error) {
      console.error('Save commission error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update commission.",
      })
    }
  }

  const getServiceCommission = (service: Service): number => {
    return service.service_commissions?.[0]?.percentage || 10
  }

  const getSubServiceCommission = (subService: SubService, service: Service): { value: number, inherited: boolean } => {
    if (subService.service_commissions && subService.service_commissions.length > 0) {
      return { value: subService.service_commissions[0].percentage, inherited: false }
    }
    return { value: getServiceCommission(service), inherited: true }
  }

  const toggleServiceActive = async (serviceId: string, currentActive: boolean) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('services')
      .update({ active: !currentActive })
      .eq('id', serviceId)

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update service status.",
      })
      return
    }

    setServices(services.map(s =>
      s.id === serviceId ? { ...s, active: !currentActive } : s
    ))

    toast({
      title: "Success",
      description: `Service ${!currentActive ? 'activated' : 'deactivated'}.`,
    })
  }

  const toggleSubServiceActive = async (subServiceId: string, serviceId: string, currentActive: boolean) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('sub_services')
      .update({ active: !currentActive })
      .eq('id', subServiceId)

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update sub-service status.",
      })
      return
    }

    setServices(services.map(s =>
      s.id === serviceId
        ? {
            ...s,
            sub_services: s.sub_services?.map(ss =>
              ss.id === subServiceId ? { ...ss, active: !currentActive } : ss
            )
          }
        : s
    ))

    toast({
      title: "Success",
      description: `Sub-service ${!currentActive ? 'activated' : 'deactivated'}.`,
    })
  }

  const openManageAreasDialog = async (subServiceId: string, subServiceName: string, serviceId: string, serviceName: string) => {
    setSelectedSubServiceForAreas({ subServiceId, subServiceName, serviceId, serviceName })
    setLoadingAreas(true)
    setManageAreasDialogOpen(true)
    
    const supabase = createClient()
    
    try {
      let directAreas: any[] = []
      let serviceDefaultAreas: any[] = []
      
      if (subServiceId) {
        // Fetching for a sub-service - get direct and inherited areas
        const { data, error: directError } = await supabase
          .from('service_area_map')
          .select('id, area_type, area_level, state_code, city_id, county_id')
          .eq('sub_service_id', subServiceId)
        
        if (directError) {
          console.error('Error fetching direct areas:', directError)
        } else {
          directAreas = data || []
        }
        
        // Fetch service-level default areas (inherited)
        const { data: serviceData, error: serviceError } = await supabase
          .from('service_area_map')
          .select('id, area_type, area_level, state_code, city_id, county_id')
          .eq('service_id', serviceId)
          .eq('area_type', 'service_default')
          .is('sub_service_id', null)
        
        if (serviceError) {
          console.error('Error fetching service areas:', serviceError)
        } else {
          serviceDefaultAreas = serviceData || []
        }
      } else {
        // Fetching for a service - only get service-level areas
        const { data, error: serviceError } = await supabase
          .from('service_area_map')
          .select('id, area_type, area_level, state_code, city_id, county_id')
          .eq('service_id', serviceId)
          .eq('area_type', 'service_default')
          .is('sub_service_id', null)
        
        if (serviceError) {
          console.error('Error fetching service areas:', serviceError)
        } else {
          serviceDefaultAreas = data || []
        }
      }
      
      console.log('Service-level areas found:', serviceDefaultAreas.length)
      console.log('Direct sub-service areas found:', directAreas.length)
      
      // Combine all area mappings
      const allAreas = [
        ...serviceDefaultAreas,
        ...directAreas
      ]
      
      // Fetch city names for all city IDs
      const cityIds = allAreas.map(a => a.city_id).filter(Boolean)
      const { data: cities } = await supabase
        .from('cities')
        .select('id, name, county_id')
        .in('id', cityIds)
      
      const cityMap = new Map(cities?.map(c => [c.id, c.name]) || [])
      
      // Fetch county names for all county IDs (both from areas and from cities)
      const countyIdsFromAreas = allAreas.map(a => a.county_id).filter(Boolean)
      const countyIdsFromCities = cities?.map(c => c.county_id).filter(Boolean) || []
      const allCountyIds = Array.from(new Set([...countyIdsFromAreas, ...countyIdsFromCities]))
      
      const { data: counties } = await supabase
        .from('counties')
        .select('id, name')
        .in('id', allCountyIds)
      
      const countyMap = new Map(counties?.map(c => [c.id, c.name]) || [])
      
      // Format areas with full location details
      const formattedAreas = [
        ...serviceDefaultAreas.map(area => {
          const city = cities?.find(c => c.id === area.city_id)
          const countyId = area.county_id || city?.county_id
          return {
            id: area.id,
            area_type: 'service_default' as const,
            area_level: area.area_level || 'city' as 'city' | 'county' | 'state',
            state_code: area.state_code,
            city_id: area.city_id,
            city_name: cityMap.get(area.city_id),
            county_id: countyId,
            county_name: countyMap.get(countyId),
            area_source: subServiceId ? ('inherited' as const) : ('service' as const),
          }
        }),
        ...directAreas.map(area => {
          const city = cities?.find(c => c.id === area.city_id)
          const countyId = area.county_id || city?.county_id
          return {
            id: area.id,
            area_type: area.area_type as 'sub_service_inclusion' | 'sub_service_exclusion',
            area_level: area.area_level || 'city' as 'city' | 'county' | 'state',
            state_code: area.state_code,
            city_id: area.city_id,
            city_name: cityMap.get(area.city_id),
            county_id: countyId,
            county_name: countyMap.get(countyId),
            area_source: area.area_type === 'sub_service_inclusion' ? 'added' as const : 'excluded' as const,
          }
        }),
      ]
      
      console.log('Total formatted areas:', formattedAreas.length)
      
      setServiceAreas(formattedAreas)
    } catch (error) {
      console.error('Error in openManageAreasDialog:', error)
      setServiceAreas([])
    } finally {
      setLoadingAreas(false)
    }
  }

  // Client-side filtering for service areas
  const filteredAreas = serviceAreas.filter((area) => {
    if (!areaFilter) return true
    const searchTerm = areaFilter.toLowerCase()
    const matches = area.state_code?.toLowerCase().includes(searchTerm) ||
      area.county_name?.toLowerCase().includes(searchTerm) ||
      area.city_name?.toLowerCase().includes(searchTerm)
    return matches
  })

  const handleZipSearch = async (zip: string) => {
    if (!zip || zip.length < 5) return
    
    const supabase = createClient()
    const { data, error } = await supabase
      .from('geo_zips')
      .select('code, city_id')
      .eq('code', zip)
      .single()
    
    if (data && data.city_id) {
      // Get the city name for the success message
      const cityName = availableCities.find(c => c.id === data.city_id)?.name || 'City'
      
      // Auto-select the city and add it
      await handleAddArea(data.city_id)
      setZipSearch('')
      toast({
        title: "Success",
        description: `Added ${cityName} (ZIP ${zip}) to service area.`
      })
    } else {
      toast({
        variant: "destructive",
        title: "ZIP not found",
        description: `No city found for ZIP code ${zip}`
      })
    }
  }

  const handleUnifiedSearch = async (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 3) return
    
    const supabase = createClient()
    
    // Check if it's a ZIP code (5 digits)
    const isZip = /^\d{5}$/.test(searchTerm.trim())
    
    if (isZip) {
      // Search via geo_zips table
      const { data: zipData } = await supabase
        .from('geo_zips')
        .select('city_id')
        .eq('code', searchTerm.trim())
        .single()
      
      if (zipData?.city_id) {
        // Get full city details
        const { data: cityData } = await supabase
          .from('cities')
          .select(`
            id,
            name,
            state_id,
            county_id,
            states(code),
            counties(name)
          `)
          .eq('id', zipData.city_id)
          .single()
        
        if (cityData) {
          setSearchResults([{
            id: cityData.id,
            name: cityData.name,
            state_code: (cityData.states as any)?.code,
            county_name: (cityData.counties as any)?.name
          }])
        }
      } else {
        setSearchResults([])
        toast({
          variant: "destructive",
          title: "ZIP not found",
          description: `No city found for ZIP code ${searchTerm}`
        })
      }
    } else {
      // Search cities by name
      const { data } = await supabase
        .from('cities')
        .select(`
          id,
          name,
          state_id,
          county_id,
          states(code),
          counties(name)
        `)
        .ilike('name', `%${searchTerm}%`)
        .limit(10)
      
      if (data) {
        setSearchResults(data.map((city: any) => ({
          id: city.id,
          name: city.name,
          state_code: city.states?.code,
          county_name: city.counties?.name
        })))
      }
    }
  }

  const handleAddArea = async (cityId: string, areaType?: 'sub_service_inclusion' | 'sub_service_exclusion') => {
    if (!selectedSubServiceForAreas) return
    
    const supabase = createClient()
    const city = availableCities.find(c => c.id === cityId)
    const state = availableStates.find(s => s.id === city?.state_id)
    
    // Determine if we're adding to service or sub-service
    const isServiceLevel = !selectedSubServiceForAreas.subServiceId
    
    // Check if this area already exists
    let existingCheck = supabase
      .from('service_area_map')
      .select('id')
      .eq('city_id', cityId)
    
    if (isServiceLevel) {
      existingCheck = existingCheck
        .eq('service_id', selectedSubServiceForAreas.serviceId)
        .eq('area_type', 'service_default')
        .is('sub_service_id', null)
    } else {
      existingCheck = existingCheck
        .eq('sub_service_id', selectedSubServiceForAreas.subServiceId)
        .eq('area_type', areaType || 'sub_service_inclusion')
    }
    
    const { data: existing } = await existingCheck.single()
    
    if (existing) {
      const cityName = city?.name || 'This location'
      toast({
        variant: "destructive",
        title: "Already exists",
        description: `${cityName} is already in the service area.`,
      })
      return
    }
    
    // Fetch county_id from the city
    const { data: cityData } = await supabase
      .from('cities')
      .select('county_id')
      .eq('id', cityId)
      .single()
    
    const insertData: any = {
      city_id: cityId,
      state_code: state?.code,
      county_id: cityData?.county_id,
      area_level: 'city',
    }
    
    if (isServiceLevel) {
      // Adding to service level
      insertData.service_id = selectedSubServiceForAreas.serviceId
      insertData.area_type = 'service_default'
      insertData.sub_service_id = null
    } else {
      // Adding to sub-service level
      insertData.sub_service_id = selectedSubServiceForAreas.subServiceId
      insertData.area_type = areaType || 'sub_service_inclusion'
    }
    
    const { data, error } = await supabase
      .from('service_area_map')
      .insert(insertData)
      .select()
      .single()
    
    if (error) {
      console.error('Add area error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add area.",
      })
      return
    }
    
    // Reload areas
    await openManageAreasDialog(
      selectedSubServiceForAreas.subServiceId,
      selectedSubServiceForAreas.subServiceName,
      selectedSubServiceForAreas.serviceId,
      selectedSubServiceForAreas.serviceName
    )
    
    toast({
      title: "Success",
      description: isServiceLevel ? "Service area added." : `Area ${areaType === 'sub_service_inclusion' ? 'added' : 'excluded'}.`,
    })
  }

  const handleRemoveArea = async (areaId: string) => {
    if (!selectedSubServiceForAreas) return
    
    // Find the area to determine if it's an exclusion or actual removal
    const area = serviceAreas.find(a => a.id === areaId)
    const isExclusion = area?.area_source === 'excluded'
    
    const supabase = createClient()
    const { error } = await supabase
      .from('service_area_map')
      .delete()
      .eq('id', areaId)
    
    if (error) {
      console.error('Remove area error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: isExclusion ? "Failed to add back area." : "Failed to remove area.",
      })
      return
    }
    
    // Reload areas
    await openManageAreasDialog(
      selectedSubServiceForAreas.subServiceId,
      selectedSubServiceForAreas.subServiceName,
      selectedSubServiceForAreas.serviceId,
      selectedSubServiceForAreas.serviceName
    )
    
    toast({
      title: "Success",
      description: isExclusion ? "Area added back successfully." : "Area removed successfully.",
    })
  }

  // Component render
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Services & Pricing</CardTitle>
            <CardDescription>
              Manage services, sub-services, commissions, and service areas
            </CardDescription>
          </div>
          <Button onClick={() => openServiceDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {services.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No services yet. Click &quot;Add Service&quot; to get started.
          </div>
        ) : (
          services.map((service) => (
            <Collapsible
              key={service.id}
              open={expandedServices.has(service.id)}
              onOpenChange={() => toggleServiceExpanded(service.id)}
            >
              <div className="border rounded-lg">
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-4 hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      {expandedServices.has(service.id) ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                      <div className="text-left">
                        <div className="font-semibold text-lg">{service.name}</div>
                        {service.description && (
                          <div className="text-sm text-muted-foreground">{service.description}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Default Commission: </span>
                        {editingCommission?.id === service.id && editingCommission.type === 'service' ? (
                          <div className="inline-flex items-center gap-1">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              value={editingCommission.value}
                              onChange={(e) => setEditingCommission({ ...editingCommission, value: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveInlineCommission()
                                if (e.key === 'Escape') setEditingCommission(null)
                              }}
                              className="w-20 h-7"
                              autoFocus
                            />
                            <span>%</span>
                            <Button size="sm" variant="ghost" onClick={handleSaveInlineCommission}>Save</Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingCommission(null)}>Cancel</Button>
                          </div>
                        ) : (
                          <span
                            className="font-semibold text-green-600 cursor-pointer hover:underline"
                            onClick={() => handleInlineCommissionEdit(service.id, 'service', getServiceCommission(service))}
                          >
                            {getServiceCommission(service)}%
                          </span>
                        )}
                      </div>
                      <Badge variant={service.active ? "default" : "secondary"}>
                        {service.active ? 'Active' : 'Inactive'}
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
                        variant="outline"
                        size="sm"
                        onClick={() => openManageAreasDialog('', '', service.id, service.name)}
                      >
                        <MapPin className="mr-1 h-3 w-3" />
                        Service Areas
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="border-t p-4 bg-muted/30">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">Sub-Services</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openSubServiceDialog(service.id)}
                      >
                        <Plus className="mr-2 h-3 w-3" />
                        Add Sub-Service
                      </Button>
                    </div>
                    {!service.sub_services || service.sub_services.length === 0 ? (
                      <div className="text-sm text-muted-foreground text-center py-4">
                        No sub-services yet. Click &quot;Add Sub-Service&quot; to create one.
                      </div>
                    ) : (
                      <div className="rounded-md border bg-background">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Commission</TableHead>
                              <TableHead>Areas</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {service.sub_services.map((subService) => {
                              const commission = getSubServiceCommission(subService, service)
                              return (
                                <TableRow key={subService.id}>
                                  <TableCell className="font-medium">{subService.name}</TableCell>
                                  <TableCell className="text-sm text-muted-foreground">
                                    {subService.description || '—'}
                                  </TableCell>
                                  <TableCell>
                                    {editingCommission?.id === subService.id && editingCommission.type === 'sub_service' ? (
                                      <div className="flex items-center gap-1">
                                        <Input
                                          type="number"
                                          min="0"
                                          max="100"
                                          step="0.1"
                                          value={editingCommission.value}
                                          onChange={(e) => setEditingCommission({ ...editingCommission, value: e.target.value })}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSaveInlineCommission()
                                            if (e.key === 'Escape') setEditingCommission(null)
                                          }}
                                          className="w-20 h-7"
                                          autoFocus
                                        />
                                        <span>%</span>
                                      </div>
                                    ) : (
                                      <div
                                        className="cursor-pointer hover:underline"
                                        onClick={() => handleInlineCommissionEdit(subService.id, 'sub_service', commission.value)}
                                      >
                                        <span className="font-semibold text-green-600">{commission.value}%</span>
                                        {commission.inherited && (
                                          <span className="text-xs text-muted-foreground ml-1">(inherited)</span>
                                        )}
                                      </div>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => openManageAreasDialog(
                                        subService.id,
                                        subService.name,
                                        service.id,
                                        service.name
                                      )}
                                    >
                                      <MapPin className="mr-1 h-3 w-3" />
                                      Manage
                                    </Button>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Badge variant={subService.active ? "default" : "secondary"}>
                                        {subService.active ? 'Active' : 'Inactive'}
                                      </Badge>
                                      <Switch
                                        checked={subService.active}
                                        onCheckedChange={() => toggleSubServiceActive(subService.id, service.id, subService.active)}
                                      />
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
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
                                        onClick={() => handleDeleteSubService(subService.id, service.id)}
                                      >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))
        )}

        {/* Service Dialog */}
        <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingService ? 'Edit Service' : 'Add Service'}</DialogTitle>
              <DialogDescription>
                {editingService ? 'Update service details and default commission.' : 'Create a new service category with commission rate.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="service-name">Service Name</Label>
                <Input
                  id="service-name"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  placeholder="e.g., Roofing, Plumbing, HVAC"
                />
              </div>
              <div>
                <Label htmlFor="service-description">Description (Optional)</Label>
                <Textarea
                  id="service-description"
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  placeholder="Brief description of this service category"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="service-commission">Default Commission (%)</Label>
                <Input
                  id="service-commission"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={serviceForm.commission}
                  onChange={(e) => setServiceForm({ ...serviceForm, commission: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This will apply to all sub-services unless overridden
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsServiceDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveService} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingService ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Sub-Service Dialog */}
        <Dialog open={isSubServiceDialogOpen} onOpenChange={setIsSubServiceDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSubService ? 'Edit Sub-Service' : 'Add Sub-Service'}</DialogTitle>
              <DialogDescription>
                {editingSubService ? 'Update sub-service details.' : 'Create a new sub-service.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="sub-service-name">Sub-Service Name</Label>
                <Input
                  id="sub-service-name"
                  value={subServiceForm.name}
                  onChange={(e) => setSubServiceForm({ ...subServiceForm, name: e.target.value })}
                  placeholder="e.g., Roof Repair, Pipe Replacement"
                />
              </div>
              <div>
                <Label htmlFor="sub-service-slug">Slug (URL-friendly)</Label>
                <Input
                  id="sub-service-slug"
                  value={subServiceForm.slug}
                  onChange={(e) => setSubServiceForm({ ...subServiceForm, slug: e.target.value })}
                  placeholder="Auto-generated from name if left empty"
                />
              </div>
              <div>
                <Label htmlFor="sub-service-description">Description (Optional)</Label>
                <Textarea
                  id="sub-service-description"
                  value={subServiceForm.description}
                  onChange={(e) => setSubServiceForm({ ...subServiceForm, description: e.target.value })}
                  placeholder="Brief description of this specific service"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSubServiceDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSubService} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingSubService ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Area Management Dialog */}
        <Dialog open={manageAreasDialogOpen} onOpenChange={setManageAreasDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedSubServiceForAreas?.subServiceId 
                  ? `Manage Service Areas: ${selectedSubServiceForAreas.subServiceName}`
                  : `Manage Service Areas: ${selectedSubServiceForAreas?.serviceName}`
                }
              </DialogTitle>
              <DialogDescription>
                {selectedSubServiceForAreas?.subServiceId 
                  ? `Service areas are inherited from "${selectedSubServiceForAreas.serviceName}". You can add additional areas or exclude inherited ones.`
                  : 'Manage service-level areas that will be inherited by all sub-services.'
                }
              </DialogDescription>
            </DialogHeader>
            
            {loadingAreas ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="space-y-6 py-4">
                {/* Current Areas */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>
                      Current Service Areas
                      <span className="ml-2 text-muted-foreground text-sm">
                        ({filteredAreas.length})
                      </span>
                    </Label>
                    <Button 
                      size="sm" 
                      onClick={() => setShowAddForm(!showAddForm)}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Area
                    </Button>
                  </div>
                  
                  <Input
                    placeholder="🔍 Filter by state, county, or city..."
                    value={areaFilter}
                    onChange={(e) => setAreaFilter(e.target.value)}
                    className="max-w-sm"
                  />
                  
                  {/* Inline Add Form */}
                  {showAddForm && (
                    <Card className="mb-4 border-2 border-primary animate-in slide-in-from-top">
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">Add New Service Area</h4>
                            <p className="text-sm text-muted-foreground">
                              Search by ZIP code or city name
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setShowAddForm(false)
                              setAddFormSearch('')
                              setSearchResults([])
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* Unified Search Input */}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Search ZIP or City (e.g., 97201 or Portland)..."
                            value={addFormSearch}
                            onChange={(e) => setAddFormSearch(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleUnifiedSearch(addFormSearch)
                            }}
                            className="flex-1"
                            autoFocus
                          />
                          <Button 
                            onClick={() => handleUnifiedSearch(addFormSearch)}
                            disabled={addFormSearch.length < 3}
                          >
                            <Search className="h-4 w-4 mr-2" />
                            Search
                          </Button>
                        </div>
                        
                        {/* Search Results */}
                        {searchResults.length > 0 && (
                          <div className="border rounded-md divide-y max-h-60 overflow-y-auto">
                            {searchResults.map(result => (
                              <div 
                                key={result.id}
                                className="flex items-center justify-between p-3 hover:bg-muted"
                              >
                                <div>
                                  <span className="font-medium">{result.name}</span>
                                  <span className="text-sm text-muted-foreground ml-2">
                                    {result.county_name}, {result.state_code}
                                  </span>
                                </div>
                                <Button 
                                  size="sm"
                                  onClick={() => {
                                    handleAddArea(result.id)
                                    setShowAddForm(false)
                                    setAddFormSearch('')
                                    setSearchResults([])
                                  }}
                                >
                                  Add
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {searchResults.length === 0 && addFormSearch.length >= 3 && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No locations found matching &quot;{addFormSearch}&quot;
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>State</TableHead>
                          <TableHead>County</TableHead>
                          <TableHead>City</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAreas.length === 0 && areaFilter && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              <div className="text-muted-foreground">
                                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>No areas match &quot;{areaFilter}&quot;</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                        {filteredAreas.length === 0 && !areaFilter ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                              No service areas configured yet.
                            </TableCell>
                          </TableRow>
                        ) : filteredAreas.length > 0 ? (
                          filteredAreas.map((area) => (
                            <TableRow key={area.id}>
                              <TableCell>{area.state_code || 'N/A'}</TableCell>
                              <TableCell>{area.county_name || 'N/A'}</TableCell>
                              <TableCell>
                                {area.city_name || availableCities.find(c => c.id === area.city_id)?.name || 'Unknown'}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{area.area_level || 'city'}</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={
                                    area.area_source === 'inherited' ? 'secondary' :
                                    area.area_source === 'service' ? 'default' : 
                                    area.area_source === 'added' ? 'default' : 
                                    'destructive'
                                  }
                                  className={
                                    area.area_source === 'inherited' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400' :
                                    area.area_source === 'service' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' : 
                                    area.area_source === 'added' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400' : 
                                    ''
                                  }
                                >
                                  {area.area_source === 'inherited' && '📥 Inherited'}
                                  {area.area_source === 'service' && '🏠 Service'}
                                  {area.area_source === 'added' && '➕ Added'}
                                  {area.area_source === 'excluded' && '⛔ Excluded'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                {area.area_source === 'inherited' ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      // Create exclusion
                                      if (area.city_id) {
                                        handleAddArea(area.city_id, 'sub_service_exclusion')
                                      }
                                    }}
                                  >
                                    Exclude
                                  </Button>
                                ) : area.area_source === 'excluded' ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveArea(area.id)}
                                  >
                                    Add Back
                                  </Button>
                                ) : area.area_source === 'service' || area.area_source === 'added' ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveArea(area.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                ) : null}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button onClick={() => setManageAreasDialogOpen(false)}>
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

