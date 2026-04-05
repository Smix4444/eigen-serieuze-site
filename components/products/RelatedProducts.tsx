import { createClient } from '@/lib/supabase/server'
import type { Category } from '@/lib/supabase/types'
import ProductCard from './ProductCard'

interface Props { category: Category; excludeId: string }

export default async function RelatedProducts({ category, excludeId }: Props) {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .neq('id', excludeId)
    .limit(4)

  if (!products?.length) return null

  return (
    <section className="mt-20">
      <h2 className="text-2xl font-black uppercase tracking-tight mb-6">You Might Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  )
}
