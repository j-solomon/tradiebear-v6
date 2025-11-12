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
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (for address autocomplete)

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

In Vercel project settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

**Google Maps API Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the following APIs:
   - **Places API** (for address autocomplete)
   - **Maps JavaScript API** (for maps display)
4. Go to Credentials → Create Credentials → API Key
5. Copy the API key and add it to Vercel environment variables
6. (Optional) Restrict the key to your domain for security

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
  click_count INT DEFAULT 0 NOT NULL,
  last_click_at TIMESTAMPTZ DEFAULT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
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
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view active services" ON services
  FOR SELECT USING (active = true);

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

#### 5. service_area_map (with Inheritance System)

**Note:** ZIP codes have been removed from the core service area structure for simplicity. Use the `geo_zips` table for ZIP-to-city lookup when needed.

```sql
-- Create area_type enum for inheritance
CREATE TYPE area_type AS ENUM (
  'service_default',           -- Service-level area (inherited by all sub-services)
  'sub_service_inclusion',     -- Area added to specific sub-service
  'sub_service_exclusion'      -- Area removed from specific sub-service
);

-- Create area_level enum to support mixed granularity
CREATE TYPE area_level AS ENUM (
  'city',                      -- City-level coverage
  'county',                    -- County-level coverage
  'state'                      -- State-level coverage
);

CREATE TABLE service_area_map (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  sub_service_id UUID REFERENCES sub_services(id) ON DELETE CASCADE,
  area_type area_type NOT NULL,
  area_level area_level NOT NULL DEFAULT 'city',
  state_code TEXT,
  state_id UUID REFERENCES states(id),
  county_id UUID REFERENCES counties(id),
  city_id UUID REFERENCES cities(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints for area_type logic
  CONSTRAINT area_type_service_check CHECK (
    (area_type = 'service_default' AND service_id IS NOT NULL AND sub_service_id IS NULL) OR
    (area_type != 'service_default')
  ),
  CONSTRAINT area_type_sub_service_check CHECK (
    (area_type IN ('sub_service_inclusion', 'sub_service_exclusion') AND sub_service_id IS NOT NULL) OR
    (area_type = 'service_default')
  )
);

-- Indexes
CREATE INDEX idx_service_area_map_service_id ON service_area_map(service_id);
CREATE INDEX idx_service_area_map_sub_service_id ON service_area_map(sub_service_id);
CREATE INDEX idx_service_area_map_area_type ON service_area_map(area_type);

-- Enable RLS
ALTER TABLE service_area_map ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view service areas" ON service_area_map
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage service areas" ON service_area_map
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Helper function to get effective service areas
CREATE OR REPLACE FUNCTION get_effective_service_areas(p_sub_service_id UUID)
RETURNS TABLE (
  id UUID,
  state_code TEXT,
  state_id UUID,
  county_id UUID,
  city_id UUID,
  area_level area_level,
  area_source TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH sub_service_info AS (
    SELECT service_id FROM sub_services WHERE id = p_sub_service_id
  ),
  service_areas AS (
    SELECT 
      sam.id, sam.state_code, sam.state_id,
      sam.county_id, sam.city_id, sam.area_level, 'inherited' as area_source
    FROM service_area_map sam
    CROSS JOIN sub_service_info ssi
    WHERE sam.service_id = ssi.service_id
      AND sam.area_type = 'service_default'
  ),
  exclusions AS (
    SELECT state_code, state_id, county_id, city_id
    FROM service_area_map
    WHERE sub_service_id = p_sub_service_id
      AND area_type = 'sub_service_exclusion'
  ),
  inclusions AS (
    SELECT 
      sam.id, sam.state_code, sam.state_id,
      sam.county_id, sam.city_id, sam.area_level, 'added' as area_source
    FROM service_area_map sam
    WHERE sam.sub_service_id = p_sub_service_id
      AND sam.area_type = 'sub_service_inclusion'
  )
  SELECT sa.* FROM service_areas sa
  WHERE NOT EXISTS (
    SELECT 1 FROM exclusions e
    WHERE COALESCE(e.state_code, '') = COALESCE(sa.state_code, '')
      AND COALESCE(e.state_id::text, '') = COALESCE(sa.state_id::text, '')
      AND COALESCE(e.county_id::text, '') = COALESCE(sa.county_id::text, '')
      AND COALESCE(e.city_id::text, '') = COALESCE(sa.city_id::text, '')
  )
  UNION ALL
  SELECT * FROM inclusions;
END;
$$ LANGUAGE plpgsql STABLE;
```

