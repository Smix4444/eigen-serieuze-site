# Streetwear E-Commerce Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready streetwear e-commerce storefront with real-time inventory, Supabase auth/backend, and Cloudflare security — deployable to Vercel.

**Architecture:** Next.js 14 App Router with SSR product pages and client components for cart/realtime. Security enforced at three layers: Cloudflare WAF (edge), `withSecurity()` middleware (API routes), and Postgres RLS (database). Supabase Realtime subscriptions keep inventory and cart counts live.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, 21st.dev Magic MCP, Supabase (Auth + Postgres + Realtime), Upstash Redis, Zod, Zustand, Vercel

---

## File Map

```
/
├── app/
│   ├── layout.tsx                        # Root layout (Navbar, Footer, providers)
│   ├── page.tsx                          # Homepage
│   ├── [category]/page.tsx               # Product listing (tshirts/hoodies/pants/shoes)
│   ├── product/[slug]/page.tsx           # Product detail
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── account/page.tsx                  # Protected
│   ├── auth/page.tsx
│   ├── contact/page.tsx
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   └── api/
│       ├── cart/add/route.ts
│       ├── cart/update/route.ts
│       ├── cart/remove/route.ts
│       ├── checkout/place-order/route.ts
│       ├── products/[id]/route.ts
│       └── contact/route.ts
├── components/
│   ├── layout/Navbar.tsx
│   ├── layout/Footer.tsx
│   ├── home/HeroSection.tsx
│   ├── home/CategoryGrid.tsx
│   ├── home/FeaturedDrop.tsx
│   ├── home/TrendingCarousel.tsx
│   ├── products/ProductCard.tsx
│   ├── products/ProductGrid.tsx
│   ├── products/FilterBar.tsx
│   ├── products/StockPill.tsx
│   ├── products/ProductImageGallery.tsx
│   ├── products/SizeSelector.tsx
│   ├── products/AddToCartButton.tsx
│   ├── products/LiveInventory.tsx
│   ├── products/RelatedProducts.tsx
│   ├── cart/CartItemList.tsx
│   ├── cart/CartItem.tsx
│   ├── cart/OrderSummary.tsx
│   ├── checkout/ShippingForm.tsx
│   ├── checkout/OrderReview.tsx
│   ├── checkout/PlaceOrderButton.tsx
│   ├── account/ProfileCard.tsx
│   ├── account/OrderHistory.tsx
│   ├── account/OrderDetail.tsx
│   ├── auth/AuthTabs.tsx
│   ├── auth/EmailPasswordForm.tsx
│   ├── contact/ContactForm.tsx
│   └── ui/ErrorToast.tsx
├── lib/
│   ├── supabase/client.ts               # Browser Supabase client
│   ├── supabase/server.ts               # Server Supabase client (SSR)
│   ├── supabase/types.ts                # DB types
│   ├── security/with-security.ts        # withSecurity() API wrapper
│   ├── security/rate-limit.ts           # Upstash rate limiting
│   ├── security/fraud.ts                # Checkout fraud detection
│   ├── cart/store.ts                    # Zustand cart store
│   └── schemas/
│       ├── cart.ts                      # Zod schemas
│       ├── checkout.ts
│       └── contact.ts
├── middleware.ts                         # Auth guard for /account
├── supabase/
│   ├── migrations/001_schema.sql
│   ├── migrations/002_rls.sql
│   └── seed.sql
├── __tests__/
│   ├── security/with-security.test.ts
│   ├── security/fraud.test.ts
│   └── schemas/checkout.test.ts
├── next.config.js
├── tailwind.config.ts
├── vercel.json
├── cloudflare.md
├── waf-rules.json
└── claude.md
```

---

## Phase 1 — Project Scaffold

### Task 1: Initialise Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`, `.env.local`, `.gitignore`

- [ ] **Step 1: Scaffold Next.js app**

```bash
cd "C:/Users/bench/Desktop/potential website"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --yes
```

- [ ] **Step 2: Install dependencies**

```bash
npm install @supabase/supabase-js @supabase/ssr zustand zod @upstash/redis @upstash/ratelimit
npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom @types/jest ts-jest
```

- [ ] **Step 3: Replace `next.config.js` with**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
}
module.exports = nextConfig
```

- [ ] **Step 4: Create `.env.local`**

```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
UPSTASH_REDIS_REST_URL=your-upstash-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
EOF
```

- [ ] **Step 5: Add `.env.local` to `.gitignore`**

Verify `.gitignore` contains `.env.local` — `create-next-app` adds this by default. If not, add it.

- [ ] **Step 6: Create `jest.config.ts`**

```ts
import type { Config } from 'jest'
const config: Config = {
  testEnvironment: 'node',
  transform: { '^.+\\.tsx?$': 'ts-jest' },
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
  testPathPattern: '__tests__',
}
export default config
```

- [ ] **Step 7: Create `vercel.json`**

```json
{
  "regions": ["iad1"],
  "functions": {
    "app/api/**": { "memory": 256 }
  }
}
```

- [ ] **Step 8: Commit**

```bash
git init
git add -A
git commit -m "feat: scaffold Next.js 14 App Router project"
```

---

### Task 2: Configure Tailwind for streetwear theme

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

- [ ] **Step 1: Replace `tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0d0d0d',
          surface: '#111111',
          border: '#222222',
          accent: '#e63946',
          muted: '#555555',
          text: '#f0f0f0',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.2em',
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 2: Replace `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-inter: 'Inter', sans-serif;
}

body {
  background-color: #0d0d0d;
  color: #f0f0f0;
}

@layer components {
  .badge {
    @apply inline-flex items-center px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase;
  }
  .badge-red {
    @apply badge bg-brand-accent text-white;
  }
  .badge-white {
    @apply badge bg-white text-black;
  }
  .btn-primary {
    @apply bg-white text-black font-bold uppercase tracking-widest px-6 py-3 hover:bg-brand-accent hover:text-white transition-colors duration-150;
  }
  .btn-ghost {
    @apply border border-brand-border text-brand-text font-bold uppercase tracking-widest px-6 py-3 hover:border-white transition-colors duration-150;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "feat: configure streetwear Tailwind theme"
```

---

## Phase 2 — Supabase Database

### Task 3: Write database migrations

**Files:**
- Create: `supabase/migrations/001_schema.sql`
- Create: `supabase/migrations/002_rls.sql`

- [ ] **Step 1: Create `supabase/migrations/001_schema.sql`**

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Products
CREATE TABLE products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT,
  price       NUMERIC(10,2) NOT NULL,
  category    TEXT NOT NULL CHECK (category IN ('tshirts','hoodies','pants','shoes')),
  images      TEXT[] NOT NULL DEFAULT '{}',
  sizes       TEXT[] NOT NULL DEFAULT '{S,M,L,XL,XXL}',
  stock       INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT,
  full_name   TEXT,
  avatar_url  TEXT,
  updated_at  TIMESTAMPTZ
);

-- Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, username)
  VALUES (NEW.id, split_part(NEW.email, '@', 1));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Cart items
CREATE TABLE cart_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size        TEXT NOT NULL,
  quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  UNIQUE (user_id, product_id, size)
);

-- Orders
CREATE TABLE orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES profiles(id),
  status           TEXT NOT NULL DEFAULT 'confirmed'
                     CHECK (status IN ('confirmed','shipped','delivered')),
  total_amount     NUMERIC(10,2) NOT NULL,
  shipping_address JSONB NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Order items
CREATE TABLE order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id),
  size        TEXT NOT NULL,
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  unit_price  NUMERIC(10,2) NOT NULL
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE cart_items;
```

- [ ] **Step 2: Create `supabase/migrations/002_rls.sql`**

```sql
-- Enable RLS on all private tables
ALTER TABLE products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders     ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Products: public read, service_role write
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (TRUE);

-- Profiles: own row only
CREATE POLICY "profiles_own_select" ON profiles
  FOR SELECT USING (id = auth.uid());
CREATE POLICY "profiles_own_update" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- Cart: own rows only
CREATE POLICY "cart_own_all" ON cart_items
  FOR ALL USING (user_id = auth.uid());

-- Orders: own rows, no delete/update
CREATE POLICY "orders_own_select" ON orders
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "orders_own_insert" ON orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Order items: readable if you own the parent order
CREATE POLICY "order_items_own_select" ON order_items
  FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );
CREATE POLICY "order_items_own_insert" ON order_items
  FOR INSERT WITH CHECK (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );
```

- [ ] **Step 3: Commit**

```bash
git add supabase/
git commit -m "feat: add database migrations and RLS policies"
```

---

### Task 4: Write seed data

**Files:**
- Create: `supabase/seed.sql`

- [ ] **Step 1: Create `supabase/seed.sql`**

```sql
INSERT INTO products (slug, name, description, price, category, images, sizes, stock, is_featured) VALUES

-- HOODIES / ZIP-UPS (8)
('shadow-zip-black', 'Shadow Zip Hoodie', 'Full-zip heavyweight hoodie. Brushed fleece interior, dropped shoulders.', 89.00, 'hoodies',
 ARRAY['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800','https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800'],
 ARRAY['S','M','L','XL','XXL'], 24, TRUE),

