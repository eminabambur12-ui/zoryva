'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Transaction {
  id: string
  type: string
  category: string
  merchant: string
  amount: number
  date: string
  source: string
}

interface BizInsight {
  title: string
  value: string
  change?: string
  positive?: boolean
  icon: string
}

export default function BusinessPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [aiInsights, setAiInsights] = useState<string | null>(null)
  const [loadingInsights, setLoadingInsights] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('source', 'business')
        .order('date', { ascending: false })
        .limit(200)
        .then(({ data }) => {
          setTransactions(data ?? [])
          setLoading(false)
        })
    })
  }, [])

  const txs = transactions
  const revenue = txs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
  const expenses = txs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
  const profit = revenue - expenses
  const margin = revenue > 0 ? Math.round((profit / revenue) * 100) : 0

  // Category breakdown
  const expenseByCategory: Record<string, number> = {}
  txs.filter(t => t.type === 'expense').forEach(t => {
    expenseByCategory[t.category] = (expenseByCategory[t.category] ?? 0) + Number(t.amount)
  })
  const topExpenses = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]).slice(0, 5)

  // Revenue by merchant/client
  const revenueByClient: Record<string, number> = {}
  txs.filter(t => t.type === 'income').forEach(t => {
    revenueByClient[t.merchant] = (revenueByClient[t.merchant] ?? 0) + Number(t.amount)
  })
  const topClients = Object.entries(revenueByClient).sort((a, b) => b[1] - a[1]).slice(0, 5)

  const insights: BizInsight[] = [
    { icon: '💰', title: 'Total Revenue', value: `$${revenue.toLocaleString()}` },
    { icon: '📊', title: 'Net Profit', value: `$${profit.toLocaleString()}`, positive: profit > 0 },
    { icon: '📈', title: 'Profit Margin', value: `${margin}%`, positive: margin > 25 },
    { icon: '✂️', title: 'Total Expenses', value: `$${expenses.toLocaleString()}` },
  ]

  async function getAiInsights() {
    setLoadingInsights(true)
    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Analyze my business financials and give me 3-4 specific, actionable insights. Revenue: $${revenue}, Expenses: $${expenses}, Net Profit: $${profit} (${margin}% margin). Top expense categories: ${topExpenses.map(([k, v]) => `${k}: $${v}`).join(', ')}. Top clients: ${topClients.map(([k, v]) => `${k}: $${v}`).join(', ')}. Be specific and direct.`,
          category: 'business',
        }),
      })
      const data = await res.json()
      setAiInsights(data.reply)
    } finally {
      setLoadingInsights(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 rounded-full border-2 border-rose/30 border-t-rose-deep animate-spin" />
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="text-4xl mb-4">📦</div>
        <h2 className="font-serif text-2xl font-semibold text-charcoal mb-2">No business transactions yet</h2>
        <p className="text-sm text-muted mb-6">Add transactions tagged as "business" to see your P&L, top clients, and AI insights.</p>
        <a href="/dashboard/transactions" className="px-6 py-3 bg-gradient-rose text-white rounded-full text-sm font-semibold shadow-rose">
          Add transactions →
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-widest text-rose-deep mb-1">Business Intelligence</div>
        <h1 className="font-serif text-3xl font-semibold text-charcoal">Your business health</h1>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {insights.map((insight) => (
          <div key={insight.title} className="bg-white border border-rose/10 rounded-2xl p-4 shadow-card">
            <div className="flex items-center gap-2 mb-1">
              <span>{insight.icon}</span>
              <span className="text-xs text-muted">{insight.title}</span>
            </div>
            <div className={`font-serif text-2xl font-semibold ${insight.positive === false ? 'text-rose-deep' : 'text-charcoal'}`}>
              {insight.value}
            </div>
          </div>
        ))}
      </div>

      {/* Profit margin visual */}
      <div className="bg-white border border-rose/10 rounded-2xl p-5 shadow-card mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold text-charcoal">Profit Margin</div>
          <div className={`text-sm font-bold ${margin >= 30 ? 'text-emerald-600' : margin >= 15 ? 'text-amber-600' : 'text-rose-deep'}`}>
            {margin}%
          </div>
        </div>
        <div className="w-full bg-cream rounded-full h-3">
          <div
            className="h-3 rounded-full bg-gradient-rose transition-all duration-700"
            style={{ width: `${Math.min(margin, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-faint mt-1">
          <span>0%</span>
          <span className="text-amber-500">15% (min)</span>
          <span className="text-emerald-500">30%+ (healthy)</span>
          <span>100%</span>
        </div>
      </div>

      {/* Top clients + expenses */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-rose/10 rounded-2xl p-4 shadow-card">
          <div className="text-xs font-bold uppercase tracking-widest text-muted mb-3">Top Revenue Sources</div>
          {topClients.length === 0 ? (
            <div className="text-xs text-muted">No revenue data</div>
          ) : topClients.map(([client, amount], i) => (
            <div key={client} className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-rose/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[8px] font-bold text-rose-deep">{i+1}</span>
                </div>
                <span className="text-xs text-charcoal truncate max-w-[100px]">{client}</span>
              </div>
              <span className="text-xs font-semibold text-charcoal">${amount.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="bg-white border border-rose/10 rounded-2xl p-4 shadow-card">
          <div className="text-xs font-bold uppercase tracking-widest text-muted mb-3">Top Expense Categories</div>
          {topExpenses.length === 0 ? (
            <div className="text-xs text-muted">No expense data</div>
          ) : topExpenses.map(([cat, amount], i) => (
            <div key={cat} className="mb-2">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs text-charcoal">{cat}</span>
                <span className="text-xs font-semibold text-charcoal">${amount.toLocaleString()}</span>
              </div>
              <div className="w-full bg-cream rounded-full h-1">
                <div
                  className="h-1 rounded-full bg-gradient-rose"
                  style={{ width: `${(amount / (topExpenses[0][1] || 1)) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zara AI insights */}
      <div className="bg-white border border-rose/10 rounded-2xl p-5 shadow-card mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-rose-deep mb-0.5">Zara's Analysis</div>
            <div className="text-sm font-semibold text-charcoal">AI-powered business insights</div>
          </div>
          {!aiInsights && (
            <button
              onClick={getAiInsights}
              disabled={loadingInsights}
              className="px-4 py-2 bg-gradient-rose text-white rounded-full text-xs font-semibold shadow-rose"
            >
              {loadingInsights ? 'Analyzing...' : 'Analyze now'}
            </button>
          )}
        </div>

        {loadingInsights && (
          <div className="flex items-center gap-2 py-4">
            <div className="w-4 h-4 rounded-full border-2 border-rose/30 border-t-rose-deep animate-spin" />
            <span className="text-xs text-muted">Zara is reviewing your business data...</span>
          </div>
        )}

        {aiInsights && (
          <div className="text-sm text-charcoal leading-relaxed">
            {aiInsights.split('\n').map((line, i) => (
              <p key={i} className={line ? 'mb-2' : 'mb-1'}>{line}</p>
            ))}
          </div>
        )}

        {!aiInsights && !loadingInsights && (
          <p className="text-xs text-muted">Click "Analyze now" for Zara to review your numbers and find opportunities.</p>
        )}
      </div>

      {/* Recent transactions */}
      <div className="bg-white border border-rose/10 rounded-2xl shadow-card overflow-hidden">
        <div className="p-4 border-b border-rose/10">
          <div className="text-xs font-bold uppercase tracking-widest text-muted">Recent Transactions</div>
        </div>
        <div className="divide-y divide-rose/5">
          {txs.slice(0, 10).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-charcoal">{tx.merchant}</div>
                <div className="text-xs text-muted">{tx.category} · {tx.date}</div>
              </div>
              <div className={`text-sm font-semibold ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-deep'}`}>
                {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
