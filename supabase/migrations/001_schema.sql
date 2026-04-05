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

-- Stock decrement RPC (used at checkout)
CREATE OR REPLACE FUNCTION decrement_stock(p_product_id UUID, p_quantity INTEGER)
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  UPDATE products SET stock = GREATEST(0, stock - p_quantity) WHERE id = p_product_id;
END;
$$;

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE cart_items;
