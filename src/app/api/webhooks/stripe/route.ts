import { NextRequest, NextResponse } from 'next/server';
import { StripeServiceImpl } from '@/modules/subscriptions/infrastructure/stripe.service';
import { ProcessPaymentUseCase } from '@/modules/subscriptions/application/process-payment.use-case';
import { DynamoDBSubscriptionRepository } from '@/modules/subscriptions/infrastructure/dynamodb-subscription.repository';

// Deshabilitar el body parser para poder obtener el rawBody
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Obtener el raw body para verificar la firma de Stripe
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Inicializar servicios
    const stripeService = new StripeServiceImpl();
    const subscriptionRepository = new DynamoDBSubscriptionRepository();
    const processPaymentUseCase = new ProcessPaymentUseCase(
      subscriptionRepository
    );

    // Verificar y construir el evento de Stripe
    let event;
    try {
      event = stripeService.constructEvent(body, signature);
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Procesar el evento checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const userId = session.metadata?.userId;
      const courseId = session.metadata?.courseId;

      if (!userId || !courseId) {
        console.error('Missing userId or courseId in session metadata');
        return NextResponse.json(
          { error: 'Missing required metadata' },
          { status: 400 }
        );
      }

      // Procesar el pago y crear la suscripción
      await processPaymentUseCase.execute(userId, courseId);

      return NextResponse.json({ received: true });
    }

    // Otros tipos de eventos pueden ser manejados aquí
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
