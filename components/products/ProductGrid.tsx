import type { Product } from '@/lib/supabase/types'
import ProductCard from './ProductCard'

interface Props { products: Product[] }

export default function ProductGrid({ products }: Props) {
  if (!products.length) {
    return (
      <div className="py-24 text-center text-[var(--color-brand-muted)]">
        <p className="text-lg font-bold uppercase tracking-widest">No products found</p>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-8">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}
