import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const today = new Date().toISOString().split('T')[0]

    // Return cached analysis if generated today
    const { data: cached } = await supabase
      .from('zara_analyses')
      .select('*')
      .eq('user_id', user.id)
      .eq('analysis_date', today)
      .single()

    if (cached) return NextResponse.json(cached)

    // Fetch all user data for analysis
    const [
      { data: profile },
      { data: transactions },
      { data: budgets },
      { data: goals },
      { data: accounts },
      { data: scores },
    ] = await Promise.all([
      supabase.from('profiles').select('full_name, plan_type, income_type, wealth_score').eq('id', user.id).single(),
      supabase.from('transactions').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(200),
      supabase.from('budgets').select('*').eq('user_id', user.id),
      supabase.from('user_goals').select('goal').eq('user_id', user.id),
      supabase.from('connected_accounts').select('provider, account_name').eq('user_id', user.id).eq('is_active', true),
      supabase.from('wealth_scores').select('score').eq('user_id', user.id).order('calculated_at', { ascending: false }).limit(1),
    ])

    // Calculate financial metrics
    const txs = transactions ?? []
    const personalIncome = txs.filter(t => t.type === 'income' && t.source === 'personal').reduce((s, t) => s + t.amount, 0)
    const personalExpenses = txs.filter(t => t.type === 'expense' && t.source === 'personal').reduce((s, t) => s + t.amount, 0)
    const bizRevenue = txs.filter(t => t.type === 'income' && t.source === 'business').reduce((s, t) => s + t.amount, 0)
    const bizExpenses = txs.filter(t => t.type === 'expense' && t.source === 'business').reduce((s, t) => s + t.amount, 0)
    const bizProfit = bizRevenue - bizExpenses
    const totalIncome = personalIncome + bizRevenue
    const savings = personalIncome - personalExpenses
    const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0
    const taxReserve = bizProfit > 0 ? Math.round(bizProfit * 0.3) : 0
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
    const dayOfMonth = new Date().getDate()
    const daysLeft = daysInMonth - dayOfMonth + 1
    const monthlySpendable = Math.max(0, personalIncome - personalExpenses - taxReserve - (budgets?.reduce((s, b) => s + b.amount, 0) ?? 0) * 0.1)
    const safeSpend = daysLeft > 0 ? Math.round(monthlySpendable / daysLeft) : 0

    // Category breakdown for waste detection
    const categorySpend: Record<string, number> = {}
    txs.filter(t => t.type === 'expense').forEach(t => {
      categorySpend[t.category] = (categorySpend[t.category] ?? 0) + t.amount
    })

    const prompt = `You are Zara, the AI wealth advisor inside Zoryva. Generate a proactive daily wealth analysis for ${profile?.full_name ?? 'the user'}.

USER CONTEXT:
- Income type: ${profile?.income_type ?? 'unknown'}
- Goals: ${goals?.map(g => g.goal).join(', ') ?? 'none set'}
- Connected accounts: ${accounts?.map(a => a.account_name).join(', ') ?? 'none'}
- Current wealth score: ${scores?.[0]?.score ?? profile?.wealth_score ?? 0}/100

FINANCIAL DATA:
- Personal income (tracked): $${personalIncome.toFixed(0)}
- Personal expenses: $${personalExpenses.toFixed(0)}
- Savings rate: ${savingsRate}%
- Business revenue: $${bizRevenue.toFixed(0)}
- Business expenses: $${bizExpenses.toFixed(0)}
- Business net profit: $${bizProfit.toFixed(0)}
- Tax reserve gap: $${taxReserve.toFixed(0)} needed
- Safe to spend today: $${safeSpend}
- Top expense categories: ${Object.entries(categorySpend).sort((a,b) => b[1]-a[1]).slice(0,5).map(([k,v]) => `${k} ($${v.toFixed(0)})`).join(', ')}

Generate a JSON response with this EXACT structure (no markdown, pure JSON):
{
  "greeting": "Good morning [name]",
  "headline": "I found [N] opportunities worth $[X] this year.",
  "opportunities": [
    {
      "rank": 1,
      "title": "Short action title",
      "category": "make_more|keep_more|build_wealth",
      "annual_impact": 0,
      "description": "One sentence explaining the opportunity and exact dollar impact.",
      "urgency": "today|this_week|this_month"
    }
  ],
  "daily_briefing": {
    "safe_spend": ${safeSpend},
    "safe_spend_note": "One sentence explaining how this was calculated.",
    "savings_rec": 0,
    "savings_rec_note": "",
    "tax_allocation": ${taxReserve},
    "tax_allocation_note": "",
    "upcoming_bills": [
      { "name": "Bill name", "amount": 0, "due_in_days": 0 }
    ],
    "business_actions": [
      { "action": "Short action", "impact": "Dollar or percentage impact", "urgency": "today|this_week" }
    ],
    "wealth_actions": [
      { "action": "Short action", "impact": "Dollar or percentage impact", "urgency": "today|this_week" }
    ]
  },
  "total_annual_impact": 0
}

Generate 4-6 specific, high-impact opportunities. Make the greeting personal and energizing. Use the user's real numbers. Total annual impact should be the sum of all opportunity annual_impacts. Respond ONLY with valid JSON.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    })

    const raw = completion.choices[0]?.message?.content ?? '{}'
    const analysis = JSON.parse(raw)

    // Cache the analysis
    const { data: saved } = await supabase.from('zara_analyses').upsert({
      user_id: user.id,
      analysis_date: today,
      greeting: analysis.greeting ?? 'Good morning',
      headline: analysis.headline ?? 'I\'m analyzing your finances now.',
      opportunities: analysis.opportunities ?? [],
      daily_briefing: analysis.daily_briefing ?? {},
      total_annual_impact: analysis.total_annual_impact ?? 0,
    }, { onConflict: 'user_id,analysis_date' }).select().single()

    return NextResponse.json(saved ?? analysis)
  } catch (err: any) {
    console.error('Analyze error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
