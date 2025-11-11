"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { User, Briefcase, FileText, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react"

interface FormData {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  
  // Project Details
  projectName: string
  projectType: string
  projectBudget: string
  
  // Additional Info
  additionalInfo: string[]
}

interface Step {
  id: string
  title: string
  icon: React.ElementType
  description: string
}

const steps: Step[] = [
  {
    id: "personal",
    title: "Personal Information",
    icon: User,
    description: "Tell us about yourself"
  },
  {
    id: "project",
    title: "Project Details",
    icon: Briefcase,
    description: "Tell us about your project"
  },
  {
    id: "additionalInfo",
    title: "Additional Info",
    icon: FileText,
    description: "Add optional project information"
  }
]

const additionalInfoOptions = [
  { id: "timeline", label: "Flexible timeline" },
  { id: "materials", label: "Need help choosing materials" },
  { id: "design", label: "Require design assistance" },
  { id: "permits", label: "Need help with permits" }
]

const projectTypes = [
  "Residential Remodel",
  "Commercial Build",
  "Renovation",
  "New Construction",
  "Repair & Maintenance"
]

const budgetRanges = [
  "Under $5,000",
  "$5,000 – $15,000",
  "$15,000 – $30,000",
  "$30,000 – $50,000",
  "$50,000+"
]

export default function MultiStepWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    projectName: "",
    projectType: "",
    projectBudget: "",
    additionalInfo: []
  })

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleAdditionalInfo = (id: string) => {
    setFormData(prev => ({
      ...prev,
      additionalInfo: prev.additionalInfo.includes(id)
        ? prev.additionalInfo.filter(item => item !== id)
        : [...prev.additionalInfo, id]
    }))
  }

  const validateStep = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0:
        if (!formData.firstName.trim()) {
          toast({
            variant: "destructive",
            title: "First name required",
            description: "Please enter your first name."
          })
          return false
        }
        if (!formData.lastName.trim()) {
          toast({
            variant: "destructive",
            title: "Last name required",
            description: "Please enter your last name."
          })
          return false
        }
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          toast({
            variant: "destructive",
            title: "Valid email required",
            description: "Please enter a valid email address."
          })
          return false
        }
        return true

      case 1:
        if (!formData.projectName.trim()) {
          toast({
            variant: "destructive",
            title: "Project name required",
            description: "Please enter your project name."
          })
          return false
        }
        if (!formData.projectType) {
          toast({
            variant: "destructive",
            title: "Project type required",
            description: "Please select a project type."
          })
          return false
        }
        if (!formData.projectBudget) {
          toast({
            variant: "destructive",
            title: "Project budget required",
            description: "Please select a budget range."
          })
          return false
        }
        return true

      case 2:
        if (formData.additionalInfo.length === 0) {
          toast({
            variant: "destructive",
            title: "Additional info required",
            description: "Please select at least one option."
          })
          return false
        }
        return true

      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === steps.length - 1) {
        handleSubmit()
      } else {
        setCurrentStep(prev => prev + 1)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = () => {
    console.log("Form submitted:", formData)
    setIsComplete(true)
    toast({
      title: "Success!",
      description: "Your information has been submitted successfully."
    })
  }

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      projectName: "",
      projectType: "",
      projectBudget: "",
      additionalInfo: []
    })
    setCurrentStep(0)
    setIsComplete(false)
  }

  if (isComplete) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-10 pb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">All Set!</h2>
              <p className="text-muted-foreground">
                Thank you for providing your information.
              </p>
            </div>

            <div className="bg-muted rounded-lg p-6 space-y-4 text-left">
              <h3 className="font-semibold text-lg">Summary</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-sm">{formData.firstName} {formData.lastName}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm">{formData.email}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Project Name</p>
                  <p className="text-sm">{formData.projectName}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Project Type</p>
                  <p className="text-sm">{formData.projectType}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Project Budget</p>
                  <p className="text-sm">{formData.projectBudget}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Additional Info</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.additionalInfo.map(id => {
                      const option = additionalInfoOptions.find(opt => opt.id === id)
                      return (
                        <span key={id} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md">
                          {option?.label}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            <Button onClick={handleReset} className="w-full">
              Start Over
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-2xl">Get Started</CardTitle>
          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              const isActive = index === currentStep
              const isCompleted = index < currentStep

              return (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all
                    ${isCompleted ? 'bg-primary text-primary-foreground' : ''}
                    ${isActive ? 'bg-primary text-primary-foreground' : ''}
                    ${!isActive && !isCompleted ? 'bg-muted text-muted-foreground' : ''}
                  `}>
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <span className={`
                    text-xs mt-2 hidden sm:block
                    ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}
                  `}>
                    {step.title}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <CardDescription className="mt-4">
          {steps[currentStep].description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Step 1: Personal Information */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      First name <span className="text-xs text-destructive">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => updateFormData("firstName", e.target.value)}
                      className="h-11"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      Last name <span className="text-xs text-destructive">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => updateFormData("lastName", e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email address <span className="text-xs text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="johndoe@example.com"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Project Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">
                    Project name <span className="text-xs text-destructive">*</span>
                  </Label>
                  <Input
                    id="projectName"
                    placeholder="Kitchen Renovation"
                    value={formData.projectName}
                    onChange={(e) => updateFormData("projectName", e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Project type <span className="text-xs text-destructive">*</span>
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {projectTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => updateFormData("projectType", type)}
                        className={`
                          relative p-4 rounded-lg border-2 text-left transition-all font-medium text-sm
                          ${formData.projectType === type
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-muted hover:border-primary/50'
                          }
                        `}
                      >
                        {type}
                        {formData.projectType === type && (
                          <CheckCircle2 className="absolute top-3 right-3 h-4 w-4" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>
                    Project budget <span className="text-xs text-destructive">*</span>
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {budgetRanges.map((range) => (
                      <button
                        key={range}
                        type="button"
                        onClick={() => updateFormData("projectBudget", range)}
                        className={`
                          relative p-4 rounded-lg border-2 text-center transition-all font-medium text-sm
                          ${formData.projectBudget === range
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-muted hover:border-primary/50'
                          }
                        `}
                      >
                        {range}
                        {formData.projectBudget === range && (
                          <CheckCircle2 className="absolute top-3 right-3 h-4 w-4" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Additional Info */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>
                    Additional information <span className="text-xs text-destructive">*</span>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Select all that apply to your project
                  </p>
                  
                  <div className="space-y-3">
                    {additionalInfoOptions.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center space-x-3 p-4 rounded-lg border border-muted hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => toggleAdditionalInfo(option.id)}
                      >
                        <Checkbox
                          id={option.id}
                          checked={formData.additionalInfo.includes(option.id)}
                          onCheckedChange={() => toggleAdditionalInfo(option.id)}
                          className="h-5 w-5"
                        />
                        <Label
                          htmlFor={option.id}
                          className="flex-1 cursor-pointer font-normal"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8">
          {currentStep > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="flex-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
          
          <Button
            type="button"
            onClick={handleNext}
            className="flex-1"
          >
            {currentStep === steps.length - 1 ? (
              <>
                Submit
                <CheckCircle2 className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

