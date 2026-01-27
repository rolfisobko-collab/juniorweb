# Configuración de Email para TechZone

## OPCIÓN 1: Gmail SMTP (GRATIS y recomendado)

### Paso 1: Configurar cuenta de Google
1. Ve a tu cuenta de Google: myaccount.google.com
2. Activa "Verificación en dos pasos"
3. Ve a "Contraseñas de aplicaciones"
4. Crea una nueva contraseña de aplicación:
   - Nombre: "TechZone App"
   - Copia la contraseña generada (ej: abcd efgh ijkl mnop)

### Paso 2: Variables de entorno
Crea un archivo `.env.local`:

```bash
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=abcd-efgh-ijkl-mnop
```

### Proveedores SMTP compatibles:
- **Gmail**: smtp.gmail.com:587
- **Outlook**: smtp-mail.outlook.com:587  
- **Yahoo**: smtp.mail.yahoo.com:587
- **ProtonMail**: mail.protonmail.com:587

## OPCIÓN 2: SendGrid (Gratis hasta 100 emails/día)

1. Regístrate en sendgrid.com
2. Verifica tu email
3. Obtén API Key
4. Configura variables:
```bash
SENDGRID_API_KEY=SG.xxxxx
```

## OPCIÓN 3: Mailgun (Gratis hasta 1000 emails/mes)

1. Regístrate en mailgun.com
2. Verifica dominio (puedes usar dominio temporal)
3. Obtén API Key

## OPCIÓN 4: Resend con dominio propio

1. Compra dominio (.com ~$10/año)
2. Ve a resend.com/domains
3. Agrega dominio y verifica DNS
4. Cambia `from` en el código

## Flujo automático del sistema:

1. **Intenta SMTP** (si está configurado)
2. **Intenta Resend** (si SMTP falla)  
3. **Usa Fallback** (si todo falla)

## Para producción YA:

```bash
# Configura Gmail SMTP y listo
npm run build
npm start
```

**Recomendación:** Usa Gmail SMTP, es gratis, confiable y no requiere dominio.
