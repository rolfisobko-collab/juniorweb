const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categories = [
  {
    key: "electronics",
    name: "Electrónica",
    slug: "electronics",
    description: "Dispositivos electrónicos de última generación",
    subcategories: [
      { id: "electronics-smartphones", name: "Smartphones", slug: "smartphones" },
      { id: "electronics-laptops", name: "Laptops", slug: "laptops" },
      { id: "electronics-tablets", name: "Tablets", slug: "tablets" },
      { id: "electronics-headphones", name: "Auriculares", slug: "headphones" },
      { id: "electronics-smartwatches", name: "Smartwatches", slug: "smartwatches" },
      { id: "electronics-cameras", name: "Cámaras", slug: "cameras" },
    ]
  },
  {
    key: "appliances",
    name: "Electrodomésticos",
    slug: "appliances",
    description: "Electrodomésticos para el hogar",
    subcategories: [
      { id: "appliances-refrigerators", name: "Refrigeradores", slug: "refrigerators" },
      { id: "appliances-washing-machines", name: "Lavadoras", slug: "washing-machines" },
      { id: "appliances-microwaves", name: "Microondas", slug: "microwaves" },
      { id: "appliances-vacuums", name: "Aspiradoras", slug: "vacuums" },
    ]
  },
  {
    key: "perfumes",
    name: "Perfumes",
    slug: "perfumes",
    description: "Fragancias de lujo",
    subcategories: [
      { id: "perfumes-women", name: "Femeninos", slug: "women" },
      { id: "perfumes-men", name: "Masculinos", slug: "men" },
      { id: "perfumes-unisex", name: "Unisex", slug: "unisex" },
      { id: "perfumes-niche", name: "Nicho", slug: "niche" },
    ]
  }
];

async function createCategories() {
  try {
    for (const category of categories) {
      await prisma.category.upsert({
        where: { key: category.key },
        update: {
          name: category.name,
          slug: category.slug,
          description: category.description,
        },
        create: {
          key: category.key,
          name: category.name,
          slug: category.slug,
          description: category.description,
        },
      });

      for (const sub of category.subcategories) {
        await prisma.subCategory.upsert({
          where: {
            categoryKey_slug: {
              categoryKey: category.key,
              slug: sub.slug,
            },
          },
          update: {
            id: sub.id,
            name: sub.name,
          },
          create: {
            id: sub.id,
            name: sub.name,
            slug: sub.slug,
            categoryKey: category.key,
          },
        });
      }
    }
    
    console.log('✅ Categorías creadas exitosamente');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createCategories();
