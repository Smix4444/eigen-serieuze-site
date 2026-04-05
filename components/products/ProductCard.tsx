import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/supabase/types'
import StockPill from './StockPill'

interface Props { product: Product }

export default function ProductCard({ product }: Props) {
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-[var(--color-brand-surface)] mb-3">
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div className="absolute top-3 left-3">
          <StockPill stock={product.stock} />
        </div>
      </div>
      <div>
        <p className="text-xs text-[var(--color-brand-muted)] uppercase tracking-widest mb-1">
          {product.category}
        </p>
        <p className="font-bold uppercase tracking-wide text-sm text-[var(--color-brand-text)] group-hover:text-white transition-colors">
          {product.name}
        </p>
        <p className="text-[var(--color-brand-text)] font-bold mt-1">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  )
}
