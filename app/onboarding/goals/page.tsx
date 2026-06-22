'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const GOALS = [
  { id: 'build_wealth', label: 'Build wealth', desc: 'Grow my net worth consistently', icon: '🏦' },
  { id: 'pay_off_debt', label: 'Pay off debt', desc: 'Eliminate student loans or credit cards', icon: '💳' },
  { id: 'save_house', label: 'Save for a home', desc: 'Reach a down payment goal', icon: '🏠' },
  { id: 'quit_job', label: 'Quit my job', desc: 'Build enough to go full-time on my own', icon: '🚪' },
  { id: 'grow_business', label: 'Grow my business', desc: 'Increase revenue and profit', icon: '📈' },
  { id: 'invest_more', label: 'Invest more', desc: 'Build an investment portfolio', icon: '💹' },
  { id: 'retire_early', label: 'Retire early', desc: 'Reach financial independence', icon: '🌴' },
  { id: 'emergency_fund', label: 'Build emergency fund', desc: '3–6 months of expenses saved', icon: '🛡️' },
]

function calculateWealthScore(goalCount: number, incomeType: string): number {
  // Starting score based on completeness of onboarding
  const base = 45
  const goalsBonus = Math.min(goalCount * 5, 20)
  const profileBonus = incomeType !== 'other' ? 10 : 0
  return Math.min(base + goalsBonus + profileBonus, 72) // cap initial score
}

export default function OnboardingGoalsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [showScore, setShowScore] = useState(false)
  const [score, setScore] = useState(0)

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function handleGenerateScore() {
    if (selected.size === 0) return
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Get income type for score calculation
    const { data: profile } = await supabase.from('profiles').select('income_type').eq('id', user.id).single()
    const initialScore = calculateWealthScore(selected.size, profile?.income_type ?? 'other')

    // Save goals
    const goalRows = Array.from(selected).map((goal, i) => ({
      user_id: user.id,
      goal,
      priority: i,
    }))
    await supabase.from('user_goals').upsert(goalRows, { onConflict: 'user_id,goal' })

    // Save initial wealth score
    await supabase.from('wealth_scores').insert({
      user_id: user.id,
      score: initialScore,
      savings_rate_score: 50,
      investing_score: 30,
      income_growth_score: 55,
      business_score: profile?.income_type?.includes('business') ? 60 : 40,
      tax_efficiency_score: 35,
      emergency_fund_score: 45,
    })

    // Mark onboarding complete
    await supabase.from('profiles').update({
      onboarding_complete: true,
      wealth_score: initialScore,
      wealth_score_updated_at: new Date().toISOString(),
    }).eq('id', user.id)

    setScore(initialScore)
    setLoading(false)
    setShowScore(true)
  }

  if (showScore) {
    return (
      <div className="text-center py-8">
        <div className="text-xs font-bold uppercase tracking-widest text-rose-deep mb-6">Your starting score</div>

        {/* Score circle */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
            <circle cx="80" cy="80" r="64" fill="none" stroke="rgba(232,137,154,0.1)" strokeWidth="10" />
            <circle
              cx="80" cy="80" r="64"
              fill="none"
              stroke="#C4607A"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 402} 402`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-serif text-5xl font-semibold text-charcoal">{score}</div>
            <div className="text-xs text-muted">out of 100</div>
          </div>
        </div>

        <h2 className="font-serif text-3xl font-semibold text-charcoal mb-2">
          {score >= 70 ? 'Strong start.' : score >= 55 ? 'Good foundation.' : 'Room to grow.'}
        </h2>
        <p className="text-muted text-sm max-w-md mx-auto mb-4 leading-relaxed">
          This is your Wealth Potential Score — it measures how well-positioned you are to build wealth,
          not how much money you have. Zara will help you push it toward 100.
        </p>

        <div className="bg-white border border-rose/10 rounded-2xl p-5 text-left mb-8 shadow-card">
          <div className="text-xs font-bold uppercase tracking-widest text-rose-deep mb-3">What moves your score up</div>
          <div className="space-y-2">
            {[
              'Increase your savings rate',
              'Open and fund a retirement account',
              'Fix your tax efficiency gap',
              'Build a 3-month emergency fund',
              'Diversify your income streams',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-charcoal">
                <div className="w-4 h-4 rounded-full bg-rose/10 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-deep" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className="w-full py-4 bg-gradient-dark text-white rounded-full text-sm font-semibold transition-all hover:-translate-y-px"
        >
          Meet Zara — let's get to work →
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-10">
        <div className="text-xs font-bold uppercase tracking-widest text-rose-deep mb-3">Step 3 of 3</div>
        <h1 className="font-serif text-4xl font-semibold text-charcoal mb-3">
          What are you building toward?
        </h1>
        <p className="text-muted text-base max-w-md mx-auto leading-relaxed">
          Choose everything that applies. Zara will prioritize her advice around your goals.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {GOALS.map((goal) => {
          const isSelected = selected.has(goal.id)
          return (
            <button
              key={goal.id}
              onClick={() => toggle(goal.id)}
              className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-gradient-rose text-white border-transparent shadow-rose'
                  : 'bg-white border-rose/10 hover:border-rose/30 hover:shadow-card'
              }`}
            >
              <div className="text-2xl flex-shrink-0">{goal.icon}</div>
              <div>
                <div className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-charcoal'}`}>
                  {goal.label}
                </div>
                <div className={`text-xs mt-0.5 ${isSelected ? 'text-white/60' : 'text-muted'}`}>
                  {goal.desc}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {selected.size > 0 && (
        <div className="bg-rose/5 border border-rose/15 rounded-xl p-3 mb-4 text-center">
          <span className="text-xs text-rose-deep font-semibold">
            {selected.size} goal{selected.size > 1 ? 's' : ''} selected
          </span>
          <span className="text-xs text-muted"> · Zara will prioritize these in your daily briefings</span>
        </div>
      )}

      <button
        onClick={handleGenerateScore}
        disabled={selected.size === 0 || loading}
        className="w-full py-4 bg-gradient-rose text-white rounded-full text-sm font-semibold shadow-rose transition-all hover:shadow-rose-lg hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {loading ? 'Generating your Wealth Score...' : 'Generate my Wealth Potential Score →'}
      </button>
    </div>
  )
}
