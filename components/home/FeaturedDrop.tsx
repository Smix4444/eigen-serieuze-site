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
    <section className="px-6 py-16 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="badge-red mb-2 inline-block">FEATURED DROP</span>
          <h2 className="text-3xl font-black uppercase tracking-tight">The Current Edit</h2>
        </div>
        <Link
          href="/hoodies"
          className="text-xs font-bold tracking-widest uppercase text-[var(--color-brand-muted)] hover:text-white transition-colors"
        >
          View All →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
