"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useToast } from "@/components/ui/use-toast"
import { Upload, CheckCircle2, Loader2, ChevronRight, Moon, Sun, ChevronDown, Edit2, ArrowRight } from "lucide-react"
import { saveStep1 } from "./save-step"
import { logFormError } from "./error-logger"

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

// Parent category mapping
const PARENT_CATEGORIES = [
  { 
    id: 'remodeling', 
    name: 'Remodeling', 
    icon: '🏗️',
    keywords: ['remodel', 'kitchen', 'bathroom', 'basement', 'adu', 'addition']
  },
  { 
    id: 'roofing', 
    name: 'Roofing', 
    icon: '🏠',
    keywords: ['roof', 'gutter', 'skylight']
  },
  { 
    id: 'exterior', 
    name: 'Exterior Services', 
    icon: '🎨',
    keywords: ['siding', 'deck', 'fence', 'pergola', 'gazebo', 'paint', 'exterior', 'window', 'door']
  },
  { 
    id: 'interior', 
    name: 'Interior Services', 
    icon: '✨',
    keywords: ['paint', 'interior', 'cabinet', 'countertop', 'flooring', 'tile']
  },
  { 
    id: 'mechanical', 
    name: 'HVAC & Mechanical', 
    icon: '⚙️',
    keywords: ['hvac', 'air', 'heating', 'cooling', 'plumb', 'electric']
  },
  { 
    id: 'specialty', 
    name: 'Specialty Services', 
    icon: '⭐',
    keywords: ['theater', 'golf', 'solar', 'smart', 'pool', 'sauna']
  },
  { 
    id: 'cleaning', 
    name: 'Cleaning & Maintenance', 
    icon: '🧹',
    keywords: ['clean', 'carpet', 'mold', 'water', 'fire', 'damage', 'repair', 'foundation']
  },
  { 
    id: 'outdoor', 
    name: 'Outdoor Living', 
    icon: '🌳',
    keywords: ['lawn', 'garden', 'landscape', 'outdoor', 'kitchen', 'pole barn']
  },
]

