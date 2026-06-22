'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const CONNECTORS = [
  {
    id: 'plaid',
    name: 'Bank accounts',
    description: 'Chase, BofA, Wells Fargo & more',
    icon: '🏦',
    badge: 'Recommended',
    action: 'plaid',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payments, subscriptions, revenue',
    icon: '💳',
    badge: null,
    action: 'oauth',
  },
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Store revenue, orders, products',
    icon: '🛍️',
    badge: null,
    action: 'oauth',
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    description: 'Business financials & expenses',
    icon: '📊',
    badge: null,
    action: 'oauth',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Payments & transfers',
    icon: '🔵',
    badge: null,
    action: 'oauth',
  },
  {
    id: 'square',
    name: 'Square',
    description: 'POS sales & business income',
    icon: '⬛',
    badge: null,
    action: 'oauth',
  },
  {
    id: 'venmo',
    name: 'Venmo',
    description: 'P2P transfers & payments',
    icon: '💸',
    badge: null,
    action: 'oauth',
  },
  {
    id: 'manual',
    name: 'Enter manually',
    description: 'Add transactions by hand',
    icon: '✏️',
    badge: null,
    action: 'manual',
  },
]

export default function OnboardingConnectPage() {
  const router = useRouter()
  const supabase = createClient()
  const [connected, setConnected] = useState<Set<string>>(new Set())
  const [connecting, setConnecting] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleConnect(connector: typeof CONNECTORS[0]) {
    setConnecting(connector.id)
    // Plaid Link would initialize here with a real Plaid token
    // For now, simulate connection
    await new Promise(r => setTimeout(r, 1200))
    setConnected(prev => new Set([...Array.from(prev), connector.id]))
    setConnecting(null)

    // Save to connected_accounts
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('connected_accounts').upsert({
        user_id: user.id,
        provider: connector.id,
        account_name: connector.name,
        account_type: 'checking',
        is_active: true,
        last_synced_at: new Date().toISOString(),
      }, { onConflict: 'user_id,provider,provider_account_id' })
    }
  }

  async function handleContinue() {
    setLoading(true)
    router.push('/onboarding/profile')
  }

  return (
    <div>
      <div className="text-center mb-10">
        <div className="text-xs font-bold uppercase tracking-widest text-rose-deep mb-3">Step 1 of 3</div>
        <h1 className="font-serif text-4xl font-semibold text-charcoal mb-3">
          Connect your accounts
        </h1>
        <p className="text-muted text-base max-w-md mx-auto leading-relaxed">
          Zara needs to see your real financial data to give you personalized advice.
          Connect what you have — you can always add more later.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {CONNECTORS.map((c) => {
          const isConnected = connected.has(c.id)
          const isConnecting = connecting === c.id
          return (
            <button
              key={c.id}
              onClick={() => !isConnected && handleConnect(c)}
              disabled={isConnecting}
              className={`relative flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                isConnected
                  ? 'bg-rose/5 border-rose/30'
                  : 'bg-white border-rose/10 hover:border-rose/30 hover:shadow-card'
              }`}
            >
              <div className="text-2xl flex-shrink-0">{c.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-charcoal">{c.name}</span>
                  {c.badge && (
                    <span className="px-1.5 py-0.5 bg-rose/10 text-rose-deep text-[10px] font-bold rounded-full">
                      {c.badge}
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted mt-0.5">{c.description}</div>
              </div>
              <div className="flex-shrink-0">
                {isConnecting ? (
                  <div className="w-5 h-5 rounded-full border-2 border-rose/30 border-t-rose-deep animate-spin" />
                ) : isConnected ? (
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-rose/20 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {connected.size > 0 && (
        <div className="bg-rose/5 border border-rose/20 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-rose/10 flex items-center justify-center flex-shrink-0">
            <span className="text-sm">✨</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-charcoal">
              {connected.size} account{connected.size > 1 ? 's' : ''} connected
            </div>
            <div className="text-xs text-muted">
              Zara will start analyzing your data in the background.
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleContinue}
          disabled={loading}
          className="flex-1 py-3.5 bg-gradient-dark text-white rounded-full text-sm font-semibold transition-all hover:-translate-y-px disabled:opacity-50"
        >
          {loading ? 'Loading...' : connected.size > 0 ? `Continue with ${connected.size} account${connected.size > 1 ? 's' : ''} →` : 'Continue →'}
        </button>
      </div>
      <p className="text-center text-xs text-faint mt-4">
        Bank-level encryption · We never store your credentials · Cancel any time
      </p>
    </div>
  )
}
