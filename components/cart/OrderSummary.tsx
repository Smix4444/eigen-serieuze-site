'use client'
import Link from 'next/link'
import { useCartStore } from '@/lib/cart/store'

export default function OrderSummary() {
  const { total, items } = useCartStore()
  const subtotal = total()
  const shipping = subtotal > 0 ? 5.99 : 0
  const orderTotal = subtotal + shipping

  return (
    <div className="bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] p-6">
      <h2 className="text-sm font-bold uppercase tracking-widest mb-6">Order Summary</h2>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-[var(--color-brand-muted)]">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--color-brand-muted)]">Shipping</span>
          <span>{shipping > 0 ? `$${shipping.toFixed(2)}` : '—'}</span>
        </div>
        <div className="flex justify-between font-bold text-base border-t border-[var(--color-brand-border)] pt-3 mt-3">
          <span>Total</span>
          <span>${orderTotal.toFixed(2)}</span>
        </div>
      </div>
      {items.length > 0 && (
        <Link href="/checkout" className="btn-primary w-full text-center mt-6 block">
          CHECKOUT
        </Link>
      )}
    </div>
  )
}
