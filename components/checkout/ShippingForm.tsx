'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/cart/store'

export default function ShippingForm() {
  const clearCart = useCartStore((s) => s.clearCart)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fields, setFields] = useState({
    full_name: '',
    email: '',
    line1: '',
    line2: '',
    city: '',
    postcode: '',
    country: 'GB',
  })

  const set = (k: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/checkout/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Order failed')
        return
      }
      clearCart()
      router.push(`/account?order=${data.order_id}`)
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] px-4 py-3 text-sm text-white focus:border-white outline-none transition-colors'

  const fieldDefs: Array<{ label: string; key: keyof typeof fields; type?: string; required?: boolean }> = [
    { label: 'Full Name', key: 'full_name' },
    { label: 'Email', key: 'email', type: 'email' },
    { label: 'Address Line 1', key: 'line1' },
    { label: 'Address Line 2 (optional)', key: 'line2', required: false },
    { label: 'City', key: 'city' },
    { label: 'Postcode', key: 'postcode' },
    { label: 'Country (e.g. GB)', key: 'country' },
  ]

  return (
    <form onSubmit={submit} className="space-y-4">
      {fieldDefs.map(({ label, key, type = 'text', required = true }) => (
        <div key={key}>
          <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-brand-muted)] mb-2">
            {label}
          </label>
          <input
            type={type}
            value={fields[key]}
            onChange={set(key)}
            required={required}
            className={inputClass}
          />
        </div>
      ))}
      {error && <p className="text-[var(--color-brand-accent)] text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full disabled:opacity-50 mt-4"
      >
        {loading ? 'PLACING ORDER...' : 'PLACE ORDER'}
      </button>
      <p className="text-xs text-[var(--color-brand-muted)] text-center">
        This is a demo store — no real payment is taken.
      </p>
    </form>
  )
}
