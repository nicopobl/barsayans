import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoServiceImpl } from '@/modules/subscriptions/infrastructure/mercadopago.service';
import { ProcessPaymentUseCase } from '@/modules/subscriptions/application/process-payment.use-case';
import { FirestoreSubscriptionRepository } from '@/modules/subscriptions/infrastructure/firestore-subscription.repository';

export const runtime = 'nodejs';

/**
 * Webhook handler para Mercado Pago
 * En lugar de verificar la firma (que varía según el canal de notificación),
 * usamos el payment ID para consultar la API de MP directamente.
 * Este es el patrón recomendado por MercadoPago.
 */
export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const topic = url.searchParams.get('topic') || url.searchParams.get('type');

    // Ignorar notificaciones que no sean de pago
    if (topic !== 'payment') {
      return NextResponse.json({ received: true });
    }

    const paymentId = url.searchParams.get('data.id') || url.searchParams.get('id');
    if (!paymentId) {
      return NextResponse.json({ error: 'Missing payment id' }, { status: 400 });
    }

    const mercadoPagoService = new MercadoPagoServiceImpl();
    const subscriptionRepository = new FirestoreSubscriptionRepository();
    const processPaymentUseCase = new ProcessPaymentUseCase(subscriptionRepository);

    // Consultar el pago directamente en la API de MP para verificarlo
    const payment = await mercadoPagoService.getPayment(paymentId);

    console.log(`[MercadoPago Webhook] payment ${paymentId} status: ${payment.status}, external_reference: ${payment.external_reference}`);

    if (payment.status !== 'approved' && payment.status !== 'authorized') {
      return NextResponse.json({ received: true, status: 'not_approved' });
    }

    const externalReference = payment.external_reference;
    if (!externalReference) {
      console.warn('[MercadoPago Webhook] No external_reference found');
      return NextResponse.json({ received: true, status: 'no_reference' });
    }

    // external_reference tiene formato: userId_courseId
    const underscoreIndex = externalReference.indexOf('_');
    if (underscoreIndex === -1) {
      console.error('[MercadoPago Webhook] Invalid external_reference format:', externalReference);
      return NextResponse.json({ error: 'Invalid external_reference' }, { status: 400 });
    }

    const userId = externalReference.slice(0, underscoreIndex);
    const courseId = externalReference.slice(underscoreIndex + 1);

    await processPaymentUseCase.execute(userId, courseId);
    console.log(`[MercadoPago Webhook] Suscripción creada: userId=${userId}, courseId=${courseId}`);

    return NextResponse.json({ received: true, status: 'processed' });
  } catch (error) {
    console.error('Error processing Mercado Pago webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
