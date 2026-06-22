import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Get priceId from form POST or JSON body
    let priceId: string | null = null
    const contentType = request.headers.get('content-type') ?? ''

    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      priceId = formData.get('priceId') as string
    } else {
      const body = await request.json()
      priceId = body.priceId
    }

    if (!priceId) {
      return NextResponse.json({ error: 'Missing priceId' }, { status: 400 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

    // Get or create Stripe customer
    let stripeCustomerId: string | null = null

    if (user) {
      const { data: profile } = await supabase.from('profiles').select('stripe_customer_id').eq('id', user.id).single()
      stripeCustomerId = profile?.stripe_customer_id ?? null

      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: { supabase_user_id: user.id },
        })
        stripeCustomerId = customer.id
        await supabase.from('profiles').update({ stripe_customer_id: customer.id }).eq('id', user.id)
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer: stripeCustomerId ?? undefined,
      customer_email: !stripeCustomerId ? user?.email : undefined,
      allow_promotion_codes: true,
      subscription_data: {
        metadata: { supabase_user_id: user?.id ?? '' },
      },
      success_url: `${siteUrl}/dashboard?subscribed=true`,
      cancel_url: `${siteUrl}/pricing?canceled=true`,
    })

    // For form POST, redirect; for JSON, return URL
    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      return NextResponse.redirect(session.url!, { status: 303 })
    }

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
