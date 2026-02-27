# Configuración de Variables de Entorno

## Pasos para configurar el proyecto

1. **Copia el archivo de ejemplo:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Genera un NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```
   Copia el resultado y pégalo en `NEXTAUTH_SECRET` en tu `.env.local`

3. **Configura las variables requeridas:**

   ### NextAuth (Requerido)
   - `NEXTAUTH_URL`: URL de tu aplicación (http://localhost:3000 para desarrollo)
   - `NEXTAUTH_SECRET`: Secret generado con openssl (ver paso 2)

   ### AWS Cognito (Requerido para autenticación)
   - `COGNITO_CLIENT_ID`: ID del cliente de Cognito
   - `COGNITO_CLIENT_SECRET`: Secret del cliente de Cognito
   - `COGNITO_ISSUER`: URL del issuer de Cognito (formato: https://cognito-idp.{region}.amazonaws.com/{userPoolId})

   ### AWS (Requerido)
   - `AWS_REGION`: Región de AWS (ej: us-east-1)
   - `AWS_ACCESS_KEY_ID`: Access Key de AWS
   - `AWS_SECRET_ACCESS_KEY`: Secret Key de AWS

   ### DynamoDB (Requerido)
   - `DYNAMODB_SUBSCRIPTIONS_TABLE`: Nombre de la tabla de suscripciones
   - `DYNAMODB_COURSES_TABLE`: Nombre de la tabla de cursos

   ### S3 (Requerido)
   - `S3_BUCKET_NAME`: Nombre del bucket de S3 para videos

   ### Stripe (Requerido para pagos)
   - `STRIPE_SECRET_KEY`: Secret key de Stripe
   - `STRIPE_WEBHOOK_SECRET`: Webhook secret de Stripe
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Publishable key de Stripe

   ### Admin (Requerido para panel de administración)
   - `ADMIN_EMAILS`: Emails de administradores separados por comas (ej: admin@barsayans.com,otro@barsayans.com)

   ### App URL (Opcional)
   - `NEXT_PUBLIC_APP_URL`: URL pública de la aplicación (default: http://localhost:3000)

## Solución de problemas

### Error: [next-auth][error][NO_SECRET]
**Solución:** Asegúrate de tener `NEXTAUTH_SECRET` en tu `.env.local` y reinicia el servidor de desarrollo.

### Error: [next-auth][warn][NEXTAUTH_URL]
**Solución:** Agrega `NEXTAUTH_URL=http://localhost:3000` a tu `.env.local` y reinicia el servidor.

### Error: Configuration
**Solución:** Verifica que todas las variables de Cognito estén correctamente configuradas.

## Notas

- El archivo `.env.local` está en `.gitignore` y no se subirá al repositorio
- Nunca compartas tus secrets públicamente
- Para producción, configura estas variables en tu plataforma de hosting (Vercel, AWS, etc.)
