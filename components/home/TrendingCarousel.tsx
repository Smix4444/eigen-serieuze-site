import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/products/ProductCard'

export default async function TrendingCarousel() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(8)

  if (!products?.length) return null

  return (
    <section className="py-16">
      <div className="px-6 max-w-7xl mx-auto mb-6">
        <h2 className="text-3xl font-black uppercase tracking-tight">New Arrivals</h2>
      </div>
      <div className="px-6 overflow-x-auto">
        <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
          {products.map((p) => (
            <div key={p.id} className="w-64 flex-shrink-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
