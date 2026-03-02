import { NextRequest, NextResponse } from 'next/server';

/**
 * @deprecated Este webhook está deprecado. 
 * La aplicación ahora usa Mercado Pago como proveedor de pagos.
 * Usa /api/webhooks/mercadopago en su lugar.
 * 
 * Este endpoint se mantiene temporalmente para compatibilidad,
 * pero retornará un error indicando que está deprecado.
 */
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'This webhook is deprecated. The application now uses Mercado Pago. Please use /api/webhooks/mercadopago instead.',
      deprecated: true 
    },
    { status: 410 } // 410 Gone - indica que el recurso ya no está disponible
  );
}
