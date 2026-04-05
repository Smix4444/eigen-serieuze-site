import ShippingForm from '@/components/checkout/ShippingForm'
import OrderSummary from '@/components/cart/OrderSummary'

export default function CheckoutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-black uppercase tracking-tight mb-10">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-6 text-[var(--color-brand-muted)]">
            Shipping Details
          </h2>
          <ShippingForm />
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-6 text-[var(--color-brand-muted)]">
            Your Order
          </h2>
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}
