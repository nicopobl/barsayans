import { AccessService } from '../domain/access.service';
import { SubscriptionRepository } from '@/modules/subscriptions/domain/subscription.repository';

/**
 * Implementation of AccessService using subscription repository
 * Checks if a user has an active subscription for a course
 * Works with any SubscriptionRepository implementation (DynamoDB, Firestore, etc.)
 */
export class DynamoDBAccessService implements AccessService {
  constructor(private subscriptionRepository: SubscriptionRepository) {}

  async hasAccess(courseId: string, userId?: string): Promise<boolean> {
    if (!userId) {
      return false;
    }

    const subscription = await this.subscriptionRepository.findByUserAndCourse(
      userId,
      courseId
    );

    return subscription?.status === 'ACTIVE';
  }
}
