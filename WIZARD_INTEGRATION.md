# Multi-Step Wizard Integration Guide

## ✅ Integration Complete

The multi-step wizard component has been successfully integrated into your TradieBear-V6 codebase.

---

## 📋 What Was Done

### 1. ✅ Project Structure Verification
- **TypeScript**: Already configured
- **Tailwind CSS**: Already configured
- **shadcn/ui**: Already set up in `/components/ui`
- **lucide-react**: Already installed for icons

### 2. ✅ Dependencies Installed
```bash
npm install framer-motion
```

### 3. ✅ Component Created
- **Location**: `/components/ui/multi-step-wizard.tsx`
- **Features**:
  - 3-step wizard (Personal Information → Project Details → Additional Info)
  - Smooth animations with framer-motion
  - Form validation with toast notifications
  - Progress bar with visual step indicators
  - Responsive design (mobile-friendly)
  - Dark mode compatible
  - Completion summary view

### 4. ✅ Demo Page Created
- **Location**: `/app/wizard-demo/page.tsx`
- **URL**: `http://localhost:3000/wizard-demo`

---

## 🎯 Component Structure

### Step 1: Personal Information
- **Fields**:
  - First name (required)
  - Last name (required)
  - Email address (required, validated)
- **Validation**: All fields required, email format checked

### Step 2: Project Details
- **Fields**:
  - Project name (required, text input)
  - Project type (required, card selection)
    - Residential Remodel
    - Commercial Build
    - Renovation
    - New Construction
    - Repair & Maintenance
  - Project budget (required, card selection)
    - Under $5,000
    - $5,000 – $15,000
    - $15,000 – $30,000
    - $30,000 – $50,000
    - $50,000+
- **Validation**: All fields required

### Step 3: Additional Info
- **Fields**:
  - Additional information (checkboxes, at least one required)
    - Flexible timeline
    - Need help choosing materials
    - Require design assistance
    - Need help with permits
- **Validation**: At least one checkbox must be selected

---

## 🚀 Usage

### Basic Implementation

```tsx
import MultiStepWizard from "@/components/ui/multi-step-wizard"

export default function Page() {
  return (
    <div className="container py-10">
      <MultiStepWizard />
    </div>
  )
}
```

### With Custom Styling

```tsx
import MultiStepWizard from "@/components/ui/multi-step-wizard"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <MultiStepWizard />
    </div>
  )
}
```

---

## 🎨 Customization

### Modifying Steps

Edit `/components/ui/multi-step-wizard.tsx`:

```tsx
const steps: Step[] = [
  {
    id: "personal",
    title: "Your Custom Title",
    icon: YourIcon, // from lucide-react
    description: "Your custom description"
  },
  // ... more steps
]
```

### Adding/Removing Fields

1. **Update FormData interface**:
```tsx
interface FormData {
  firstName: string
  lastName: string
  email: string
  yourNewField: string  // Add your field
  // ...
}
```

2. **Update initial state**:
```tsx
const [formData, setFormData] = useState<FormData>({
  firstName: "",
  // ...
  yourNewField: "",  // Initialize your field
})
```

3. **Add validation**:
```tsx
const validateStep = (stepIndex: number): boolean => {
  switch (stepIndex) {
    case 0:
      if (!formData.yourNewField) {
        toast({ /* validation error */ })
        return false
      }
      // ...
  }
}
```

4. **Add UI elements**:
```tsx
{currentStep === 0 && (
  <div className="space-y-4">
    {/* Existing fields */}
    
    <div className="space-y-2">
      <Label htmlFor="yourNewField">
        Your Field Label <span className="text-xs text-destructive">*</span>
      </Label>
      <Input
        id="yourNewField"
        value={formData.yourNewField}
        onChange={(e) => updateFormData("yourNewField", e.target.value)}
      />
    </div>
  </div>
)}
```

### Changing Project Types or Budget Ranges