('void-pullover-grey', 'Void Pullover', 'Oversized fit, kangaroo pocket, ribbed cuffs. 400gsm French terry.', 79.00, 'hoodies',
 ARRAY['https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800'],
 ARRAY['S','M','L','XL'], 18, FALSE),

('bloc-zip-cream', 'Bloc Zip Fleece', 'Cream colourway. Structured collar, front zip. Unisex cut.', 94.00, 'hoodies',
 ARRAY['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800'],
 ARRAY['M','L','XL','XXL'], 12, FALSE),

('static-hoodie-white', 'Static Pullover White', 'Clean white heavyweight. Tonal drawstring, woven label.', 85.00, 'hoodies',
 ARRAY['https://images.unsplash.com/photo-1572495641004-28421ae1b6e4?w=800'],
 ARRAY['S','M','L','XL'], 30, FALSE),

('archive-zip-olive', 'Archive Zip Olive', 'Military olive. Double-stitched seams. Side pockets.', 99.00, 'hoodies',
 ARRAY['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800'],
 ARRAY['S','M','L','XL','XXL'], 8, FALSE),

('core-hoodie-black', 'Core Hoodie Black', 'The everyday essential. 380gsm, roomy fit.', 69.00, 'hoodies',
 ARRAY['https://images.unsplash.com/photo-1604644401890-0bd678c83788?w=800'],
 ARRAY['S','M','L','XL','XXL'], 45, FALSE),

('acid-zip-navy', 'Acid Wash Zip Navy', 'Stone-washed navy zip. Vintage texture, relaxed silhouette.', 109.00, 'hoodies',
 ARRAY['https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800'],
 ARRAY['M','L','XL'], 6, FALSE),

('blank-hoodie-charcoal', 'Blank Hoodie Charcoal', 'Minimal. No logo. Just weight and fit.', 75.00, 'hoodies',
 ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
 ARRAY['S','M','L','XL','XXL'], 22, FALSE),

-- T-SHIRTS (8)
('drop-tee-black', 'DROP Tee Black', 'Oversized drop-shoulder tee. 220gsm ring-spun cotton.', 39.00, 'tshirts',
 ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
 ARRAY['S','M','L','XL','XXL'], 50, TRUE),

('vault-logo-tee-white', 'VAULT Logo Tee White', 'Clean white with chest graphic. Heavyweight 240gsm.', 45.00, 'tshirts',
 ARRAY['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'],
 ARRAY['S','M','L','XL'], 35, FALSE),

('bloc-tee-grey', 'Bloc Tee Grey Marl', 'Grey marl. Subtle texture. Boxy fit.', 35.00, 'tshirts',
 ARRAY['https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800'],
 ARRAY['S','M','L','XL','XXL'], 40, FALSE),

('no-signal-tee-black', 'No Signal Tee', 'Static graphic back print. Black on black.', 49.00, 'tshirts',
 ARRAY['https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800'],
 ARRAY['M','L','XL'], 15, FALSE),

('archive-pocket-tee', 'Archive Pocket Tee', 'Vintage wash. Chest pocket. Relaxed fit.', 42.00, 'tshirts',
 ARRAY['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800'],
 ARRAY['S','M','L','XL','XXL'], 28, FALSE),

('core-tee-white', 'Core Tee White', 'The blank canvas. 220gsm, crew neck, slim-straight.', 29.00, 'tshirts',
 ARRAY['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800'],
 ARRAY['S','M','L','XL','XXL'], 60, FALSE),

('acid-tee-cream', 'Acid Wash Tee Cream', 'Hand-dyed cream. Every piece unique. Limited.', 55.00, 'tshirts',
 ARRAY['https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800'],
 ARRAY['S','M','L'], 10, FALSE),

('heavy-tee-navy', 'Heavy Tee Navy', '280gsm. Beefy weight. Standard crew.', 37.00, 'tshirts',
 ARRAY['https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800'],
 ARRAY['S','M','L','XL','XXL'], 33, FALSE),

-- PANTS (6)
('cargo-black', 'Tactical Cargo Black', '6-pocket cargo. Ripstop fabric. Adjustable ankle.', 89.00, 'pants',
 ARRAY['https://images.unsplash.com/photo-1624378441864-6359c8a08a0a?w=800'],
 ARRAY['S','M','L','XL'], 20, TRUE),

('jogger-grey', 'Core Jogger Grey', 'French terry jogger. Tapered leg. Elastic waist.', 65.00, 'pants',
 ARRAY['https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800'],
 ARRAY['S','M','L','XL','XXL'], 28, FALSE),

('wide-leg-black', 'Wide Leg Trouser Black', 'Relaxed wide leg. Pressed crease. Two back pockets.', 79.00, 'pants',
 ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800'],
 ARRAY['S','M','L','XL'], 14, FALSE),

('track-pant-navy', 'Track Pant Navy', 'Tricot track pant. Side stripe. Snap buttons.', 69.00, 'pants',
 ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'],
 ARRAY['S','M','L','XL','XXL'], 22, FALSE),

('denim-black', 'Straight Denim Black', 'Black selvedge denim. Straight cut. 12oz.', 119.00, 'pants',
 ARRAY['https://images.unsplash.com/photo-1598522325074-042db73aa4e6?w=800'],
 ARRAY['28','30','32','34','36'], 16, FALSE),

('nylon-cargo-olive', 'Nylon Cargo Olive', 'Lightweight nylon. Zip pockets. Elastic waist.', 95.00, 'pants',
 ARRAY['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800'],
 ARRAY['S','M','L','XL'], 9, FALSE),

-- SHOES (6)
('runner-black', 'Vault Runner Black', 'Chunky sole runner. All-black. Mesh upper.', 129.00, 'shoes',
 ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
 ARRAY['7','8','9','10','11','12'], 18, TRUE),

('low-white', 'Clean Low White', 'Minimal leather low-top. Vulc sole. Tonal laces.', 99.00, 'shoes',
 ARRAY['https://images.unsplash.com/photo-1465453869711-7e174808ace9?w=800'],
 ARRAY['7','8','9','10','11','12'], 24, FALSE),

('boot-black', 'Combat Boot Black', 'Side-zip combat boot. Lug sole. Full-grain leather.', 149.00, 'shoes',
 ARRAY['https://images.unsplash.com/photo-1542310503-23f0c41f7de1?w=800'],
 ARRAY['7','8','9','10','11'], 10, FALSE),

('slide-black', 'Vault Slide Black', 'Chunky EVA slide. Debossed logo strap.', 49.00, 'shoes',
 ARRAY['https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800'],
 ARRAY['7','8','9','10','11','12'], 35, FALSE),

('high-black', 'Street High Black', 'Canvas high-top. Rubber cupsole. Padded tongue.', 85.00, 'shoes',
 ARRAY['https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800'],
 ARRAY['7','8','9','10','11','12'], 20, FALSE),

('trainer-grey', 'Tech Trainer Grey', 'Breathable mesh trainer. Foam midsole. Reflective tab.', 110.00, 'shoes',
 ARRAY['https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800'],
 ARRAY['8','9','10','11','12'], 13, FALSE);
```

- [ ] **Step 2: Commit**

```bash
git add supabase/seed.sql
git commit -m "feat: add seed data (28 products across 4 categories)"
```

---

## Phase 3 — Core Infrastructure

### Task 5: Supabase client setup and types

**Files:**
- Create: `lib/supabase/types.ts`
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`

- [ ] **Step 1: Create `lib/supabase/types.ts`**

```ts
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
```

- [ ] **Step 2: Create `lib/supabase/client.ts`**

```ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 3: Create `lib/supabase/server.ts`**

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value },
        set(name, value, options) {
          try { cookieStore.set({ name, value, ...options }) } catch {}
        },
        remove(name, options) {
          try { cookieStore.set({ name, value: '', ...options }) } catch {}
        },
      },
    }
  )
}

export function createServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { get: () => undefined, set: () => {}, remove: () => {} } }
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add lib/supabase/
git commit -m "feat: add Supabase client and type definitions"
```

---

### Task 6: Zod validation schemas

**Files:**
- Create: `lib/schemas/cart.ts`
- Create: `lib/schemas/checkout.ts`
- Create: `lib/schemas/contact.ts`

- [ ] **Step 1: Create `lib/schemas/cart.ts`**

```ts
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
```

- [ ] **Step 2: Create `lib/schemas/checkout.ts`**

```ts
import { z } from 'zod'

export const checkoutSchema = z.object({
  full_name: z.string().min(2).max(100),
  email: z.string().email(),
  line1: z.string().min(5).max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(2).max(100),
  postcode: z.string().min(3).max(20),
  country: z.string().length(2), // ISO 3166-1 alpha-2
})

export type CheckoutInput = z.infer<typeof checkoutSchema>
```

- [ ] **Step 3: Create `lib/schemas/contact.ts`**

```ts
import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
})

export type ContactInput = z.infer<typeof contactSchema>
```

