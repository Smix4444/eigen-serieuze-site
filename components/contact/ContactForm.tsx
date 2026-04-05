'use client'
import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ContactForm() {
  const [fields, setFields] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')

  const set = (k: keyof typeof fields) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFields((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="py-12 text-center">
        <p className="text-2xl font-black uppercase tracking-widest">Message Sent.</p>
        <p className="text-[var(--color-brand-muted)] text-sm mt-2">
          We'll get back to you within 48 hours.
        </p>
      </div>
    )
  }

  const inputClass =
    'w-full bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] px-4 py-3 text-sm text-white focus:border-white outline-none transition-colors'

  return (
    <form onSubmit={submit} className="space-y-4">
      {(['name', 'email'] as const).map((k) => (
        <div key={k}>
          <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-brand-muted)] mb-2">
            {k.charAt(0).toUpperCase() + k.slice(1)}
          </label>
          <input
            type={k === 'email' ? 'email' : 'text'}
            value={fields[k]}
            onChange={set(k)}
            required
            className={inputClass}
          />
        </div>
      ))}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-brand-muted)] mb-2">
          Message
        </label>
        <textarea
          value={fields.message}
          onChange={set('message')}
          required
          rows={5}
          minLength={10}
          className={`${inputClass} resize-none`}
        />
      </div>
      {status === 'error' && (
        <p className="text-[var(--color-brand-accent)] text-sm">
          Something went wrong. Please try again.
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary disabled:opacity-50"
      >
        {status === 'loading' ? 'SENDING...' : 'SEND MESSAGE'}
      </button>
    </form>
  )
}
