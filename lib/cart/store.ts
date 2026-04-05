import { create } from 'zustand'
import type { CartItem, Product } from '@/lib/supabase/types'

export interface CartItemWithProduct extends CartItem {
  product: Product
}

interface CartStore {
  items: CartItemWithProduct[]
  isOpen: boolean
  setItems: (items: CartItemWithProduct[]) => void
  addItem: (item: CartItemWithProduct) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  removeItem: (cartItemId: string) => void
  clearCart: () => void
  toggleCart: () => void
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,

  setItems: (items) => set({ items }),

  addItem: (item) =>
    set((state) => {
      const exists = state.items.find(
        (i) => i.product_id === item.product_id && i.size === item.size
      )
      if (exists) {
        return {
          items: state.items.map((i) =>
            i.id === exists.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        }
      }
      return { items: [...state.items, item] }
    }),

  updateQuantity: (cartItemId, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === cartItemId ? { ...i, quantity } : i
      ),
    })),

  removeItem: (cartItemId) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== cartItemId),
    })),

  clearCart: () => set({ items: [] }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  total: () =>
    get().items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ),

  itemCount: () =>
    get().items.reduce((sum, item) => sum + item.quantity, 0),
}))
