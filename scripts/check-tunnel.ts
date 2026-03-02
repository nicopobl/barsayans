#!/usr/bin/env tsx

/**
 * Script de ayuda para verificar la configuración del túnel ngrok
 * 
 * Este script verifica que:
 * 1. La variable NEXT_PUBLIC_APP_URL esté configurada
 * 2. La URL coincida con la URL de ngrok (si está en uso)
 * 3. La URL de webhook esté correctamente configurada
 */

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const webhookUrl = `${appUrl}/api/webhooks/mercadopago`;

console.log('\n🔍 Verificación de Configuración de Túnel ngrok\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log(`📍 URL de la aplicación: ${appUrl}`);
console.log(`🔗 URL del webhook: ${webhookUrl}\n`);

// Verificar si es localhost
if (appUrl.includes('localhost') || appUrl.includes('127.0.0.1')) {
  console.log('⚠️  ADVERTENCIA: Estás usando localhost\n');
  console.log('📋 Para que Mercado Pago pueda enviar webhooks, necesitas:');
  console.log('   1. Ejecutar: npm run tunnel (o ngrok http 3000)');
  console.log('   2. Copiar la URL de ngrok (ej: https://abc123.ngrok-free.app)');
  console.log('   3. Actualizar NEXT_PUBLIC_APP_URL en .env.local con la URL de ngrok');
  console.log('   4. Configurar la misma URL en el panel de Mercado Pago\n');
} else if (appUrl.includes('ngrok')) {
  console.log('✅ Detectada URL de ngrok\n');
  console.log('📋 Asegúrate de que:');
  console.log(`   1. La URL ${appUrl} coincida con la URL mostrada por ngrok`);
  console.log(`   2. La URL de notificaciones en Mercado Pago sea: ${webhookUrl}`);
  console.log('   3. El túnel ngrok esté activo mientras desarrollas\n');
} else {
  console.log('✅ URL de producción detectada\n');
  console.log('📋 Esta configuración es para producción.');
  console.log(`   Webhook configurado en: ${webhookUrl}\n`);
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
