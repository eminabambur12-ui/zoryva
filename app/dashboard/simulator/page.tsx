'use client'

import { useState } from 'react'

const DECISIONS = [
  { id: 'buy_car', label: 'Buy a car', icon: '🚗', color: 'text-blue-700 bg-blue-50', params: [
    { key: 'price', label: 'Vehicle price', type: 'currency', placeholder: '35000' },
    { key: 'down_payment', label: 'Down payment', type: 'currency', placeholder: '5000' },
    { key: 'loan_term_years', label: 'Loan term (years)', type: 'number', placeholder: '5' },
    { key: 'interest_rate', label: 'Interest rate (%)', type: 'number', placeholder: '6.5' },
  ]},
  { id: 'buy_home', label: 'Buy a home', icon: '🏠', color: 'text-emerald-700 bg-emerald-50', params: [
    { key: 'home_price', label: 'Home price', type: 'currency', placeholder: '550000' },
    { key: 'down_payment_pct', label: 'Down payment (%)', type: 'number', placeholder: '20' },
    { key: 'mortgage_rate', label: 'Mortgage rate (%)', type: 'number', placeholder: '7.1' },
    { key: 'location', label: 'City / area', type: 'text', placeholder: 'Austin, TX' },
  ]},
  { id: 'hire_employee', label: 'Hire someone', icon: '👥', color: 'text-violet-700 bg-violet-50', params: [
    { key: 'role', label: 'Role title', type: 'text', placeholder: 'Marketing manager' },
    { key: 'salary', label: 'Annual salary', type: 'currency', placeholder: '70000' },
    { key: 'expected_revenue_increase', label: 'Expected revenue increase/yr', type: 'currency', placeholder: '150000' },
  ]},
  { id: 'quit_job', label: 'Quit my job', icon: '🚪', color: 'text-rose-700 bg-rose-50', params: [
    { key: 'current_salary', label: 'Current annual salary', type: 'currency', placeholder: '95000' },
    { key: 'runway_months', label: 'Months of savings (runway)', type: 'number', placeholder: '12' },
    { key: 'plan', label: 'What you\'ll do instead', type: 'text', placeholder: 'Grow my consulting business' },
  ]},
  { id: 'start_business', label: 'Start a business', icon: '🚀', color: 'text-amber-700 bg-amber-50', params: [
    { key: 'business_type', label: 'Business type', type: 'text', placeholder: 'SaaS, agency, e-commerce...' },
    { key: 'startup_cost', label: 'Startup cost', type: 'currency', placeholder: '15000' },
    { key: 'monthly_revenue_target', label: 'Monthly revenue target', type: 'currency', placeholder: '10000' },
  ]},
  { id: 'move_cities', label: 'Move cities', icon: '🌆', color: 'text-cyan-700 bg-cyan-50', params: [
    { key: 'current_city', label: 'Current city', type: 'text', placeholder: 'New York, NY' },
    { key: 'target_city', label: 'Moving to', type: 'text', placeholder: 'Austin, TX' },
    { key: 'current_rent', label: 'Current monthly rent', type: 'currency', placeholder: '3200' },
    { key: 'target_rent', label: 'Expected new rent', type: 'currency', placeholder: '2000' },
  ]},
  { id: 'vacation', label: 'Take a vacation', icon: '✈️', color: 'text-sky-700 bg-sky-50', params: [
    { key: 'destination', label: 'Destination', type: 'text', placeholder: 'Italy for 2 weeks' },
    { key: 'total_cost', label: 'Total budget', type: 'currency', placeholder: '8000' },
    { key: 'timing', label: 'When', type: 'text', placeholder: 'In 3 months' },
  ]},
  { id: 'have_children', label: 'Have children', icon: '👶', color: 'text-pink-700 bg-pink-50', params: [
    { key: 'timeline', label: 'Timeline', type: 'text', placeholder: 'Within 2 years' },
    { key: 'childcare_preference', label: 'Childcare plan', type: 'text', placeholder: 'Daycare, stay-home parent...' },
  ]},
  { id: 'invest_amount', label: 'Invest a lump sum', icon: '💰', color: 'text-gold bg-yellow-50', params: [
    { key: 'amount', label: 'Amount to invest', type: 'currency', placeholder: '25000' },
    { key: 'vehicle', label: 'Where (or let Zara decide)', type: 'text', placeholder: 'Index funds, real estate...' },
    { key: 'timeframe_years', label: 'Investment horizon (years)', type: 'number', placeholder: '10' },
  ]},
]

