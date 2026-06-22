'use client'

import { useState } from 'react'

interface AllocationItem { asset: string; percentage: number; examples: string }
interface Plan {
  name: string
  tagline: string
  risk: string
  expected_annual_return_pct: number
  projected_1yr: number
  projected_5yr: number
  projected_10yr: number
  monthly_contribution_rec: number
  allocation: AllocationItem[]
  best_for: string
  key_advantages: string[]
  key_risks: string[]
  first_steps: string[]
  zara_note: string
}
interface InvestResult {
  plans: Plan[]
  zara_recommendation: string
  tax_considerations: string
  emergency_fund_note: string
}

const RISK_COLORS: Record<string, string> = {
  'Very Low': 'text-emerald-600 bg-emerald-50 border-emerald-200',
  'Low': 'text-teal-600 bg-teal-50 border-teal-200',
  'Medium': 'text-amber-600 bg-amber-50 border-amber-200',
  'High': 'text-orange-600 bg-orange-50 border-orange-200',
  'Very High': 'text-rose-600 bg-rose-50 border-rose-200',
}

const PLAN_COLORS = ['bg-emerald-50 border-emerald-200', 'bg-blue-50 border-blue-200', 'bg-violet-50 border-violet-200', 'bg-rose-50 border-rose-200']

export default function InvestPage() {
  const [amount, setAmount] = useState('')
  const [timeframe, setTimeframe] = useState('10')
  const [existing, setExisting] = useState('')
  const [goals, setGoals] = useState('')
  const [result, setResult] = useState<InvestResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)

  async function generatePlans() {
    if (!amount) return
    setLoading(true)
    try {
      const res = await fetch('/api/ai/invest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(amount.replace(/,/g, '')),
          timeframe_years: Number(timeframe),
          existing_investments: existing,
          goals,
        }),
      })
      const data = await res.json()
      if (!data.error) {
        setResult(data)
        setSelected(2) // Default to Growth
      }
    } finally {
      setLoading(false)
    }
  }

  if (!result) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-widest text-rose-deep mb-1">Investment Planning</div>
          <h1 className="font-serif text-3xl font-semibold text-charcoal mb-2">What should I do with my money?</h1>
          <p className="text-sm text-muted">Tell Zara how much you want to invest and she'll build 4 personalized plans.</p>
        </div>

        <div className="bg-white border border-rose/10 rounded-3xl p-6 shadow-card space-y-5">
          <div>
            <label className="text-xs font-semibold text-charcoal mb-1.5 block">How much do you want to invest?</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-muted">$</div>
              <input
                type="text"
                placeholder="5,000"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-rose/15 rounded-xl text-charcoal placeholder-muted/60 focus:outline-none focus:border-rose/40 bg-cream text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal mb-2 block">Time horizon</label>
            <div className="grid grid-cols-4 gap-2">
              {['1', '3', '5', '10', '20', '30'].slice(0, 4).map(yr => (
                <button
                  key={yr}
                  onClick={() => setTimeframe(yr)}
                  className={`py-2 rounded-xl border text-xs font-semibold transition-all ${timeframe === yr ? 'bg-gradient-dark text-white border-transparent' : 'bg-cream border-rose/15 text-charcoal'}`}
                >
                  {yr} yr{yr !== '1' ? 's' : ''}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['20', '30'].map(yr => (
                <button
                  key={yr}
                  onClick={() => setTimeframe(yr)}
                  className={`py-2 rounded-xl border text-xs font-semibold transition-all ${timeframe === yr ? 'bg-gradient-dark text-white border-transparent' : 'bg-cream border-rose/15 text-charcoal'}`}
                >
                  {yr} yrs
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal mb-1.5 block">Existing investments (optional)</label>
            <input
              type="text"
              placeholder="401k, index funds, real estate..."
              value={existing}
              onChange={e => setExisting(e.target.value)}
              className="w-full px-4 py-2.5 border border-rose/15 rounded-xl text-charcoal placeholder-muted/60 focus:outline-none focus:border-rose/40 bg-cream text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal mb-1.5 block">What's this money for?</label>
            <input
              type="text"
              placeholder="Retire early, down payment, wealth building..."
              value={goals}
              onChange={e => setGoals(e.target.value)}
              className="w-full px-4 py-2.5 border border-rose/15 rounded-xl text-charcoal placeholder-muted/60 focus:outline-none focus:border-rose/40 bg-cream text-sm"
            />
          </div>

          <button
            onClick={generatePlans}
            disabled={!amount || loading}
            className="w-full py-3.5 bg-gradient-rose text-white rounded-full text-sm font-semibold shadow-rose transition-all hover:-translate-y-px disabled:opacity-40"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Building your plans...
              </span>
            ) : 'Build my investment plans →'}
          </button>
        </div>
      </div>
    )
  }

  const activePlan = selected !== null ? result.plans[selected] : null

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Zara rec */}
      <div className="bg-gradient-dark text-white rounded-3xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-xs">✦</span>
          </div>
          <div className="text-xs font-bold uppercase tracking-widest text-white/50">Zara Recommends</div>
        </div>
        <p className="text-white text-sm leading-relaxed">{result.zara_recommendation}</p>
      </div>

      {/* Plan selector */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {result.plans.map((plan, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`p-3 rounded-2xl border text-center transition-all ${
              selected === i
                ? 'bg-gradient-dark text-white border-transparent shadow-lg'
                : `${PLAN_COLORS[i]} hover:shadow-card`
            }`}
          >
            <div className={`text-xs font-bold ${selected === i ? 'text-white' : 'text-charcoal'}`}>{plan.name}</div>
            <div className={`text-[10px] mt-0.5 ${selected === i ? 'text-white/60' : 'text-muted'}`}>{plan.expected_annual_return_pct}%/yr</div>
          </button>
        ))}
      </div>

      {/* Plan detail */}
      {activePlan && (
        <div className="bg-white border border-rose/10 rounded-3xl p-5 shadow-card mb-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-serif text-xl font-semibold text-charcoal">{activePlan.name}</div>
              <div className="text-sm text-muted">{activePlan.tagline}</div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${RISK_COLORS[activePlan.risk]}`}>
              {activePlan.risk} risk
            </span>
          </div>

          {/* Projections */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: '1 Year', value: activePlan.projected_1yr },
              { label: '5 Years', value: activePlan.projected_5yr },
              { label: '10 Years', value: activePlan.projected_10yr },
            ].map(p => (
              <div key={p.label} className="text-center p-3 bg-cream rounded-xl">
                <div className="font-serif text-xl font-semibold text-charcoal">${p.value.toLocaleString()}</div>
                <div className="text-[10px] text-muted mt-0.5">{p.label}</div>
              </div>
            ))}
          </div>

          {/* Allocation */}
          <div className="mb-4">
            <div className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Allocation</div>
            <div className="space-y-2">
              {activePlan.allocation.map((a, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-charcoal">{a.asset}</span>
                    <span className="text-muted">{a.percentage}%</span>
                  </div>
                  <div className="w-full bg-cream rounded-full h-1.5 mb-0.5">
                    <div className="h-1.5 rounded-full bg-gradient-rose" style={{ width: `${a.percentage}%` }} />
                  </div>
                  <div className="text-[10px] text-faint">{a.examples}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly rec */}
          {activePlan.monthly_contribution_rec > 0 && (
            <div className="bg-rose/5 border border-rose/15 rounded-xl p-3 mb-4">
              <div className="text-xs text-rose-deep font-semibold">
                💡 Invest ${activePlan.monthly_contribution_rec}/month to accelerate this plan
              </div>
            </div>
          )}

          {/* Zara note */}
          <div className="bg-cream rounded-xl p-3 mb-4">
            <div className="text-xs font-bold uppercase tracking-widest text-muted mb-1">Zara's note</div>
            <p className="text-xs text-charcoal leading-relaxed">{activePlan.zara_note}</p>
          </div>

          {/* First steps */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-muted mb-2">First Steps</div>
            <div className="space-y-2">
              {activePlan.first_steps.map((step, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-charcoal">
                  <div className="w-4 h-4 rounded-full bg-rose/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[9px] font-bold text-rose-deep">{i+1}</span>
                  </div>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white border border-rose/10 rounded-2xl p-4 shadow-card">
          <div className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Tax Strategy</div>
          <p className="text-xs text-charcoal leading-relaxed">{result.tax_considerations}</p>
        </div>
        <div className="bg-white border border-rose/10 rounded-2xl p-4 shadow-card">
          <div className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Before Investing</div>
          <p className="text-xs text-charcoal leading-relaxed">{result.emergency_fund_note}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => { setResult(null); setAmount('') }}
          className="flex-1 py-3 border border-rose/20 rounded-full text-sm text-muted hover:text-charcoal hover:border-rose/40 transition-all"
        >
          Start over
        </button>
        <a
          href="/dashboard/coach"
          className="flex-1 py-3 bg-gradient-dark text-white rounded-full text-sm font-semibold text-center"
        >
          Ask Zara more →
        </a>
      </div>
    </div>
  )
}
