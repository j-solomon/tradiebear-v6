-- =====================================================
-- MIGRATION: Geographic Reference Tables
-- Create states, counties, and cities tables
-- Date: 2025-11-13
-- =====================================================

-- Create states table
CREATE TABLE IF NOT EXISTS states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create counties table
CREATE TABLE IF NOT EXISTS counties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id UUID NOT NULL REFERENCES states(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(state_id, name)
);

-- Create cities table
CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  county_id UUID REFERENCES counties(id) ON DELETE CASCADE,
  state_id UUID NOT NULL REFERENCES states(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(state_id, name)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_counties_state_id ON counties(state_id);
CREATE INDEX IF NOT EXISTS idx_cities_state_id ON cities(state_id);
CREATE INDEX IF NOT EXISTS idx_cities_county_id ON cities(county_id);

-- Enable RLS
ALTER TABLE states ENABLE ROW LEVEL SECURITY;
ALTER TABLE counties ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

-- Policies (public read access for geographic data)
CREATE POLICY "Anyone can view states" ON states FOR SELECT USING (true);
CREATE POLICY "Anyone can view counties" ON counties FOR SELECT USING (true);
CREATE POLICY "Anyone can view cities" ON cities FOR SELECT USING (true);

CREATE POLICY "Admins can manage states" ON states
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage counties" ON counties
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage cities" ON cities
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Insert sample data for common US states
INSERT INTO states (name, code) VALUES
  ('Oregon', 'OR'),
  ('Washington', 'WA'),
  ('California', 'CA')
ON CONFLICT (code) DO NOTHING;

-- Get Oregon ID for sample counties/cities
DO $$
DECLARE
  oregon_id UUID;
  washington_id UUID;
  california_id UUID;
  multnomah_id UUID;
  clackamas_id UUID;
  king_id UUID;
  pierce_id UUID;
BEGIN
  SELECT id INTO oregon_id FROM states WHERE code = 'OR';
  SELECT id INTO washington_id FROM states WHERE code = 'WA';
  SELECT id INTO california_id FROM states WHERE code = 'CA';
  
  -- Insert sample counties
  INSERT INTO counties (state_id, name) VALUES
    (oregon_id, 'Multnomah'),
    (oregon_id, 'Clackamas'),
    (oregon_id, 'Washington'),
    (washington_id, 'King'),
    (washington_id, 'Pierce'),
    (california_id, 'Los Angeles'),
    (california_id, 'San Francisco')
  ON CONFLICT (state_id, name) DO NOTHING;
  
  -- Get county IDs
  SELECT id INTO multnomah_id FROM counties WHERE name = 'Multnomah' AND state_id = oregon_id;
  SELECT id INTO clackamas_id FROM counties WHERE name = 'Clackamas' AND state_id = oregon_id;
  SELECT id INTO king_id FROM counties WHERE name = 'King' AND state_id = washington_id;
  SELECT id INTO pierce_id FROM counties WHERE name = 'Pierce' AND state_id = washington_id;
  
  -- Insert sample cities
  INSERT INTO cities (state_id, county_id, name) VALUES
    -- Oregon
    (oregon_id, multnomah_id, 'Portland'),
    (oregon_id, multnomah_id, 'Gresham'),
    (oregon_id, clackamas_id, 'Oregon City'),
    (oregon_id, clackamas_id, 'Lake Oswego'),
    -- Washington
    (washington_id, king_id, 'Seattle'),
    (washington_id, king_id, 'Bellevue'),
    (washington_id, king_id, 'Redmond'),
    (washington_id, pierce_id, 'Tacoma'),
    -- California
    (california_id, NULL, 'Los Angeles'),
    (california_id, NULL, 'San Francisco'),
    (california_id, NULL, 'San Diego')
  ON CONFLICT (state_id, name) DO NOTHING;
END $$;

SELECT 'Geographic tables setup complete!' as status;
SELECT COUNT(*) as state_count FROM states;
SELECT COUNT(*) as county_count FROM counties;
SELECT COUNT(*) as city_count FROM cities;

