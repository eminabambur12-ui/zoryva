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
      '1 bank account',
      '3-month transaction history',
      'Basic budgets',
      'Manual transaction entry',
    ],
  },
  pro: {
    name: 'Pro',
    price: 19,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    features: [
      'Unlimited bank accounts',
      'Full transaction history',
      'Smart budgets & goals',
      'AI Coach — 50 messages/month',
      'Personal finance analytics',
      'Business P&L tracking',
      'Priority support',
    ],
  },
  business: {
    name: 'Business',
    price: 39,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID!,
    features: [
      'Everything in Pro',
      'Unlimited AI Coach messages',
      'Invoice tracker',
      'Profit margin analytics',
      'Tax export (CSV)',
      'Team access (2 seats)',
      'Dedicated support',
    ],
  },
}
