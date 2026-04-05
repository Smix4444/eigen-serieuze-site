import AuthTabs from '@/components/auth/AuthTabs'

export default function AuthPage() {
  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <h1 className="text-3xl font-black uppercase tracking-tight mb-10">YOUR ACCOUNT</h1>
      <AuthTabs />
    </div>
  )
}
