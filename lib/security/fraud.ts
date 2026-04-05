import type { Product } from '@/lib/supabase/types'

export interface FraudCheckItem {
  quantity: number
  product: Pick<Product, 'name' | 'price'>
}

export interface FraudResult {
  flagged: boolean
  reason?: string
}

export function checkFraud(
  cartItems: FraudCheckItem[],
  totalAmount: number
): FraudResult {
  for (const item of cartItems) {
    if (item.quantity > 10) {
      return {
        flagged: true,
        reason: `Quantity ${item.quantity} exceeds limit of 10 for item ${item.product.name}`,
      }
    }
  }
  if (totalAmount > 2000) {
    return {
      flagged: true,
      reason: `Order total $${totalAmount} exceeds fraud threshold`,
    }
  }
  return { flagged: false }
}
