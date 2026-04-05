'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const sizes = ['S', 'M', 'L', 'XL', 'XXL']

function FilterBarInner() {
  const router = useRouter()
  const params = useSearchParams()
  const activeSize = params.get('size')

  const setSize = (size: string | null) => {
    const p = new URLSearchParams(params.toString())
    if (size) p.set('size', size)
    else p.delete('size')
    router.push(`?${p.toString()}`)
  }

  return (
    <div className="flex items-center gap-3 py-4 border-b border-[var(--color-brand-border)]">
      <span className="text-xs font-bold tracking-widest uppercase text-[var(--color-brand-muted)]">Size:</span>
      {sizes.map((s) => (
        <button
          key={s}
          onClick={() => setSize(activeSize === s ? null : s)}
          className={`px-3 py-1 text-xs font-bold tracking-widest border transition-colors ${
            activeSize === s
              ? 'bg-white text-black border-white'
              : 'border-[var(--color-brand-border)] text-[var(--color-brand-muted)] hover:border-white hover:text-white'
          }`}
        >
          {s}
        </button>
      ))}
      {activeSize && (
        <button
          onClick={() => setSize(null)}
          className="text-xs text-[var(--color-brand-muted)] hover:text-white ml-2"
        >
          Clear
        </button>
      )}
    </div>
  )
}

export default function FilterBar() {
  return (
    <Suspense fallback={<div className="h-14 border-b border-[var(--color-brand-border)]" />}>
      <FilterBarInner />
    </Suspense>
  )
}
