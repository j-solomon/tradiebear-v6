"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Upload, CheckCircle2, Loader2, ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react"

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
  const { toast } = useToast()

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    email_confirm: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    service_id: "",
    sub_service_id: "",
    budget: "",
    timeline: "",
    notes: "",
    consent_email: false,
    consent_sms: false,
    consent_call: false,
    consent_terms: false,
  })

  // Filter sub-services based on selected service
  const availableSubServices = formData.service_id
    ? subServices.filter(sub => sub.service_id === formData.service_id)
    : []

  const selectedService = services.find(s => s.id === formData.service_id)
  const selectedSubService = subServices.find(s => s.id === formData.sub_service_id)

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
    if (!formData.email.trim() || !formData.email_confirm.trim()) {
      toast({ variant: "destructive", title: "Email required", description: "Please enter your email address." })
      return false
    }
    if (formData.email !== formData.email_confirm) {
      toast({ variant: "destructive", title: "Email mismatch", description: "Email addresses do not match." })
      return false
    }
    if (!formData.phone.trim()) {
      toast({ variant: "destructive", title: "Phone required", description: "Please enter your phone number." })
      return false
    }
    if (!formData.street.trim() || !formData.city.trim() || !formData.state.trim() || !formData.zip.trim()) {
      toast({ variant: "destructive", title: "Address required", description: "Please complete your property address." })
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!formData.service_id) {
      toast({ variant: "destructive", title: "Service required", description: "Please select a service category." })
      return false
    }
    // Only require sub-service if available
    if (availableSubServices.length > 0 && !formData.sub_service_id) {
      toast({ variant: "destructive", title: "Specific service required", description: "Please select a specific service." })
      return false
    }
    if (!formData.timeline.trim()) {
      toast({ variant: "destructive", title: "Timeline required", description: "Please enter your project timeline." })
      return false
    }
    return true
  }

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
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

      // Prepare extra details
      const extraDetails: any = {
        attachments: imageFilePaths.length > 0 ? imageFilePaths : [],
        consent_email: formData.consent_email,
        consent_sms: formData.consent_sms,
        consent_call: formData.consent_call,
        consent_terms: formData.consent_terms
      }

      // Split name into first and last
      const nameParts = formData.name.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      // Insert lead - use sub_service_id if available, otherwise null
      const { error: insertError } = await supabase
        .from('leads')
        .insert({
          referral_id: referralLinkId,
          sub_service_id: formData.sub_service_id || null,
          homeowner_first: firstName,
          homeowner_last: lastName,
          homeowner_email: formData.email,
          homeowner_phone: formData.phone,
          address_street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          budget_estimate: formData.budget ? parseFloat(formData.budget) : null,
          timeline: formData.timeline,
          notes: formData.notes,
          extra_details: extraDetails,
          stage: 'submitted',
        })

      if (insertError) throw insertError

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
      <Card className="text-center py-12">
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle>
              {currentStep === 1 && "Contact Information"}
              {currentStep === 2 && "Project Details"}
              {currentStep === 3 && "Review & Submit"}
            </CardTitle>
            <CardDescription>
              Step {currentStep} of 3
            </CardDescription>
          </div>
          
          {/* Dark Mode Toggle */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            className="ml-4"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        {/* Progress Bar */}
        <div className="flex gap-2 mt-4">
          <div className={`h-2 flex-1 rounded ${currentStep >= 1 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`h-2 flex-1 rounded ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`h-2 flex-1 rounded ${currentStep >= 3 ? 'bg-primary' : 'bg-muted'}`} />
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Step 1: Contact Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Smith"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email_confirm">Confirm Email *</Label>
                    <Input
                      id="email_confirm"
                      type="email"
                      value={formData.email_confirm}
                      onChange={(e) => setFormData({ ...formData, email_confirm: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(503) 555-0123"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Property Address</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder="123 Main St"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Portland"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      maxLength={2}
                      placeholder="OR"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code *</Label>
                    <Input
                      id="zip"
                      maxLength={5}
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      placeholder="97201"
                    />
                  </div>
                </div>
              </div>

              <Button type="button" onClick={handleNext} className="w-full" size="lg">
                Next: Project Details
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 2: Project Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="service">Service Category *</Label>
                  <Select
                    value={formData.service_id}
                    onValueChange={(value) => setFormData({ ...formData, service_id: value, sub_service_id: "" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service category" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.service_id && availableSubServices.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="sub_service">Specific Service *</Label>
                    <Select
                      value={formData.sub_service_id}
                      onValueChange={(value) => setFormData({ ...formData, sub_service_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select specific service" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSubServices.map((subService) => (
                          <SelectItem key={subService.id} value={subService.id}>
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

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (Optional)</Label>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="5000"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeline">Timeline *</Label>
                    <Input
                      id="timeline"
                      placeholder="e.g., Within 2 weeks"
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    rows={4}
                    placeholder="Tell us more about your project..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-4">
                <h3 className="font-semibold">Photos (Optional)</h3>
                <p className="text-sm text-muted-foreground">
                  Upload up to 10 images (JPG, PNG, HEIC). Max 20 MB each.
                </p>
                
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <Label htmlFor="files" className="cursor-pointer">
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
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm truncate">{file.name}</span>
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

              <div className="flex gap-4">
                <Button type="button" onClick={handleBack} variant="outline" className="flex-1" size="lg">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button type="button" onClick={handleNext} className="flex-1" size="lg">
                  Review
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <h3 className="font-semibold">Contact Information</h3>
                  <div className="text-sm space-y-1">
                    <p><strong>Name:</strong> {formData.name}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Phone:</strong> {formData.phone}</p>
                    <p><strong>Address:</strong> {formData.street}, {formData.city}, {formData.state} {formData.zip}</p>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <h3 className="font-semibold">Project Details</h3>
                  <div className="text-sm space-y-1">
                    <p><strong>Service:</strong> {selectedService?.name}</p>
                    {selectedSubService && (
                      <p><strong>Specific Service:</strong> {selectedSubService.description || selectedSubService.name}</p>
                    )}
                    {formData.budget && <p><strong>Budget:</strong> ${formData.budget}</p>}
                    <p><strong>Timeline:</strong> {formData.timeline}</p>
                    {formData.notes && <p><strong>Notes:</strong> {formData.notes}</p>}
                    {files.length > 0 && <p><strong>Photos:</strong> {files.length} file(s) attached</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Communication Preferences</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="consent_email"
                      checked={formData.consent_email}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, consent_email: checked as boolean })
                      }
                    />
                    <Label htmlFor="consent_email" className="text-sm font-normal">
                      I agree to receive emails about my project
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="consent_sms"
                      checked={formData.consent_sms}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, consent_sms: checked as boolean })
                      }
                    />
                    <Label htmlFor="consent_sms" className="text-sm font-normal">
                      I agree to receive SMS updates about my project
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="consent_call"
                      checked={formData.consent_call}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, consent_call: checked as boolean })
                      }
                    />
                    <Label htmlFor="consent_call" className="text-sm font-normal">
                      I agree to receive phone calls about my project
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="consent_terms"
                      checked={formData.consent_terms}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, consent_terms: checked as boolean })
                      }
                      required
                    />
                    <Label htmlFor="consent_terms" className="text-sm font-normal">
                      I agree to the Terms and Conditions and Privacy Policy *
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="button" onClick={handleBack} variant="outline" className="flex-1" size="lg">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button type="submit" className="flex-1" size="lg" disabled={loading}>
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
