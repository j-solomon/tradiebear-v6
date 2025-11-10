"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useToast } from "@/components/ui/use-toast"
import { Upload, CheckCircle2, Loader2, ChevronLeft, ChevronRight, Moon, Sun, ChevronDown } from "lucide-react"
import { saveStep1 } from "./save-step"

interface Service {
  id: string
  name: string
}

interface SubService {
  id: string
  service_id: string
  name: string
  slug: string
  description?: string
}

interface ReferralFormProps {
  referralLinkId: string
  services: Service[]
  subServices: SubService[]
}

export default function ReferralForm({ referralLinkId, services, subServices }: ReferralFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [darkMode, setDarkMode] = useState(false)
  const [optionalDetailsOpen, setOptionalDetailsOpen] = useState(false)
  const [savedLeadId, setSavedLeadId] = useState<string | null>(null)
  const addressInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    service_id: "",
    sub_service_id: "",
    budget: "",
    timeline: "",
    notes: "",
    consent_unified: false,
    consent_terms: false,
  })

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (!addressInputRef.current) return

    let autocompleteInstance: any = null

    const loadGoogleMaps = () => {
      // Check if API key exists
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      
      if (!apiKey) {
        console.error('Google Maps API key is missing')
        toast({
          variant: "destructive",
          title: "Configuration Error",
          description: "Google Maps API key is not configured. Address autocomplete is unavailable.",
        })
        return
      }

      // Check if Google Maps is already loaded
      if (window.google?.maps?.places) {
        console.log('Google Maps already loaded, initializing autocomplete...')
        initAutocomplete()
        return
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
      if (existingScript) {
        console.log('Google Maps script already loading, waiting...')
        existingScript.addEventListener('load', () => initAutocomplete())
        return
      }

      console.log('Loading Google Maps API...')

      // Load Google Maps script
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`
      script.async = true
      script.defer = true
      
      // Add callback function to window
      window.initMap = () => {
        console.log('Google Maps loaded successfully')
        initAutocomplete()
      }
      
      script.onerror = (error) => {
        console.error('Failed to load Google Maps API:', error)
        toast({
          variant: "destructive",
          title: "Maps Load Error",
          description: "Unable to load Google Maps. Address autocomplete is unavailable. You can still enter your address manually.",
        })
      }
      
      document.head.appendChild(script)
    }

    const initAutocomplete = () => {
      if (!addressInputRef.current) {
        console.error('Address input ref not available')
        return
      }

      if (!window.google?.maps?.places) {
        console.error('Google Maps Places API not available')
        toast({
          variant: "destructive",
          title: "Autocomplete Error",
          description: "Address autocomplete is unavailable. Please enter your address manually.",
        })
        return
      }

      try {
        console.log('Initializing Google Places Autocomplete...')
        
        const googleMaps = (window as any).google
        autocompleteInstance = new googleMaps.maps.places.Autocomplete(
          addressInputRef.current,
          {
            types: ['address'],
            componentRestrictions: { country: 'us' },
            fields: ['address_components', 'formatted_address', 'geometry']
          }
        )

        autocompleteInstance.addListener('place_changed', () => {
          const place = autocompleteInstance?.getPlace()
          
          console.log('Place selected:', place)

          if (!place?.address_components) {
            console.warn('No address components in selected place')
            toast({
              variant: "destructive",
              title: "Invalid Selection",
              description: "Please select a valid address from the dropdown.",
            })
            return
          }

          // Extract address components
          let streetNumber = ''
          let route = ''
          let city = ''
          let state = ''
          let zip = ''

          place.address_components.forEach((component: any) => {
            const types = component.types
            
            if (types.includes('street_number')) {
              streetNumber = component.long_name
            }
            if (types.includes('route')) {
              route = component.long_name
            }
            if (types.includes('locality')) {
              city = component.long_name
            }
            if (types.includes('administrative_area_level_1')) {
              state = component.short_name
            }
            if (types.includes('postal_code')) {
              zip = component.long_name
            }
          })

          console.log('Extracted address:', { streetNumber, route, city, state, zip })

          // Update form data with extracted address components
          setFormData(prev => ({
            ...prev,
            address: `${streetNumber} ${route}`.trim(),
            city: city,
            state: state,
            zip: zip
          }))

          // Show success toast
          toast({
            title: "Address Added",
            description: `${city}, ${state} ${zip}`,
          })
        })

        console.log('Autocomplete initialized successfully')
      } catch (error) {
        console.error('Error initializing autocomplete:', error)
        toast({
          variant: "destructive",
          title: "Initialization Error",
          description: "Could not initialize address autocomplete. Please enter your address manually.",
        })
      }
    }

    loadGoogleMaps()

    // Cleanup
    return () => {
      if (autocompleteInstance && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(autocompleteInstance)
      }
    }
  }, [toast])

  // Filter sub-services based on selected service
  const availableSubServices = formData.service_id
    ? subServices.filter(sub => sub.service_id === formData.service_id)
    : []

  const selectedService = services.find(s => s.id === formData.service_id)
  const selectedSubService = subServices.find(s => s.id === formData.sub_service_id)

  // Auto-format phone number as user types
  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, '')
    if (phoneNumber.length <= 3) {
      return phoneNumber
    } else if (phoneNumber.length <= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
    } else {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setFormData({ ...formData, phone: formatted })
  }

  // Auto-fill city and state from ZIP code
  const handleZipChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const zip = e.target.value.replace(/\D/g, '').slice(0, 5)
    setFormData({ ...formData, zip })

    if (zip.length === 5) {
      try {
        const response = await fetch(`https://api.zippopotam.us/us/${zip}`)
        if (response.ok) {
          const data = await response.json()
          setFormData(prev => ({
            ...prev,
            city: data.places[0]['place name'],
            state: data.places[0]['state abbreviation']
          }))
        }
      } catch (error) {
        // Silently fail - user can still manually enter
        console.log('ZIP lookup failed', error)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      
      if (files.length + newFiles.length > 10) {
        toast({
          variant: "destructive",
          title: "Too many files",
          description: "You can upload a maximum of 10 images.",
        })
        return
      }

      const oversizedFiles = newFiles.filter(file => file.size > 20 * 1024 * 1024)
      if (oversizedFiles.length > 0) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Each file must be less than 20 MB.",
        })
        return
      }

      setFiles([...files, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  // Validation for each step
  const validateStep1 = () => {
    if (!formData.name.trim()) {
      toast({ variant: "destructive", title: "Name required", description: "Please enter your full name." })
      return false
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({ variant: "destructive", title: "Invalid email", description: "Please enter a valid email address." })
      return false
    }
    
    const phoneDigits = formData.phone.replace(/\D/g, '')
    if (phoneDigits.length !== 10) {
      toast({ variant: "destructive", title: "Invalid phone", description: "Please enter a 10-digit phone number." })
      return false
    }
    
    if (!formData.address.trim()) {
      toast({ variant: "destructive", title: "Address required", description: "Please enter your property address." })
      return false
    }
    
    if (!formData.zip || formData.zip.length !== 5) {
      toast({ variant: "destructive", title: "Invalid ZIP", description: "Please enter a 5-digit ZIP code." })
      return false
    }
    
    if (!formData.consent_unified) {
      toast({ 
        variant: "destructive", 
        title: "Consent required", 
        description: "Please agree to be contacted about your project." 
      })
      return false
    }
    
    return true
  }

  const validateStep2 = () => {
    if (!formData.service_id) {
      toast({ variant: "destructive", title: "Service required", description: "Please select a service category." })
      return false
    }
    
    // Always require sub-service selection
    if (!formData.sub_service_id) {
      if (availableSubServices.length === 0) {
        toast({ 
          variant: "destructive", 
          title: "No services available", 
          description: "This service category has no specific services. Please contact support or choose another category." 
        })
      } else {
        toast({ 
          variant: "destructive", 
          title: "Specific service required", 
          description: "Please select a specific service." 
        })
      }
      return false
    }
    return true
  }

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!validateStep1()) return
      
      // Save Step 1 data to database
      setLoading(true)
      try {
        const result = await saveStep1({
          referralLinkId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          consent_unified: formData.consent_unified,
        })

        if (result.error) {
          console.error('Error saving Step 1:', result.error)
          toast({
            variant: "destructive",
            title: "Save Error",
            description: "We couldn't save your information. Please try again.",
          })
          setLoading(false)
          return
        }

        setSavedLeadId(result.leadId || null)
        
        setCurrentStep(2)
      } catch (error) {
        console.error('Error saving Step 1:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3)
    }
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.consent_terms) {
      toast({
        variant: "destructive",
        title: "Terms required",
        description: "You must accept the terms and conditions.",
      })
      return
    }

    // Final validation check - ensure sub-service is selected
    if (!formData.sub_service_id) {
      toast({
        variant: "destructive",
        title: "Incomplete information",
        description: "Please go back and select a specific service.",
      })
      return
    }

    setLoading(true)
    const supabase = createClient()

    try {
      // Upload images if any
      let imageFilePaths: string[] = []
      if (files.length > 0) {
        for (const file of files) {
          const fileName = `${Date.now()}-${file.name}`
          const { data, error } = await supabase.storage
            .from('lead-attachments')
            .upload(fileName, file)

          if (error) throw error
          imageFilePaths.push(fileName)
        }
      }

      // Prepare extra details with unified consent and budget range
      const extraDetails: any = {
        attachments: imageFilePaths.length > 0 ? imageFilePaths : [],
        consent_email: formData.consent_unified,
        consent_sms: formData.consent_unified,
        consent_call: formData.consent_unified,
        consent_terms: formData.consent_terms,
        budget_range: formData.budget || null
      }

      // Split name into first and last
      const nameParts = formData.name.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      const fullLeadData = {
        referral_id: referralLinkId,
        sub_service_id: formData.sub_service_id || null,
        homeowner_first: firstName,
        homeowner_last: lastName,
        homeowner_email: formData.email,
        homeowner_phone: formData.phone,
        address_street: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        budget_estimate: null,
        timeline: formData.timeline || null,
        notes: formData.notes,
        extra_details: extraDetails,
        stage: 'submitted',
        completion_status: 'submitted', // Mark as fully complete
      }

      if (savedLeadId) {
        // Update the existing partial lead with full details
        const { error: updateError } = await supabase
          .from('leads')
          .update(fullLeadData)
          .eq('id', savedLeadId)

        if (updateError) throw updateError
      } else {
        // Fallback: Insert new lead if Step 1 save somehow failed
        const { error: insertError } = await supabase
          .from('leads')
          .insert(fullLeadData)

        if (insertError) throw insertError
      }

      setSubmitted(true)
      toast({
        title: "Success!",
        description: "Your request has been submitted. We'll be in touch soon!",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
      })
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <Card className="text-center py-12 border-0 sm:border">
        <CardContent className="space-y-4">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold">Thank You!</h2>
          <p className="text-muted-foreground">
            We&apos;ve received your estimate request and will contact you shortly.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 sm:border">
      <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex items-start sm:items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg sm:text-xl md:text-2xl leading-tight">
              {currentStep === 1 && "Contact Information"}
              {currentStep === 2 && "Project Details"}
              {currentStep === 3 && "Review & Submit"}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base mt-1">
              Step {currentStep} of 3
            </CardDescription>
          </div>
          
          {/* Dark Mode Toggle */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            className="h-10 w-10 sm:h-9 sm:w-9 flex-shrink-0"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <Sun className="h-5 w-5 sm:h-4 sm:w-4" />
            ) : (
              <Moon className="h-5 w-5 sm:h-4 sm:w-4" />
            )}
          </Button>
        </div>
        
        {/* Progress Bar */}
        <div className="flex gap-2 mt-4">
          <div className={`h-2.5 sm:h-2 flex-1 rounded-full ${currentStep >= 1 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`h-2.5 sm:h-2 flex-1 rounded-full ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`h-2.5 sm:h-2 flex-1 rounded-full ${currentStep >= 3 ? 'bg-primary' : 'bg-muted'}`} />
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 py-4 sm:py-6">
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          
          {/* Step 1: Contact Information */}
          {currentStep === 1 && (
            <div className="space-y-5 sm:space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm sm:text-base">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Smith"
                    className="h-11 sm:h-10 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm sm:text-base">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="h-11 sm:h-10 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm sm:text-base">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="(503) 555-0123"
                    className="h-11 sm:h-10 text-base"
                    maxLength={14}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-base sm:text-lg">Property Address</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm sm:text-base">Street Address *</Label>
                  <Input
                    ref={addressInputRef}
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Start typing your address..."
                    className="h-11 sm:h-10 text-base"
                    autoComplete="off"
                  />
                  <p className="text-xs text-muted-foreground">📍 Powered by Google Maps • Start typing for suggestions</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zip" className="text-sm sm:text-base">ZIP Code *</Label>
                  <Input
                    id="zip"
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    value={formData.zip}
                    onChange={handleZipChange}
                    placeholder="97201"
                    className="h-11 sm:h-10 text-base"
                  />
                  {formData.city && formData.state && (
                    <p className="text-xs text-muted-foreground">
                      📍 {formData.city}, {formData.state}
                    </p>
                  )}
                </div>
              </div>

              {/* Consent Section */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-semibold text-sm sm:text-base">Communication Consent</h4>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consent_unified_step1"
                    checked={formData.consent_unified}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, consent_unified: checked as boolean })
                    }
                    required
                    className="mt-0.5 h-5 w-5 sm:h-4 sm:w-4"
                  />
                  <Label htmlFor="consent_unified_step1" className="text-sm font-normal leading-tight cursor-pointer">
                    I agree to be contacted about my project. *
                  </Label>
                </div>
              </div>

              <Button 
                type="button" 
                onClick={handleNext} 
                disabled={loading}
                className="w-full h-12 sm:h-11 text-base" 
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Next: Project Details
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Step 2: Project Details */}
          {currentStep === 2 && (
            <div className="space-y-5 sm:space-y-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-sm sm:text-base">Service Category *</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, service_id: service.id, sub_service_id: "" })}
                        className={`
                          relative p-4 rounded-lg border-2 text-left transition-all
                          ${formData.service_id === service.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-muted hover:border-primary/50'
                          }
                        `}
                      >
                        <div className="font-semibold text-sm">{service.name}</div>
                        {formData.service_id === service.id && (
                          <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.service_id && availableSubServices.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="sub_service" className="text-sm sm:text-base">Specific Service *</Label>
                    <Select
                      value={formData.sub_service_id}
                      onValueChange={(value) => setFormData({ ...formData, sub_service_id: value })}
                    >
                      <SelectTrigger className="h-11 sm:h-10">
                        <SelectValue placeholder="Select specific service" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSubServices.map((subService) => (
                          <SelectItem key={subService.id} value={subService.id} className="py-3 sm:py-2">
                            <div className="flex flex-col">
                              <span className="font-medium">{subService.description || subService.name}</span>
                              {subService.description && (
                                <span className="text-xs text-muted-foreground">{subService.slug}</span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-3">
                  <Label className="text-sm sm:text-base">Estimated Budget (Optional)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Under $5,000", value: "Under $5,000" },
                      { label: "$5,000 – $15,000", value: "$5,000 – $15,000" },
                      { label: "$15,000 – $30,000", value: "$15,000 – $30,000" },
                      { label: "$30,000+", value: "$30,000+" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, budget: option.value })}
                        className={`
                          relative p-4 rounded-lg border-2 text-center transition-all font-medium
                          ${formData.budget === option.value 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-muted hover:border-primary/50'
                          }
                        `}
                      >
                        {option.label}
                        {formData.budget === option.value && (
                          <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm sm:text-base">Project Timeline (Optional)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Ready Now", value: "Immediately" },
                      { label: "This Month", value: "Within 1 month" },
                      { label: "3-6 Months", value: "3-6 months" },
                      { label: "Just Exploring", value: "Just exploring" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, timeline: option.value })}
                        className={`
                          relative p-4 rounded-lg border-2 text-center transition-all font-medium
                          ${formData.timeline === option.value 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-muted hover:border-primary/50'
                          }
                        `}
                      >
                        {option.label}
                        {formData.timeline === option.value && (
                          <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Collapsible Optional Details */}
              <Collapsible open={optionalDetailsOpen} onOpenChange={setOptionalDetailsOpen}>
                <CollapsibleTrigger asChild>
                  <Button type="button" variant="outline" className="w-full h-11 text-base">
                    Add Optional Project Details
                    <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${optionalDetailsOpen ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm sm:text-base">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      rows={4}
                      placeholder="Tell us more about your project..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="text-base min-h-[100px]"
                    />
                  </div>

                  {/* File Upload */}
                  <div className="space-y-3">
                    <Label className="text-sm sm:text-base">Photos</Label>
                    <p className="text-xs text-muted-foreground">
                      Upload up to 10 images (JPG, PNG, HEIC). Max 20 MB each.
                    </p>
                    
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 py-8 text-center touch-manipulation">
                      <Upload className="w-10 h-10 sm:w-8 sm:h-8 mx-auto mb-3 sm:mb-2 text-muted-foreground" />
                      <Label htmlFor="files" className="cursor-pointer text-sm sm:text-base">
                        <span className="text-primary hover:underline">Click to upload</span> or drag and drop
                      </Label>
                      <Input
                        id="files"
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/heic"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>

                    {files.length > 0 && (
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 sm:p-2 bg-muted rounded">
                            <span className="text-sm truncate flex-1">{file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="ml-2 h-9 sm:h-8"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button type="button" onClick={handleBack} variant="outline" className="w-full sm:flex-1 h-12 sm:h-11 text-base" size="lg">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button type="button" onClick={handleNext} className="w-full sm:flex-1 h-12 sm:h-11 text-base" size="lg">
                  Review
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {currentStep === 3 && (
            <div className="space-y-5 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <h3 className="font-semibold text-base sm:text-lg">Contact Information</h3>
                  <div className="text-sm sm:text-base space-y-1.5 sm:space-y-1">
                    <p><strong>Name:</strong> {formData.name}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Phone:</strong> {formData.phone}</p>
                    <p><strong>Address:</strong> {formData.address}, {formData.city}, {formData.state} {formData.zip}</p>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <h3 className="font-semibold text-base sm:text-lg">Project Details</h3>
                  <div className="text-sm sm:text-base space-y-1.5 sm:space-y-1">
                    <p><strong>Service:</strong> {selectedService?.name}</p>
                    {selectedSubService && (
                      <p><strong>Specific Service:</strong> {selectedSubService.description || selectedSubService.name}</p>
                    )}
                    {formData.budget && <p><strong>Budget:</strong> {formData.budget}</p>}
                    {formData.timeline && <p><strong>Timeline:</strong> {formData.timeline}</p>}
                    {formData.notes && <p><strong>Notes:</strong> {formData.notes}</p>}
                    {files.length > 0 && <p><strong>Photos:</strong> {files.length} file(s) attached</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-base sm:text-lg">Terms & Conditions</h3>
                
                <div className="space-y-3.5">
                  <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
                    <p>✓ You&apos;ve already agreed to receive project updates via email, text, and phone.</p>
                  </div>

                  <div className="flex items-start space-x-3 sm:space-x-2">
                    <Checkbox
                      id="consent_terms"
                      checked={formData.consent_terms}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, consent_terms: checked as boolean })
                      }
                      required
                      className="mt-0.5 h-5 w-5 sm:h-4 sm:w-4"
                    />
                    <Label htmlFor="consent_terms" className="text-sm sm:text-base font-normal leading-tight cursor-pointer">
                      I agree to the Terms and Conditions and Privacy Policy *
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                <Button type="button" onClick={handleBack} variant="outline" className="w-full sm:flex-1 h-12 sm:h-11 text-base" size="lg">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button type="submit" className="w-full sm:flex-1 h-12 sm:h-11 text-base" size="lg" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
