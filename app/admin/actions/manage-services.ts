'use server'

import { createServiceClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface ServiceData {
  name: string
  description: string | null
  active?: boolean
  featured?: boolean
  display_order?: number | null
}

interface ActionResult {
  success: boolean
  error?: string
  data?: any
}

export async function createService(data: ServiceData): Promise<ActionResult> {
  try {
    const supabase = createServiceClient()

    const { data: newService, error } = await supabase
      .from('services')
      .insert({
        name: data.name,
        description: data.description,
        active: data.active ?? true,
        featured: data.featured ?? false,
        display_order: data.display_order ?? null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating service:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/admin')

    return { success: true, data: newService }
  } catch (error) {
    console.error('Unexpected error in createService:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function updateService(serviceId: string, data: Partial<ServiceData>): Promise<ActionResult> {
  try {
    const supabase = createServiceClient()

    const { data: updatedService, error } = await supabase
      .from('services')
      .update(data)
      .eq('id', serviceId)
      .select()
      .single()

    if (error) {
      console.error('Error updating service:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/admin')

    return { success: true, data: updatedService }
  } catch (error) {
    console.error('Unexpected error in updateService:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function deleteService(serviceId: string): Promise<ActionResult> {
  try {
    const supabase = createServiceClient()

    // Check if service has sub-services
    const { count } = await supabase
      .from('sub_services')
      .select('*', { count: 'exact', head: true })
      .eq('service_id', serviceId)

    if (count && count > 0) {
      return {
        success: false,
        error: `Cannot delete service with ${count} sub-service(s). Please delete sub-services first or deactivate the service instead.`
      }
    }

    // Check if service has leads
    const { count: leadCount } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('service_id', serviceId)

    if (leadCount && leadCount > 0) {
      return {
        success: false,
        error: `Cannot delete service with ${leadCount} associated lead(s). Please deactivate the service instead.`
      }
    }

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId)

    if (error) {
      console.error('Error deleting service:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/admin')

    return { success: true }
  } catch (error) {
    console.error('Unexpected error in deleteService:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function toggleServiceActive(serviceId: string, active: boolean): Promise<ActionResult> {
  try {
    const supabase = createServiceClient()

    const { error } = await supabase
      .from('services')
      .update({ active })
      .eq('id', serviceId)

    if (error) {
      console.error('Error toggling service active status:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/')
    revalidatePath('/admin')

    return { success: true }
  } catch (error) {
    console.error('Unexpected error in toggleServiceActive:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

