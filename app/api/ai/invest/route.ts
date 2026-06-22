import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const { amount, timeframe_years, existing_investments, goals } = await req.json()

    const [{ data: profile }, { data: transactions }] = await Promise.all([
      supabase.from('profiles').select('income_type, wealth_score').eq('id', user.id).single(),
      supabase.from('transactions').select('type, amount, source').eq('user_id', user.id).order('created_at', { ascending: false }).limit(100),
    ])

    const txs = transactions ?? []
    const monthlyIncome = txs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0) / 12

    const prompt = `You are Zara, an expert AI investment advisor. Create 4 investment plans for this user.

USER PROFILE:
- Income type: ${profile?.income_type}
- Monthly income: ~$${monthlyIncome.toFixed(0)}
- Wealth score: ${profile?.wealth_score}/100
- Investment amount: $${amount}
- Time horizon: ${timeframe_years} years
- Existing investments: ${existing_investments || 'Unknown'}
- Goals: ${goals || 'Build wealth'}

Create exactly 4 investment plans:
1. Conservative — capital preservation, low risk (bonds, CDs, high-yield savings)
2. Balanced — moderate growth, moderate risk (60/40 portfolio)
3. Growth — higher returns, higher risk (broad index funds, ETFs)
4. Entrepreneur — highest upside, highest risk (business reinvestment, REITs, individual stocks)

Return pure JSON:
{
  "plans": [
    {
      "name": "Conservative|Balanced|Growth|Entrepreneur",
      "tagline": "Short description",
      "risk": "Very Low|Low|Medium|High|Very High",
      "expected_annual_return_pct": 0,
      "projected_1yr": 0,
      "projected_5yr": 0,
      "projected_10yr": 0,
      "monthly_contribution_rec": 0,
      "allocation": [
        { "asset": "Asset name", "percentage": 0, "examples": "Specific tickers or funds" }
      ],
      "best_for": "Who this plan is best for",
      "key_advantages": ["Advantage 1", "Advantage 2"],
      "key_risks": ["Risk 1", "Risk 2"],
      "first_steps": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
      "zara_note": "Zara's personal note on this plan (2 sentences)"
    }
  ],
  "zara_recommendation": "Which plan Zara recommends for THIS specific user and why (3-4 sentences using their real numbers)",
  "tax_considerations": "Key tax strategy note for this investment amount",
  "emergency_fund_note": "Should they have an emergency fund first? One sentence."
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 2500,
      response_format: { type: 'json_object' },
    })

    const result = JSON.parse(completion.choices[0]?.message?.content ?? '{}')
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
