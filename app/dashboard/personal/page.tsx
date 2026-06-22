'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatShortDate, TRANSACTION_CATEGORIES, CATEGORY_EMOJIS } from '@/lib/utils'

type Transaction = {
  id: string
  type: 'income' | 'expense'
  category: string
  merchant: string
  amount: number
  date: string
  source: string
  notes?: string
}

export default function PersonalPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [form, setForm] = useState({ type: 'expense', category: 'Food & Dining', merchant: '', amount: '', date: new Date().toISOString().split('T')[0], notes: '' })
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  async function load() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user?.id)
      .eq('source', 'personal')
      .order('date', { ascending: false })
    setTransactions(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('transactions').insert({
      user_id: user?.id,
      type: form.type,
      category: form.category,
      merchant: form.merchant,
      amount: parseFloat(form.amount),
      date: form.date,
      source: 'personal',
      notes: form.notes,
    })
    setForm({ type: 'expense', category: 'Food & Dining', merchant: '', amount: '', date: new Date().toISOString().split('T')[0], notes: '' })
    setShowForm(false)
    setSaving(false)
    load()
  }

  async function handleDelete(id: string) {
    await supabase.from('transactions').delete().eq('id', id)
    load()
  }

  const filtered = transactions.filter(t => filter === 'all' || t.type === filter)
  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  // Spending by category
  const byCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: Record<string, number>, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + t.amount
      return acc
    }, {})
  const topCategories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]).slice(0, 5)

  const inputClass = 'w-full px-4 py-2.5 rounded-2xl border border-rose/20 bg-cream text-charcoal text-sm focus:outline-none focus:border-rose-deep transition-colors'

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-charcoal">Personal Finance</h1>
          <p className="text-sm text-muted mt-1">Track your personal income and spending</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 bg-gradient-rose text-white text-sm font-semibold rounded-full shadow-rose hover:shadow-rose-lg hover:-translate-y-px transition-all"
        >
          + Add Transaction
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-rose/8 shadow-card">
          <div className="text-[10px] font-bold uppercase tracking-widest text-faint mb-1">Income</div>
          <div className="font-serif text-2xl font-semibold text-emerald-600">{formatCurrency(income)}</div>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-rose/8 shadow-card">
          <div className="text-[10px] font-bold uppercase tracking-widest text-faint mb-1">Expenses</div>
          <div className="font-serif text-2xl font-semibold text-charcoal">{formatCurrency(expenses)}</div>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-rose/8 shadow-card">
          <div className="text-[10px] font-bold uppercase tracking-widest text-faint mb-1">Saved</div>
          <div className={`font-serif text-2xl font-semibold ${income - expenses >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {formatCurrency(income - expenses)}
          </div>
        </div>
      </div>

      {/* Add transaction form */}
      {showForm && (
        <div className="bg-white rounded-3xl p-6 border border-rose/20 shadow-card">
          <h3 className="font-semibold text-charcoal mb-4">Add Transaction</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-2 gap-3">
            <div className="col-span-2 flex gap-2">
              {(['expense', 'income'] as const).map(t => (
                <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${form.type === t ? 'bg-gradient-rose text-white shadow-rose' : 'bg-cream text-muted border border-rose/10'}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted block mb-1">Merchant / Description</label>
              <input className={inputClass} placeholder="e.g. Whole Foods, Salary" required value={form.merchant} onChange={e => setForm(f => ({ ...f, merchant: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted block mb-1">Amount ($)</label>
              <input type="number" step="0.01" min="0.01" className={inputClass} placeholder="0.00" required value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted block mb-1">Date</label>
              <input type="date" className={inputClass} required value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted block mb-1">Category</label>
              <select className={inputClass} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {TRANSACTION_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-span-2 flex gap-2 pt-1">
              <button type="submit" disabled={saving}
                className="flex-1 py-2.5 bg-gradient-rose text-white text-sm font-semibold rounded-full shadow-rose disabled:opacity-60">
                {saving ? 'Saving...' : 'Save Transaction'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-5 py-2.5 text-sm font-medium text-muted border border-rose/15 rounded-full hover:bg-cream">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Spending by category */}
      {topCategories.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-rose/8 shadow-card">
          <h2 className="font-semibold text-charcoal mb-4">Spending by Category</h2>
          <div className="space-y-3">
            {topCategories.map(([cat, amt]) => (
              <div key={cat}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="flex items-center gap-2 text-charcoal font-medium">
                    {CATEGORY_EMOJIS[cat] ?? '📦'} {cat}
                  </span>
                  <span className="font-semibold text-charcoal">{formatCurrency(amt)}</span>
                </div>
                <div className="h-1.5 bg-cream-dark rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-rose rounded-full"
                    style={{ width: `${Math.min((amt / expenses) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction list */}
      <div className="bg-white rounded-3xl p-6 border border-rose/8 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-charcoal">All Transactions</h2>
          <div className="flex gap-1">
            {(['all', 'income', 'expense'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${filter === f ? 'bg-gradient-rose text-white' : 'text-muted hover:bg-cream'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-muted text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">💸</div>
            <p className="text-sm text-muted">No transactions yet. Add one above!</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map(tx => (
              <div key={tx.id} className="flex items-center gap-3 py-3 border-b border-cream last:border-0 group">
                <div className="w-10 h-10 rounded-xl bg-blush flex items-center justify-center text-lg flex-shrink-0">
                  {CATEGORY_EMOJIS[tx.category] ?? '📦'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-charcoal truncate">{tx.merchant}</div>
                  <div className="text-xs text-faint">{formatShortDate(tx.date)} · {tx.category}</div>
                </div>
                <div className={`text-sm font-semibold ${tx.type === 'income' ? 'text-emerald-600' : 'text-charcoal'}`}>
                  {tx.type === 'income' ? '+' : '−'}{formatCurrency(tx.amount)}
                </div>
                <button onClick={() => handleDelete(tx.id)}
                  className="opacity-0 group-hover:opacity-100 text-faint hover:text-red-400 transition-all ml-1 text-xs">
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
