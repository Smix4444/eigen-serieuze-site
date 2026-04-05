import Link from 'next/link'
import type { Product } from '@/lib/supabase/types'
import ProductImage from './ProductImage'

interface Props { product: Product }

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-black tracking-widest uppercase bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] text-[var(--color-brand-muted)]">
        SOLD OUT
      </span>
    )
  }
  if (stock <= 5) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-black tracking-widest uppercase bg-[var(--color-brand-accent)] text-white">
        {stock} LEFT
      </span>
    )
  }
  return null
}

export default function ProductCard({ product }: Props) {
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[var(--color-brand-surface)] mb-3">
        {product.images[0] && (
          <ProductImage
            src={product.images[0]}
            alt={product.name}
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        )}

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-400" />

        {/* Quick view button — appears on hover */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-white text-black text-[10px] font-black tracking-[0.2em] uppercase px-5 py-2.5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            VIEW PRODUCT
          </span>
        </div>

        {/* Stock badge */}
        <div className="absolute top-2.5 left-2.5">
          <StockBadge stock={product.stock} />
        </div>

        {/* Featured badge */}
        {product.is_featured && (
          <div className="absolute top-2.5 right-2.5">
            <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-black tracking-widest uppercase bg-white text-black">
              FEATURED
            </span>
          </div>
        )}

        {/* Red bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-brand-accent)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </div>

      {/* Product info */}
      <div className="space-y-0.5">
        <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-[var(--color-brand-muted)] truncate">
          {product.category}
        </p>
        <div className="flex items-start justify-between gap-2">
          <p className="font-bold uppercase tracking-wide text-[13px] text-[var(--color-brand-text)] group-hover:text-white transition-colors leading-tight line-clamp-1 flex-1">
            {product.name}
          </p>
          <p className="text-white font-black text-[13px] whitespace-nowrap">
            ${product.price.toFixed(0)}
          </p>
        </div>
        <p className="text-[9px] text-[var(--color-brand-muted)] tracking-widest">
          {product.sizes.slice(0, 4).join(' · ')}{product.sizes.length > 4 ? ' +' : ''}
        </p>
      </div>
    </Link>
  )
}
