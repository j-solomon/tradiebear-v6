-- Comprehensive Services & Sub-Services Update
-- This migration replaces all services and sub-services with the new comprehensive list

-- Step 1: Clear existing sub-services to avoid conflicts
TRUNCATE TABLE sub_services CASCADE;

-- Step 2: Update/Insert main services
-- We'll use UPSERT (INSERT ... ON CONFLICT) to handle existing services

-- Roofing
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('Roofing', 'New roofs, repairs, replacements', true, true, 1)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- Siding
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('Siding', 'Exterior siding installation & repair', true, true, 10)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- Kitchen Remodels
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('Kitchen Remodels', 'Full kitchen renovations & upgrades', true, false, null)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- Bathroom Remodels
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('Bathroom Remodels', 'Complete bathroom renovations', true, false, null)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- ADUs
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('ADUs', 'Accessory dwelling unit construction', true, true, 4)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- Pole Barns
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('Pole Barns', 'Agricultural & storage buildings', true, false, null)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- Decks & Fences
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('Decks & Fences', 'Deck, pergola, and fencing builds', true, true, 7)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- Flooring
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('Flooring', 'LVP, hardwood, tile, and carpet installs', true, true, 8)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- Garage Doors
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('Garage Doors', 'Garage door installation and repair', true, true, 5)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- Windows & Doors
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('Windows & Doors', 'Window & door installation & replacement', true, true, 3)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- Cabinets
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('Cabinets', 'Custom cabinetry & installation', true, false, null)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- Basement Finishing
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('Basement Finishing', 'Complete basement renovations', true, false, null)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- Theater Rooms
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('Theater Rooms', 'Home theater design & installation', true, false, null)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- Golf Simulators
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('Golf Simulators', 'Indoor golf simulator installation', true, false, null)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- Solar Panel Install
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('Solar Panel Install', 'Residential solar system installation', true, false, null)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- Interior & Exterior Painting
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('Interior & Exterior Painting', 'Professional painting services', true, false, null)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- Gutters
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('Gutters', 'Gutter installation & maintenance', true, false, null)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- Mold Remediation
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('Mold Remediation', 'Mold inspection & removal services', true, false, null)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- HVAC / Air Conditioning
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('HVAC / Air Conditioning', 'Heating & cooling system services', true, false, null)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- Water & Fire Damage
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('Water & Fire Damage', 'Emergency restoration services', true, false, null)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- Foundation Repair
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('Foundation Repair', 'Foundation stabilization & repair', true, false, null)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- Countertops
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('Countertops', 'Quartz, granite & custom countertops', true, false, null)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- Lawn & Garden / Landscaping
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('Lawn & Garden / Landscaping', 'Complete landscaping services', true, false, null)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- Custom Lighting
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('Custom Lighting', 'Interior & exterior lighting design', true, false, null)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- Pergola / Gazebo
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('Pergola / Gazebo', 'Outdoor structure construction', true, false, null)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- Outdoor Kitchen
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('Outdoor Kitchen', 'Outdoor cooking & dining spaces', true, false, null)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- Insulation
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('Insulation', 'Attic, wall & crawlspace insulation', true, false, null)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- Remodels (keeping for homepage, but might not have sub-services)
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('Remodels', 'Kitchen & bathroom renovations', true, true, 2)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- Carpet Cleaning
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('Carpet Cleaning', 'Professional carpet cleaning services', true, true, 6)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- Plumbing & Electrical
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('Plumbing & Electrical', 'Repairs, installations, upgrades', true, true, 9)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- Barns
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('Barns', 'Agricultural & storage buildings', true, true, 11)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();

-- & More
INSERT INTO services (name, description, active, featured, display_order)
VALUES ('& More', 'Additional home improvement services', true, true, 12)
ON CONFLICT (name) DO UPDATE SET 
  description = EXCLUDED.description,
  updated_at = now();


-- Step 3: Insert all sub-services
-- We'll use a temp variable to store service IDs

