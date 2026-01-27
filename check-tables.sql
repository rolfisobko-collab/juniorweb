-- Verificar si las tablas existen
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('Product', 'Category', 'SubCategory', 'ExchangeRate');

-- Si la tabla Product existe, mostrar algunos datos
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'Product'
) AS product_table_exists;

-- Si existe, mostrar cuántos productos hay
SELECT COUNT(*) as product_count 
FROM "Product";

-- Mostrar estructura de la tabla Product (si existe)
\d "Product";
