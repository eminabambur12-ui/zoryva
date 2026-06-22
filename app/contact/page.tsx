'use client'

import { useState } from 'react'
import Link from 'next/link'

const TOPICS = [
  { value: 'feedback', label: '💡 Feature idea or feedback' },
  { value: 'bug', label: '🐛 Something is broken' },
  { value: 'billing', label: '💳 Billing or subscription question' },
  { value: 'account', label: '🔐 Account help' },
  { value: 'other', label: '💬 Something else' },
]

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [topic, setTopic] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, topic, message }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Nav */}
      <nav className="border-b border-rose/10 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl font-semibold text-charcoal">
            Zory<span className="text-rose-deep">va</span>
          </Link>
          <Link href="/" className="text-sm text-muted hover:text-charcoal transition-colors">← Back to home</Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-semibold text-charcoal mb-3">Get in touch</h1>
          <p className="text-muted text-base leading-relaxed">
            Have a question, idea, or ran into an issue? I read every message personally and usually reply within 24 hours.
          </p>
        </div>

        {success ? (
          <div className="bg-white rounded-3xl border border-rose/10 shadow-card p-10 text-center">
            <div className="text-4xl mb-4">✉️</div>
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-2">Message sent!</h2>
            <p className="text-muted mb-6">Thanks for reaching out. I'll get back to you within 24 hours.</p>
            <Link href="/" className="text-rose-deep hover:underline text-sm font-medium">← Back to home</Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-rose/10 shadow-card p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">Your name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Jane Smith"
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-rose/20 bg-cream text-charcoal placeholder:text-faint text-sm focus:outline-none focus:border-rose-deep transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 rounded-2xl border border-rose/20 bg-cream text-charcoal placeholder:text-faint text-sm focus:outline-none focus:border-rose-deep transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">What's this about?</label>
                <select
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-rose/20 bg-cream text-charcoal text-sm focus:outline-none focus:border-rose-deep transition-colors"
                >
                  <option value="">Select a topic...</option>
                  {TOPICS.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Your message</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tell me what's on your mind — the more detail the better..."
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-2xl border border-rose/20 bg-cream text-charcoal placeholder:text-faint text-sm focus:outline-none focus:border-rose-deep transition-colors resize-none"
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
                className="w-full py-3.5 rounded-full bg-gradient-rose text-white font-semibold text-sm shadow-rose hover:shadow-rose-lg hover:-translate-y-px transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Sending...' : 'Send message →'}
              </button>
            </form>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-muted">
          Or email directly: <a href="mailto:hello@zoryva.app" className="text-rose-deep hover:underline">hello@zoryva.app</a>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-rose/10 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap gap-6 text-sm text-muted">
          <Link href="/privacy" className="hover:text-charcoal transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-charcoal transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-charcoal transition-colors font-medium text-charcoal">Contact</Link>
        </div>
      </footer>
    </div>
  )
}
