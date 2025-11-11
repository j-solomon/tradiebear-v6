import MultiStepWizard from "@/components/ui/multi-step-wizard"

export default function WizardDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="container mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Multi-Step Wizard Demo</h1>
          <p className="text-muted-foreground">
            A beautiful onboarding experience for your users
          </p>
        </div>

        <MultiStepWizard />
      </div>
    </div>
  )
}

