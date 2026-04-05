import { z } from 'zod'

export const checkoutSchema = z.object({
  full_name: z.string().min(2).max(100),
  email: z.string().email(),
  line1: z.string().min(5).max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(2).max(100),
  postcode: z.string().min(3).max(20),
  country: z.string().length(2),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>
