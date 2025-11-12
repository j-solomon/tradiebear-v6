-- ============================================================
-- Lead Audit Logs Setup
-- ============================================================
-- Run this SQL in Supabase SQL Editor to create audit logging infrastructure

-- Drop existing table if it exists (to start fresh)
DROP TABLE IF EXISTS lead_audits CASCADE;

-- Create lead_audits table
CREATE TABLE lead_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  previous_status TEXT,
  new_status TEXT,
  updated_fields TEXT[],
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_lead_audits_lead_id ON lead_audits(lead_id);
CREATE INDEX idx_lead_audits_created_at ON lead_audits(created_at DESC);
CREATE INDEX idx_lead_audits_action ON lead_audits(action);

-- Enable Row Level Security
ALTER TABLE lead_audits ENABLE ROW LEVEL SECURITY;

-- Admins can view all audit logs
CREATE POLICY "Admins can view audit logs" ON lead_audits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Service role can insert audit logs
CREATE POLICY "Service role can insert audit logs" ON lead_audits
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- Verification Query
-- ============================================================
-- Run this to verify the table was created successfully:
-- SELECT * FROM lead_audits LIMIT 10;

