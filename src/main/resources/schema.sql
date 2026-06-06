-- ═══════════════════════════════════════════════
-- AARWINS DATABASE SCHEMA INITIALIZATION
-- ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    ingredients TEXT,
    created_at TIMESTAMP
);
