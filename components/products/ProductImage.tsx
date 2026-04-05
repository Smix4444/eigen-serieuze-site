'use client'
import Image from 'next/image'
import { useState } from 'react'

interface Props {
  src: string
  alt: string
  className?: string
}

export default function ProductImage({ src, alt, className }: Props) {
  const [errored, setErrored] = useState(false)

  if (errored) {
    return (
      <div className="absolute inset-0 bg-[var(--color-brand-surface-2)] flex flex-col items-center justify-center gap-2">
        <span className="text-[var(--color-brand-border)] text-3xl">◆</span>
        <span className="text-[9px] font-bold tracking-widest uppercase text-[var(--color-brand-muted)]">
          VAULT
        </span>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      onError={() => setErrored(true)}
    />
  )
}
