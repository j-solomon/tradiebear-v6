-- ============================================================
-- Referral Links Feature - Database Setup
-- ============================================================
-- Run this entire file in Supabase SQL Editor to set up the referral links feature

-- ============================================================
-- 1. Helper Function for Cleaning Slug Parts
-- ============================================================
CREATE OR REPLACE FUNCTION clean_slug_part(input TEXT, max_len INT DEFAULT 15)
RETURNS TEXT AS $$
BEGIN
  RETURN substring(
    lower(regexp_replace(input, '[^a-zA-Z0-9-]', '', 'g')),
    1, 
    max_len
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================
-- 2. Slug Generator Function (Human-Friendly Version)
-- ============================================================
CREATE OR REPLACE FUNCTION gen_referral_slug(
  full_name TEXT, 
  business_name TEXT DEFAULT NULL, 
  email TEXT DEFAULT NULL
)
RETURNS text AS $$
DECLARE
  first_name TEXT;
  last_name TEXT;
  last_initial TEXT;
  business_short TEXT;
  email_prefix TEXT;
  name_parts TEXT[];
  candidate_slug TEXT;
  candidates TEXT[] := ARRAY[]::TEXT[];
  suffix INT;
BEGIN
  -- Extract first and last name from full_name
  IF full_name IS NOT NULL AND full_name != '' THEN
    name_parts := string_to_array(trim(full_name), ' ');
    first_name := clean_slug_part(name_parts[1], 15);
    
    IF array_length(name_parts, 1) > 1 THEN
      last_name := clean_slug_part(name_parts[array_length(name_parts, 1)], 15);
      last_initial := substring(last_name, 1, 1);
    END IF;
  END IF;

  -- Clean business name (shorten to key words)
  IF business_name IS NOT NULL AND business_name != '' THEN
    business_short := clean_slug_part(business_name, 15);
  END IF;

  -- Extract email prefix as fallback
  IF email IS NOT NULL AND email != '' THEN
    email_prefix := clean_slug_part(split_part(email, '@', 1), 15);
  END IF;

  -- Build candidate list in priority order
  -- 1. firstname-lastname (e.g., james-smith)
  IF first_name IS NOT NULL AND last_name IS NOT NULL THEN
    candidates := array_append(candidates, first_name || '-' || last_name);
  END IF;

  -- 2. firstname-business (e.g., james-dcmarketing)
  IF first_name IS NOT NULL AND business_short IS NOT NULL THEN
    candidates := array_append(candidates, first_name || '-' || business_short);
  END IF;

  -- 3. business-firstname (e.g., dcmarketing-james)
  IF business_short IS NOT NULL AND first_name IS NOT NULL THEN
    candidates := array_append(candidates, business_short || '-' || first_name);
  END IF;

  -- 4. businessname only (e.g., dcmarketing)
  IF business_short IS NOT NULL THEN
    candidates := array_append(candidates, business_short);
  END IF;

  -- 5. firstname-lastinitial (e.g., james-s)
  IF first_name IS NOT NULL AND last_initial IS NOT NULL THEN
    candidates := array_append(candidates, first_name || '-' || last_initial);
  END IF;

  -- 6. firstname only (e.g., james)
  IF first_name IS NOT NULL THEN
    candidates := array_append(candidates, first_name);
  END IF;

  -- 7. email prefix as last resort
  IF email_prefix IS NOT NULL THEN
    candidates := array_append(candidates, email_prefix);
  END IF;

  -- Try each candidate
  FOREACH candidate_slug IN ARRAY candidates
  LOOP
    -- Ensure max 30 characters
    candidate_slug := substring(candidate_slug, 1, 30);
    
    -- Check if available
    IF NOT EXISTS (SELECT 1 FROM referral_links WHERE slug = candidate_slug) THEN
      RETURN candidate_slug;
    END IF;
  END LOOP;

  -- If all candidates taken, use first candidate + random suffix
  IF array_length(candidates, 1) > 0 THEN
    candidate_slug := candidates[1];
  ELSE
    candidate_slug := 'user';
  END IF;

  -- Truncate to leave room for suffix
  candidate_slug := substring(candidate_slug, 1, 25);

  -- Add random 4-digit suffix until unique
  LOOP
    suffix := floor(random() * 9000 + 1000)::INT;
    candidate_slug := substring(candidate_slug, 1, 25) || '-' || suffix::TEXT;
    
    EXIT WHEN NOT EXISTS (SELECT 1 FROM referral_links WHERE slug = candidate_slug);
  END LOOP;

  RETURN candidate_slug;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 3. RLS Policies (Drop existing first, then recreate)
-- ============================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "partners_read_own_links" ON referral_links;
DROP POLICY IF EXISTS "admins_can_write_referral_links" ON referral_links;

-- Partners can read their own referral links
CREATE POLICY "partners_read_own_links" ON referral_links
  FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can write (insert/update/delete) referral links
CREATE POLICY "admins_can_write_referral_links" ON referral_links
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ============================================================
-- 4. Performance Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_referral_links_slug ON referral_links(slug);
CREATE INDEX IF NOT EXISTS idx_referral_links_user_id ON referral_links(user_id);

-- ============================================================
-- 5. Add columns for analytics and business tracking
-- ============================================================

ALTER TABLE referral_links
ADD COLUMN IF NOT EXISTS click_count INT DEFAULT 0 NOT NULL;

ALTER TABLE referral_links
ADD COLUMN IF NOT EXISTS last_click_at timestamptz DEFAULT NULL;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS business_name TEXT;

-- ============================================================
-- 6. Auto-Generation Trigger on Profile Creation
-- ============================================================

CREATE OR REPLACE FUNCTION create_referral_link_on_signup()
RETURNS trigger AS $$
BEGIN
  INSERT INTO referral_links (user_id, slug)
  VALUES (
    NEW.id, 
    gen_referral_slug(NEW.name, NEW.business_name, NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists, then recreate
DROP TRIGGER IF EXISTS on_profile_created ON profiles;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_referral_link_on_signup();

-- ============================================================
-- Done! Referral links will now auto-generate on account creation
-- ============================================================

