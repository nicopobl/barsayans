/**
 * @deprecated Esta interfaz está deprecada.
 * Stripe no está disponible en Chile, por lo que la aplicación ahora usa Mercado Pago.
 * 
 * Usa PaymentService en su lugar, que es la interfaz genérica para servicios de pago.
 */
export interface StripeService {
  createCheckoutSession(userId: string, courseId: string, price: number, courseTitle?: string): Promise<string>;
  constructEvent(payload: string | Buffer, signature: string): any;
}
