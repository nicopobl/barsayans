import { MercadoPagoConfig, Preference } from 'mercadopago';
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

    // Mercado Pago espera el precio como número decimal
    // Si el precio viene en centavos (como en Stripe), dividir por 100
    // Si ya viene en formato decimal, usar directamente
    const priceInCLP = price >= 1000 ? price / 100 : price;

    const preferenceData = {
      items: [
        {
          title: courseTitle || `Curso ${courseId}`,
          description: `Acceso completo al curso ${courseTitle || courseId}`,
          quantity: 1,
          unit_price: priceInCLP,
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
  constructEvent(payload: string | Buffer, signature: string): any {
    const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('MERCADOPAGO_WEBHOOK_SECRET environment variable is not set');
    }

    // Mercado Pago envía la firma en formato: ts=timestamp,v1=hash
    // Necesitamos extraer el hash y verificar
    try {
      // Parsear la firma
      const signatureParts = signature.split(',');
      const signatureHash = signatureParts.find((part) => part.startsWith('v1='))?.split('=')[1];
      
      if (!signatureHash) {
        throw new Error('Invalid signature format');
      }

      // Crear el hash esperado
      const payloadString = typeof payload === 'string' ? payload : payload.toString();
      const expectedHash = crypto
        .createHmac('sha256', webhookSecret)
        .update(payloadString)
        .digest('hex');

      // Comparar hashes
      if (signatureHash !== expectedHash) {
        throw new Error('Invalid signature');
      }

      // Si la firma es válida, parsear el payload
      return JSON.parse(payloadString);
    } catch (error) {
      console.error('Error verifying Mercado Pago webhook signature:', error);
      throw error;
    }
  }
}
