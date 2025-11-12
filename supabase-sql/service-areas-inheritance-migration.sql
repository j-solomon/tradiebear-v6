-- =====================================================
-- MIGRATION: Service Areas Inheritance System
-- Enable area inheritance from services to sub-services
-- Date: 2025-11-13
-- =====================================================

-- Step 1: Create area_type enum
DO $$ BEGIN
  CREATE TYPE area_type AS ENUM ('service_default', 'sub_service_inclusion', 'sub_service_exclusion');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Step 2: Add new columns to service_area_map
-- Check if columns exist before adding
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'service_area_map' AND column_name = 'service_id') THEN
    ALTER TABLE service_area_map ADD COLUMN service_id UUID REFERENCES services(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'service_area_map' AND column_name = 'area_type') THEN
    ALTER TABLE service_area_map ADD COLUMN area_type area_type DEFAULT 'sub_service_inclusion';
  END IF;
END $$;

-- Step 3: Migrate existing data
-- All existing areas are sub-service specific (inclusions)
UPDATE service_area_map 
SET area_type = 'sub_service_inclusion'
WHERE area_type IS NULL;

-- Step 4: Make area_type NOT NULL now that data is migrated
ALTER TABLE service_area_map ALTER COLUMN area_type SET NOT NULL;

-- Step 5: Add constraints for area_type logic
-- Drop existing constraint if it exists
ALTER TABLE service_area_map DROP CONSTRAINT IF EXISTS area_type_service_check;
ALTER TABLE service_area_map DROP CONSTRAINT IF EXISTS area_type_sub_service_check;

-- Add new constraints
ALTER TABLE service_area_map ADD CONSTRAINT area_type_service_check CHECK (
  (area_type = 'service_default' AND service_id IS NOT NULL AND sub_service_id IS NULL) OR
  (area_type != 'service_default')
);

ALTER TABLE service_area_map ADD CONSTRAINT area_type_sub_service_check CHECK (
  (area_type IN ('sub_service_inclusion', 'sub_service_exclusion') AND sub_service_id IS NOT NULL) OR
  (area_type = 'service_default')
);

-- Step 6: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_service_area_map_service_id ON service_area_map(service_id);
CREATE INDEX IF NOT EXISTS idx_service_area_map_area_type ON service_area_map(area_type);

-- Step 7: Create helper function to get effective service areas for a sub-service
CREATE OR REPLACE FUNCTION get_effective_service_areas(p_sub_service_id UUID)
RETURNS TABLE (
  id UUID,
  state_code TEXT,
  zip_code TEXT,
  state_id UUID,
  county_id UUID,
  city_id UUID,
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
      sam.zip_code,
      sam.state_id,
      sam.county_id,
      sam.city_id,
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
      zip_code,
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
      sam.zip_code,
      sam.state_id,
      sam.county_id,
      sam.city_id,
      'added' as area_source
    FROM service_area_map sam
    WHERE sam.sub_service_id = p_sub_service_id
      AND sam.area_type = 'sub_service_inclusion'
  )
  -- Combine service areas (minus exclusions) plus inclusions
  SELECT sa.* FROM service_areas sa
  WHERE NOT EXISTS (
    SELECT 1 FROM exclusions e
    WHERE e.state_code = sa.state_code
      AND e.zip_code = sa.zip_code
      AND COALESCE(e.state_id::text, '') = COALESCE(sa.state_id::text, '')
      AND COALESCE(e.county_id::text, '') = COALESCE(sa.county_id::text, '')
      AND COALESCE(e.city_id::text, '') = COALESCE(sa.city_id::text, '')
  )
  UNION ALL
  SELECT * FROM inclusions;
END;
$$ LANGUAGE plpgsql STABLE;

-- Step 8: Create view for effective service areas
CREATE OR REPLACE VIEW service_areas_effective AS
SELECT 
  ss.id as sub_service_id,
  ss.name as sub_service_name,
  ss.service_id,
  s.name as service_name,
  esa.id as area_id,
  esa.state_code,
  esa.zip_code,
  esa.state_id,
  esa.county_id,
  esa.city_id,
  esa.area_source,
  st.name as state_name,
  st.code as state_code_full,
  co.name as county_name,
  ci.name as city_name
FROM sub_services ss
JOIN services s ON ss.service_id = s.id
CROSS JOIN LATERAL get_effective_service_areas(ss.id) esa
LEFT JOIN states st ON esa.state_id = st.id
LEFT JOIN counties co ON esa.county_id = co.id
LEFT JOIN cities ci ON esa.city_id = ci.id;

-- Step 9: Create helper function to count areas by type
CREATE OR REPLACE FUNCTION count_service_areas(p_service_id UUID DEFAULT NULL, p_sub_service_id UUID DEFAULT NULL)
RETURNS TABLE (
  area_type area_type,
  count BIGINT
) AS $$
BEGIN
  IF p_service_id IS NOT NULL THEN
    RETURN QUERY
    SELECT 
      sam.area_type,
      COUNT(*) as count
    FROM service_area_map sam
    WHERE sam.service_id = p_service_id
    GROUP BY sam.area_type;
  ELSIF p_sub_service_id IS NOT NULL THEN
    RETURN QUERY
    SELECT 
      sam.area_type,
      COUNT(*) as count
    FROM service_area_map sam
    WHERE sam.sub_service_id = p_sub_service_id
    GROUP BY sam.area_type;
  END IF;
END;
$$ LANGUAGE plpgsql STABLE;

-- Step 10: Verify the setup
SELECT 'Service areas inheritance system setup complete!' as status;
SELECT 
  area_type,
  COUNT(*) as count
FROM service_area_map
GROUP BY area_type;

