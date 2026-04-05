'use client'
import { useCartStore } from '@/lib/cart/store'
import CartItem from './CartItem'

export default function CartItemList() {
  const items = useCartStore((s) => s.items)

  if (!items.length) {
    return (
      <div className="py-20 text-center">
        <p className="text-2xl font-black uppercase tracking-widest text-[var(--color-brand-muted)]">
          Your cart is empty
        </p>
      </div>
    )
  }

  return (
    <div>
      {items.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
    </div>
  )
}
