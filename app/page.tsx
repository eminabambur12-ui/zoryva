import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const audiences = [
  {
    emoji: '🎥', title: 'Creators & Influencers',
    pains: ['TikTok & brand deal payouts are all over the place', 'Never know what\'s actually profit vs. just revenue', 'Forget to save for taxes and get blindsided', 'Overspend in good months and panic in slow ones'],
  },
  {
    emoji: '🛍️', title: 'Small Business Owners',
    pains: ['Shopify sales look great but where did the money go?', 'Expenses, inventory, and subscriptions eating profit', 'No idea how much to pay yourself each month', 'Cash flow is a mystery until it\'s a crisis'],
  },
  {
    emoji: '⚡', title: 'Side Hustlers',
    pains: ['Multiple income streams but no clear financial picture', 'Personal and business money constantly mixed up', 'Savings goals that never seem to get closer', 'Spending is fine until suddenly it really isn\'t'],
  },
  {
    emoji: '💻', title: 'Freelancers',
    pains: ['Client payments arrive randomly — planning is impossible', 'Every month feels like starting from scratch', 'Tax season is a panic every single year', 'Project income doesn\'t translate to real savings'],
  },
  {
    emoji: '💅', title: 'Beauty & Service Providers',
    pains: ['Cash, Venmo, Square — it\'s all mixed together', 'Product costs and supplies eat the margin quietly', 'Inconsistent bookings make monthly budgeting impossible', 'No system for separating income from business money'],
  },
  {
    emoji: '🎓', title: 'Students & New Adults',
    pains: ['Nobody taught me how to actually manage money', 'Spending freely then suddenly the account is low', 'Don\'t know how to start saving or how much', 'Every financial decision feels like a guess'],
  },
]

const features = [
  {
    icon: '🔢',
    title: 'Daily Safe Spend Number',
    desc: 'Every morning, Zoryva tells you exactly how much you can spend today — after bills, savings goals, taxes, and upcoming expenses. No more guessing.',
    highlight: true,
  },
  {
    icon: '💼',
    title: 'Business + Personal in One Place',
    desc: 'See your personal budget and business profit/loss together. Know what\'s yours to keep and what needs to stay in the business.',
  },
  {
    icon: '✨',
    title: 'AI Money Coach — Zara',
    desc: 'Ask Zara anything: "Can I afford this?" "Why isn\'t my account growing?" "How much should I save for taxes?" She answers based on your actual data.',
    highlight: true,
  },
  {
    icon: '🎯',
    title: 'Goal Simulator',
    desc: 'See exactly how long it will take to save for a vacation, pay off debt, launch a product, or buy a home — based on your current trajectory.',
  },
  {
    icon: '💰',
    title: 'Pay Yourself Calculator',
    desc: 'Business owners: know exactly how much you can take home this month without hurting cash flow or growth. Stop guessing your own salary.',
  },
  {
    icon: '🏛️',
    title: 'Tax Reserve Helper',
    desc: 'Automatically estimates what you should set aside for taxes each month. Never get blindsided by a tax bill again.',
    highlight: true,
  },
]

