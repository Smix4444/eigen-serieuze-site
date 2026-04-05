import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/products/ProductCard'
import MarqueeStrip from '@/components/ui/MarqueeStrip'
import ScrollCarousel from '@/components/ui/ScrollCarousel'

export default async function TrendingCarousel() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  if (!products?.length) return null

  return (
    <section className="py-20">
      {/* Dark strip section */}
      <div className="bg-[var(--color-brand-surface)] py-20">
        <div className="px-6 md:px-8 max-w-7xl mx-auto mb-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[var(--color-brand-accent)] mb-2">
                — New Arrivals
              </p>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none">
                Fresh Drops
              </h2>
            </div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-brand-muted)] pb-1">
              SCROLL →
            </p>
          </div>
        </div>

        <ScrollCarousel>
          {products.map((p) => (
            <div key={p.id} className="w-56 md:w-64 flex-shrink-0">
              <ProductCard product={p} />
            </div>
          ))}
        </ScrollCarousel>
      </div>

      {/* Bottom ticker */}
      <MarqueeStrip variant="dark" />
    </section>
  )
}
