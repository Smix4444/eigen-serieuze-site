import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProductImageGallery from '@/components/products/ProductImageGallery'
import LiveInventory from '@/components/products/LiveInventory'
import RelatedProducts from '@/components/products/RelatedProducts'
import SizeAndCart from './SizeAndCart'
import type { Category } from '@/lib/supabase/types'

interface Props {
  params: Promise<{ slug: string }>
}

function StockStatus({ stock }: { stock: number }) {
  if (stock === 0) return (
    <span className="inline-flex items-center px-3 py-1 text-[9px] font-black tracking-widest uppercase bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] text-[var(--color-brand-muted)]">
      SOLD OUT
    </span>
  )
  if (stock <= 5) return (
    <span className="inline-flex items-center px-3 py-1 text-[9px] font-black tracking-widest uppercase bg-[var(--color-brand-accent)] text-white">
      ONLY {stock} LEFT
    </span>
  )
  return (
    <span className="inline-flex items-center px-3 py-1 text-[9px] font-black tracking-widest uppercase bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)] text-[#22c55e]">
      ● IN STOCK
    </span>
  )
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
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-[var(--color-brand-muted)] mb-10">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>·</span>
        <Link href={`/${product.category}`} className="hover:text-white transition-colors">{product.category}</Link>
        <span>·</span>
        <span className="text-white">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        {/* Gallery */}
        <ProductImageGallery images={product.images} name={product.name} />

        {/* Product info */}
        <div className="flex flex-col gap-6">
          {/* Status badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <StockStatus stock={product.stock} />
            {product.is_featured && (
              <span className="inline-flex items-center px-3 py-1 text-[9px] font-black tracking-widest uppercase bg-white text-black">
                FEATURED
              </span>
            )}
            <span className="inline-flex items-center px-3 py-1 text-[9px] font-black tracking-widest uppercase border border-[var(--color-brand-border)] text-[var(--color-brand-muted)]">
              {product.category.toUpperCase()}
            </span>
          </div>

          {/* Name + price */}
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none mb-3">
              {product.name}
            </h1>
            <p className="text-3xl font-black text-white">
              ${product.price.toFixed(2)}
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="w-6 h-[2px] bg-[var(--color-brand-accent)]" />
            <div className="flex-1 h-[1px] bg-[var(--color-brand-border)]" />
          </div>

          {/* Description */}
          <p className="text-[var(--color-brand-muted)] text-sm leading-relaxed">
            {product.description}
          </p>

          {/* Live inventory */}
          <LiveInventory productId={product.id} initialStock={product.stock} />

          {/* Size + cart */}
          <SizeAndCart product={product} />

          {/* Info pills */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {['Free shipping $150+', 'Mock checkout', 'SS26 Collection', 'No real payments'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-[var(--color-brand-muted)] border border-[var(--color-brand-border)] px-3 py-2">
                <span className="text-[var(--color-brand-accent)]">◆</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      <div className="mt-24">
        <div className="flex items-center gap-3 mb-10">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[var(--color-brand-accent)]">— Related</p>
          <h2 className="text-2xl font-black uppercase tracking-tight">More {product.category}</h2>
        </div>
        <RelatedProducts category={product.category as Category} excludeId={product.id} />
      </div>
    </div>
  )
}
