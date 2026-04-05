import { NextRequest, NextResponse } from 'next/server'
import { withSecurity } from '@/lib/security/with-security'
import { createServiceClient } from '@/lib/supabase/server'
import { addToCartSchema } from '@/lib/schemas/cart'

export const POST = withSecurity(
  async (_req: NextRequest, { userId, body }) => {
    const { product_id, size, quantity } = body as { product_id: string; size: string; quantity: number }
    const supabase = createServiceClient()

    const { data: existing } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', userId)
      .eq('product_id', product_id)
      .eq('size', size)
      .maybeSingle()

    if (existing) {
      await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
    } else {
      await supabase
        .from('cart_items')
        .insert({ user_id: userId, product_id, size, quantity })
    }

    return NextResponse.json({ ok: true })
  },
  { rateLimit: 'cart', requireAuth: true, schema: addToCartSchema }
)
