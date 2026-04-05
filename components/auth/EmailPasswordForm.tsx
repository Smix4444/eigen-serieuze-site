'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Props { mode: 'login' | 'register' }

export default function EmailPasswordForm({ mode }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } =
        mode === 'login'
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
        return
      }
      router.push(mode === 'login' ? '/account' : '/')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-brand-muted)] mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] px-4 py-3 text-sm text-white focus:border-white outline-none transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-brand-muted)] mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] px-4 py-3 text-sm text-white focus:border-white outline-none transition-colors"
        />
      </div>
      {error && <p className="text-[var(--color-brand-accent)] text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full disabled:opacity-50"
      >
        {loading ? 'LOADING...' : mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
      </button>
    </form>
  )
}
