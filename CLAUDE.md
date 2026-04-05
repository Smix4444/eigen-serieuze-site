# VAULT — Streetwear E-Commerce

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 App Router (TypeScript) |
| Styling | Tailwind CSS v4 (CSS variable-based `@theme` config) |
| UI Components | Custom + 21st.dev Magic MCP |
| Auth | Supabase Auth (email + password) |
| Database | Supabase PostgreSQL with RLS |
| Realtime | Supabase Realtime (`products` stock, `cart_items`) |
| Rate Limiting | Upstash Redis via `@upstash/ratelimit` |
| Validation | Zod (schemas in `lib/schemas/`) |
| Cart State | Zustand (`lib/cart/store.ts`) — optimistic updates |
| Deployment | Vercel |
| Edge Security | Cloudflare WAF + DDoS |

## Running the Project

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local .env.local.example  # copy for reference, fill in real values
# Edit .env.local with values from Supabase project settings + Upstash dashboard

# Start Supabase locally (requires Supabase CLI)
npx supabase start
npx supabase db push        # Run migrations (supabase/migrations/)
npx supabase db seed        # Load 28 products (supabase/seed.sql)

# Run dev server
npm run dev
# → http://localhost:3000

# Run tests
npx jest

# Build (production check)
npm run build
```

## Environment Variables

| Variable | Where to get it | Used by |
|----------|----------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API | Client + Server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API | Client + Server |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API | **Server only** — API routes |
| `UPSTASH_REDIS_REST_URL` | Upstash Console → Database | Rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Console → Database | Rate limiting |

> ⚠️ **Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.** It bypasses all RLS policies.

## Page Map

```
app/
  page.tsx                      → Homepage (hero, category grid, featured drop, trending)
  [category]/page.tsx           → Product listing (tshirts / hoodies / pants / shoes)
  product/[slug]/page.tsx       → Product detail (gallery, size, add to cart, live stock)
  cart/page.tsx                 → Shopping cart (optimistic updates)
  checkout/page.tsx             → Checkout (mock — no real payments)
  account/page.tsx              → User profile + order history (auth required)
  auth/page.tsx                 → Login / Register
  contact/page.tsx              → Contact form
  privacy/page.tsx              → Privacy Policy (GDPR-aware)
  terms/page.tsx                → Terms of Use
  api/cart/add/route.ts         → POST — add to cart
  api/cart/update/route.ts      → POST — update quantity
  api/cart/remove/route.ts      → POST — remove item
  api/checkout/place-order/     → POST — place mock order
  api/contact/route.ts          → POST — contact form
```

## Database Schema

5 tables in Supabase PostgreSQL:

| Table | RLS | Realtime | Notes |
|-------|-----|----------|-------|
| `products` | SELECT public | ✅ | INSERT/UPDATE/DELETE service_role only |
| `profiles` | Own row only | ❌ | Auto-created via trigger on signup |
| `cart_items` | Own rows only | ✅ | `user_id = auth.uid()` |
| `orders` | Own rows, no update/delete | ❌ | Immutable after creation |
| `order_items` | Via parent order | ❌ | |

Migrations: `supabase/migrations/001_schema.sql` + `002_rls.sql`
Seed data: `supabase/seed.sql` (28 products across 4 categories, 3 featured)

## Security Architecture

```
Browser → Cloudflare (WAF/DDoS/headers) → Vercel → withSecurity() → Supabase RLS
```

Three layers:

1. **Cloudflare** — Edge protection. Config in `cloudflare.md` + `waf-rules.json`.
2. **`withSecurity()`** (`lib/security/with-security.ts`) — Applied to every API route:
   - Rate limiting via Upstash Redis (per IP, sanitized x-forwarded-for)
   - Auth check (Supabase SSR session verify)
   - Zod body validation
3. **Supabase RLS** — Database-level isolation. `user_id = auth.uid()` enforced in Postgres.

**Secret handling:** Only `NEXT_PUBLIC_*` vars reach the browser. `SUPABASE_SERVICE_ROLE_KEY` and Upstash tokens are server-only, stored in Vercel Environment Variables — never committed to git.

## Tailwind v4 Note

This project uses **Tailwind v4** (not v3). There is no `tailwind.config.ts`. All theme configuration is in `app/globals.css` using `@theme` directive. Brand colors are accessed via CSS variables in class attributes:

```tsx
// ✅ Correct (v4)
<div className="bg-[var(--color-brand-bg)] text-[var(--color-brand-text)]">

// ❌ Wrong (v3 style — won't work)
<div className="bg-brand-bg text-brand-text">
```

## Deploying to Vercel

1. Push to GitHub
2. Import repo at vercel.com → New Project
3. Add all 5 environment variables in Vercel → Settings → Environment Variables (Production + Preview + Development)
4. Deploy — Next.js auto-detected, zero config needed
5. Add custom domain → configure Cloudflare DNS per `cloudflare.md`

## Supabase Setup (Production)

1. Create project at supabase.com
2. Go to Settings → API → copy Project URL + anon key + service_role key
3. Run migrations: `npx supabase db push` (after `npx supabase link --project-ref YOUR_REF`)
4. Run seed: `npx supabase db seed`
5. Enable Realtime: Dashboard → Database → Replication → enable `products` and `cart_items`
