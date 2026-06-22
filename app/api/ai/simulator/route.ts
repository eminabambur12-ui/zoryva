import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const { decision_type, params } = await req.json()

    const [{ data: profile }, { data: transactions }] = await Promise.all([
      supabase.from('profiles').select('full_name, income_type, wealth_score').eq('id', user.id).single(),
      supabase.from('transactions').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(200),
    ])

    const txs = transactions ?? []
    const monthlyIncome = txs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0) / 12
    const monthlyExpenses = txs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0) / 12
    const monthlySurplus = monthlyIncome - monthlyExpenses

    const prompt = `You are Zara, an elite AI wealth advisor. Model this life decision and show its full financial impact.

USER PROFILE:
- Income type: ${profile?.income_type}
- Monthly income: $${monthlyIncome.toFixed(0)}
- Monthly expenses: $${monthlyExpenses.toFixed(0)}
- Monthly surplus: $${monthlySurplus.toFixed(0)}
- Wealth score: ${profile?.wealth_score}/100

DECISION: ${decision_type}
PARAMETERS: ${JSON.stringify(params)}

Provide a complete financial simulation of this decision. Return pure JSON:
{
  "decision": "${decision_type}",
  "upfront_cost": 0,
  "monthly_cost_change": 0,
  "monthly_income_change": 0,
  "net_monthly_impact": 0,
  "breakeven_months": 0,
  "5_year_wealth_impact": 0,
  "10_year_wealth_impact": 0,
  "opportunity_cost": "What they give up if they do this",
  "risk_level": "low|medium|high",
  "timeline": [
    { "period": "Month 1", "description": "What happens financially" },
    { "period": "Month 6", "description": "..." },
    { "period": "Year 1", "description": "..." },
    { "period": "Year 3", "description": "..." },
    { "period": "Year 5", "description": "..." }
  ],
  "zara_recommendation": "Zara's personal recommendation in 3-4 sentences. Be direct. Use the user's real numbers. Say whether to do it and why.",
  "conditions_to_proceed": ["Condition 1", "Condition 2", "Condition 3"],
  "alternatives": ["Alternative option 1", "Alternative option 2"]
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(completion.choices[0]?.message?.content ?? '{}')

    // Save session
    await supabase.from('simulator_sessions').insert({
      user_id: user.id,
      decision_type,
      input_params: params,
      result,
      zara_recommendation: result.zara_recommendation,
    })

    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