export default function ReferralForm({ referralLinkId, services, subServices }: ReferralFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [darkMode, setDarkMode] = useState(false)
  const [optionalDetailsOpen, setOptionalDetailsOpen] = useState(false)
  const [savedLeadId, setSavedLeadId] = useState<string | null>(null)
  const [selectedParentCategory, setSelectedParentCategory] = useState("")
  const addressInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Version check - log to console to verify deployment
  useEffect(() => {
    console.log('🚀 Referral Form Version: 2.1.0 - Service ID Fix Deployed')
    console.log('📦 Build Time:', new Date().toISOString())
  }, [])

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

  // Initialize dark mode based on system preference
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setDarkMode(isDark)
  }, [])

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Helper function to log errors
  const logError = async (errorType: string, error: any, step: number, additionalData?: any) => {
    await logFormError({
      error_type: errorType,
      error_message: error?.message || String(error),
      error_stack: error?.stack,
      user_email: formData.email || undefined,
      referral_link_id: referralLinkId,
      form_step: step,
      form_data: {
        ...additionalData,
        hasServiceId: !!formData.service_id,
        hasSubServiceId: !!formData.sub_service_id,
        hasTimeline: !!formData.timeline,
        hasBudget: !!formData.budget,
        hasNotes: !!formData.notes,
        fileCount: files.length
      },
      timestamp: new Date().toISOString(),
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
    })
  }

  // Initialize Google Places Autocomplete
  useEffect(() => {
    // Only initialize when on step 2 (contact info) where address field exists
    if (currentStep !== 2) return
    if (!addressInputRef.current) return

    let autocompleteInstance: any = null

    const loadGoogleMaps = () => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      
      if (!apiKey) {
        console.error('Google Maps API key is missing')
        return
      }

      if (window.google?.maps?.places) {
        initAutocomplete()
        return
      }

      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
      if (existingScript) {
        existingScript.addEventListener('load', () => initAutocomplete())
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`
      script.async = true
      script.defer = true
      
      window.initMap = () => {
        initAutocomplete()
      }
      
      script.onerror = () => {
        console.error('Failed to load Google Maps')
      }
      
      document.head.appendChild(script)
    }

    const initAutocomplete = () => {
      if (!addressInputRef.current || !window.google?.maps?.places) return

      try {
        const googleMaps = (window as any).google
        autocompleteInstance = new googleMaps.maps.places.Autocomplete(
          addressInputRef.current,
          {
            types: ['address'],
            componentRestrictions: { country: 'us' },
            fields: ['address_components', 'formatted_address']
          }
        )

        autocompleteInstance.addListener('place_changed', () => {
          const place = autocompleteInstance?.getPlace()
          
          if (!place?.address_components) return

          let streetNumber = ''
          let route = ''
          let city = ''
          let state = ''
          let zip = ''

          place.address_components.forEach((component: any) => {
            const types = component.types
            
            if (types.includes('street_number')) streetNumber = component.long_name
            if (types.includes('route')) route = component.long_name
            if (types.includes('locality')) city = component.long_name
            if (types.includes('administrative_area_level_1')) state = component.short_name
            if (types.includes('postal_code')) zip = component.long_name
          })

          setFormData(prev => ({
            ...prev,
            address: `${streetNumber} ${route}`.trim(),
            city: city,
            state: state,
            zip: zip
          }))
        })
      } catch (error) {
        console.error('Error initializing autocomplete:', error)
      }
    }

    loadGoogleMaps()

    return () => {
      if (autocompleteInstance && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(autocompleteInstance)
      }
    }
  }, [currentStep])

  // Get services for selected parent category
  const getServicesForParent = (parentId: string) => {
    const parent = PARENT_CATEGORIES.find(p => p.id === parentId)
    if (!parent) return []
    
    return services.filter(service => 
      parent.keywords.some(keyword => 
        service.name.toLowerCase().includes(keyword.toLowerCase())
      )
    )
  }

  // Get sub-services for selected service
  const availableSubServices = formData.service_id 
    ? subServices.filter(sub => sub.service_id === formData.service_id)
    : []

  const selectedService = services.find(s => s.id === formData.service_id)
  const selectedSubService = subServices.find(s => s.id === formData.sub_service_id)

  // Phone formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    let formatted = value
    
    if (value.length > 0) {
      if (value.length <= 3) formatted = `(${value}`
      else if (value.length <= 6) formatted = `(${value.slice(0, 3)}) ${value.slice(3)}`
      else formatted = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`
    }
    
    setFormData({ ...formData, phone: formatted })
  }

  // ZIP code change handler
  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5)
    setFormData({ ...formData, zip: value })
    
    // Auto-fill city/state based on ZIP (simple lookup - in production use a proper API)
    if (value.length === 5) {
      // This is a placeholder - you'd typically use a ZIP lookup service
      // For now, we'll rely on the Google Maps autocomplete
    }
  }

  // File handling
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

  // Validate Project Details (Step 1)
  const validateProjectDetails = () => {
    // If no sub-services available, just require service_id
    if (availableSubServices.length === 0 && !formData.service_id) {
      toast({ variant: "destructive", title: "Service required", description: "Please select a service." })
      return false
    }
    
    // If sub-services exist, require selection
    if (availableSubServices.length > 0 && !formData.sub_service_id) {
      toast({ variant: "destructive", title: "Service required", description: "Please select a specific service." })
      return false
    }
    return true
  }

  // Validate Contact Info (Step 2)
  const validateContactInfo = () => {
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

  // Handle next/save
  const handleNext = async () => {
    if (currentStep === 1) {
      // Step 1: Project Details - just validate and proceed
      if (!validateProjectDetails()) return
      console.log('✅ Step 1 Validation Passed - Project Details:', {
        service_id: formData.service_id,
        sub_service_id: formData.sub_service_id
      })
      setCurrentStep(2)
    } else if (currentStep === 2) {
      // Step 2: Contact Info - validate and save
      if (!validateContactInfo()) return
      
      setLoading(true)
      console.log('🔄 Saving Step 2 - Contact Info with Service Data:', {
        service_id: formData.service_id,
        sub_service_id: formData.sub_service_id,
        email: formData.email
      })
      
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
          service_id: formData.service_id,
          sub_service_id: formData.sub_service_id,
        })

        if (result.error) {
          console.error('❌ Step 2 Save Error:', result.error)
          await logError('STEP2_SAVE_FAILED', result.error, 2, { savedLeadId })
          
          toast({
            variant: "destructive",
            title: "Save Error",
            description: `Could not save: ${result.error.message}`,
          })
          setLoading(false)
          return
        }

        console.log('✅ Step 2 Saved Successfully. Lead ID:', result.leadId)
        setSavedLeadId(result.leadId || null)
        setCurrentStep(3)
      } catch (error: any) {
        console.error('❌ Step 2 Exception:', error)
        await logError('STEP2_EXCEPTION', error, 2)
        
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to save. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  const editStep = (step: number) => {
    setCurrentStep(step)
  }

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('🚀 STEP 3: Final Submission Started')
    console.log('📊 Form State:', {
      savedLeadId,
      service_id: formData.service_id,
      sub_service_id: formData.sub_service_id,
      timeline: formData.timeline,
      budget: formData.budget,
      notes: formData.notes,
      filesCount: files.length
    })
    
    if (!formData.consent_terms) {
      await logError('VALIDATION_TERMS_MISSING', new Error('Terms not accepted'), 3)
      toast({
        variant: "destructive",
        title: "Terms required",
        description: "You must accept the terms and conditions.",
      })
      return
    }

    // Require either sub_service_id OR service_id (for services without sub-categories)
    if (!formData.sub_service_id && !formData.service_id) {
      await logError('VALIDATION_SERVICE_MISSING', new Error('No service selected'), 3, {
        formData: { service_id: formData.service_id, sub_service_id: formData.sub_service_id }
      })
      toast({
        variant: "destructive",
        title: "Incomplete information",
        description: "Please go back and select a service.",
      })
      return
    }

    setLoading(true)
    const supabase = createClient()

    try {
      // Upload images with detailed logging
      let imageFilePaths: string[] = []
      if (files.length > 0) {
        console.log(`📤 Uploading ${files.length} files...`)
        for (const file of files) {
          const fileName = `${Date.now()}-${file.name}`
          console.log(`  Uploading: ${fileName} (${(file.size / 1024 / 1024).toFixed(2)} MB)`)
          
          const { data, error } = await supabase.storage
            .from('lead-attachments')
            .upload(fileName, file)

          if (error) {
            console.error(`  ❌ Upload failed: ${fileName}`, error)
            await logError('IMAGE_UPLOAD_FAILED', error, 3, { fileName, fileSize: file.size })
            throw error
          }
          
          console.log(`  ✅ Uploaded: ${fileName}`)
          imageFilePaths.push(fileName)
        }
      }

      // Prepare data
      const extraDetails: any = {
        attachments: imageFilePaths.length > 0 ? imageFilePaths : [],
        consent_email: formData.consent_unified,
        consent_sms: formData.consent_unified,
        consent_call: formData.consent_unified,
        consent_terms: formData.consent_terms,
        budget_range: formData.budget || null,
        service_id: formData.service_id || null
      }

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
        completion_status: 'submitted',
      }

      console.log('💾 Submitting to database...', {
        operation: savedLeadId ? 'UPDATE' : 'INSERT',
        leadId: savedLeadId,
        dataKeys: Object.keys(fullLeadData)
      })

      if (savedLeadId) {
        const { data: updatedData, error: updateError } = await supabase
          .from('leads')
          .update(fullLeadData)
          .eq('id', savedLeadId)
          .select()

        if (updateError) {
          console.error('❌ Database UPDATE failed:', updateError)
          await logError('DATABASE_UPDATE_FAILED', updateError, 3, { 
            savedLeadId, 
            fullLeadData 
          })
          throw updateError
        }
        
        console.log('✅ Database UPDATE successful:', updatedData)
      } else {
        const { data: insertedData, error: insertError } = await supabase
          .from('leads')
          .insert(fullLeadData)
          .select()

        if (insertError) {
          console.error('❌ Database INSERT failed:', insertError)
          await logError('DATABASE_INSERT_FAILED', insertError, 3, { 
            fullLeadData 
          })
          throw insertError
        }
        
        console.log('✅ Database INSERT successful:', insertedData)
      }

      console.log('🎉 Form submission completed successfully!')
      setSubmitted(true)
      toast({
        title: "Success!",
        description: "Your request has been submitted. We'll be in touch soon!",
      })
    } catch (error: any) {
      console.error('❌ FATAL ERROR in handleSubmit:', error)
      await logError('SUBMISSION_FATAL_ERROR', error, 3, { savedLeadId })
      
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "Something went wrong. Please try again or contact support.",
      })
      setLoading(false)
    }
  }

  // Success state
  if (submitted) {
    return (
      <Card className="text-center py-12 border-0 sm:border">
        <CardContent className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold">Thank You!</h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto">
            We&apos;ve received your estimate request and will contact you within 24 hours.
          </p>
          <p className="text-sm text-muted-foreground">
            Check your email for confirmation.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Progress steps
  const steps = [
    { number: 1, label: "Project Details" },
    { number: 2, label: "Contact Info" },
    { number: 3, label: "Review & Submit" }
  ]

  return (
    <Card className="border-0 sm:border shadow-lg">
      <CardHeader className="px-4 sm:px-6 py-5 sm:py-6 border-b">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1">
            <CardTitle className="text-xl sm:text-2xl font-bold leading-tight mb-1">
              {currentStep === 1 && "Project Details"}
              {currentStep === 2 && "Contact Information"}
              {currentStep === 3 && "Review & Submit"}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {currentStep === 1 && "Tell us about your project"}
              {currentStep === 2 && "Takes less than 90 seconds"}
              {currentStep === 3 && "One last look before we connect you"}
            </CardDescription>
          </div>
          
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            className="h-9 w-9 flex-shrink-0"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs sm:text-sm font-medium mb-2">
            {steps.map((step, idx) => (
              <div 
                key={step.number}
                className={`flex items-center ${
                  step.number === currentStep 
                    ? 'text-primary' 
                    : step.number < currentStep 
                      ? 'text-muted-foreground' 
                      : 'text-muted-foreground/50'
                }`}
              >
                <span className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs mr-1.5
                  ${step.number === currentStep ? 'bg-primary text-primary-foreground' : ''}
                  ${step.number < currentStep ? 'bg-primary/20' : ''}
                  ${step.number > currentStep ? 'bg-muted' : ''}
                `}>
                  {step.number < currentStep ? '✓' : step.number}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-in-out"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-6 py-5 sm:py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* ========== STEP 1: PROJECT DETAILS ========== */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Parent category selection */}
              {!selectedParentCategory && (
                <div className="space-y-3">
                  <Label className="text-base font-medium">What type of service do you need? *</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                    {PARENT_CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setSelectedParentCategory(category.id)}
                        className="relative p-4 rounded-xl border-2 border-muted hover:border-primary/50 transition-all text-left group hover:shadow-md"
                      >
                        <div className="text-2xl mb-2">{category.icon}</div>
                        <div className="font-semibold text-sm group-hover:text-primary transition-colors">
                          {category.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Service selection (after parent selected) */}
              {selectedParentCategory && !formData.service_id && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">
                      Select a {PARENT_CATEGORIES.find(p => p.id === selectedParentCategory)?.name} service *
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedParentCategory("")}
                      className="text-xs"
                    >
                      ← Change category
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {getServicesForParent(selectedParentCategory).map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, service_id: service.id })}
                        className="relative p-4 rounded-lg border-2 border-muted hover:border-primary transition-all text-left"
                      >
                        <div className="font-medium text-sm">{service.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-service selection */}
              {formData.service_id && availableSubServices.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">What specifically do you need? *</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFormData({ ...formData, service_id: "", sub_service_id: "" })
                      }}
                      className="text-xs"
                    >
                      ← Change service
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                    {availableSubServices.map((subService) => (
                      <button
                        key={subService.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, sub_service_id: subService.id })}
                        className={`
                          relative p-4 rounded-lg border-2 transition-all text-left
                          ${formData.sub_service_id === subService.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-muted hover:border-primary/50'
                          }
                        `}
                      >
                        <div className="font-medium text-sm">
                          {subService.description || subService.name}
                        </div>
                        {formData.sub_service_id === subService.id && (
                          <CheckCircle2 className="absolute top-4 right-4 h-5 w-5 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Budget & Timeline (show after service/sub-service selected) */}
              {(formData.sub_service_id || (formData.service_id && availableSubServices.length === 0)) && (
                <>
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Estimated Budget (Optional)</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Under $5K", value: "Under $5,000" },
                        { label: "$5K – $15K", value: "$5,000 – $15,000" },
                        { label: "$15K – $30K", value: "$15,000 – $30,000" },
                        { label: "$30K+", value: "$30,000+" },
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
                            <CheckCircle2 className="absolute top-2 right-2 h-4 w-4" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-medium">Project Timeline (Optional)</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Ready Now", value: "Immediately" },
                        { label: "This Month", value: "Within 1 month" },
                        { label: "3–6 Months", value: "3-6 months" },
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
                            <CheckCircle2 className="absolute top-2 right-2 h-4 w-4" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Optional details accordion */}
                  <Collapsible open={optionalDetailsOpen} onOpenChange={setOptionalDetailsOpen}>
                    <CollapsibleTrigger asChild>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full h-11 text-base justify-between"
                      >
                        <span>Add Optional Details</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${optionalDetailsOpen ? 'rotate-180' : ''}`} />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="notes" className="text-base">Additional Notes</Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          placeholder="Tell us more about your project..."
                          className="min-h-24 text-base"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="photos" className="text-base">Upload Photos</Label>
                        <p className="text-xs text-muted-foreground mb-2">
                          Upload up to 10 images (JPG, PNG, HEIC). Max 20 MB each.
                        </p>
                        <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                          <input
                            id="photos"
                            type="file"
                            multiple
                            accept="image/*,.heic"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <label htmlFor="photos" className="cursor-pointer">
                            <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-sm font-medium">Click to upload</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {files.length}/10 files selected
                            </p>
                          </label>
                        </div>

                        {files.length > 0 && (
                          <div className="space-y-2 mt-3">
                            {files.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                <span className="text-sm truncate flex-1">{file.name}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
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
                </>
              )}

              {(formData.sub_service_id || (formData.service_id && availableSubServices.length === 0)) && (
                <Button 
                  type="button" 
                  onClick={handleNext} 
                  className="w-full h-12 text-base font-semibold"
                >
                  Continue
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              )}
            </div>
          )}

          {/* ========== STEP 2: CONTACT INFO ========== */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-medium">Full Name <span className="text-xs">*</span></Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Smith"
                  className="h-12 text-base"
                  autoComplete="name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-medium">Email Address <span className="text-xs">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="h-12 text-base"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-medium">Phone Number <span className="text-xs">*</span></Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="(503) 555-1234"
                  className="h-12 text-base"
                  autoComplete="tel"
                />
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-base font-medium">Street Address <span className="text-xs">*</span></Label>
                  <Input
                    ref={addressInputRef}
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Start typing your address..."
                    className="h-12 text-base"
                    autoComplete="off"
                  />
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="text-primary">●</span> Powered by Google Maps
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zip" className="text-base font-medium">ZIP Code <span className="text-xs">*</span></Label>
                  <Input
                    id="zip"
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    value={formData.zip}
                    onChange={handleZipChange}
                    placeholder="97201"
                    className="h-12 text-base"
                  />
                  {formData.city && formData.state && (
                    <p className="text-xs text-muted-foreground">
                      📍 {formData.city}, {formData.state}
                    </p>
                  )}
                </div>
              </div>

              {/* Consent */}
              <div className="space-y-3 pt-3 border-t">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consent"
                    checked={formData.consent_unified}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, consent_unified: checked as boolean })
                    }
                    required
                    className="mt-0.5 h-5 w-5"
                  />
                  <Label htmlFor="consent" className="text-sm leading-tight cursor-pointer font-normal">
                    I agree to be contacted about my project. <span className="text-xs">*</span>
                  </Label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  type="button" 
                  onClick={handleBack} 
                  variant="outline" 
                  className="w-full sm:w-auto h-12 text-base px-8"
                >
                  Back
                </Button>
                <Button 
                  type="button" 
                  onClick={handleNext} 
                  disabled={loading}
                  className="w-full sm:flex-1 h-12 text-base font-semibold" 
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Review & Submit
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* ========== STEP 3: REVIEW & SUBMIT ========== */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Project Details Summary */}
              <div className="bg-muted/50 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-base flex items-center gap-2">
                    🏗️ Project Details
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editStep(1)}
                    className="text-xs"
                  >
                    <Edit2 className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
                <div className="text-sm space-y-1.5 text-muted-foreground">
                  <p><strong className="text-foreground">Service:</strong> {selectedService?.name}</p>
                  {selectedSubService && (
                    <p><strong className="text-foreground">Specific:</strong> {selectedSubService.description || selectedSubService.name}</p>
                  )}
                  {formData.budget && <p><strong className="text-foreground">Budget:</strong> {formData.budget}</p>}
                  {formData.timeline && <p><strong className="text-foreground">Timeline:</strong> {formData.timeline}</p>}
                  {formData.notes && (
                    <p><strong className="text-foreground">Notes:</strong> {formData.notes}</p>
                  )}
                  {files.length > 0 && (
                    <p><strong className="text-foreground">Photos:</strong> {files.length} file(s) attached</p>
                  )}
                </div>
              </div>

              {/* Contact Info Summary */}
              <div className="bg-muted/50 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-base flex items-center gap-2">
                    📱 Contact Information
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editStep(2)}
                    className="text-xs"
                  >
                    <Edit2 className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
                <div className="text-sm space-y-1.5 text-muted-foreground">
                  <p><strong className="text-foreground">Name:</strong> {formData.name}</p>
                  <p><strong className="text-foreground">Email:</strong> {formData.email}</p>
                  <p><strong className="text-foreground">Phone:</strong> {formData.phone}</p>
                  <p><strong className="text-foreground">Address:</strong> {formData.address}, {formData.city}, {formData.state} {formData.zip}</p>
                </div>
              </div>

              {/* Terms acceptance */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={formData.consent_terms}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, consent_terms: checked as boolean })
                    }
                    required
                    className="mt-0.5 h-5 w-5"
                  />
                  <Label htmlFor="terms" className="text-sm leading-tight cursor-pointer font-normal">
                    I agree to the <a href="/terms" className="underline hover:text-primary">Terms and Conditions</a> and <a href="/privacy" className="underline hover:text-primary">Privacy Policy</a> *
                  </Label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  type="button" 
                  onClick={handleBack} 
                  variant="outline" 
                  className="w-full sm:w-auto h-12 text-base px-8"
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="w-full sm:flex-1 h-12 text-base font-semibold bg-primary hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Get My Estimate
                      <CheckCircle2 className="ml-2 h-5 w-5" />
                    </>
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
