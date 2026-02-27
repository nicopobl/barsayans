import { SubscriptionRepository } from '../domain/subscription.repository';
import { Subscription } from '../domain/subscription.entity';

export class ProcessPaymentUseCase {
  constructor(private subscriptionRepository: SubscriptionRepository) {}

  async execute(userId: string, courseId: string): Promise<void> {
    const now = new Date().toISOString();

    const subscription: Subscription = {
      userId,
      courseId,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    };

    await this.subscriptionRepository.create(subscription);
  }
}
