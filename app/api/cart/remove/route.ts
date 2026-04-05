import { NextRequest, NextResponse } from 'next/server'
import { withSecurity } from '@/lib/security/with-security'
import { createServiceClient } from '@/lib/supabase/server'
import { removeCartSchema } from '@/lib/schemas/cart'

export const POST = withSecurity(
  async (_req: NextRequest, { userId, body }) => {
    const { cart_item_id } = body as { cart_item_id: string }
    const supabase = createServiceClient()

    const { data: item } = await supabase
      .from('cart_items')
      .select('user_id')
      .eq('id', cart_item_id)
      .maybeSingle()

    if (!item || item.user_id !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await supabase.from('cart_items').delete().eq('id', cart_item_id)
    return NextResponse.json({ ok: true })
  },
  { rateLimit: 'cart', requireAuth: true, schema: removeCartSchema }
)
