'use server'

import { createServiceClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface UpdateServiceFeaturedParams {
  serviceId: string
  featured: boolean
  displayOrder?: number
}

interface UpdateResult {
  success: boolean
  error?: string
  currentFeaturedCount?: number
}

export async function updateServiceFeatured({
  serviceId,
  featured,
  displayOrder
}: UpdateServiceFeaturedParams): Promise<UpdateResult> {
  try {
    const supabase = createServiceClient()

    // If setting to featured, check current featured count
    if (featured) {
      const { count, error: countError } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('featured', true)
        .neq('id', serviceId) // Exclude current service

      if (countError) {
        console.error('Error counting featured services:', countError)
        return { success: false, error: 'Failed to check featured services count' }
      }

      // Limit to 12 featured services
      if (count && count >= 12) {
        return {
          success: false,
          error: 'Maximum 12 services can be featured on the homepage',
          currentFeaturedCount: count
        }
      }
    }

    // Update the service
    const updateData: { featured: boolean; display_order?: number } = { featured }
    if (displayOrder !== undefined) {
      updateData.display_order = displayOrder
    }

    const { error: updateError } = await supabase
      .from('services')
      .update(updateData)
      .eq('id', serviceId)

    if (updateError) {
      console.error('Error updating service:', updateError)
      return { success: false, error: 'Failed to update service' }
    }

    // Revalidate the homepage and admin page
    revalidatePath('/')
    revalidatePath('/admin')

    return { success: true }
  } catch (error) {
    console.error('Unexpected error in updateServiceFeatured:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function updateServiceDisplayOrder(
  serviceId: string,
  displayOrder: number
): Promise<UpdateResult> {
  try {
    const supabase = createServiceClient()

    const { error } = await supabase
      .from('services')
      .update({ display_order: displayOrder })
      .eq('id', serviceId)

    if (error) {
      console.error('Error updating display order:', error)
      return { success: false, error: 'Failed to update display order' }
    }

    // Revalidate the homepage and admin page
    revalidatePath('/')
    revalidatePath('/admin')

    return { success: true }
  } catch (error) {
    console.error('Unexpected error in updateServiceDisplayOrder:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

