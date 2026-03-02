/**
 * Interfaz genérica para servicios de pago
 * Permite intercambiar entre diferentes proveedores (Mercado Pago, etc.)
 * 
 * @deprecated Stripe ya no está disponible en Chile, se usa Mercado Pago
 */
export interface PaymentService {
  /**
   * Crea una sesión de checkout (o Preference en Mercado Pago)
   * @param userId ID del usuario
   * @param courseId ID del curso
   * @param price Precio en centavos/unidad mínima de la moneda
   * @param courseTitle Título del curso (opcional)
   * @returns URL de checkout para redirigir al usuario
   */
  createCheckoutSession(
    userId: string,
    courseId: string,
    price: number,
    courseTitle?: string
  ): Promise<string>;

  /**
   * Verifica y construye un evento de webhook desde el payload y la firma
   * @param payload Payload del webhook (raw body)
   * @param signature Firma del webhook para verificación
   * @returns Evento verificado del proveedor de pagos
   */
  constructEvent(payload: string | Buffer, signature: string): any;
}
