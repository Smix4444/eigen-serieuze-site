import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProductImageGallery from '@/components/products/ProductImageGallery'
import LiveInventory from '@/components/products/LiveInventory'
import RelatedProducts from '@/components/products/RelatedProducts'
import StockPill from '@/components/products/StockPill'
import SizeAndCart from './SizeAndCart'
import type { Category } from '@/lib/supabase/types'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!product) notFound()

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <ProductImageGallery images={product.images} name={product.name} />
        <div className="flex flex-col gap-6">
          <div>
            <StockPill stock={product.stock} />
            <h1 className="text-3xl font-black uppercase tracking-tight mt-2">{product.name}</h1>
            <p className="text-2xl font-bold mt-2">${product.price.toFixed(2)}</p>
          </div>
          <LiveInventory productId={product.id} initialStock={product.stock} />
          <p className="text-[var(--color-brand-muted)] text-sm leading-relaxed">{product.description}</p>
          <SizeAndCart product={product} />
        </div>
      </div>
      <RelatedProducts category={product.category as Category} excludeId={product.id} />
    </div>
  )
}