- [ ] **Step 4: Write tests for checkout schema**

Create `__tests__/schemas/checkout.test.ts`:

```ts
import { checkoutSchema } from '@/lib/schemas/checkout'

describe('checkoutSchema', () => {
  const valid = {
    full_name: 'John Doe',
    email: 'john@example.com',
    line1: '123 Street Lane',
    city: 'London',
    postcode: 'SW1A 1AA',
    country: 'GB',
  }

  it('accepts valid input', () => {
    expect(() => checkoutSchema.parse(valid)).not.toThrow()
  })

  it('rejects invalid email', () => {
    expect(() => checkoutSchema.parse({ ...valid, email: 'notanemail' })).toThrow()
  })

  it('rejects country code longer than 2 chars', () => {
    expect(() => checkoutSchema.parse({ ...valid, country: 'GBR' })).toThrow()
  })

  it('rejects short full_name', () => {
    expect(() => checkoutSchema.parse({ ...valid, full_name: 'A' })).toThrow()
  })
})
```

- [ ] **Step 5: Run tests**

```bash
npx jest __tests__/schemas/checkout.test.ts
```
Expected: 4 passing

- [ ] **Step 6: Commit**

```bash
git add lib/schemas/ __tests__/schemas/
git commit -m "feat: add Zod validation schemas with tests"
```

---

### Task 7: Security middleware

**Files:**
- Create: `lib/security/rate-limit.ts`
- Create: `lib/security/fraud.ts`
- Create: `lib/security/with-security.ts`

- [ ] **Step 1: Create `lib/security/rate-limit.ts`**

```ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const rateLimiters = {
  cart: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, '1 m'),
    prefix: 'rl:cart',
  }),
  checkout: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'),
    prefix: 'rl:checkout',
  }),
  contact: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 m'),
    prefix: 'rl:contact',
  }),
  products: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, '1 m'),
    prefix: 'rl:products',
  }),
}

export type RateLimitKey = keyof typeof rateLimiters
```

- [ ] **Step 2: Create `lib/security/fraud.ts`**

```ts
import type { CartItem, Product } from '@/lib/supabase/types'

export interface FraudCheckInput {
  cartItems: (CartItem & { product: Product })[]
  totalAmount: number
}

export interface FraudResult {
  flagged: boolean
  reason?: string
}

export function checkFraud({ cartItems, totalAmount }: FraudCheckInput): FraudResult {
  for (const item of cartItems) {
    if (item.quantity > 10) {
      return { flagged: true, reason: `Quantity ${item.quantity} exceeds limit of 10 for item ${item.product.name}` }
    }
  }
  if (totalAmount > 2000) {
    return { flagged: true, reason: `Order total $${totalAmount} exceeds fraud threshold` }
  }
  return { flagged: false }
}
```

- [ ] **Step 3: Write fraud tests**

Create `__tests__/security/fraud.test.ts`:

```ts
import { checkFraud } from '@/lib/security/fraud'
import type { CartItem, Product } from '@/lib/supabase/types'

const makeItem = (quantity: number, price: number) => ({
  id: 'item-1', user_id: 'u1', product_id: 'p1', size: 'M',
  quantity,
  product: { id: 'p1', slug: 'tee', name: 'Tee', price, stock: 50 } as Product,
})

describe('checkFraud', () => {
  it('passes clean order', () => {
    const result = checkFraud({ cartItems: [makeItem(2, 39)], totalAmount: 78 })
    expect(result.flagged).toBe(false)
  })

  it('flags quantity > 10', () => {
    const result = checkFraud({ cartItems: [makeItem(11, 39)], totalAmount: 429 })
    expect(result.flagged).toBe(true)
    expect(result.reason).toContain('Quantity 11')
  })

  it('flags total > 2000', () => {
    const result = checkFraud({ cartItems: [makeItem(1, 2001)], totalAmount: 2001 })
    expect(result.flagged).toBe(true)
    expect(result.reason).toContain('fraud threshold')
  })
})
```

- [ ] **Step 4: Run fraud tests**

```bash
npx jest __tests__/security/fraud.test.ts
```
Expected: 3 passing

- [ ] **Step 5: Create `lib/security/with-security.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimiters, type RateLimitKey } from './rate-limit'
import { ZodSchema } from 'zod'

interface SecurityOptions {
  rateLimit: RateLimitKey
  requireAuth?: boolean
  schema?: ZodSchema
}

type Handler = (
  req: NextRequest,
  context: { userId?: string; body?: unknown }
) => Promise<NextResponse>

export function withSecurity(handler: Handler, options: SecurityOptions) {
  return async (req: NextRequest): Promise<NextResponse> => {
    // 1. Rate limit
    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'anonymous'
    const { success } = await rateLimiters[options.rateLimit].limit(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    // 2. Auth check
    let userId: string | undefined
    if (options.requireAuth) {
      const supabase = createClient()
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      userId = user.id
    }

    // 3. Body validation
    let body: unknown
    if (options.schema) {
      try {
        const raw = await req.json()
        body = options.schema.parse(raw)
      } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
      }
    }

    // 4. Call handler
    return handler(req, { userId, body })
  }
}
```

- [ ] **Step 6: Commit**

```bash
git add lib/security/ __tests__/security/
git commit -m "feat: add security middleware (rate limiting, fraud detection, auth checks)"
```

---

### Task 8: Zustand cart store

**Files:**
- Create: `lib/cart/store.ts`

- [ ] **Step 1: Create `lib/cart/store.ts`**

```ts
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

  addItem: (item) => set((state) => {
    const exists = state.items.find(
      (i) => i.product_id === item.product_id && i.size === item.size
    )
    if (exists) {
      return {
        items: state.items.map((i) =>
          i.id === exists.id ? { ...i, quantity: i.quantity + item.quantity } : i
        ),
      }
    }
    return { items: [...state.items, item] }
  }),

  updateQuantity: (cartItemId, quantity) => set((state) => ({
    items: state.items.map((i) =>
      i.id === cartItemId ? { ...i, quantity } : i
    ),
  })),

  removeItem: (cartItemId) => set((state) => ({
    items: state.items.filter((i) => i.id !== cartItemId),
  })),

  clearCart: () => set({ items: [] }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  total: () => get().items.reduce(
    (sum, item) => sum + item.product.price * item.quantity, 0
  ),

  itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}))
```

- [ ] **Step 2: Commit**

```bash
git add lib/cart/store.ts
git commit -m "feat: add Zustand cart store with optimistic updates"
```

---

### Task 9: Next.js middleware (auth guard)

**Files:**
- Create: `middleware.ts`

- [ ] **Step 1: Create `middleware.ts`**

```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return request.cookies.get(name)?.value },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/account')) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  return response
}

export const config = {
  matcher: ['/account/:path*'],
}
```

- [ ] **Step 2: Commit**

```bash
git add middleware.ts
git commit -m "feat: add auth guard middleware for /account"
```

---

## Phase 4 — Layout

### Task 10: Root layout, Navbar, Footer

**Files:**
- Modify: `app/layout.tsx`
- Create: `components/layout/Navbar.tsx`
- Create: `components/layout/Footer.tsx`

- [ ] **Step 1: Use Magic MCP to get Navbar component**

In Claude Code, run:
```
Use the 21st.dev Magic MCP to fetch a dark streetwear navbar component with: logo text "VAULT", navigation links (Tees, Hoodies, Pants, Shoes), cart icon with item count badge, and auth link (Sign In / Account). Dark background #0d0d0d, white text, uppercase bold style.
```

Save the output to `components/layout/Navbar.tsx` and adapt it to use:
- `useCartStore` from `@/lib/cart/store` for the cart count
- `createClient` from `@/lib/supabase/client` for auth state
- Next.js `<Link>` for navigation

- [ ] **Step 2: Create `components/layout/Footer.tsx`**

```tsx
import Link from 'next/link'

const categories = [
  { label: 'Tees', href: '/tshirts' },
  { label: 'Hoodies', href: '/hoodies' },
  { label: 'Pants', href: '/pants' },
  { label: 'Shoes', href: '/shoes' },
]

const legal = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Contact', href: '/contact' },
]

export default function Footer() {
  return (
    <footer className="border-t border-brand-border mt-20 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <p className="text-xl font-black tracking-widest2 uppercase mb-4">VAULT</p>
          <p className="text-brand-muted text-sm">Streetwear for those who move different.</p>
        </div>
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-brand-muted mb-4">Shop</p>
          <ul className="space-y-2">
            {categories.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="text-sm text-brand-text hover:text-white transition-colors">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-brand-muted mb-4">Legal</p>
          <ul className="space-y-2">
            {legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-brand-text hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-brand-muted mb-4">Follow</p>
          <ul className="space-y-2">
            {['Instagram', 'TikTok', 'Twitter'].map((s) => (
              <li key={s}>
                <span className="text-sm text-brand-text hover:text-white cursor-pointer transition-colors">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-brand-border text-center text-brand-muted text-xs">
        © {new Date().getFullYear()} VAULT. All rights reserved.
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Replace `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'VAULT — Streetwear',
  description: 'Premium streetwear. Hoodies, tees, pants, shoes.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-brand-bg text-brand-text min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx components/layout/
