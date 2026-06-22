import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-cream-dark border-t border-rose/10">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="font-serif text-xl font-semibold text-charcoal mb-3">
              Zory<span className="text-rose-deep">va</span>
            </div>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              The luxury financial companion for ambitious women.
            </p>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-faint mb-4">Product</div>
            <div className="flex flex-col gap-2">
              {[['Features', '#features'], ['Pricing', '/pricing'], ['Dashboard', '/auth/signup']].map(([l, h]) => (
                <Link key={l} href={h} className="text-sm text-muted hover:text-charcoal transition-colors">{l}</Link>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-faint mb-4">Support</div>
            <div className="flex flex-col gap-2">
              {[['Contact Us', '/contact'], ['Pricing', '/pricing'], ['Sign Up', '/auth/signup']].map(([l, h]) => (
                <Link key={l} href={h} className="text-sm text-muted hover:text-charcoal transition-colors">{l}</Link>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-faint mb-4">Legal</div>
            <div className="flex flex-col gap-2">
              {[['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Refund Policy', '/terms#refunds']].map(([l, h]) => (
                <Link key={l} href={h} className="text-sm text-muted hover:text-charcoal transition-colors">{l}</Link>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-rose/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-faint">© 2026 Zoryva. All rights reserved.</p>
          <p className="text-xs text-faint">Made with ♥ for ambitious women</p>
        </div>
      </div>
    </footer>
  )
}
