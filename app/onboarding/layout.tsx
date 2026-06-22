import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const STEPS = [
  { num: 1, label: 'Connect accounts' },
  { num: 2, label: 'Your profile' },
  { num: 3, label: 'Your goals' },
]

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin')

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_complete')
    .eq('id', user.id)
    .single()

  if (profile?.onboarding_complete) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-rose/10 bg-white">
        <div className="font-serif text-xl text-charcoal font-semibold tracking-tight">
          Zoryva
          <span className="text-rose-deep">.</span>
        </div>
        <div className="flex items-center gap-2">
          {STEPS.map((step, i) => (
            <div key={step.num} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full border border-rose/30 flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-muted">{step.num}</span>
                </div>
                <span className="text-xs text-muted hidden sm:inline">{step.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="w-6 h-px bg-rose/20 mx-1" />
              )}
            </div>
          ))}
        </div>
        <div className="text-xs text-faint">Already have data? <span className="text-rose-deep cursor-pointer">Skip →</span></div>
      </div>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {children}
        </div>
      </div>
    </div>
  )
}
