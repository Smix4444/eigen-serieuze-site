import { NextRequest, NextResponse } from 'next/server'
import { withSecurity } from '@/lib/security/with-security'
import { createServiceClient } from '@/lib/supabase/server'
import { checkoutSchema } from '@/lib/schemas/checkout'
import { checkFraud } from '@/lib/security/fraud'

export const POST = withSecurity(
  async (_req: NextRequest, { userId, body }) => {
    const address = body as {
      full_name: string; email: string; line1: string; line2?: string;
      city: string; postcode: string; country: string
    }
    const supabase = createServiceClient()

    // Fetch cart with products
    const { data: cartItems } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', userId)

    if (!cartItems?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const totalAmount = cartItems.reduce(
      (sum: number, item: any) => sum + item.product.price * item.quantity,
      0
    )

    // Fraud check
    const fraudItems = cartItems.map((item: any) => ({
      quantity: item.quantity,
      product: { name: item.product.name, price: item.product.price },
    }))
    const fraud = checkFraud(fraudItems, totalAmount)
    if (fraud.flagged) {
      return NextResponse.json({ error: fraud.reason }, { status: 422 })
    }

    // Create order
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        shipping_address: address,
        status: 'confirmed',
      })
      .select()
      .single()

    if (error || !order) {
      return NextResponse.json({ error: 'Order failed' }, { status: 500 })
    }

    // Insert order items
    await supabase.from('order_items').insert(
      cartItems.map((item: any) => ({
        order_id: order.id,
        product_id: item.product_id,
        size: item.size,
        quantity: item.quantity,
        unit_price: item.product.price,
      }))
    )

    // Decrement stock
    for (const item of cartItems as any[]) {
      await supabase.rpc('decrement_stock', {
        p_product_id: item.product_id,
        p_quantity: item.quantity,
      } as any)
    }

    // Clear cart
    await supabase.from('cart_items').delete().eq('user_id', userId)

    return NextResponse.json({ order_id: order.id })
  },
  { rateLimit: 'checkout', requireAuth: true, schema: checkoutSchema }
)
