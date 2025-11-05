-- ============================================================
-- Referral Links Feature - Database Setup
-- ============================================================
-- Run this entire file in Supabase SQL Editor to set up the referral links feature

-- ============================================================
-- 1. Slug Generator Function
-- ============================================================
CREATE OR REPLACE FUNCTION gen_referral_slug(base_handle text)
RETURNS text AS $$
DECLARE
  clean_handle text;
  candidate_slug text;
  suffix int := 0;
BEGIN
  -- Clean handle: lowercase, alphanumeric + hyphens only
  clean_handle := lower(regexp_replace(base_handle, '[^a-zA-Z0-9-]', '', 'g'));
  clean_handle := substring(clean_handle from 1 for 20);
  
  -- Try base slug first
  candidate_slug := clean_handle;
  
  -- Add random suffix if collision
  WHILE EXISTS (SELECT 1 FROM referral_links WHERE slug = candidate_slug) LOOP
    suffix := floor(random() * 9000 + 1000)::int;
    candidate_slug := clean_handle || '-' || suffix;
  END LOOP;
  
  RETURN candidate_slug;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 2. RLS Policies
-- ============================================================

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
-- 3. Performance Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_referral_links_slug ON referral_links(slug);
CREATE INDEX IF NOT EXISTS idx_referral_links_user_id ON referral_links(user_id);

-- ============================================================
-- 4. Add last_click_at column for analytics
-- ============================================================

ALTER TABLE referral_links
ADD COLUMN IF NOT EXISTS last_click_at timestamptz DEFAULT NULL;

-- ============================================================
-- 5. Auto-Generation Trigger on Profile Creation
-- ============================================================

CREATE OR REPLACE FUNCTION create_referral_link_on_signup()
RETURNS trigger AS $$
BEGIN
  INSERT INTO referral_links (user_id, slug)
  VALUES (NEW.id, gen_referral_slug(COALESCE(NEW.handle, NEW.email)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_referral_link_on_signup();

-- ============================================================
-- Done! Referral links will now auto-generate on account creation
-- ============================================================

