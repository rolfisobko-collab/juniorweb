-- Schema completo para Neon DB

-- Tabla ExchangeRate
CREATE TABLE IF NOT EXISTS "ExchangeRate" (
    "currency" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExchangeRate_pkey" PRIMARY KEY ("currency")
);

-- Tabla Product (si no existe)
CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryKey" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "reviews" INTEGER NOT NULL,
    "inStock" BOOLEAN NOT NULL,
    "stockQuantity" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "weight" DOUBLE PRECISION DEFAULT 0.5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- Crear índice para categoryKey
CREATE INDEX IF NOT EXISTS "Product_categoryKey_idx" ON "Product"("categoryKey");

-- Insertar tasas de cambio
INSERT INTO "ExchangeRate" ("currency", "rate")
VALUES 
('USD', 1.0),
('EUR', 0.92),
('ARS', 890.5),
('BRL', 4.95),
('MXN', 17.1),
('COP', 3875.0),
('CLP', 950.0),
('PEN', 3.78),
('UYU', 38.9)
ON CONFLICT ("currency") DO UPDATE SET "rate" = EXCLUDED."rate";

-- Insertar productos de ejemplo
INSERT INTO "Product" ("id", "name", "categoryKey", "price", "image", "description", "brand", "rating", "reviews", "inStock", "stockQuantity", "featured")
VALUES 
('electronics-1', 'iPhone 15 Pro', 'electronics', 999.99, 'https://res.cloudinary.com/dxibpzcfy/image/upload/v1704325678/juniorweb/products/iphone15.jpg', 'El iPhone más avanzado con chip A17 Pro y cámara de 48MP', 'Apple', 4.8, 245, true, 50, true),
('electronics-2', 'MacBook Air M2', 'electronics', 1299.99, 'https://res.cloudinary.com/dxibpzcfy/image/upload/v1704325678/juniorweb/products/macbook.jpg', 'Ligero y potente con chip M2, 18 horas de batería', 'Apple', 4.7, 189, true, 30, true),
('electronics-3', 'Samsung Galaxy S24', 'electronics', 899.99, 'https://res.cloudinary.com/dxibpzcfy/image/upload/v1704325678/juniorweb/products/galaxy.jpg', 'Smartphone Android con IA integrada', 'Samsung', 4.6, 156, true, 40, true),
('appliances-1', 'Refrigerador Samsung 450L', 'appliances', 899.99, 'https://res.cloudinary.com/dxibpzcfy/image/upload/v1704325678/juniorweb/products/fridge.jpg', 'Refrigerador con tecnología No Frost y eficiencia energética A+', 'Samsung', 4.5, 67, true, 15, false),
('appliances-2', 'Lavadora LG 8kg', 'appliances', 599.99, 'https://res.cloudinary.com/dxibpzcfy/image/upload/v1704325678/juniorweb/products/washer.jpg', 'Lavadora automática con tecnología Steam', 'LG', 4.3, 45, true, 20, false),
('appliances-3', 'Microondas Grill', 'appliances', 199.99, 'https://res.cloudinary.com/dxibpzcfy/image/upload/v1704325678/juniorweb/products/microwave.jpg', 'Microondas con función grill y convección', 'Whirlpool', 4.2, 23, true, 25, false),
('perfumes-1', 'Chanel N°5', 'perfumes', 149.99, 'https://res.cloudinary.com/dxibpzcfy/image/upload/v1704325678/juniorweb/products/chanel5.jpg', 'El perfume icónico de Chanel, elegancia atemporal', 'Chanel', 4.9, 523, true, 100, true),
('perfumes-2', 'Dior Sauvage', 'perfumes', 129.99, 'https://res.cloudinary.com/dxibpzcfy/image/upload/v1704325678/juniorweb/products/sauvage.jpg', 'Fragancia masculina intensa y fresca', 'Dior', 4.7, 234, true, 75, true),
('perfumes-3', 'YSL Libre', 'perfumes', 139.99, 'https://res.cloudinary.com/dxibpzcfy/image/upload/v1704325678/juniorweb/products/libre.jpg', 'Fragancia femenina floral y libre', 'Yves Saint Laurent', 4.6, 178, true, 60, true)
ON CONFLICT ("id") DO NOTHING;
