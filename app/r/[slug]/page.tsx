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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-6 sm:py-12 px-3 sm:px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 sm:mb-8 text-center px-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight">
            Get Your Free Estimate
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg mb-2">
            Connect with top-rated professionals in your area
          </p>
          {referralLink.profiles && (
            <p className="text-sm text-muted-foreground">
              Trusted referral from <span className="font-semibold text-foreground">{referralLink.profiles.name || referralLink.profiles.handle}</span>
            </p>
          )}
        </div>

        <ReferralForm 
          referralLinkId={referralLink.id}
          services={services || []}
          subServices={subServices || []}
        />
        
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            🔒 Your information is secure and will never be shared without your consent
          </p>
        </div>
      </div>
    </div>
  )
}

