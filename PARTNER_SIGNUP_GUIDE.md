# Partner Signup & Dashboard - Implementation Guide

## What Was Implemented

### 1. **Simple Homepage** (`/`)
- Clean landing page with TradieBear branding
- Two buttons: "Login" and "Sign Up"
- Theme toggle in top-right corner

### 2. **Partner Signup Flow** (`/signup`)
- Complete registration form with validation:
  - Full Name (required)
  - Email + Email Confirmation (required)
  - Business Name (optional)
  - Phone (optional)
  - Password with strength requirements (required):
    - Minimum 8 characters
    - Must include: uppercase, lowercase, number, special character
  - Password confirmation (required)
  - Terms & Conditions checkbox (required)
  - TCPA marketing consent checkbox (required)
- Real-time password strength indicator
- Email verification required before login
- Success screen after signup directing user to check email

### 3. **Partner Dashboard** (`/dashboard`)
- **Stats Cards:**
  - Total Clicks (on referral link)
  - Total Leads (from referrals)
  - Pending Leads
  - Completed Leads
- **Referral Link Display:**
  - Prominent card showing unique referral URL
  - Copy button to clipboard
  - Open link in new tab button
  - Instructions on how to use the link
- **Leads Table:**
  - Shows all leads generated from partner's referral link
  - Displays: Name, Email, Service, Location, Status, Date
  - Empty state with helpful onboarding if no leads yet
- Clean header with logout and theme toggle

### 4. **Role-Based Authentication**
- **Login page** now routes based on role:
  - Admin → `/admin`
  - Partner → `/dashboard`
- **Middleware** protects routes appropriately
- Partners cannot access `/admin`
- Admins can still access `/admin` normally

### 5. **Admin Panel Integration**
- Admin panel now has "Referrals" tab showing all partner referral links
- Admins can view all links, clicks, and regenerate links
- Partners only see their own link (no regenerate button)

## Database Setup Required

Before testing, you MUST run the SQL setup in Supabase:

1. Go to **Supabase Dashboard** → **SQL Editor** → **New Query**
2. Copy and paste the entire contents of `/supabase-sql/referral-links-setup.sql`
3. Click **"Run"**

This sets up:
- `gen_referral_slug()` function for generating unique slugs
- RLS policies for referral_links table
- Performance indexes
- Auto-generation trigger (creates referral link when profile is created)
- `last_click_at` column for analytics

## How to Test

### Step 1: Setup Database
```sql
-- Run the entire supabase-sql/referral-links-setup.sql file in Supabase SQL Editor
```

### Step 2: Configure Email in Supabase
1. Go to **Supabase Dashboard** → **Authentication** → **Email Templates**
2. Find **"Confirm signup"** template
3. Verify the email template is active
4. The default template should work, but you can customize it

### Step 3: Test Partner Signup
1. Go to `https://tradiebear.com` (or `http://localhost:3000`)
2. Click **"Sign Up"**
3. Fill out the registration form:
   - Use a REAL email address you can access
   - Create a strong password (watch the requirements)
   - Check both consent boxes
4. Click **"Create Account"**
5. You'll see a success screen telling you to check your email

### Step 4: Verify Email
1. Check your inbox for Supabase verification email
2. Click the verification link in the email
3. You'll be redirected to `/auth/callback` then to `/dashboard`

### Step 5: Explore Partner Dashboard
1. You should now see your partner dashboard
2. Copy your unique referral link
3. Notice the stats (all zeros initially)

### Step 6: Test Referral Link
1. Open your referral link in a new incognito window
2. The click should be tracked
3. Fill out and submit the form
4. Go back to your dashboard and refresh
5. You should see:
   - Click count increased
   - New lead in the leads table

### Step 7: Test Admin Access
1. Log out from partner dashboard
2. Log in with your admin credentials (`joey5000@gmail.com`)
3. You should be redirected to `/admin`
4. Go to **"Referrals"** tab
5. You should see all partner referral links including the one you just created

## Environment Variables

