-- ═══════════════════════════════════════════════
-- AARWINS DATABASE SEED DATA
-- ═══════════════════════════════════════════════

-- Clear existing products to ensure the new premium 6 flavours are active
DELETE FROM products;

-- 1. Watermelon Coconut
INSERT INTO products (id, name, description, image_url, price, category, ingredients, created_at)
VALUES (1, 'Watermelon Coconut Elixir', 'Light, refreshing and crafted for warm-weather hydration. Freshly harvested watermelons, bursting with juicy sweetness. Cool, hydrating, and refreshingly pure — the ultimate summer indulgence.', '/images/collectionpage_hero/melonbottle.png', 199.00, 'Wellness', 'Young Coconut Water, Watermelon Juice, L-Citrulline, Sea Salt', NOW());

-- 2. Orange Coconut
INSERT INTO products (id, name, description, image_url, price, category, ingredients, created_at)
VALUES (2, 'Orange Coconut Elixir', 'A refreshing citrus-forward blend designed for daily vitality. Bursting with the brightness of sun-ripened oranges. Crisp, zesty, and refreshingly pure — a citrus celebration in every sip.', '/images/collectionpage_hero/orangebottle.png', 229.00, 'Energy', 'Young Coconut Water, Cold-Pressed Orange Juice, Camu Camu Extract, Vitamin C', NOW());

-- 3. Blueberry Coconut
INSERT INTO products (id, name, description, image_url, price, category, ingredients, created_at)
VALUES (3, 'Blueberry Coconut Elixir', 'A modern wellness blend combining berry antioxidants with coconut purity. Handpicked juicy blueberries bursting with sweet berry goodness. Rich, vibrant, refreshing — a fruity delight in every sip.', '/images/collectionpage_hero/blueberrybottle.png', 249.00, 'Balance', 'Young Coconut Water, Wild Blueberry Juice, L-Theanine, Elderberry', NOW());

-- 4. Lychee Coconut
INSERT INTO products (id, name, description, image_url, price, category, ingredients, created_at)
VALUES (4, 'Lychee Coconut Elixir', 'Elegant floral sweetness balanced with pure coconut hydration. Exotic sweet lychees picked for their delicate flavor. Floral, juicy, refreshing — a taste of paradise in every sip.', '/images/collectionpage_hero/lycheebottle.png', 229.00, 'Calm', 'Young Coconut Water, Organic Lychee Extract, White Tea Infusion, Zinc', NOW());

-- 5. Avocado Coconut
INSERT INTO products (id, name, description, image_url, price, category, ingredients, created_at)
VALUES (5, 'Avocado Coconut Elixir', 'A creamy functional blend supporting wellness and sustained energy. Creamy fresh avocados, naturally smooth and nourishing. Rich, velvety, satisfying — a wholesome treat in every sip.', '/images/collectionpage_hero/Avacadobottle.png', 249.00, 'Protein', 'Young Coconut Water, Avocado Oil Extract, MCTs, Plant Protein', NOW());

-- 6. Mango Coconut
INSERT INTO products (id, name, description, image_url, price, category, ingredients, created_at)
VALUES (6, 'Mango Coconut Elixir', 'Bright tropical sweetness crafted from young coconut water and ripe mango notes. Sun-kissed mangoes harvested at perfect ripeness. Luscious, smooth, and naturally sweet — sunshine in every bottle.', '/images/collectionpage_hero/mangobottle.png', 299.00, 'Dessert', 'Young Coconut Water, Natural Mango Purée, Vitamin C, Electrolytes', NOW());
