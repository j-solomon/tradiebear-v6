-- Migration: Make sub_service_id nullable in leads table
-- This allows leads to be submitted for services that don't have sub-services

-- Make sub_service_id nullable
ALTER TABLE leads ALTER COLUMN sub_service_id DROP NOT NULL;

-- Verify the change
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'leads' 
  AND column_name = 'sub_service_id';

