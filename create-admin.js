const bcrypt = require('bcryptjs');

// Simulación simple para crear admin
async function createAdmin() {
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  console.log('=== CUENTA ADMIN CREADA ===');
  console.log('Email: admin@techzone.com');
  console.log('Password: admin123');
  console.log('Hashed Password:', hashedPassword);
  console.log('');
  console.log('Ejecutá este SQL en tu BD:');
  console.log(`INSERT INTO "AdminUser" (id, email, username, name, passwordHash, role, permissions, active, createdAt) VALUES ('1', 'admin@techzone.com', 'admin', 'Super Admin', '${hashedPassword}', 'superadmin', '["dashboard","products","categories","orders","users","carts","ctas","carousel","home_categories","legal_content","admin_users"]', true, '2024-01-01T00:00:00Z');`);
}

createAdmin().catch(console.error);
