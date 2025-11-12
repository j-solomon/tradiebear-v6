-- =====================================================
-- MIGRATION: Remove ZIP Codes from Service Areas
-- Simplify service_area_map by removing ZIP codes
-- Date: 2025-11-13
-- =====================================================

-- Step 1: Create area_level enum
DO $$ BEGIN
  CREATE TYPE area_level AS ENUM ('city', 'county', 'state');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Step 2: Add area_level column to service_area_map
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'service_area_map' AND column_name = 'area_level') THEN
    ALTER TABLE service_area_map ADD COLUMN area_level area_level DEFAULT 'city';
  END IF;
END $$;

-- Step 3: Set area_level for existing entries
-- All existing entries are city-level since they have city_id
UPDATE service_area_map 
SET area_level = 'city'
WHERE area_level IS NULL AND city_id IS NOT NULL;

-- Set area_level for county-level entries
UPDATE service_area_map 
SET area_level = 'county'
WHERE area_level IS NULL AND county_id IS NOT NULL AND city_id IS NULL;

-- Set area_level for state-level entries
UPDATE service_area_map 
SET area_level = 'state'
WHERE area_level IS NULL AND state_code IS NOT NULL AND county_id IS NULL AND city_id IS NULL;

-- Step 4: Make area_level NOT NULL now that data is migrated
ALTER TABLE service_area_map ALTER COLUMN area_level SET NOT NULL;

-- Step 5: Consolidate duplicate entries (same service + city + area_type)
-- This removes the ZIP code duplication problem
DELETE FROM service_area_map sam1
WHERE EXISTS (
  SELECT 1 FROM service_area_map sam2
  WHERE sam2.id < sam1.id
  AND COALESCE(sam2.service_id::text, '') = COALESCE(sam1.service_id::text, '')
  AND COALESCE(sam2.sub_service_id::text, '') = COALESCE(sam1.sub_service_id::text, '')
  AND sam2.area_type = sam1.area_type
  AND COALESCE(sam2.city_id::text, '') = COALESCE(sam1.city_id::text, '')
  AND sam2.city_id IS NOT NULL
);

-- Step 6: Drop zip_code foreign key constraint and column
ALTER TABLE service_area_map 
DROP CONSTRAINT IF EXISTS service_area_map_zip_code_fkey;

ALTER TABLE service_area_map 
DROP COLUMN IF EXISTS zip_code;

-- Step 7: Update helper function to remove zip_code references
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
  -- Get all service-level default areas
  service_areas AS (
    SELECT 
      sam.id,
      sam.state_code,
      sam.state_id,
      sam.county_id,
      sam.city_id,
      sam.area_level,
      'inherited' as area_source
    FROM service_area_map sam
    CROSS JOIN sub_service_info ssi
    WHERE sam.service_id = ssi.service_id
      AND sam.area_type = 'service_default'
  ),
  -- Get exclusions for this sub-service
  exclusions AS (
    SELECT 
      state_code,
      state_id,
      county_id,
      city_id
    FROM service_area_map
    WHERE sub_service_id = p_sub_service_id
      AND area_type = 'sub_service_exclusion'
  ),
  -- Get inclusions for this sub-service
  inclusions AS (
    SELECT 
      sam.id,
      sam.state_code,
      sam.state_id,
      sam.county_id,
      sam.city_id,
      sam.area_level,
      'added' as area_source
    FROM service_area_map sam
    WHERE sam.sub_service_id = p_sub_service_id
      AND sam.area_type = 'sub_service_inclusion'
  )
  -- Combine service areas (minus exclusions) plus inclusions
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

-- Step 8: Update service_areas_effective view
CREATE OR REPLACE VIEW service_areas_effective AS
SELECT 
  ss.id as sub_service_id,
  ss.name as sub_service_name,
  ss.service_id,
  s.name as service_name,
  esa.id as area_id,
  esa.state_code,
  esa.state_id,
  esa.county_id,
  esa.city_id,
  esa.area_level,
  esa.area_source,
  st.name as state_name,
  st.code as state_code_full,
  co.name as county_name,
  ci.name as city_name
FROM sub_services ss
JOIN services s ON ss.service_id = s.id
CROSS JOIN LATERAL get_effective_service_areas(ss.id) esa
LEFT JOIN geo_states st ON esa.state_id = st.id
LEFT JOIN geo_counties co ON esa.county_id = co.id
LEFT JOIN cities ci ON esa.city_id = ci.id;

-- Step 9: Verify the migration
SELECT 'ZIP codes removed from service_area_map!' as status;

-- Check for remaining duplicates (should be 0)
SELECT 
  'Duplicate Check' as check_name,
  COUNT(*) as duplicate_count
FROM (
  SELECT 
    service_id,
    sub_service_id,
    city_id,
    area_type,
    COUNT(*) as count
  FROM service_area_map
  WHERE city_id IS NOT NULL
  GROUP BY service_id, sub_service_id, city_id, area_type
  HAVING COUNT(*) > 1
) duplicates;

-- Count entries by area_level
SELECT 
  'Entries by Level' as report_name,
  area_level,
  COUNT(*) as count
FROM service_area_map
GROUP BY area_level;

