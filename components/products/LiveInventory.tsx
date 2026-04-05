'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props { productId: string; initialStock: number }

export default function LiveInventory({ productId, initialStock }: Props) {
  const [stock, setStock] = useState(initialStock)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`product-stock-${productId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'products', filter: `id=eq.${productId}` },
        (payload) => {
          const updated = payload.new as { stock: number }
          setStock(updated.stock)
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [productId])

  if (stock === 0) return <p className="text-[var(--color-brand-accent)] text-sm font-bold">OUT OF STOCK</p>
  if (stock <= 5) return <p className="text-[var(--color-brand-accent)] text-sm font-bold">ONLY {stock} LEFT</p>
  return <p className="text-green-500 text-sm font-bold">IN STOCK</p>
}
