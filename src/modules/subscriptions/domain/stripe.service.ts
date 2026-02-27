export interface StripeService {
  createCheckoutSession(userId: string, courseId: string, price: number, courseTitle?: string): Promise<string>;
  constructEvent(payload: string | Buffer, signature: string): any;
}
