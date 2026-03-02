This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Configuración de Webhooks con ngrok

Para desarrollo local, los webhooks de Mercado Pago requieren un túnel público. Usa ngrok:

1. **Instala ngrok:**
   ```bash
   # macOS
   brew install ngrok
   
   # O descarga desde https://ngrok.com/download
   ```

2. **Inicia el túnel:**
   ```bash
   npm run tunnel
   ```

3. **Copia la URL de ngrok** y actualiza `.env.local`:
   ```env
   NEXT_PUBLIC_APP_URL=https://tu-url-ngrok.ngrok-free.app
   ```

4. **Configura el webhook en Mercado Pago:**
   - URL: `https://tu-url-ngrok.ngrok-free.app/api/webhooks/mercadopago`

5. **Verifica la configuración:**
   ```bash
   npm run check-tunnel
   ```

Para más detalles, ver [scripts/README.md](./scripts/README.md).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
