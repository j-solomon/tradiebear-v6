-- ============================================
-- FIX: Prevent Orphaned Profiles
-- ============================================
-- This script adds constraints and safety measures to prevent
-- profiles from being created with missing or invalid data.
--
-- Run this in Supabase SQL Editor.
-- ============================================

-- 1. Make 'name' column NOT NULL to enforce required data
-- Note: Before running this, ensure all existing profiles have a name
ALTER TABLE profiles 
ALTER COLUMN name SET NOT NULL;

-- 2. Update the trigger to handle edge cases gracefully
-- This ensures the referral link is only created when we have valid data
CREATE OR REPLACE FUNCTION create_referral_link_on_signup()
RETURNS trigger AS $$
BEGIN
  -- Only create referral link if name is provided (safety check)
  IF NEW.name IS NOT NULL AND NEW.name != '' THEN
    INSERT INTO referral_links (user_id, slug)
    VALUES (
      NEW.id, 
      gen_referral_slug(NEW.name, NEW.business_name, NEW.email)
    );
  ELSE
    -- Log warning but don't fail the insert
    RAISE WARNING 'Skipped referral link creation for user % due to missing name', NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Add a check constraint to ensure handle is not empty
-- This prevents empty strings from being stored
ALTER TABLE profiles
ADD CONSTRAINT profiles_handle_not_empty 
CHECK (handle IS NOT NULL AND handle != '');

-- 4. Add a check constraint to ensure name is not just whitespace
ALTER TABLE profiles
ADD CONSTRAINT profiles_name_not_empty 
CHECK (name IS NOT NULL AND trim(name) != '');

-- ============================================
-- Verification Query
-- ============================================
-- Run this to verify the constraints are in place:
/*
SELECT 
  conname AS constraint_name,
  contype AS constraint_type,
  pg_get_constraintdef(c.oid) AS definition
FROM pg_constraint AS c
WHERE c.conrelid = 'profiles'::regclass
  AND conname LIKE '%name%' OR conname LIKE '%handle%'
ORDER BY conname;
*/

