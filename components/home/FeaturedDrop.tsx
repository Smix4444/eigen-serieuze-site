import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/products/ProductCard'

export default async function FeaturedDrop() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .limit(3)

  if (!products?.length) return null

  return (
    <section className="px-6 md:px-8 py-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-10 gap-4">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[var(--color-brand-accent)] mb-2">
            — Featured Drop
          </p>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none">
            The Current Edit
          </h2>
        </div>
        <Link
          href="/hoodies"
          className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-brand-muted)] hover:text-white transition-colors whitespace-nowrap pb-1 border-b border-transparent hover:border-[var(--color-brand-accent)]"
        >
          VIEW ALL →
        </Link>
      </div>

      {/* Accent divider */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-[2px] bg-[var(--color-brand-accent)]" />
        <div className="flex-1 h-[1px] bg-[var(--color-brand-border)]" />
        <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-[var(--color-brand-muted)]">
          HANDPICKED
        </span>
        <div className="flex-1 h-[1px] bg-[var(--color-brand-border)]" />
        <div className="w-8 h-[2px] bg-[var(--color-brand-accent)]" />
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
