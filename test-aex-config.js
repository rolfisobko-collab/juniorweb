// Script para probar la configuración de AEX
// Ejecutar con: node test-aex-config.js

// Cargar variables de entorno desde .env.local
require('dotenv').config({ path: '.env.local' });

const { getAEXConfig, validateAEXEnvironment } = require('./lib/aex/config');

console.log('🔍 Verificando configuración de AEX...\n');

// Validar variables de entorno
const validation = validateAEXEnvironment();

if (!validation.valid) {
  console.error('❌ Variables de entorno faltantes:');
  validation.missing.forEach(missing => console.error(`  - ${missing}`));
  process.exit(1);
}

console.log('✅ Variables de entorno configuradas correctamente\n');

// Obtener configuración
try {
  const config = getAEXConfig();
  
  console.log('📋 Configuración actual:');
  console.log(`  - Sandbox: ${config.sandbox}`);
  console.log(`  - Clave Pública: ${config.clave_publica.substring(0, 8)}...`);
  console.log(`  - Clave Privada: ${config.clave_privada.substring(0, 8)}...`);
  console.log(`  - Código Sesión: ${config.codigo_sesion}`);
  console.log(`  - Base URL: ${config.base_url}`);
  
  console.log('\n✅ Configuración cargada exitosamente');
  
  // Probar autenticación básica
  console.log('\n🔐 Probando autenticación...');
  const crypto = require('crypto');
  
  const clavePrivadaHash = crypto
    .createHash('md5')
    .update(config.clave_privada + config.codigo_sesion)
    .digest('hex');
  
  console.log(`  - Hash generado: ${clavePrivadaHash.substring(0, 8)}...`);
  console.log('✅ Hash MD5 generado correctamente');
  
} catch (error) {
  console.error('❌ Error cargando configuración:', error.message);
  process.exit(1);
}

console.log('\n🎉 Todo está listo para usar AEX!');