DO $$
DECLARE
  roofing_id UUID;
  siding_id UUID;
  kitchen_id UUID;
  bathroom_id UUID;
  adu_id UUID;
  pole_barn_id UUID;
  deck_fence_id UUID;
  flooring_id UUID;
  garage_door_id UUID;
  window_door_id UUID;
  cabinet_id UUID;
  basement_id UUID;
  theater_id UUID;
  golf_id UUID;
  solar_id UUID;
  painting_id UUID;
  gutter_id UUID;
  mold_id UUID;
  hvac_id UUID;
  water_fire_id UUID;
  foundation_id UUID;
  countertop_id UUID;
  landscape_id UUID;
  lighting_id UUID;
  pergola_id UUID;
  outdoor_kitchen_id UUID;
  insulation_id UUID;
BEGIN
  -- Get service IDs
  SELECT id INTO roofing_id FROM services WHERE name = 'Roofing';
  SELECT id INTO siding_id FROM services WHERE name = 'Siding';
  SELECT id INTO kitchen_id FROM services WHERE name = 'Kitchen Remodels';
  SELECT id INTO bathroom_id FROM services WHERE name = 'Bathroom Remodels';
  SELECT id INTO adu_id FROM services WHERE name = 'ADUs';
  SELECT id INTO pole_barn_id FROM services WHERE name = 'Pole Barns';
  SELECT id INTO deck_fence_id FROM services WHERE name = 'Decks & Fences';
  SELECT id INTO flooring_id FROM services WHERE name = 'Flooring';
  SELECT id INTO garage_door_id FROM services WHERE name = 'Garage Doors';
  SELECT id INTO window_door_id FROM services WHERE name = 'Windows & Doors';
  SELECT id INTO cabinet_id FROM services WHERE name = 'Cabinets';
  SELECT id INTO basement_id FROM services WHERE name = 'Basement Finishing';
  SELECT id INTO theater_id FROM services WHERE name = 'Theater Rooms';
  SELECT id INTO golf_id FROM services WHERE name = 'Golf Simulators';
  SELECT id INTO solar_id FROM services WHERE name = 'Solar Panel Install';
  SELECT id INTO painting_id FROM services WHERE name = 'Interior & Exterior Painting';
  SELECT id INTO gutter_id FROM services WHERE name = 'Gutters';
  SELECT id INTO mold_id FROM services WHERE name = 'Mold Remediation';
  SELECT id INTO hvac_id FROM services WHERE name = 'HVAC / Air Conditioning';
  SELECT id INTO water_fire_id FROM services WHERE name = 'Water & Fire Damage';
  SELECT id INTO foundation_id FROM services WHERE name = 'Foundation Repair';
  SELECT id INTO countertop_id FROM services WHERE name = 'Countertops';
  SELECT id INTO landscape_id FROM services WHERE name = 'Lawn & Garden / Landscaping';
  SELECT id INTO lighting_id FROM services WHERE name = 'Custom Lighting';
  SELECT id INTO pergola_id FROM services WHERE name = 'Pergola / Gazebo';
  SELECT id INTO outdoor_kitchen_id FROM services WHERE name = 'Outdoor Kitchen';
  SELECT id INTO insulation_id FROM services WHERE name = 'Insulation';

  -- Roofing sub-services
  INSERT INTO sub_services (service_id, name, active) VALUES
  (roofing_id, 'Roof replacement (asphalt, metal, cedar, flat/TPO, tile)', true),
  (roofing_id, 'Roof repair (leaks, flashing, wind/storm damage)', true),
  (roofing_id, 'Roof inspection & certification', true),
  (roofing_id, 'Roof moss removal & cleaning', true),
  (roofing_id, 'Skylight installation & repair', true),
  (roofing_id, 'Roof ventilation upgrades', true),
  (roofing_id, 'Emergency roof tarping', true),
  (roofing_id, 'Attic venting & insulation tie-ins', true);

  -- Siding sub-services
  INSERT INTO sub_services (service_id, name, active) VALUES
  (siding_id, 'Fiber cement (HardiePlank, Allura)', true),
  (siding_id, 'Vinyl siding replacement', true),
  (siding_id, 'Cedar siding installation', true),
  (siding_id, 'Metal siding & panels', true),
  (siding_id, 'Soffit and fascia repair', true),
  (siding_id, 'House wrap & moisture barrier install', true),
  (siding_id, 'Trim, corner boards & flashing details', true),
  (siding_id, 'Exterior cladding removal & disposal', true);

  -- Kitchen Remodels sub-services
  INSERT INTO sub_services (service_id, name, active) VALUES
  (kitchen_id, 'Full kitchen design & renovation', true),
  (kitchen_id, 'Cabinet installation or refacing', true),
  (kitchen_id, 'Countertop replacement (quartz, granite, butcher block)', true),
  (kitchen_id, 'Backsplash tile installation', true),
  (kitchen_id, 'Lighting & electrical upgrades', true),
  (kitchen_id, 'Plumbing fixture replacement', true),
  (kitchen_id, 'Flooring & subfloor repairs', true),
  (kitchen_id, 'Open-concept wall removal', true);

  -- Bathroom Remodels sub-services
  INSERT INTO sub_services (service_id, name, active) VALUES
  (bathroom_id, 'Shower conversions (tub to walk-in)', true),
  (bathroom_id, 'Tile surround & waterproofing systems', true),
  (bathroom_id, 'Vanities & countertops', true),
  (bathroom_id, 'Flooring (tile, LVP, waterproof laminate)', true),
  (bathroom_id, 'Lighting & exhaust fans', true),
  (bathroom_id, 'Plumbing fixture installation', true),
  (bathroom_id, 'Heated floors & smart mirrors', true);

  -- ADUs sub-services
  INSERT INTO sub_services (service_id, name, active) VALUES
  (adu_id, 'Detached ADU construction', true),
  (adu_id, 'Garage conversion ADUs', true),
  (adu_id, 'Basement ADUs', true),
  (adu_id, 'DADUs / backyard cottages', true),
  (adu_id, 'Tiny homes / in-law suites', true),
  (adu_id, 'Permit & design planning', true),
  (adu_id, 'Utility hookups & foundation work', true);

  -- Pole Barns sub-services
  INSERT INTO sub_services (service_id, name, active) VALUES
  (pole_barn_id, 'Residential pole barns / workshops', true),
  (pole_barn_id, 'Agricultural barns / storage buildings', true),
  (pole_barn_id, 'RV & boat storage structures', true),
  (pole_barn_id, 'Concrete slabs & footings', true),
  (pole_barn_id, 'Framing, roofing, and metal siding', true),
  (pole_barn_id, 'Electrical & lighting install', true);

  -- Decks & Fences sub-services
  INSERT INTO sub_services (service_id, name, active) VALUES
  (deck_fence_id, 'Composite deck construction (Trex, TimberTech)', true),
  (deck_fence_id, 'Cedar deck builds & staining', true),
  (deck_fence_id, 'Deck replacement & resurfacing', true),
  (deck_fence_id, 'Handrails, stairs & safety gates', true),
  (deck_fence_id, 'Wood & vinyl fencing', true),
  (deck_fence_id, 'Chain link & privacy fences', true),
  (deck_fence_id, 'Pergolas & shade structures', true);

  -- Flooring sub-services
  INSERT INTO sub_services (service_id, name, active) VALUES
  (flooring_id, 'Luxury vinyl plank installation', true),
  (flooring_id, 'Engineered hardwood installation', true),
  (flooring_id, 'Solid hardwood refinishing', true),
  (flooring_id, 'Carpet install & removal', true),
  (flooring_id, 'Tile installation (bathroom, kitchen, entry)', true),
  (flooring_id, 'Subfloor repair & leveling', true),
  (flooring_id, 'Baseboard & trim finishing', true);

  -- Garage Doors sub-services
  INSERT INTO sub_services (service_id, name, active) VALUES
  (garage_door_id, 'New garage door installation', true),
  (garage_door_id, 'Opener installation & smart systems', true),
  (garage_door_id, 'Spring & track repair', true),
  (garage_door_id, 'Insulated doors / weatherproofing', true),
  (garage_door_id, 'Carriage-style and custom wood doors', true);

  -- Windows & Doors sub-services
  INSERT INTO sub_services (service_id, name, active) VALUES
  (window_door_id, 'Window replacement (vinyl, fiberglass, wood)', true),
  (window_door_id, 'Sliding glass & patio doors', true),
  (window_door_id, 'Entry & front door replacement', true),
  (window_door_id, 'French & double doors', true),
  (window_door_id, 'Weatherstripping & energy efficiency upgrades', true);

  -- Cabinets sub-services
  INSERT INTO sub_services (service_id, name, active) VALUES
  (cabinet_id, 'Custom cabinetry design', true),
  (cabinet_id, 'Semi-custom cabinet install', true),
  (cabinet_id, 'Cabinet refacing & repainting', true),
  (cabinet_id, 'Soft-close hardware & pullouts', true),
  (cabinet_id, 'Built-in shelving & storage', true);

  -- Basement Finishing sub-services
  INSERT INTO sub_services (service_id, name, active) VALUES
  (basement_id, 'Framing & drywall', true),
  (basement_id, 'Flooring & ceiling finishes', true),
  (basement_id, 'Egress windows & code compliance', true),
  (basement_id, 'Bathroom or wet bar addition', true),
  (basement_id, 'Waterproofing & sump systems', true),
  (basement_id, 'Soundproofing walls & ceilings', true);

  -- Theater Rooms sub-services
  INSERT INTO sub_services (service_id, name, active) VALUES
  (theater_id, 'Acoustic wall paneling', true),
  (theater_id, 'Projector & screen setup', true),
  (theater_id, 'Custom cabinetry / risers', true),
  (theater_id, 'LED accent lighting', true),
  (theater_id, 'Sound insulation', true),
  (theater_id, 'Smart control system integration', true);

  -- Golf Simulators sub-services
  INSERT INTO sub_services (service_id, name, active) VALUES
  (golf_id, 'Framing & impact screen installation', true),
  (golf_id, 'Flooring / turf install', true),
  (golf_id, 'Electrical & lighting setup', true),
  (golf_id, 'Soundproofing / acoustic treatment', true),
  (golf_id, 'Ventilation & climate control', true);

  -- Solar Panel Install sub-services
  INSERT INTO sub_services (service_id, name, active) VALUES
  (solar_id, 'Roof-mounted solar systems', true),
  (solar_id, 'Ground-mount systems', true),
  (solar_id, 'Inverter installation', true),
  (solar_id, 'Battery backup systems', true),
  (solar_id, 'Net metering & permits', true);

  -- Interior & Exterior Painting sub-services
  INSERT INTO sub_services (service_id, name, active) VALUES
  (painting_id, 'Full-home interior painting', true),
  (painting_id, 'Exterior house painting', true),
  (painting_id, 'Trim, baseboards, and doors', true),
  (painting_id, 'Staining (fences, decks, cabinets)', true),
  (painting_id, 'Pressure washing & prep work', true),
  (painting_id, 'Epoxy garage floors', true);

  -- Gutters sub-services
  INSERT INTO sub_services (service_id, name, active) VALUES
  (gutter_id, 'Gutter installation & replacement', true),
  (gutter_id, 'Gutter guard systems', true),
  (gutter_id, 'Downspout installation', true),
  (gutter_id, 'Gutter cleaning & flushing', true),
  (gutter_id, 'Fascia repair', true);

  -- Mold Remediation sub-services
  INSERT INTO sub_services (service_id, name, active) VALUES
  (mold_id, 'Mold inspection & air testing', true),
  (mold_id, 'Removal & HEPA filtration', true),
  (mold_id, 'Crawlspace & attic remediation', true),
  (mold_id, 'Moisture barrier installation', true),
  (mold_id, 'Structural drying & sealing', true);

  -- HVAC / Air Conditioning sub-services
  INSERT INTO sub_services (service_id, name, active) VALUES
  (hvac_id, 'Heat pump installation', true),
  (hvac_id, 'Ductless mini-split systems', true),
  (hvac_id, 'Furnace replacement', true),
  (hvac_id, 'Air duct cleaning & sealing', true),
  (hvac_id, 'Thermostat installation', true),
  (hvac_id, 'Annual service & maintenance', true);

  -- Water & Fire Damage sub-services
  INSERT INTO sub_services (service_id, name, active) VALUES
  (water_fire_id, 'Water extraction & drying', true),
  (water_fire_id, 'Fire damage cleanup & rebuild', true),
  (water_fire_id, 'Smoke odor removal', true),
  (water_fire_id, 'Structural repairs', true),
  (water_fire_id, 'Insurance claim documentation', true);

  -- Foundation Repair sub-services
  INSERT INTO sub_services (service_id, name, active) VALUES
  (foundation_id, 'Crack injection & epoxy sealing', true),
  (foundation_id, 'Piering & stabilization', true),
  (foundation_id, 'Basement waterproofing', true),
  (foundation_id, 'Drainage correction', true),
  (foundation_id, 'Crawlspace encapsulation', true);

  -- Countertops sub-services
  INSERT INTO sub_services (service_id, name, active) VALUES
  (countertop_id, 'Quartz fabrication & install', true),
  (countertop_id, 'Granite & marble installation', true),
  (countertop_id, 'Solid surface / butcher block', true),
  (countertop_id, 'Backsplash tile integration', true),
  (countertop_id, 'Removal & disposal of old tops', true);

  -- Lawn & Garden / Landscaping sub-services
  INSERT INTO sub_services (service_id, name, active) VALUES
  (landscape_id, 'Sod installation & grading', true),
  (landscape_id, 'Irrigation system install', true),
  (landscape_id, 'Retaining walls & hardscapes', true),
  (landscape_id, 'Planting & mulching', true),
  (landscape_id, 'Artificial turf', true),
  (landscape_id, 'Outdoor lighting', true),
  (landscape_id, 'Pathways & stone patios', true);

  -- Custom Lighting sub-services
  INSERT INTO sub_services (service_id, name, active) VALUES
  (lighting_id, 'Recessed lighting install', true),
  (lighting_id, 'Pendant & chandelier installation', true),
  (lighting_id, 'Landscape lighting', true),
  (lighting_id, 'Smart lighting systems', true),
  (lighting_id, 'LED retrofit & dimmers', true);

  -- Pergola / Gazebo sub-services
  INSERT INTO sub_services (service_id, name, active) VALUES
  (pergola_id, 'Custom pergola construction', true),
  (pergola_id, 'Wood or metal gazebos', true),
  (pergola_id, 'Shade covers & canopies', true),
  (pergola_id, 'Lighting & electrical integration', true);

  -- Outdoor Kitchen sub-services
  INSERT INTO sub_services (service_id, name, active) VALUES
  (outdoor_kitchen_id, 'Grill & countertop installation', true),
  (outdoor_kitchen_id, 'Stone veneer / masonry work', true),
  (outdoor_kitchen_id, 'Sink & plumbing setup', true),
  (outdoor_kitchen_id, 'Outdoor refrigeration & storage', true),
  (outdoor_kitchen_id, 'Covered patio tie-ins', true);

  -- Insulation sub-services
  INSERT INTO sub_services (service_id, name, active) VALUES
  (insulation_id, 'Attic insulation (blown-in / batt)', true),
  (insulation_id, 'Crawlspace insulation', true),
  (insulation_id, 'Wall cavity insulation', true),
  (insulation_id, 'Spray foam application', true),
  (insulation_id, 'Air sealing & vapor barrier install', true);

END $$;