**Area Inheritance Model:**
- **Service-level areas** (`service_default`) are inherited by all sub-services
- **Sub-services can add** additional areas (`sub_service_inclusion`)
- **Sub-services can exclude** inherited areas (`sub_service_exclusion`)
- The `get_effective_service_areas()` function calculates the final area list

See [SERVICE_AREA_INHERITANCE.md](SERVICE_AREA_INHERITANCE.md) for detailed documentation and examples.

#### 6. service_commissions
```sql
CREATE TABLE service_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  sub_service_id UUID REFERENCES sub_services(id) ON DELETE CASCADE,
  percentage NUMERIC NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure either service_id OR sub_service_id is set (not both, not neither)
  CONSTRAINT commission_target_check CHECK (
    (service_id IS NOT NULL AND sub_service_id IS NULL) OR
    (service_id IS NULL AND sub_service_id IS NOT NULL)
  ),
  
  -- Prevent duplicate commissions for same service/sub-service
  CONSTRAINT unique_service_commission UNIQUE NULLS NOT DISTINCT (service_id, sub_service_id)
);

-- Indexes
CREATE INDEX idx_service_commissions_service_id ON service_commissions(service_id);
CREATE INDEX idx_service_commissions_sub_service_id ON service_commissions(sub_service_id);

-- Enable RLS
ALTER TABLE service_commissions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view service commissions" ON service_commissions
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage service commissions" ON service_commissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Helper function for commission inheritance
CREATE OR REPLACE FUNCTION get_commission_percentage(p_sub_service_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  v_percentage NUMERIC;
  v_service_id UUID;
BEGIN
  -- Try sub-service specific commission first
  SELECT percentage INTO v_percentage
  FROM service_commissions
  WHERE sub_service_id = p_sub_service_id;
  
  IF v_percentage IS NOT NULL THEN
    RETURN v_percentage;
  END IF;
  
  -- Fallback to service-level commission
  SELECT ss.service_id INTO v_service_id
  FROM sub_services ss
  WHERE ss.id = p_sub_service_id;
  
  IF v_service_id IS NOT NULL THEN
    SELECT percentage INTO v_percentage
    FROM service_commissions
    WHERE service_id = v_service_id;
  END IF;
  
  -- Return percentage or default 10%
  RETURN COALESCE(v_percentage, 10.0);
END;
$$ LANGUAGE plpgsql STABLE;
```

**Note:** The new `service_commissions` table replaces the old `commission_tiers` table. Commissions can now be set at both the service level (inherited by all sub-services) and the sub-service level (overrides parent). The `get_commission_percentage()` function handles the inheritance logic automatically.

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
INSERT INTO services (name, description, active) VALUES
('Plumbing', 'Residential and commercial plumbing services', true),
('Electrical', 'Licensed electrical work and repairs', true),
('HVAC', 'Heating, ventilation, and air conditioning', true),
('Roofing', 'Roof repair and replacement', true),
('Landscaping', 'Lawn care and landscape design', true),
('Painting', 'Interior and exterior painting', true);
```

#### Add Sample Service Commissions
```sql
-- Add default 10% commission for all services
INSERT INTO service_commissions (service_id, percentage)
SELECT id, 10.0
FROM services
WHERE active = true;

-- Optional: Set higher commission for specific sub-services
-- Example: 15% for emergency services
INSERT INTO service_commissions (sub_service_id, percentage)
SELECT id, 15.0
FROM sub_services
WHERE name ILIKE '%emergency%' OR name ILIKE '%urgent%';
```

**Note:** The commission system now uses service-level defaults with sub-service overrides. Run the migration SQL files in the `supabase-sql/` folder to set up the complete system.

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

