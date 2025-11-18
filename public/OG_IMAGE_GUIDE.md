# Open Graph Image Setup Guide

## What You Need

Create an Open Graph image for social media sharing (Facebook, Twitter, LinkedIn, etc.)

## Image Specifications

- **Dimensions:** 1200 x 630 pixels
- **Format:** PNG or JPEG
- **File size:** Under 1MB
- **File name:** `og-image.png` or `og-image.jpg`
- **Location:** `/public/` directory

## Design Recommendations

### Content to Include:
1. **TradieBear Logo** (top left)
2. **Main Headline:** "Earn Commissions on Every Referral"
3. **Subheadline:** Brief value proposition
4. **Background:** Use brand cream color (#FFFAF0)
5. **Accent Color:** Brand orange (#FF6B35)
6. **URL:** tradiebear.com (bottom)

### Design Tips:
- Keep text large and readable (social platforms often crop)
- Use high contrast colors
- Center important content (avoid edges)
- Test on mobile preview
- Include TradieBear branding clearly

## Free Design Tools

1. **Canva** - https://canva.com
   - Use "Facebook Post" template (1200x630)
   - Drag and drop design
   
2. **Figma** - https://figma.com
   - Create 1200x630 frame
   - Export as PNG

3. **Adobe Express** - https://express.adobe.com
   - Social media post templates

## Implementation

Once you have your image:

1. Save it as `/public/og-image.png`
2. The image is already configured in `app/page.tsx`:
   ```typescript
   openGraph: {
     images: ['/og-image.png'],
   }
   ```
3. Test using:
   - Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
   - Twitter Card Validator: https://cards-dev.twitter.com/validator
   - LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

## Current Status

⚠️ **No OG image yet** - Using default metadata

To add the image:
1. Create the image following specs above
2. Save as `/public/og-image.png`
3. Deploy to Vercel
4. Verify with social media debugging tools

## Example OG Image Layout

```
┌─────────────────────────────────────────┐
│ 🐻 TradieBear                           │
│                                         │
│                                         │
│     Earn Commissions on Every Referral │
│                                         │
│     Track leads from submission to      │
│     commission across all home services │
│                                         │
│                                         │
│     tradiebear.com                      │
└─────────────────────────────────────────┘
```

## Testing Checklist

After adding image:
- [ ] Image displays in Facebook link preview
- [ ] Image displays in Twitter card
- [ ] Image displays in LinkedIn share
- [ ] Image loads fast (under 1MB)
- [ ] Text is readable on mobile
- [ ] Branding is clear and professional

