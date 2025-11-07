import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ReferralForm from './referral-form'
import { trackReferralClick } from './actions'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: {
    slug: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function ReferralPage({ params, searchParams }: PageProps) {
  console.log('=== REFERRAL PAGE DEBUG ===')
  console.log('Slug:', params.slug)
  console.log('Search Params:', searchParams)
  console.log('Environment check:', {
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseUrlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20)
  })
  
  const supabase = await createClient()
  console.log('Supabase client created')

  // Fetch the referral link data
  console.log('Fetching referral link for slug:', params.slug)
  const { data: referralLink, error } = await supabase
    .from('referral_links')
    .select(`
      *,
      profiles:user_id (
        name,
        handle
      )
    `)
    .eq('slug', params.slug)
    .single()

  console.log('Referral link query result:', { 
    hasData: !!referralLink, 
    error: error?.message,
    errorCode: error?.code,
    errorDetails: error?.details,
    errorHint: error?.hint
  })

  if (error) {
    console.error('Supabase error fetching referral link:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    })
    notFound()
  }

  if (!referralLink) {
    console.error('No referral link found for slug:', params.slug)
    notFound()
  }

  console.log('Referral link found:', {
    id: referralLink.id,
    slug: referralLink.slug,
    user_id: referralLink.user_id,
    is_active: referralLink.is_active
  })

  // Track click (cookie will be set client-side)
  console.log('Tracking referral click...')
  try {
    await trackReferralClick({
      slug: params.slug,
      searchParams
    })
    console.log('Click tracked successfully')
  } catch (trackError) {
    console.error('Error tracking click:', trackError)
    // Don't fail the page if tracking fails
  }

  // Fetch active services
  console.log('Fetching active services...')
  const { data: services, error: servicesError } = await supabase
    .from('services')
    .select('*')
    .eq('active', true)
    .order('name')

  if (servicesError) {
    console.error('Error fetching services:', servicesError)
  } else {
    console.log('Services fetched:', services?.length || 0)
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Get Your Free Estimate</h1>
          {referralLink.profiles && (
            <p className="text-muted-foreground text-lg">
              Referred by {referralLink.profiles.name || referralLink.profiles.handle}
            </p>
          )}
        </div>

        <ReferralForm 
          referralLinkId={referralLink.id}
          services={services || []}
        />
      </div>
    </div>
  )
}

