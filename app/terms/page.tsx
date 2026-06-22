import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service — Zoryva',
  description: 'Terms governing your use of Zoryva, including subscription and refund policies.',
}

export default function TermsPage() {
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

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-serif text-4xl font-semibold text-charcoal mb-2">Terms of Service</h1>
        <p className="text-muted text-sm mb-12">Last updated: June 22, 2026</p>

        <div className="space-y-10 text-charcoal/80 leading-relaxed">

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">1. Agreement to Terms</h2>
            <p>
              By creating an account or using Zoryva, you agree to these Terms of Service. If you do not agree,
              please do not use our service. These terms apply to all users of Zoryva, including free and paid subscribers.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">2. What Zoryva Is</h2>
            <p>
              Zoryva is a personal and business financial management tool that provides budgeting, transaction tracking,
              and AI-powered financial coaching through our assistant, Zara. Zoryva is a software tool — not a licensed
              financial advisor, investment advisor, or bank. Any information or suggestions provided by Zara are for
              informational purposes only and should not be treated as professional financial, legal, or tax advice.
              Always consult a qualified professional for major financial decisions.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">3. Accounts</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>You must be at least 18 years old to create an account.</li>
              <li>You are responsible for keeping your password secure.</li>
              <li>You are responsible for all activity that occurs under your account.</li>
              <li>One person may not share an account with another person (except the Business plan's 2-seat allowance).</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">4. Subscription Plans & Pricing</h2>

            <div className="bg-white rounded-2xl border border-rose/10 p-6 mb-4 space-y-4">
              <div>
                <div className="font-semibold text-charcoal">Free Plan — $0/month</div>
                <div className="text-sm text-muted mt-1">1 bank account, 3-month transaction history, basic budgets, manual entry</div>
              </div>
              <div className="border-t border-rose/10 pt-4">
                <div className="font-semibold text-charcoal">Pro Plan — $19/month</div>
                <div className="text-sm text-muted mt-1">Unlimited accounts, full history, smart budgets, AI Coach (50 messages/month), analytics, business P&L</div>
              </div>
              <div className="border-t border-rose/10 pt-4">
                <div className="font-semibold text-charcoal">Business Plan — $39/month</div>
                <div className="text-sm text-muted mt-1">Everything in Pro, unlimited AI messages, invoice tracker, tax export, 2 team seats</div>
              </div>
            </div>

            <p>
              All prices are in US dollars. Subscriptions are billed monthly on the same date each month.
              Prices may change with 30 days' notice sent to your registered email.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">5. Payments & Billing</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Payments are processed securely by Stripe. We never store your full credit card number.</li>
              <li>Your subscription renews automatically each month unless you cancel.</li>
              <li>If a payment fails, we will retry it and notify you by email. Your access may be paused if payment cannot be collected after multiple attempts.</li>
              <li>You can update your payment method at any time in your account settings.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">6. Cancellations & Refunds</h2>

            <div className="bg-rose/5 border border-rose/20 rounded-2xl p-5 mb-4">
              <div className="font-semibold text-charcoal mb-2">Our Refund Policy</div>
              <ul className="text-sm space-y-2 text-charcoal/80">
                <li>✓ <strong>Cancel any time</strong> — no contracts, no cancellation fees</li>
                <li>✓ <strong>Keep access</strong> until the end of your current billing period after cancelling</li>
                <li>✓ <strong>7-day refund</strong> for first-time subscribers who are unsatisfied — email us within 7 days of your first charge</li>
                <li>✗ <strong>No refunds</strong> for partial months or if you simply forgot to cancel</li>
              </ul>
            </div>

            <p>
              To cancel, go to <strong>Settings → Billing</strong> in your dashboard, or email us at{' '}
              <a href="mailto:hello@zoryva.app" className="text-rose-deep hover:underline">hello@zoryva.app</a>.
              To request a refund within the 7-day window, email us with your account email and reason.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">7. Acceptable Use</h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use Zoryva for any illegal purpose</li>
              <li>Share your account credentials with others (Free and Pro plans)</li>
              <li>Attempt to hack, reverse-engineer, or disrupt the service</li>
              <li>Upload false or misleading financial data to manipulate AI responses</li>
              <li>Resell or commercially redistribute Zoryva's features</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">8. Your Data</h2>
            <p>
              You own your financial data. We provide it to power your experience and never sell it.
              You can export or delete your data at any time. See our{' '}
              <Link href="/privacy" className="text-rose-deep hover:underline">Privacy Policy</Link> for full details.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">9. Disclaimer of Warranties</h2>
            <p>
              Zoryva is provided "as is" without warranties of any kind. We do not guarantee that the service will be
              uninterrupted, error-free, or that AI-generated advice will be accurate or suitable for your situation.
              Use Zoryva's insights as one input among many, not as your sole financial guidance.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Zoryva shall not be liable for any indirect, incidental, or
              consequential damages arising from your use of the service, including financial losses resulting from
              decisions made based on AI-generated advice.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">11. Governing Law</h2>
            <p>
              These terms are governed by the laws of the State of Arizona, United States. Any disputes will be
              resolved in the courts of Maricopa County, Arizona.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">12. Changes to Terms</h2>
            <p>
              We may update these terms with 30 days' notice via email. Continued use of Zoryva after the effective
              date of changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">13. Contact</h2>
            <p>
              Questions? Email us at{' '}
              <a href="mailto:hello@zoryva.app" className="text-rose-deep hover:underline">hello@zoryva.app</a>{' '}
              or use our <Link href="/contact" className="text-rose-deep hover:underline">contact form</Link>.
            </p>
          </section>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-rose/10 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap gap-6 text-sm text-muted">
          <Link href="/privacy" className="hover:text-charcoal transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-charcoal transition-colors font-medium text-charcoal">Terms of Service</Link>
          <Link href="/contact" className="hover:text-charcoal transition-colors">Contact</Link>
        </div>
      </footer>
    </div>
  )
}
