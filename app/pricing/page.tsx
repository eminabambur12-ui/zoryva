import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const plans = [
  {
    name: 'Starter',
    price: 19,
    priceId: 'STRIPE_STARTER_PRICE_ID',
    tagline: 'For personal budgeting & daily money clarity',
    features: [
      'Daily Safe Spend number',
      'Personal income & expense tracking',
      'Up to 3 budget categories',
      'Basic savings goal',
      'Tax reserve estimate',
      'AI Coach — 20 messages/month',
    ],
    cta: 'Start Starter Plan',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: 49,
    priceId: 'STRIPE_GROWTH_PRICE_ID',
    tagline: 'For creators, side hustlers & small business owners',
    badge: 'Most Popular',
    features: [
      'Everything in Starter',
      'Business profit & loss tracking',
      'Pay Yourself Calculator',
      'Unlimited budget categories',
      'Goal simulator (savings, debt, home)',
      'AI Coach — 100 messages/month',
      'Business vs. personal split view',
      'Invoice tracking',
    ],
    cta: 'Start Growth Plan',
    highlighted: true,
  },
  {
    name: 'Pro',
    price: 99,
    priceId: 'STRIPE_PRO_PRICE_ID',
    tagline: 'For advanced business tracking & serious wealth building',
    features: [
      'Everything in Growth',
      'Unlimited AI Coach messages',
      'Multiple income stream tracking',
      'Deep tax planning tools',
      'Cash flow projections',
      'Quarterly financial review with Zara',
      'CSV export for accountants',
      'Priority support',
    ],
    cta: 'Start Pro Plan',
    highlighted: false,
  },
]

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-16">
            <div className="mb-3 text-xs font-bold uppercase tracking-widest text-rose-deep">Pricing</div>
            <h1 className="font-serif text-5xl font-semibold text-charcoal mb-4">
              Simple, honest pricing.
            </h1>
            <p className="text-muted text-lg max-w-md mx-auto">
              Start free. Upgrade when you're ready. Cancel any time — no questions asked.
            </p>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-3xl p-8 relative overflow-hidden flex flex-col ${
                  plan.highlighted
                    ? 'bg-gradient-dark'
                    : 'bg-white border border-rose/10 shadow-card'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 right-0 w-40 h-40 bg-rose/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                )}
                <div className="relative flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`text-sm font-bold ${plan.highlighted ? 'text-white/60' : 'text-muted'}`}>{plan.name}</div>
                    {plan.badge && (
                      <span className="px-2 py-0.5 bg-rose/20 text-rose text-xs font-bold rounded-full">{plan.badge}</span>
                    )}
                  </div>
                  <div className={`font-serif text-5xl font-semibold mb-1 ${plan.highlighted ? 'text-white' : 'text-charcoal'}`}>
                    ${plan.price}
                  </div>
                  <div className={`text-sm mb-3 ${plan.highlighted ? 'text-white/40' : 'text-faint'}`}>per month</div>
                  <p className={`text-sm leading-relaxed mb-6 ${plan.highlighted ? 'text-white/60' : 'text-muted'}`}>{plan.tagline}</p>

                  <form action="/api/stripe/checkout" method="POST">
                    <input type="hidden" name="priceId" value={`{{${plan.priceId}}}`} />
                    <input type="hidden" name="plan" value={plan.name.toLowerCase()} />
                    <button
                      type="submit"
                      className={`w-full py-3 px-6 rounded-full text-sm font-semibold transition-all mb-7 ${
                        plan.highlighted
                          ? 'bg-gradient-rose text-white shadow-rose hover:shadow-rose-lg hover:-translate-y-px'
                          : 'bg-gradient-rose text-white shadow-rose hover:shadow-rose-lg hover:-translate-y-px'
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </form>

                  <ul className="space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className={`flex items-start gap-2.5 text-sm ${plan.highlighted ? 'text-white/80' : 'text-muted'}`}>
                        <span className={`mt-0.5 font-bold flex-shrink-0 ${plan.highlighted ? 'text-rose' : 'text-rose-deep'}`}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Free tier note */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full border border-rose/10 shadow-card">
              <span className="text-sm text-muted">Just want to explore?</span>
              <Link href="/auth/signup" className="text-sm font-semibold text-rose-deep hover:underline">
                Start with the free plan →
              </Link>
            </div>
          </div>

          {/* Compare */}
          <div className="bg-white rounded-3xl p-8 border border-rose/8 shadow-card mb-16">
            <h2 className="font-serif text-3xl font-semibold text-charcoal mb-8 text-center">What's included in each plan</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cream">
                    <th className="text-left py-3 pr-6 font-semibold text-charcoal w-1/2">Feature</th>
                    {plans.map(p => <th key={p.name} className="py-3 px-4 font-semibold text-charcoal text-center">{p.name}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream">
                  {[
                    ['Daily Safe Spend Number', true, true, true],
                    ['Personal Finance Tracking', true, true, true],
                    ['Budget Categories', '3', 'Unlimited', 'Unlimited'],
                    ['Business P&L Tracking', false, true, true],
                    ['Pay Yourself Calculator', false, true, true],
                    ['Goal Simulator', false, true, true],
                    ['Invoice Tracking', false, true, true],
                    ['AI Coach Messages', '20/mo', '100/mo', 'Unlimited'],
                    ['Multiple Income Streams', false, false, true],
                    ['Cash Flow Projections', false, false, true],
                    ['CSV Export', false, false, true],
                  ].map(([feature, ...vals]) => (
                    <tr key={String(feature)}>
                      <td className="py-3 pr-6 text-charcoal">{feature}</td>
                      {vals.map((v, i) => (
                        <td key={i} className="py-3 px-4 text-center">
                          {v === true ? <span className="text-rose-deep font-bold">✓</span>
                            : v === false ? <span className="text-faint">—</span>
                            : <span className="text-muted font-medium">{v}</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl font-semibold text-charcoal text-center mb-10">Common questions</h2>
            <div className="space-y-4">
              {[
                ['Can I cancel any time?', 'Yes. Cancel instantly from Settings → Subscription. No fees, no questions. Your plan stays active until the end of the billing period.'],
                ['Is there a free plan?', 'Yes. The free plan gives you access to basic personal finance tracking and a limited AI Coach. Upgrade when you\'re ready for more.'],
                ['Do I need to connect a bank account?', 'No. You can enter transactions manually. Bank connections are optional but make tracking automatic.'],
                ['Is my financial data secure?', 'All data is encrypted at rest and in transit. We use Supabase (bank-level security) and never sell your data to anyone, ever.'],
                ['What is the AI coach powered by?', 'Zara is powered by OpenAI GPT-4. She has access to your real transaction data to give personalized — not generic — advice.'],
                ['Can I switch plans?', 'Yes. Upgrade or downgrade any time. Prorated billing applies automatically.'],
              ].map(([q, a]) => (
                <div key={String(q)} className="bg-white rounded-2xl p-6 border border-rose/8 shadow-card">
                  <h3 className="font-semibold text-charcoal mb-2">{q}</h3>
                  <p className="text-sm text-muted leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
