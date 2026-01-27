// Email service temporal para producción - fallback cuando Resend falla
export async function sendVerificationEmailFallback(email: string, code: string) {
  console.log('📧 FALLBACK EMAIL - Simulating email send...')
  console.log('📧 Email would be sent to:', email)
  console.log('🔢 Verification code:', code)
  
  // En producción, podrías:
  // 1. Guardar en base de datos logs de emails enviados
  // 2. Usar un servicio alternativo (SendGrid, Mailgun, etc.)
  // 3. Mostrar el código en la interfaz (solo para desarrollo/testing)
  
  return { 
    success: true, 
    messageId: `fallback_${Date.now()}`,
    method: 'fallback',
    code: code // Devolver el código para mostrarlo si es necesario
  }
}
