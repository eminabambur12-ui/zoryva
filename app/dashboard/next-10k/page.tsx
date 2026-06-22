'use client'

import { useState } from 'react'

interface Opportunity {
  rank: number
  domain: string
  title: string
  annual_impact: number
  one_time_impact: number
  difficulty: 'easy' | 'medium' | 'hard'
  timeframe: string
  description: string
  action_steps: string[]
}

interface Report {
  opportunities: Opportunity[]
  total_identified: number
  summary: string
}

const DOMAIN_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  pricing: { icon: '💰', label: 'Pricing', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  expense: { icon: '✂️', label: 'Cut Waste', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  tax: { icon: '🧾', label: 'Tax', color: 'text-violet-700 bg-violet-50 border-violet-200' },
  cashflow: { icon: '🌊', label: 'Cash Flow', color: 'text-cyan-700 bg-cyan-50 border-cyan-200' },
  investing: { icon: '📈', label: 'Investing', color: 'text-rose-700 bg-rose-50 border-rose-200' },
  business: { icon: '📦', label: 'Business', color: 'text-amber-700 bg-amber-50 border-amber-200' },
}

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string }> = {
  easy: { label: 'Easy', color: 'text-emerald-600' },
  medium: { label: 'Medium', color: 'text-amber-600' },
  hard: { label: 'Hard', color: 'text-rose-600' },
}

export default function Next10KPage() {
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)
  const [expanded, setExpanded] = useState<number | null>(null)

  const LOADING_STEPS = [
    'Scanning your income & expenses...',
    'Analyzing pricing opportunities...',
    'Identifying tax deductions...',
    'Finding cash flow improvements...',
    'Modeling investment returns...',
    'Building your opportunity report...',
  ]

  async function generateReport() {
    setLoading(true)
    setStep(0)

    const interval = setInterval(() => {
      setStep(s => (s < LOADING_STEPS.length - 1 ? s + 1 : s))
    }, 1500)

    try {
      const res = await fetch('/api/ai/next-10k', { method: 'POST' })
      const data = await res.json()
      if (!data.error) setReport(data.opportunities ? data : null)
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-rose flex items-center justify-center shadow-rose mb-6">
          <span className="text-3xl">✦</span>
        </div>
        <h2 className="font-serif text-3xl font-semibold text-charcoal mb-2">Finding your next $10K</h2>
        <p className="text-muted text-sm mb-10">Zara is reviewing every dollar — income, expenses, taxes, investments.</p>
        <div className="w-full max-w-sm space-y-3">
          {LOADING_STEPS.map((s, i) => (
            <div key={s} className={`flex items-center gap-3 text-sm transition-all duration-500 ${i <= step ? 'opacity-100' : 'opacity-20'}`}>
              {i < step ? (
                <div className="w-5 h-5 rounded-full bg-rose/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-rose-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : i === step ? (
                <div className="w-5 h-5 rounded-full border-2 border-rose/40 border-t-rose-deep animate-spin flex-shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border border-muted/20 flex-shrink-0" />
              )}
              <span className={i <= step ? 'text-charcoal' : 'text-muted'}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-dark flex items-center justify-center mx-auto mb-6 shadow-lg">
          <span className="text-4xl">🔍</span>
        </div>
        <h1 className="font-serif text-4xl font-semibold text-charcoal mb-3">Find My Next $10K</h1>
        <p className="text-muted text-base max-w-md mx-auto mb-3 leading-relaxed">
          Zara will analyze your pricing, expenses, taxes, cash flow, investments, and business
          to find every opportunity to make or keep more money.
        </p>
        <p className="text-sm text-muted mb-10">
          Takes about 30 seconds. Results are personalized to your actual financial data.
        </p>
        <button
          onClick={generateReport}
          className="px-10 py-4 bg-gradient-rose text-white rounded-full text-sm font-semibold shadow-rose transition-all hover:shadow-rose-lg hover:-translate-y-px"
        >
          Find my opportunities →
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Hero */}
      <div className="bg-gradient-dark text-white rounded-3xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-sm">✦</span>
          </div>
          <div className="text-xs font-bold uppercase tracking-widest text-white/60">Zara's Report</div>
        </div>
        <h1 className="font-serif text-3xl font-semibold mb-2">
          I found <span className="text-rose">${(report.total_identified ?? 0).toLocaleString()}</span> in opportunities.
        </h1>
        <p className="text-white/70 text-sm leading-relaxed">{report.summary}</p>
      </div>

      {/* Opportunities */}
      <div className="space-y-3 mb-8">
        {(report.opportunities ?? []).map((opp, i) => {
          const domain = DOMAIN_CONFIG[opp.domain] ?? { icon: '💡', label: opp.domain, color: 'text-charcoal bg-cream border-cream' }
          const isOpen = expanded === i
          return (
            <div key={i} className="bg-white border border-rose/10 rounded-2xl shadow-card overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className="w-full flex items-center gap-4 p-4 text-left"
              >
                <div className="w-8 h-8 rounded-full bg-rose/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-rose-deep">{opp.rank}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-sm font-semibold text-charcoal">{opp.title}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${domain.color}`}>
                      {domain.icon} {domain.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span className={DIFFICULTY_CONFIG[opp.difficulty]?.color}>{DIFFICULTY_CONFIG[opp.difficulty]?.label}</span>
                    <span>·</span>
                    <span>{opp.timeframe}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  {opp.annual_impact > 0 && (
                    <div className="text-sm font-bold text-charcoal">+${opp.annual_impact.toLocaleString()}/yr</div>
                  )}
                  {opp.one_time_impact > 0 && (
                    <div className="text-xs text-emerald-600">+${opp.one_time_impact.toLocaleString()} once</div>
                  )}
                  <div className={`mt-1 w-5 h-5 rounded-full border border-rose/20 flex items-center justify-center transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-2.5 h-2.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 border-t border-rose/10">
                  <p className="text-sm text-muted leading-relaxed pt-3 mb-4">{opp.description}</p>
                  <div className="bg-cream rounded-xl p-4">
                    <div className="text-xs font-bold uppercase tracking-widest text-rose-deep mb-2">Action Steps</div>
                    <div className="space-y-2">
                      {(opp.action_steps ?? []).map((step, si) => (
                        <div key={si} className="flex items-start gap-2 text-sm text-charcoal">
                          <div className="w-5 h-5 rounded-full bg-white border border-rose/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[10px] font-bold text-rose-deep">{si + 1}</span>
                          </div>
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => window.location.href = '/dashboard/coach'}
                    className="mt-3 w-full py-2.5 border border-rose/20 rounded-xl text-sm text-charcoal hover:border-rose/40 hover:bg-rose/5 transition-all"
                  >
                    Ask Zara more about this →
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <button
        onClick={() => { setReport(null); generateReport() }}
        className="w-full py-3 border border-rose/20 rounded-full text-sm text-muted hover:border-rose/40 hover:text-charcoal transition-all"
      >
        Refresh report
      </button>
    </div>
  )
}