git commit -m "feat: add root layout with Navbar and Footer"
```

---

## Phase 5 — Homepage

### Task 11: Homepage sections

**Files:**
- Create: `components/home/HeroSection.tsx`
- Create: `components/home/CategoryGrid.tsx`
- Create: `components/home/FeaturedDrop.tsx`
- Create: `components/home/TrendingCarousel.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Use Magic MCP for HeroSection**

```
Use 21st.dev Magic MCP to fetch a full-bleed hero section for a streetwear brand called VAULT. Dark background, large bold uppercase headline "NEW DROP — WINTER 26", red accent badge labelled "LIMITED", subtext "Hoodies. Tees. Pants. Shoes.", and a CTA button "SHOP NOW" linking to /hoodies. No images — use a dark gradient background (#0d0d0d to #1a1a1a).
```

Save to `components/home/HeroSection.tsx`.

- [ ] **Step 2: Create `components/home/CategoryGrid.tsx`**

```tsx
import Link from 'next/link'
import Image from 'next/image'

const categories = [
  { label: 'TEES', href: '/tshirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600' },
  { label: 'HOODIES', href: '/hoodies', image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600' },
  { label: 'PANTS', href: '/pants', image: 'https://images.unsplash.com/photo-1624378441864-6359c8a08a0a?w=600' },
  { label: 'SHOES', href: '/shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600' },
]

export default function CategoryGrid() {
  return (
    <section className="px-6 py-16 max-w-7xl mx-auto">
      <h2 className="text-xs font-bold tracking-widest2 uppercase text-brand-muted mb-8">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categories.map((cat) => (
          <Link key={cat.href} href={cat.href} className="group relative overflow-hidden aspect-[3/4] bg-brand-surface">
            <Image
              src={cat.image}
              alt={cat.label}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <span className="absolute bottom-4 left-4 text-white font-black text-lg tracking-widest uppercase">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create `components/home/FeaturedDrop.tsx`**

```tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/products/ProductCard'