```tsx
const projectTypes = [
  "Your Custom Type 1",
  "Your Custom Type 2",
  // ...
]

const budgetRanges = [
  "Your Custom Range 1",
  "Your Custom Range 2",
  // ...
]
```

### Changing Additional Info Options

```tsx
const additionalInfoOptions = [
  { id: "custom1", label: "Your Custom Option 1" },
  { id: "custom2", label: "Your Custom Option 2" },
  // ...
]
```

---

## 🎯 Integration Points

### Backend Integration

To submit data to your backend, modify the `handleSubmit` function:

```tsx
const handleSubmit = async () => {
  try {
    const response = await fetch('/api/your-endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    
    if (!response.ok) throw new Error('Submission failed')
    
    setIsComplete(true)
    toast({
      title: "Success!",
      description: "Your information has been submitted."
    })
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to submit. Please try again."
    })
  }
}
```

### Supabase Integration

```tsx
import { createClient } from '@/lib/supabase/client'

const handleSubmit = async () => {
  const supabase = createClient()
  
  try {
    const { error } = await supabase
      .from('wizard_submissions')
      .insert({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        project_name: formData.projectName,
        project_type: formData.projectType,
        project_budget: formData.projectBudget,
        additional_info: formData.additionalInfo,
        created_at: new Date().toISOString()
      })
    
    if (error) throw error
    
    setIsComplete(true)
    toast({ title: "Success!", description: "Submitted successfully." })
  } catch (error) {
    console.error(error)
    toast({ variant: "destructive", title: "Error", description: "Submission failed." })
  }
}
```

---

## 🎨 Theming

The component automatically supports dark mode through your existing theme configuration. It uses:

- `bg-background` / `bg-muted` for backgrounds
- `text-foreground` / `text-muted-foreground` for text
- `border-primary` / `bg-primary` for active states
- shadcn/ui color system

---

## 📱 Responsive Design

The wizard is fully responsive:
- **Mobile**: Single column layout, stacked buttons
- **Tablet**: Adaptive grid for cards (2 columns)
- **Desktop**: Full layout with side-by-side elements

---

## 🧪 Testing

### View the Demo
```bash
npm run dev
```
Then navigate to: `http://localhost:3000/wizard-demo`

### Test Each Step
1. Fill out Personal Information → Click "Next"
2. Select Project Details → Click "Next"
3. Check Additional Info options → Click "Submit"
4. View completion summary

---

## 🔧 Troubleshooting

### Animations not working
- Ensure `framer-motion` is installed: `npm list framer-motion`
- Check that `use client` directive is at the top of the file

### Toast notifications not appearing
- Ensure Toaster is in your root layout:
```tsx
// app/layout.tsx
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```

### Validation not working
- Check browser console for errors
- Ensure `validateStep` function covers all required fields
- Verify toast notifications are configured correctly

---

## 📦 Component Props (Future Enhancement)

To make the component more reusable, you can convert it to accept props:

```tsx
interface MultiStepWizardProps {
  onComplete?: (data: FormData) => void
  onStepChange?: (step: number) => void
  initialData?: Partial<FormData>
  customSteps?: Step[]
}

export default function MultiStepWizard({
  onComplete,
  onStepChange,
  initialData,
  customSteps
}: MultiStepWizardProps) {
  // Implementation with props
}
```

---

## 🎯 Next Steps

1. **Customize the fields** to match your specific needs
2. **Integrate with your backend** (see Backend Integration section)
3. **Add additional validation** as needed
4. **Style to match your brand** (colors, spacing, etc.)
5. **Add analytics** to track completion rates
6. **Consider saving progress** to local storage or backend

---

## 📝 License

This component integrates with your existing TradieBear-V6 project and follows the same license.

---

## 🙋 Questions?

For customization help or issues, refer to:
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Framer Motion Documentation](https://www.framer.com/motion)
- [Tailwind CSS Documentation](https://tailwindcss.com)

