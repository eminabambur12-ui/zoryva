import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardNav from '@/components/DashboardNav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Temporarily allow access without auth for testing
  // if (!user) redirect('/auth/signin')

  return (
    <div className="min-h-screen bg-cream">
      <DashboardNav userEmail={user?.email} />
      <main className="lg:pl-60 pb-24 lg:pb-0 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  )
}
