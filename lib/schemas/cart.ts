import { z } from 'zod'

export const addToCartSchema = z.object({
  product_id: z.string().uuid(),
  size: z.string().min(1).max(10),
  quantity: z.number().int().min(1).max(10),
})

export const updateCartSchema = z.object({
  cart_item_id: z.string().uuid(),
  quantity: z.number().int().min(1).max(10),
})

export const removeCartSchema = z.object({
  cart_item_id: z.string().uuid(),
})

export type AddToCartInput = z.infer<typeof addToCartSchema>
export type UpdateCartInput = z.infer<typeof updateCartSchema>
export type RemoveCartInput = z.infer<typeof removeCartSchema>
