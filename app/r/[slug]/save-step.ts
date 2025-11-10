'use server'

import { createServiceClient } from '@/lib/supabase/server'

interface SaveStep1Data {
  referralLinkId: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  consent_unified: boolean
}

export async function saveStep1(data: SaveStep1Data) {
  const supabase = createServiceClient()
  
  const nameParts = data.name.trim().split(' ')
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || ''

  // Check if partial lead already exists for this email and referral link
  const { data: existingLead } = await supabase
    .from('leads')
    .select('id, completion_status')
    .eq('homeowner_email', data.email)
    .eq('referral_id', data.referralLinkId)
    .maybeSingle()

  const leadData = {
    referral_id: data.referralLinkId,
    homeowner_first: firstName,
    homeowner_last: lastName,
    homeowner_email: data.email,
    homeowner_phone: data.phone,
    address_street: data.address,
    city: data.city,
    state: data.state,
    zip: data.zip,
    extra_details: {
      consent_email: data.consent_unified,
      consent_sms: data.consent_unified,
      consent_call: data.consent_unified,
    },
    completion_status: 'step1_complete',
    step1_completed_at: new Date().toISOString(),
    stage: 'submitted',
  }

  if (existingLead) {
    // Update existing partial lead
    const { data: updatedLead, error } = await supabase
      .from('leads')
      .update(leadData)
      .eq('id', existingLead.id)
      .select('id')
      .single()

    return { leadId: updatedLead?.id, error }
  } else {
    // Insert new partial lead
    const { data: newLead, error } = await supabase
      .from('leads')
      .insert(leadData)
      .select('id')
      .single()

    return { leadId: newLead?.id, error }
  }
}

