// Script para crear categorías via API
const categories = [
  {
    name: "Electrónica",
    slug: "electronics",
    description: "Dispositivos electrónicos de última generación"
  },
  {
    name: "Electrodomésticos", 
    slug: "appliances",
    description: "Electrodomésticos para el hogar"
  },
  {
    name: "Perfumes",
    slug: "perfumes", 
    description: "Fragancias de lujo"
  }
];

const subcategories = [
  // Electrónica
  { categoryKey: "electronics", name: "Smartphones", slug: "smartphones" },
  { categoryKey: "electronics", name: "Laptops", slug: "laptops" },
  { categoryKey: "electronics", name: "Tablets", slug: "tablets" },
  { categoryKey: "electronics", name: "Auriculares", slug: "headphones" },
  { categoryKey: "electronics", name: "Smartwatches", slug: "smartwatches" },
  { categoryKey: "electronics", name: "Cámaras", slug: "cameras" },
  // Electrodomésticos
  { categoryKey: "appliances", name: "Refrigeradores", slug: "refrigerators" },
  { categoryKey: "appliances", name: "Lavadoras", slug: "washing-machines" },
  { categoryKey: "appliances", name: "Microondas", slug: "microwaves" },
  { categoryKey: "appliances", name: "Aspiradoras", slug: "vacuums" },
  // Perfumes
  { categoryKey: "perfumes", name: "Femeninos", slug: "women" },
  { categoryKey: "perfumes", name: "Masculinos", slug: "men" },
  { categoryKey: "perfumes", name: "Unisex", slug: "unisex" },
  { categoryKey: "perfumes", name: "Nicho", slug: "niche" },
];

async function createCategories() {
  console.log('Creando categorías...');
  
  for (const category of categories) {
    try {
      const response = await fetch('http://localhost:3000/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category)
      });
      
      if (response.ok) {
        console.log(`✅ Categoría creada: ${category.name}`);
      } else {
        console.log(`❌ Error creando ${category.name}:`, await response.text());
      }
    } catch (error) {
      console.log(`❌ Error de red creando ${category.name}:`, error.message);
    }
  }
  
  console.log('\nCreando subcategorías...');
  
  for (const sub of subcategories) {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/categories/${sub.categoryKey}/subcategories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: sub.name,
          slug: sub.slug
        })
      });
      
      if (response.ok) {
        console.log(`✅ Subcategoría creada: ${sub.name}`);
      } else {
        console.log(`❌ Error creando ${sub.name}:`, await response.text());
      }
    } catch (error) {
      console.log(`❌ Error de red creando ${sub.name}:`, error.message);
    }
  }
  
  console.log('\n✅ Proceso completado');
}

createCategories();
