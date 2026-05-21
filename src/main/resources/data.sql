-- ═══════════════════════════════════════════════
-- AARWINS DATABASE SEED DATA
-- ═══════════════════════════════════════════════

-- Clear existing products to ensure the new premium 6 flavours are active
DELETE FROM products;

-- 1. Chocolate Coconut
INSERT INTO products (id, name, description, image_url, price, category, ingredients, created_at)
VALUES (1, 'Chocolate Coconut Wellness', 'A rich, indulgent fusion where the earthiness of raw cacao meets the silky sweetness of young coconut. Crafted for moments of calm restoration — a daily ritual reimagined as a luxury experience.', 'https://images.unsplash.com/photo-1625940952324-7091206f1574?q=80&w=600&auto=format&fit=crop', 3.99, 'Wellness', 'Young Coconut Water, Raw Cacao Extract, Coconut Nectar, Sea Salt', NOW());

-- 2. Coconut Coffee
INSERT INTO products (id, name, description, image_url, price, category, ingredients, created_at)
VALUES (2, 'Coconut Coffee Energy', 'Cold-extracted arabica meets the cooling clarity of pure young coconut water. A sophisticated pairing that delivers a sustained, clean energy — without the jitter. For the mindful go-getter.', 'https://images.unsplash.com/photo-1625940952324-7091206f1574?q=80&w=600&auto=format&fit=crop', 4.49, 'Energy', 'Coconut Water, Cold Brew Coffee Extract, Natural Caffeine, L-Theanine', NOW());

-- 3. Matcha Coconut
INSERT INTO products (id, name, description, image_url, price, category, ingredients, created_at)
VALUES (3, 'Matcha Coconut Balance', 'Ceremonial-grade matcha, dissolved in living coconut water and lightly sweetened with organic coconut sugar. A ritual of calm focus — the Japanese art of presence, distilled into a bottle.', 'https://images.unsplash.com/photo-1625940952324-7091206f1574?q=80&w=600&auto=format&fit=crop', 4.99, 'Balance', 'Coconut Water, Ceremonial Matcha, Organic Coconut Sugar, Chlorophyll', NOW());

-- 4. Lavender Coconut
INSERT INTO products (id, name, description, image_url, price, category, ingredients, created_at)
VALUES (4, 'Lavender Coconut Calm', 'Where botanical serenity meets tropical purity. Culinary lavender water fused with young coconut — a formula designed to soothe the nervous system as much as it nourishes the body. Evening ritual, perfected.', 'https://images.unsplash.com/photo-1625940952324-7091206f1574?q=80&w=600&auto=format&fit=crop', 4.49, 'Calm', 'Coconut Water, Culinary Lavender Extract, Chamomile Flower, Magnesium', NOW());

-- 5. Coconut Protein+
INSERT INTO products (id, name, description, image_url, price, category, ingredients, created_at)
VALUES (5, 'Coconut Protein+', 'Eleven grams of plant-sourced protein, suspended in the purest coconut water, elevated with vanilla bean and a trace of Himalayan salt. Performance nutrition, packaged in the language of luxury.', 'https://images.unsplash.com/photo-1625940952324-7091206f1574?q=80&w=600&auto=format&fit=crop', 4.99, 'Protein', 'Coconut Water, Plant-based Pea Protein, Organic Vanilla Bean, Himalayan Pink Salt', NOW());

-- 6. Coconut Churro
INSERT INTO products (id, name, description, image_url, price, category, ingredients, created_at)
VALUES (6, 'Coconut Churro Dessert', 'Sun-baked cinnamon and vanilla, softened by the lightness of young coconut. A celebration of tropical dessert culture — indulgent, joyful, and surprisingly clean.', 'https://images.unsplash.com/photo-1625940952324-7091206f1574?q=80&w=600&auto=format&fit=crop', 5.49, 'Dessert', 'Coconut Water, Cinnamon Bark Extract, Vanilla Bean, Organic Cane Sugar', NOW());
