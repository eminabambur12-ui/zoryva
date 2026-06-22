'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignUpPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // If a session was returned, email confirmation is off — go straight to dashboard
    if (data.session) {
      router.push('/dashboard')
      router.refresh()
      return
    }

    // Otherwise, email confirmation is on — show "check your email"
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-card border border-rose/10 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-blush flex items-center justify-center text-3xl mx-auto mb-6">✉️</div>
          <h2 className="font-serif text-2xl font-semibold text-charcoal mb-3">Check your email</h2>
          <p className="text-muted text-sm leading-relaxed">
            We sent a confirmation link to <strong className="text-charcoal">{email}</strong>.
            Click it to activate your account and access your dashboard.
          </p>
          <Link href="/auth/signin" className="mt-6 inline-block text-sm text-rose-deep font-medium hover:underline">
            Back to sign in →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream flex">

      {/* Left panel — branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-dark flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <Link href="/" className="font-serif text-2xl font-semibold text-white relative">
          Zory<span className="text-rose">va</span>
        </Link>
        <div className="relative">
          <h2 className="font-serif text-4xl font-semibold text-white leading-tight mb-4">
            Your finances,<br />
            <em className="text-rose not-italic">finally</em> in control.
          </h2>
          <p className="text-white/50 leading-relaxed">
            Join thousands of ambitious women who use Zoryva to track money, grow businesses, and build wealth.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2">
              {['S', 'P', 'A'].map((l) => (
                <div key={l} className="w-8 h-8 rounded-full bg-gradient-rose border-2 border-ink flex items-center justify-center text-white text-xs font-bold">{l}</div>
              ))}
            </div>
            <p className="text-white/50 text-sm">4,800+ members and growing</p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="lg:hidden font-serif text-xl font-semibold text-charcoal block mb-8">
            Zory<span className="text-rose-deep">va</span>
          </Link>

          <h1 className="font-serif text-3xl font-semibold text-charcoal mb-2">Create your account</h1>
          <p className="text-muted text-sm mb-8">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-rose-deep font-medium hover:underline">Sign in</Link>
          </p>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Mina Bambur"
                required
                className="w-full px-4 py-3 rounded-2xl border border-rose/20 bg-white text-charcoal placeholder:text-faint text-sm focus:outline-none focus:border-rose-deep transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-2xl border border-rose/20 bg-white text-charcoal placeholder:text-faint text-sm focus:outline-none focus:border-rose-deep transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-2xl border border-rose/20 bg-white text-charcoal placeholder:text-faint text-sm focus:outline-none focus:border-rose-deep transition-colors"
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-gradient-rose text-white font-semibold text-sm shadow-rose hover:shadow-rose-lg hover:-translate-y-px transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none mt-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-xs text-faint mt-6">
            By signing up you agree to our{' '}
            <Link href="#" className="text-muted hover:text-charcoal">Terms of Service</Link>
            {' '}and{' '}
            <Link href="#" className="text-muted hover:text-charcoal">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
