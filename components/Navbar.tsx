'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-xl border-b border-rose/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="font-serif text-xl font-semibold text-charcoal">
          Zory<span className="text-rose-deep">va</span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-8 list-none">
          {[['Features', '#features'], ['Pricing', '/pricing'], ['About', '#about']].map(([label, href]) => (
            <li key={label}>
              <Link href={href} className="text-sm font-medium text-muted hover:text-charcoal transition-colors">
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/signin"
            className="px-5 py-2 text-sm font-medium text-charcoal border border-rose/20 rounded-full hover:border-rose/50 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="px-5 py-2 text-sm font-semibold text-white bg-gradient-rose rounded-full shadow-rose hover:shadow-rose-lg hover:-translate-y-px transition-all"
          >
            Get Started Free
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-muted"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-rose/10 px-6 py-4 flex flex-col gap-4">
          <Link href="#features" className="text-sm font-medium text-muted" onClick={() => setMenuOpen(false)}>Features</Link>
          <Link href="/pricing" className="text-sm font-medium text-muted" onClick={() => setMenuOpen(false)}>Pricing</Link>
          <Link href="/auth/signin" className="text-sm font-medium text-muted" onClick={() => setMenuOpen(false)}>Sign In</Link>
          <Link href="/auth/signup" className="px-5 py-2 text-sm font-semibold text-white bg-gradient-rose rounded-full text-center" onClick={() => setMenuOpen(false)}>
            Get Started Free
          </Link>
        </div>
      )}
    </nav>
  )
}
