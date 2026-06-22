'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Opportunity {
  rank: number
  title: string
  category: 'make_more' | 'keep_more' | 'build_wealth'
  annual_impact: number
  description: string
  urgency: 'today' | 'this_week' | 'this_month'
}

interface DailyBriefing {
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

interface Analysis {
  greeting: string
  headline: string
  opportunities: Opportunity[]
  daily_briefing: DailyBriefing
  total_annual_impact: number
}

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  make_more: { label: 'Make more', color: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
  keep_more: { label: 'Keep more', color: 'text-blue-700 bg-blue-50 border-blue-100' },
  build_wealth: { label: 'Build wealth', color: 'text-violet-700 bg-violet-50 border-violet-100' },
}

const URGENCY_LABELS: Record<string, string> = {
  today: '🔴 Do today',
  this_week: '🟡 This week',
  this_month: '🟢 This month',
}

function LoadingState() {
  const [step, setStep] = useState(0)
  const steps = [
    'Reviewing your transactions...',
    'Analyzing income patterns...',
    'Calculating tax opportunities...',
    'Identifying wealth opportunities...',
    'Generating your daily briefing...',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(s => (s < steps.length - 1 ? s + 1 : s))
    }, 1200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-16 h-16 rounded-full bg-gradient-rose flex items-center justify-center shadow-rose mb-6">
        <span className="text-2xl">✦</span>
      </div>
      <h2 className="font-serif text-2xl font-semibold text-charcoal mb-2">Zara is analyzing your finances</h2>
      <p className="text-muted text-sm mb-8">This takes a few seconds. She reads everything before she speaks.</p>
      <div className="flex flex-col items-center gap-2 w-64">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`flex items-center gap-2 text-sm transition-all duration-500 ${
              i <= step ? 'text-charcoal opacity-100' : 'text-muted opacity-30'
            }`}
          >
            {i < step ? (
              <div className="w-4 h-4 rounded-full bg-rose/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-2.5 h-2.5 text-rose-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : i === step ? (
              <div className="w-4 h-4 rounded-full border-2 border-rose/40 border-t-rose-deep animate-spin flex-shrink-0" />
            ) : (
              <div className="w-4 h-4 rounded-full border border-rose/10 flex-shrink-0" />
            )}
            {s}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DashboardHomePage() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [briefingOpen, setBriefingOpen] = useState(false)

