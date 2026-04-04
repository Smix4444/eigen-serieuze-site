# Streetwear E-Commerce Platform — Design Spec
*Date: 2026-04-05*

## Overview

A real-time streetwear clothing e-commerce platform built on Next.js App Router, Supabase, Cloudflare, and deployed to Vercel. Urban/streetwear aesthetic — bold, high contrast, drop-culture vibes. Mock checkout (no real payment processor). Full Supabase Auth with saved carts and order history. Seeded product catalog, no admin UI.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 App Router |
| UI Components | React + Tailwind CSS + 21st.dev Magic MCP |
| Auth | Supabase Auth (email + password) |
| Database | Supabase PostgreSQL |
| Realtime | Supabase Realtime (inventory + cart) |
| Rate Limiting | Upstash Redis |
| Input Validation | Zod |
| Edge / CDN | Cloudflare (DNS, WAF, DDoS, headers) |
| Deployment | Vercel |
| Security Headers | Cloudflare Transform Rules |

---

## Visual Direction

**Streetwear / Urban** — bold, high contrast, drop-culture aesthetic.
- Dark backgrounds (`#0d0d0d`, `#111`)
- High-contrast white/off-white text
- Accent: red (`#e63946`), electric highlights
- Badge labels (LIMITED, NEW DROP, SOLD OUT)
- Heavy typography, uppercase, tight letter-spacing
- Bento-grid product layouts
- Horizontal scroll carousels for trending items

---

## Pages

| Route | Description |
|---|---|
| `/` | Homepage: hero banner, category grid, featured drop, trending carousel |
| `/[category]` | Product listing for `tshirts`, `hoodies`, `pants`, `shoes` |
| `/product/[slug]` | Product detail: gallery, size selector, add to cart, live stock |
| `/cart` | Cart with optimistic UI updates, synced to Supabase for logged-in users |
| `/checkout` | Shipping form (Zod-validated), mock order placement |
| `/account` | Profile card + order history (protected route) |
| `/auth` | Login / Register tabs via Supabase Auth |
| `/contact` | Contact form — rate-limited, Zod-validated, brand socials |
| `/privacy` | Privacy Policy — GDPR-aware, static MDX |
| `/terms` | Terms of Use — static MDX |

---

## Component Map (21st.dev Magic MCP)

### Homepage
- `HeroSection` — full-bleed video/image drop banner
- `CategoryGrid` — 4 category tiles (Tees, Hoodies, Pants, Shoes)
- `FeaturedDrop` — limited badge + countdown timer
- `TrendingCarousel` — horizontal scroll product strip
- `Navbar` — logo, cart icon with live count, auth links
- `Footer` — nav links, legal links (Privacy, Terms), socials

### Product Listing `/[category]`
- `FilterBar` — size, colour, price range filters
- `ProductGrid` — SSR-rendered grid of product cards
- `ProductCard` — image, name, price, stock badge
- `StockPill` — "3 LEFT" live via Supabase Realtime

### Product Detail `/product/[slug]`
- `ProductImageGallery` — main image + thumbnails
- `SizeSelector` — S M L XL XXL
- `AddToCartButton` — optimistic update on click
- `LiveInventory` — real-time stock count
- `RelatedProducts` — same category suggestions

### Cart `/cart`
- `CartItemList` — quantity controls, remove item
- `OrderSummary` — subtotal, estimated shipping, total
- `CheckoutCTA` — button linking to `/checkout`

### Checkout `/checkout`
- `ShippingForm` — name, address, email (Zod-validated)
- `OrderReview` — items + totals
- `PlaceOrderButton` — mock confirm, creates order in DB

### Account `/account`
- `ProfileCard` — avatar, username, email
- `OrderHistory` — list of past orders
- `OrderDetail` — items, status, date

### Auth `/auth`
- `AuthTabs` — Login / Register toggle
- `EmailPasswordForm` — Supabase Auth integration
- `ErrorToast` — invalid credentials, rate limit messages

### Contact `/contact`
- `ContactForm` — name, email, message
- Social links + brand email

---

## Database Schema

### `products`
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
slug        text UNIQUE NOT NULL
name        text NOT NULL
description text
price       numeric(10,2) NOT NULL
category    text NOT NULL  -- 'tshirts' | 'hoodies' | 'pants' | 'shoes'
images      text[]         -- Unsplash URLs
sizes       text[]         -- ['S','M','L','XL','XXL']
stock       integer DEFAULT 0
is_featured boolean DEFAULT false
created_at  timestamptz DEFAULT now()
```
**RLS:** SELECT public. INSERT/UPDATE/DELETE service_role only. Realtime enabled.

### `profiles`
```sql
id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
username    text
full_name   text
avatar_url  text
updated_at  timestamptz
```
**RLS:** SELECT/UPDATE own row only (`id = auth.uid()`).  
**Trigger:** `handle_new_user()` auto-creates profile on signup.

### `cart_items`
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
product_id  uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE
size        text NOT NULL
quantity    integer NOT NULL DEFAULT 1
```
**RLS:** ALL operations — own rows only (`user_id = auth.uid()`). Realtime enabled.

