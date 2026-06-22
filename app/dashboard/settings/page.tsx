'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getInitials } from '@/lib/utils'

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<{ full_name?: string; email?: string; plan_type?: string } | null>(null)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      const { data } = await supabase.from('profiles').select('*').eq('id', user?.id).single()
      setProfile({ ...data, email: user?.email })
      setName(data?.full_name ?? '')
    }
    load()
  }, [])

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setSaved(false)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('profiles').update({ full_name: name, updated_at: new Date().toISOString() }).eq('id', user?.id)
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  async function handleManageBilling() {
    setPortalLoading(true)
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
    else { alert('No active subscription found.'); setPortalLoading(false) }
  }

  const planColors: Record<string, string> = {
    free: 'bg-cream-dark text-muted',
    pro: 'bg-rose/10 text-rose-deep',
    business: 'bg-gold/10 text-gold',
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-charcoal">Settings</h1>
        <p className="text-sm text-muted mt-1">Manage your account and subscription</p>
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-3xl p-6 border border-rose/8 shadow-card">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-rose flex items-center justify-center text-white font-serif text-xl font-semibold shadow-rose flex-shrink-0">
            {getInitials(profile?.full_name ?? profile?.email ?? 'U')}
          </div>
          <div>
            <div className="font-semibold text-charcoal">{profile?.full_name ?? 'Your Name'}</div>
            <div className="text-sm text-muted">{profile?.email}</div>
            <span className={`mt-1 inline-block text-xs font-bold px-2 py-0.5 rounded-full capitalize ${planColors[profile?.plan_type ?? 'free']}`}>
              {profile?.plan_type ?? 'free'} plan
            </span>
          </div>
        </div>

        <form onSubmit={handleSaveName} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-rose/20 bg-cream text-charcoal text-sm focus:outline-none focus:border-rose-deep"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Email Address</label>
            <input
              type="email"
              value={profile?.email ?? ''}
              disabled
              className="w-full px-4 py-2.5 rounded-2xl border border-rose/10 bg-cream-dark text-muted text-sm cursor-not-allowed"
            />
          </div>
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 bg-gradient-rose text-white text-sm font-semibold rounded-full shadow-rose disabled:opacity-60">
            {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Subscription */}
      <div className="bg-white rounded-3xl p-6 border border-rose/8 shadow-card">
        <h2 className="font-semibold text-charcoal mb-4">Subscription</h2>
        <div className="flex items-center justify-between p-4 bg-cream rounded-2xl mb-4">
          <div>
            <div className="font-semibold text-charcoal capitalize">{profile?.plan_type ?? 'Free'} Plan</div>
            <div className="text-xs text-muted mt-0.5">
              {profile?.plan_type === 'free' ? 'Limited features' : 'Full access to all features'}
            </div>
          </div>
          {profile?.plan_type === 'free' ? (
            <a href="/pricing"
              className="px-4 py-2 bg-gradient-rose text-white text-xs font-bold rounded-full shadow-rose hover:shadow-rose-lg transition-all">
              Upgrade
            </a>
          ) : (
            <button onClick={handleManageBilling} disabled={portalLoading}
              className="px-4 py-2 border border-rose/20 text-rose-deep text-xs font-bold rounded-full hover:bg-blush transition-colors disabled:opacity-60">
              {portalLoading ? 'Loading...' : 'Manage Billing'}
            </button>
          )}
        </div>
        {profile?.plan_type === 'free' && (
          <p className="text-xs text-muted">
            Upgrade to <a href="/pricing" className="text-rose-deep font-semibold hover:underline">Starter ($19/mo)</a> or{' '}
            <a href="/pricing" className="text-rose-deep font-semibold hover:underline">Growth ($49/mo)</a> to unlock AI coaching, smart budgets, and more.
          </p>
        )}
      </div>

      {/* Security */}
      <div className="bg-white rounded-3xl p-6 border border-rose/8 shadow-card">
        <h2 className="font-semibold text-charcoal mb-4">Security</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-cream">
            <div>
              <div className="text-sm font-medium text-charcoal">Password</div>
              <div className="text-xs text-muted">Last changed: unknown</div>
            </div>
            <button className="text-xs text-rose-deep font-semibold hover:underline">Change</button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-2xl bg-cream">
            <div>
              <div className="text-sm font-medium text-charcoal">Two-Factor Authentication</div>
              <div className="text-xs text-muted">Extra security for your account</div>
            </div>
            <span className="text-xs text-faint">Coming soon</span>
          </div>
        </div>
      </div>

      {/* Sign out */}
      <div className="bg-white rounded-3xl p-6 border border-rose/8 shadow-card">
        <h2 className="font-semibold text-charcoal mb-4">Account</h2>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-red-500 border border-red-200 rounded-full hover:bg-red-50 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  )
}
