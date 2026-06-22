import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const today = new Date().toISOString().split('T')[0]

    // Check cache
    const { data: cached } = await supabase
      .from('next_10k_reports')
      .select('*')
      .eq('user_id', user.id)
      .eq('report_date', today)
      .single()

    if (cached) return NextResponse.json(cached)

    // Fetch financial data
    const [{ data: profile }, { data: transactions }, { data: goals }] = await Promise.all([
      supabase.from('profiles').select('full_name, income_type, wealth_score').eq('id', user.id).single(),
      supabase.from('transactions').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(300),
      supabase.from('user_goals').select('goal').eq('user_id', user.id),
    ])

    const txs = transactions ?? []
    const income = txs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
    const expenses = txs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
    const bizRevenue = txs.filter(t => t.type === 'income' && t.source === 'business').reduce((s, t) => s + Number(t.amount), 0)
    const bizExpenses = txs.filter(t => t.type === 'expense' && t.source === 'business').reduce((s, t) => s + Number(t.amount), 0)

    const categorySpend: Record<string, number> = {}
    txs.filter(t => t.type === 'expense').forEach(t => {
      categorySpend[t.category] = (categorySpend[t.category] ?? 0) + Number(t.amount)
    })

    const prompt = `You are Zara, an elite AI wealth advisor. Analyze this user's finances and find their next $10,000+ in wealth opportunities.

USER PROFILE:
- Name: ${profile?.full_name}
- Income type: ${profile?.income_type}
- Goals: ${goals?.map(g => g.goal).join(', ')}
- Wealth score: ${profile?.wealth_score}/100

FINANCIAL DATA:
- Total income tracked: $${income.toFixed(0)}
- Total expenses tracked: $${expenses.toFixed(0)}
- Business revenue: $${bizRevenue.toFixed(0)}
- Business expenses: $${bizExpenses.toFixed(0)}
- Business profit: $${(bizRevenue - bizExpenses).toFixed(0)}
- Expense breakdown: ${Object.entries(categorySpend).sort((a,b) => b[1]-a[1]).map(([k,v]) => `${k}: $${v.toFixed(0)}`).join(', ')}

Find 6-8 specific wealth opportunities across these domains:
1. Pricing optimization (raise rates, packages, positioning)
2. Expense elimination (subscriptions, overspend, waste)
3. Tax deductions (S-Corp election, home office, retirement accounts)
4. Cash flow (invoice faster, better payment terms, recurring revenue)
5. Investment opportunities (index funds, real estate, tax-advantaged accounts)
6. Business growth (upsell, productize, passive income)

Return pure JSON (no markdown):
{
  "opportunities": [
    {
      "rank": 1,
      "domain": "pricing|expense|tax|cashflow|investing|business",
      "title": "Short action title",
      "annual_impact": 0,
      "one_time_impact": 0,
      "difficulty": "easy|medium|hard",
      "timeframe": "1 week|1 month|3 months|6 months",
      "description": "2-3 sentences: what to do, exactly how much it's worth, why now.",
      "action_steps": ["Step 1", "Step 2", "Step 3"]
    }
  ],
  "total_identified": 0,
  "summary": "2 sentences summarizing the biggest opportunities and total value."
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(completion.choices[0]?.message?.content ?? '{}')

    const { data: saved } = await supabase.from('next_10k_reports').upsert({
      user_id: user.id,
      report_date: today,
      opportunities: result.opportunities ?? [],
      total_identified: result.total_identified ?? 0,
    }, { onConflict: 'user_id,report_date' }).select().single()

    return NextResponse.json(saved ?? result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
