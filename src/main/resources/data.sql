-- ═══════════════════════════════════════════════
-- AARWINS DATABASE SEED DATA
-- ═══════════════════════════════════════════════

-- Clear existing products
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

-- ----------------------------------------------------
-- Seed User Profile
-- ----------------------------------------------------
DELETE FROM users;
INSERT INTO users (id, first_name, last_name, email, phone, dob, gender, password, role, reward_points)
VALUES (1, 'Arjun', 'Mehra', 'arjun.mehra@example.com', '+91 98765 43210', '1993-03-15', 'male', 'password123', 'USER', 840);

-- ----------------------------------------------------
-- Seed Addresses
-- ----------------------------------------------------
DELETE FROM addresses;
INSERT INTO addresses (id, full_name, phone, flat_house, area_street, landmark, city, state, pincode, country, address_type, is_default, user_id)
VALUES (1, 'Arjun Mehra', '+91 98765 43210', '24, Orchid Villa', 'Palm Grove Lane', 'Near Rose Garden', 'Coimbatore', 'Tamil Nadu', '641001', 'IN', 'Home', true, 1);

INSERT INTO addresses (id, full_name, phone, flat_house, area_street, landmark, city, state, pincode, country, address_type, is_default, user_id)
VALUES (2, 'Priya Mehra', '+91 91234 56789', '7B, Lotus Heights', 'MG Road', 'Opposite Metro Station', 'Chennai', 'Tamil Nadu', '600032', 'IN', 'Work', false, 1);

-- ----------------------------------------------------
-- Seed Wishlist
-- ----------------------------------------------------
DELETE FROM wishlist_items;
INSERT INTO wishlist_items (id, user_id, product_id) VALUES (1, 1, 1);
INSERT INTO wishlist_items (id, user_id, product_id) VALUES (2, 1, 3);
INSERT INTO wishlist_items (id, user_id, product_id) VALUES (3, 1, 6);

-- ----------------------------------------------------
-- Seed Payment Methods
-- ----------------------------------------------------
DELETE FROM payment_methods;
INSERT INTO payment_methods (id, card_number, cardholder_name, expiry_date, card_type, is_default, user_id)
VALUES (1, '**** **** **** 4111', 'Arjun Mehra', '12/28', 'Visa', true, 1);

INSERT INTO payment_methods (id, card_number, cardholder_name, expiry_date, card_type, is_default, user_id)
VALUES (2, '**** **** **** 5222', 'Arjun Mehra', '08/29', 'Mastercard', false, 1);

-- ----------------------------------------------------
-- Seed Notification Preferences
-- ----------------------------------------------------
DELETE FROM notification_preferences;
INSERT INTO notification_preferences (id, email_newsletter, order_updates, sms_promotions, user_id)
VALUES (1, true, true, false, 1);

-- ----------------------------------------------------
-- Seed Orders
-- ----------------------------------------------------
DELETE FROM order_items;
DELETE FROM orders;

-- Order 1: Delivered
INSERT INTO orders (id, order_number, order_date, amount, status, payment_method, user_id)
VALUES (1, 'AWN-20260581', '2026-06-05 14:30:00', 747.00, 'Delivered', 'UPI Payment', 1);

INSERT INTO order_items (id, order_id, product_id, quantity, price)
VALUES (1, 1, 6, 1, 299.00); -- Mango Coconut @ 299

INSERT INTO order_items (id, order_id, product_id, quantity, price)
VALUES (2, 1, 3, 1, 249.00); -- Blueberry Coconut @ 249

INSERT INTO order_items (id, order_id, product_id, quantity, price)
VALUES (3, 1, 1, 1, 199.00); -- Watermelon Coconut @ 199


-- Order 2: Shipped
INSERT INTO orders (id, order_number, order_date, amount, status, payment_method, user_id)
VALUES (2, 'AWN-20260574', '2026-06-01 10:15:00', 498.00, 'Shipped', 'Cash on Delivery (COD)', 1);

INSERT INTO order_items (id, order_id, product_id, quantity, price)
VALUES (4, 2, 3, 2, 249.00); -- 2 x Blueberry Coconut @ 249


-- Order 3: Processing
INSERT INTO orders (id, order_number, order_date, amount, status, payment_method, user_id)
VALUES (3, 'AWN-20260591', '2026-06-08 19:45:00', 1026.00, 'Processing', 'Credit Card', 1);

INSERT INTO order_items (id, order_id, product_id, quantity, price)
VALUES (5, 3, 6, 2, 299.00); -- 2 x Mango Coconut @ 299

INSERT INTO order_items (id, order_id, product_id, quantity, price)
VALUES (6, 3, 2, 1, 229.00); -- Orange Coconut @ 229

INSERT INTO order_items (id, order_id, product_id, quantity, price)
VALUES (7, 3, 1, 1, 199.00); -- Watermelon Coconut @ 199
