export type Category = 'tshirts' | 'hoodies' | 'pants' | 'shoes'

export interface Product {
  id: string
  slug: string
  name: string
  description: string | null
  price: number
  category: Category
  images: string[]
  sizes: string[]
  stock: number
  is_featured: boolean
  created_at: string
}

export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  updated_at: string | null
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  size: string
  quantity: number
  product?: Product
}

export interface Order {
  id: string
  user_id: string
  status: 'confirmed' | 'shipped' | 'delivered'
  total_amount: number
  shipping_address: ShippingAddress
  created_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  size: string
  quantity: number
  unit_price: number
  product?: Product
}

export interface ShippingAddress {
  full_name: string
  line1: string
  line2?: string
  city: string
  postcode: string
  country: string
  email: string
}
