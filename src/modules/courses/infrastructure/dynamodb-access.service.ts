import { AccessService } from '../domain/access.service';
import { SubscriptionRepository } from '@/modules/subscriptions/domain/subscription.repository';

/**
 * Implementation of AccessService using DynamoDB
 * Checks if a user has an active subscription for a course
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
