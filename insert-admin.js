const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function insertAdmin() {
  try {
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.adminUser.upsert({
      where: { id: '1' },
      update: {
        email: 'admin@techzone.com',
        username: 'admin',
        name: 'Super Admin',
        passwordHash: passwordHash,
        role: 'superadmin',
        permissions: ["dashboard","products","categories","orders","users","carts","ctas","carousel","home_categories","legal_content","admin_users"],
        active: true,
      },
      create: {
        id: '1',
        email: 'admin@techzone.com',
        username: 'admin',
        name: 'Super Admin',
        passwordHash: passwordHash,
        role: 'superadmin',
        permissions: ["dashboard","products","categories","orders","users","carts","ctas","carousel","home_categories","legal_content","admin_users"],
        active: true,
        createdAt: new Date('2024-01-01T00:00:00Z'),
      },
    });
    
    console.log('✅ Admin creado exitosamente:', admin.email);
    console.log('📧 Email: admin@techzone.com');
    console.log('🔑 Password: admin123');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

insertAdmin();
