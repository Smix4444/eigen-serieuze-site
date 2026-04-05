'use client'
import Image from 'next/image'
import { useCartStore } from '@/lib/cart/store'
import type { CartItemWithProduct } from '@/lib/cart/store'

interface Props { item: CartItemWithProduct }

export default function CartItem({ item }: Props) {
  const { updateQuantity, removeItem } = useCartStore()

  const handleQty = async (delta: number) => {
    const newQty = item.quantity + delta
    if (newQty < 1) {
      handleRemove()
      return
    }
    updateQuantity(item.id, newQty)
    await fetch('/api/cart/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart_item_id: item.id, quantity: newQty }),
    })
  }

  const handleRemove = async () => {
    removeItem(item.id)
    await fetch('/api/cart/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart_item_id: item.id }),
    })
  }

  return (
    <div className="flex gap-4 py-4 border-b border-[var(--color-brand-border)]">
      <div className="relative w-24 h-24 bg-[var(--color-brand-surface)] flex-shrink-0">
        {item.product.images[0] && (
          <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
        )}
      </div>
      <div className="flex-1">
        <p className="font-bold uppercase tracking-wide text-sm">{item.product.name}</p>
        <p className="text-[var(--color-brand-muted)] text-xs mt-0.5">Size: {item.size}</p>
        <p className="font-bold mt-1">${(item.product.price * item.quantity).toFixed(2)}</p>
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => handleQty(-1)}
            className="w-7 h-7 border border-[var(--color-brand-border)] text-sm hover:border-white transition-colors"
          >
            −
          </button>
          <span className="text-sm font-bold">{item.quantity}</span>
          <button
            onClick={() => handleQty(1)}
            className="w-7 h-7 border border-[var(--color-brand-border)] text-sm hover:border-white transition-colors"
          >
            +
          </button>
          <button
            onClick={handleRemove}
            className="text-xs text-[var(--color-brand-muted)] hover:text-[var(--color-brand-accent)] ml-2 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}
