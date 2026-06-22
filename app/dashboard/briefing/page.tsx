'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface BriefingData {
  greeting: string
  headline: string
  opportunities: Array<{
    rank: number
    title: string
    category: string
    annual_impact: number
    description: string
    urgency: string
  }>
  daily_briefing: {
    safe_spend: number
    safe_spend_note: string
    savings_rec: number
    savings_rec_note: string
    tax_allocation: number
    tax_allocation_note: string
    upcoming_bills: Array<{ name: string; amount: number; due_in_days: number }>
    business_actions: Array<{ action: string; impact: string; urgency: string }>
    wealth_actions: Array<{ action: string; impact: string; urgency: string }>
  }
  total_annual_impact: number
  analysis_date: string
}

export default function DailyBriefingPage() {
  const [data, setData] = useState<BriefingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  async function fetchBriefing() {
    const res = await fetch('/api/ai/analyze')
    const json = await res.json()
    if (!json.error) setData(json)
  }

  useEffect(() => {
    fetchBriefing().finally(() => setLoading(false))
  }, [])

  async function refresh() {
    setRefreshing(true)
    // Force refresh by clearing cache (simplified: just re-fetch)
    await fetch('/api/ai/analyze')
    await fetchBriefing()
    setRefreshing(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 rounded-full border-2 border-rose/30 border-t-rose-deep animate-spin" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="text-4xl mb-4">📅</div>
        <h2 className="font-serif text-2xl font-semibold text-charcoal mb-2">No briefing yet</h2>
        <p className="text-sm text-muted mb-6">Connect your accounts so Zara can generate your daily briefing.</p>
        <Link href="/onboarding" className="px-6 py-3 bg-gradient-rose text-white rounded-full text-sm font-semibold shadow-rose">
          Get started →
        </Link>
      </div>
    )
  }

  const b = data.daily_briefing
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-rose-deep mb-0.5">Daily Wealth Briefing</div>
          <div className="font-serif text-2xl font-semibold text-charcoal">{today}</div>
        </div>
        <button
          onClick={refresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 border border-rose/20 rounded-full text-xs text-muted hover:border-rose/40 hover:text-charcoal transition-all disabled:opacity-50"
        >
          <svg className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Zara's message */}
      <div className="bg-gradient-dark text-white rounded-3xl p-5 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-sm">✦</span>
          </div>
          <div className="text-xs font-bold uppercase tracking-widest text-white/50">Zara</div>
        </div>
        <div className="font-serif text-xl font-semibold mb-1">{data.greeting}</div>
        <p className="text-white/80 text-sm">{data.headline}</p>
      </div>

      {/* Today's numbers */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white border border-rose/10 rounded-2xl p-4 shadow-card text-center">
          <div className="text-xs text-muted mb-1">Safe to spend</div>
          <div className="font-serif text-2xl font-semibold text-charcoal">${b.safe_spend}</div>
          <div className="text-[10px] text-faint mt-0.5">today</div>
        </div>
        <div className="bg-white border border-rose/10 rounded-2xl p-4 shadow-card text-center">
          <div className="text-xs text-muted mb-1">Save</div>
          <div className="font-serif text-2xl font-semibold text-charcoal">${b.savings_rec}</div>
          <div className="text-[10px] text-faint mt-0.5">this week</div>
        </div>
        <div className="bg-white border border-rose/10 rounded-2xl p-4 shadow-card text-center">
          <div className="text-xs text-muted mb-1">Tax reserve</div>
          <div className="font-serif text-2xl font-semibold text-charcoal">${b.tax_allocation}</div>
          <div className="text-[10px] text-faint mt-0.5">set aside</div>
        </div>
      </div>

      {/* Opportunities */}
      {data.opportunities.length > 0 && (
        <div className="bg-white border border-rose/10 rounded-2xl shadow-card mb-5 overflow-hidden">
          <div className="p-4 border-b border-rose/10">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-widest text-muted">Today's Opportunities</div>
              <div className="text-xs font-semibold text-rose-deep">+${data.total_annual_impact.toLocaleString()}/yr total</div>
            </div>
          </div>
          <div className="divide-y divide-rose/5">
            {data.opportunities.map((opp) => (
              <div key={opp.rank} className="flex items-start gap-3 p-4">
                <div className="w-5 h-5 rounded-full bg-rose/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[9px] font-bold text-rose-deep">{opp.rank}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-charcoal">{opp.title}</div>
                  <div className="text-xs text-muted mt-0.5">{opp.description}</div>
                </div>
                <div className="text-xs font-bold text-charcoal flex-shrink-0">+${opp.annual_impact.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bills */}
      {b.upcoming_bills?.length > 0 && (
        <div className="bg-white border border-rose/10 rounded-2xl shadow-card mb-5 overflow-hidden">
          <div className="p-4 border-b border-rose/10">
            <div className="text-xs font-bold uppercase tracking-widest text-muted">Upcoming Bills</div>
          </div>
          <div className="divide-y divide-rose/5">
            {b.upcoming_bills.map((bill, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3">
                <div>
                  <div className="text-sm font-semibold text-charcoal">{bill.name}</div>
                  <div className="text-xs text-muted">Due in {bill.due_in_days} day{bill.due_in_days !== 1 ? 's' : ''}</div>
                </div>
                <div className="text-sm font-semibold text-charcoal">${bill.amount}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wealth actions */}
      {b.wealth_actions?.length > 0 && (
        <div className="bg-white border border-rose/10 rounded-2xl shadow-card mb-5 overflow-hidden">
          <div className="p-4 border-b border-rose/10">
            <div className="text-xs font-bold uppercase tracking-widest text-muted">Wealth Actions</div>
          </div>
          <div className="divide-y divide-rose/5">
            {b.wealth_actions.map((a, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-deep flex-shrink-0" />
                <div className="flex-1 text-sm text-charcoal">{a.action}</div>
                <div className="text-xs font-semibold text-emerald-600">{a.impact}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Business actions */}
      {b.business_actions?.length > 0 && (
        <div className="bg-white border border-rose/10 rounded-2xl shadow-card mb-6 overflow-hidden">
          <div className="p-4 border-b border-rose/10">
            <div className="text-xs font-bold uppercase tracking-widest text-muted">Business Actions</div>
          </div>
          <div className="divide-y divide-rose/5">
            {b.business_actions.map((a, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                <div className="flex-1 text-sm text-charcoal">{a.action}</div>
                <div className="text-xs font-semibold text-charcoal">{a.impact}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Link
        href="/dashboard/coach"
        className="block w-full py-3.5 bg-gradient-dark text-white rounded-full text-sm font-semibold text-center shadow-lg"
      >
        Discuss this with Zara →
      </Link>
    </div>
  )
}
