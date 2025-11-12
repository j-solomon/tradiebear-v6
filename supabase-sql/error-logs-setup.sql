-- ============================================================
-- Error Logging System Setup
-- ============================================================
-- Run this SQL in Supabase SQL Editor to create error logging infrastructure

-- Drop existing policies first if they exist
DROP POLICY IF EXISTS "Admins can view error logs" ON error_logs;
DROP POLICY IF EXISTS "Admins can update error logs" ON error_logs;
DROP POLICY IF EXISTS "Service role can insert error logs" ON error_logs;

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS idx_error_logs_created_at;
DROP INDEX IF EXISTS idx_error_logs_type;
DROP INDEX IF EXISTS idx_error_logs_unresolved;

-- Drop the table if it exists (to start fresh)
DROP TABLE IF EXISTS error_logs CASCADE;

-- Create error_logs table
CREATE TABLE error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  context JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id)
);

-- Create indexes for better query performance
CREATE INDEX idx_error_logs_created_at ON error_logs(created_at DESC);
CREATE INDEX idx_error_logs_type ON error_logs(error_type);
CREATE INDEX idx_error_logs_unresolved ON error_logs(resolved) WHERE resolved = FALSE;

-- Enable Row Level Security
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Admins can view all error logs
CREATE POLICY "Admins can view error logs" ON error_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update error logs (mark as resolved)
CREATE POLICY "Admins can update error logs" ON error_logs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow service role to insert error logs (from server-side logging)
CREATE POLICY "Service role can insert error logs" ON error_logs
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- Verification Query
-- ============================================================
-- Run this to verify the table was created successfully:
-- SELECT * FROM error_logs LIMIT 10;

