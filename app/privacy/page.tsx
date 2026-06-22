import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy — Zoryva',
  description: 'How Zoryva collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
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
        <h1 className="font-serif text-4xl font-semibold text-charcoal mb-2">Privacy Policy</h1>
        <p className="text-muted text-sm mb-12">Last updated: June 22, 2026</p>

        <div className="prose prose-sm max-w-none space-y-10 text-charcoal/80 leading-relaxed">

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">1. Who We Are</h2>
            <p>
              Zoryva is a financial management platform operated by an individual based in Arizona, United States.
              We provide AI-powered financial coaching, budgeting tools, and business financial tracking.
              If you have questions about this policy, contact us at <a href="mailto:hello@zoryva.app" className="text-rose-deep hover:underline">hello@zoryva.app</a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">2. Information We Collect</h2>
            <p className="mb-3">We collect the following types of information:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Account information:</strong> Your name, email address, and password when you create an account.</li>
              <li><strong>Financial data:</strong> Transaction records, income, expenses, budgets, and goals that you manually enter or connect via third-party services.</li>
              <li><strong>Usage data:</strong> How you use the app, which features you access, and your AI chat history with Zara.</li>
              <li><strong>Payment information:</strong> Billing details processed securely by Stripe. We never store your full card number.</li>
              <li><strong>Device information:</strong> Browser type, IP address, and device type for security and analytics purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide and improve our services</li>
              <li>To power Zara, your AI financial coach, with your actual financial data</li>
              <li>To process payments and manage your subscription</li>
              <li>To send you important account notifications and updates</li>
              <li>To respond to your support requests</li>
              <li>To detect and prevent fraud or unauthorized access</li>
            </ul>
            <p className="mt-3">We do <strong>not</strong> sell your personal information to third parties. Ever.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">4. How We Share Your Information</h2>
            <p className="mb-3">We share your information only with trusted service providers necessary to operate Zoryva:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Supabase</strong> — stores your account data and financial records securely</li>
              <li><strong>OpenAI</strong> — powers Zara AI responses (your messages are processed but not stored by OpenAI for training)</li>
              <li><strong>Stripe</strong> — handles all payment processing</li>
              <li><strong>Vercel</strong> — hosts the application</li>
            </ul>
            <p className="mt-3">We may disclose information if required by law or to protect the rights and safety of our users.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">5. Data Security</h2>
            <p>
              We use industry-standard security practices including encrypted connections (HTTPS), secure password hashing,
              and row-level security on our database. However, no method of transmission over the internet is 100% secure.
              We encourage you to use a strong, unique password for your Zoryva account.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">6. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active. If you delete your account, we will delete
              your personal data within 30 days, except where we are required to retain it by law.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">7. Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and data</li>
              <li>Export your financial data at any time</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, email us at <a href="mailto:hello@zoryva.app" className="text-rose-deep hover:underline">hello@zoryva.app</a>.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">8. Cookies</h2>
            <p>
              We use cookies only for authentication (keeping you logged in) and basic analytics.
              We do not use advertising cookies or tracking pixels.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">9. Children's Privacy</h2>
            <p>
              Zoryva is not intended for use by anyone under the age of 18. We do not knowingly collect
              personal information from children. If you believe a child has provided us with their information,
              please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">10. Governing Law</h2>
            <p>
              This Privacy Policy is governed by the laws of the State of Arizona and the United States.
              Any disputes will be resolved in the courts of Maricopa County, Arizona.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">11. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. We will notify you of significant changes via email
              or a notice on the app. Continued use of Zoryva after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">12. Contact Us</h2>
            <p>
              Questions about this policy? Email us at{' '}
              <a href="mailto:hello@zoryva.app" className="text-rose-deep hover:underline">hello@zoryva.app</a>{' '}
              or use our <Link href="/contact" className="text-rose-deep hover:underline">contact form</Link>.
            </p>
          </section>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-rose/10 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap gap-6 text-sm text-muted">
          <Link href="/privacy" className="hover:text-charcoal transition-colors font-medium text-charcoal">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-charcoal transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-charcoal transition-colors">Contact</Link>
        </div>
      </footer>
    </div>
  )
}
