import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { PaymentService } from '../domain/payment.service';
import crypto from 'crypto';

/**
 * Implementación del servicio de pagos usando Mercado Pago
 * Utiliza Preferences (equivalente a Checkout Sessions)
 * 
 * Este es el proveedor de pagos principal para la aplicación
 * ya que Stripe no está disponible en Chile.
 */
export class MercadoPagoServiceImpl implements PaymentService {
  private client: MercadoPagoConfig;
  private preference: Preference;
  private payment: Payment;

  constructor() {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN environment variable is not set');
    }

    this.client = new MercadoPagoConfig({
      accessToken,
      options: {
        timeout: 5000,
      },
    });

    this.preference = new Preference(this.client);
    this.payment = new Payment(this.client);
  }

  async getPayment(paymentId: string) {
    return this.payment.get({ id: paymentId });
  }

  /**
   * Crea una Preference en Mercado Pago (equivalente a Checkout Session)
   * @param userId ID del usuario
   * @param courseId ID del curso
   * @param price Precio en pesos chilenos (CLP)
   * @param courseTitle Título del curso (opcional)
   * @returns URL de checkout para redirigir al usuario
   */
  async createCheckoutSession(
    userId: string,
    courseId: string,
    price: number,
    courseTitle?: string
  ): Promise<string> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const notificationUrl = `${baseUrl}/api/webhooks/mercadopago`;

    // Log para verificar la configuración del webhook
    console.log(`[MercadoPago] Webhook configurado en: ${notificationUrl}`);
    console.log(`[MercadoPago] Base URL: ${baseUrl}`);

    const preferenceData = {
      items: [
        {
          id: courseId,
          title: courseTitle || `Curso ${courseId}`,
          description: `Acceso completo al curso ${courseTitle || courseId}`,
          quantity: 1,
          unit_price: price,
          currency_id: 'CLP',
        },
      ],
      back_urls: {
        success: `${baseUrl}/courses/${courseId}?payment=success`,
        failure: `${baseUrl}/courses/${courseId}?payment=failure`,
        pending: `${baseUrl}/courses/${courseId}?payment=pending`,
      },
      auto_return: 'approved' as const,
      // Usar external_reference para pasar userId y courseId al webhook
      // Formato: userId_courseId
      external_reference: `${userId}_${courseId}`,
      metadata: {
        userId,
        courseId,
      },
      notification_url: notificationUrl,
      statement_descriptor: 'Barsayans Academy',
    };

    try {
      const preference = await this.preference.create({ body: preferenceData });
      
      if (!preference.init_point) {
        throw new Error('Failed to create preference: no init_point returned');
      }

      console.log(`[MercadoPago] Preference creada exitosamente: ${preference.id}`);
      return preference.init_point;
    } catch (error) {
      console.error('Error creating Mercado Pago preference:', error);
      throw new Error(`Failed to create Mercado Pago preference: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Verifica y construye un evento de webhook desde el payload y la firma
   * Mercado Pago usa x-signature y x-request-id para verificación
   * @param payload Payload del webhook (raw body)
   * @param signature Firma del webhook (x-signature header)
   * @returns Evento verificado de Mercado Pago
   */
  constructEvent(payload: string | Buffer, signature: string, requestId?: string, dataId?: string): any {
    const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('MERCADOPAGO_WEBHOOK_SECRET environment variable is not set');
    }

    // MercadoPago firma un "manifest" compuesto por id, request-id y ts
    // NO firma el body. Formato x-signature: ts=<timestamp>,v1=<hash>
    try {
      const signatureParts = signature.split(',');
      const ts = signatureParts.find((p) => p.startsWith('ts='))?.split('=')[1];
      const signatureHash = signatureParts.find((p) => p.startsWith('v1='))?.split('=')[1];

      if (!ts || !signatureHash) {
        throw new Error('Invalid signature format');
      }

      // Construir el manifest según la documentación de MercadoPago:
      // "id:<data.id>;request-id:<x-request-id>;ts:<ts>;"
      const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;

      const expectedHash = crypto
        .createHmac('sha256', webhookSecret)
        .update(manifest)
        .digest('hex');

      console.log('[MercadoPago Webhook Debug]', {
        ts,
        dataId,
        requestId,
        manifest,
        receivedHash: signatureHash,
        expectedHash,
        secretPreview: webhookSecret.slice(0, 8) + '...',
      });

      if (signatureHash !== expectedHash) {
        throw new Error('Invalid signature');
      }

      const payloadString = typeof payload === 'string' ? payload : payload.toString();
      return JSON.parse(payloadString);
    } catch (error) {
      console.error('Error verifying Mercado Pago webhook signature:', error);
      throw error;
    }
  }
}
