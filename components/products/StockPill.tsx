interface Props { stock: number }

export default function StockPill({ stock }: Props) {
  if (stock > 10) return null
  if (stock === 0) return (
    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-[var(--color-brand-surface)] text-[var(--color-brand-muted)]">
      SOLD OUT
    </span>
  )
  return (
    <span className="badge-red">{stock} LEFT</span>
  )
}
