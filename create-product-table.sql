-- Crear tabla Product
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

-- Insertar algunos productos de ejemplo
INSERT INTO "Product" ("id", "name", "categoryKey", "price", "image", "description", "brand", "rating", "reviews", "inStock", "stockQuantity", "featured")
VALUES 
('electronics-1', 'iPhone 15 Pro', 'electronics', 999.99, 'https://res.cloudinary.com/dxibpzcfy/image/upload/v1704325678/juniorweb/products/iphone15.jpg', 'El iPhone más avanzado con chip A17 Pro', 'Apple', 4.8, 245, true, 50, true),
('electronics-2', 'MacBook Air M2', 'electronics', 1299.99, 'https://res.cloudinary.com/dxibpzcfy/image/upload/v1704325678/juniorweb/products/macbook.jpg', 'Ligero y potente con chip M2', 'Apple', 4.7, 189, true, 30, true),
('appliances-1', 'Refrigerador Samsung 450L', 'appliances', 899.99, 'https://res.cloudinary.com/dxibpzcfy/image/upload/v1704325678/juniorweb/products/fridge.jpg', 'Refrigerador con tecnología No Frost', 'Samsung', 4.5, 67, true, 15, false),
('appliances-2', 'Lavadora LG 8kg', 'appliances', 599.99, 'https://res.cloudinary.com/dxibpzcfy/image/upload/v1704325678/juniorweb/products/washer.jpg', 'Lavadora automática de 8kg', 'LG', 4.3, 45, true, 20, false),
('perfumes-1', 'Chanel N°5', 'perfumes', 149.99, 'https://res.cloudinary.com/dxibpzcfy/image/upload/v1704325678/juniorweb/products/chanel5.jpg', 'El perfume icónico de Chanel', 'Chanel', 4.9, 523, true, 100, true),
('perfumes-2', 'Dior Sauvage', 'perfumes', 129.99, 'https://res.cloudinary.com/dxibpzcfy/image/upload/v1704325678/juniorweb/products/sauvage.jpg', 'Fragancia masculina intensa', 'Dior', 4.7, 234, true, 75, true)
ON CONFLICT ("id") DO NOTHING;
