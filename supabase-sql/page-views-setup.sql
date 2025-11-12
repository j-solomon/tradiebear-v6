-- ============================================================
-- Page View Tracking Setup
-- ============================================================
-- Run this SQL in Supabase SQL Editor to track homeowner form
-- visits and referral link clicks for DAU metrics

-- ============================================================
-- 1. Create Page Views Table
-- ============================================================

CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_link_id UUID REFERENCES referral_links(id) ON DELETE CASCADE,
  page_type TEXT NOT NULL, -- 'referral_form', 'form_step_1', 'form_step_2', 'form_step_3', etc.
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. Create Performance Indexes
-- ============================================================

-- Index for date range queries (DAU calculations)
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);

-- Index for filtering by referral link
CREATE INDEX IF NOT EXISTS idx_page_views_referral_link ON page_views(referral_link_id);

-- Index for filtering by page type
CREATE INDEX IF NOT EXISTS idx_page_views_page_type ON page_views(page_type);

-- Composite index for efficient DAU queries
CREATE INDEX IF NOT EXISTS idx_page_views_date_type ON page_views(created_at DESC, page_type);

-- ============================================================
-- 3. Enable Row Level Security
-- ============================================================

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. RLS Policies
-- ============================================================

-- Admins can view all page views
CREATE POLICY "Admins can view page views" ON page_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Partners can view their own referral link page views
CREATE POLICY "Partners can view their referral page views" ON page_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM referral_links
      WHERE referral_links.id = page_views.referral_link_id
      AND referral_links.user_id = auth.uid()
    )
  );

-- Service role can insert page views (from server-side tracking)
CREATE POLICY "Service role can insert page views" ON page_views
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- 5. Add Comments for Documentation
-- ============================================================

COMMENT ON TABLE page_views IS 'Tracks homeowner form visits and referral clicks for analytics and DAU metrics';
COMMENT ON COLUMN page_views.page_type IS 'Type of page visited: referral_form, form_step_1, form_step_2, form_step_3, form_submitted';
COMMENT ON COLUMN page_views.referral_link_id IS 'Optional: Links the view to a specific referral link if applicable';
COMMENT ON COLUMN page_views.ip_address IS 'IP address of the visitor (for deduplication)';
COMMENT ON COLUMN page_views.user_agent IS 'Browser user agent string';

-- ============================================================
-- Verification Query
-- ============================================================
-- Run this to verify the table was created successfully:
/*
SELECT * FROM page_views LIMIT 10;

SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'page_views';
*/

