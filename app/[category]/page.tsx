import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Category } from '@/lib/supabase/types'
import FilterBar from '@/components/products/FilterBar'
import ProductGrid from '@/components/products/ProductGrid'

const VALID_CATEGORIES: Category[] = ['tshirts', 'hoodies', 'pants', 'shoes']

const CATEGORY_LABELS: Record<Category, string> = {
  tshirts: 'T-Shirts',
  hoodies: 'Hoodies & Zip-Ups',
  pants: 'Pants',
  shoes: 'Shoes',
}

interface Props {
  params: Promise<{ category: string }>
  searchParams: Promise<{ size?: string }>
}

export async function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({ category }))
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params
  const { size } = await searchParams

  if (!VALID_CATEGORIES.includes(category as Category)) notFound()

  const supabase = await createClient()
  let query = supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })

  if (size) {
    query = query.contains('sizes', [size])
  }

  const { data: products } = await query

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-black uppercase tracking-tight mb-2">
        {CATEGORY_LABELS[category as Category]}
      </h1>
      <p className="text-[var(--color-brand-muted)] text-sm mb-6">
        {products?.length ?? 0} products
      </p>
      <FilterBar />
      <ProductGrid products={products ?? []} />
    </div>
  )
}
