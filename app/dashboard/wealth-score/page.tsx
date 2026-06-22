'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ScoreData {
  score: number
  savings_rate_score: number
  investing_score: number
  income_growth_score: number
  business_score: number
  tax_efficiency_score: number
  emergency_fund_score: number
  calculated_at: string
}

interface Factor {
  key: keyof ScoreData
  label: string
  icon: string
  maxScore: number
  description: string
  actionLabel: string
  actionHref: string
}

const FACTORS: Factor[] = [
  {
    key: 'savings_rate_score',
    label: 'Savings Rate',
    icon: '💰',
    maxScore: 20,
    description: 'How much of your income you keep. Target: save 20%+ consistently.',
    actionLabel: 'Find ways to save more →',
    actionHref: '/dashboard/coach',
  },
  {
    key: 'investing_score',
    label: 'Investing Habits',
    icon: '📈',
    maxScore: 20,
    description: 'Whether you\'re putting money to work in index funds or retirement accounts.',
    actionLabel: 'Build an investment plan →',
    actionHref: '/dashboard/invest',
  },
  {
    key: 'income_growth_score',
    label: 'Income Growth',
    icon: '🚀',
    maxScore: 20,
    description: 'Whether your income is growing or stagnant. Target: 10%+ per year.',
    actionLabel: 'Find my next $10K →',
    actionHref: '/dashboard/next-10k',
  },
  {
    key: 'business_score',
    label: 'Business Performance',
    icon: '📦',
    maxScore: 15,
    description: 'Profit margins, revenue growth, and business cash flow quality.',
    actionLabel: 'Review business intelligence →',
    actionHref: '/dashboard/business',
  },
  {
    key: 'tax_efficiency_score',
    label: 'Tax Efficiency',
    icon: '🧾',
    maxScore: 15,
    description: 'Whether you\'re legally minimizing taxes through deductions and structure.',
    actionLabel: 'Fix your tax gap →',
    actionHref: '/dashboard/coach',
  },
  {
    key: 'emergency_fund_score',
    label: 'Emergency Fund',
    icon: '🛡️',
    maxScore: 10,
    description: 'Whether you have 3–6 months of expenses saved and accessible.',
    actionLabel: 'Build your fund →',
    actionHref: '/dashboard/coach',
  },
]

function ScoreArc({ score }: { score: number }) {
  const radius = 72
  const circumference = Math.PI * radius // half-circle arc
  const progress = (score / 100) * circumference

  return (
    <div className="relative w-52 h-28 mx-auto">
      <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
        {/* Background arc */}
        <path
          d="M 16 100 A 84 84 0 0 1 184 100"
          fill="none"
          stroke="rgba(232,137,154,0.12)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Score arc */}
        <path
          d="M 16 100 A 84 84 0 0 1 184 100"
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          className="transition-all duration-1000"
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E8899A" />
            <stop offset="100%" stopColor="#C4607A" />
          </linearGradient>
        </defs>
        {/* Score text */}
        <text x="100" y="82" textAnchor="middle" className="font-serif" style={{ fontSize: 44, fontWeight: 600, fill: '#1A1920', fontFamily: 'serif' }}>
          {score}
        </text>
        <text x="100" y="100" textAnchor="middle" style={{ fontSize: 11, fill: '#9b8ea8' }}>
          out of 100
        </text>
      </svg>
    </div>
  )
}

function FactorBar({ label, icon, score, maxScore, description, actionLabel, actionHref }: {
  label: string
  icon: string
  score: number
  maxScore: number
  description: string
  actionLabel: string
  actionHref: string
}) {
  const pct = Math.min((score / maxScore) * 100, 100)
  const grade = pct >= 80 ? 'Strong' : pct >= 60 ? 'Good' : pct >= 40 ? 'Building' : 'Needs work'
  const gradeColor = pct >= 80 ? 'text-emerald-600' : pct >= 60 ? 'text-blue-600' : pct >= 40 ? 'text-amber-600' : 'text-rose-deep'

  return (
    <div className="bg-white border border-rose/10 rounded-2xl p-4 shadow-card">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-semibold text-charcoal">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold ${gradeColor}`}>{grade}</span>
          <span className="text-xs text-muted">{score}/{maxScore}pts</span>
        </div>
      </div>
      <div className="w-full bg-cream rounded-full h-2 mb-3">
        <div
          className="h-2 rounded-full bg-gradient-rose transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-muted mb-3 leading-relaxed">{description}</p>
      {pct < 80 && (
        <a href={actionHref} className="text-xs font-semibold text-rose-deep hover:underline">
          {actionLabel}
        </a>
      )}
    </div>
  )
}