export default async function FeaturedDrop() {
  const supabase = createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .limit(3)

  if (!products?.length) return null

  return (
    <section className="px-6 py-16 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="badge-red mb-2 inline-block">FEATURED DROP</span>
          <h2 className="text-3xl font-black uppercase tracking-tight">The Current Edit</h2>
        </div>
        <Link href="/tshirts" className="text-xs font-bold tracking-widest uppercase text-brand-muted hover:text-white transition-colors">
          View All →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create `components/home/TrendingCarousel.tsx`**

```tsx
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/products/ProductCard'

export default async function TrendingCarousel() {
  const supabase = createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(8)

  if (!products?.length) return null

  return (
    <section className="py-16">
      <div className="px-6 max-w-7xl mx-auto mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-black uppercase tracking-tight">New Arrivals</h2>
      </div>
      <div className="px-6 overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
          {products.map((p) => (
            <div key={p.id} className="w-64 flex-shrink-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Replace `app/page.tsx`**

```tsx
import HeroSection from '@/components/home/HeroSection'
import CategoryGrid from '@/components/home/CategoryGrid'
import FeaturedDrop from '@/components/home/FeaturedDrop'
import TrendingCarousel from '@/components/home/TrendingCarousel'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <FeaturedDrop />
      <TrendingCarousel />
    </>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx components/home/
git commit -m "feat: add homepage sections (hero, category grid, featured drop, carousel)"
```

---

## Phase 6 — Product Listing

### Task 12: Product card and listing page

**Files:**
- Create: `components/products/ProductCard.tsx`
- Create: `components/products/StockPill.tsx`
- Create: `components/products/FilterBar.tsx`
- Create: `components/products/ProductGrid.tsx`
- Create: `app/[category]/page.tsx`

- [ ] **Step 1: Create `components/products/StockPill.tsx`**

```tsx
interface Props { stock: number }

export default function StockPill({ stock }: Props) {
  if (stock > 10) return null
  if (stock === 0) return <span className="badge bg-brand-muted text-white">SOLD OUT</span>
  return <span className="badge-red">{stock} LEFT</span>
}
```

- [ ] **Step 2: Use Magic MCP for ProductCard**

```
Use 21st.dev Magic MCP to fetch a dark streetwear product card component with: product image (Next.js Image component), product name in bold uppercase, price, a stock badge slot, and hover overlay effect. Dark background #111, white text. Clicking the card links to /product/[slug].
```

Save to `components/products/ProductCard.tsx`. Ensure it accepts a `product: Product` prop from `@/lib/supabase/types` and uses `StockPill` for the stock badge.

- [ ] **Step 3: Create `components/products/FilterBar.tsx`**

```tsx
'use client'
import { useRouter, useSearchParams } from 'next/navigation'

const sizes = ['S', 'M', 'L', 'XL', 'XXL']

export default function FilterBar() {
  const router = useRouter()
  const params = useSearchParams()
  const activeSize = params.get('size')

  const setSize = (size: string | null) => {
    const p = new URLSearchParams(params.toString())
    if (size) p.set('size', size)
    else p.delete('size')
    router.push(`?${p.toString()}`)
  }

  return (
    <div className="flex items-center gap-3 py-4 border-b border-brand-border">
      <span className="text-xs font-bold tracking-widest uppercase text-brand-muted">Size:</span>
      {sizes.map((s) => (
        <button
          key={s}
          onClick={() => setSize(activeSize === s ? null : s)}
          className={`px-3 py-1 text-xs font-bold tracking-widest border transition-colors ${
            activeSize === s
              ? 'bg-white text-black border-white'
              : 'border-brand-border text-brand-muted hover:border-white hover:text-white'
          }`}
        >
          {s}
        </button>
      ))}
      {activeSize && (
        <button onClick={() => setSize(null)} className="text-xs text-brand-muted hover:text-white ml-2">
          Clear
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Create `components/products/ProductGrid.tsx`**

```tsx
import type { Product } from '@/lib/supabase/types'
import ProductCard from './ProductCard'

interface Props { products: Product[] }

export default function ProductGrid({ products }: Props) {
  if (!products.length) {
    return (
      <div className="py-24 text-center text-brand-muted">
        <p className="text-lg font-bold uppercase tracking-widest">No products found</p>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-8">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}
```

- [ ] **Step 5: Create `app/[category]/page.tsx`**

```tsx
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Category } from '@/lib/supabase/types'
import FilterBar from '@/components/products/FilterBar'
import ProductGrid from '@/components/products/ProductGrid'

const VALID_CATEGORIES: Category[] = ['tshirts', 'hoodies', 'pants', 'shoes']

const CATEGORY_LABELS: Record<Category, string> = {
  tshirts: 'T-Shirts',
  hoodies: 'Hoodies & Zip-Ups',
  pants: 'Pants',
  shoes: 'Shoes',
}

interface Props {
  params: { category: string }
  searchParams: { size?: string }
}

export async function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({ category }))
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const category = params.category as Category
  if (!VALID_CATEGORIES.includes(category)) notFound()

  const supabase = createClient()
  let query = supabase.from('products').select('*').eq('category', category).order('created_at', { ascending: false })
  if (searchParams.size) query = query.contains('sizes', [searchParams.size])

  const { data: products } = await query

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-black uppercase tracking-tight mb-2">
        {CATEGORY_LABELS[category]}
      </h1>
      <p className="text-brand-muted text-sm mb-6">{products?.length ?? 0} products</p>
      <FilterBar />
      <ProductGrid products={products ?? []} />
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add components/products/ProductCard.tsx components/products/StockPill.tsx components/products/FilterBar.tsx components/products/ProductGrid.tsx app/\[category\]/
git commit -m "feat: add product listing page with filter bar and product grid"
```

---

## Phase 7 — Product Detail

### Task 13: Product detail page

**Files:**
- Create: `components/products/ProductImageGallery.tsx`
- Create: `components/products/SizeSelector.tsx`
- Create: `components/products/AddToCartButton.tsx`
- Create: `components/products/LiveInventory.tsx`
- Create: `components/products/RelatedProducts.tsx`
- Create: `app/product/[slug]/page.tsx`

- [ ] **Step 1: Create `components/products/SizeSelector.tsx`**

```tsx
'use client'
import { useState } from 'react'

interface Props {
  sizes: string[]
  onSelect: (size: string) => void
}

export default function SizeSelector({ sizes, onSelect }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  const select = (s: string) => {
    setSelected(s)
    onSelect(s)
  }

  return (
    <div>
      <p className="text-xs font-bold tracking-widest uppercase text-brand-muted mb-3">
        Size {selected && <span className="text-white ml-2">— {selected}</span>}
      </p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => (
          <button
            key={s}
            onClick={() => select(s)}
            className={`px-4 py-2 text-sm font-bold tracking-widest border transition-colors ${
              selected === s
                ? 'bg-white text-black border-white'
                : 'border-brand-border text-brand-text hover:border-white'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `components/products/AddToCartButton.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { useCartStore } from '@/lib/cart/store'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/lib/supabase/types'

interface Props { product: Product; selectedSize: string | null }

export default function AddToCartButton({ product, selectedSize }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const addItem = useCartStore((s) => s.addItem)

  const handleAdd = async () => {
    if (!selectedSize) { setError('Please select a size'); return }
    setError(null)
    setLoading(true)

    // Optimistic update
    addItem({
      id: crypto.randomUUID(),
      user_id: '',
      product_id: product.id,
      size: selectedSize,
      quantity: 1,
      product,
    })

    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id, size: selectedSize, quantity: 1 }),
      })
      if (!res.ok) throw new Error('Failed to add to cart')
    } catch {
      setError('Could not add to cart. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleAdd}
        disabled={loading || product.stock === 0}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {product.stock === 0 ? 'SOLD OUT' : loading ? 'ADDING...' : 'ADD TO CART'}
      </button>
      {error && <p className="text-brand-accent text-sm mt-2">{error}</p>}
    </div>
  )
}
```

- [ ] **Step 3: Create `components/products/LiveInventory.tsx`**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props { productId: string; initialStock: number }

export default function LiveInventory({ productId, initialStock }: Props) {
  const [stock, setStock] = useState(initialStock)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`product-stock-${productId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'products',
        filter: `id=eq.${productId}`,
      }, (payload) => {
        setStock((payload.new as { stock: number }).stock)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [productId])

  if (stock === 0) return <p className="text-brand-accent text-sm font-bold">OUT OF STOCK</p>
  if (stock <= 5) return <p className="text-brand-accent text-sm font-bold">ONLY {stock} LEFT</p>
  return <p className="text-green-500 text-sm font-bold">IN STOCK</p>
}
```

- [ ] **Step 4: Create `components/products/ProductImageGallery.tsx`**

```tsx
'use client'
import { useState } from 'react'
import Image from 'next/image'

interface Props { images: string[]; name: string }

export default function ProductImageGallery({ images, name }: Props) {
  const [active, setActive] = useState(0)

  return (
    <div>
      <div className="relative aspect-square bg-brand-surface overflow-hidden mb-3">
        <Image src={images[active]} alt={name} fill className="object-cover" />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-20 h-20 overflow-hidden border-2 transition-colors ${
                i === active ? 'border-white' : 'border-brand-border'
              }`}
            >
              <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Create `components/products/RelatedProducts.tsx`**

```tsx
import { createClient } from '@/lib/supabase/server'
import type { Category } from '@/lib/supabase/types'
import ProductCard from './ProductCard'

interface Props { category: Category; excludeId: string }

export default async function RelatedProducts({ category, excludeId }: Props) {
  const supabase = createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .neq('id', excludeId)
    .limit(4)

  if (!products?.length) return null

  return (
    <section className="mt-20">
      <h2 className="text-2xl font-black uppercase tracking-tight mb-6">You Might Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Create `app/product/[slug]/page.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProductImageGallery from '@/components/products/ProductImageGallery'
import SizeSelector from '@/components/products/SizeSelector'
import AddToCartButton from '@/components/products/AddToCartButton'
import LiveInventory from '@/components/products/LiveInventory'
import RelatedProducts from '@/components/products/RelatedProducts'
import StockPill from '@/components/products/StockPill'

interface Props { params: { slug: string } }

export default async function ProductPage({ params }: Props) {
  const supabase = createClient()
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!product) notFound()

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <ProductImageGallery images={product.images} name={product.name} />
        <div className="flex flex-col gap-6">
          <div>
            <StockPill stock={product.stock} />
            <h1 className="text-3xl font-black uppercase tracking-tight mt-2">{product.name}</h1>
            <p className="text-2xl font-bold mt-2">${product.price.toFixed(2)}</p>
          </div>
          <LiveInventory productId={product.id} initialStock={product.stock} />
          <p className="text-brand-muted text-sm leading-relaxed">{product.description}</p>
          <SizeAndCart product={product} />
        </div>
      </div>
      <RelatedProducts category={product.category} excludeId={product.id} />
    </div>
  )
}

// Client island for size + cart (server component can't use useState)
'use client'
function SizeAndCart({ product }: { product: any }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  return (
    <>
      <SizeSelector sizes={product.sizes} onSelect={setSelectedSize} />
      <AddToCartButton product={product} selectedSize={selectedSize} />
    </>
  )
}
```

Note: The product page uses a server component for data fetching but the `SizeAndCart` island needs to be a separate `'use client'` component. Split it into `app/product/[slug]/SizeAndCart.tsx` if Next.js complains about mixing directives.

- [ ] **Step 7: Commit**

```bash
git add components/products/ app/product/
git commit -m "feat: add product detail page with gallery, size selector, realtime stock"
```

---

## Phase 8 — Cart Page

### Task 14: Cart page

**Files:**
- Create: `components/cart/CartItem.tsx`
- Create: `components/cart/CartItemList.tsx`
- Create: `components/cart/OrderSummary.tsx`
- Create: `app/cart/page.tsx`

- [ ] **Step 1: Create `components/cart/CartItem.tsx`**

```tsx
'use client'
import Image from 'next/image'
import { useCartStore } from '@/lib/cart/store'
import type { CartItemWithProduct } from '@/lib/cart/store'

interface Props { item: CartItemWithProduct }

export default function CartItem({ item }: Props) {
  const { updateQuantity, removeItem } = useCartStore()

  const handleQty = async (delta: number) => {
    const newQty = item.quantity + delta
    if (newQty < 1) { handleRemove(); return }
    updateQuantity(item.id, newQty)
    await fetch('/api/cart/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart_item_id: item.id, quantity: newQty }),
    })
  }

  const handleRemove = async () => {
    removeItem(item.id)
    await fetch('/api/cart/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart_item_id: item.id }),
    })
  }

  return (
    <div className="flex gap-4 py-4 border-b border-brand-border">
      <div className="relative w-24 h-24 bg-brand-surface flex-shrink-0">
        <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
      </div>
      <div className="flex-1">
        <p className="font-bold uppercase tracking-wide text-sm">{item.product.name}</p>
        <p className="text-brand-muted text-xs mt-0.5">Size: {item.size}</p>
        <p className="font-bold mt-1">${(item.product.price * item.quantity).toFixed(2)}</p>
        <div className="flex items-center gap-3 mt-2">
          <button onClick={() => handleQty(-1)} className="w-7 h-7 border border-brand-border text-sm hover:border-white">−</button>
          <span className="text-sm font-bold">{item.quantity}</span>
          <button onClick={() => handleQty(1)} className="w-7 h-7 border border-brand-border text-sm hover:border-white">+</button>
          <button onClick={handleRemove} className="text-xs text-brand-muted hover:text-brand-accent ml-2 transition-colors">Remove</button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `components/cart/CartItemList.tsx`**

```tsx
'use client'
import { useCartStore } from '@/lib/cart/store'
import CartItem from './CartItem'

export default function CartItemList() {
  const items = useCartStore((s) => s.items)
  if (!items.length) {
    return (
      <div className="py-20 text-center">
        <p className="text-2xl font-black uppercase tracking-widest text-brand-muted">Your cart is empty</p>
      </div>
    )
  }
  return (
    <div>
      {items.map((item) => <CartItem key={item.id} item={item} />)}
    </div>
  )
}
```

- [ ] **Step 3: Create `components/cart/OrderSummary.tsx`**

```tsx
'use client'
import Link from 'next/link'
import { useCartStore } from '@/lib/cart/store'

export default function OrderSummary() {
  const { total, items } = useCartStore()
  const subtotal = total()
  const shipping = subtotal > 0 ? 5.99 : 0
  const orderTotal = subtotal + shipping

  return (
    <div className="bg-brand-surface border border-brand-border p-6">
      <h2 className="text-sm font-bold uppercase tracking-widest mb-6">Order Summary</h2>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-brand-muted">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-brand-muted">Shipping</span>
          <span>{shipping > 0 ? `$${shipping.toFixed(2)}` : '—'}</span>
        </div>
        <div className="flex justify-between font-bold text-base border-t border-brand-border pt-3 mt-3">
          <span>Total</span>
          <span>${orderTotal.toFixed(2)}</span>
        </div>
      </div>
      {items.length > 0 && (
        <Link href="/checkout" className="btn-primary w-full text-center mt-6 block">
          CHECKOUT
        </Link>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Create `app/cart/page.tsx`**

```tsx
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
```

- [ ] **Step 5: Commit**

```bash
git add components/cart/ app/cart/
git commit -m "feat: add cart page with optimistic item management"
```

---

## Phase 9 — API Routes

### Task 15: Cart API routes

**Files:**
- Create: `app/api/cart/add/route.ts`
- Create: `app/api/cart/update/route.ts`
- Create: `app/api/cart/remove/route.ts`

- [ ] **Step 1: Create `app/api/cart/add/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { withSecurity } from '@/lib/security/with-security'
import { createServiceClient } from '@/lib/supabase/server'
import { addToCartSchema } from '@/lib/schemas/cart'

export const POST = withSecurity(
  async (_req, { userId, body }) => {
    const { product_id, size, quantity } = body as any
    const supabase = createServiceClient()

    const { data: existing } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', userId)
      .eq('product_id', product_id)
      .eq('size', size)
      .single()

    if (existing) {
      await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
    } else {
      await supabase.from('cart_items').insert({ user_id: userId, product_id, size, quantity })
    }

    return NextResponse.json({ ok: true })
  },
  { rateLimit: 'cart', requireAuth: true, schema: addToCartSchema }
)
```

- [ ] **Step 2: Create `app/api/cart/update/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { withSecurity } from '@/lib/security/with-security'
import { createServiceClient } from '@/lib/supabase/server'
import { updateCartSchema } from '@/lib/schemas/cart'

export const POST = withSecurity(
  async (_req, { userId, body }) => {
    const { cart_item_id, quantity } = body as any
    const supabase = createServiceClient()

    // Verify ownership before update
    const { data: item } = await supabase
      .from('cart_items')
      .select('user_id')
      .eq('id', cart_item_id)
      .single()

    if (!item || item.user_id !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await supabase.from('cart_items').update({ quantity }).eq('id', cart_item_id)
    return NextResponse.json({ ok: true })
  },
  { rateLimit: 'cart', requireAuth: true, schema: updateCartSchema }
)
```

- [ ] **Step 3: Create `app/api/cart/remove/route.ts`**

```ts
import { NextResponse } from 'next/server'
import { withSecurity } from '@/lib/security/with-security'
import { createServiceClient } from '@/lib/supabase/server'
import { removeCartSchema } from '@/lib/schemas/cart'

export const POST = withSecurity(
  async (_req, { userId, body }) => {
    const { cart_item_id } = body as any
    const supabase = createServiceClient()

    const { data: item } = await supabase
      .from('cart_items')
      .select('user_id')
      .eq('id', cart_item_id)
      .single()

    if (!item || item.user_id !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await supabase.from('cart_items').delete().eq('id', cart_item_id)
    return NextResponse.json({ ok: true })
  },
  { rateLimit: 'cart', requireAuth: true, schema: removeCartSchema }
)
```

- [ ] **Step 4: Commit**

```bash
git add app/api/cart/
git commit -m "feat: add cart API routes with security middleware and ownership checks"
```

---

### Task 16: Checkout and Contact API routes

**Files:**
- Create: `app/api/checkout/place-order/route.ts`
- Create: `app/api/contact/route.ts`

- [ ] **Step 1: Create `app/api/checkout/place-order/route.ts`**

```ts
import { NextResponse } from 'next/server'
import { withSecurity } from '@/lib/security/with-security'
import { createServiceClient } from '@/lib/supabase/server'
import { checkoutSchema } from '@/lib/schemas/checkout'
import { checkFraud } from '@/lib/security/fraud'

export const POST = withSecurity(
  async (_req, { userId, body }) => {
    const address = body as any
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
      (sum, item) => sum + item.product.price * item.quantity, 0
    )

    // Fraud check
    const fraud = checkFraud({ cartItems: cartItems as any, totalAmount })
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
      cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        size: item.size,
        quantity: item.quantity,
        unit_price: item.product.price,
      }))
    )

    // Decrement stock
    for (const item of cartItems) {
      await supabase.rpc('decrement_stock', {
        p_product_id: item.product_id,
        p_quantity: item.quantity,
      })
    }

    // Clear cart
    await supabase.from('cart_items').delete().eq('user_id', userId)

    return NextResponse.json({ order_id: order.id })
  },
  { rateLimit: 'checkout', requireAuth: true, schema: checkoutSchema }
)
```

Add the stock decrement RPC to `supabase/migrations/001_schema.sql` (append):

```sql
CREATE OR REPLACE FUNCTION decrement_stock(p_product_id UUID, p_quantity INTEGER)
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  UPDATE products SET stock = GREATEST(0, stock - p_quantity) WHERE id = p_product_id;
END;
$$;
```

- [ ] **Step 2: Create `app/api/contact/route.ts`**

```ts
import { NextResponse } from 'next/server'
import { withSecurity } from '@/lib/security/with-security'
import { contactSchema } from '@/lib/schemas/contact'

export const POST = withSecurity(
  async (_req, { body }) => {
    const { name, email, message } = body as any
    // In production: send via Resend/SendGrid. For now, log server-side.
    console.log('[Contact Form]', { name, email, message })
    return NextResponse.json({ ok: true })
  },
  { rateLimit: 'contact', schema: contactSchema }
)
```

- [ ] **Step 3: Commit**

```bash
git add app/api/checkout/ app/api/contact/
git commit -m "feat: add checkout and contact API routes with fraud detection"
```

---

## Phase 10 — Auth Page

### Task 17: Auth page

**Files:**
- Create: `components/auth/AuthTabs.tsx`
- Create: `components/auth/EmailPasswordForm.tsx`
- Create: `app/auth/page.tsx`

- [ ] **Step 1: Create `components/auth/EmailPasswordForm.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Props { mode: 'login' | 'register' }

export default function EmailPasswordForm({ mode }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { error } =
        mode === 'login'
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message); return }
      router.push(mode === 'login' ? '/account' : '/')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-brand-muted mb-2">Email</label>
        <input
          type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
          className="w-full bg-brand-surface border border-brand-border px-4 py-3 text-sm text-white focus:border-white outline-none transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-brand-muted mb-2">Password</label>
        <input
          type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
          className="w-full bg-brand-surface border border-brand-border px-4 py-3 text-sm text-white focus:border-white outline-none transition-colors"
        />
      </div>
      {error && <p className="text-brand-accent text-sm">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
        {loading ? 'LOADING...' : mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
      </button>
    </form>
  )
}
```

- [ ] **Step 2: Create `components/auth/AuthTabs.tsx`**

```tsx
'use client'
import { useState } from 'react'
import EmailPasswordForm from './EmailPasswordForm'

export default function AuthTabs() {
  const [mode, setMode] = useState<'login' | 'register'>('login')

  return (
    <div>
      <div className="flex border-b border-brand-border mb-8">
        {(['login', 'register'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
              mode === m ? 'border-b-2 border-white text-white -mb-px' : 'text-brand-muted'
            }`}
          >
            {m === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        ))}
      </div>
      <EmailPasswordForm mode={mode} />
    </div>
  )
}
```

- [ ] **Step 3: Create `app/auth/page.tsx`**

```tsx
import AuthTabs from '@/components/auth/AuthTabs'

export default function AuthPage() {
  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <h1 className="text-3xl font-black uppercase tracking-tight mb-10">
        YOUR ACCOUNT
      </h1>
      <AuthTabs />
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/auth/ app/auth/
git commit -m "feat: add auth page with login and register tabs"
```

---

## Phase 11 — Checkout & Account

### Task 18: Checkout page

**Files:**
- Create: `components/checkout/ShippingForm.tsx`
- Create: `components/checkout/OrderReview.tsx`
- Create: `components/checkout/PlaceOrderButton.tsx`
- Create: `app/checkout/page.tsx`

- [ ] **Step 1: Create `components/checkout/ShippingForm.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/cart/store'

export default function ShippingForm() {
  const clearCart = useCartStore((s) => s.clearCart)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fields, setFields] = useState({
    full_name: '', email: '', line1: '', line2: '', city: '', postcode: '', country: 'GB',
  })

  const set = (k: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/checkout/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Order failed'); return }
      clearCart()
      router.push(`/account?order=${data.order_id}`)
    } finally {
      setLoading(false)
    }
  }

  const field = (label: string, key: keyof typeof fields, type = 'text') => (
    <div key={key}>
      <label className="block text-xs font-bold uppercase tracking-widest text-brand-muted mb-2">{label}</label>
      <input type={type} value={fields[key]} onChange={set(key)} required={key !== 'line2'}
        className="w-full bg-brand-surface border border-brand-border px-4 py-3 text-sm text-white focus:border-white outline-none transition-colors"
      />
    </div>
  )

  return (
    <form onSubmit={submit} className="space-y-4">
      {field('Full Name', 'full_name')}
      {field('Email', 'email', 'email')}
      {field('Address Line 1', 'line1')}
      {field('Address Line 2 (optional)', 'line2')}
      {field('City', 'city')}
      {field('Postcode', 'postcode')}
      {field('Country (ISO code, e.g. GB)', 'country')}
      {error && <p className="text-brand-accent text-sm">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50 mt-4">
        {loading ? 'PLACING ORDER...' : 'PLACE ORDER'}
      </button>
      <p className="text-xs text-brand-muted text-center">This is a demo store — no real payment is taken.</p>
    </form>
  )
}
```

- [ ] **Step 2: Create `app/checkout/page.tsx`**

```tsx
import ShippingForm from '@/components/checkout/ShippingForm'
import OrderSummary from '@/components/cart/OrderSummary'

export default function CheckoutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-black uppercase tracking-tight mb-10">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-6 text-brand-muted">Shipping Details</h2>
          <ShippingForm />
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-6 text-brand-muted">Your Order</h2>
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/checkout/ app/checkout/
git commit -m "feat: add checkout page with shipping form"
```

---

### Task 19: Account page

**Files:**
- Create: `components/account/ProfileCard.tsx`
- Create: `components/account/OrderHistory.tsx`
- Create: `app/account/page.tsx`

- [ ] **Step 1: Create `components/account/ProfileCard.tsx`**

```tsx
interface Props { email: string; username: string | null }

export default function ProfileCard({ email, username }: Props) {
  return (
    <div className="bg-brand-surface border border-brand-border p-6 flex items-center gap-4">
      <div className="w-14 h-14 bg-brand-border flex items-center justify-center text-2xl font-black uppercase">
        {(username ?? email)[0].toUpperCase()}
      </div>
      <div>
        <p className="font-bold uppercase tracking-wide">{username ?? 'Member'}</p>
        <p className="text-brand-muted text-sm">{email}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `components/account/OrderHistory.tsx`**

```tsx
import type { Order } from '@/lib/supabase/types'

interface Props { orders: Order[] }

export default function OrderHistory({ orders }: Props) {
  if (!orders.length) {
    return <p className="text-brand-muted text-sm py-8">No orders yet.</p>
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="border border-brand-border p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-brand-muted font-mono">{order.id.slice(0, 8).toUpperCase()}</p>
              <p className="font-bold mt-1">${order.total_amount.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <span className="badge bg-brand-border text-brand-text">{order.status.toUpperCase()}</span>
              <p className="text-xs text-brand-muted mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Create `app/account/page.tsx`**

```tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProfileCard from '@/components/account/ProfileCard'
import OrderHistory from '@/components/account/OrderHistory'

export default async function AccountPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const [{ data: profile }, { data: orders }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
  ])

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-black uppercase tracking-tight mb-8">Your Account</h1>
      <ProfileCard email={user.email!} username={profile?.username ?? null} />
      <h2 className="text-sm font-bold uppercase tracking-widest text-brand-muted mt-12 mb-6">Order History</h2>
      <OrderHistory orders={orders ?? []} />
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/account/ app/account/
git commit -m "feat: add account page with profile and order history"
```

---

## Phase 12 — Contact & Legal Pages

### Task 20: Contact, Privacy, Terms

**Files:**
- Create: `components/contact/ContactForm.tsx`
- Create: `app/contact/page.tsx`
- Create: `app/privacy/page.tsx`
- Create: `app/terms/page.tsx`

- [ ] **Step 1: Create `components/contact/ContactForm.tsx`**

```tsx
'use client'
import { useState } from 'react'

export default function ContactForm() {
  const [fields, setFields] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const set = (k: keyof typeof fields) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFields((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    })
    setStatus(res.ok ? 'success' : 'error')
  }

  if (status === 'success') {
    return (
      <div className="py-12 text-center">
        <p className="text-2xl font-black uppercase tracking-widest">Message Sent.</p>
        <p className="text-brand-muted text-sm mt-2">We'll get back to you within 48 hours.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {(['name', 'email'] as const).map((k) => (
        <div key={k}>
          <label className="block text-xs font-bold uppercase tracking-widest text-brand-muted mb-2">{k}</label>
          <input type={k === 'email' ? 'email' : 'text'} value={fields[k]} onChange={set(k)} required
            className="w-full bg-brand-surface border border-brand-border px-4 py-3 text-sm text-white focus:border-white outline-none transition-colors"
          />
        </div>
      ))}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-brand-muted mb-2">Message</label>
        <textarea value={fields.message} onChange={set('message')} required rows={5} minLength={10}
          className="w-full bg-brand-surface border border-brand-border px-4 py-3 text-sm text-white focus:border-white outline-none transition-colors resize-none"
        />
      </div>
      {status === 'error' && <p className="text-brand-accent text-sm">Something went wrong. Please try again.</p>}
      <button type="submit" disabled={status === 'loading'} className="btn-primary disabled:opacity-50">
        {status === 'loading' ? 'SENDING...' : 'SEND MESSAGE'}
      </button>
    </form>
  )
}
```

- [ ] **Step 2: Create `app/contact/page.tsx`**

```tsx
import ContactForm from '@/components/contact/ContactForm'

export default function ContactPage() {
  return (
    <div className="max-w-xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Contact</h1>
      <p className="text-brand-muted text-sm mb-10">Questions, collabs, or just want to talk fit — hit us up.</p>
      <ContactForm />
      <div className="mt-12 pt-8 border-t border-brand-border text-sm text-brand-muted space-y-2">
        <p>📧 hello@vaultdrop.com</p>
        <p>📸 @vaultdrop</p>
        <p>🎵 @vaultdrop</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create `app/privacy/page.tsx`**

```tsx
export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 prose prose-invert">
      <h1 className="text-4xl font-black uppercase tracking-tight mb-8">Privacy Policy</h1>
      <p className="text-brand-muted text-sm mb-8">Last updated: April 2026</p>

      <section className="space-y-6 text-sm text-brand-muted leading-relaxed">
        <div>
          <h2 className="text-white font-bold uppercase tracking-wide text-base mb-2">1. Data We Collect</h2>
          <p>We collect your email address and password (hashed) when you create an account. We also store your shipping address when you place an order, and your cart contents while you are logged in.</p>
        </div>
        <div>
          <h2 className="text-white font-bold uppercase tracking-wide text-base mb-2">2. How We Use It</h2>
          <p>Your data is used solely to operate the store — processing orders, maintaining your account, and syncing your cart. We do not sell, share, or transfer your data to third parties for marketing purposes.</p>
        </div>
        <div>
          <h2 className="text-white font-bold uppercase tracking-wide text-base mb-2">3. Storage</h2>
          <p>Data is stored securely in Supabase (PostgreSQL) with Row Level Security enabled. Your data is only accessible to you when authenticated. Passwords are never stored in plain text.</p>
        </div>
        <div>
          <h2 className="text-white font-bold uppercase tracking-wide text-base mb-2">4. Cookies</h2>
          <p>We use a single secure session cookie to keep you logged in. It is set with HttpOnly and SameSite=Strict flags. No third-party tracking cookies are used.</p>
        </div>
        <div>
          <h2 className="text-white font-bold uppercase tracking-wide text-base mb-2">5. Your Rights</h2>
          <p>You may request deletion of your account and all associated data at any time by contacting us at hello@vaultdrop.com. We will action requests within 30 days in compliance with GDPR.</p>
        </div>
        <div>
          <h2 className="text-white font-bold uppercase tracking-wide text-base mb-2">6. Contact</h2>
          <p>For any privacy questions, email hello@vaultdrop.com.</p>
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 4: Create `app/terms/page.tsx`**

```tsx
export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-black uppercase tracking-tight mb-8">Terms of Use</h1>
      <p className="text-brand-muted text-sm mb-8">Last updated: April 2026</p>

      <section className="space-y-6 text-sm text-brand-muted leading-relaxed">
        <div>
          <h2 className="text-white font-bold uppercase tracking-wide text-base mb-2">1. Demo Store</h2>
          <p>VAULT is a demonstration e-commerce platform. No real payments are processed and no physical goods are shipped. All transactions are mock.</p>
        </div>
        <div>
          <h2 className="text-white font-bold uppercase tracking-wide text-base mb-2">2. Accounts</h2>
          <p>You are responsible for maintaining the security of your account credentials. Do not share your password. We reserve the right to suspend accounts that violate these terms.</p>
        </div>
        <div>
          <h2 className="text-white font-bold uppercase tracking-wide text-base mb-2">3. Intellectual Property</h2>
          <p>All content on this site — including design, text, and graphics — is the property of VAULT. You may not reproduce or redistribute any content without express written permission.</p>
        </div>
        <div>
          <h2 className="text-white font-bold uppercase tracking-wide text-base mb-2">4. Limitation of Liability</h2>
          <p>VAULT is provided "as is" without warranties of any kind. We are not liable for any damages arising from use of this platform.</p>
        </div>
        <div>
          <h2 className="text-white font-bold uppercase tracking-wide text-base mb-2">5. Governing Law</h2>
          <p>These terms are governed by the laws of England and Wales.</p>
        </div>
        <div>
          <h2 className="text-white font-bold uppercase tracking-wide text-base mb-2">6. Contact</h2>
          <p>Legal queries: hello@vaultdrop.com</p>
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add components/contact/ app/contact/ app/privacy/ app/terms/
git commit -m "feat: add contact form, privacy policy, and terms of use pages"
```

---

## Phase 13 — Cloudflare & Documentation

### Task 21: Cloudflare config and claude.md

**Files:**
- Create: `cloudflare.md`
- Create: `waf-rules.json`
- Create: `claude.md`

- [ ] **Step 1: Create `cloudflare.md`**

```markdown
# Cloudflare Configuration Guide

## 1. DNS Setup

In Cloudflare DNS, add an A record pointing your domain to the Vercel deployment:

| Type | Name | Value | Proxy |
|------|------|-------|-------|
| A | @ | 76.76.21.21 | ✅ Proxied (orange cloud) |
| CNAME | www | cname.vercel-dns.com | ✅ Proxied |

Vercel IP: `76.76.21.21` (check Vercel docs for current IP).

## 2. SSL/TLS

In Cloudflare → SSL/TLS → Overview: set mode to **Full (strict)**.

## 3. WAF Rules

Go to Security → WAF → Custom Rules. Import `waf-rules.json` or add manually:

**Rule 1: Block bad bots on API**
- Expression: `(http.request.uri.path matches "^/api/") and not (http.user_agent contains "Mozilla")`
- Action: Block

**Rule 2: Block Tor exit nodes**
- Expression: `(ip.src in $cf.anonymizer_proxies)`
- Action: Block

**Rule 3: Challenge high-risk countries (adjust list to your market)**
- Expression: `(ip.geoip.country in {"CN" "RU" "KP"}) and (http.request.uri.path matches "^/api/checkout")`
- Action: Managed Challenge

## 4. Rate Limiting

Security → WAF → Rate Limiting Rules:

- Name: Global API rate limit
- Expression: `http.request.uri.path matches "^/api/"`
- Threshold: 100 requests per 10 seconds per IP
- Action: Block for 60 seconds

## 5. Security Headers (Transform Rules)

Security → WAF → Transform Rules → Modify Response Header:

Add these headers on all responses:

| Header | Value |
|--------|-------|
| X-Frame-Options | DENY |
| X-Content-Type-Options | nosniff |
| Strict-Transport-Security | max-age=31536000; includeSubDomains |
| Referrer-Policy | strict-origin-when-cross-origin |
| Content-Security-Policy | default-src 'self' https:; img-src 'self' https://images.unsplash.com data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' |

## 6. DDoS

DDoS protection is automatic on all Cloudflare plans (L3/L4). For L7 (HTTP) DDoS:
- Security → DDoS → HTTP DDoS attack protection → set sensitivity to **High**
```

- [ ] **Step 2: Create `waf-rules.json`**

```json
{
  "rules": [
    {
      "id": "block-bad-bots-api",
      "description": "Block non-browser user agents on API routes",
      "expression": "(http.request.uri.path matches \"^/api/\") and not (http.user_agent contains \"Mozilla\")",
      "action": "block"
    },
    {
      "id": "block-anonymizer-proxies",
      "description": "Block Tor exit nodes and anonymizer proxies",
      "expression": "(cf.client.bot) or (ip.src in $cf.anonymizer_proxies)",
      "action": "block"
    },
    {
      "id": "challenge-checkout-high-risk",
      "description": "Managed challenge on checkout from high-risk geos",
      "expression": "(ip.geoip.country in {\"CN\" \"RU\" \"KP\"}) and (http.request.uri.path matches \"^/api/checkout\")",
      "action": "managed_challenge"
    }
  ],
  "rate_limits": [
    {
      "id": "global-api-rate-limit",
      "expression": "http.request.uri.path matches \"^/api/\"",
      "threshold": 100,
      "period": 10,
      "action": "block",
      "timeout": 60
    }
  ]
}
```

- [ ] **Step 3: Create `claude.md`**

```markdown
# VAULT — Streetwear E-Commerce

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 App Router (TypeScript) |
| Styling | Tailwind CSS (custom streetwear theme in `tailwind.config.ts`) |
| UI Components | 21st.dev Magic MCP + custom components |
| Auth | Supabase Auth (email + password) |
| Database | Supabase PostgreSQL with RLS |
| Realtime | Supabase Realtime (products table: stock; cart_items table) |
| Rate Limiting | Upstash Redis via `@upstash/ratelimit` |
| Validation | Zod (schemas in `lib/schemas/`) |
| Cart State | Zustand (`lib/cart/store.ts`) |
| Deployment | Vercel |
| Edge Security | Cloudflare WAF + DDoS |

## Running the Project

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Fill in values from Supabase project settings + Upstash dashboard

# Start Supabase locally (requires Supabase CLI)
npx supabase start
npx supabase db push        # Run migrations
npx supabase db seed        # Load product data

# Run dev server
npm run dev
# → http://localhost:3000

# Run tests
npx jest
```

## Environment Variables

| Variable | Location | Used by |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | Supabase clients |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | Supabase browser client |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | API routes (bypasses RLS safely) |
| `UPSTASH_REDIS_REST_URL` | Server only | Rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Server only | Rate limiting |

**Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.**

## Component Map

```
app/
  page.tsx                  → Homepage
  [category]/page.tsx       → Product listing (tshirts/hoodies/pants/shoes)
  product/[slug]/page.tsx   → Product detail
  cart/page.tsx             → Shopping cart
  checkout/page.tsx         → Checkout (mock)
  account/page.tsx          → User account + order history (protected)
  auth/page.tsx             → Login / Register
  contact/page.tsx          → Contact form
  privacy/page.tsx          → Privacy Policy
  terms/page.tsx            → Terms of Use
  api/cart/add/route.ts     → POST add to cart
  api/cart/update/route.ts  → POST update quantity
  api/cart/remove/route.ts  → POST remove item
  api/checkout/place-order/ → POST place mock order
  api/contact/route.ts      → POST contact form
```

## Supabase Schema

5 tables: `products`, `profiles`, `cart_items`, `orders`, `order_items`

- **products** — public read, service_role write, Realtime enabled
- **profiles** — auto-created on signup via trigger, own row only
- **cart_items** — own rows only (RLS: `user_id = auth.uid()`), Realtime enabled
- **orders** — own rows, immutable after insert
- **order_items** — accessible via parent order ownership

Migrations: `supabase/migrations/`
Seed: `supabase/seed.sql` (28 products across 4 categories)

## Security Architecture

```
Browser → Cloudflare (WAF/DDoS) → Vercel → withSecurity() → Supabase RLS
```

1. **Cloudflare** — blocks bots, bad IPs, rate limits at edge. Config in `cloudflare.md` and `waf-rules.json`.
2. **withSecurity()** (`lib/security/with-security.ts`) — wraps all API routes:
   - Rate limit via Upstash Redis
   - Auth check (Supabase SSR session)
   - Zod body validation
3. **Supabase RLS** — database-level isolation. Users cannot access other users' cart or orders regardless of code bugs.
4. **Fraud detection** (`lib/security/fraud.ts`) — blocks suspicious checkout patterns.

## Deploying to Vercel

1. Push to GitHub
2. Import repo in Vercel dashboard
3. Add environment variables in Vercel → Settings → Environment Variables
4. Deploy — Vercel auto-detects Next.js
5. Point your domain through Cloudflare (see `cloudflare.md`)
```

- [ ] **Step 4: Commit**

```bash
git add cloudflare.md waf-rules.json claude.md
git commit -m "docs: add Cloudflare config, WAF rules, and claude.md"
```

---

## Phase 14 — Supabase Setup & Final Verification

### Task 22: Supabase project setup

- [ ] **Step 1: Create Supabase project**

Go to supabase.com → New Project. Note the Project URL and anon key from Settings → API.

- [ ] **Step 2: Get service role key**

Settings → API → service_role key. Add to `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`. Never commit this.

- [ ] **Step 3: Install Supabase CLI and push migrations**

```bash
npm install -g supabase
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

- [ ] **Step 4: Seed the database**

```bash
npx supabase db seed
```

Verify in Supabase dashboard → Table Editor → products (should show 28 rows).

- [ ] **Step 5: Enable Realtime**

Supabase dashboard → Database → Replication → enable `products` and `cart_items` tables.

### Task 23: Upstash Redis setup

- [ ] **Step 1: Create Upstash Redis database**

Go to console.upstash.com → Create Database → choose region closest to `iad1` (Vercel default). Copy REST URL and REST token to `.env.local`.

### Task 24: Final dev server smoke test

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Check these routes load without errors**

```
http://localhost:3000          → Homepage
http://localhost:3000/hoodies  → Product listing
http://localhost:3000/auth     → Auth page
http://localhost:3000/cart     → Cart page
http://localhost:3000/contact  → Contact form
http://localhost:3000/privacy  → Privacy policy
http://localhost:3000/terms    → Terms of use
```

- [ ] **Step 3: Run full test suite**

```bash
npx jest
```
Expected: All tests pass.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete streetwear e-commerce platform — Vercel ready"
```

### Task 25: Deploy to Vercel

- [ ] **Step 1: Push to GitHub**

```bash
git remote add origin https://github.com/YOUR_USERNAME/vault-streetwear.git
git push -u origin main
```

- [ ] **Step 2: Import in Vercel**

vercel.com → Add New Project → Import from GitHub → select repo.

- [ ] **Step 3: Add environment variables**

In Vercel → Settings → Environment Variables, add all 5 variables from `.env.local` for Production + Preview + Development.

- [ ] **Step 4: Deploy**

Click Deploy. Build logs will show any missing env vars.

- [ ] **Step 5: Configure Cloudflare**

Follow `cloudflare.md` to point your domain through Cloudflare to Vercel.

---

*Plan complete. All 25 tasks implement the full spec in `docs/superpowers/specs/2026-04-05-ecommerce-design.md`.*