const questions = [
  'How much can I safely spend today?',
  'Am I actually making money?',
  'How much should I save for taxes?',
  'Can I afford this $800 purchase?',
  'Why is my account not growing?',
  'How much can I pay myself this month?',
  'What should I cut back on?',
  'How long until I reach my goal?',
]

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>

        {/* ── HERO ───────────────────────────────────────── */}
        <section className="min-h-screen flex items-center justify-center text-center px-6 pt-28 pb-16 relative overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose/7 rounded-full blur-[140px] pointer-events-none" />

          <div className="relative max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blush border border-rose/20 text-xs font-bold text-rose-deep uppercase tracking-widest mb-8">
              ✦ The Money OS for Variable Income
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-semibold text-charcoal leading-[1.06] mb-6">
              Know Your Numbers.<br />
              <em className="text-rose-deep not-italic">Grow With Confidence.</em>
            </h1>

            <p className="text-lg md:text-xl text-muted leading-relaxed max-w-2xl mx-auto mb-4">
              Zoryva helps creators, entrepreneurs, and variable-income earners know exactly how much they can <strong className="text-charcoal">spend</strong>, <strong className="text-charcoal">save</strong>, and <strong className="text-charcoal">grow</strong> every day.
            </p>
            <p className="text-base text-muted mb-10 max-w-xl mx-auto">
              Not another budget tracker. Your daily money decision-maker.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/auth/signup"
                className="px-8 py-4 text-base font-semibold text-white bg-gradient-rose rounded-full shadow-rose hover:shadow-rose-lg hover:-translate-y-0.5 transition-all">
                Start My Money Plan
              </Link>
              <Link href="#how-it-works"
                className="px-8 py-4 text-base font-medium text-charcoal border border-rose/20 rounded-full hover:border-rose/40 transition-colors">
                See How It Works ↓
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center justify-center flex-wrap">
              {[['$2.4M+', 'Tracked by members'], ['4,800+', 'Founders & creators'], ['98%', 'Feel more in control']].map(([num, label], i, arr) => (
                <div key={label} className="flex items-center">
                  <div className="px-8 text-center">
                    <div className="font-serif text-3xl font-semibold text-charcoal">{num}</div>
                    <div className="text-sm text-muted mt-1">{label}</div>
                  </div>
                  {i < arr.length - 1 && <div className="w-px h-10 bg-rose/15" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AUDIENCE SECTION ───────────────────────────── */}
        <section className="py-24 px-6 bg-cream-dark">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <div className="mb-3 text-xs font-bold uppercase tracking-widest text-rose-deep">Who it's for</div>
              <h2 className="font-serif text-4xl md:text-5xl font-semibold text-charcoal">
                Built for the way you actually earn.
              </h2>
              <p className="mt-4 text-muted max-w-xl mx-auto">
                Traditional finance apps are built for people with steady 9-to-5 income. You don't have that. Zoryva does.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {audiences.map((a) => (
                <div key={a.title} className="bg-white rounded-3xl p-7 border border-rose/8 shadow-card hover:shadow-rose hover:-translate-y-1 transition-all duration-300">
                  <div className="text-3xl mb-4">{a.emoji}</div>
                  <h3 className="font-semibold text-charcoal text-lg mb-4">{a.title}</h3>
                  <ul className="space-y-2">
                    {a.pains.map(p => (
                      <li key={p} className="flex items-start gap-2 text-sm text-muted">
                        <span className="text-rose mt-0.5 flex-shrink-0">→</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <p className="text-muted text-sm mb-4">Sound familiar? Zoryva was built for exactly this.</p>
              <Link href="/auth/signup"
                className="inline-block px-8 py-3.5 bg-gradient-rose text-white font-semibold text-sm rounded-full shadow-rose hover:shadow-rose-lg hover:-translate-y-px transition-all">
                Start My Money Plan Free
              </Link>
            </div>
          </div>
        </section>

        {/* ── CORE DIFFERENTIATOR ────────────────────────── */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-4">
              <div className="mb-3 text-xs font-bold uppercase tracking-widest text-rose-deep">What makes Zoryva different</div>
              <h2 className="font-serif text-4xl md:text-5xl font-semibold text-charcoal max-w-2xl mx-auto">
                Not another budget app.<br />
                <span className="text-rose-deep">Your daily money decision-maker.</span>
              </h2>
              <p className="mt-4 text-muted max-w-xl mx-auto">
                Most apps show you what you already spent. Zoryva tells you what to do next.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
              {features.map((f) => (
                <div key={f.title} className={`rounded-3xl p-7 border transition-all duration-300 ${
                  f.highlight
                    ? 'bg-gradient-dark border-transparent text-white'
                    : 'bg-white border-rose/8 shadow-card hover:shadow-rose hover:-translate-y-1'
                }`}>
                  <div className={`text-3xl mb-4`}>{f.icon}</div>
                  <h3 className={`font-semibold text-lg mb-3 ${f.highlight ? 'text-white' : 'text-charcoal'}`}>{f.title}</h3>
                  <p className={`text-sm leading-relaxed ${f.highlight ? 'text-white/65' : 'text-muted'}`}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AI COACH SHOWCASE ──────────────────────────── */}
        <section className="py-24 px-6 bg-cream-dark">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="mb-3 text-xs font-bold uppercase tracking-widest text-rose-deep">Meet Zara</div>
                <h2 className="font-serif text-4xl font-semibold text-charcoal mb-5">
                  Ask your AI coach anything.<br />
                  <em className="not-italic text-rose-deep">Get real answers.</em>
                </h2>
                <p className="text-muted leading-relaxed mb-6">
                  Zara knows your exact income, spending, and business numbers — so every answer is personalized to your actual situation. No generic tips.
                </p>
                <Link href="/auth/signup"
                  className="inline-block px-7 py-3 bg-gradient-rose text-white font-semibold text-sm rounded-full shadow-rose hover:shadow-rose-lg hover:-translate-y-px transition-all">
                  Try Zara Free →
                </Link>
              </div>

              {/* Chat mockup */}
              <div className="bg-white rounded-3xl p-6 shadow-card border border-rose/8">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-cream">
                  <div className="w-9 h-9 rounded-full bg-gradient-rose flex items-center justify-center text-base shadow-rose">✨</div>
                  <div>
                    <div className="text-sm font-semibold text-charcoal">Zara · AI Money Coach</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-xs text-muted">Knows your real numbers</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <div className="max-w-[80%] bg-gradient-rose text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-sm">
                      Can I afford to buy a $600 camera?
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-rose flex items-center justify-center text-xs flex-shrink-0 mt-1">✨</div>
                    <div className="bg-cream rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-charcoal leading-relaxed max-w-[85%]">
                      Based on your numbers: you have $840 in savings this month and your daily safe spend is $28. A $600 camera would use 71% of your savings buffer.<br /><br />
                      <strong>My recommendation:</strong> Wait 3 weeks. At your current pace you'll have $1,100 saved and the purchase won't set back your emergency fund goal.
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {questions.slice(0, 4).map(q => (
                      <span key={q} className="px-3 py-1 rounded-full bg-blush border border-rose/15 text-xs text-rose-deep font-medium cursor-default">{q}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ───────────────────────────────── */}
        <section id="how-it-works" className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-4xl p-10 md:p-14 shadow-card border border-rose/8">
              <div className="text-center mb-12">
                <div className="mb-3 text-xs font-bold uppercase tracking-widest text-rose-deep">How it works</div>
                <h2 className="font-serif text-4xl font-semibold text-charcoal">Set up in under 5 minutes.</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { n: '01', t: 'Create your account', d: 'Sign up in 30 seconds. No credit card needed to start.' },
                  { n: '02', t: 'Add your income & expenses', d: 'Enter transactions manually or connect your bank. Your data stays private.' },
                  { n: '03', t: 'Set your budgets & goals', d: 'Tell Zoryva your bills, savings goals, and spending categories.' },
                  { n: '04', t: 'Get your Daily Safe Spend', d: 'Every day, Zoryva tells you exactly what you can spend. Ask Zara for deeper advice.' },
                ].map(s => (
                  <div key={s.n} className="text-center">
                    <div className="w-11 h-11 rounded-full bg-gradient-rose text-white text-sm font-bold flex items-center justify-center mx-auto mb-5 shadow-rose">{s.n}</div>
                    <h3 className="font-semibold text-charcoal mb-2">{s.t}</h3>
                    <p className="text-sm text-muted leading-relaxed">{s.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ───────────────────────────────── */}
        <section className="py-24 px-6 bg-cream-dark">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="mb-3 text-xs font-bold uppercase tracking-widest text-rose-deep">Real members</div>
              <h2 className="font-serif text-4xl font-semibold text-charcoal">They feel it too.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { q: 'Zoryva told me I could safely spend $42 today. That one number changed everything. I stopped the constant anxiety about money.', name: 'Sarah K.', role: 'Content Creator, 180K followers' },
                { q: 'The Pay Yourself Calculator showed me I was underpaying myself by $1,200/month. I had no idea. Zara is the business coach I couldn\'t afford to hire.', name: 'Priya M.', role: 'Shopify Store Owner' },
                { q: 'As a freelancer, I used to panic every slow month. Now I know my exact safe spend number and I\'ve been saving 40% of every paycheck.', name: 'Amara J.', role: 'Brand Consultant & Freelancer' },
              ].map(t => (
                <div key={t.name} className="bg-white rounded-3xl p-8 border border-rose/8 shadow-card">
                  <div className="text-rose-deep text-2xl mb-4">✦</div>
                  <p className="text-charcoal leading-relaxed mb-6 font-serif italic">"{t.q}"</p>
                  <div>
                    <div className="font-semibold text-charcoal text-sm">{t.name}</div>
                    <div className="text-xs text-muted mt-1">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ──────────────────────────────────── */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-dark rounded-4xl px-8 md:px-16 py-20 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-72 h-72 bg-rose/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
              <div className="relative">
                <h2 className="font-serif text-4xl md:text-5xl font-semibold text-white mb-4">
                  Every day, Zoryva tells you<br />
                  what to spend, save, and do next.
                </h2>
                <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
                  Start free. No credit card needed. Your financial clarity is one sign-up away.
                </p>
                <Link href="/auth/signup"
                  className="inline-block px-10 py-4 text-base font-semibold text-white bg-gradient-rose rounded-full shadow-rose hover:shadow-rose-lg hover:-translate-y-0.5 transition-all">
                  Start My Money Plan — It's Free
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