export default function WealthScorePage() {
  const [scoreData, setScoreData] = useState<ScoreData | null>(null)
  const [history, setHistory] = useState<ScoreData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase
        .from('wealth_scores')
        .select('*')
        .eq('user_id', user.id)
        .order('calculated_at', { ascending: false })
        .limit(30)
        .then(({ data }) => {
          if (data && data.length > 0) {
            setScoreData(data[0])
            setHistory(data.reverse())
          }
          setLoading(false)
        })
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 rounded-full border-2 border-rose/30 border-t-rose-deep animate-spin" />
      </div>
    )
  }

  if (!scoreData) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="text-4xl mb-4">📊</div>
        <h2 className="font-serif text-3xl font-semibold text-charcoal mb-2">No score yet</h2>
        <p className="text-muted text-sm mb-6">Complete onboarding to generate your Wealth Potential Score.</p>
        <a href="/onboarding" className="px-6 py-3 bg-gradient-rose text-white rounded-full text-sm font-semibold shadow-rose">
          Complete setup →
        </a>
      </div>
    )
  }

  const score = scoreData.score

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Score card */}
      <div className="bg-white border border-rose/10 rounded-3xl p-6 shadow-card mb-6 text-center">
        <div className="text-xs font-bold uppercase tracking-widest text-rose-deep mb-4">Wealth Potential Score</div>
        <ScoreArc score={score} />
        <div className="mt-4">
          <div className="font-serif text-xl font-semibold text-charcoal mb-1">
            {score >= 80 ? 'Excellent wealth trajectory' :
             score >= 65 ? 'Strong wealth builder' :
             score >= 50 ? 'Good foundation, room to grow' :
             'Early stage — big upside ahead'}
          </div>
          <p className="text-sm text-muted max-w-sm mx-auto">
            This score measures your future wealth potential — not current balances.
            A score of 100 means you're doing everything optimally.
          </p>
        </div>

        {/* Last updated */}
        <div className="mt-4 pt-4 border-t border-rose/10">
          <div className="text-xs text-faint">
            Last updated: {new Date(scoreData.calculated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Factors */}
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-widest text-muted mb-3">Score Breakdown</div>
        <div className="space-y-3">
          {FACTORS.map(f => (
            <FactorBar
              key={f.key}
              label={f.label}
              icon={f.icon}
              score={Number(scoreData[f.key]) || 0}
              maxScore={f.maxScore}
              description={f.description}
              actionLabel={f.actionLabel}
              actionHref={f.actionHref}
            />
          ))}
        </div>
      </div>

      {/* Score history */}
      {history.length > 1 && (
        <div className="bg-white border border-rose/10 rounded-2xl p-4 shadow-card">
          <div className="text-xs font-bold uppercase tracking-widest text-muted mb-3">Score History</div>
          <div className="flex items-end gap-1 h-16">
            {history.slice(-20).map((h, i) => (
              <div key={i} className="flex-1 flex items-end">
                <div
                  className="w-full rounded-t bg-gradient-rose opacity-70 hover:opacity-100 transition-opacity"
                  style={{ height: `${(h.score / 100) * 56}px` }}
                  title={`${h.score} · ${new Date(h.calculated_at).toLocaleDateString()}`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-faint mt-1">
            <span>{new Date(history[0].calculated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            <span>Today</span>
          </div>
        </div>
      )}
    </div>
  )
}
