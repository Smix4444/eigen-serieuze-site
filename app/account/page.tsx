import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProfileCard from '@/components/account/ProfileCard'
import OrderHistory from '@/components/account/OrderHistory'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const [{ data: profile }, { data: orders }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
  ])

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-black uppercase tracking-tight mb-8">Your Account</h1>
      <ProfileCard email={user.email!} username={profile?.username ?? null} />
      <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--color-brand-muted)] mt-12 mb-6">
        Order History
      </h2>
      <OrderHistory orders={orders ?? []} />
    </div>
  )
}
