'use client'
import { useState } from 'react'
import EmailPasswordForm from './EmailPasswordForm'

export default function AuthTabs() {
  const [mode, setMode] = useState<'login' | 'register'>('login')

  return (
    <div>
      <div className="flex border-b border-[var(--color-brand-border)] mb-8">
        {(['login', 'register'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
              mode === m
                ? 'border-b-2 border-white text-white -mb-px'
                : 'text-[var(--color-brand-muted)]'
            }`}
          >
            {m === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        ))}
      </div>
      <EmailPasswordForm mode={mode} />
    </div>
  )
}
