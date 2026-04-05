import CartItemList from '@/components/cart/CartItemList'
import OrderSummary from '@/components/cart/OrderSummary'

export default function CartPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-black uppercase tracking-tight mb-10">Your Cart</h1>
      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <CartItemList />
        </div>
        <div>
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}
