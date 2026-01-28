# Configuración de Variables de Entorno AEX

## Paso 1: Configurar Variables de Entorno

Agrega las siguientes variables a tu archivo `.env.local`:

```bash
# Credenciales de AEX (nuevas)
AEX_CLAVE_PUBLICA=I8dm3y99YK8kgYus33UXBn9yLjN17C4P
AEX_CLAVE_PRIVADA=Usn2IMX3865JvmDYAR71zLDJqOdIJ172
AEX_CODIGO_SESION=12345

# Configuración de entorno (usar false para producción)
AEX_SANDBOX=false
```

## Paso 2: Verificar Configuración

Ejecuta el script de prueba para verificar que todo esté configurado correctamente:

```bash
node test-aex-config.js
```

## Paso 3: Probar API

Una vez configuradas, puedes probar el endpoint de cálculo:

```bash
# Iniciar el servidor
npm run dev

# Probar el endpoint en otra terminal
curl -X POST http://localhost:3000/api/aex/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "origin_ciudad": "Asunción",
    "destino_ciudad": "Ciudad del Este", 
    "peso": 1,
    "largo": 10,
    "ancho": 10,
    "alto": 10
  }'
```

## Cambios Realizados

1. **Actualización de tipos**: Agregado `codigo_sesion` a `AEXConfig`
2. **Configuración centralizada**: El código de sesión ahora se lee desde variables de entorno
3. **Autenticación actualizada**: Usa el código de sesión fijo "12345" en lugar de generarlo dinámicamente
4. **Endpoint actualizado**: `/api/aex/calculate` ahora usa la configuración centralizada

## Notas Importantes

- Las claves proporcionadas son para producción (AEX_SANDBOX=false)
- El código de sesión es "12345" según lo especificado en el ejemplo de Postman
- La URL base será: https://aex.com.py/api/v1/
- El hash MD5 se genera concatenando: `clave_privada + codigo_sesion`

## Estructura del Request de Autenticación

Según el ejemplo de Postman, el request debe tener esta estructura:

```json
{
  "clave_publica": "I8dm3y99YK8kgYus33UXBn9yLjN17C4P",
  "clave_privada": "[MD5_HASH]",
  "codigo_sesion": "12345"
}
```

Donde `[MD5_HASH]` es el hash MD5 de `Usn2IMX3865JvmDYAR71zLDJqOdIJ17212345`
