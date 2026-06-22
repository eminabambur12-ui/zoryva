import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

// Stripe requires raw body for signature verification
export const runtime = 'nodejs'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

  try {
    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const customerId = session.customer as string
        const subscriptionId = session.subscription as string

        // Get the subscription to determine plan
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const priceId = subscription.items.data[0]?.price.id

        // Determine plan type from price ID
        let planType = 'pro'
        if (priceId === process.env.STRIPE_BUSINESS_PRICE_ID) planType = 'business'
        if (priceId === process.env.STRIPE_PRO_PRICE_ID) planType = 'pro'
        if (priceId === process.env.STRIPE_STARTER_PRICE_ID) planType = 'starter'

        // Find user by customer ID or from metadata
        const userId = subscription.metadata?.supabase_user_id ?? session.metadata?.supabase_user_id

        if (userId) {
          await supabase.from('profiles').update({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_status: 'active',
            plan_type: planType,
          }).eq('id', userId)
        } else if (customerId) {
          await supabase.from('profiles').update({
            stripe_subscription_id: subscriptionId,
            subscription_status: 'active',
            plan_type: planType,
          }).eq('stripe_customer_id', customerId)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string
        const priceId = subscription.items.data[0]?.price.id

        let planType = 'pro'
        if (priceId === process.env.STRIPE_BUSINESS_PRICE_ID) planType = 'business'
        if (priceId === process.env.STRIPE_STARTER_PRICE_ID) planType = 'starter'

        await supabase.from('profiles').update({
          subscription_status: subscription.status,
          plan_type: subscription.status === 'active' ? planType : 'free',
        }).eq('stripe_customer_id', customerId)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        await supabase.from('profiles').update({
          subscription_status: 'canceled',
          plan_type: 'free',
          stripe_subscription_id: null,
        }).eq('stripe_customer_id', customerId)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string
        await supabase.from('profiles').update({ subscription_status: 'past_due' }).eq('stripe_customer_id', customerId)
        break
      }
    }
  } catch (err: any) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
