'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, TRANSACTION_CATEGORIES, CATEGORY_EMOJIS } from '@/lib/utils'

type Budget = { id: string; category: string; amount: number; month: string }
type Spent = Record<string, number>

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [spent, setSpent] = useState<Spent>({})
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ category: 'Food & Dining', amount: '' })
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  const monthLabel = new Date().toLocaleString('default', { month: 'long', year: 'numeric' })

  async function load() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const [{ data: b }, { data: tx }] = await Promise.all([
      supabase.from('budgets').select('*').eq('user_id', user?.id).eq('month', monthStart),
      supabase.from('transactions').select('category, amount').eq('user_id', user?.id).eq('type', 'expense').gte('date', monthStart),
    ])
    setBudgets(b ?? [])
    const s: Spent = {}
    tx?.forEach(t => { s[t.category] = (s[t.category] ?? 0) + t.amount })
    setSpent(s)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('budgets').upsert({
      user_id: user?.id, category: form.category, amount: parseFloat(form.amount), month: monthStart,
    }, { onConflict: 'user_id,category,month' })
    setForm({ category: 'Food & Dining', amount: '' })
    setShowForm(false); setSaving(false); load()
  }

  async function del(id: string) { await supabase.from('budgets').delete().eq('id', id); load() }

  const totalBudget = budgets.reduce((s, b) => s + b.amount, 0)
  const totalSpent = budgets.reduce((s, b) => s + (spent[b.category] ?? 0), 0)
  const inputClass = 'w-full px-4 py-2.5 rounded-2xl border border-rose/20 bg-cream text-charcoal text-sm focus:outline-none focus:border-rose-deep'

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-charcoal">Budgets</h1>
          <p className="text-sm text-muted mt-1">{monthLabel} · Set limits, track progress</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 bg-gradient-rose text-white text-sm font-semibold rounded-full shadow-rose hover:shadow-rose-lg hover:-translate-y-px transition-all">
          + Set Budget
        </button>
      </div>

      {/* Overview */}
      <div className="bg-gradient-blush rounded-3xl p-6 border border-rose/15">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-rose-deep mb-1">Total Budgeted</div>
            <div className="font-serif text-3xl font-semibold text-charcoal">{formatCurrency(totalBudget)}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-widest text-rose-deep mb-1">Spent</div>
            <div className="font-serif text-3xl font-semibold text-charcoal">{formatCurrency(totalSpent)}</div>
          </div>
        </div>
        <div className="h-2 bg-rose/15 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-rose rounded-full transition-all" style={{ width: totalBudget > 0 ? `${Math.min((totalSpent / totalBudget) * 100, 100)}%` : '0%' }} />
        </div>
        <div className="flex justify-between text-xs mt-2">
          <span className="text-rose-deep font-semibold">{totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% used</span>
          <span className="text-muted">{formatCurrency(totalBudget - totalSpent)} remaining</span>
        </div>
      </div>

      {/* Add budget form */}
      {showForm && (
        <div className="bg-white rounded-3xl p-6 border border-rose/20 shadow-card">
          <h3 className="font-semibold text-charcoal mb-4">Set Monthly Budget</h3>
          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted block mb-1">Category</label>
              <select className={inputClass} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {TRANSACTION_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted block mb-1">Monthly limit ($)</label>
              <input type="number" step="1" min="1" className={inputClass} placeholder="500" required value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-gradient-rose text-white text-sm font-semibold rounded-full disabled:opacity-60">
                {saving ? 'Saving...' : 'Save Budget'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm font-medium text-muted border border-rose/15 rounded-full">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Budget list */}
      <div className="bg-white rounded-3xl p-6 border border-rose/8 shadow-card">
        <h2 className="font-semibold text-charcoal mb-5">Your Budgets</h2>
        {loading ? <div className="text-center py-8 text-muted text-sm">Loading...</div>
          : budgets.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">🎯</div>
              <p className="text-sm font-medium text-charcoal mb-1">No budgets set yet</p>
              <p className="text-xs text-faint">Add your first budget category above to start tracking.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {budgets.map(b => {
                const s = spent[b.category] ?? 0
                const pct = Math.min(Math.round((s / b.amount) * 100), 100)
                const over = s > b.amount
                const warn = pct >= 80 && !over
                return (
                  <div key={b.id} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-charcoal">
                        <span>{CATEGORY_EMOJIS[b.category] ?? '📦'}</span> {b.category}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted">
                          <strong className="text-charcoal">{formatCurrency(s)}</strong> / {formatCurrency(b.amount)}
                        </span>
                        <button onClick={() => del(b.id)} className="opacity-0 group-hover:opacity-100 text-xs text-faint hover:text-red-400 transition-all">✕</button>
                      </div>
                    </div>
                    <div className="h-2 bg-cream-dark rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${over ? 'bg-red-400' : warn ? 'bg-amber-400' : 'bg-gradient-rose'}`} style={{ width: `${pct}%` }} />
                    </div>
                    <div className={`text-xs mt-1 font-medium ${over ? 'text-red-500' : warn ? 'text-amber-600' : 'text-muted'}`}>
                      {over ? `⚠ Over by ${formatCurrency(s - b.amount)}` : warn ? `${pct}% used · ${formatCurrency(b.amount - s)} left` : `${pct}% used · ${formatCurrency(b.amount - s)} left`}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
      </div>
    </div>
  )
}
