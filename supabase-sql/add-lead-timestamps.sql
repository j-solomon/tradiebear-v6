-- ============================================================
-- Lead Timestamp Tracking & Search Optimization
-- ============================================================
-- Run this SQL in Supabase SQL Editor to add lifecycle tracking
-- and optimize search performance

-- ============================================================
-- 1. Add Timestamp Columns for Lead Lifecycle
-- ============================================================

ALTER TABLE leads
ADD COLUMN IF NOT EXISTS contacted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS qualified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS quoted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS closed_at TIMESTAMPTZ;

-- ============================================================
-- 2. Add Performance Indexes for Date Queries
-- ============================================================

-- Index for filtering by contacted date
CREATE INDEX IF NOT EXISTS idx_leads_contacted_at ON leads(contacted_at);

-- Index for filtering by closed date
CREATE INDEX IF NOT EXISTS idx_leads_closed_at ON leads(closed_at);

-- Index for sorting by created date (descending)
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- Index for filtering by stage
CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);

-- ============================================================
-- 3. Add Full-Text Search Index (GIN)
-- ============================================================
-- This enables fast text search across multiple fields

CREATE INDEX IF NOT EXISTS idx_leads_search ON leads 
USING GIN (to_tsvector('english', 
  coalesce(homeowner_first, '') || ' ' || 
  coalesce(homeowner_last, '') || ' ' || 
  coalesce(homeowner_email, '') || ' ' || 
  coalesce(homeowner_phone, '') || ' ' || 
  coalesce(notes, '')
));

-- ============================================================
-- 4. Add Comments for Documentation
-- ============================================================

COMMENT ON COLUMN leads.contacted_at IS 'Timestamp when lead stage changed to contacted';
COMMENT ON COLUMN leads.qualified_at IS 'Timestamp when lead stage changed to qualified';
COMMENT ON COLUMN leads.quoted_at IS 'Timestamp when lead stage changed to quoted';
COMMENT ON COLUMN leads.closed_at IS 'Timestamp when lead stage changed to won or lost';

-- ============================================================
-- Verification Query
-- ============================================================
-- Run this to verify the columns and indexes were created:
/*
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'leads' 
  AND column_name IN ('contacted_at', 'qualified_at', 'quoted_at', 'closed_at');

SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'leads' 
  AND indexname LIKE 'idx_leads_%';
*/

