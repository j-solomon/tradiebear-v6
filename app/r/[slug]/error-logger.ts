'use server'

import { createServiceClient } from '@/lib/supabase/server'

export interface ErrorLog {
  error_type: string
  error_message: string
  error_stack?: string
  user_email?: string
  referral_link_id?: string
  form_step: number
  form_data?: any
  timestamp: string
  user_agent?: string
}

export async function logFormError(errorLog: ErrorLog) {
  try {
    const supabase = createServiceClient()
    
    // Log to console for development
    console.error('🚨 FORM ERROR:', {
      type: errorLog.error_type,
      message: errorLog.error_message,
      step: errorLog.form_step,
      timestamp: errorLog.timestamp
    })
    
    // Save to database error_logs table
    await supabase
      .from('error_logs')
      .insert({
        error_type: errorLog.error_type,
        error_message: errorLog.error_message,
        error_stack: errorLog.error_stack,
        context: {
          form_step: errorLog.form_step,
          user_email: errorLog.user_email,
          referral_link_id: errorLog.referral_link_id,
          form_data: errorLog.form_data,
          user_agent: errorLog.user_agent
        },
        created_at: errorLog.timestamp
      })
  } catch (logError) {
    // If logging fails, at least console.error it
    console.error('Failed to log error:', logError)
  }
}

