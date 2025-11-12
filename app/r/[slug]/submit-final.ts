'use server'

import { createServiceClient } from '@/lib/supabase/server'
import { logFormError } from './error-logger'

interface FinalSubmissionData {
  leadId: string
  email: string
  phone: string
  timeline?: string | null
  notes?: string | null
  budget?: string | null
  imageFilePaths: string[]
  consent_terms: boolean
}

export async function submitFinalLead(rawData: FinalSubmissionData) {
  const supabase = createServiceClient() // Service role, server-only
  
  try {
    // 1. VALIDATE INPUT
    if (!rawData.leadId || !rawData.email || !rawData.phone) {
      await logFormError({
        error_type: 'VALIDATION_ERROR',
        error_message: 'Missing required fields',
        form_step: 3,
        timestamp: new Date().toISOString()
      })
      return { error: { message: 'Invalid submission data' } }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(rawData.email)) {
      return { error: { message: 'Invalid email format' } }
    }

    // 2. OWNERSHIP VERIFICATION - Verify lead exists and belongs to this submission
    const { data: existingLead, error: fetchError } = await supabase
      .from('leads')
      .select('id, homeowner_email, homeowner_phone, completion_status, created_at, extra_details')
      .eq('id', rawData.leadId)
      .single()

    if (fetchError || !existingLead) {
      await logFormError({
        error_type: 'LEAD_NOT_FOUND',
        error_message: `Lead ${rawData.leadId} not found`,
        form_step: 3,
        timestamp: new Date().toISOString()
      })
      return { error: { message: 'Lead not found' } }
    }

    // 3. IDENTITY VERIFICATION - Email/phone must match
    if (existingLead.homeowner_email !== rawData.email || 
        existingLead.homeowner_phone !== rawData.phone) {
      await logFormError({
        error_type: 'IDENTITY_MISMATCH',
        error_message: 'Email/phone mismatch',
        user_email: rawData.email,
        form_step: 3,
        timestamp: new Date().toISOString()
      })
      return { error: { message: 'Invalid submission - identity verification failed' } }
    }

    // 4. STATE PROTECTION - Prevent double-submission
    if (existingLead.completion_status === 'submitted') {
      await logFormError({
        error_type: 'ALREADY_SUBMITTED',
        error_message: 'Lead already submitted',
        user_email: rawData.email,
        form_step: 3,
        timestamp: new Date().toISOString()
      })
      return { error: { message: 'This lead has already been submitted' } }
    }

    // 5. TIME WINDOW CHECK - Only allow updates within 2 hours of creation
    const createdAt = new Date(existingLead.created_at)
    const now = new Date()
    const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)
    
    if (hoursSinceCreation > 2) {
      await logFormError({
        error_type: 'SUBMISSION_EXPIRED',
        error_message: `Submission window expired (${hoursSinceCreation.toFixed(2)} hours)`,
        user_email: rawData.email,
        form_step: 3,
        timestamp: new Date().toISOString()
      })
      return { error: { message: 'Submission window has expired. Please start over.' } }
    }

    // 6. PREPARE UPDATE - ONLY whitelisted fields
    const updatePayload = {
      timeline: rawData.timeline || null,
      notes: rawData.notes || null,
      extra_details: {
        ...(existingLead.extra_details || {}),
        budget_range: rawData.budget || null,
        attachments: rawData.imageFilePaths,
        consent_terms: rawData.consent_terms
      },
      completion_status: 'submitted', // Mark as complete
      stage: 'submitted',
      updated_at: new Date().toISOString()
    }

    console.log('🔐 Secure update starting for lead:', rawData.leadId)

    // 7. PRIVILEGED UPDATE using service role
    const { data: updated, error: updateError } = await supabase
      .from('leads')
      .update(updatePayload)
      .eq('id', rawData.leadId)
      .select()
      .single()

    if (updateError) {
      console.error('❌ Secure update failed:', updateError)
      await logFormError({
        error_type: 'DATABASE_UPDATE_FAILED',
        error_message: updateError.message,
        user_email: rawData.email,
        form_step: 3,
        form_data: { leadId: rawData.leadId },
        timestamp: new Date().toISOString()
      })
      return { error: updateError }
    }

    console.log('✅ Secure update successful:', updated)

    // 8. AUDIT LOG - Track successful submission
    try {
      await supabase.from('lead_audits').insert({
        lead_id: rawData.leadId,
        action: 'final_submission',
        previous_status: existingLead.completion_status,
        new_status: 'submitted',
        updated_fields: Object.keys(updatePayload),
        created_at: new Date().toISOString()
      })
    } catch (auditError) {
      // Don't fail the submission if audit logging fails
      console.error('⚠️ Audit log failed (non-critical):', auditError)
    }

    console.log('🎉 Final submission completed successfully!')
    return { success: true, leadId: rawData.leadId }

  } catch (error: any) {
    console.error('❌ FATAL ERROR in submitFinalLead:', error)
    await logFormError({
      error_type: 'SUBMISSION_FATAL_ERROR',
      error_message: error.message,
      error_stack: error.stack,
      form_step: 3,
      timestamp: new Date().toISOString()
    })
    return { error: { message: 'Submission failed. Please try again.' } }
  }
}

