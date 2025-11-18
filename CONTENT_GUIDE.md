# Content Management Guide

This guide explains where and how to update content on the TradieBear landing page.

## 📍 Content Locations

### Hero Section
**File:** `components/landing/hero.tsx`

**What to update:**
- Main headline (line 14)
- Subheadline (line 20)
- Description text (line 25)
- CTA button text (lines 33 & 41)

**Example:**
```typescript
<h1>
  Earn Commissions for Connecting Homeowners with{' '}
  <span className="text-brand-orange">Trusted Contractors</span>
</h1>
```

---

### FAQ Questions & Answers
**File:** `lib/landing-data.ts`

**Location:** `faqData` array (starts at line 18)

**How to update:**
1. Find the `faqData` array
2. Add, edit, or remove objects with `question` and `answer` properties
3. Save the file

**Example:**
```typescript
{
  question: "Your new question here?",
  answer: "Your detailed answer here."
}
```

---

### Service Icon Mapping
**File:** `lib/landing-data.ts`

**Location:** `serviceIconMap` object (starts at line 90)

**How to add a new service:**
1. Import the icon from `lucide-react`
2. Add entry to `serviceIconMap`
3. Use service name (lowercase) as key

**Example:**
```typescript
import { NewIcon } from 'lucide-react'

export const serviceIconMap: Record<string, LucideIcon> = {
  'your service name': NewIcon,
  // ... other services
}
```

---

### How It Works Steps
**File:** `lib/landing-data.ts`

**Location:** `howItWorksSteps` array (starts at line 61)

**Format:**
```typescript
{
  number: 1,
  title: "Step Title",
  description: "Step description"
}
```

---

### Target Persona Cards
**File:** `lib/landing-data.ts`

**Location:** `personaData` array (starts at line 79)

**Format:**
```typescript
{
  title: "Persona Name",
  icon: IconName, // from lucide-react
  points: [
    "Benefit 1",
    "Benefit 2",
    "Benefit 3",
    "Benefit 4"
  ]
}
```

---

### Comparison Section
**File:** `lib/landing-data.ts`

**Locations:**
- `traditionalWayPoints` array (line 55)
- `tradiebearWayPoints` array (line 57)

**How to update:**
- Edit the strings in either array
- Each entry becomes a bullet point

---

### CTA Button Text
**Multiple locations:**

1. **Hero Section** - `components/landing/hero.tsx`
   - "Start Earning Today" (line 33)
   - "See How It Works" (line 38)

2. **Final CTA** - `components/landing/final-cta.tsx`
   - "Create Free Account" (line 20)
   - Supporting text (line 27)

3. **Navigation** - `components/landing/navigation.tsx`
   - "Get Started" (lines 44 & 82)
   - "Dashboard" (lines 40 & 76)

---

### Footer Links & Description
**File:** `components/landing/footer.tsx`

**What to update:**
- Company description (lines 12-15)
- Quick Links (lines 21-36)
- Legal links (lines 42-52)
- Copyright year (line 60)
- Tagline (line 61)

---

### Meta Tags & SEO
**File:** `app/page.tsx`

**Location:** `metadata` object (starts at line 14)

**What to update:**
- Page title
- Description
- Open Graph data
- URL

---

### Why TradieBear Features
**File:** `components/landing/why-tradiebear.tsx`

**Location:** `features` array (starts at line 4)

**Format:**
```typescript
{
  icon: IconName, // Clock, Users, Zap
  title: "Feature Title",
  description: "Feature description"
}
```

---

## 🎨 Brand Colors

All brand colors are defined in `tailwind.config.ts`:

```typescript
'brand-orange': '#FF6B35',          // Primary CTA color
'brand-orange-light': '#FF8C42',    // Hover states
'brand-charcoal': '#2B2D33',        // Footer/dark sections
'brand-cream': '#FFFAF0',           // Hero background
'brand-green-bg': '#D1F2EB',        // Success card background
'brand-red-bg': '#F8D7DA',          // Traditional card background
```

**To change colors:**
1. Edit values in `tailwind.config.ts`
2. Restart dev server

---

## 📝 Content Best Practices

### Headlines
- Keep under 60 characters for mobile
- Use action words ("Earn", "Connect", "Track")
- Highlight the main benefit

### Descriptions
- 2-3 short sentences max
- Focus on the problem you solve
- Use concrete numbers when possible

### CTA Buttons
- Use action verbs ("Start", "Create", "Get")
- Keep to 3-4 words
- Be specific ("Start Earning Today" not just "Sign Up")

### FAQ
- Start with most common questions
- Keep answers to 2-3 sentences
- Link to more detailed docs when needed

---

## 🔧 Quick Updates Checklist

Before updating content:
- [ ] Backup current file
- [ ] Keep formatting/indentation consistent
- [ ] Test on mobile after changes
- [ ] Check for typos
- [ ] Verify all links work

After updating:
- [ ] Run `npm run build` to check for errors
- [ ] Test locally with `npm run dev`
- [ ] Deploy to Vercel
- [ ] Check live site in incognito mode

---

## 🆘 Need Help?

**TypeScript errors?**
- Make sure strings are in quotes
- Check for missing commas
- Verify object structure matches examples

**Layout broken?**
- Don't change className attributes
- Keep JSX structure intact
- Only modify text content

**Icons not showing?**
- Check icon is imported at top of file
- Verify icon name matches import
- Icons come from `lucide-react` library

---

## 📞 Support

For technical issues or questions:
- Email: dev@tradiebear.com
- Check: `/components/landing/` for all sections
- Check: `/lib/landing-data.ts` for all content arrays

