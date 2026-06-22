import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { message } = await request.json()
    if (!message) return NextResponse.json({ error: 'No message' }, { status: 400 })

    // Fetch user's financial data to give Zara context (skip if not logged in)
    const userId = user?.id
    const [{ data: profile }, { data: transactions }, { data: budgets }] = userId ? await Promise.all([
      supabase.from('profiles').select('full_name, plan_type').eq('id', userId).single(),
      supabase.from('transactions').select('type, category, amount, date, source').eq('user_id', userId).order('date', { ascending: false }).limit(100),
      supabase.from('budgets').select('category, amount').eq('user_id', userId),
    ]) : [{ data: null }, { data: null }, { data: null }]

    // Summarize financial data
    const income = transactions?.filter(t => t.type === 'income' && t.source === 'personal').reduce((s, t) => s + t.amount, 0) ?? 0
    const expenses = transactions?.filter(t => t.type === 'expense' && t.source === 'personal').reduce((s, t) => s + t.amount, 0) ?? 0
    const bizRevenue = transactions?.filter(t => t.type === 'income' && t.source === 'business').reduce((s, t) => s + t.amount, 0) ?? 0
    const bizExpenses = transactions?.filter(t => t.type === 'expense' && t.source === 'business').reduce((s, t) => s + t.amount, 0) ?? 0
    const bizProfit = bizRevenue - bizExpenses
    const savings = income - expenses
    const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0
    const taxReserve = bizProfit > 0 ? Math.round(bizProfit * 0.3) : 0
    const safeToSpend = savings > 0 ? Math.round(savings * 0.3) : 0

    // Category breakdown
    const categorySpend: Record<string, number> = {}
    transactions?.filter(t => t.type === 'expense').forEach(t => {
      categorySpend[t.category] = (categorySpend[t.category] ?? 0) + t.amount
    })
    const topSpending = Object.entries(categorySpend).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([cat, amt]) => `${cat}: $${amt.toFixed(0)}`).join(', ')

    // Fetch recent conversation history for context
    const { data: history } = userId ? await supabase
      .from('ai_messages')
      .select('role, content')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10) : { data: null }

    const recentHistory = (history ?? []).reverse()

    const systemPrompt = `You are Zara, the AI Money Coach inside Zoryva — a financial operating system for creators, entrepreneurs, side hustlers, and people with variable income.

USER PROFILE:
- Name: ${profile?.full_name ?? 'User'}
- Plan: ${profile?.plan_type ?? 'free'}

THEIR ACTUAL FINANCIAL DATA:
- Personal Income tracked: $${income.toFixed(0)}
- Personal Expenses tracked: $${expenses.toFixed(0)}
- Personal Savings: $${savings.toFixed(0)} (${savingsRate}% savings rate)
- Business Revenue: $${bizRevenue.toFixed(0)}
- Business Expenses: $${bizExpenses.toFixed(0)}
- Business Net Profit: $${bizProfit.toFixed(0)}
- Estimated Tax Reserve needed: $${taxReserve.toFixed(0)}
- Safe to Spend today: ~$${safeToSpend.toFixed(0)}
- Top spending categories: ${topSpending || 'No data yet'}
- Budget limits set: ${budgets?.length ? budgets.map(b => `${b.category} ($${b.amount})`).join(', ') : 'None set yet'}

YOUR PERSONALITY & RULES:
- You are warm, direct, and supportive — like a smart friend who happens to be a financial expert
- Speak simply. Avoid jargon. This user may be a beginner.
- Be SPECIFIC. Use their real numbers. Don't give generic advice.
- Keep responses concise — 2 to 4 short paragraphs max unless they ask for detail
- Always give ONE clear action they can take right now
- Never shame or make them feel bad about their finances
- If they have no data yet, encourage them to add transactions and give general guidance
- Focus on: can they afford something, what to cut, savings advice, tax planning, paying themselves, goal timelines`

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...recentHistory.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user', content: message },
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    })

    const reply = completion.choices[0]?.message?.content ?? 'I had trouble generating a response. Please try again.'

    // Save both messages to history (only if logged in)
    if (userId) {
      await supabase.from('ai_messages').insert([
        { user_id: userId, role: 'user', content: message },
        { user_id: userId, role: 'assistant', content: reply },
      ])
    }

    return NextResponse.json({ reply })
  } catch (err: any) {
    console.error('AI coach error:', err)
    if (err.code === 'insufficient_quota') {
      return NextResponse.json({ reply: 'Your OpenAI API quota has been reached. Please check your OpenAI billing at platform.openai.com.' })
    }
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
