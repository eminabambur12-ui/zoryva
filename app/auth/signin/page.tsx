'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Incorrect email or password.')
      setLoading(false)
      return
    }

    // Store token so chat can use it
    if (data.session?.access_token) {
      localStorage.setItem('zoryva_token', data.session.access_token)
    }

    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen bg-cream flex">

      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-dark flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <Link href="/" className="font-serif text-2xl font-semibold text-white relative">
          Zory<span className="text-rose">va</span>
        </Link>
        <div className="relative">
          <h2 className="font-serif text-4xl font-semibold text-white leading-tight mb-4">
            Welcome back.<br />
            <em className="text-rose not-italic">Your numbers await.</em>
          </h2>
          <p className="text-white/50 leading-relaxed">
            Sign in to access your dashboard, track your finances, and chat with your AI coach.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="lg:hidden font-serif text-xl font-semibold text-charcoal block mb-8">
            Zory<span className="text-rose-deep">va</span>
          </Link>

          <h1 className="font-serif text-3xl font-semibold text-charcoal mb-2">Sign in</h1>
          <p className="text-muted text-sm mb-8">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-rose-deep font-medium hover:underline">Create one free</Link>
          </p>

          <form onSubmit={handleSignIn} className="space-y-4">
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-charcoal">Password</label>
                <Link href="#" className="text-xs text-rose-deep hover:underline">Forgot password?</Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
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
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