  useEffect(() => {
    fetch('/api/ai/analyze')
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error)
        else setAnalysis(data)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingState />

  if (error || !analysis) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="font-serif text-2xl font-semibold text-charcoal mb-2">Zara needs more data</h2>
        <p className="text-muted text-sm mb-6 text-center max-w-sm">
          Connect your accounts so Zara can analyze your finances and find your opportunities.
        </p>
        <Link href="/dashboard/accounts" className="px-6 py-3 bg-gradient-rose text-white rounded-full text-sm font-semibold shadow-rose">
          Connect accounts →
        </Link>
      </div>
    )
  }

  const briefing = analysis.daily_briefing ?? {}

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Zara greeting */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-rose flex items-center justify-center shadow-rose flex-shrink-0">
            <span className="text-lg">✦</span>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-rose-deep">Zara · Your AI CFO</div>
            <div className="text-xs text-muted">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>

        <div className="bg-white border border-rose/10 rounded-3xl p-6 shadow-card">
          <h1 className="font-serif text-2xl font-semibold text-charcoal mb-1">
            {analysis.greeting}
          </h1>
          <p className="text-charcoal text-lg leading-snug mb-5">
            {analysis.headline}
          </p>

          {/* Opportunities */}
          <div className="space-y-3">
            {(analysis.opportunities ?? []).map((opp) => (
              <div key={opp.rank} className="flex items-start gap-3 p-3 rounded-xl bg-cream hover:bg-rose/5 transition-colors">
                <div className="w-6 h-6 rounded-full bg-rose/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-rose-deep">{opp.rank}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-sm font-semibold text-charcoal">{opp.title}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${CATEGORY_LABELS[opp.category]?.color ?? ''}`}>
                      {CATEGORY_LABELS[opp.category]?.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{opp.description}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <div className="text-sm font-bold text-charcoal">+${(opp.annual_impact ?? 0).toLocaleString()}</div>
                  <div className="text-[10px] text-muted">{URGENCY_LABELS[opp.urgency]}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Total impact */}
          <div className="mt-4 pt-4 border-t border-rose/10 flex items-center justify-between">
            <div className="text-sm text-muted">Total annual impact identified</div>
            <div className="font-serif text-xl font-semibold text-charcoal">
              +${(analysis.total_annual_impact ?? 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* CTA bar */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/dashboard/coach"
          className="flex-1 py-3.5 bg-gradient-dark text-white rounded-full text-sm font-semibold text-center transition-all hover:-translate-y-px shadow-lg"
        >
          Talk to Zara →
        </Link>
        <Link
          href="/dashboard/next-10k"
          className="flex-1 py-3.5 bg-white border border-rose/20 text-charcoal rounded-full text-sm font-semibold text-center transition-all hover:border-rose/40 hover:shadow-card"
        >
          Find my next $10K →
        </Link>
      </div>

      {/* Daily Briefing */}
      <div className="bg-white border border-rose/10 rounded-3xl shadow-card overflow-hidden mb-6">
        <button
          onClick={() => setBriefingOpen(b => !b)}
          className="w-full flex items-center justify-between p-5 text-left"
        >
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-rose-deep mb-0.5">Daily Briefing</div>
            <div className="text-sm font-semibold text-charcoal">Your financial snapshot for today</div>
          </div>
          <div className={`w-6 h-6 rounded-full border border-rose/20 flex items-center justify-center transition-transform ${briefingOpen ? 'rotate-180' : ''}`}>
            <svg className="w-3 h-3 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {briefingOpen && (
          <div className="px-5 pb-5 space-y-4 border-t border-rose/10">
            {/* Key numbers */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="text-center p-3 bg-cream rounded-xl">
                <div className="font-serif text-2xl font-semibold text-charcoal">${briefing.safe_spend ?? 0}</div>
                <div className="text-xs text-muted mt-0.5">Safe to spend today</div>
              </div>
              <div className="text-center p-3 bg-cream rounded-xl">
                <div className="font-serif text-2xl font-semibold text-charcoal">${briefing.savings_rec ?? 0}</div>
                <div className="text-xs text-muted mt-0.5">Save this week</div>
              </div>
              <div className="text-center p-3 bg-cream rounded-xl">
                <div className="font-serif text-2xl font-semibold text-charcoal">${briefing.tax_allocation ?? 0}</div>
                <div className="text-xs text-muted mt-0.5">Tax reserve needed</div>
              </div>
            </div>

            {/* Bills */}
            {(briefing.upcoming_bills ?? []).length > 0 && (
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Upcoming Bills</div>
                <div className="space-y-2">
                  {briefing.upcoming_bills.map((bill, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-charcoal">{bill.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-muted text-xs">due in {bill.due_in_days}d</span>
                        <span className="font-semibold text-charcoal">${bill.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {(briefing.wealth_actions ?? []).length > 0 && (
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Wealth Actions</div>
                <div className="space-y-2">
                  {briefing.wealth_actions.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-deep flex-shrink-0" />
                      <span className="text-charcoal flex-1">{a.action}</span>
                      <span className="text-emerald-600 text-xs font-semibold">{a.impact}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Feature nav cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { href: '/dashboard/wealth-score', icon: '📊', label: 'Wealth Score', desc: 'Track your potential' },
          { href: '/dashboard/simulator', icon: '🔮', label: 'Future Simulator', desc: 'Model life decisions' },
          { href: '/dashboard/business', icon: '💼', label: 'Business Intelligence', desc: 'Revenue & profit analysis' },
          { href: '/dashboard/invest', icon: '📈', label: 'Investment Planning', desc: 'Grow your money' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 p-4 bg-white border border-rose/10 rounded-2xl shadow-card hover:border-rose/30 hover:-translate-y-px transition-all"
          >
            <div className="text-2xl">{item.icon}</div>
            <div>
              <div className="text-sm font-semibold text-charcoal">{item.label}</div>
              <div className="text-xs text-muted">{item.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
