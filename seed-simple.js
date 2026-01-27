const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

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

const adminUsers = [
  {
    id: "1",
    email: "admin@techzone.com",
    username: "admin",
    name: "Super Admin",
    password: "admin123",
    role: "superadmin",
    permissions: ["dashboard","products","categories","orders","users","carts","ctas","carousel","home_categories","legal_content","admin_users"],
    active: true,
    createdAt: "2024-01-01T00:00:00Z",
  }
];

async function main() {
  try {
    // Crear admin users
    for (const au of adminUsers) {
      const passwordHash = await bcrypt.hash(au.password, 10);
      await prisma.adminUser.upsert({
        where: { id: au.id },
        update: {
          email: au.email,
          username: au.username,
          name: au.name,
          passwordHash,
          role: au.role,
          permissions: au.permissions,
          active: au.active,
          lastLogin: au.lastLogin ? new Date(au.lastLogin) : null,
        },
        create: {
          id: au.id,
          email: au.email,
          username: au.username,
          name: au.name,
          passwordHash,
          role: au.role,
          permissions: au.permissions,
          active: au.active,
          createdAt: new Date(au.createdAt),
          lastLogin: au.lastLogin ? new Date(au.lastLogin) : null,
        },
      });
    }

    // Crear categorías
    for (const c of categories) {
      await prisma.category.upsert({
        where: { key: c.slug },
        update: {
          name: c.name,
          slug: c.slug,
          description: c.description ?? null,
        },
        create: {
          key: c.slug,
          name: c.name,
          slug: c.slug,
          description: c.description ?? null,
        },
      });

      for (const sc of c.subcategories ?? []) {
        const id = sc.id ?? `${c.slug}-${sc.slug}`;
        await prisma.subCategory.upsert({
          where: {
            categoryKey_slug: {
              categoryKey: c.slug,
              slug: sc.slug,
            },
          },
          update: {
            id,
            name: sc.name,
          },
          create: {
            id,
            name: sc.name,
            slug: sc.slug,
            categoryKey: c.slug,
          },
        });
      }
    }

    console.log('✅ Seed completado exitosamente');
    console.log('📧 Admin: admin@techzone.com / admin123');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