### `orders`
```sql
id               uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id          uuid NOT NULL REFERENCES profiles(id)
status           text NOT NULL DEFAULT 'confirmed'  -- 'confirmed' | 'shipped' | 'delivered'
total_amount     numeric(10,2) NOT NULL
shipping_address jsonb NOT NULL
created_at       timestamptz DEFAULT now()
```
**RLS:** SELECT own rows. INSERT authenticated only. UPDATE/DELETE denied.

### `order_items`
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
order_id    uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE
product_id  uuid NOT NULL REFERENCES products(id)
size        text NOT NULL
quantity    integer NOT NULL
unit_price  numeric(10,2) NOT NULL
```
**RLS:** SELECT via parent order ownership. INSERT authenticated only.

### Seed Data (`supabase/seed.sql`)
- 8 hoodies / zip-ups
- 8 t-shirts
- 6 pants
- 6 shoes
- Unsplash fashion/streetwear image URLs
- Realistic price ranges ($29–$149)
- Random stock quantities (3–50)
- 3 products flagged `is_featured = true`

---

## API Routes

All routes wrapped in a `withSecurity()` middleware that applies rate limiting, auth checks, and Zod validation before the handler runs.

| Route | Method | Auth | Rate Limit | Description |
|---|---|---|---|---|
| `/api/cart/add` | POST | Required | 30/min | Add item to cart |
| `/api/cart/update` | POST | Required | 30/min | Update item quantity |
| `/api/cart/remove` | POST | Required | 30/min | Remove item from cart |
| `/api/checkout/place-order` | POST | Required | 5/min | Place mock order, clear cart |
| `/api/products/[id]` | GET | None | 60/min | Single product lookup |
| `/api/contact` | POST | None | 3/min | Submit contact form |

---

## Security Design

### Environment Variables

**Public (safe for browser bundle):**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Server-only (never in browser, never committed to git):**
```
SUPABASE_SERVICE_ROLE_KEY
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

`.env.local` is gitignored. All secrets stored in Vercel Environment Variables UI.

### Row Level Security

RLS is enabled on all private tables. Policies use `auth.uid()` — enforced at the Postgres level, not application code. A bug in an API route cannot leak another user's data because the database rejects the query outright.

```sql
-- Example: cart isolation
CREATE POLICY "Users own their cart" ON cart_items
  FOR ALL USING (user_id = auth.uid());
```

`service_role` key bypasses RLS but is server-only and never exposed to the client.

### API Middleware (`withSecurity`)

```
withSecurity(handler, { rateLimit, requireAuth, schema })
  1. Rate limit check via Upstash Redis (per IP)
  2. Auth check — Supabase SSR session verify
  3. Body parse + Zod schema validation
  4. Call handler
```

### Checkout Fraud Flags

Flagged and rejected server-side:
- Quantity > 10 for a single item
- Order total > $2,000 (mock threshold)
- More than 3 orders from same IP in 1 hour

### CSRF Protection

- Supabase session cookie set with `SameSite=Strict; HttpOnly; Secure`
- API routes check `Origin` header matches allowed domain

### Cloudflare Configuration

Documented in `cloudflare.md` + `waf-rules.json` at project root:

1. **DNS** — A record proxied (orange cloud) pointing to Vercel deployment IP
2. **SSL/TLS** — Full (strict) mode
3. **WAF Rules:**
   - Block non-browser user agents on `/api/*`
   - Block known malicious IPs / Tor exit nodes
   - Challenge requests from high-risk countries (configurable list)
4. **Rate Limiting** — 100 requests per 10 seconds per IP, site-wide
5. **DDoS** — Auto-enabled on free plan (L3/L4 protection)
6. **Security Headers via Transform Rules:**
   - `X-Frame-Options: DENY`
   - `X-Content-Type-Options: nosniff`
   - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
   - `Content-Security-Policy: default-src 'self'; img-src 'self' images.unsplash.com`
   - `Referrer-Policy: strict-origin-when-cross-origin`

---

## Deployment (Vercel)

### Files
- `vercel.json` — region config, function memory, headers
- `next.config.js` — image domains (Unsplash), env validation

### Commands
```bash
# Local development
npm run dev

# Supabase local
npx supabase start
npx supabase db push       # apply migrations
npx supabase db seed       # load seed data

# Deploy
git push origin main       # auto-deploys to Vercel
```

### Vercel Environment Variables
Set in Vercel dashboard under Settings → Environment Variables for Production, Preview, and Development:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

---

## Out of Scope (this version)

- Real payment processing (Stripe ready to add)
- Admin product management UI
- Email notifications (order confirmations)
- Wishlist / favourites
- Product reviews
- Search / full-text filtering
