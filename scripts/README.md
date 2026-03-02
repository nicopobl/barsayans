# Scripts de Utilidad

## Configuración de ngrok para Webhooks de Mercado Pago

Mercado Pago requiere que los webhooks sean accesibles desde internet. Para desarrollo local, necesitas usar ngrok para crear un túnel seguro.

### Instalación de ngrok

#### macOS (usando Homebrew)
```bash
brew install ngrok
```

#### Windows/Linux
Descarga el binario desde [ngrok.com](https://ngrok.com/download) y agrégalo a tu PATH.

### Uso

1. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

2. **En otra terminal, inicia el túnel ngrok:**
   ```bash
   npm run tunnel
   ```
   
   O directamente:
   ```bash
   ngrok http 3000
   ```

3. **Copia la URL de ngrok** (ejemplo: `https://abc123.ngrok-free.app`)

4. **Actualiza tu `.env.local`:**
   ```env
   NEXT_PUBLIC_APP_URL=https://abc123.ngrok-free.app
   ```

5. **Configura el webhook en Mercado Pago:**
   - Ve al panel de Mercado Pago
   - Configura la URL de notificaciones: `https://abc123.ngrok-free.app/api/webhooks/mercadopago`
   - Asegúrate de que coincida exactamente con `NEXT_PUBLIC_APP_URL`

6. **Verifica la configuración:**
   ```bash
   npm run check-tunnel
   ```

### Notas Importantes

- ⚠️ **La URL de ngrok cambia cada vez que reinicias ngrok** (a menos que uses un plan de pago)
- 🔄 **Recuerda actualizar** `NEXT_PUBLIC_APP_URL` y la URL en el panel de Mercado Pago cada vez que reinicies ngrok
- 🔒 **El middleware ya está configurado** para permitir peticiones desde ngrok a `/api/webhooks`
- 📝 **Los logs del servicio** mostrarán la URL del webhook configurada cuando crees una Preference

### Solución de Problemas

Si los webhooks no llegan:
1. Verifica que ngrok esté corriendo: `npm run check-tunnel`
2. Verifica que `NEXT_PUBLIC_APP_URL` coincida con la URL de ngrok
3. Verifica que la URL en el panel de Mercado Pago sea exactamente: `{NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`
4. Revisa los logs del servidor para ver la URL configurada
