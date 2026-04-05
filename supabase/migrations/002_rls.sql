-- Enable RLS on all private tables
ALTER TABLE products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
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
