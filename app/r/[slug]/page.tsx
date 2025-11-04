import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ReferralForm from './referral-form'

interface PageProps {
  params: {
    slug: string
  }
}

export default async function ReferralPage({ params }: PageProps) {
  const supabase = await createClient()

  // Fetch the referral link data
  const { data: referralLink, error } = await supabase
    .from('referral_links')
    .select(`
      *,
      profiles:user_id (
        full_name,
        company_name
      )
    `)
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single()

  if (error || !referralLink) {
    notFound()
  }

  // Fetch active services
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('name')

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Get Your Free Estimate</h1>
          {referralLink.profiles && (
            <p className="text-muted-foreground text-lg">
              Referred by {referralLink.profiles.company_name || referralLink.profiles.full_name}
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

