const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://ufxdncjiuzeqlblhqzdg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmeGRuY2ppdXplcWxibGhxemRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjA3MjM0MCwiZXhwIjoyMDk3NjQ4MzQwfQ.tJ9CkB8wVli2cUgNq7lGciwddBLVuqdO7u3d2Qonhas',
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function run() {
  // List all users to find existing one
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
  if (listError) { console.error('List error:', listError.message); return }

  console.log('Found', users.length, 'user(s)')

  // Delete any existing user with this email
  for (const user of users) {
    console.log('Deleting user:', user.email)
    const { error } = await supabase.auth.admin.deleteUser(user.id)
    if (error) console.error('Delete error:', error.message)
    else console.log('Deleted:', user.email)
  }

  // Create fresh user
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'eminabambur12@gmail.com',
    password: 'Zoryva2024!',
    email_confirm: true,
    user_metadata: { full_name: 'Mina' }
  })

  if (error) {
    console.error('❌ Create error:', error.message)
  } else {
    console.log('✅ Done! Sign in at localhost:3000/auth/signin')
    console.log('   Email: eminabambur12@gmail.com')
    console.log('   Password: Zoryva2024!')
  }
}

run()
