'use client'
import { useState } from 'react'
import { useCartStore } from '@/lib/cart/store'
import type { Product } from '@/lib/supabase/types'

interface Props { product: Product; selectedSize: string | null }

export default function AddToCartButton({ product, selectedSize }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const addItem = useCartStore((s) => s.addItem)

  const handleAdd = async () => {
    if (!selectedSize) {
      setError('Please select a size')
      return
    }
    setError(null)
    setLoading(true)

    // Optimistic update
    addItem({
      id: crypto.randomUUID(),
      user_id: '',
      product_id: product.id,
      size: selectedSize,
      quantity: 1,
      product,
    })

    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id, size: selectedSize, quantity: 1 }),
      })
      if (!res.ok) throw new Error('Failed')
    } catch {
      setError('Could not add to cart. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleAdd}
        disabled={loading || product.stock === 0}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {product.stock === 0
          ? 'SOLD OUT'
          : loading
          ? 'ADDING...'
          : 'ADD TO CART'}
      </button>
      {error && <p className="text-[var(--color-brand-accent)] text-sm mt-2">{error}</p>}
    </div>
  )
}
