'use client'
import { useState } from 'react'

interface Props {
  sizes: string[]
  onSelect: (size: string) => void
}

export default function SizeSelector({ sizes, onSelect }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  const select = (s: string) => {
    setSelected(s)
    onSelect(s)
  }

  return (
    <div>
      <p className="text-xs font-bold tracking-widest uppercase text-[var(--color-brand-muted)] mb-3">
        Size
        {selected && <span className="text-white ml-2">— {selected}</span>}
      </p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => (
          <button
            key={s}
            onClick={() => select(s)}
            className={`px-4 py-2 text-sm font-bold tracking-widest border transition-colors ${
              selected === s
                ? 'bg-white text-black border-white'
                : 'border-[var(--color-brand-border)] text-[var(--color-brand-text)] hover:border-white'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