Make sure these are set in **Vercel** (they should already be there):

```env
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=https://tradiebear.com
```

## Features Breakdown

### Referral Link Auto-Generation
- When a partner signs up, a Postgres trigger automatically generates their referral link
- Slug is based on their business name or full name
- If slug collision, adds random 4-digit suffix (e.g., `john-smith-1234`)

### Click Tracking with Bot Protection
- Tracks IP, User-Agent, UTM parameters, referer
- Rate limiting: Ignores duplicate clicks from same IP within 60 seconds
- Requires User-Agent header (blocks basic bots)
- Stores click events in `lead_events` table

### Email Verification
- Uses Supabase's built-in email verification
- Users must verify email before they can log in
- Verification link redirects to `/auth/callback?type=signup`
- Callback exchanges token for session and redirects to dashboard

### Password Security
- Enforces strong password requirements
- Real-time strength indicator as user types
- Client-side and server-side validation

## Known Limitations (MVP Scope)

1. **No partner self-service link regeneration** - Must contact admin
2. **No email notifications for admins** - Errors only in Vercel logs
3. **Basic bot detection** - Just User-Agent + rate limiting
4. **No custom slug selection** - Auto-generated from name
5. **No partner profile editing** - Coming in future iteration
6. **Simple lead display** - Full lead management in admin panel only

## Next Steps (Future Enhancements)

1. Partner profile editing page
2. Enhanced analytics dashboard for partners
3. Commission calculator/tracker
4. Email notifications (new lead, status changes)
5. Partner payout management
6. Advanced bot detection
7. Custom domain support for referral links
8. White-label options for partners
9. API access for partners
10. Mobile app for partner dashboard

## Troubleshooting

### Email Verification Not Working
- Check Supabase **Authentication** → **URL Configuration**
- Ensure redirect URLs include `https://tradiebear.com/auth/callback`
- Check Supabase email templates are enabled
- Look at Vercel function logs for errors

### Referral Link Not Generated
- Verify you ran the SQL setup script
- Check if trigger `on_profile_created` exists in Supabase
- Look for errors in Vercel function logs during signup
- Manually check `referral_links` table for the user

### Clicks Not Tracking
- Verify `lead_events` table exists
- Check browser console for errors
- Test in incognito mode (cookies might be blocked)
- Check Vercel function logs for tracking errors

### Login Not Working
- Verify email is confirmed in Supabase Auth Users table
- Check password meets requirements
- Look for RLS policy errors in Supabase logs
- Try password reset if needed

## Files Created/Modified

### New Files:
- `app/page.tsx` - Simple homepage
- `app/signup/page.tsx` - Partner signup form
- `app/signup/actions.ts` - Signup server action
- `app/dashboard/page.tsx` - Partner dashboard (server)
- `app/dashboard/partner-dashboard.tsx` - Partner dashboard UI (client)
- `app/admin/tabs/referral-links-tab.tsx` - Admin referral links tab
- `app/api/referral-links/generate/route.ts` - API for regenerating links
- `app/api/referral-links/me/route.ts` - API for fetching user's link
- `app/r/[slug]/actions.ts` - Click tracking server action
- `supabase-sql/referral-links-setup.sql` - Database setup script
- `PARTNER_SIGNUP_GUIDE.md` - This guide

### Modified Files:
- `types/database.ts` - Updated ReferralLink interface
- `middleware.ts` - Added /signup and /dashboard routes
- `app/login/page.tsx` - Role-based routing
- `app/admin/admin-dashboard.tsx` - Added Referrals tab
- `app/admin/page.tsx` - Fetch referral links data
- `app/r/[slug]/page.tsx` - Added click tracking
- `app/r/[slug]/referral-form.tsx` - Already had attribution (no changes needed)

## Support

If you encounter issues:
1. Check Vercel function logs
2. Check Supabase logs
3. Check browser console
4. Verify all environment variables are set
5. Ensure SQL setup script was run completely

---

**Implementation Date:** December 2025  
**Status:** Complete and ready for testing

