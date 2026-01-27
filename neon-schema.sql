-- Schema para Neon DB
-- Crear tablas básicas para categorías y admin

CREATE TABLE IF NOT EXISTS "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "permissions" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLogin" TIMESTAMP(3),

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Category" (
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("key")
);

CREATE TABLE IF NOT EXISTS "SubCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id")
);

-- Crear admin user
INSERT INTO "AdminUser" ("id", "email", "username", "name", "passwordHash", "role", "permissions", "active", "createdAt")
VALUES 
('1', 'admin@techzone.com', 'admin', 'Super Admin', '$2b$10$8toYudk5RCMqJLLByC2a9uSwk5zAmt9jai.bt92/E1mm0So9RGBPK', 'superadmin', '["dashboard","products","categories","orders","users","carts","ctas","carousel","home_categories","legal_content","admin_users"]', true, '2024-01-01 00:00:00')
ON CONFLICT ("id") DO NOTHING;

-- Crear categorías
INSERT INTO "Category" ("key", "name", "slug", "description")
VALUES 
('electronics', 'Electrónica', 'electronics', 'Dispositivos electrónicos de última generación'),
('appliances', 'Electrodomésticos', 'appliances', 'Electrodomésticos para el hogar'),
('perfumes', 'Perfumes', 'perfumes', 'Fragancias de lujo')
ON CONFLICT ("key") DO NOTHING;

-- Crear subcategorías
INSERT INTO "SubCategory" ("id", "name", "slug", "categoryKey")
VALUES 
-- Electrónica
('electronics-smartphones', 'Smartphones', 'smartphones', 'electronics'),
('electronics-laptops', 'Laptops', 'laptops', 'electronics'),
('electronics-tablets', 'Tablets', 'tablets', 'electronics'),
('electronics-headphones', 'Auriculares', 'headphones', 'electronics'),
('electronics-smartwatches', 'Smartwatches', 'smartwatches', 'electronics'),
('electronics-cameras', 'Cámaras', 'cameras', 'electronics'),
-- Electrodomésticos
('appliances-refrigerators', 'Refrigeradores', 'refrigerators', 'appliances'),
('appliances-washing-machines', 'Lavadoras', 'washing-machines', 'appliances'),
('appliances-microwaves', 'Microondas', 'microwaves', 'appliances'),
('appliances-vacuums', 'Aspiradoras', 'vacuums', 'appliances'),
-- Perfumes
('perfumes-women', 'Femeninos', 'women', 'perfumes'),
('perfumes-men', 'Masculinos', 'men', 'perfumes'),
('perfumes-unisex', 'Unisex', 'unisex', 'perfumes'),
('perfumes-niche', 'Nicho', 'niche', 'perfumes')
ON CONFLICT ("id") DO NOTHING;
