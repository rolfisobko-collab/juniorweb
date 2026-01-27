-- Agregar el campo weight que falta en la tabla Product
ALTER TABLE "Product" 
ADD COLUMN "weight" FLOAT DEFAULT 0.5;

-- Verificar que se agregó correctamente
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'Product' AND column_name = 'weight';
