-- Add completion tracking fields to leads table
-- This allows tracking partial form submissions and following up with incomplete leads

-- Step 1: Add columns without constraints first
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS completion_status TEXT,
ADD COLUMN IF NOT EXISTS step1_completed_at TIMESTAMPTZ;

-- Step 2: Set existing leads to 'submitted' (they completed the old form)
UPDATE leads 
SET completion_status = 'submitted'
WHERE completion_status IS NULL;

-- Step 3: Set default for new rows
ALTER TABLE leads 
ALTER COLUMN completion_status SET DEFAULT 'incomplete';

-- Step 4: Add check constraint (now includes 'incomplete')
ALTER TABLE leads
ADD CONSTRAINT leads_completion_status_check 
CHECK (completion_status IN ('incomplete', 'step1_complete', 'step2_complete', 'submitted'));

-- Step 5: Add indexes for querying incomplete leads efficiently
CREATE INDEX IF NOT EXISTS idx_leads_completion_status ON leads(completion_status);
CREATE INDEX IF NOT EXISTS idx_leads_step1_completed ON leads(step1_completed_at) WHERE step1_completed_at IS NOT NULL;

-- Step 6: Add documentation
COMMENT ON COLUMN leads.completion_status IS 'Tracks form completion: incomplete (default), step1_complete (contact info saved), step2_complete (project details saved), submitted (fully completed)';
COMMENT ON COLUMN leads.step1_completed_at IS 'Timestamp when Step 1 (contact information) was completed and saved';
