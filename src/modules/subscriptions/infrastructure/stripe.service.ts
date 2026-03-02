import Stripe from 'stripe';
import { StripeService as IStripeService } from '../domain/stripe.service';

/**
 * @deprecated Este servicio está deprecado.
 * Stripe no está disponible en Chile, por lo que la aplicación ahora usa Mercado Pago.
 * 
 * Este código se mantiene para referencia histórica pero no debe ser usado en producción.
 * Usa MercadoPagoServiceImpl en su lugar.
 */
export class StripeServiceImpl implements IStripeService {
  private stripe: Stripe;

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2024-12-18.acacia',
    });
  }

  async createCheckoutSession(
    userId: string,
    courseId: string,
    price: number,
    courseTitle?: string
  ): Promise<string> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'clp',
            product_data: {
              name: courseTitle || `Curso ${courseId}`,
              description: `Acceso completo al curso ${courseTitle || courseId}`,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/courses/${courseId}?payment=success`,
      cancel_url: `${baseUrl}/courses/${courseId}?payment=cancelled`,
      metadata: {
        userId,
        courseId,
      },
      customer_email: undefined, // Se puede agregar si tienes el email del usuario
    });

    return session.url || '';
  }

  constructEvent(payload: string | Buffer, signature: string): Stripe.Event {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET environment variable is not set');
    }

    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }
}
