-- Add completion tracking fields to leads table
-- This allows tracking partial form submissions and following up with incomplete leads

-- Add completion_status field with check constraint
ALTER TABLE leads 
ADD COLUMN completion_status TEXT DEFAULT 'incomplete' 
CHECK (completion_status IN ('step1_complete', 'step2_complete', 'submitted'));

-- Add timestamp for when Step 1 was completed
ALTER TABLE leads 
ADD COLUMN step1_completed_at TIMESTAMPTZ;

-- Add index for querying incomplete leads efficiently
CREATE INDEX idx_leads_completion_status ON leads(completion_status);
CREATE INDEX idx_leads_step1_completed ON leads(step1_completed_at) WHERE step1_completed_at IS NOT NULL;

-- Add comment explaining the field
COMMENT ON COLUMN leads.completion_status IS 'Tracks form completion: step1_complete (contact info saved), step2_complete (project details saved), submitted (fully completed)';
COMMENT ON COLUMN leads.step1_completed_at IS 'Timestamp when Step 1 (contact information) was completed and saved';

