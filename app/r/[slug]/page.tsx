import { notFound } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import ReferralForm from './referral-form'
import { trackReferralClick } from './actions'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  params: {
    slug: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function ReferralPage({ params, searchParams }: PageProps) {
  // Use service role client to bypass RLS for public referral pages
  const supabase = createServiceClient()

  // Fetch the referral link data
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

  if (error || !referralLink) {
    notFound()
  }

  // Track click
  try {
    await trackReferralClick({
      slug: params.slug,
      searchParams
    })
  } catch {
    // Don't fail the page if tracking fails
  }

  // Fetch active services and sub-services
  const [{ data: services }, { data: subServices }] = await Promise.all([
    supabase
      .from('services')
      .select('*')
      .eq('active', true)
      .order('name'),
    supabase
      .from('sub_services')
      .select('*')
      .eq('active', true)
      .order('name')
  ])

  return (
    <div className="min-h-screen bg-background py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 sm:mb-8 text-center px-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Get Your Free Estimate</h1>
          {referralLink.profiles && (
            <p className="text-muted-foreground text-base sm:text-lg">
              Referred by {referralLink.profiles.name || referralLink.profiles.handle}
            </p>
          )}
        </div>

        <ReferralForm 
          referralLinkId={referralLink.id}
          services={services || []}
          subServices={subServices || []}
        />
      </div>
    </div>
  )
}

