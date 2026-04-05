'use client'
import { useState } from 'react'
import SizeSelector from '@/components/products/SizeSelector'
import AddToCartButton from '@/components/products/AddToCartButton'
import type { Product } from '@/lib/supabase/types'

interface Props { product: Product }

export default function SizeAndCart({ product }: Props) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  return (
    <div className="flex flex-col gap-4">
      <SizeSelector sizes={product.sizes} onSelect={setSelectedSize} />
      <AddToCartButton product={product} selectedSize={selectedSize} />
    </div>
  )
}
