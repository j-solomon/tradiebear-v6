"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import { Loader2, CheckCircle2, X, Check } from "lucide-react"
import { signupPartner } from "./actions"

export default function SignupPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    email_confirm: "",
    business_name: "",
    phone: "",
    password: "",
    password_confirm: "",
    terms: false,
    marketing_consent: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Password validation rules
  const passwordRules = {
    minLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  }

  const isPasswordValid = Object.values(passwordRules).every(Boolean)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (formData.email !== formData.email_confirm) {
      toast({
        variant: "destructive",
        title: "Email mismatch",
        description: "Email addresses do not match.",
      })
      return
    }

    if (formData.password !== formData.password_confirm) {
      toast({
        variant: "destructive",
        title: "Password mismatch",
        description: "Passwords do not match.",
      })
      return
    }

    if (!isPasswordValid) {
      toast({
        variant: "destructive",
        title: "Weak password",
        description: "Please meet all password requirements.",
      })
      return
    }

    if (!formData.terms) {
      toast({
        variant: "destructive",
        title: "Terms required",
        description: "You must accept the terms and conditions.",
      })
      return
    }

    setLoading(true)

    try {
      const result = await signupPartner({
        name: formData.name,
        email: formData.email,
        business_name: formData.business_name,
        phone: formData.phone,
        password: formData.password,
        marketing_consent: formData.marketing_consent,
      })

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Signup failed",
          description: result.error,
        })
        setLoading(false)
        return
      }

      setSuccess(true)
      toast({
        title: "Success!",
        description: "Check your email to verify your account.",
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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold">Check Your Email</h2>
            <p className="text-muted-foreground">
              We&apos;ve sent a verification link to <strong>{formData.email}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Click the link in the email to verify your account and start tracking your referrals.
            </p>
            <div className="pt-4">
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Back to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Create Partner Account</CardTitle>
          <CardDescription>
            Sign up to get your unique referral link and start tracking leads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={loading}
                  placeholder="John Smith"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={loading}
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
                    required
                    disabled={loading}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business_name">Business Name</Label>
                  <Input
                    id="business_name"
                    type="text"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    disabled={loading}
                    placeholder="Optional"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={loading}
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Password</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_confirm">Confirm Password *</Label>
                  <Input
                    id="password_confirm"
                    type={showPassword ? "text" : "password"}
                    value={formData.password_confirm}
                    onChange={(e) => setFormData({ ...formData, password_confirm: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show_password"
                  checked={showPassword}
                  onCheckedChange={(checked) => setShowPassword(checked as boolean)}
                />
                <label
                  htmlFor="show_password"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Show passwords
                </label>
              </div>

              {/* Password Requirements */}
              {formData.password && (
                <div className="bg-muted p-4 rounded-md space-y-2">
                  <p className="text-sm font-medium">Password requirements:</p>
                  <div className="space-y-1">
                    <PasswordRequirement met={passwordRules.minLength} text="At least 8 characters" />
                    <PasswordRequirement met={passwordRules.hasUppercase} text="One uppercase letter" />
                    <PasswordRequirement met={passwordRules.hasLowercase} text="One lowercase letter" />
                    <PasswordRequirement met={passwordRules.hasNumber} text="One number" />
                    <PasswordRequirement met={passwordRules.hasSpecial} text="One special character (!@#$%^&*)" />
                  </div>
                </div>
              )}
            </div>

            {/* Terms and Consent */}
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.terms}
                  onCheckedChange={(checked) => setFormData({ ...formData, terms: checked as boolean })}
                  disabled={loading}
                />
                <label
                  htmlFor="terms"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the <Link href="/terms" className="text-primary underline">Terms and Conditions</Link> and <Link href="/privacy" className="text-primary underline">Privacy Policy</Link> *
                </label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="marketing"
                  checked={formData.marketing_consent}
                  onCheckedChange={(checked) => setFormData({ ...formData, marketing_consent: checked as boolean })}
                  disabled={loading}
                />
                <label
                  htmlFor="marketing"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I consent to receive marketing communications via email and SMS (TCPA Compliance)
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {met ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-muted-foreground" />
      )}
      <span className={met ? "text-green-600 dark:text-green-500" : "text-muted-foreground"}>
        {text}
      </span>
    </div>
  )
}