interface SimResult {
  upfront_cost: number
  monthly_cost_change: number
  monthly_income_change: number
  net_monthly_impact: number
  breakeven_months: number
  '5_year_wealth_impact': number
  '10_year_wealth_impact': number
  opportunity_cost: string
  risk_level: string
  timeline: Array<{ period: string; description: string }>
  zara_recommendation: string
  conditions_to_proceed: string[]
  alternatives: string[]
}

export default function SimulatorPage() {
  const [selected, setSelected] = useState<typeof DECISIONS[0] | null>(null)
  const [params, setParams] = useState<Record<string, string>>({})
  const [result, setResult] = useState<SimResult | null>(null)
  const [loading, setLoading] = useState(false)

  function selectDecision(d: typeof DECISIONS[0]) {
    setSelected(d)
    setParams({})
    setResult(null)
  }

  async function runSimulation() {
    if (!selected) return
    setLoading(true)
    try {
      const res = await fetch('/api/ai/simulator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision_type: selected.id, params }),
      })
      const data = await res.json()
      if (!data.error) setResult(data)
    } finally {
      setLoading(false)
    }
  }

  const RISK_COLORS: Record<string, string> = {
    low: 'text-emerald-600 bg-emerald-50',
    medium: 'text-amber-600 bg-amber-50',
    high: 'text-rose-600 bg-rose-50',
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-widest text-rose-deep mb-1">Future Simulator</div>
        <h1 className="font-serif text-3xl font-semibold text-charcoal">Model any life decision</h1>
        <p className="text-muted text-sm mt-1">See the real financial impact before you commit.</p>
      </div>

      {!selected && (
        <div className="grid grid-cols-3 gap-3">
          {DECISIONS.map((d) => (
            <button
              key={d.id}
              onClick={() => selectDecision(d)}
              className="flex flex-col items-center gap-2 p-4 bg-white border border-rose/10 rounded-2xl shadow-card hover:border-rose/30 hover:-translate-y-px transition-all text-center"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${d.color}`}>
                {d.icon}
              </div>
              <div className="text-xs font-semibold text-charcoal leading-tight">{d.label}</div>
            </button>
          ))}
        </div>
      )}

      {selected && !result && (
        <div>
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-1 text-xs text-muted hover:text-charcoal mb-6 transition-colors"
          >
            ← All decisions
          </button>

          <div className="bg-white border border-rose/10 rounded-3xl p-6 shadow-card mb-4">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${selected.color}`}>
                {selected.icon}
              </div>
              <div>
                <div className="font-serif text-xl font-semibold text-charcoal">{selected.label}</div>
                <div className="text-xs text-muted">Fill in the details for an accurate simulation</div>
              </div>
            </div>

            <div className="space-y-4">
              {selected.params.map(p => (
                <div key={p.key}>
                  <label className="text-xs font-semibold text-charcoal mb-1.5 block">{p.label}</label>
                  <div className="relative">
                    {p.type === 'currency' && (
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">$</div>
                    )}
                    <input
                      type={p.type === 'text' ? 'text' : 'number'}
                      placeholder={p.placeholder}
                      value={params[p.key] ?? ''}
                      onChange={e => setParams(prev => ({ ...prev, [p.key]: e.target.value }))}
                      className={`w-full border border-rose/15 rounded-xl py-2.5 text-sm text-charcoal placeholder-muted/60 focus:outline-none focus:border-rose/40 bg-cream ${p.type === 'currency' ? 'pl-7 pr-4' : 'px-4'}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={runSimulation}
              disabled={loading}
              className="mt-6 w-full py-3.5 bg-gradient-rose text-white rounded-full text-sm font-semibold shadow-rose transition-all hover:-translate-y-px disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Simulating...
                </span>
              ) : 'Run simulation →'}
            </button>
          </div>
        </div>
      )}

      {result && selected && (
        <div>
          <button
            onClick={() => setResult(null)}
            className="flex items-center gap-1 text-xs text-muted hover:text-charcoal mb-6 transition-colors"
          >
            ← Adjust parameters
          </button>

          {/* Zara's take */}
          <div className="bg-gradient-dark text-white rounded-3xl p-6 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-sm">✦</span>
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-white/50">Zara's Take</div>
            </div>
            <p className="text-white leading-relaxed">{result.zara_recommendation}</p>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: 'Upfront cost', value: result.upfront_cost > 0 ? `-$${result.upfront_cost.toLocaleString()}` : '$0', negative: result.upfront_cost > 0 },
              { label: 'Monthly impact', value: result.net_monthly_impact >= 0 ? `+$${result.net_monthly_impact.toLocaleString()}` : `-$${Math.abs(result.net_monthly_impact).toLocaleString()}`, negative: result.net_monthly_impact < 0 },
              { label: '5-year wealth impact', value: result['5_year_wealth_impact'] >= 0 ? `+$${result['5_year_wealth_impact'].toLocaleString()}` : `-$${Math.abs(result['5_year_wealth_impact']).toLocaleString()}`, negative: result['5_year_wealth_impact'] < 0 },
              { label: '10-year wealth impact', value: result['10_year_wealth_impact'] >= 0 ? `+$${result['10_year_wealth_impact'].toLocaleString()}` : `-$${Math.abs(result['10_year_wealth_impact']).toLocaleString()}`, negative: result['10_year_wealth_impact'] < 0 },
            ].map((m) => (
              <div key={m.label} className="bg-white border border-rose/10 rounded-2xl p-4 shadow-card text-center">
                <div className={`font-serif text-2xl font-semibold ${m.negative ? 'text-rose-deep' : 'text-charcoal'}`}>{m.value}</div>
                <div className="text-xs text-muted mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>

          {/* Risk + opportunity cost */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white border border-rose/10 rounded-2xl p-4 shadow-card">
              <div className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Risk Level</div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${RISK_COLORS[result.risk_level] ?? ''}`}>
                {result.risk_level?.charAt(0).toUpperCase()}{result.risk_level?.slice(1)}
              </span>
            </div>
            <div className="bg-white border border-rose/10 rounded-2xl p-4 shadow-card">
              <div className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Opportunity Cost</div>
              <p className="text-xs text-charcoal">{result.opportunity_cost}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-rose/10 rounded-2xl p-5 shadow-card mb-4">
            <div className="text-xs font-bold uppercase tracking-widest text-muted mb-3">Financial Timeline</div>
            <div className="space-y-3">
              {(result.timeline ?? []).map((t, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-rose mt-1" />
                    {i < (result.timeline?.length ?? 0) - 1 && <div className="w-px flex-1 bg-rose/15 mt-1" />}
                  </div>
                  <div className="pb-3">
                    <div className="text-xs font-bold text-rose-deep mb-0.5">{t.period}</div>
                    <div className="text-sm text-charcoal">{t.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conditions & alternatives */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white border border-rose/10 rounded-2xl p-4 shadow-card">
              <div className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Before you proceed</div>
              <div className="space-y-2">
                {(result.conditions_to_proceed ?? []).map((c, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-charcoal">
                    <div className="w-4 h-4 rounded-full border border-rose/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[8px] font-bold text-rose-deep">{i+1}</span>
                    </div>
                    {c}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-rose/10 rounded-2xl p-4 shadow-card">
              <div className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Alternatives to consider</div>
              <div className="space-y-2">
                {(result.alternatives ?? []).map((a, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-charcoal">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-deep flex-shrink-0 mt-1" />
                    {a}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <a
            href="/dashboard/coach"
            className="block w-full py-3 bg-gradient-dark text-white rounded-full text-sm font-semibold text-center"
          >
            Talk to Zara about this decision →
          </a>
        </div>
      )}
    </div>
  )
}
