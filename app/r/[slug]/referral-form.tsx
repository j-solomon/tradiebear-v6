"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Upload, CheckCircle2, Loader2 } from "lucide-react"

interface Service {
  id: string
  name: string
}

interface ReferralFormProps {
  referralLinkId: string
  services: Service[]
}

export default function ReferralForm({ referralLinkId, services }: ReferralFormProps) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const { toast } = useToast()

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
    budget: "",
    timeline: "",
    notes: "",
    consent_email: false,
    consent_sms: false,
    consent_call: false,
    consent_terms: false,
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      
      // Validate file count
      if (files.length + newFiles.length > 10) {
        toast({
          variant: "destructive",
          title: "Too many files",
          description: "You can upload a maximum of 10 images.",
        })
        return
      }

      // Validate file sizes (20 MB per file)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validation
    if (formData.email !== formData.email_confirm) {
      toast({
        variant: "destructive",
        title: "Email mismatch",
        description: "Email addresses do not match.",
      })
      setLoading(false)
      return
    }

    if (!formData.consent_terms) {
      toast({
        variant: "destructive",
        title: "Terms required",
        description: "You must accept the terms and conditions.",
      })
      setLoading(false)
      return
    }

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
          
          // Store just the file path, not a public URL
          // Signed URLs will be generated when needed
          imageFilePaths.push(fileName)
        }
      }

      // Prepare extra details with attachments and consent info
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

      // Insert lead
      const { error: insertError } = await supabase
        .from('leads')
        .insert({
          referral_id: referralLinkId,
          sub_service_id: formData.service_id,
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
        <CardTitle>Request Information</CardTitle>
        <CardDescription>
          Fill out the form below to get your free estimate. All fields marked with * are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email_confirm">Confirm Email Address *</Label>
              <Input
                id="email_confirm"
                type="email"
                required
                value={formData.email_confirm}
                onChange={(e) => setFormData({ ...formData, email_confirm: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          {/* Property Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Property Address</h3>
            
            <div className="space-y-2">
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                required
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  required
                  maxLength={2}
                  placeholder="CA"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code *</Label>
                <Input
                  id="zip"
                  required
                  maxLength={5}
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Project Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="service">Service Type *</Label>
              <Select
                required
                value={formData.service_id}
                onValueChange={(value) => setFormData({ ...formData, service_id: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
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

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (Optional)</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="5000"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline *</Label>
                <Input
                  id="timeline"
                  required
                  placeholder="e.g., Within 2 weeks"
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  disabled={loading}
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
                disabled={loading}
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Photos (Optional)</h3>
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
                disabled={loading}
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
                      disabled={loading}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Consent */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Communication Preferences</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consent_email"
                  checked={formData.consent_email}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, consent_email: checked as boolean })
                  }
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                  required
                />
                <Label htmlFor="consent_terms" className="text-sm font-normal">
                  I agree to the Terms and Conditions and Privacy Policy *
                </Label>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Request"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

