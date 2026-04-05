const items = [
  'NEW ARRIVALS',
  'HOODIES',
  'TSHIRTS',
  'CARGO PANTS',
  'STREETWEAR',
  'LIMITED DROPS',
  'VAULT SS26',
  'FREE SHIPPING OVER $150',
]

export default function MarqueeStrip({ variant = 'red' }: { variant?: 'red' | 'dark' }) {
  const bg = variant === 'red' ? 'bg-[var(--color-brand-accent)]' : 'bg-[var(--color-brand-surface)]'
  const text = variant === 'red' ? 'text-white' : 'text-[var(--color-brand-muted-2)]'
  const dot = variant === 'red' ? 'text-white/60' : 'text-[var(--color-brand-border)]'

  const allItems = [...items, ...items]

  return (
    <div className={`${bg} py-3 overflow-hidden border-y border-[var(--color-brand-accent)]/20`}>
      <div className="marquee-track">
        {allItems.map((item, i) => (
          <span key={i} className={`${text} text-[10px] font-black tracking-[0.25em] uppercase flex-shrink-0 flex items-center gap-4 px-4`}>
            {item}
            <span className={`${dot} text-[6px]`}>◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
