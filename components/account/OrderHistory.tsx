import type { Order } from '@/lib/supabase/types'

interface Props { orders: Order[] }

export default function OrderHistory({ orders }: Props) {
  if (!orders.length) {
    return <p className="text-[var(--color-brand-muted)] text-sm py-8">No orders yet.</p>
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="border border-[var(--color-brand-border)] p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-[var(--color-brand-muted)] font-mono">
                #{order.id.slice(0, 8).toUpperCase()}
              </p>
              <p className="font-bold mt-1">${order.total_amount.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-[var(--color-brand-surface)] border border-[var(--color-brand-border)]">
                {order.status.toUpperCase()}
              </span>
              <p className="text-xs text-[var(--color-brand-muted)] mt-1">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
