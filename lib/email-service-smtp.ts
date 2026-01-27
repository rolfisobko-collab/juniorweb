import nodemailer from 'nodemailer'

// Configuración para Gmail (puedes usar cualquier email)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // tu-email@gmail.com
    pass: process.env.EMAIL_PASS  // contraseña de aplicación
  }
})

export async function sendVerificationEmailSMTP(email: string, code: string) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verifica tu email - TechZone</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 40px; border-radius: 0 0 10px 10px; }
        .code { background: #fff; border: 2px dashed #667eea; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 30px 0; border-radius: 8px; color: #667eea; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🚀 TechZone</h1>
        <p>Verifica tu dirección de email</p>
      </div>
      <div class="content">
        <h2>¡Bienvenido a TechZone!</h2>
        <p>Usa este código para verificar tu email:</p>
        <div class="code">${code}</div>
        <p><strong>Este código expira en 15 minutos.</strong></p>
        <p>Si no solicitaste este código, ignora este email.</p>
        <div class="footer">
          <p>© 2024 TechZone</p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🔐 Verifica tu email - TechZone',
      html: htmlContent,
    })
    
    return { success: true, messageId: `smtp_${Date.now()}` }
  } catch (error) {
    console.error('SMTP Email Error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
