import { Resend } from 'resend'

const resend = new Resend('re_FkLRGgG3_JB2LVuZKFY1H7cXKxjZG2yWG')

export async function sendVerificationEmail(email: string, code: string) {
  console.log('🚀 Starting email send process...')
  console.log('📧 Original email:', email)
  console.log('🔢 Code:', code)
  
  // Siempre enviar al email real del usuario
  const targetEmail = email
  console.log('📬 Target email:', targetEmail)
  console.log('🔑 API Key exists:', !!process.env.RESEND_API_KEY || 'Using hardcoded key')
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verifica tu email - TechZone</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 40px;
          border-radius: 0 0 10px 10px;
        }
        .code {
          background: #fff;
          border: 2px dashed #667eea;
          padding: 20px;
          text-align: center;
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          margin: 30px 0;
          border-radius: 8px;
          color: #667eea;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #666;
          font-size: 14px;
        }
        .button {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🚀 TechZone</h1>
        <p>Verifica tu dirección de email</p>
      </div>
      
      <div class="content">
        <h2>¡Bienvenido a TechZone!</h2>
        <p>Gracias por registrarte. Para completar tu registro, por favor verifica tu dirección de email usando el siguiente código:</p>
        
        <div class="code">${code}</div>
        
        <p><strong>Este código expirará en 15 minutos.</strong></p>
        
        <p>Si no solicitaste este código, puedes ignorar este email de forma segura.</p>
        
        <div class="footer">
          <p>© 2024 TechZone - Tu tienda de tecnología de confianza</p>
          <p>Este es un email automático, por favor no respondas a este mensaje.</p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    console.log('📤 Preparing to send email via Resend...')
    console.log('📋 Email data:', {
      from: 'noreply@tu-dominio.com',
      to: [targetEmail],
      subject: '🔐 Verifica tu email - TechZone'
    })

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [targetEmail],
      subject: '🔐 Verifica tu email - TechZone',
      html: htmlContent,
    })

    console.log('📬 Resend response received:')
    console.log('✅ Data:', data)
    console.log('❌ Error:', error)

    if (error) {
      console.error('Error sending email with Resend:', error)
      return { success: false, error: error.message }
    }

    console.log('Email sent successfully with Resend!', data)
    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
