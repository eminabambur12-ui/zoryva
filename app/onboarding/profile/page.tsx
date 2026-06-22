'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const INCOME_TYPES = [
  { id: 'employed', label: 'Employed full-time', desc: 'Salary or hourly from an employer', icon: '💼' },
  { id: 'freelancer', label: 'Freelancer / consultant', desc: 'Project-based client income', icon: '🖥️' },
  { id: 'creator', label: 'Creator / influencer', desc: 'Brand deals, AdSense, courses', icon: '🎨' },
  { id: 'business_owner', label: 'Business owner', desc: 'Running a company or LLC', icon: '📦' },
  { id: 'ecommerce', label: 'E-commerce seller', desc: 'Shopify, Amazon, Etsy, DTC', icon: '🛍️' },
  { id: 'side_hustler', label: 'Side hustler', desc: 'Main job + extra income streams', icon: '🚀' },
  { id: 'investor', label: 'Investor', desc: 'Stocks, real estate, crypto', icon: '📈' },
  { id: 'student', label: 'Student', desc: 'Part-time work or stipends', icon: '🎓' },
]

export default function OnboardingProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleContinue() {
    if (!selected) return
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update({ income_type: selected }).eq('id', user.id)
    }
    router.push('/onboarding/goals')
  }

  return (
    <div>
      <div className="text-center mb-10">
        <div className="text-xs font-bold uppercase tracking-widest text-rose-deep mb-3">Step 2 of 3</div>
        <h1 className="font-serif text-4xl font-semibold text-charcoal mb-3">
          Tell us about yourself
        </h1>
        <p className="text-muted text-base max-w-md mx-auto leading-relaxed">
          Zara tailors her advice to your income type. Select the one that fits best — you can refine it later.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {INCOME_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelected(type.id)}
            className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
              selected === type.id
                ? 'bg-gradient-dark text-white border-transparent shadow-lg'
                : 'bg-white border-rose/10 hover:border-rose/30 hover:shadow-card'
            }`}
          >
            <div className="text-2xl flex-shrink-0">{type.icon}</div>
            <div>
              <div className={`text-sm font-semibold ${selected === type.id ? 'text-white' : 'text-charcoal'}`}>
                {type.label}
              </div>
              <div className={`text-xs mt-0.5 ${selected === type.id ? 'text-white/50' : 'text-muted'}`}>
                {type.desc}
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={!selected || loading}
        className="w-full py-3.5 bg-gradient-rose text-white rounded-full text-sm font-semibold shadow-rose transition-all hover:shadow-rose-lg hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {loading ? 'Saving...' : 'Continue →'}
      </button>
    </div>
  )
}
