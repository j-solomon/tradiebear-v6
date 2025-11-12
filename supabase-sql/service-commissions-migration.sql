-- =====================================================
-- MIGRATION: Flexible Commission System
-- Links commissions to services and sub-services
-- Date: 2025-11-13
-- =====================================================

-- Step 1: Create new service_commissions table
CREATE TABLE IF NOT EXISTS service_commissions (
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

-- Step 2: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_service_commissions_service_id ON service_commissions(service_id);
CREATE INDEX IF NOT EXISTS idx_service_commissions_sub_service_id ON service_commissions(sub_service_id);

-- Step 3: Enable RLS
ALTER TABLE service_commissions ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view service commissions" ON service_commissions;
DROP POLICY IF EXISTS "Admins can manage service commissions" ON service_commissions;

-- Step 5: Create RLS Policies
CREATE POLICY "Anyone can view service commissions" ON service_commissions
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage service commissions" ON service_commissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Step 6: Migrate existing commission_tiers data (optional)
-- This creates default 10% commission for all existing services
INSERT INTO service_commissions (service_id, percentage)
SELECT id, 10.0
FROM services
WHERE active = true
ON CONFLICT ON CONSTRAINT unique_service_commission DO NOTHING;

-- Step 7: Rename old table for backup (if it exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'commission_tiers') THEN
    ALTER TABLE commission_tiers RENAME TO commission_tiers_backup_2025_11_13;
  END IF;
END $$;

-- Step 8: Create helper function to get commission for a sub-service
CREATE OR REPLACE FUNCTION get_commission_percentage(p_sub_service_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  v_percentage NUMERIC;
  v_service_id UUID;
BEGIN
  -- First, try to get sub-service specific commission
  SELECT percentage INTO v_percentage
  FROM service_commissions
  WHERE sub_service_id = p_sub_service_id;
  
  IF v_percentage IS NOT NULL THEN
    RETURN v_percentage;
  END IF;
  
  -- If no sub-service commission, get the service-level commission
  SELECT ss.service_id INTO v_service_id
  FROM sub_services ss
  WHERE ss.id = p_sub_service_id;
  
  IF v_service_id IS NOT NULL THEN
    SELECT percentage INTO v_percentage
    FROM service_commissions
    WHERE service_id = v_service_id;
  END IF;
  
  -- Return percentage or default 10% if nothing found
  RETURN COALESCE(v_percentage, 10.0);
END;
$$ LANGUAGE plpgsql STABLE;

-- Step 9: Create view for easy querying
CREATE OR REPLACE VIEW service_commissions_full AS
SELECT 
  sc.id,
  sc.service_id,
  sc.sub_service_id,
  sc.percentage,
  s.name as service_name,
  ss.name as sub_service_name,
  ss.description as sub_service_description,
  sc.created_at,
  sc.updated_at
FROM service_commissions sc
LEFT JOIN services s ON sc.service_id = s.id
LEFT JOIN sub_services ss ON sc.sub_service_id = ss.id;

-- Step 10: Verify the setup
SELECT 'Commission system setup complete!' as status;
SELECT 
  COUNT(*) as total_commissions,
  COUNT(service_id) as service_level_commissions,
  COUNT(sub_service_id) as sub_service_level_commissions
FROM service_commissions;

