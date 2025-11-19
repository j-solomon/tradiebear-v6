-- Add featured and display_order columns to services table

-- Add featured column (defaults to false)
ALTER TABLE services
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Add display_order column (for controlling homepage order)
ALTER TABLE services
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 999;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_services_featured ON services(featured, display_order);

-- Set the 12 default services as featured with their proper order
-- These match the services from home-5 screenshot

UPDATE services SET featured = true, display_order = 1 WHERE name = 'Roofing';
UPDATE services SET featured = true, display_order = 2 WHERE name = 'Remodels';
UPDATE services SET featured = true, display_order = 3 WHERE name = 'Windows & Doors';
UPDATE services SET featured = true, display_order = 4 WHERE name = 'ADUs';
UPDATE services SET featured = true, display_order = 5 WHERE name = 'Garage Doors';
UPDATE services SET featured = true, display_order = 6 WHERE name = 'Carpet Cleaning';
UPDATE services SET featured = true, display_order = 7 WHERE name = 'Decks & Fences';
UPDATE services SET featured = true, display_order = 8 WHERE name = 'Flooring';
UPDATE services SET featured = true, display_order = 9 WHERE name = 'Plumbing & Electrical';
UPDATE services SET featured = true, display_order = 10 WHERE name = 'Siding';
UPDATE services SET featured = true, display_order = 11 WHERE name = 'Barns';
UPDATE services SET featured = true, display_order = 12 WHERE name = '& More';

-- Add comment for documentation
COMMENT ON COLUMN services.featured IS 'Whether this service should be displayed on the homepage';
COMMENT ON COLUMN services.display_order IS 'Order in which service appears on homepage (1-12)';

