'use client'
import { useState } from 'react'
import Image from 'next/image'

interface Props { images: string[]; name: string }

export default function ProductImageGallery({ images, name }: Props) {
  const [active, setActive] = useState(0)
  const src = images[active] ?? images[0]

  return (
    <div>
      <div className="relative aspect-square bg-[var(--color-brand-surface)] overflow-hidden mb-3">
        {src && (
          <Image src={src} alt={name} fill className="object-cover" />
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-20 h-20 overflow-hidden border-2 transition-colors ${
                i === active ? 'border-white' : 'border-[var(--color-brand-border)]'
              }`}
            >
              <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
