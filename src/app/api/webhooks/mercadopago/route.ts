import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoServiceImpl } from '@/modules/subscriptions/infrastructure/mercadopago.service';
import { ProcessPaymentUseCase } from '@/modules/subscriptions/application/process-payment.use-case';
import { FirestoreSubscriptionRepository } from '@/modules/subscriptions/infrastructure/firestore-subscription.repository';

// Deshabilitar el body parser para poder obtener el rawBody
export const runtime = 'nodejs';

/**
 * Webhook handler para Mercado Pago
 * Mercado Pago envía notificaciones cuando cambia el estado de un pago
 * Tipos de eventos: payment, merchant_order, etc.
 */
export async function POST(request: NextRequest) {
  try {
    // Obtener el raw body para verificar la firma
    const body = await request.text();
    const signature = request.headers.get('x-signature');
    const requestId = request.headers.get('x-request-id');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing x-signature header' },
        { status: 400 }
      );
    }

    // Inicializar servicios
    const mercadoPagoService = new MercadoPagoServiceImpl();
    const subscriptionRepository = new FirestoreSubscriptionRepository();
    const processPaymentUseCase = new ProcessPaymentUseCase(
      subscriptionRepository
    );

    // Verificar y construir el evento de Mercado Pago
    let event;
    try {
      event = mercadoPagoService.constructEvent(body, signature);
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Mercado Pago envía diferentes tipos de notificaciones
    // El tipo viene en el campo "type" del payload
    // Tipos comunes: payment, merchant_order, subscription, etc.
    const notificationType = event.type;

    // Procesar notificaciones de pago
    if (notificationType === 'payment') {
      // Mercado Pago puede enviar el objeto completo o solo el ID
      // Si viene solo el ID, necesitaríamos hacer una llamada a la API para obtener los detalles
      // Por ahora, asumimos que viene el objeto completo en event.data
      const payment = event.data || event;

      // Verificar que el pago esté aprobado
      if (payment.status === 'approved' || payment.status === 'authorized') {
        // Mercado Pago almacena external_reference en el payment
        // Este campo se establece cuando creamos la Preference con external_reference
        const externalReference = payment.external_reference;

        if (externalReference) {
          // Si usamos external_reference, debe estar en formato: userId_courseId
          const [userId, courseId] = externalReference.split('_');

          if (!userId || !courseId) {
            console.error('Invalid external_reference format');
            return NextResponse.json(
              { error: 'Invalid external_reference format' },
              { status: 400 }
            );
          }

          // Procesar el pago y crear la suscripción
          await processPaymentUseCase.execute(userId, courseId);

          return NextResponse.json({ received: true, status: 'processed' });
        } else {
          // Si no hay external_reference, intentar obtener de metadata de la preference
          // Esto requeriría hacer una llamada adicional a la API de Mercado Pago
          console.warn('No external_reference found, payment may need manual processing');
          return NextResponse.json({ received: true, status: 'pending' });
        }
      } else {
        // Pago no aprobado, solo confirmar recepción
        console.log(`Payment ${payment.id} status: ${payment.status}`);
        return NextResponse.json({ received: true, status: 'not_approved' });
      }
    }

    // Otros tipos de notificaciones pueden ser manejados aquí
    // Por ejemplo: merchant_order, subscription, etc.
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing Mercado Pago webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
