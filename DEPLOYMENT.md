# Deployment Guide for TradieBear V6

## Prerequisites

Before deploying, ensure you have:

1. **Supabase Project Set Up**
   - All required tables created
   - Storage bucket `lead-attachments` configured (public access)
   - At least one admin user in the `profiles` table

2. **Environment Variables Ready**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## Deployment to Vercel

### Step 1: Push to Git

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `next build`
   - **Output Directory**: `.next`

### Step 3: Add Environment Variables

In Vercel project settings, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Step 4: Deploy

Click "Deploy" and wait for the build to complete.

## Supabase Setup Checklist

### Required Tables

#### 1. profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'partner', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

#### 2. referral_links
```sql
CREATE TABLE referral_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE referral_links ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view active referral links" ON referral_links
  FOR SELECT USING (is_active = true);

CREATE POLICY "Partners can view own links" ON referral_links
  FOR SELECT USING (auth.uid() = user_id);
```

#### 3. services
```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view active services" ON services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage services" ON services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

#### 4. leads
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_link_id UUID NOT NULL REFERENCES referral_links(id),
  service_id UUID NOT NULL REFERENCES services(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  budget NUMERIC,
  timeline TEXT,
  notes TEXT,
  attachments TEXT[],
  consent_email BOOLEAN DEFAULT false,
  consent_sms BOOLEAN DEFAULT false,
  consent_call BOOLEAN DEFAULT false,
  stage TEXT DEFAULT 'new' CHECK (stage IN ('new', 'contacted', 'qualified', 'quoted', 'won', 'lost')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can insert leads" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all leads" ON leads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Partners can view their referred leads" ON leads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM referral_links
      WHERE referral_links.id = leads.referral_link_id
      AND referral_links.user_id = auth.uid()
    )
  );
```

#### 5. service_areas
```sql
CREATE TABLE service_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state TEXT,
  county TEXT,
  city TEXT,
  zip TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view service areas" ON service_areas
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage service areas" ON service_areas
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

#### 6. commission_tiers
```sql
CREATE TABLE commission_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  min_amount NUMERIC NOT NULL,
  max_amount NUMERIC,
  percentage NUMERIC NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE commission_tiers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view commission tiers" ON commission_tiers
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage commission tiers" ON commission_tiers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

#### 7. support_tickets
```sql
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own tickets" ON support_tickets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all tickets" ON support_tickets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Storage Setup

1. Create bucket `lead-attachments`:
   ```sql
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('lead-attachments', 'lead-attachments', true);
   ```

2. Set storage policies:
   ```sql
   -- Allow anyone to upload
   CREATE POLICY "Anyone can upload lead attachments"
   ON storage.objects FOR INSERT
   WITH CHECK (bucket_id = 'lead-attachments');

   -- Allow anyone to view
   CREATE POLICY "Anyone can view lead attachments"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'lead-attachments');
   ```

### Seed Data

#### Create Admin User
```sql
-- First, sign up through Supabase Auth UI or API
-- Then update the profile:
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-admin-email@example.com';
```

#### Add Sample Services
```sql
INSERT INTO services (name, description, is_active) VALUES
('Plumbing', 'Residential and commercial plumbing services', true),
('Electrical', 'Licensed electrical work and repairs', true),
('HVAC', 'Heating, ventilation, and air conditioning', true),
('Roofing', 'Roof repair and replacement', true),
('Landscaping', 'Lawn care and landscape design', true),
('Painting', 'Interior and exterior painting', true);
```

#### Add Sample Commission Tiers
```sql
INSERT INTO commission_tiers (min_amount, max_amount, percentage) VALUES
(0, 5000, 10.0),
(5001, 15000, 12.5),
(15001, 50000, 15.0),
(50001, NULL, 20.0);
```

## Post-Deployment

### 1. Verify Deployment
- Visit your Vercel URL
- Try logging in with admin credentials
- Test creating a lead through a referral link

### 2. Configure Custom Domain (Optional)
- Add domain in Vercel project settings
- Update DNS records as instructed

### 3. Monitor
- Check Vercel logs for any errors
- Monitor Supabase dashboard for database activity

## Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Verify all dependencies are in package.json
- Review build logs in Vercel

### Authentication Issues
- Verify Supabase URL and keys are correct
- Check that admin user exists with proper role
- Ensure RLS policies are correctly configured

### 404 on Referral Links
- Verify referral link exists in database
- Check `is_active` is true
- Ensure middleware is not blocking the route

## Security Checklist

- ✅ Environment variables are set in Vercel (not in code)
- ✅ Supabase RLS is enabled on all tables
- ✅ Service role key is only used server-side
- ✅ File upload size limits are enforced
- ✅ Email validation on forms
- ✅ HTTPS only (Vercel default)

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review Supabase logs
3. Verify environment variables
4. Check browser console for client-side errors

---

**Ready to deploy?** Follow the steps above and your TradieBear app will be live! 🚀

