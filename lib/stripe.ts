import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      'Daily Safe Spend number',
      'Personal income & expense tracking',
      'Up to 3 budget categories',
      'Basic savings goal',
      'Tax reserve estimate',
      'AI Coach — 20 messages/month',
    ],
  },
  starter: {
    name: 'Starter',
    price: 19,
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
    features: [
      'Daily Safe Spend number',
      'Personal income & expense tracking',
      'Up to 3 budget categories',
      'Basic savings goal',
      'Tax reserve estimate',
      'AI Coach — 20 messages/month',
    ],
  },
  growth: {
    name: 'Growth',
    price: 49,
    priceId: process.env.STRIPE_GROWTH_PRICE_ID!,
    features: [
      'Everything in Starter',
      'Business profit & loss tracking',
      'Pay Yourself Calculator',
      'Unlimited budget categories',
      'Goal simulator (savings, debt, home)',
      'AI Coach — 100 messages/month',
      'Business vs. personal split view',
      'Invoice tracking',
    ],
  },
  pro: {
    name: 'Pro',
    price: 99,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    features: [
      'Everything in Growth',
      'Unlimited AI Coach messages',
      'Multiple income stream tracking',
      'Deep tax planning tools',
      'Cash flow projections',
      'Quarterly financial review with Zara',
      'CSV export for accountants',
      'Priority support',
    ],
  },
}
